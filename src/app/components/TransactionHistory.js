import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, Repeat } from "lucide-react";

const TransactionHistory = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const [depositRes, withdrawalRes, transferRes] = await Promise.all([
          fetch("/api/auth/deposit/history"),
          fetch("/api/auth/withdrawalhistory"),
          fetch("/api/auth/transferhistory"),
        ]);

        if (!depositRes.ok || !withdrawalRes.ok || !transferRes.ok) {
          throw new Error("Failed to fetch one or more transaction types");
        }

        const depositData = await depositRes.json();
        const withdrawalData = await withdrawalRes.json();
        const transferData = await transferRes.json();

        const deposits = Array.isArray(depositData.deposits)
          ? depositData.deposits.map((item) => ({
              ...item,
              type: "Deposit",
              amount: item.depositAmount,
            }))
          : [];

        const withdrawals = Array.isArray(withdrawalData.data)
          ? withdrawalData.data.map((item) => ({
              ...item,
              type: "Withdrawal",
              amount: item.amountAfterFee,
            }))
          : [];

        const transfers = Array.isArray(transferData)
          ? transferData.map((item) => ({
              ...item,
              type: "Transfer",
              amount: item.amount,
            }))
          : [];

        const merged = [...deposits, ...withdrawals, ...transfers].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTransactionHistory(merged);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  if (loading)
    return <p className="text-center mt-6 text-gray-500">Loading transaction history...</p>;

  const formatAmount = (amt) => {
    return amt && !isNaN(amt) ? `$${Number(amt).toLocaleString()}` : "Invalid amount";
  };

  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Transaction History</h2>

      {transactionHistory.length === 0 ? (
        <p className="text-gray-500 text-center">No transactions found.</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {transactionHistory.map((tx, index) => {
              const isDeposit = tx.type === "Deposit";
              const isWithdrawal = tx.type === "Withdrawal";
              const isTransfer = tx.type === "Transfer";

              let Icon;
              if (isDeposit) Icon = ArrowDownCircle;
              else if (isWithdrawal) Icon = ArrowUpCircle;
              else if (isTransfer) Icon = Repeat;
              else Icon = ArrowUpCircle; // fallback

              const bgClass = isDeposit
                ? "bg-blue-600"
                : isWithdrawal
                ? "bg-green-600"
                : isTransfer
                ? "bg-red-600"
                : "bg-gray-600";

              const borderClass = isDeposit
                ? "border-blue-400"
                : isWithdrawal
                ? "border-green-400"
                : isTransfer
                ? "border-red-400"
                : "border-gray-400";

              const textClass = "text-white";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`w-full border-l-4 ${borderClass} ${bgClass} ${textClass} p-4 rounded-xl shadow-sm`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-5 h-5 ${textClass}`} />
                    <span className={`font-semibold ${textClass}`}>{tx.type}</span>
                  </div>

                  <p>
                    <strong>Amount:</strong> {formatAmount(tx.amount)}
                  </p>

                  {isTransfer && (
                    <p className="flex items-center gap-1">
                      <strong>{tx.from}</strong>
                      <Repeat className={`w-4 h-4 mx-1 ${textClass}`} />
                      <strong>{tx.to}</strong>
                    </p>
                  )}

                  {tx.currency && (
                    <p>
                      <strong>Currency:</strong> {tx.currency}
                    </p>
                  )}
                  {tx.chainName && (
                    <p>
                      <strong>Chain:</strong> {tx.chainName}
                    </p>
                  )}
                  {tx.withdrawalAddress && (
                    <p>
                      <strong>Address:</strong> {tx.withdrawalAddress}
                    </p>
                  )}
                  <p>
                    <strong>Date:</strong>{" "}
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "N/A"}
                  </p>
                  {tx.status && (
                    <p>
                      <strong>Status:</strong> {tx.status}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
