### license-service program

The license service program allows users to issue abartary licenses on chain 

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

License service structure

```rust
pub struct LicenseService {
    /// id refers to the id of the license
    id: [u8; 32],
    /// service type defines the type of service the license is for
    service_type: [u8; 32],
    /// subject represent the data about the subject
    subject: Pubkey,
    /// issuer denotes the public key of the issuer of the license
    issuer: Pubkey,
    /// issuance_date represents the date the license was issued
    issuance_date: [u8; 32],
}
```
