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
            authentication,
            services,
        } => create_did(
            program_id,
            accounts,
            context,
            id,
            aka,
            authentication,
            services,
        ),
    }
}

/// Create a did document
pub fn create_did(
    _: &Pubkey,
    accounts: &[AccountInfo],
    context: u8,
    id: u8,
    aka: u8,
    authentication: u8,
    services: u8,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let _ = next_account_info(account_info_iter)?;
    let did_info = next_account_info(account_info_iter)?;
    did_info.key.log();
    msg!("Creating: Did");
    //let mut did = DidDocument::unpack_unchecked(&did_info.data.borrow())?;

    let did = DidDocument {
        context,
        id,
        aka,
        authentication,
        services,
    };
    msg!("Updating account data");

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
        context: u8,
        /// id refers to the id of the did document
        id: u8,
        /// aka is used for vanity names for associated public keys
        aka: u8,
        /// authentication is a list of public keys associated with a did document
        authentication: u8,
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
                sol_log("Decoding instruction_data");
                msg!(std::str::from_utf8(rest).unwrap());
                let (&context, _rest) = rest.split_first().ok_or(InvalidArgument)?;
                let (&id, _rest) = _rest.split_first().ok_or(InvalidArgument)?;
                let (&aka, _rest) = _rest.split_first().ok_or(InvalidArgument)?;
                let (&authentication, _rest) = _rest.split_first().ok_or(InvalidArgument)?;
                let (&services, _rest) = _rest.split_first().ok_or(InvalidArgument)?;
                Self::CreateDid {
                    context,
                    id,
                    aka,
                    authentication,
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
    context: u8,
    /// id refers to the id of the did document
    id: u8,
    /// aka is used for vanity names for associated public keys
    aka: u8,
    /// authentication is a list of public keys associated with a did document
    authentication: u8,
    /// services represent ways to get data about the did subject
    services: u8,
}
impl Sealed for DidDocument {}
impl Pack for DidDocument {
    const LEN: usize = 5;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 5];
        //let (context, authentication, services) = array_refs![src, 1, 36, 1];
        let (context, id, aka, authentication, services) = array_refs![src, 1, 1, 1, 1, 1];
        let context = context[0];
        let id = id[0];
        let aka = aka[0];
        let authentication = authentication[0];
        let services = services[0];

        //    let authentication = unpack_coption_key(authentication)?;
        Ok(DidDocument {
            context,
            id,
            aka,
            authentication,
            services,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, 5];
        let (context_dst, id_dst, aka_dst, authentication_dst, services_dst) =
            mut_array_refs![dst, 1, 1, 1, 1, 1];
        let &DidDocument {
            context,
            id,
            aka,
            authentication,
            services,
        } = self;
        sol_log("Packing did document into account_data");
        //pack_coption_key(authentication_dst, authentication);
        context_dst[0] = context;
        id_dst[0] = id;
        aka_dst[0] = aka;
        authentication_dst[0] = authentication;
        services_dst[0] = services;
    }
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
