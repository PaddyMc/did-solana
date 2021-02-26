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
import { getAccountInfo } from "./index";
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
  let pubBuf;
  try {
    pubBuf = new PublicKey(key).toBuffer();
  } catch (err) {
    console.log(err);
    return false;
  }

  console.log(pubBuf);

  const dataAccount = new Account();

  //console.log("Payer Account:", account.publicKey.toString());
  //console.log("Data Account:", dataAccount.publicKey.toString());

  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.cstr("id"),
    lo.cstr("service_type"),
    lo.blob(32, "subject"),
    lo.cstr("issuance_date"),
  ]);
  const bufferBytes = 1 + 32 + 32 + 32 + 32;
  const data = Buffer.alloc(bufferBytes);
  let d = new Date();

  dataLayout.encode(
    {
      instruction: 0, // InitializeCreateLicense instruction
      id: Buffer.from(serviceId.padEnd(32).substring(0, 31)),
      service_type: Buffer.from(serviceType.padEnd(32).substring(0, 31)),
      subject: Buffer.from(pubBuf),
      issuance_date: Buffer.from(d.toString().padEnd(32).substring(0, 31)),
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
  let licence = decodeLicense(Buffer.from(account.data));

  return {
    ownerAccount: ownerAccount.publicKey.toString(),
    dataAccount: dataAccount.publicKey.toString(),
    id: licence.id,
    serviceType: licence.service_type,
    subject: new PublicKey(licence.subject).toString(),
    issuer: new PublicKey(licence.issuer).toString(),
    issuanceDate: licence.issuance_date,
  };
};

const getServiceData = async (pk) => {
  let connection = new Connection("https://devnet.solana.com", "singleGossip");
  try {
    pk = new PublicKey(pk);
  } catch (error) {
    console.log(error);
    return false;
  }

  if (!pk) {
    console.log("pk not provided");
    process.exit(1);
  }

  let account = await connection.getAccountInfo(pk);

  if (!account) {
    console.log("Account not found on chain");
    return false;
  }
  if (!account.data) {
    console.log("Account has no data");
    return false;
  }
  return decodeLicense(Buffer.from(account.data));
};

const decodeLicense = (buf) => {
  const dataLayout = lo.struct([
    lo.cstr("id"),
    lo.cstr("service_type"),
    lo.blob(32, "subject"),
    lo.blob(32, "issuer"),
    lo.cstr("issuance_date"),
  ]);
  let data = dataLayout.decode(buf);
	console.log(data)
  return data;
};

export { createService, getServiceData, decodeLicense };
