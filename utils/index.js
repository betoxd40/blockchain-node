const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");
const uuidV1 = require("uuid/v1");
const ec = new EC("secp256k1");

const genKeyPair = () => ec.genKeyPair();

const id = () => uuidV1();

const hashSHA256 = (data) => SHA256(JSON.stringify(data)).toString();

const verifySignature = (publicKey, signature, dataHash) =>
  ec.keyFromPublic(publicKey, "hex").verify(dataHash, signature);

module.exports = { genKeyPair, id, hashSHA256, verifySignature };
