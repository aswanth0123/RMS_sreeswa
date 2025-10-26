import React, { useState, useEffect } from 'react';
import { FiX, FiMapPin, FiClock, FiPhone, FiMail, FiHash, FiUser } from 'react-icons/fi';

const ShopModal = ({ isOpen, onClose, onSubmit, shopData = null, title = "Add Shop" }) => {
  const [formData, setFormData] = useState({
    shopname: '',
    place: '',
    location: '',
    shopid: '',
    openingTime: '',
    closingTime: '',
    phoneNumber: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstin: ''
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (shopData) {
      setFormData({
        shopname: shopData.shopname || '',
        place: shopData.place || '',
        location: shopData.location || '',
        shopid: shopData.shopid || '',
        openingTime: shopData.openingTime || '',
        closingTime: shopData.closingTime || '',
        phoneNumber: shopData.phoneNumber || '',
        mobile: shopData.mobile || '',
        email: shopData.email || '',
        password: '',
        confirmPassword: '',
        gstin: shopData.gstin || ''
      });
    } else {
      // Reset form for new shop
      setFormData({
        shopname: '',
        place: '',
        location: '',
        shopid: '',
        openingTime: '',
        closingTime: '',
        phoneNumber: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        gstin: ''
      });
    }
    setErrors({});
  }, [shopData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Live validation
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'mobile':
        if (value && !/^[0-9]{10}$/.test(value)) {
          newErrors.mobile = 'Mobile number must be exactly 10 digits';
        } else {
          delete newErrors.mobile;
        }
        break;
        
      case 'phoneNumber':
        if (value && value.trim() && !/^[0-9]{10}$/.test(value)) {
          newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
        } else {
          delete newErrors.phoneNumber;
        }
        break;
        
      case 'place':
        if (value && /^[0-9]+$/.test(value)) {
          newErrors.place = 'Place cannot contain only numbers';
        } else if (value && value.trim().length < 2) {
          newErrors.place = 'Place must be at least 2 characters';
        } else {
          delete newErrors.place;
        }
        break;
        
      case 'location':
        if (value && /^[0-9]+$/.test(value)) {
          newErrors.location = 'Location cannot contain only numbers';
        } else if (value && value.trim().length < 2) {
          newErrors.location = 'Location must be at least 2 characters';
        } else {
          delete newErrors.location;
        }
        break;
        
      case 'password':
        if (value && value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'Password must contain at least 1 lowercase, 1 uppercase letter and 1 number';
        } else {
          delete newErrors.password;
        }
        // Also validate confirm password if it exists
        if (formData.confirmPassword) {
          validateField('confirmPassword', formData.confirmPassword);
        }
        break;
        
      case 'confirmPassword':
        if (value && value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
        
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'gstin':
        if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
          newErrors.gstin = 'Please enter a valid GSTIN format';
        } else {
          delete newErrors.gstin;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.shopname.trim()) newErrors.shopname = 'Shop name is required';
    if (!formData.place.trim()) newErrors.place = 'Place is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.shopid.trim()) newErrors.shopid = 'Shop ID is required';
    if (!formData.openingTime) newErrors.openingTime = 'Opening time is required';
    if (!formData.closingTime) newErrors.closingTime = 'Closing time is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
    if (!formData.gstin.trim()) newErrors.gstin = 'GSTIN is required';

    // If required fields are missing, don't do format validations
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Format validations (phone number is optional)
    if (formData.phoneNumber && formData.phoneNumber.trim() && !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }

    if (formData.place && /^[0-9]+$/.test(formData.place)) {
      newErrors.place = 'Place cannot contain only numbers';
    }

    if (formData.location && /^[0-9]+$/.test(formData.location)) {
      newErrors.location = 'Location cannot contain only numbers';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 lowercase, 1 uppercase letter and 1 number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Please enter a valid GSTIN format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Shop Name and Shop ID Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                name="shopname"
                value={formData.shopname}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shopname ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter shop name"
              />
              {errors.shopname && <p className="text-red-500 text-xs mt-1">{errors.shopname}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiHash className="w-4 h-4 inline mr-2" />
                Shop ID
              </label>
              <input
                type="text"
                name="shopid"
                value={formData.shopid}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.shopid ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter shop ID"
              />
              {errors.shopid && <p className="text-red-500 text-xs mt-1">{errors.shopid}</p>}
            </div>
          </div>

          {/* Place and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="w-4 h-4 inline mr-2" />
                Place
              </label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.place ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter place"
              />
              {errors.place && <p className="text-red-500 text-xs mt-1">{errors.place}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* GSTIN Row */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GSTIN
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gstin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter GSTIN"
              />
              {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
            </div>
          </div>

          {/* Opening and Closing Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiClock className="w-4 h-4 inline mr-2" />
                Opening Time
              </label>
              <input
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.openingTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.openingTime && <p className="text-red-500 text-xs mt-1">{errors.openingTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiClock className="w-4 h-4 inline mr-2" />
                Closing Time
              </label>
              <input
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.closingTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.closingTime && <p className="text-red-500 text-xs mt-1">{errors.closingTime}</p>}
            </div>
          </div>

          {/* Phone, Mobile and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                maxLength={10}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="w-4 h-4 inline mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                maxLength={10}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter mobile number"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Password and Confirm Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {shopData ? 'Update Shop' : 'Add Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopModal;