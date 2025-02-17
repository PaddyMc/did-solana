const solana_web3 = require("@solana/web3.js");
const lo = require("buffer-layout");

const addService = async (connection, programId, ownerAccount, dataAccount) => {
//  console.log("Owner PubKey:", ownerAccount.publicKey.toString());
  let pubBuf = new solana_web3.PublicKey(dataAccount.publicKey.toString()).toBuffer()
 // console.log("Service Data PubKey:", dataAccount.publicKey.toString());

 // console.log(Buffer.byteLength(pubBuf))
  const numBytes = 1 + 32 + 32 + 32;
  const data = Buffer.alloc(numBytes);
  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.cstr("id"),
    lo.cstr("service_type"),
    lo.blob(32, "service_key"),
  ]);

//  console.log(dataAccount.publicKey._bn)
//  console.log(Buffer.byteLength(dataAccount.publicKey.toString()))
  dataLayout.encode(
    {
      instruction: 2, // InitializeAddService instruction
      id: Buffer.from(`id-for-service`.padEnd(32).substring(0, 31)),
      service_type: Buffer.from(`Paddy`.padEnd(32).substring(0, 31)),
      service_key: pubBuf,
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

const decodeServices = (buf) => {
  const dataLayout = lo.struct([
    lo.blob(96,"service1"),
    lo.blob(96,"service2"),
    lo.blob(96,"service3"),
    lo.blob(96,"service4"),
  ]);
  let data = dataLayout.decode(buf);
  decodeService(data.service1)
  decodeService(data.service2)
  decodeService(data.service3)
  decodeService(data.service4)
};

const decodeService = (buf) => {
  const dataLayout = lo.struct([
    lo.cstr("id"),
    lo.cstr("serviceType"),
    lo.blob(32,"serviceKey"),
  ]);
  let data = dataLayout.decode(buf);
 // let key = new solana_web3.PublicKey(data.serviceKey)
 // console.log(key.toString());
  console.log(data);
};

module.exports = {
  addService,
  decodeServices,
  decodeService,
};
