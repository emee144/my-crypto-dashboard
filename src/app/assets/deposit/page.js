'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DepositHistory from '@/components/deposithistory';

export default function DepositPage() {
  const [addresses, setAddresses] = useState({ TRC20: '', ERC20: '' });
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userRes = await fetch('/api/auth/user');
        const userData = await userRes.json();

        if (!userRes.ok) throw new Error('Failed to fetch user info');

        const email = userData.email;
        const response = await fetch(`/api/auth/deposit?email=${email}`);
        const data = await response.json();

        if (!response.ok) throw new Error('Failed to fetch addresses');

        if (data.ethAddress && data.tronAddress) {
          setAddresses({
            TRC20: data.tronAddress,
            ERC20: data.ethAddress,
          });
        } else {
          setError('Deposit addresses not found');
        }
      } catch (error) {
        setError('Error fetching deposit addresses. Please try again later.');
        console.error('Error:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(addresses[selectedNetwork]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold ml-2">Deposit USDT</h1>

        <div className="flex justify-center mb-4">
          <Image src="/assets/usdt.png" alt="USDT Logo" width={50} height={50} />
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            {['TRC20', 'ERC20'].map((net) => (
              <button
                key={net}
                onClick={() => setSelectedNetwork(net)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedNetwork === net
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {net}
              </button>
            ))}
          </div>

          <p className="mb-2 text-sm sm:text-base">
            Send only <span className="font-bold">USDT ({selectedNetwork})</span> to this address:
          </p>

          <div className="bg-gray-700 p-3 rounded text-sm font-mono break-words sm:text-base mb-4">
            {addresses[selectedNetwork] || 'Loading address...'}
          </div>

          <button
            onClick={handleCopy}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        {/* Troubleshooting Section */}
        <div className="bg-red-500 p-4 rounded-lg text-white mt-6">
          <h2 className="text-xl font-semibold mb-2">The recharge has not arrived?</h2>
          <p className="text-sm sm:text-base">
            If you encounter problems during the deposit process, you can contact ‘Online Customer Service’:
          </p>
          <ul className="list-disc list-inside mt-3 text-sm sm:text-base">
            <li>Not credited for a long time after deposit</li>
            <li>Selecting the wrong network when making a deposit</li>
            <li>Recharged Coin that is not online</li>
            <li>Transaction failed due to network issues</li>
            <li>Transaction pending for an extended period</li>
          </ul>
        </div>
        <div>
          <DepositHistory />
        </div >
      </div>
    </div>
  );
}
