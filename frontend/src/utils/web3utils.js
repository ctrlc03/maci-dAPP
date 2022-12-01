import { ethers } from 'ethers'
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
    console.log(publicKey)
    const userMaciPubKey = PubKey.unserialize(publicKey)

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
        console.log('State index:', stateIndex.toString())
        toast.success(`Your state index is ${stateIndex.toString()}`)
    } else {
        toast.warning('Error with signin up, try again')
    }
}

export const voteMACI = async (option, stateIndex, weight, nonce, publicKey, privateKey, salt) => {
    console.log('Tx inputs', option, stateIndex, weight, nonce, publicKey, privateKey, salt)

    // validate keys 

    // User's MACI public key
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

    const coordinatorPubKey = PubKey.unserialize(String(process.env.REACT_APP_COORDINATOR_PUBLIC_KEY))

    const encKeypair = new Keypair()

    // get the poll id from the maci contract
    // it will be the next poll id - 1
    const pollId = (await maciContract.nextPollId()).sub(1)

    const generatedSalt = genRandomSalt()

    const command = new PCommand(
        BigInt(stateIndex),
        userMaciPubKey,
        BigInt(option),
        BigInt(weight),
        BigInt(nonce),
        pollId, // TODO dynamically get Poll ID
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
            gasLimit: 10000000
        }
    )

    const receipt = await tx.wait()

    toast.success(`Ephemeral private key: encKeypair.privKey.serialize()`)

    console.log(receipt)
}
