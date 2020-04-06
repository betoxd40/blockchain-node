const Transaction = require("./transaction");
const { INITIAL_BALANCE } = require("../config");
const { genKeyPair } = require("../utils");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, transactionPool) {
    if (amount > this.balance) {
      console.log(`Amount ${amount} exceeds current balance: ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  /**
   * Debug method
   */
  toString() {
    return `Wallet - 
        publicKey : ${this.publicKey.toString()}
        balance   : ${this.balance}
    `;
  }
}

module.exports = Wallet;
