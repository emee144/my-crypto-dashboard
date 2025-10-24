'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: 'include' });
        if (!res.ok) throw new Error("User not authenticated");

        const result = await res.json();
        if (!result || !result.email) {
          router.push('/login');
        } else {
          setUser(result);
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    fetchUser();
  }, [router]);

  // Fetch crypto data
  const fetchCryptoData = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,dogecoin,melania,cardano,binancecoin,polkadot,uniswap,litecoin,ripple,chainlink,stellar,vechain,shiba-inu,tron,monero,tezos,avalanche,near-protocol"
      );

      if (!res.ok) {
        console.error("Failed to fetch data.");
        setError("Failed to fetch data.");
        return;
      }

      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth && user) {
      fetchCryptoData();
      const interval = setInterval(fetchCryptoData, 10000);
      return () => clearInterval(interval);
    }
  }, [checkingAuth, user]);

  if (checkingAuth) return <div className="text-white p-4">Checking authentication...</div>;
  if (loading) return <div className="text-white p-4">Loading market data...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">
        Live Crypto Market
      </h1>

      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg">
        <table className="w-full text-sm sm:text-base text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">Pair</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">24h Change</th>
              <th className="p-3 text-right">Volume</th>
              <th className="p-3 text-center">Gainer</th>
              <th className="p-3 text-center">Loser</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coin, idx) => (
              <tr
                key={coin.id}
                className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
              >
                <td className="p-3 font-semibold">{coin.name} / USD</td>
                <td className="p-3 text-right">${coin.current_price.toFixed(2)}</td>
                <td
                  className={`p-3 text-right font-semibold ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="p-3 text-right">
                  ${coin.total_volume.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  {coin.price_change_percentage_24h > 0 && (
                    <span className="bg-green-600 text-xs sm:text-sm px-2 py-1 rounded-full">
                      Gaining
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {coin.price_change_percentage_24h < 0 && (
                    <span className="bg-red-600 text-xs sm:text-sm px-2 py-1 rounded-full">
                      Losing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
