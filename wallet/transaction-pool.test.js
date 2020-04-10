const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");

describe("TransactionPool", () => {
  let tp, wallet, transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction("random-address", 30, tp);
  });

  it("adds a transaction to the pool ", () => {
    expect(tp.transactions.find((tx) => tx.id === transaction.id)).toEqual(
      transaction
    );
  });

  it("update a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "foo-address", 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(
      JSON.stringify(tp.transactions.find((tx) => tx.id === newTransaction.id))
    ).not.toEqual(oldTransaction);
  });

  describe("mixing valid and corrupt transactions", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction("random-address", 30, tp);
        if (i % 2 === 0) {
          transaction.input.amount = 999999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it("shows a difference between valid and corrupt transactions", () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(
        JSON.stringify(validTransactions)
      );
    });

    it("grabs valid transactions", () => {
      console.log(
        "LA PUTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        tp.transactions
      );
      console.log("----------------------------");
      console.log(validTransactions);
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });
});
