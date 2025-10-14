import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import pkg from 'js-sha3';
const { keccak256 } = pkg;
import bs58 from 'bs58';
import crypto from 'crypto';

// Initialize bip32 with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

// Inputs
const xprv = 'xprv9s21ZrQH143K3XSZyxXdsBCPbB9fmA6aP86wyx3p2Q7gaUuoRC3x3EAF5j94stPMyQSt8vPcvCc9Z4AYDGCE9sPXpLwttWnyq2nHgEeDUWE';
const xpub = 'xpub661MyMwAqRbcG1X35z4eEK989CzAAcpRkM2YnLTRajefTHEwxjNCb2Uivzacm8uE4pDn7vY6L22fekKHirSUkd7kSsYgQRd64YZRTXypM1U';
const targetAddress = 'TFrzVic43HGHaRVejwMLJxk9kqvuBXUsqn';

// Validate target address
function isValidTronAddress(address) {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
}

if (!isValidTronAddress(targetAddress)) {
  console.error('Invalid target TRON address format.');
  process.exit(1);
}

// Base58Check encoding function
function base58CheckEncode(hexAddress) {
  const bytes = Buffer.from(hexAddress, 'hex');
  const hash1 = crypto.createHash('sha256').update(bytes).digest();
  const hash2 = crypto.createHash('sha256').update(hash1).digest();
  const checksum = hash2.slice(0, 4);
  const addressBytes = Buffer.concat([bytes, checksum]);
  return bs58.encode(addressBytes);
}

// Function to derive TRON addresses from a node
function deriveTronAddresses(node, maxAccounts, maxAddresses, isHardened) {
  for (let chain = 0; chain < 2; chain++) { // 0 = external, 1 = internal
    for (let account = 0; account < maxAccounts; account++) {
      for (let index = 0; index < maxAddresses; index++) {
        const path = isHardened
          ? `m/44'/195'/${account}'/${chain}/${index}` // Hardened path
          : `m/44/195/${account}/${chain}/${index}`; // Non-hardened path

        try {
          const child = node.derivePath(path);
          const pubkey = child.publicKey;

          // Convert public key to TRON address
          const pubkeyUint8 = new Uint8Array(pubkey);
          const hash = keccak256(pubkeyUint8);
          const addressHex = '41' + hash.slice(-40);
          const tronAddress = base58CheckEncode(addressHex);

          console.log(`Derived TRON address for path ${path}:`, tronAddress);

          // Compare derived address with the target address
          if (tronAddress === targetAddress) {
            console.log(`✅ Match found! Path: ${path}`);
            console.log(`Derived TRON address: ${tronAddress}`);
            console.log(`Target TRON address: ${targetAddress}`);
            process.exit(0); // Exit the script when a match is found
          }
        } catch (error) {
          console.error(`Error deriving path ${path}:`, error.message);
        }
      } 
      
    }
  }
}

try {
  // Define the range of accounts and addresses to search
  const maxAccounts = 100; // Increased the number of accounts to search
  const maxAddresses = 200; // Increased the number of addresses per account

  console.log('🔑 Searching using xprv (hardened paths)...');
  const privateNode = bip32.fromBase58(xprv);
  deriveTronAddresses(privateNode, maxAccounts, maxAddresses, true);

  console.log('🔓 Searching using xpub (non-hardened paths)...');
  const publicNode = bip32.fromBase58(xpub);
  deriveTronAddresses(publicNode, maxAccounts, maxAddresses, false);

  console.log('❌ No match found. Try increasing the range of accounts or addresses.');
} catch (error) {
  console.error('Error deriving TRON address:', error.message);
}
