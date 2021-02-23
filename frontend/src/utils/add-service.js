import {
  Account,
  Transaction,
  TransactionInstruction,
  PublicKey,
  Connection,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import lo from "buffer-layout";
import { values } from "ramda";

const addService = async (
  programIdString,
  ownerAccount,
  dataAccount,
  serviceId,
  serviceType,
  serviceDataKey
) => {
  //  console.log("Owner PubKey:", ownerAccount.publicKey.toString());
  let connection = new Connection("https://devnet.solana.com", "singleGossip");
  let programId = new PublicKey(programIdString);
  const lamports = 10 * 1000000000;
  const account = new Account();
  await connection.requestAirdrop(account.publicKey, lamports);
  ownerAccount = new Account(values(ownerAccount._keypair.secretKey));
  dataAccount = new Account(values(dataAccount._keypair.secretKey));
  console.log("Data PubKey:", dataAccount.publicKey.toString());

  const numBytes = 1 + 32 + 32 + 50;
  const data = Buffer.alloc(numBytes);
  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.cstr("id"),
    lo.cstr("service_type"),
    lo.cstr("service_key"),
  ]);

  //  console.log(dataAccount.publicKey._bn)
  //  console.log(Buffer.byteLength(dataAccount.publicKey.toString()))
  dataLayout.encode(
    {
      instruction: 2, // InitializeAddService instruction
      id: Buffer.from(serviceId.padEnd(32).substring(0, 31)),
      service_type: Buffer.from(serviceType.padEnd(32).substring(0, 31)),
      service_key: Buffer.from(serviceDataKey.padEnd(32).substring(0, 31)),
    },
    data
  ); //new PublicKey(serviceDataKey).toBuffer()
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
    ],
    programId: programId,
    data: data,
  });

  transaction.add(instruction);

  await sendAndConfirmTransaction(connection, transaction, [ownerAccount], {
    confirmations: 1,
    skipPreflight: true,
  }).catch((error) => {
    console.log(error);
  });

  return {
    ownerAccount: ownerAccount.publicKey.toString(),
    dataAccount: dataAccount.publicKey.toString(),
    serviceAccount: serviceDataKey,
  };
};

const decodeServices = (buf) => {
  const dataLayout = lo.struct([
    lo.blob(96, "service1"),
    lo.blob(96, "service2"),
    lo.blob(96, "service3"),
    lo.blob(96, "service4"),
  ]);
  let data = dataLayout.decode(buf);
  let ser1 = decodeService(data.service1);
  let ser2 = decodeService(data.service2);
  let ser3 = decodeService(data.service3);
  let ser4 = decodeService(data.service4);
  return [ser1, ser2, ser3, ser4];
};

const decodeService = (buf) => {
  const dataLayout = lo.struct([
    lo.cstr("id"),
    lo.cstr("serviceType"),
    lo.cstr("serviceKey"),
  ]);
  let data = dataLayout.decode(buf);
  return data;
};

export { addService, decodeServices, decodeService };
