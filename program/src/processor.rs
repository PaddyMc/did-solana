//! Program instruction processor
use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    log::{sol_log, sol_log_slice},
    msg,
    program_error::ProgramError,
    program_option::COption,
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
        DidInstruction::Did { context, services } => {
            msg!("Instruction: Did");
            create_did(program_id, accounts, context, services)
        }
    }
}

/// Create a did document
pub fn create_did(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    context: u8,
    services: u8,
) -> ProgramResult {
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
    Did {
        /// context
        context: u8,
        /// services
        services: u8,
    },
}
impl DidInstruction {
    /// Unpacks a byte buffer into a [DidInstruction](enum.DidInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        use ProgramError::InvalidAccountData;

        let (tag, rest) = input.split_first().ok_or(InvalidAccountData)?;
        sol_log("fucking stupid program");
        msg!(&tag.to_string());
        msg!(std::str::from_utf8(&rest).unwrap());
        Ok(match &tag {
            0 => {
                sol_log("000000000000000");
                let context: u8 = 42;
                let services: u8 = 42;
                Self::Did { context, services }
            }
            _ => return Err(ProgramError::InvalidAccountData.into()),
        })
    }

    fn unpack_pubkey(input: &[u8]) -> Result<(Pubkey, &[u8]), ProgramError> {
        if input.len() >= 32 {
            let (key, rest) = input.split_at(32);
            let pk = Pubkey::new(key);
            Ok((pk, rest))
        } else {
            Err(ProgramError::InvalidAccountData.into())
        }
    }

    fn unpack_pubkey_option(input: &[u8]) -> Result<(COption<Pubkey>, &[u8]), ProgramError> {
        match input.split_first() {
            Option::Some((&0, rest)) => Ok((COption::None, rest)),
            Option::Some((&1, rest)) if rest.len() >= 32 => {
                let (key, rest) = rest.split_at(32);
                let pk = Pubkey::new(key);
                Ok((COption::Some(pk), rest))
            }
            _ => Err(ProgramError::InvalidAccountData),
        }
    }

    fn pack_pubkey_option(value: &COption<Pubkey>, buf: &mut Vec<u8>) {
        match *value {
            COption::Some(ref key) => {
                buf.push(1);
                buf.extend_from_slice(&key.to_bytes());
            }
            COption::None => buf.push(0),
        }
    }
}

///
/// State
///

/// DidDocument data.
#[repr(C)]
#[derive(Clone, Copy, Debug, Default, PartialEq)]
pub struct DidDocument {
    /// context
    pub context: u8,
    /// authentication
    pub authentication: COption<Pubkey>,
    /// services
    pub services: u8,
}
impl Sealed for DidDocument {}
impl Pack for DidDocument {
    const LEN: usize = 38;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 38];
        let (context, authentication, services) = array_refs![src, 1, 36, 1];
        let context = u8::from_le_bytes(*context);
        let authentication = unpack_coption_key(authentication)?;
        let services = u8::from_le_bytes(*services);
        Ok(DidDocument {
            context,
            authentication,
            services,
        })
    }
    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, 38];
        let (context_dst, authentication_dst, services_dst) = array_refs![dst, 1, 36, 1];
        let &DidDocument {
            context,
            ref authentication,
            services,
        } = self;
        //pack_coption_key(authentication_dst, authentication);
        //*context_dst = context.to_le_bytes();
        //*services_dst = services.to_le_bytes();
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

fn unpack_coption_key(src: &[u8; 36]) -> Result<COption<Pubkey>, ProgramError> {
    let (tag, body) = array_refs![src, 4, 32];
    match *tag {
        [0, 0, 0, 0] => Ok(COption::None),
        [1, 0, 0, 0] => Ok(COption::Some(Pubkey::new_from_array(*body))),
        _ => Err(ProgramError::InvalidAccountData),
    }
}
