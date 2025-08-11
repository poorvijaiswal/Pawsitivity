import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic for admin only
      const isValidAdmin = formData.email === 'admin@pawsitivity.com' && formData.password === 'admin123';

      if (isValidAdmin) {
        // Login via context
        login({
          email: formData.email,
          userType: 'admin',
          isAuthenticated: true
        });

        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setErrors({ submit: 'Invalid admin credentials. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ...existing code...
  return (
    <div className="h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md h-fit max-h-[95vh] overflow-y-auto"
      >
        {/* Header - very compact */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 text-center rounded-t-2xl">
          <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          <p className="text-yellow-100 text-xs">Sign in to access admin dashboard</p>
        </div>

        {/* Form - compact */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your admin email"
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="md:px-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                >
                  {errors.submit}
                </motion.div>
              </div>
            )}

            {/* Submit Button */}
            <div className="md:px-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-lg hover:shadow-xl'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Admin Sign In'
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="mb-4 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
              >
                Back to User Login
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
  // ...existing code...
}
