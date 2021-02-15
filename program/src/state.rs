//! State transition types

use crate::instruction::MAX_SIGNERS;
use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
use num_enum::TryFromPrimitive;
use solana_program::{
    program_error::ProgramError,
    program_option::COption,
    program_pack::{Pack, Sealed},
    pubkey::Pubkey,
};

/// DidDocument data.
#[repr(C)]
#[derive(Clone, Copy, Debug, Default, PartialEq)]
pub struct DidDocument {
    pub context: u8,
    pub authentication: COption<Pubkey>,
    pub services: u8,
}
impl Pack for DidDocument {
    const LEN: usize = 38;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 38];
        let (context, authentication, services) = array_refs![src, 1, 36, 1];
        let authentication = unpack_coption_key(authentication)?;
        let services = u8::from_le_bytes(*services);
        Ok(DidDocument {
            supply,
            authentication,
            services,
        })
    }
    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, 38];
        let (context_dst, authentication_dst, servicesi_dst) = array_refs![src, 1, 36, 1];
        let &DidDocument {
            context,
            ref authentication,
            services,
        } = self;
        pack_coption_key(authentication, authentication_dst);
        *context_dst = context.to_le_bytes();
        *services_dst = services.to_le_bytes();
    }
}
// Helpers
fn pack_coption_key(src: &COption<Pubkey>, dst: &mut [u8; 36]) {
    let (tag, body) = mut_array_refs![dst, 4, 32];
    match src {
        COption::Some(key) => {
            *tag = [1, 0, 0, 0];
            body.copy_from_slice(key.as_ref());
        }
        COption::None => {
            *tag = [0; 4];
        }
    }
}
fn unpack_coption_key(src: &[u8; 36]) -> Result<COption<Pubkey>, ProgramError> {
    let (tag, body) = array_refs![src, 4, 32];
    match *tag {
        [0, 0, 0, 0] => Ok(COption::None),
        [1, 0, 0, 0] => Ok(COption::Some(Pubkey::new_from_array(*body))),
        _ => Err(ProgramError::InvalidAccountData),
    }
}
