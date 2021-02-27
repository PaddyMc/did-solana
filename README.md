### did-solana

### What it's all about

Decentralized identifiers (DIDs) are a new type of identifier that enables verifiable, decentralized digital identity. A DID identifies any subject (e.g., a person, organization, thing, data model, abstract entity, etc.) that the controller of the DID decides that it identifies.

[more info](https://w3c.github.io/did-core/)

Decentralized identifiers can be composed in every way imaginable and they will be "first-class citizens" of every chain in the next few years. Features such as vanity names for users, multi-user ownership, on-chain role-based abstractions, login challenges to web interfaces, group message encryption and many many more are unlocked through the use of decentralized identifiers.

### Why DIDs are being used in this project

DID allow users to identify and licence AMMs and Bridges, this allows users of AMMs to have some certainty that the pool is created by a respectable authority and their funds will be safe. Bridge licences can allow a bridge program that is stored on-chain to identify themselves.

### How this helps Solana

Regulation is coming to crypto, DIDs and services (such as the license-service used in this project) can allow AMMs and service providers to adhere to the coming regulation by identifying and licencing different service providers in their eco-system.

### What's in this repo

#### identifier program

The identifier program contains the core logic to create decentralized identifiers on the Solana chain

#### license-service program

The license service program provides a way to attach arbitrary licences to a DID

#### frontend

The frontend is a basic UI that allows users to create DIDs, compose licences and public keys into their DIDs

### Deployment information

- Identifier Program: [FKNARQsQ3wTTadNRcUuQBx9moynv7ctWPP8ni5H4C4HR](https://explorer.solana.com/address/FKNARQsQ3wTTadNRcUuQBx9moynv7ctWPP8ni5H4C4HR?cluster=devnet)
- License Program: [DTXJtDoZ6X5eb9Ek63B5zK857FmhSYNzHnsiygxhEJJY](https://explorer.solana.com/address/DTXJtDoZ6X5eb9Ek63B5zK857FmhSYNzHnsiygxhEJJY?cluster=devnet)
- Frontend: [www.did-solana.chain-abstraction.dev](www.did-solana.chain-abstraction.dev)

### For developers to build run the programs

Please refer to the project-specific READMEs

- [Identifier Program](program/identifier/README.md)
- [License Program](program/license-service/README.md)
- [Frontend](frontend/README.md)

### Next steps concerning this project

- Testing of the programs

Due to time constraints tests were completely omitted from the programs

- Improvement of the core program functionality

Again due to time constraints, some features that would improve the core functionality of the DID programs were omitted. e.g different types of keys to be allowed in the DID Document

- Messaging feature

Allow the web-UI to encrypt data from every public key associated with  a DID

- Login to the web UI and user-controlled public keys to DID documents

Issuer a login to a user to decrypt data and allow a user to broadcast their transactions

### What is not coming next

- Web wallet interactions

Web wallets such as Metamask although innovative technology cement users into the web2.0 world by building abstractions around HTML parsers and native js environments, we need a new way to allow a user to interact with chains that don't involve browser extensions or custodial wallet.

