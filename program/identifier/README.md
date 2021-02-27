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

### Data structures

Identifier structure
```rust
pub struct DidDocument {
    /// context refers to the url of the w3c spec
    context: [u8; 32],
    /// id refers to the id of the did document
    id: [u8; 32],
    /// aka is used for vanity names for associated public keys
    aka: [u8; 32],
    /// authentication is a list of public keys associated with a did document
    authentication: [Pubkey; MAX_AUTH],
    /// services represent ways to get data about the did subject
    services: [Service; MAX_SERVICES],
}
```

Service structure
```rust
pub struct Service {
    /// id represent the id of the service
    id: [u8; 32],
    /// service type represents the types of service e.g AMM_Licence or Bridge_Licence
    service_type: [u8; 32],
    /// service_key is the account where the service data is stored
    service_key: Pubkey,
}
```
