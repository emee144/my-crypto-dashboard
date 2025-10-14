import { ethers } from "ethers";
import * as bip39 from "bip39";
import HDKey from "hdkey";
import TronWeb from "tronweb";

(async () => {
  // 1. Generate 12-word seed phrase
  const mnemonic = bip39.generateMnemonic();
  console.log("Mnemonic (Seed Phrase):", mnemonic);

  // 2. Convert to seed
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // 3. Create master node from seed
  const root = HDKey.fromMasterSeed(seed);

  // Log the master private key
  const masterPrivateKey = root.privateKey.toString("hex");
  console.log("Master Private Key:", masterPrivateKey);

  // === Ethereum ===
  const ethPath = "m/44'/60'/0'/0/0";
  const ethNode = root.derive(ethPath);

  if (!ethNode.privateKey) {
    console.error("Failed to derive Ethereum private key.");
    process.exit(1);
  }

  const ethPrivateKey = ethNode.privateKey.toString("hex");
  console.log("Ethereum Private Key:", ethPrivateKey);

  if (!/^([0-9a-f]{64})$/i.test(ethPrivateKey)) {
    console.error("Invalid Ethereum private key format:", ethPrivateKey);
    process.exit(1);
  }

  const ethWallet = new ethers.Wallet(ethPrivateKey);
  console.log("Ethereum Address:", ethWallet.address);

  // === TRON ===
  const tronPath = "m/44'/195'/0'/0/0";
  const tronNode = root.derive(tronPath);

  if (!tronNode.privateKey) {
    console.error("Failed to derive TRON private key.");
    process.exit(1);
  }

  const tronPrivateKey = tronNode.privateKey.toString("hex");
  console.log("TRON Private Key:", tronPrivateKey);

  if (tronPrivateKey.length !== 64) {
    console.error("Invalid TRON private key length.");
    process.exit(1);
  }

  const tronWeb = new TronWeb({
    fullNode: "https://api.trongrid.io",
    solidityNode: "https://api.trongrid.io",
    eventServer: "https://api.trongrid.io",
  });

  const tronAddress = tronWeb.address.fromPrivateKey(tronPrivateKey);
  console.log("TRON Address:", tronAddress);
})();
