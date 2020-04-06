const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");

describe("TransactionPool", () => {
  let tp, wallet, transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, "random-address", 30);
    tp.updateOrAddTransaction(transaction);
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
});
