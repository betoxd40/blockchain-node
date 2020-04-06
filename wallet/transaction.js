const { id, hashSHA256, verifySignature } = require("../utils");

class Transaction {
  constructor() {
    this.id = id;
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      (output) => output.address === senderWallet.publicKey
    );

    if (Transaction.isAmountHigherThanBalance(amount, senderOutput.amount))
      return;

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });

    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static isAmountHigherThanBalance(amount, balance) {
    if (amount > balance) {
      console.log(`Amount: ${amount} exceed balance.`);
      return true;
    }
    return false;
  }

  static newTransaction(senderWallet, recipient, amount) {
    const transaction = new this();

    if (Transaction.isAmountHigherThanBalance(amount, senderWallet.balance))
      return;

    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey,
        },
        { amount, address: recipient },
      ]
    );
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(hashSHA256(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction) {
    return verifySignature(
      transaction.input.address,
      transaction.input.signature,
      hashSHA256(transaction.outputs)
    );
  }
}

module.exports = Transaction;
