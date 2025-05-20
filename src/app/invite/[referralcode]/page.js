'use client';

import { useEffect, useState } from "react";
import { QRCode } from "react-qr-code"; // ❌ Incorrect import
import { useParams } from "next/navigation";

const ReferralPage = () => {
  const params = useParams();
  const [referralCode, setReferralCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (params?.referralcode) {
      setReferralCode(params.referralcode);
      setQrCodeUrl(`http://localhost:3000/invite/${params.referralcode}`);
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

  return (
    <div className="min-h-screen bg-gray-800 px-4 py-5">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl font-semibold mb-4">Referral Code</h1>

        <div className="mb-4">
          {qrCodeUrl && <QRCode value={qrCodeUrl} size={256} />}
        </div>

        <div className="mb-4">
          <p className="text-white font-medium">Referral Code: {referralCode}</p>
          <button
            onClick={handleCopyCode}
            className="mt-2 text-blue-500 underline hover:text-blue-700"
          >
            Copy Code
          </button>
        </div>

        {/* Referral Link */}
        <div className="mb-4">
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

        <div className="text-white mt-6">
          <p>Share your referral code with others to invite them!</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
