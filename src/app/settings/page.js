'use client';
import { motion } from 'framer-motion';
import { Lock, Wallet, KeyRound } from 'lucide-react';
import BindWithdrawalAddress from './bindWithdrawalAddress';
import ChangePasswordForm from '../components/ChangePasswordForm';
import SetOrUpdateWithdrawalPasswordForm from './setOrUpdateWithdrawalPasswordForm';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl mb-10"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Settings</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Password Forms */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-gray-800 p-6 rounded-xl shadow-md transition-all flex flex-col gap-6 mb-6 md:mb-0"
          >
            {/* Change Password */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="text-orange-400" />
                <h3 className="text-xl font-semibold">Change Login Password</h3>
              </div>
              <ChangePasswordForm />
            </div>

            {/* Set or Update Withdrawal Password */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <KeyRound className="text-blue-400" />
                <h3 className="text-xl font-semibold">Set or Update Withdrawal Password</h3>
              </div>
              <SetOrUpdateWithdrawalPasswordForm /> 
            </div>
          </motion.div>

          {/* Right Column: Bind Withdrawal Address */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-gray-800 p-6 rounded-xl shadow-md transition-all mb-6 md:mb-0"
          >
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="text-green-400" />
              <h3 className="text-xl font-semibold">Bind Withdrawal Address</h3>
            </div>
            <BindWithdrawalAddress />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
