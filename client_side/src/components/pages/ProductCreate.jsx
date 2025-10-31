import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud } from 'react-icons/fi';
import { createProduct } from '../../store/slices/productSlice';

const ProductCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const encoded = await Promise.all(files.map(f => toBase64(f)));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...encoded] }));
    setImagePreviews(prev => ([...prev, ...encoded]));
  };

  const removeImage = (idx) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.metalType) errs.metalType = 'Metal type is required';
    if (!formData.weight || Number(formData.weight) <= 0) errs.weight = 'Weight must be positive';
    if (formData.makingChargePercent < 0 || formData.makingChargePercent > 100) errs.makingChargePercent = '0-100%';
    if (formData.wastagePercent < 0 || formData.wastagePercent > 100) errs.wastagePercent = '0-100%';
    if (formData.gstPercent < 0 || formData.gstPercent > 100) errs.gstPercent = '0-100%';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(createProduct({
        ...formData,
        weight: Number(formData.weight),
        stoneWeight: formData.stoneWeight ? Number(formData.stoneWeight) : 0,
        stoneCount: formData.stoneCount ? Number(formData.stoneCount) : 0,
        makingChargePercent: Number(formData.makingChargePercent),
        wastagePercent: Number(formData.wastagePercent),
        gstPercent: Number(formData.gstPercent),
        fixedCharges: Number(formData.fixedCharges)
      })).unwrap();
      navigate('/products');
    } catch (err) {
      // handled by toasts in list page
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/products')} className="flex items-center text-gray-600 hover:text-gray-900">
          <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Products
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <div />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Enter product name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
            <input name="sku" value={formData.sku} onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" placeholder="Optional SKU" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" placeholder="Enter product description" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Metal Type *</label>
            <select name="metalType" value={formData.metalType} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.metalType ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
              <option value="">Select metal type</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="diamond">Diamond</option>
              <option value="platinum">Platinum</option>
            </select>
            {errors.metalType && <p className="text-red-500 text-xs mt-1">{errors.metalType}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purity</label>
            <select name="purity" value={formData.purity} onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams) *</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} step="0.01" min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.weight ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Enter weight in grams" />
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stone Type</label>
            <input name="stoneType" value={formData.stoneType} onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" placeholder="Enter stone type" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stone Weight (carats)</label>
            <input type="number" name="stoneWeight" value={formData.stoneWeight} onChange={handleChange} step="0.01" min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stoneWeight ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Enter stone weight" />
            {errors.stoneWeight && <p className="text-red-500 text-xs mt-1">{errors.stoneWeight}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stone Count</label>
            <input type="number" name="stoneCount" value={formData.stoneCount} onChange={handleChange} min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stoneCount ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Enter stone count" />
            {errors.stoneCount && <p className="text-red-500 text-xs mt-1">{errors.stoneCount}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FiUploadCloud className="w-8 h-8 mb-2" />
              <p className="text-sm">Drag & drop images here or click to upload</p>
              <input type="file" multiple accept="image/*" onChange={handleImages}
                className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group border rounded-md overflow-hidden">
                    <img src={src} alt={`preview-${idx}`} className="w-full h-28 object-cover" />
                    <button type="button" onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-600 text-xs px-2 py-1 rounded-md">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Making Charge (%)</label>
            <input type="number" name="makingChargePercent" value={formData.makingChargePercent} onChange={handleChange} min="0" max="100" step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.makingChargePercent ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.makingChargePercent && <p className="text-red-500 text-xs mt-1">{errors.makingChargePercent}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wastage (%)</label>
            <input type="number" name="wastagePercent" value={formData.wastagePercent} onChange={handleChange} min="0" max="100" step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.wastagePercent ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.wastagePercent && <p className="text-red-500 text-xs mt-1">{errors.wastagePercent}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST (%)</label>
            <input type="number" name="gstPercent" value={formData.gstPercent} onChange={handleChange} min="0" max="100" step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gstPercent ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.gstPercent && <p className="text-red-500 text-xs mt-1">{errors.gstPercent}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Charges</label>
            <input type="number" name="fixedCharges" value={formData.fixedCharges} onChange={handleChange} min="0" step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fixedCharges ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.fixedCharges && <p className="text-red-500 text-xs mt-1">{errors.fixedCharges}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
