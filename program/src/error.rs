//! Error types

use num_derive::FromPrimitive;
use solana_program::{decode_error::DecodeError, program_error::ProgramError};
use thiserror::Error;

/// Errors that may be returned by the TokenDid program.
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum DidError {
    /// The account cannot be initialized because it is already being used.
    #[error("Did account already in use")]
    AlreadyInUse,
}
impl From<DidError> for ProgramError {
    fn from(e: DidError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
impl<T> DecodeError<T> for DidError {
    fn type_of() -> &'static str {
        "Did Error"
    }
}
