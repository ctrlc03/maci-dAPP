import { ethers, BigNumber } from 'ethers'
import { PubKey, PCommand, PrivKey, Keypair } from 'maci-domainobjs'
import { genRandomSalt } from 'maci-crypto'
import { toast } from 'react-toastify'

import PollAbi from '../abi/Poll.json'
import MaciAbi from '../abi/MACI.json'

const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
const signer = provider.getSigner()

const maciABI = MaciAbi.abi 
const pollABI = PollAbi.abi 

// default data for free for all gatekeeper and constant voice credit proxy 
const DEFAULT_SG_DATA = '0x0000000000000000000000000000000000000000000000000000000000000000'
const DEFAULT_IVCP_DATA = '0x0000000000000000000000000000000000000000000000000000000000000000'

const maciContract = new ethers.Contract(
    process.env.REACT_APP_MACI,
    maciABI,
    signer 
)

const pollContract = new ethers.Contract(
    process.env.REACT_APP_POLL,
    pollABI,
    signer
)

export const signup = async (publicKey) => {
    // unserialize pk 
    const userMaciPubKey = PubKey.unserialize(publicKey)

    console.log(
        userMaciPubKey.asContractParam(),
        DEFAULT_SG_DATA,
        DEFAULT_IVCP_DATA,
    )

    const tx = await maciContract.signUp(
        userMaciPubKey.asContractParam(),
        DEFAULT_SG_DATA,
        DEFAULT_IVCP_DATA,
    )

    const receipt = await tx.wait()

    const iface = maciContract.interface
    // get state index from the event
    if (receipt && receipt.logs) {
        const stateIndex = iface.parseLog(receipt.logs[0]).args[0]
        toast.success(`Your state index is ${stateIndex.toString()}`)
    } else {
        toast.warning('Error with signin up, try again')
    }
}

export const voteMACI = async (option, stateIndex, weight, nonce, publicKey, privateKey) => {
    console.log('Tx inputs', option, stateIndex, weight, nonce, publicKey, privateKey)
    try {
         // validate keys 
        if (!PubKey.isValidSerializedPubKey(publicKey)) {
            toast.warning('Error: Invalid MACI Public key')
            return 
        }

        if (!PrivKey.isValidSerializedPrivKey(privateKey)) {
            toast.warning('Error: Invalid MACI private key')
            return 
        }

        // format the keys back to objects
        const userMaciPubKey = PubKey.unserialize(publicKey)
        const userMaciPrivkey = PrivKey.unserialize(privateKey)

        // get the poll Id from the contract -> nextPollId - 1
        const pollIdContract = await maciContract.nextPollId()
        if (pollIdContract.eq(BigNumber.from(0))) {
            toast.warning('There is no Poll currently live, ask the coordinator for instructions')
            return 
        }
        const pollId = pollIdContract.sub(BigNumber.from(1))

        const maxValues = await pollContract.maxValues()
        const coordinatorPubKeyResult = await pollContract.coordinatorPubKey()
        const maxVoteOptions = Number(maxValues.maxVoteOptions)

        // Validate the vote option index against the max leaf index on-chain
        if (maxVoteOptions < Number(option)) {
            toast.warning('The option index is invalid')
            return 
        }

        const coordinatorPubKey = new PubKey([
            BigInt(coordinatorPubKeyResult.x.toString()),
            BigInt(coordinatorPubKeyResult.y.toString()),
        ])

        const encKeypair = new Keypair()
        const generatedSalt = genRandomSalt()

        const command = new PCommand(
            BigInt(stateIndex),
            userMaciPubKey,
            BigInt(option),
            BigInt(weight),
            BigInt(nonce),
            BigInt(pollId.toNumber()),
            generatedSalt,
        )

        const signature = command.sign(userMaciPrivkey)
        const message = command.encrypt(
            signature,
            Keypair.genEcdhSharedKey(
                encKeypair.privKey,
                coordinatorPubKey,
            )
        )

        const tx = await pollContract.publishMessage(
            message.asContractParam(),
            encKeypair.pubKey.asContractParam(),
            {
                gasLimit: 5000000
            }
        )

        const receipt = await tx.wait()

        if (receipt.status === 1) {
            toast.success('Successfully voted')
            toast.success(`Ephemeral private key: ${encKeypair.privKey.serialize()}`)
        } else {
            toast.warning('Could not vote, sorry')
        }
    } catch (err) {
        console.log(err)
        toast.warning('There was an error, sorry')
    }  
}
