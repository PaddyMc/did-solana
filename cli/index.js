const solana_web3 = require("@solana/web3.js");
const lo = require("buffer-layout");

const createDid = async (connection, programId) => {
  const lamports = 10 * 1000000000;
  const numBytes = 5;

  const account = new solana_web3.Account();
  await connection.requestAirdrop(account.publicKey, lamports);

  const dataAccount = new solana_web3.Account();

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
 


const ds = lo.cstr();
const b = Buffer.alloc(8);
console.log(ds.encode('hi!', b) === 3 + 1);
const slen = ds.getSpan(b);
console.log(slen)

  const dataLayout = lo.struct([
    lo.u8("instruction"),
    lo.u8("context"),
    lo.u8("id"),
    lo.u8("aka"),
    lo.u8("authentication"),
    lo.u8("services"),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 0, // InitializeCreateDid instruction
      context: 1,
      id: 2,
      aka: 3,
      authentication: 4,
      services: 5,
    },
    data
  );
  console.log(data)

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

  const result = await solana_web3
    .sendAndConfirmTransaction(
      connection,
      transaction,
      [account, dataAccount],
      {
        confirmations: 1,
        skipPreflight: true,
      }
    )

  await getAccountInfo(connection, dataAccount.publicKey);
};

const getAccountInfo = async (connection, pk) => {
  if (!pk) {
    console.log("pk not provided");
    process.exit(1);
  }

  console.log("Inspecting pk:", pk.toString());

  let account = await connection.getAccountInfo(pk);

  if (!account) {
    console.log("Account not found on chain");
    process.exit(1);
  }
  console.log(account);

  let owner = new solana_web3.PublicKey(account.owner._bn);

  console.log("Owner PubKey:", owner.toString());
};

const main = async () => {
  connection = new solana_web3.Connection(
    "http://localhost:8899",
    "singleGossip"
  );
  console.log(process.argv[2]);
  let programId = new solana_web3.PublicKey(process.argv[2]);

  await createDid(connection, programId);
};

main();
