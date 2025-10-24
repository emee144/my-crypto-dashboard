'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Settings, ArrowRightLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();

        if (data.referralcode) {
          setReferralCode(data.referralcode);
        } else {
          setError('Referral code not found.');
        }
      } catch (err) {
        // silently fail, no referral code
      } finally {
        setLoading(false);
      }
    };

    fetchReferralCode();
  }, []);

  const handleInviteClick = () => {
    if (referralCode) {
      router.push(`/invite/${referralCode}`);
    } else {
      alert('Referral code is missing!');
    }
  };

  if (loading) return null;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-blue-950 px-4 py-2 shadow-xl z-50">
      <div className="flex justify-around items-center text-white">
        <FooterCard label="Assets" icon={<Wallet size={22} />} onClick={() => router.push('/assets')} />
        <FooterCard label="Settings" icon={<Settings size={22} />} onClick={() => router.push('/settings')} />
        <FooterCard label="Trade" icon={<ArrowRightLeft size={22} />} onClick={() => router.push('/trade')} />
        <FooterCard label="Invite" icon={<Users size={22} />} onClick={handleInviteClick} />
      </div>
    </footer>
  );
};

const FooterCard = ({ label, icon, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center justify-center px-3 py-2 cursor-pointer rounded-xl transition-all duration-200 hover:bg-blue-800"
    onClick={onClick}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {icon}
    </motion.div>
    <span className="text-xs mt-1">{label}</span>
  </motion.div>
);

export default Footer;
