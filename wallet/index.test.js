const Wallet = require("./index");
const Transaction = require("./transaction");
const TransactionPool = require("./transaction-pool");

describe("Wallet", () => {
  let wallet, tp;
  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe("creating a transaction", () => {
    let tx, sendAmount, recipient;
    beforeEach(() => {
      sendAmount = 50;
      recipient = "random-address";
      tx = wallet.createTransaction(recipient, sendAmount, tp);
    });

    describe("and doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      it("doubles the 'sendAmount' subtracted from the wallet balance", () => {
        expect(
          tx.outputs.find((output) => output.address === wallet.publicKey)
            .amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it("clones the 'sendAmount' output for the recipient", () => {
        expect(
          tx.outputs
            .filter((output) => output.address === recipient)
            .map((output) => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
