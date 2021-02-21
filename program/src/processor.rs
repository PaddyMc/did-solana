//! Program instruction processor
use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    log::sol_log,
    msg,
    program_error::ProgramError,
    program_pack::{Pack, Sealed},
    pubkey::Pubkey,
};
use std::convert::TryInto;

/// max amount of authentications that can be added
/// to a did document
pub const MAX_AUTH: usize = 10;

///
/// Processor
///

/// Instruction processor
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Program started:");
    let instruction = DidInstruction::unpack(instruction_data)?;
    match instruction {
        DidInstruction::CreateDid {
            context,
            id,
            aka,
            services,
        } => create_did(program_id, accounts, context, id, aka, services),
        DidInstruction::AddAuthentication {} => add_authentication(program_id, accounts),
        DidInstruction::AddService {} => Ok(()),
    }
}

/// Create a did document
pub fn create_did(
    _: &Pubkey,
    accounts: &[AccountInfo],
    context: [u8; 32],
    id: [u8; 32],
    aka: [u8; 32],
    services: u8,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let account = next_account_info(account_info_iter)?;
    let did_info = next_account_info(account_info_iter)?;
    msg!("Creating: Did");
    let mut did = DidDocument::unpack_unchecked(&did_info.data.borrow())?;
    did.context = context;
    did.id = id;
    did.aka = aka;
    did.authentication[0] = *account.key;
    did.services = services;

    msg!("Updating account data");
    DidDocument::pack(did, &mut did_info.data.borrow_mut())?;

    msg!("Created: Did");

    Ok(())
}

/// Add a new public key to a did document
pub fn add_authentication(_: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let _ = next_account_info(account_info_iter)?;
    let did_info = next_account_info(account_info_iter)?;
    let new_auth_account = next_account_info(account_info_iter)?;
    msg!("Adding: Pubkey");
    let mut did = DidDocument::unpack_unchecked(&did_info.data.borrow())?;
    msg!(std::str::from_utf8(&did.context).unwrap());
    msg!(std::str::from_utf8(&did.id).unwrap());
    msg!(std::str::from_utf8(&did.aka).unwrap());

    did.authentication[1] = *new_auth_account.key;

    msg!("Updating account data");
    DidDocument::pack(did, &mut did_info.data.borrow_mut())?;

    msg!("Added: Pubkey");

    Ok(())
}

///
/// Instructions
///

/// Instructions supported by the token swap program.
#[repr(C)]
#[derive(Debug, PartialEq)]
pub enum DidInstruction {
    /// Initilaizes a new Did
    CreateDid {
        /// context refers to the url of the w3c spec
        context: [u8; 32],
        /// id refers to the id of the did document
        id: [u8; 32],
        /// aka is used for vanity names for associated public keys
        aka: [u8; 32],
        /// authentication is a list of public keys associated with a did document
        //authentication: Pubkey,
        /// services represent ways to get data about the did subject
        services: u8,
    },
    /// Adds a public key to a did document
    AddAuthentication {},
    /// Adds a service to a did document
    AddService {},
}

impl DidInstruction {
    /// Unpacks a byte buffer into a [DidInstruction](enum.DidInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        use ProgramError::InvalidArgument;
        let (tag, rest) = input.split_first().ok_or(InvalidArgument)?;
        Ok(match &tag {
            0 => {
                sol_log("Decoding CreateDid instruction_data");
                let (context, _rest) = rest.split_at(32);
                let (id, _rest) = _rest.split_at(32);
                let (aka, _rest) = _rest.split_at(32);

                //let (&authentication, _rest) = _rest.split_first().ok_or(InvalidArgument)?;
                let (&services, _rest) = _rest.split_first().ok_or(InvalidArgument)?;
                let context = cast_slice_as_array(context);
                let id = cast_slice_as_array(id);
                let aka = cast_slice_as_array(aka);
                Self::CreateDid {
                    context,
                    id,
                    aka,
                    services,
                }
            }
            1 => Self::AddAuthentication {},
            2 => Self::AddService {},
            _ => return Err(ProgramError::InvalidArgument.into()),
        })
    }
}

///
/// State
///

/// The did repository should store all data
/// related to a did document.
///
/// Spec: https://w3c.github.io/did-core/
/// {
///  "@context": "https://www.w3.org/ns/did/v1",
///  "id": "did:sol:123456789abcdefghi",
///  "aka": "JonBonJovi",
///  "authentication": [{
///    "id": "did:sol:123456789abcdefghi#keys-1",
///    "type": "Ed25519VerificationKey2020",
///    "controller": "did:sol:123456789abcdefghi",
///    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
///  }],
///  "service": [{
///   "id":"did:sol:123#linked-data",
///   "type": "LinkedData",
///   "service": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
///   }],
/// }

/// DidDocument data.
#[repr(C)]
#[derive(Clone, Copy, Debug, Default, PartialEq)]
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
    services: u8,
}
impl Sealed for DidDocument {}
impl Pack for DidDocument {
    const LEN: usize = 418;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 417];
        let (context, id, aka, authentication_flat, services) =
            array_refs![src, 32, 32, 32, 32 * MAX_AUTH, 1];
        let context = cast_slice_as_array(context);
        let id = cast_slice_as_array(id);
        let aka = cast_slice_as_array(aka);
        let authentication = [Pubkey::new_from_array([0u8; 32]); MAX_AUTH];
        let services = services[0];
        let mut result = DidDocument {
            context,
            id,
            aka,
            authentication,
            services,
        };

        for (src, dst) in authentication_flat
            .chunks(32)
            .zip(result.authentication.iter_mut())
        {
            *dst = Pubkey::new(src);
        }

        Ok(result)
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, 417];
        let (context_dst, id_dst, aka_dst, authentication_flat, services_dst) =
            mut_array_refs![dst, 32, 32, 32, 32 * MAX_AUTH, 1];
        let &DidDocument {
            context,
            id,
            aka,
            authentication,
            services,
        } = self;
        sol_log("Packing did document into account_data");
        *context_dst = context;
        *id_dst = id;
        *aka_dst = aka;
        for (i, src) in self.authentication.iter().enumerate() {
            let dst_array = array_mut_ref![authentication_flat, 32 * i, 32];
            dst_array.copy_from_slice(src.as_ref());
        }

        services_dst[0] = services;
    }
}

///
/// Utils
///

fn cast_slice_as_array(input: &[u8]) -> [u8; 32] {
    input.try_into().expect("slice with incorrect length")
}
