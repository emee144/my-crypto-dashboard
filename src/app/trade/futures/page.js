"use client";
import { useState } from "react";

export default function Futures() {
  const [selectedOption, setSelectedOption] = useState("Buy");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Futures Trading</h1>

      {/* Trade Options (e.g., Buy or Sell) */}
      <div className="mb-6">
        <button
          onClick={() => setSelectedOption("Buy")}
          className={`px-4 py-2 mr-4 ${selectedOption === "Buy" ? "bg-blue-600" : "bg-gray-600"} text-white rounded`}
        >
          Buy
        </button>
        <button
          onClick={() => setSelectedOption("Sell")}
          className={`px-4 py-2 ${selectedOption === "Sell" ? "bg-blue-600" : "bg-gray-600"} text-white rounded`}
        >
          Sell
        </button>
      </div>

      {/* Displaying the selected trading option */}
      <div className="mb-6">
        <h2 className="text-xl">Selected Option: {selectedOption}</h2>
        <p>
          Here you can place a {selectedOption} order for a specific futures contract.
        </p>
      </div>

      {/* Futures Contract Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Futures Contract Details</h3>
        <p>
          Here, you could display details about the futures contract, like the asset, expiration date, leverage, and price.
        </p>
        <div className="border p-4 mt-4 rounded">
          <p><strong>Asset:</strong> Bitcoin</p>
          <p><strong>Expiration Date:</strong> 2025-12-31</p>
          <p><strong>Leverage:</strong> 10x</p>
          <p><strong>Current Price:</strong> $45,000</p>
        </div>
      </div>

      {/* Placeholder for order form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Place Your Order</h3>
        <form>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (in USD)</label>
            <input
              type="number"
              id="amount"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded"
              placeholder="Enter amount"
            />
          </div>
          <div className="mb-4">
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}