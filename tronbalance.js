const axios = require('axios');

// Replace with your actual TRON wallet address
const walletAddress = 'TBGcj6c4m61b5SmWq3s2WzRsdBXyat3L6E'; // Example wallet address

// TronGrid API endpoint to fetch all token balances
const url = `https://api.trongrid.io/v1/accounts/${walletAddress}/tokens`;

async function getAllTokenBalances() {
  try {
    const response = await axios.get(url);
    const balanceData = response.data.data;

    if (balanceData.length > 0) {
      console.log('Tokens in this wallet:');
      balanceData.forEach(token => {
        console.log(`${token.symbol}: ${token.balance}`);
      });
    } else {
      console.log('No tokens found for this address.');
    }
  } catch (error) {
    console.error('Error fetching token balances:', error.response ? error.response.data : error.message);
  }
}

getAllTokenBalances();
