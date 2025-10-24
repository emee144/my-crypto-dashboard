"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [tronAddress, setTronAddress] = useState("");
  const [ethAddress, setEthAddress] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Avoid SSR hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data?.user) {
          console.log("User is logged in:", data.user);
          window.location.href = "/dashboard"; // ✅ Not router.push
        } else {
          console.log("User not logged in");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [router]);
  
useEffect(() => {
  try {
    const ref = searchParams.get("ref");

    if (ref && /^\d{8}$/.test(ref)) {
      localStorage.setItem("referrer", ref);
      setReferralCode(ref);
    } else {
      const savedReferrer = localStorage.getItem("referrer");
      setReferralCode(savedReferrer || "");
    }
  } catch (err) {
    // silently fail
  }
}, [isLogin, searchParams?.toString()]); // ✅ stable dependency


  

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  const normalizeEmail = (email) => email.trim().toLowerCase();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    const formData = { email: normalizedEmail, password };
    if (!isLogin && referralCode) formData.referralCode = referralCode;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(isLogin ? "/api/auth/login" : "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/dashboard"; 
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 px-4 py-5 pb-30">
      {/* Hamburger Menu */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-white text-2xl font-bold">Crypto Login</h1>
        <button onClick={toggleMenu} className="text-white md:hidden">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Hamburger Dropdown Menu (Mobile) */}
      {menuOpen && (
        <div className="md:hidden bg-white p-4 rounded shadow mb-4">
          <button
            onClick={() => {
              setIsLogin(true);
              toggleMenu();
            }}
            className="block w-full text-left px-4 py-2 cursor-pointer text-blue-600 font-semibold hover:bg-blue-50"
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              toggleMenu();
            }}
            className="block w-full text-left px-4 py-2 cursor-pointer text-green-600 font-semibold hover:bg-green-50"
          >
            Sign Up
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-10 items-center justify-center w-full max-w-6xl mx-auto">
        {/* Logo Section */}
        <div className="text-center hover:scale-105 transition-transform w-full md:w-auto">
          <Image
  src="/assets/bitcoin.svg"
  alt="Bitcoin"
  width={320}
  height={320}
  className="mx-auto w-80 h-80"
  priority
/>

          <p className="mt-2 font-medium text-gray-800 text-lg">Bitcoin</p>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md">
          {/* Desktop Toggle */}
          <div className="hidden md:flex gap-4 mb-4 justify-center">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                isLogin ? "bg-blue-600 text-white shadow" : "bg-white text-blue-600 border border-blue-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                !isLogin ? "bg-green-600 text-white shadow" : "bg-white text-green-600 border border-green-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Animated Form */}
          <div className="relative h-[460px]">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-0 left-0 w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl"
                >
                  <h2 className="text-2xl font-semibold text-center text-gray-700 mb-5">Login</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-600">Email:</label>
                      <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="w-full p-3 mt-1 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
/>

                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-500">Password:</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full p-3 mt-1 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="rememberMe" className=" block text-gray-600 mb-2"> 
                      <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)} // Update rememberMe state
                      />
                      Remember Me
                      </label>
                    </div>
                        {/* Forgot Password link */}
    <div className="mb-4 text-right">
      <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
        Forgot Password?
      </a>
    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-0 left-0 w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl"
                >
                  <h2 className="text-2xl font-semibold text-center text-gray-700 mb-5">Sign Up</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-600">Email:</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-600">Password:</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-600">Confirm Password:</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-600">Referral Code (optional):</label>
                      <input
                        type="text"
                        placeholder="Enter 8-digit referral code (optional)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        pattern="\d{0,8}"
                        maxLength={8}
                        className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-500 text-white cursor-pointer p-3 rounded-lg hover:bg-green-600 transition"
                      disabled={loading}
                    >
                      {loading ? "Signing up..." : "Sign Up"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;