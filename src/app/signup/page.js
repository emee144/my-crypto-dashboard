'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import toast from "react-hot-toast";

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [ethAddress, setEthAddress] = useState('')
  const [tronAddress, setTronAddress] = useState('')

  const router = useRouter()

  useEffect(() => {
    const storedReferral = localStorage.getItem('uplineReferralCode')
    if (storedReferral) {
      setReferral(storedReferral)
    }
  }, [])

  const schema = z
    .object({
      email: z.string().email('Invalid email format').min(1, 'Email is required'),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    const normalizedEmail = email.trim().toLowerCase()

    const result = schema.safeParse({ email: normalizedEmail, password, confirmPassword })

    if (!result.success) {
      const errors = result.error.format()
      setError(
        errors.email?.[0] ||
        errors.password?.[0] ||
        errors.confirmPassword?.[0] ||
        'Validation error'
      )
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          referral: referral.trim() || null,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Sign-up successful! Redirecting...");
        localStorage.removeItem('uplineReferralCode') // ✅ Clear referral code

        // Set the Ethereum and TRON addresses from the response
        setEthAddress(data.user.ethAddress)
        setTronAddress(data.user.tronAddress)

        setTimeout(() => {
      window.location.href = "/dashboard"; 
     }, 3000);

        
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (error) {
      setError('Error connecting to the server')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }

  return (
    <div className="bg-gray-800 px-4 py-10 flex justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-10">

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-5">Sign Up</h2>

        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Password:</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-600">Confirm Password:</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {confirmPasswordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="mb-4">
            <label htmlFor="referral" className="block text-gray-600">Referral Code (optional):</label>
            <input
              type="text"
              id="referral"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={8}
              placeholder="Enter 8-digit code"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Show Ethereum and TRON Addresses After Successful Signup */}
        {ethAddress && (
          <div className="mt-4">
            <p className="text-green-500">Ethereum Address: {ethAddress}</p>
            <p className="text-green-500">TRON Address: {tronAddress}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignupPage
