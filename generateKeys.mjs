// generateKeys.mjs
import * as bip39 from 'bip39';
import HDKey from 'hdkey';

async function main() {
  console.log('🚀 Starting key generation script...\n');

  // Generate a mnemonic
  const mnemonic = bip39.generateMnemonic();
  console.log("🔑 Mnemonic (Seed Phrase):");
  console.log(mnemonic);
  console.log("\n");

  // Convert mnemonic to seed
  const seed = await bip39.mnemonicToSeed(mnemonic);
  console.log("🌱 Seed (Hexadecimal):");
  console.log(seed.toString('hex'));
  console.log("\n");

  // Create root node
  const root = HDKey.fromMasterSeed(seed);

  // Derive master keys
  const xprv = root.privateExtendedKey;
  const xpub = root.publicExtendedKey;
  console.log("🔒 Master Private Extended Key (xprv):");
  console.log(xprv);
  console.log("\n");
  console.log("🔓 Master Public Extended Key (xpub):");
  console.log(xpub);
  console.log("\n");

  console.log('✅ Key generation completed successfully!');
}

main().catch(error => console.error('❌ Error:', error));
