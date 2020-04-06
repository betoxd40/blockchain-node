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
}

module.exports = TransactionPool;
