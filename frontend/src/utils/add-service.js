import {
  Account,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import lo from "buffer-layout";

const addService = async (connection, programId, ownerAccount, dataAccount) => {
  //  console.log("Owner PubKey:", ownerAccount.publicKey.toString());
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
      id: Buffer.from(`id-for-service`.padEnd(32).substring(0, 31)),
      service_type: Buffer.from(`Paddy`.padEnd(32).substring(0, 31)),
      service_key: dataAccount.publicKey,
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
  );
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
  console.log(data);
  return data;
};

export { addService, decodeServices, decodeService };
