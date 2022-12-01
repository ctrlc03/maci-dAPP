# MACI Christmas Voting 

A simple dAPP built using MACI (Minimal Anti Collusion Infrastructure) - use it to vote on your christmas movie selection with your team.

After all, don't we all deserve a little bit of privacy, and fun?

## Instructions

1. Clone the MACI repository on branch v1

`git clone https://github.com/privacy-scaling-explorations/maci.git -b v1`

2. Setup up the repo 

`npm install && npm run bootstrap && npm run build`

Make sure you install the additional required tools (you can find them on the `README.md` file)

3. Setup hardhat

Within the `contracts` package, edit the `hardhat.config.js` file:

```javascript
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-ethers')
require('dotenv').config()

const {
  DEFAULT_ETH_SK,
  DEFAULT_ETH_PROVIDER,
} = require('./build/defaults')

const config = {
  defaultNetwork: 'arbitrum_goerli',
  networks: {
    localhost: {
      url: process.env.ETH_PROVIDER || DEFAULT_ETH_PROVIDER,
      accounts: [ process.env.ETH_SK || DEFAULT_ETH_SK ],
      loggingEnabled: false,
    },
    arbitrum_goerli: {
      url: String(process.env.ETH_PROVIDER_ARB),
      accounts: [ String(process.env.ETH_SK_ARB) ],
      loggingEnabled: true,
    }
  },
  paths: {
    sources: "../contracts/contracts/",
    artifacts: "../contracts/artifacts"
  }
};

module.exports = config;
```

In this example we setup `arbitrum_goerli` as network. Additionally, crate an `.env` file with the following (amend names are required to fit the hardhat config file):

```bash
ETH_SK_ARB=
ETH_PROVIDER_ARB=
```

3. Create or download the proving keys (Coordinator)

You can download the zkeys from here:

`https://github.com/privacy-scaling-explorations/maci/wiki/Download-Precompiled-Circuit-and-Zkeys`

Or generate your own using `zkey-manager` by running the following inside the `cli` package:

`npx zkey-manager genZkeys -c ./zkeys.config.yml`

4. Generate coordinator's key pair (Coordinator)

Run `node build/index.js genMaciKeypair` inside the `cli` package and take note of those. They will be required to create a poll (the public key) and the private key to decrypt the messages and generate the tally/proofs

4. Deploy and configure the required contracts (Coordinator)

For a detailed explaination of what the cli flags mean, please refer to this [guide](https://privacy-scaling-explorations.github.io/maci/cli.html)

* `node build/index.js deployVkRegistry` - To deploy the VkRegistry contract
* `node build/index.js setVerifyingKeys -s 10 -i 1 -m 2 -v 2 -b 1 -p ./zkeys/ProcessMessages_10-2-1-2_test.0.zkey -t ./zkeys/TallyVotes_10-1-2_test.0.zkey` - To set the verifying keys on the VkRegistry smart contract
* `node build/index.js create` - To deploy the rest of the contracts such as the Poseidon hasher implementations and MACI. Please note that this will deploy a version of MACI that allows anyone to signup and that assigns a constant voice credit balance (100 VC). Should you wish to gatekeep signups, a signup gatekeeper such as `SignUpTokenGatekeerp` and corresponding `SignUpToken` should be deployed instead. 
* `node build/index.js deployPoll -p $COORDINATOR_MACI_PUB_KEY -t 360 -g 25 -mv 25 -i 1 -m 2 -b 1 -v 2` - This deploys a new Poll with a duration of 1 hour

If you did not take notes of the deployed contract addresses, you can find them inside the file `cli/contractAddress.txt`.

5. Setup and run the API (Coordinator)

The example API is a simple REST API that uses express and talks to a `mariadb` database. Create a database with the name of your choosing and the following table:

```sql
CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    url TEXT,
    imageUrl TEXT
);
```

Now you can set the `.env` file with the database name, and the connection details for `mariadb`. 

```bash
# Server
PORT=8000
# DB
DB_ADDRESS=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
```

Finally, run the API using `yarn start`

6. Setup and run the frontend (Coordinator)

**Note** You will need to move the `maci-domainobjs` and `maci-crypto` packages from the MACI repo to the `node_modules` directory (you can find them under the `cli` package).

Now that we deployed everything and have the contracts addresses (in particular MACI and the deployed Poll), we can setup the frontend.

Crate an `.env` file from the `.env-template` file provided inside the `frontend` folder and fill with the MACI and Poll contract addresses. 

```bash
REACT_APP_MACI=$MACI_CONTRACT_ADDRESS
REACT_APP_POLL=$MACI_POLL_ADDRESS
REACT_APP_API_URL=$API_URL
```

To run the frontend first install the dependencies and then run:

```bash
yarn install 
yarn start
```

The frontend will bind to all intefaces (`0.0.0.0`)

7. Use the frontend (Anyone)

The app requires an user to be connected with their wallet on the arbitrum testnet (feel free to change this). 

You will be able to fill a form to add a movie choice, generate a MACI key pair (which you should make note of as it is needed to send a message), signup to MACI, and vote.

8. Merge the merkle trees (Coordinator)

Once the poll has finished, the coordinator should merge the trees with the following cli commands:

```bash
node build/index.js mergeSignups --poll-id $POLL_ID 
node build/index.js mergeMessages --poll-id $POLL_ID
```

9. Generate the proofs (Coordinator)

For faster generation, you can input the transaction hash of the MACI's contract deployment.

Here you will need the coordinator's private key.

```bash
node build/index.js genProofs 
    -sk $COORDINATOR_MACI_PRIVATE_KEY \
    -o $POLL_ID \
    -t tally.json \
    -f proofs.json \
    -r ~/rapidsnark/build/prover \
    -wp ./zkeys/ProcessMessages_10-2-1-2_test \
    -wt ./zkeys/TallyVotes_10-1-2_test \
    -zp ./zkeys/ProcessMessages_10-2-1-2_test.0.zkey \
    -zt ./zkeys/TallyVotes_10-1-2_test.0.zkey \
```

10. Prove on chain (Coordinator)

To verify the proof on chain, please run the following:

```bash
node build/index.js proveOnChain \
    -o $POLL_ID \
    -q $POLL_PROCESSOR_AND_TALLYER_CONTRACT_ADDRESS \
    -f $PROOFS_DIRECTORY
```

11. Verify the tally (Anyone)

You can use the cli to verify the tally on-chain

```bash
node build/index.js verify \
    --contract $MACI_CONTRACT \
    --poll-id $POLL_ID \
    --tally-file $TALLY_FILE_PATH \
    --ppt $POLL_PROCESSOR_AND_TALLYER_CONTRACT_ADDRESS
```

