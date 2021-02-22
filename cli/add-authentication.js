const solana_web3 = require("@solana/web3.js");
const lo = require("buffer-layout");

const addAuthentication = async (
  connection,
  programId,
  ownerAccount,
  dataAccount
) => {
  const lamports = 10 * 1000000000;
  const account = new solana_web3.Account();
  await connection.requestAirdrop(account.publicKey, lamports);

//  console.log("Owner PubKey:", ownerAccount.publicKey.toString());
//  console.log("Data PubKey:", dataAccount.publicKey.toString());
//  console.log("New PubKey:", account.publicKey.toString());
  const numBytes = 1;
  const data = Buffer.alloc(numBytes);
  const dataLayout = lo.struct([lo.u8("instruction")]);
  dataLayout.encode(
    {
      instruction: 1, // InitializeAddAuthenticatioin instruction
    },
    data
  );
  const transaction = new solana_web3.Transaction();

  const instruction = new solana_web3.TransactionInstruction({
    keys: [
      {
        pubkey: ownerAccount.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: dataAccount.publicKey,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: account.publicKey,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: programId,
    data: data,
  });

  transaction.add(instruction);

  const result = await solana_web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [ownerAccount],
    {
      confirmations: 1,
      skipPreflight: true,
    }
  );
};

const decodePubkeys = (buf) => {
  const dataLayout = lo.struct([
    lo.blob(32, "pubkey1"),
    lo.blob(32, "pubkey2"),
    lo.blob(32, "pubkey3"),
    lo.blob(32, "pubkey4"),
    lo.blob(32, "pubkey5"),
    lo.blob(32, "pubkey6"),
    lo.blob(32, "pubkey7"),
    lo.blob(32, "pubkey8"),
    lo.blob(32, "pubkey9"),
    lo.blob(32, "pubkey10"),
  ]);
  let data = dataLayout.decode(buf);
  console.log(data);
  //console.log(Base58.decode(data.pubkey));
};

module.exports = {
  addAuthentication,
  decodePubkeys,
};
