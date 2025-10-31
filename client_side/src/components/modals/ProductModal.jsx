import React, { useState, useEffect } from 'react';
import { FiX, FiImage, FiHash, FiTag, FiPackage, FiDollarSign } from 'react-icons/fi';

const ProductModal = ({ isOpen, onClose, onSubmit, productData = null, title = "Add Product" }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    images: [],
    category: '',
    metalType: '',
    purity: '',
    weight: '',
    metalColor: 'yellow',
    stoneType: '',
    stoneWeight: '',
    stoneCount: '',
    makingChargePercent: 10,
    wastagePercent: 5,
    gstPercent: 3,
    fixedCharges: 0,
    shop: ''
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        sku: productData.sku || '',
        description: productData.description || '',
        images: productData.images || [],
        category: productData.category || '',
        metalType: productData.metalType || '',
        purity: productData.purity || '',
        weight: productData.weight || '',
        metalColor: productData.metalColor || 'yellow',
        stoneType: productData.stoneType || '',
        stoneWeight: productData.stoneWeight || '',
        stoneCount: productData.stoneCount || '',
        makingChargePercent: productData.makingChargePercent || 10,
        wastagePercent: productData.wastagePercent || 5,
        gstPercent: productData.gstPercent || 3,
        fixedCharges: productData.fixedCharges || 0,
        shop: productData.shop || ''
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        sku: '',
        description: '',
        images: [],
        category: '',
        metalType: '',
        purity: '',
        weight: '',
        metalColor: 'yellow',
        stoneType: '',
        stoneWeight: '',
        stoneCount: '',
        makingChargePercent: 10,
        wastagePercent: 5,
        gstPercent: 3,
        fixedCharges: 0,
        shop: ''
      });
    }
    setErrors({});
  }, [productData, isOpen]);

  const handleChange = (e) => {
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

    // Required field validations
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.metalType) newErrors.metalType = 'Metal type is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';

    // If required fields are missing, don't do format validations
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Format validations
    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
      newErrors.weight = 'Weight must be a positive number';
    }

    if (formData.stoneWeight && (isNaN(formData.stoneWeight) || parseFloat(formData.stoneWeight) < 0)) {
      newErrors.stoneWeight = 'Stone weight must be a positive number';
    }

    if (formData.stoneCount && (isNaN(formData.stoneCount) || parseInt(formData.stoneCount) < 0)) {
      newErrors.stoneCount = 'Stone count must be a positive number';
    }

    if (formData.makingChargePercent && (isNaN(formData.makingChargePercent) || formData.makingChargePercent < 0 || formData.makingChargePercent > 100)) {
      newErrors.makingChargePercent = 'Making charge must be between 0-100%';
    }

    if (formData.wastagePercent && (isNaN(formData.wastagePercent) || formData.wastagePercent < 0 || formData.wastagePercent > 100)) {
      newErrors.wastagePercent = 'Wastage percent must be between 0-100%';
    }

    if (formData.gstPercent && (isNaN(formData.gstPercent) || formData.gstPercent < 0 || formData.gstPercent > 100)) {
      newErrors.gstPercent = 'GST percent must be between 0-100%';
    }

    if (formData.fixedCharges && (isNaN(formData.fixedCharges) || parseFloat(formData.fixedCharges) < 0)) {
      newErrors.fixedCharges = 'Fixed charges must be a positive number';
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
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-auto transform transition-all duration-300 ease-out">
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiHash className="w-4 h-4 inline mr-2" />
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.sku ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter SKU (optional)"
              />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
              placeholder="Enter product description"
            />
          </div>

          {/* Category and Metal Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiTag className="w-4 h-4 inline mr-2" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                <option value="ring">Ring</option>
                <option value="necklace">Necklace</option>
                <option value="bangle">Bangle</option>
                <option value="earring">Earring</option>
                <option value="pendant">Pendant</option>
                <option value="chain">Chain</option>
                <option value="bracelet">Bracelet</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metal Type *
              </label>
              <select
                name="metalType"
                value={formData.metalType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.metalType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select metal type</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="diamond">Diamond</option>
                <option value="platinum">Platinum</option>
              </select>
              {errors.metalType && <p className="text-red-500 text-xs mt-1">{errors.metalType}</p>}
            </div>
          </div>

          {/* Purity and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purity
              </label>
              <select
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
              >
                <option value="">Select purity</option>
                <option value="18K">18K</option>
                <option value="22K">22K</option>
                <option value="24K">24K</option>
                <option value="14K">14K</option>
                <option value="10K">10K</option>
                <option value="916">916</option>
                <option value="750">750</option>
                <option value="585">585</option>
                <option value="375">375</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPackage className="w-4 h-4 inline mr-2" />
                Weight (grams) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.weight ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter weight in grams"
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>
          </div>

          {/* Stone Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stone Type
              </label>
              <input
                type="text"
                name="stoneType"
                value={formData.stoneType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
                placeholder="Enter stone type"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stone Weight (carats)
              </label>
              <input
                type="number"
                name="stoneWeight"
                value={formData.stoneWeight}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.stoneWeight ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter stone weight"
              />
              {errors.stoneWeight && <p className="text-red-500 text-xs mt-1">{errors.stoneWeight}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stone Count
              </label>
              <input
                type="number"
                name="stoneCount"
                value={formData.stoneCount}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.stoneCount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter stone count"
              />
              {errors.stoneCount && <p className="text-red-500 text-xs mt-1">{errors.stoneCount}</p>}
            </div>
          </div>

          {/* Pricing Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="w-4 h-4 inline mr-2" />
                Making Charge (%)
              </label>
              <input
                type="number"
                name="makingChargePercent"
                value={formData.makingChargePercent}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.makingChargePercent ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="10"
              />
              {errors.makingChargePercent && <p className="text-red-500 text-xs mt-1">{errors.makingChargePercent}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wastage (%)
              </label>
              <input
                type="number"
                name="wastagePercent"
                value={formData.wastagePercent}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.wastagePercent ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="5"
              />
              {errors.wastagePercent && <p className="text-red-500 text-xs mt-1">{errors.wastagePercent}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST (%)
              </label>
              <input
                type="number"
                name="gstPercent"
                value={formData.gstPercent}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.gstPercent ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="3"
              />
              {errors.gstPercent && <p className="text-red-500 text-xs mt-1">{errors.gstPercent}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fixed Charges
              </label>
              <input
                type="number"
                name="fixedCharges"
                value={formData.fixedCharges}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.fixedCharges ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.fixedCharges && <p className="text-red-500 text-xs mt-1">{errors.fixedCharges}</p>}
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
              {productData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
