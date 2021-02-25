import {
  Account,
  Transaction,
  TransactionInstruction,
  PublicKey,
  Connection,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import lo from "buffer-layout";
import {getAccountInfo} from "./index";
import { values } from "ramda";

const createService = async (
  programIdString,
  ownerAccount,
  serviceId,
  serviceType,
  key
) => {
  const lamports = 10 * 1000000000;

  let connection = new Connection("https://devnet.solana.com", "singleGossip");
  let programId = new PublicKey(programIdString);
  ownerAccount = new Account(values(ownerAccount._keypair.secretKey));

  const dataAccount = new Account();

  //console.log("Payer Account:", account.publicKey.toString());
  //console.log("Data Account:", dataAccount.publicKey.toString());

  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.cstr("id"),
    lo.cstr("service_type"),
    lo.cstr("subject"),
    lo.cstr("issuance_date"),
  ]);
  const bufferBytes = 1 + 32 + 32 + 32 + 32;
  const data = Buffer.alloc(bufferBytes);

  dataLayout.encode(
    {
      instruction: 0, // InitializeCreateLicense instruction
      id: Buffer.from("my-id"),
      service_type: Buffer.from(`AMM License`.substring(0, 31)),
      subject: Buffer.from(`Paddy`.padEnd(32).substring(0, 31)),
      issuance_date: Buffer.from(`13/11/11`.padEnd(32).substring(0, 31)),
    },
    data
  );

  const numBytes = 1 + 32 + 32 + 32 + 32 + 32;
  const rentExemption = await connection.getMinimumBalanceForRentExemption(
    numBytes
  );

  const transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: ownerAccount.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: rentExemption,
      space: numBytes,
      programId: programId,
    })
  );

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
    ],
    programId: programId,
    data: data,
  });

  transaction.add(instruction);

  const result = await sendAndConfirmTransaction(
    connection,
    transaction,
    [ownerAccount, dataAccount],
    {
      confirmations: 1,
      skipPreflight: true,
    }
  );
  let account = await connection.getAccountInfo(dataAccount.publicKey);	
	console.log(account)
	decodeLicense(Buffer.from(account.data))

  return {
    ownerAccount: ownerAccount.publicKey.toString(),
    dataAccount: dataAccount.publicKey.toString(),
  };
};

const decodeLicense = (buf) => {
  const dataLayout = lo.struct([
    lo.cstr("id"),
    lo.cstr("service_type"),
    lo.cstr("subject"),
    lo.blob(32, "issuer"),
    lo.cstr("issuance_date"),
  ]);
  let data = dataLayout.decode(buf);
  console.log(data);
  return data;
};

export { createService, decodeLicense };
