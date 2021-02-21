import {
Account,
Transaction,
SystemProgram,
	Connection,
	sendAndConfirmTransaction,
	PublicKey,
	TransactionInstruction,
} from "@solana/web3.js";
import lo from "buffer-layout";
//const addAuthentication = require("./add-authentication");

const createDid = async (connection, programId) => {
  const lamports = 10 * 1000000000;

  const account = new Account();
  await connection.requestAirdrop(account.publicKey, lamports);

  const dataAccount = new Account();

  console.log("Payer Account:", account.publicKey.toString());
  console.log("Data Account:", dataAccount.publicKey.toString());

  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.cstr("context"),
    lo.cstr("id"),
    lo.cstr("aka"),
    lo.u8("services"),
  ]);
  const numBytes = 1 + 32 + 32 + 32 + 32 * 10 + 1;
  console.log(numBytes);
  const data = Buffer.alloc(numBytes);

  dataLayout.encode(
    {
      instruction: 0, // InitializeCreateDid instruction
      context: Buffer.from("https://w3c.github.io/did-core/"),
      id: Buffer.from(
        `did:sol:${dataAccount.publicKey.toString()}`.substring(0, 31)
      ),
      aka: Buffer.from(`Paddy`.padEnd(32).substring(0, 31)),
      services: 5,
    },
    data
  );

  const rentExemption = await connection.getMinimumBalanceForRentExemption(
    numBytes
  );

  const transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: account.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: rentExemption,
      space: numBytes,
      programId: programId,
    })
  );

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: account.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: dataAccount.publicKey,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: programId,
    data: data,
  });

  transaction.add(instruction);

  const result = await sendAndConfirmTransaction(
    connection,
    transaction,
    [account, dataAccount],
    {
      confirmations: 1,
      skipPreflight: true,
    }
  );

  await getAccountInfo(connection, dataAccount.publicKey);
  console.log("adding authentication");
  //await addAuthentication(account, dataAccount);
  //console.log("added authentication")
  //await getAccountInfo(connection, dataAccount.publicKey);
};

const getAccountInfo = async (pk) => {
   let connection = new Connection(
    "http://localhost:8899",
    "singleGossip"
  );
  pk = new PublicKey(pk);


  if (!pk) {
    console.log("pk not provided");
    process.exit(1);
  }

  let account = await connection.getAccountInfo(pk).catch(err => (console.log));

  let owner = new PublicKey(account.owner._bn);

  console.log("Inspecting pk:", pk.toString());
  console.log("Owner PubKey:", owner.toString());

  if (!account) {
    console.log("Account not found on chain");
    process.exit(1);
  }
  decodeDid(Buffer.from(account.data));
};

const decodeDid = (buf) => {
  console.log(buf);
  const dataLayout = lo.struct([
    lo.cstr("context"),
    lo.cstr("id"),
    lo.cstr("aka"),
    lo.blob(320, "authentication"),
    lo.u8("services"),
  ]);
  let data = dataLayout.decode(buf);
  console.log(data);
};

//const main = async () => {
//  
//  let programId = new PublicKey(process.argv[2]);
//
//  await createDid(connection, programId);
//};

//main();

export {
  getAccountInfo,
  decodeDid,
  createDid,
}
