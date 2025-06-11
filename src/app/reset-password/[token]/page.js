'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setMessage('Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleReset} className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}