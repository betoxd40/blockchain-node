const Transaction = require("./transaction");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(
      (tx) => tx.id === transaction.id
    );

    if (transactionWithId) {
      return (this.transactions[
        this.transactions.indexOf(transactionWithId)
      ] = transaction);
    }
    return this.transactions.push(transaction);
  }

  existingTransaction(address) {
    return this.transactions.find((tx) => tx.input.address === address);
  }

  validTransactions() {
    return this.transactions.filter((tx) => {
      const outputTotal = tx.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);
      if (tx.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${tx.input.address}.`);
        return;
      }
      if (!Transaction.verifyTransaction(tx)) {
        console.log(`Invalid signature from ${tx.input.address}.`);
        return;
      }

      return tx;
    });
  }
}

module.exports = TransactionPool;
