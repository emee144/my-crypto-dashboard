'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SetOrUpdateWithdrawalPasswordForm() {
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); // Toggle between set and update

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate password length
    if (withdrawalPassword.trim().length < 6) {
      setMessage('Withdrawal password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/withdrawalpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ withdrawalPassword, isUpdate }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          isUpdate
            ? 'Withdrawal password updated successfully!'
            : 'Withdrawal password set successfully!'
        );
        setWithdrawalPassword('');
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded-2xl"
    >
      <h2 className="text-xl font-semibold mb-4">
        {isUpdate ? 'Update Withdrawal Password' : 'Set Withdrawal Password'}
      </h2>

      {/* Toggle: Set vs Update */}
      <div className="mb-4 flex items-center justify-center gap-6">
        <label className="flex items-center space-x-2 text-black">
          <input
            type="radio"
            name="mode"
            value="set"
            checked={!isUpdate}
            onChange={() => setIsUpdate(false)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <span>Set</span>
        </label>
        <label className="flex items-center space-x-2 text-black">
          <input
            type="radio"
            name="mode"
            value="update"
            checked={isUpdate}
            onChange={() => setIsUpdate(true)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <span>Update</span>
        </label>
      </div>

      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          value={withdrawalPassword}
          onChange={(e) => setWithdrawalPassword(e.target.value)}
          placeholder="Enter withdrawal password"
          className="w-full p-2 border rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? 'Saving...' : isUpdate ? 'Update Password' : 'Set Password'}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </form>
  );
}
