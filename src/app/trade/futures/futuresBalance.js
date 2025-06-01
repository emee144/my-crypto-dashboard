'use client';
import { useState, useEffect } from 'react';

export default function FuturesBalance() {
  const [totalBalance, setTotalBalance] = useState(null);
  const [reservedAmount, setReservedAmount] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      const res = await fetch('/api/auth/balance-and-trades');
      const data = await res.json();

      setTotalBalance(data.totalBalance);
      const reserved = data.openTrades.reduce((sum, t) => sum + t.amount, 0);
      setReservedAmount(reserved);
    }
    fetchBalance();
  }, []);

  const availableBalance = totalBalance !== null ? totalBalance - reservedAmount : null;

  return (
    <div>
      <p>Total Balance: ${totalBalance !== undefined && totalBalance !== null ? Number(totalBalance).toFixed(2) : 'Loading...'}</p>
      <p>Money in Trades: ${reservedAmount !== undefined && reservedAmount !== null ? Number(reservedAmount).toFixed(2) : 'Loading...'}</p>
      <p>Available Balance: ${availableBalance !== undefined && availableBalance !== null ? Number(availableBalance).toFixed(2) : 'Loading...'}</p>
    </div>
  );
}
