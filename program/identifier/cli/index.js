const solana_web3 = require("@solana/web3.js");
const lo = require("buffer-layout");
const { addAuthentication, decodePubkeys } = require("./add-authentication");
const { addService, decodeservices, decodeServices } = require("./add-service");

const createDid = async (connection, programId) => {
  const lamports = 10 * 1000000000;

  const account = new solana_web3.Account();
  await connection.requestAirdrop(account.publicKey, lamports);

  const dataAccount = new solana_web3.Account();

  //console.log("Payer Account:", account.publicKey.toString());
  //console.log("Data Account:", dataAccount.publicKey.toString());

  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.cstr("context"),
    lo.cstr("id"),
    lo.cstr("aka"),
  ]);
  const numBytes = 1 + 32 + 32 + 32 + 32 * 10 + 96 * 4;
  const data = Buffer.alloc(numBytes);

  dataLayout.encode(
    {
      instruction: 0, // InitializeCreateDid instruction
      context: Buffer.from("https://w3c.github.io/did-core/"),
      id: Buffer.from(
        `did:sol:${dataAccount.publicKey.toString()}`.substring(0, 31)
      ),
      aka: Buffer.from(`Paddy`.padEnd(32).substring(0, 31)),
    },
    data
  );

  const rentExemption = await connection.getMinimumBalanceForRentExemption(
    numBytes
  );

  const transaction = new solana_web3.Transaction();
  transaction.add(
    solana_web3.SystemProgram.createAccount({
      fromPubkey: account.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: rentExemption,
      space: numBytes,
      programId: programId,
    })
  );

  const instruction = new solana_web3.TransactionInstruction({
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

  const result = await solana_web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [account, dataAccount],
    {
      confirmations: 1,
      skipPreflight: true,
    }
  );

  console.log("adding authentication");
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  await addAuthentication(connection, programId, account, dataAccount);
  console.log("added authentication");
  console.log("adding services");
  await addService(connection, programId, account, dataAccount);
  await addService(connection, programId, account, dataAccount);
  await addService(connection, programId, account, dataAccount);
  await addService(connection, programId, account, dataAccount);
  console.log("added services");
  await getAccountInfo(connection, dataAccount.publicKey);
};

const getAccountInfo = async (connection, pk) => {
  if (!pk) {
    console.log("pk not provided");
    process.exit(1);
  }

  let account = await connection.getAccountInfo(pk);

  let owner = new solana_web3.PublicKey(account.owner._bn);

  //console.log("Inspecting pk:", pk.toString());
  //console.log("Owner PubKey:", owner.toString());

  if (!account) {
    console.log("Account not found on chain");
    process.exit(1);
  }
  decodeDid(account.data);
};

const decodeDid = (buf) => {
  const dataLayout = lo.struct([
    lo.cstr("context"),
    lo.cstr("id"),
    lo.cstr("aka"),
    lo.blob(320, "authentication"),
    lo.blob(384, "services"),
  ]);
  let data = dataLayout.decode(buf);
  console.log(data);
  decodePubkeys(data.authentication);
  decodeServices(data.services);
};

const main = async () => {
  connection = new solana_web3.Connection(
    "http://localhost:8899",
    "singleGossip"
  );
  let programId = new solana_web3.PublicKey(process.argv[2]);

  await createDid(connection, programId);
};

main();

module.exports = {
  getAccountInfo,
};
