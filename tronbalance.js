const axios = require('axios');

// TRON Wallet address to check
const walletAddress = 'TBGcj6c4m61b5SmWq3s2WzRsdBXyat3L6E';

// USDT TRC-20 contract address
const usdtContractAddress = 'TXbT78yL9S2BRooH5FFkXxWCeMNRNG4bdQ';

// TronGrid API endpoint to fetch token balances
const url = `https://api.trongrid.io/v1/accounts/${walletAddress}/tokens?contract_address=${usdtContractAddress}`;

async function getUsdtBalance() {
  try {
    const response = await axios.get(url);
    const balanceData = response.data.data;

    if (balanceData.length > 0) {
      const usdtBalance = balanceData[0].balance; // Balance in the smallest unit (SUN)
      const usdt = usdtBalance / 1000000; // Convert to USDT (1 USDT = 1,000,000 SUN)
      console.log(`USDT Balance: ${usdt} USDT`);
    } else {
      console.log('No USDT balance found for this address.');
    }
  } catch (error) {
    console.error('Error fetching USDT balance:', error);
  }
}

getUsdtBalance();
