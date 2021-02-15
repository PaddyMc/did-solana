//! Program instruction processor

use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    log::{sol_log_compute_units, sol_log_params, sol_log_slice},
    msg,
    pubkey::Pubkey,
};

/// Instruction processor
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Log a string
    msg!("static string");

    // Log 5 numbers as u64s in hexadecimal format
    msg!(
        instruction_data[0],
        instruction_data[1],
        instruction_data[2],
        instruction_data[3],
        instruction_data[4]
    );

    // Log a slice
    sol_log_slice(instruction_data);

    // Log a formatted message, use with caution can be expensive
    msg!("formatted {}: {:?}", "message", instruction_data);

    // Log a public key
    program_id.log();

    // Log all the program's input parameters
    sol_log_params(accounts, instruction_data);

    // Log the number of compute units remaining that the program can consume.
    sol_log_compute_units();

    Ok(())
}

//#[cfg(test)]
//mod test {
//    use super::*;
//    use solana_sdk::clock::Epoch;
//
//    #[test]
//    fn test_sanity() {
//        let program_id = Pubkey::default();
//        let key = Pubkey::default();
//        let mut lamports = 0;
//        let mut data = vec![0; mem::size_of::<u64>()];
//        LittleEndian::write_u64(&mut data, 0);
//        let owner = Pubkey::default();
//        let account = AccountInfo::new(
//            &key,
//            false,
//            true,
//            &mut lamports,
//            &mut data,
//            &owner,
//            false,
//            Epoch::default(),
//        );
//        let instruction_data: Vec<u8> = Vec::new();
//
//        let accounts = vec![account];
//
//        assert_eq!(LittleEndian::read_u64(&accounts[0].data.borrow()), 0);
//        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
//        assert_eq!(LittleEndian::read_u64(&accounts[0].data.borrow()), 1);
//        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
//        assert_eq!(LittleEndian::read_u64(&accounts[0].data.borrow()), 2);
//    }
//}
//
//// Required to support info! in tests
//#[cfg(not(target_arch = "bpf"))]
//solana_sdk::program_stubs!();
