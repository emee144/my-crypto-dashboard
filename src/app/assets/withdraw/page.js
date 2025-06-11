'use client';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import WithdrawalHistory from '@/app/components/WithdrawalHistory';
import { Currency } from 'lucide-react';

export default function WithdrawPage() {
  const [network, setNetwork] = useState('trc20');
  const [addresses, setAddresses] = useState({ erc20: '', trc20: '' });
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdt'); // Default to USDT
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const handlingFeePercent = 5;
  const [globalLoading, setGlobalLoading] = useState(false);  // Global loading state

  useEffect(() => {
    const fetchData = async () => {
      setGlobalLoading(true);  // Set global loading to true when fetching data
      try {
        const addressRes = await fetch('/api/auth/bindWithdrawalAddress', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const addressData = await addressRes.json();
        if (addressRes.ok) {
          setAddresses({
            erc20: addressData.withdrawalAddresses?.erc20 || '',
            trc20: addressData.withdrawalAddresses?.trc20 || '',
          });
        } else {
          toast.error(addressData.message || "Failed to fetch addresses");
        }

        const balanceRes = await fetch('/api/auth/getExchangeBalance', {
          method: 'GET',
          credentials: 'include',
        });

        if (!balanceRes.ok) {
          console.error('Error fetching balance data:', balanceRes.statusText);
          toast.error('Failed to fetch balance');
          return;
        }

        const balanceData = await balanceRes.json();
        if (balanceData.exchange !== undefined) {
          setBalance(balanceData.exchange);
        } else {
          console.error('Invalid balance data:', balanceData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setGlobalLoading(false);  // Set global loading to false when done
        setAddressesLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWithdrawAll = () => {
    setAmount(balance.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedAddress = addresses[network];
    if (!network || !amount || !withdrawalPassword || !selectedAddress) {
      toast.error("Amount, Withdrawal Address, Network, and Withdrawal Password are required.");
      setLoading(false);
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0.");
      setLoading(false);
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error("Amount cannot be greater than your balance.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          network,
          amount,
          Currency: 'USDT',
          withdrawalPassword,
          withdrawalAddress: addresses[network],
        }),
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        let errorMessage = 'Withdrawal failed.';
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } else {
          const text = await res.text();
          console.error('Unexpected response (not JSON):', text);
        }
        toast.error(errorMessage);
        return;
      }

      const data = await res.json();
      toast.success(`Withdrawal of ${amount} ${network.toUpperCase()} submitted successfully.`);
      setAmount('');
      setWithdrawalPassword('');
    } catch (err) {
      console.error('Network or parsing error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      {globalLoading ? (  // Display global loading spinner
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
          <p className="mt-4 text-white font-semibold text-lg">Loading withdrawal data...</p>
        </div>
      ) : (
        <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Withdraw</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white block mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full py-3 px-4 rounded-xl text-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter amount"
              />
            </div>
            <div>
  <label className="text-white block mb-1">Currency</label>
  <select
    value={currency}
    onChange={(e) => setCurrency(e.target.value)}
    className="w-full py-3 px-4 rounded-xl text-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="usdt">USDT</option>
    <option value="btc">BTC</option>
    <option value="eth">ETH</option>
  </select>
</div>

            <div>
              <label className="text-white block mb-1">Network</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full py-3 px-4 rounded-xl text-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="trc20">TRC20</option>
                <option value="erc20">ERC20</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Withdrawal Address</label>
              <input
                type="text"
                value={addresses[network]}
                readOnly
                className="w-full py-3 px-4 rounded-xl text-black text-lg bg-gray-200"
              />
            </div>

            <div>
              <label className="text-white block mb-1">Withdrawal Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={withdrawalPassword}
                  onChange={(e) => setWithdrawalPassword(e.target.value)}
                  className="w-full py-3 px-4 pr-10 rounded-xl text-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWithdrawAll}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold"
              disabled={!balance}
            >
              Withdraw All (${balance})
            </button>

            <div className="flex justify-between">
              <span>Handling Fee ({handlingFeePercent}%)</span>
              <span>
            {((parseFloat(amount || 0) * handlingFeePercent) / 100).toFixed(4)} {currency.toUpperCase()}
            </span>

            </div>

            <div className="flex justify-between">
              <span>You Will Receive</span>
             <span>
  {(parseFloat(amount || 0) - (parseFloat(amount || 0) * handlingFeePercent / 100)).toFixed(4)} {currency.toUpperCase()}
</span>


            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-xl text-lg font-semibold mb-10"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
          </form>
          <ToastContainer />
          <WithdrawalHistory />
        </div>
      )}
    </div>
  );
}
