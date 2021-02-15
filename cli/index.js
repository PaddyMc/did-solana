var solana_web3 = require("@solana/web3.js");

const testMemo = async (connection, account) => {
  const instruction = new solana_web3.TransactionInstruction({
    keys: [],
    programId: new solana_web3.PublicKey(
      "8Ku3PKjy23eyPoMdAtswivoBMdL2i28jWfcox4e46mza"
    ),
    data: Buffer.from("cztest"),
  });
  console.log("account:", account.publicKey.toBase58());

  const result = await solana_web3
    .sendAndConfirmTransaction(
      connection,
      new solana_web3.Transaction().add(instruction),
      [account],
      {
        skipPreflight: true,
        commitment: "singleGossip",
      }
    )
    .catch((e) => {
      console.log("error", e);
    });
  console.log(result)
};

const main = async () => {
  connection = new solana_web3.Connection(
    "https://devnet.solana.com",
    "singleGossip"
  );
  const account = new solana_web3.Account();
  const lamports = 10 * 1000000000;
  await connection.requestAirdrop(account.publicKey, lamports);

  testMemo(connection, account);
};

main();
