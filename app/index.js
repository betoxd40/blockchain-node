const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool");
const P2PServer = require("./p2p-server");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const P2P = new P2PServer(bc);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  P2P.syncChains();

  res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
  res.json(tp.transactions);
});

app.post("/transactions", (req, res) => {});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
P2P.listen();
