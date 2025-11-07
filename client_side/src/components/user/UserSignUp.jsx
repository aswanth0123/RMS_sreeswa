import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'user',
      });

      if (response.data.success) {
        toast.success('Account created successfully! Please sign in.');
        navigate('/user/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
            JM
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all peer"
              placeholder=" "
              disabled={isLoading}
              required
            />
            <label
              htmlFor="fullName"
              className="absolute left-4 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-600"
            >
              Full Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all peer"
              placeholder=" "
              disabled={isLoading}
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-600"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all peer"
              placeholder=" "
              disabled={isLoading}
              required
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-600"
            >
              Password
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Must contain uppercase, lowercase, and a number
            </p>
          </div>

          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 pt-6 pb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all peer"
              placeholder=" "
              disabled={isLoading}
              required
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-4 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-600"
            >
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/user/login" className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;

