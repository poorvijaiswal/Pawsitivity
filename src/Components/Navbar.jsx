// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logoImage from '../assets/Pawsitivity_logo.png';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, userType, onLogout }) {
  const [open, setOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <nav className="bg-black backdrop-blur-sm shadow-md z-50 relative">
      <div className="flex justify-between items-center bg-white px-6 py-1 ">
        <img 
          src={logoImage} 
          alt="Pawsitivity Logo" 
          className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />

        {/* Hamburger */}
        <div 
          className={`md:hidden text-3xl cursor-pointer transition-transform duration-300 ${open ? 'rotate-90' : ''}`} 
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </div>

        {/* Links Desktop */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-semibold">
          <li className="hover:text-pink-500 cursor-pointer">Home</li>
          <li className="hover:text-pink-500 cursor-pointer">Shop</li>
          <li className="hover:text-pink-500 cursor-pointer">About Us</li>
          {/* <li className="hover:text-pink-500 cursor-pointer">Impact</li> */}
          <li className="hover:text-pink-500 cursor-pointer">Contact</li>
        </ul>
        
        {/* Login/User Button */}
        <div className="user-menu-container relative">
          {isLoggedIn ? (
            <div className="flex items-center">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-full transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle className="text-lg" />
                <span className="font-medium">{userType === 'admin' ? 'Admin' : 'My Account'}</span>
              </motion.button>
              
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-100 text-sm font-medium text-gray-600">
                    {userType === 'admin' ? 'Admin Panel' : 'My Account'}
                  </div>
                  <ul className="py-2">
                    {userType === 'admin' && (
                      <li className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm cursor-pointer">
                        Dashboard
                      </li>
                    )}
                    <li className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm cursor-pointer">
                      My Orders
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm cursor-pointer">
                      Settings
                    </li>
                    <li 
                      onClick={onLogout}
                      className="px-4 py-2 hover:bg-red-50 text-red-600 text-sm cursor-pointer flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Sign Out
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-6 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/98 rounded-lg shadow-lg overflow-hidden z-50"
        >
          <motion.ul
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex flex-col py-4"
          >
            {["Home", "Shop", "About Us", "Contact"].map((item, idx) => (
              <motion.li 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="px-6 py-3 text-gray-700 font-medium hover:bg-white hover:text-pink-500 cursor-pointer transition-all duration-200 border-b border-pink-100"
              >
                {item}
              </motion.li>
            ))}
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate('/login')}
              className="px-6 py-3 text-pink-600 font-medium hover:bg-pink-50 cursor-pointer transition-all duration-200 border-b-0"
            >
              {isLoggedIn ? 'My Account' : 'Login / Sign Up'}
            </motion.li>
          </motion.ul>
        </motion.div>
      )}
    </nav>
  );
}
