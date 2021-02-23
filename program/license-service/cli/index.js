const solana_web3 = require("@solana/web3.js");
const lo = require("buffer-layout");

const createLicense = async (connection, programId) => {
  const lamports = 10 * 1000000000;

  const account = new solana_web3.Account();
  await connection.requestAirdrop(account.publicKey, lamports);

  const dataAccount = new solana_web3.Account();

  //console.log("Payer Account:", account.publicKey.toString());
  //console.log("Data Account:", dataAccount.publicKey.toString());

  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.cstr("id"),
    lo.cstr("service_type"),
    lo.cstr("subject"),
    lo.cstr("issuance_date"),
  ]);
  const numBytes = 1 + 32 + 32 + 32 + 32 + 32;
  console.log(numBytes);
  const data = Buffer.alloc(numBytes);

  dataLayout.encode(
    {
      instruction: 0, // InitializeCreateLicense instruction
      id: Buffer.from("my-id"),
      service_type: Buffer.from(
        `AMM License`.substring(0, 31)
      ),
      subject: Buffer.from(`Paddy`.padEnd(32).substring(0, 31)),
      issuance_date: Buffer.from(`13/11/11`.padEnd(32).substring(0, 31)),
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

  console.log("added licence");
  await getAccountInfo(connection, dataAccount.publicKey);
};

const getAccountInfo = async (connection, pk) => {
  if (!pk) {
    console.log("pk not provided");
    process.exit(1);
  }

  let account = await connection.getAccountInfo(pk);

  let owner = new solana_web3.PublicKey(account.owner._bn);

  console.log("Inspecting pk:", pk.toString());
  console.log("Owner PubKey:", owner.toString());

  if (!account) {
    console.log("Account not found on chain");
    process.exit(1);
  }
  decodeLicense(account.data);
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
  let issuer = new solana_web3.PublicKey(data.issuer);
  console.log(issuer);
  console.log(data);
};

const main = async () => {
  connection = new solana_web3.Connection(
    "http://localhost:8899",
    "singleGossip"
  );
  let programId = new solana_web3.PublicKey(process.argv[2]);

  await createLicense(connection, programId);
};

main();

module.exports = {
  getAccountInfo,
};
