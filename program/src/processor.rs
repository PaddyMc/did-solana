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
        } => {
            msg!(std::str::from_utf8(&context).unwrap());
            msg!(std::str::from_utf8(&id).unwrap());
            msg!(std::str::from_utf8(&aka).unwrap());
            create_did(program_id, accounts, context, id, aka, services)
        }
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
            _ => return Err(ProgramError::InvalidArgument.into()),
        })
    }

    //    fn unpack_pubkey(input: &[u8]) -> Result<(Pubkey, &[u8]), ProgramError> {
    //        if input.len() >= 32 {
    //            let (key, rest) = input.split_at(32);
    //            let pk = Pubkey::new(key);
    //            Ok((pk, rest))
    //        } else {
    //            Err(ProgramError::InvalidAccountData.into())
    //        }
    //    }

    //    fn unpack_pubkey_option(input: &[u8]) -> Result<(COption<Pubkey>, &[u8]), ProgramError> {
    //        match input.split_first() {
    //            Option::Some((&0, rest)) => Ok((COption::None, rest)),
    //            Option::Some((&1, rest)) if rest.len() >= 32 => {
    //                let (key, rest) = rest.split_at(32);
    //                let pk = Pubkey::new(key);
    //                Ok((COption::Some(pk), rest))
    //            }
    //            _ => Err(ProgramError::InvalidAccountData),
    //        }
    //    }
    //
    //    fn pack_pubkey_option(value: &COption<Pubkey>, buf: &mut Vec<u8>) {
    //        match *value {
    //            COption::Some(ref key) => {
    //                buf.push(1);
    //                buf.extend_from_slice(&key.to_bytes());
    //            }
    //            COption::None => buf.push(0),
    //        }
    //    }
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
        //let (context, authentication, services) = array_refs![src, 1, 36, 1];
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

        //    let authentication = unpack_coption_key(authentication)?;
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

fn cast_slice_as_array(input: &[u8]) -> [u8; 32] {
    input.try_into().expect("slice with incorrect length")
}

// Helpers
//fn pack_coption_key(src: &COption<Pubkey>, dst: &mut [u8; 36]) {
//    let (tag, body) = mut_array_refs![dst, 4, 32];
//    match src {
//        COption::Some(key) => {
//            *tag = [1, 0, 0, 0];
//            body.copy_from_slice(key.as_ref());
//        }
//        COption::None => {
//            *tag = [0; 4];
//        }
//    }
//}

//fn unpack_coption_key(src: &[u8; 36]) -> Result<COption<Pubkey>, ProgramError> {
//    let (tag, body) = array_refs![src, 4, 32];
//    match *tag {
//        [0, 0, 0, 0] => Ok(COption::None),
//        [1, 0, 0, 0] => Ok(COption::Some(Pubkey::new_from_array(*body))),
//        _ => Err(ProgramError::InvalidAccountData),
//    }
//}
