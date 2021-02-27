### identifier program

The identifier represents a decentralized identifier on the Solana chain more information on decentralized identifiers can be found [here](https://w3c.github.io/did-core/)

#### Prerequisites

Please install the solana build tools, [documentation can be found here](https://docs.solana.com/cli/install-solana-cli-tools)

#### How to build

- `cargo build-bpf`

#### How to deploy

- `solana deploy <deploy path from output of above command>`

### How to run 

The cli is build in js, so we need to run the index.js file in the `cli` folder also everything is hardcoded to point at devnet.

- `cd cli`
- `node index.js <program id from output of build command>`
