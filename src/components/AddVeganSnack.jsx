import React, { useState } from 'react';
import { Leaf, X } from 'lucide-react';    //tested

export default function AddVeganSnack() {
const [form, setForm] = useState({
  snackName: '',
  snackType: '',
  description: '',
  ingredients: '',
  nutritionalInfo: '',
  quantity: '',
  price: '',
  expiryInMonths: '',
  sku: '',
  currentStock: '',
  reorderPoint: '',
  maxStock: '',
  productImageURL: '',
  vendorId: ''
  // ADD THESE THREE FIELDS:
  
});

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const validate = () => {
  const errs = {};
  if (!form.snackName.trim()) errs.snackName = 'Snack Name is required';
  if (!form.snackType.trim()) errs.snackType = 'Snack Type is required';
  if (!form.quantity) errs.quantity = 'Quantity is required';
  if (!form.price) errs.price = 'Price is required';
  if (form.price && form.price <= 0) errs.price = 'Price must be greater than 0';
  if (!form.expiryInMonths) errs.expiryInMonths = 'Expiry in months is required';
  if (form.expiryInMonths && form.expiryInMonths <= 0) errs.expiryInMonths = 'Expiry must be greater than 0';
  if (!form.ingredients.trim()) errs.ingredients = 'Ingredients are required';
  if (!form.description.trim()) errs.description = 'Description is required';
  if (!form.nutritionalInfo.trim()) errs.nutritionalInfo = 'Nutritional information is required';
  if (!form.sku.trim()) errs.sku = 'SKU is required';
  if (!form.reorderPoint) errs.reorderPoint = 'Reorder point is required';
  if (form.reorderPoint <= 0) errs.reorderPoint = 'Reorder point must be greater than 0';
  if (!form.maxStock) errs.maxStock = 'Max stock is required';
  if (form.maxStock <= 0) errs.maxStock = 'Max stock must be greater than 0';
  if (Number(form.maxStock) < Number(form.reorderPoint)) {
    errs.maxStock = 'Max stock must be greater than reorder point';
  }
  
  return errs;  // This line was missing
};  // This closing brace and semicolon were missing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Update image preview when URL changes
    if (name === 'productImageURL') {
      setImagePreview(value);
    }
    
    setMessage('');
  };

  const removeImage = () => {
    setImagePreview('');
    setForm({...form, productImageURL: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setMessage('');

    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Please login first');
        }

        // Get vendorId from localStorage
        const vendorId = localStorage.getItem('vendorId');
        if (!vendorId) {
          throw new Error('Vendor information not found. Please login again.');
        }

        // Prepare data for submission
        const dataToSend = {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
          expiryInMonths: Number(form.expiryInMonths),
          currentStock: Number(form.quantity),
        reorderPoint: Number(form.reorderPoint),
        maxStock: Number(form.maxStock),
          vendorId: vendorId,
        };

        const res = await fetch('https://vegansnackappbackend-production.up.railway.app/snacks', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataToSend),
        });

        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('Access denied. Please check if you have vendor permissions.');
          }
          if (res.status === 401) {
            throw new Error('Session expired. Please login again.');
          }
          const errorText = await res.text();
          throw new Error(errorText || 'Failed to submit snack');
        }

        const responseData = await res.json();
        
        setMessage('Snack submitted successfully! It will be reviewed soon.');
        setErrors({});
        // Reset form
        setForm({
           snackName: '',
  snackType: '',
  description: '',
  ingredients: '',
  nutritionalInfo: '',
  quantity: '',
  price: '',
  expiryInMonths: '',
  sku: '',
  currentStock: '',
  reorderPoint: '',
  maxStock: '',
  productImageURL: '',
  vendorId: ''
  // ADD THESE THREE FIELDS:
        });
        setImagePreview('');
      } catch (error) {
        setErrors({ submit: error.message || 'Submission failed. Please try again.' });
        setMessage('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Check if user is logged in as vendor
  const isVendor = localStorage.getItem('role') === 'VENDOR';
  const isAuthenticated = !!getAuthToken();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login as a vendor to add snacks.</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isVendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vendor Access Required</h2>
          <p className="text-gray-600">You need vendor privileges to add snacks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 py-24">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Add a Vegan Snack</h2>
            <p className="text-white/90">
              Share your favorite plant-based snack with our community
            </p>
          </div>

          <div className="p-8">
            {/* Success and Error Messages */}
            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {message}
              </div>
            )}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Snack Name */}
              <div>
                <label htmlFor="snackName" className="block text-sm font-medium text-gray-700 mb-2">
                  Snack Name *
                </label>
                <input
                  type="text"
                  id="snackName"
                  name="snackName"
                  value={form.snackName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.snackName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Crunchy Kale Chips"
                />
                {errors.snackName && <p className="mt-1 text-sm text-red-600">{errors.snackName}</p>}
              </div>

              {/* Snack Type */}
              <div>
                <label htmlFor="snackType" className="block text-sm font-medium text-gray-700 mb-2">
                  Snack Type *
                </label>
                <input
                  type="text"
                  id="snackType"
                  name="snackType"
                  value={form.snackType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.snackType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Chips, Cookies, Energy Bars"
                />
                {errors.snackType && <p className="mt-1 text-sm text-red-600">{errors.snackType}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the taste, texture, and what makes this snack special..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Ingredients */}
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients *
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  rows={3}
                  value={form.ingredients}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.ingredients ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="List all ingredients, separated by commas"
                />
                {errors.ingredients && <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>}
              </div>

              {/* Nutritional Info */}
              <div>
                <label htmlFor="nutritionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                  Nutritional Information *
                </label>
                <textarea
                  id="nutritionalInfo"
                  name="nutritionalInfo"
                  rows={2}
                  value={form.nutritionalInfo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.nutritionalInfo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Calories, protein, carbs, etc. per serving"
                />
                {errors.nutritionalInfo && <p className="mt-1 text-sm text-red-600">{errors.nutritionalInfo}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 100"
                  />
                  {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 4.99"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                {/* Expiry */}
                <div>
                  <label htmlFor="expiryInMonths" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry (Months) *
                  </label>
                  <input
                    type="number"
                    id="expiryInMonths"
                    name="expiryInMonths"
                    min="1"
                    value={form.expiryInMonths}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.expiryInMonths ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 12"
                  />
                  {errors.expiryInMonths && <p className="mt-1 text-sm text-red-600">{errors.expiryInMonths}</p>}
                </div>
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.sku ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., VEG-CHIP-SLT-100G"
                />
                {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
              </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
 
  {/* Reorder Point */}
  <div>
    <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700 mb-2">
      Reorder Point *
    </label>
    <input
      type="number"
      id="reorderPoint"
      name="reorderPoint"
      min="1"
      value={form.reorderPoint}
      onChange={handleChange}
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
        errors.reorderPoint ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder="e.g., 10"
    />
    {errors.reorderPoint && <p className="mt-1 text-sm text-red-600">{errors.reorderPoint}</p>}
    <p className="mt-1 text-xs text-gray-500">Stock level that triggers a reorder alert</p>
  </div>

  {/* Max Stock */}
  <div>
    <label htmlFor="maxStock" className="block text-sm font-medium text-gray-700 mb-2">
      Max Stock *
    </label>
    <input
      type="number"
      id="maxStock"
      name="maxStock"
      min="1"
      value={form.maxStock}
      onChange={handleChange}
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
        errors.maxStock ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder="e.g., 100"
    />
    {errors.maxStock && <p className="mt-1 text-sm text-red-600">{errors.maxStock}</p>}
    <p className="mt-1 text-xs text-gray-500">Maximum storage capacity for this product</p>
  </div>
</div>
              {/* Image URL */}
              <div>
                <label htmlFor="productImageURL" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image URL
                </label>
                <input
                  type="url"
                  id="productImageURL"
                  name="productImageURL"
                  value={form.productImageURL}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
                
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-40 w-auto object-contain rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors transform translate-x-1/2 -translate-y-1/2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Add Vegan Snack'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>All snacks will be reviewed before being published to ensure they meet our quality standards.</p>
        </div>
      </div>
    </div>
  );}
