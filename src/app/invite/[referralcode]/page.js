'use client';
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamically import react-qr-code correctly
const QRCode = dynamic(
  () => import("react-qr-code").then((mod) => mod.default),
  { ssr: false }
);

const ReferralPage = () => {
  const params = useParams();
  const [referralCode, setReferralCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (params?.referralcode) {
      setReferralCode(params.referralcode);
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      setQrCodeUrl(`${baseUrl}/invite/${params.referralcode}`);
    }
  }, [params]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied to clipboard!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    alert("Referral link copied to clipboard!");
  };

  const handleQrClick = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    alert("Referral link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-800 px-4 py-5 flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl font-semibold mb-4">Referral Code</h1>

      <div 
        className="mb-4 cursor-pointer transition-transform duration-200 hover:scale-105 flex justify-center"
        onClick={handleQrClick}
      >
        {qrCodeUrl && (
          <div style={{ width: '80%', maxWidth: 300 }}>
            <QRCode
              value={qrCodeUrl}
              size={256}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        )}
      </div>
      <p className="text-white text-sm text-center mb-4">Click QR code to copy link</p>

      <div className="mb-4 text-center">
        <p className="text-white font-medium">Referral Code: {referralCode}</p>
        <button
          onClick={handleCopyCode}
          className="mt-2 text-blue-500 underline hover:text-blue-700"
        >
          Copy Code
        </button>
      </div>

      <div className="mb-4 text-center">
        <p className="text-white font-medium">
          Referral Link:{" "}
          <span className="text-blue-400 underline break-all">{qrCodeUrl}</span>
        </p>
        <button
          onClick={handleCopyLink}
          className="mt-2 text-blue-500 underline hover:text-blue-700"
        >
          Copy Link
        </button>
      </div>

      <div className="text-white mt-6 text-center mb-20">
        <p>Share your referral code with others to invite them!</p>
      </div>
    </div>
  );
};

export default ReferralPage;