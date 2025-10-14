"use client";

import { useState } from "react";
import { ethers } from "ethers"; // ✅ Import ethers

const ConnectWalletButton = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      // Set wallet address
      setWalletAddress(accounts[0]);
      console.log("Connected wallet:", accounts[0]);

      // Optional: create ethers provider instance if needed
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Ethers signer address:", address);
    } catch (error) {
      console.error("MetaMask connect error:", error);
    }
  };

  return (
    <button
      onClick={connectWallet}
      className={`p-3 rounded-lg transition ${walletAddress ? 'bg-green-500' : 'bg-blue-500'} text-white hover:bg-blue-600`}
    >
      {walletAddress
        ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
};

export default ConnectWalletButton;