import {
  Account,
  Transaction,
  Connection,
  PublicKey,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import lo from "buffer-layout";
import {values} from "ramda"

const addAuthentication = async (
  programIdString,
  ownerAccount,
  dataAccount
) => {
  let connection = new Connection("http://localhost:8899", "singleGossip");
  let programId = new PublicKey(programIdString);
  const lamports = 10 * 1000000000;
  const account = new Account();
  await connection.requestAirdrop(account.publicKey, lamports);
  ownerAccount = new Account(values(ownerAccount._keypair.secretKey))
  dataAccount = new Account(values(dataAccount._keypair.secretKey))

    console.log("Owner PubKey:", ownerAccount.publicKey.toString());
    console.log("Data PubKey:", dataAccount.publicKey.toString());
    console.log("New PubKey:", account.publicKey.toString());
  const numBytes = 1;
  const data = Buffer.alloc(numBytes);
  const dataLayout = lo.struct([lo.u8("instruction")]);
  dataLayout.encode(
    {
      instruction: 1, // InitializeAddAuthenticatioin instruction
    },
    data
  );
  const transaction = new Transaction();

  const instruction = new TransactionInstruction({
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

  const result = await sendAndConfirmTransaction(
    connection,
    transaction,
    [ownerAccount],
    {
      confirmations: 1,
      skipPreflight: true,
    }
  ).catch((error)=>{console.log(error)})

  return {
    ownerAccount: ownerAccount.publicKey.toString(),
    dataAccount: dataAccount.publicKey.toString(),
    newAccount: account.publicKey.toString(),
  };
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
  return data;
};

export { addAuthentication, decodePubkeys };
