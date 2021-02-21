const solana_web3 = require("@solana/web3.js");
const lo = require("buffer-layout");

const addAuthentication = async (
  connection,
  programId,
  ownerAccount,
  dataAccount
) => {
//  const account = new solana_web3.Account();
//  await connection.requestAirdrop(account.publicKey, lamports);
//
//  const dataLayout = lo.struct([lo.u8("instruction")]);
//  dataLayout.encode(
//    {
//      instruction: 1, // InitializeAddAuthenticatioin instruction
//    },
//    data
//  );
//
//  const instruction = new solana_web3.TransactionInstruction({
//    keys: [
//      {
//        pubkey: ownerAccount.publicKey,
//        isSigner: true,
//        isWritable: false,
//      },
//      {
//        pubkey: dataAccount.publicKey,
//        isSigner: false,
//        isWritable: true,
//      },
//      {
//        pubkey: account.publicKey,
//        isSigner: false,
//        isWritable: true,
//      },
//    ],
//    programId: programId,
//    data: data,
//  });
//
//  transaction.add(instruction);
//
//  const result = await solana_web3.sendAndConfirmTransaction(
//    connection,
//    transaction,
//    [ownerAccount, dataAccount, account],
//    {
//      confirmations: 1,
//      skipPreflight: true,
//    }
//  );
};

module.exports = {
  addAuthentication,
};
