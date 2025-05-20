import {TronWeb} from 'tronweb';

const generateTRC20Address = async () => {
  try {
    console.log('TronWeb available?', typeof TronWeb);

    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io', // Mainnet URL for Tron
      headers: {
        'TRON-PRO-API-KEY': 'af6d0a26-f39e-4d0c-9782-2d07c3bdae37', // Replace with your valid API key
      },
    });

    console.log('TronWeb instance created:', tronWeb);

    // Generate a new TRON account
    const keyPair = tronWeb.utils.accounts.generateAccount();
    console.log('Generated key pair:', keyPair);

    const privateKey = keyPair.privateKey;
    const address = tronWeb.address.fromPrivateKey(privateKey);

    console.log('TRC20 Address:', address);
    console.log('Private Key:', privateKey);
  } catch (err) {
    console.error('Error during address generation:', err.message);
  }
};

generateTRC20Address();
