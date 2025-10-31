'use client';
export default function FuturesBalance({ balance }) {
  const trade = balance?.trade ?? 0;
  const moneyInTrades = balance?.moneyInTrades ?? 0;

  return (
    <div>
      <p>Trade: ${trade.toFixed(2)}</p>
      <p>Money in Trade: ${moneyInTrades.toFixed(2)}</p>
    </div>
  );
}
