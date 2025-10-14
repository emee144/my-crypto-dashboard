import React from "react";
import TransferForm from "../../components/TransferForm"; // Correct relative path
import TransferHistory from "../../components/TransferHistory";

const TransferPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center p-6 text-white">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Transfer Asset</h1>
        <TransferForm />  {/* Centered Transfer Form */}
        <TransferHistory /> {/* Added Transfer History Component */}
      </div>
    </div>
  );
};

export default TransferPage;
