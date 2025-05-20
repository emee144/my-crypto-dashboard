import Web3 from 'web3';

// Set up Web3 with your Infura project ID
const web3 = new Web3('https://mainnet.infura.io/v3/209ed4d4adf247279c68484e975638ae'); // Replace with your Infura project ID

// Log to see if the script is running
console.log("Script is running...");

async function testInfuraConnection() {
  try {
    // Attempt to get the latest block number
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Connected to Infura! Latest block number:', blockNumber);
  } catch (error) {
    console.error('Error connecting to Infura:', error.message);
  }
}

// Run the test function
testInfuraConnection();