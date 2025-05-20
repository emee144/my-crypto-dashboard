import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BindWithdrawalAddress = () => {
  const [network, setNetwork] = useState('trc20');
  const [addresses, setAddresses] = useState({ erc20: '', trc20: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch all bound withdrawal addresses
  useEffect(() => {
    const fetchWithdrawalAddresses = async () => {
      try {
        const res = await fetch('/api/auth/bindWithdrawalAddress', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok) {
          setAddresses({
            erc20: data.withdrawalAddresses?.erc20 || '',
            trc20: data.withdrawalAddresses?.trc20 || '',
          });
        } else {
          console.error("Failed to fetch withdrawal addresses:", data.message);
        }
      } catch (err) {
        console.error('Error fetching withdrawal addresses:', err);
      }
    };

    fetchWithdrawalAddresses();
  }, []);

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
    setError(null);
  };

  const handleAddressChange = (e) => {
    setAddresses({ ...addresses, [network]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/bindWithdrawalAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ address: addresses[network], network }),
      });

      const data = await res.json();

      if (res.ok) {
        setTimeout(() => router.push('/settings'), 500);
      } else {
        setError(data.message || "Unknown error");
      }
    } catch (err) {
      setError('Something went wrong!');
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Bind Withdrawal Address</h1>
      <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="network" className="block text-lg font-medium mb-2">Select Network</label>
            <select
              id="network"
              value={network}
              onChange={handleNetworkChange}
              className="w-full p-4 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="erc20">ERC20</option>
              <option value="trc20">TRC20</option>
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-lg font-medium mb-2">Enter Withdrawal Address</label>
            <input
              id="address"
              type="text"
              value={addresses[network]}
              onChange={handleAddressChange}
              placeholder={`Enter ${network.toUpperCase()} Address`}
              className="w-full p-4 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold rounded-xl transition duration-300 ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-700 text-white'
            }`}
          >
            {loading ? 'Binding...' : `Bind ${network.toUpperCase()} Address`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BindWithdrawalAddress;