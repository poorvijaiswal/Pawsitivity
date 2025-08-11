import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Signup from './Signup';
import { useAuth } from './AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [activeView, setActiveView] = useState('login'); // 'login' or 'signup'
  const { login, signup } = useAuth();

  const handleLoginSuccess = (userType) => {
    login({ 
      email: document.querySelector('input[name="email"]').value, 
      userType 
    });
    onClose();
  };

  const handleSignupSuccess = (userType) => {
    signup({ 
      email: document.querySelector('input[name="email"]').value,
      firstName: document.querySelector('input[name="firstName"]').value,
      lastName: document.querySelector('input[name="lastName"]').value, 
      userType 
    });
    onClose();
  };

  const handleSwitchToSignup = () => {
    setActiveView('signup');
  };

  const handleSwitchToLogin = () => {
    setActiveView('login');
  };

  const handleBackdropClick = (e) => {
    // Close modal only if the backdrop is clicked directly
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-gray-700 hover:text-gray-900 rounded-full p-2 transition-all z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {activeView === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Login 
                    onSwitchToSignup={handleSwitchToSignup} 
                    onLoginSuccess={handleLoginSuccess}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Signup 
                    onSwitchToLogin={handleSwitchToLogin}
                    onSignupSuccess={handleSignupSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
