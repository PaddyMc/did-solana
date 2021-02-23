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

///
/// Processor
///

/// Instruction processor
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Program started: license service");
    let instruction = LicenseServiceInstruction::unpack(instruction_data)?;
    match instruction {
        LicenseServiceInstruction::CreateLicense {
            id,
            service_type,
            subject,
            issuance_date,
        } => create_license(
            program_id,
            accounts,
            id,
            service_type,
            subject,
            issuance_date,
        ),
    }
}

/// Create a did document
pub fn create_license(
    _: &Pubkey,
    accounts: &[AccountInfo],
    id: [u8; 32],
    service_type: [u8; 32],
    subject: [u8; 32],
    issuance_date: [u8; 32],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let account = next_account_info(account_info_iter)?;
    let license_info = next_account_info(account_info_iter)?;
    msg!("Creating: license");
    let mut license = LicenseService::unpack_unchecked(&license_info.data.borrow())?;
    license.id = id;
    license.service_type = service_type;
    license.subject = subject;
    license.issuer = *account.key;
    license.issuance_date = issuance_date;

    msg!("Updating account data");
    LicenseService::pack(license, &mut license_info.data.borrow_mut())?;

    msg!("Created: license");

    Ok(())
}
///
/// Instructions
///

/// Instructions supported by the token swap program.
#[repr(C)]
#[derive(Debug, PartialEq)]
pub enum LicenseServiceInstruction {
    /// Initilaizes a new license
    CreateLicense {
        /// id refers to the id of the license
        id: [u8; 32],
        /// service type defines the type of service the license is for
        service_type: [u8; 32],
        /// subject represent the data about the subject
        subject: [u8; 32],
        /// issuance_date re
        issuance_date: [u8; 32],
    },
}

impl LicenseServiceInstruction {
    /// Unpacks a byte buffer into a [DidInstruction](enum.DidInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        use ProgramError::InvalidArgument;
        let (tag, rest) = input.split_first().ok_or(InvalidArgument)?;
        Ok(match &tag {
            0 => {
                sol_log("Decoding LicenseService instruction_data");
                let (id, _rest) = rest.split_at(32);
                let (service_type, _rest) = rest.split_at(32);
                let (subject, _rest) = _rest.split_at(32);
                let (issuance_date, _rest) = _rest.split_at(32);

                let id = cast_slice_as_array(id);
                let service_type = cast_slice_as_array(service_type);
                let subject = cast_slice_as_array(subject);
                let issuance_date = cast_slice_as_array(issuance_date);
                Self::CreateLicense {
                    id,
                    service_type,
                    subject,
                    issuance_date,
                }
            }
            _ => return Err(ProgramError::InvalidArgument.into()),
        })
    }
}

///
/// State
///

/// The repository should store all data
/// related to a sevice license.
/// https://www.w3.org/TR/vc-data-model/
/// {
///  "@context": "",
///  "id": "http://example.edu/credentials/1872",
///  "type": "VerifiableCredential",,
///  "subject": "amm pub key",,
///  "issuer": "https://example.edu/issuers/565049",
///  "issuanceDate": "2010-01-01T19:73:24Z",
/// }

/// DidDocument data.
#[repr(C)]
#[derive(Clone, Copy, Debug, Default, PartialEq)]
pub struct LicenseService {
    /// id refers to the id of the license
    id: [u8; 32],
    /// service type defines the type of service the license is for
    service_type: [u8; 32],
    /// subject represent the data about the subject
    subject: [u8; 32],
    /// issuer denotes the public key of the issuer of the license
    issuer: Pubkey,
    /// issuance_date re
    issuance_date: [u8; 32],
}
impl Sealed for LicenseService {}
impl Pack for LicenseService {
    const LEN: usize = 161;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 160];
        let (id, service_type, subject, issuer, issuance_date) =
            array_refs![src, 32, 32, 32, 32, 32];
        let id = cast_slice_as_array(id);
        let service_type = cast_slice_as_array(service_type);
        let subject = cast_slice_as_array(subject);
        let issuer = Pubkey::new(issuer);
        let issuance_date = cast_slice_as_array(issuance_date);
        let license = LicenseService {
            id,
            service_type,
            subject,
            issuer,
            issuance_date,
        };

        Ok(license)
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, 160];
        let (id_dst, service_type_dst, subject_dst, issuer_dst, issuance_date_dst) =
            mut_array_refs![dst, 32, 32, 32, 32, 32];
        let &LicenseService {
            id,
            service_type,
            subject,
            issuer,
            issuance_date,
        } = self;
        *id_dst = id;
        *service_type_dst = service_type;
        *subject_dst = subject;
        *issuer_dst = cast_slice_as_array(issuer.as_ref());
        *issuance_date_dst = issuance_date;
    }
}

///
/// Utils
///

fn cast_slice_as_array(input: &[u8]) -> [u8; 32] {
    input.try_into().expect("slice with incorrect length")
}
