
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Package, AlertCircle, Plus, Eye, Star, User, CheckCircle, XCircle, Clock, Leaf, X, MessageSquare } from 'lucide-react';

const SnackInventoryManager = () => {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingSnack, setEditingSnack] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [viewingSnack, setViewingSnack] = useState(null);
  const [viewingReviews, setViewingReviews] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [editErrors, setEditErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API base URL - replace with your actual backend URL
  const API_BASE_URL = 'http://localhost:8080';

  // Get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Check authentication and vendor role
  const isVendor = localStorage.getItem('role') === 'VENDOR';
  const isAuthenticated = !!getAuthToken();

  useEffect(() => {
    if (isAuthenticated && isVendor) {
      fetchUserSnacks();
    }
  }, [isAuthenticated, isVendor]);

  const fetchUserSnacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const vendorId = localStorage.getItem('vendorId');
      const response = await fetch(`${API_BASE_URL}/snacks/vendor/${vendorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch snacks');
      }

      const data = await response.json();
      
      // Ensure all inventory fields have proper default values
      const snacksWithDefaults = data.map(snack => ({
        id: snack.id || '',
        snackName: snack.snackName || '',
        snackType: snack.snackType || '',
        price: snack.price || 0,
        quantity: snack.quantity || 0,
        expiryInMonths: snack.expiryInMonths || 0,
        description: snack.description || '',
        ingredients: snack.ingredients || '',
        nutritionalInfo: snack.nutritionalInfo || '',
        sku: snack.sku || '',
        currentStock: snack.currentStock !== null && snack.currentStock !== undefined ? snack.currentStock : 0,
        reorderPoint: snack.reorderPoint !== null && snack.reorderPoint !== undefined ? snack.reorderPoint : 5,
        maxStock: snack.maxStock !== null && snack.maxStock !== undefined ? snack.maxStock : 100,
        productReviews: snack.productReviews || [],
        status: snack.status || 'PENDING_APPROVAL',
        createdDate: snack.createdDate,
        lastModified: snack.lastModified,
        approvalDate: snack.approvalDate
      }));
      
      setSnacks(snacksWithDefaults);
    } catch (err) {
      setError(err.message || 'Failed to fetch snacks');
    } finally {
      setLoading(false);
    }
  };

  const validateEdit = () => {
    const errs = {};
    if (!editingSnack.snackName.trim()) errs.snackName = 'Snack Name is required';
    if (!editingSnack.snackType.trim()) errs.snackType = 'Snack Type is required';
    if (!editingSnack.quantity) errs.quantity = 'Quantity is required';
    if (!editingSnack.price) errs.price = 'Price is required';
    if (editingSnack.price && editingSnack.price <= 0) errs.price = 'Price must be greater than 0';
    if (!editingSnack.expiryInMonths) errs.expiryInMonths = 'Expiry in months is required';
    if (editingSnack.expiryInMonths && editingSnack.expiryInMonths <= 0) errs.expiryInMonths = 'Expiry must be greater than 0';
    if (!editingSnack.ingredients.trim()) errs.ingredients = 'Ingredients are required';
    if (!editingSnack.description.trim()) errs.description = 'Description is required';
    if (!editingSnack.nutritionalInfo.trim()) errs.nutritionalInfo = 'Nutritional information is required';
    if (!editingSnack.sku.trim()) errs.sku = 'SKU is required';
    if (!editingSnack.reorderPoint) errs.reorderPoint = 'Reorder point is required';
    if (!editingSnack.maxStock) errs.maxStock = 'Max stock is required';
    
    return errs;
  };

  const handleEdit = (snack) => {
    setEditingSnack({ 
      ...snack,
      currentStock: snack.currentStock !== null && snack.currentStock !== undefined ? snack.currentStock : 0,
      reorderPoint: snack.reorderPoint !== null && snack.reorderPoint !== undefined ? snack.reorderPoint : 5,
      maxStock: snack.maxStock !== null && snack.maxStock !== undefined ? snack.maxStock : 100
    });
    setEditErrors({});
    setError('');
    setMessage('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    setEditingSnack(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setError('');
    setMessage('');
  };

  const handleSaveEdit = async () => {
    const errs = validateEdit();
    setEditErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Please login first');
        }
        
        if (!editingSnack.id) {
          throw new Error('Snack ID is missing. Cannot update.');
        }
        
        const dataToSend = {
          snackName: editingSnack.snackName,
          snackType: editingSnack.snackType,
          price: Number(editingSnack.price),
          quantity: Number(editingSnack.quantity),
          expiryInMonths: Number(editingSnack.expiryInMonths),
          description: editingSnack.description,
          ingredients: editingSnack.ingredients,
          nutritionalInfo: editingSnack.nutritionalInfo,
          sku: editingSnack.sku,
          currentStock: Number(editingSnack.currentStock),
          reorderPoint: Number(editingSnack.reorderPoint),
          maxStock: Number(editingSnack.maxStock)
        };

        const response = await fetch(`${API_BASE_URL}/snacks/${editingSnack.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to update snack ${editingSnack.id}`);
        }

        const updatedSnack = await response.json();
        
        // Update the state with the returned data from the server
        setSnacks(snacks.map(snack => 
          snack.id === updatedSnack.id ? {
            ...snack,
            ...updatedSnack,
            currentStock: updatedSnack.currentStock !== undefined ? updatedSnack.currentStock : snack.currentStock,
            reorderPoint: updatedSnack.reorderPoint !== undefined ? updatedSnack.reorderPoint : snack.reorderPoint,
            maxStock: updatedSnack.maxStock !== undefined ? updatedSnack.maxStock : snack.maxStock,
            quantity: updatedSnack.quantity !== undefined ? updatedSnack.quantity : snack.quantity,
            price: updatedSnack.price !== undefined ? updatedSnack.price : snack.price
          } : snack
        ));
        
        setEditingSnack(null);
        setEditErrors({});
        setMessage('Snack updated successfully!');
        setTimeout(() => {
          setMessage("");
        }, 3000);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to update snack. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (snackId) => {
    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please login first');
      }

      const response = await fetch(`${API_BASE_URL}/snacks/${snackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errorMessage = 'Failed to delete snack';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setSnacks(snacks.filter(snack => snack.id !== snackId));
      setShowDeleteModal(null);
      setMessage('Snack deleted successfully!');
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete snack. Please try again.');
      setShowDeleteModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Approved' },
      'PENDING_APPROVAL': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'Pending' },
      'REJECTED': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig['PENDING_APPROVAL'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getStockStatus = (currentStock, reorderPoint) => {
    const current = currentStock;
    const reorder = reorderPoint;
    
    if (current === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200' };
    if (current <= reorder) return { status: 'Low Stock', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { status: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSnacks = snacks.filter(snack => {
    if (filter === 'ALL') return true;
    return snack.status === filter;
  });

  // Authentication checks
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login as a vendor to manage your snacks.</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
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
          <p className="text-gray-600">You need vendor privileges to manage snacks.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading your snacks...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">My Snack Products</h1>
                  <p className="text-white/90">Manage your vegan snack inventory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap gap-2">
              {['ALL', 'APPROVED', 'PENDING_APPROVAL', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'All Products' : status.replace('_', ' ')}
                  <span className="ml-2 text-xs opacity-75">
                    ({status === 'ALL' ? snacks.length : snacks.filter(s => s.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Content */}
        {filteredSnacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No snacks found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first vegan snack product.</p>
            <button 
              onClick={() => window.location.href = '/add-snack'}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add Your First Snack
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSnacks.map((snack) => {
              const stockInfo = getStockStatus(snack.currentStock, snack.reorderPoint);
              const avgRating = getAverageRating(snack.productReviews);
              
              return (
                <div key={snack.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                        {snack.snackName}
                      </h3>
                      {getStatusBadge(snack.status)}
                    </div>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-800">Type:</span> {snack.snackType}</p>
                      <p><span className="font-medium text-gray-800">SKU:</span> {snack.sku}</p>
                      <p><span className="font-medium text-gray-800">Price:</span> <span className="text-green-600 font-semibold">${snack.price}</span></p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stockInfo.color}`}>
                        {stockInfo.status}: {snack.currentStock}
                      </span>
                      {avgRating > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">
                            {avgRating.toFixed(1)} ({snack.productReviews?.length || 0})
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {snack.description}
                    </p>

                    <div className="text-xs text-gray-500 mb-6 space-y-1">
                      <p>Created: {formatDate(snack.createdDate)}</p>
                      <p>Modified: {formatDate(snack.lastModified)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setViewingSnack(snack)}
                        className="bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => setViewingReviews(snack)}
                        className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 flex items-center justify-center transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Reviews ({snack.productReviews?.length || 0})
                      </button>
                      <button
                        onClick={() => handleEdit(snack)}
                        className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(snack.id)}
                        className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reviews Modal */}
        {viewingReviews && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{viewingReviews.snackName}</h2>
                      <p className="text-white/90">Customer Reviews & Feedback</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingReviews(null)}
                    className="text-white/70 hover:text-white p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {viewingReviews.productReviews && viewingReviews.productReviews.length > 0 ? (
                  <div className="space-y-6">
                    {/* Reviews Summary */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Reviews Overview</h3>
                          <p className="text-gray-600">Total Reviews: {viewingReviews.productReviews.length}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end mb-2">
                            <Star className="h-6 w-6 text-yellow-400 fill-current mr-2" />
                            <span className="text-2xl font-bold text-gray-900">
                              {getAverageRating(viewingReviews.productReviews).toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Average Rating</p>
                        </div>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                      {viewingReviews.productReviews.map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {review.customerName || 'Anonymous Customer'}
                                </p>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-500">
                                {review.reviewDate ? formatDate(review.reviewDate) : 'No date'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-gray-700 leading-relaxed">
                              {review.comment || 'No comment provided'}
                            </p>
                          </div>
                          
                          {review.helpfulCount !== undefined && (
                            <div className="flex items-center text-sm text-gray-500">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {review.helpfulCount} people found this helpful
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500">This product hasn't received any customer reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewingSnack && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{viewingSnack.snackName}</h2>
                      <p className="text-white/90">{viewingSnack.snackType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingSnack(null)}
                    className="text-white/70 hover:text-white p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-green-600" />
                        Product Details
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Type:</span> {viewingSnack.snackType}</p>
                        <p><span className="font-medium">SKU:</span> {viewingSnack.sku}</p>
                        <p><span className="font-medium">Price:</span> <span className="text-green-600 font-semibold">${viewingSnack.price}</span></p>
                        <p><span className="font-medium">Quantity:</span> {viewingSnack.quantity}</p>
                        <p><span className="font-medium">Expires in:</span> {viewingSnack.expiryInMonths} months</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{viewingSnack.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{viewingSnack.ingredients}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Nutritional Info</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{viewingSnack.nutritionalInfo}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Inventory Status</h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Current Stock:</span> {viewingSnack.currentStock}</p>
                        <p><span className="font-medium">Reorder Point:</span> {viewingSnack.reorderPoint}</p>
                        <p><span className="font-medium">Max Stock:</span> {viewingSnack.maxStock}</p>
                        <p><span className="font-medium">Last Updated:</span> {formatDate(viewingSnack.lastModified)}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Status & Dates</h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Status:</span> <span className="ml-2">{getStatusBadge(viewingSnack.status)}</span></p>
                        <p><span className="font-medium">Created:</span> {formatDate(viewingSnack.createdDate)}</p>
                        <p><span className="font-medium">Last Modified:</span> {formatDate(viewingSnack.lastModified)}</p>
                        {viewingSnack.approvalDate && (
                          <p><span className="font-medium">Approved:</span> {formatDate(viewingSnack.approvalDate)}</p>
                        )}
                      </div>
                    </div>

                    {/* Reviews Summary in View Modal */}
                    {viewingSnack.productReviews && viewingSnack.productReviews.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Star className="h-5 w-5 mr-2 text-yellow-400 fill-current" />
                          Customer Reviews Summary
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                              <span className="font-semibold text-lg">
                                {getAverageRating(viewingSnack.productReviews).toFixed(1)}
                              </span>
                              <span className="text-gray-600 ml-1">out of 5</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {viewingSnack.productReviews.length} review{viewingSnack.productReviews.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setViewingSnack(null);
                              setViewingReviews(viewingSnack);
                            }}
                            className="w-full bg-purple-50 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                          >
                            View All Reviews
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingSnack && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                      <Edit className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Edit Snack Product</h2>
                      <p className="text-white/90">Update your vegan snack details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingSnack(null)}
                    className="text-white/70 hover:text-white p-2 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Error Messages */}
                {Object.keys(editErrors).length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <p className="font-medium">Please fix the following errors:</p>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1 ml-6">
                      {Object.values(editErrors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                                        </ul>
                  </div>
                )}

                {/* Edit Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Snack Name *
                      </label>
                      <input
                        type="text"
                        name="snackName"
                        value={editingSnack.snackName}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.snackName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter snack name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Snack Type *
                      </label>
                      <input
                        type="text"
                        name="snackType"
                        value={editingSnack.snackType}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.snackType ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Cookies, Chips, Bars"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={editingSnack.price}
                        onChange={handleEditChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity Available *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={editingSnack.quantity}
                        onChange={handleEditChange}
                        min="0"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry (Months) *
                      </label>
                      <input
                        type="number"
                        name="expiryInMonths"
                        value={editingSnack.expiryInMonths}
                        onChange={handleEditChange}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.expiryInMonths ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU (Stock Keeping Unit) *
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={editingSnack.sku}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.sku ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Unique product code"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Stock *
                      </label>
                      <input
                        type="number"
                        name="currentStock"
                        value={editingSnack.currentStock}
                        onChange={handleEditChange}
                        min="0"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.currentStock ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Current inventory count"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reorder Point *
                      </label>
                      <input
                        type="number"
                        name="reorderPoint"
                        value={editingSnack.reorderPoint}
                        onChange={handleEditChange}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.reorderPoint ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Low stock alert threshold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Stock *
                      </label>
                      <input
                        type="number"
                        name="maxStock"
                        value={editingSnack.maxStock}
                        onChange={handleEditChange}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.maxStock ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Maximum storage capacity"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={editingSnack.description}
                        onChange={handleEditChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Describe your snack product"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingredients *
                      </label>
                      <textarea
                        name="ingredients"
                        value={editingSnack.ingredients}
                        onChange={handleEditChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.ingredients ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="List all ingredients (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nutritional Information *
                      </label>
                      <textarea
                        name="nutritionalInfo"
                        value={editingSnack.nutritionalInfo}
                        onChange={handleEditChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          editErrors.nutritionalInfo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nutrition facts and information"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setEditingSnack(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Update Snack
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                    <p className="text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this snack product? All associated data will be permanently removed.
                </p>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteModal)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnackInventoryManager;