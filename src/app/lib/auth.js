import jwt from "jsonwebtoken";

/**
 * Validates a JWT token and returns the decoded payload if valid.
 * @param {string} token - The JWT token.
 * @returns {Object|null} - Decoded token payload (e.g., user info) if valid, otherwise null.
 */
export const validateToken = async (token) => {
  try {
    if (!token) {
      console.log("❌ No token provided.");
      return null;
    }
    
    // Verify token; jwt.verify will throw an error if invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("✅ Token valid, decoded payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Token validation error:", error);
    return null;
  }
};