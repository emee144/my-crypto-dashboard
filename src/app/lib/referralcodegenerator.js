// src/app/lib/referralCodeGenerator.js

// Function to generate an 8-digit numeric referral code
const generateReferralCode = () => {
    // Generate a random number between 10000000 and 99999999 (8 digits)
    const referralCode = Math.floor(10000000 + Math.random() * 90000000);
    return referralCode.toString();
  };
  
  export default generateReferralCode;
  