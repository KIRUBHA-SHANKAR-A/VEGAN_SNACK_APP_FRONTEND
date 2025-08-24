import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, Clock, Eye, AlertCircle, Calendar, User, X, Shield, MapPin, Mail, Phone, Building } from 'lucide-react';

const ApproveSnacks = () => {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [viewingSnack, setViewingSnack] = useState(null);
  const [filter, setFilter] = useState('PENDING_APPROVAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actioningSnackId, setActioningSnackId] = useState(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // Get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Check authentication and admin role
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN' || role === 'PRODUCT_MANAGER';
   const isAuthenticated = !!getAuthToken();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchSnacks();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchSnacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch('https://springapp-production.up.railway.app/admin/snacks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. Admin permissions required.');
        }
        throw new Error('Failed to fetch snacks');
      }
      
      const data = await response.json();
      setSnacks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch snacks');
      setSnacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (snackId) => {
    setIsSubmitting(true);
    setActioningSnackId(snackId);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`https://springapp-production.up.railway.app/admin/snack/approve/${snackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. Admin permissions required.');
        }
        if (response.status === 404) {
          throw new Error('Snack not found.');
        }
        throw new Error('Failed to approve snack');
      }

      // Update local state
      setSnacks(prevSnacks => prevSnacks.map(snack => 
        snack.id === snackId 
          ? { ...snack, status: 'APPROVED', approvalDate: new Date().toISOString() }
          : snack
      ));
      
      setMessage('Snack approved successfully!');
      setError('');
      setViewingSnack(null);
    } catch (err) {
      setError(err.message || 'Failed to approve snack. Please try again.');
    } finally {
      setIsSubmitting(false);
      setActioningSnackId(null);
    }
  };

  const handleReject = async (snackId) => {
    setIsSubmitting(true);
    setActioningSnackId(snackId);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`https://springapp-production.up.railway.app/admin/snack/reject/${snackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. Admin permissions required.');
        }
        if (response.status === 404) {
          throw new Error('Snack not found.');
        }
        throw new Error('Failed to reject snack');
      }

      // Update local state
      setSnacks(prevSnacks => prevSnacks.map(snack => 
        snack.id === snackId 
          ? { ...snack, status: 'REJECTED', approvalDate: new Date().toISOString() }
          : snack
      ));
      
      setMessage('Snack rejected successfully!');
      setError('');
      setViewingSnack(null);
    } catch (err) {
      setError(err.message || 'Failed to reject snack. Please try again.');
    } finally {
      setIsSubmitting(false);
      setActioningSnackId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Approved' },
      'PENDING_APPROVAL': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'Pending Review' },
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return typeof price === 'number' ? `$${price.toFixed(2)}` : `$${price}`;
  };

  const filteredSnacks = snacks.filter(snack => {
    if (filter === 'ALL') return true;
    return snack.status === filter;
  });

  const getFilterCounts = () => {
    return {
      ALL: snacks.length,
      PENDING_APPROVAL: snacks.filter(s => s.status === 'PENDING_APPROVAL').length,
      APPROVED: snacks.filter(s => s.status === 'APPROVED').length,
      REJECTED: snacks.filter(s => s.status === 'REJECTED').length
    };
  };

  const filterCounts = getFilterCounts();

  // Authentication checks
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login as an admin to manage snacks.</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
          <p className="text-gray-600">You need administrator privileges to approve snacks.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading snack applications...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-32">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Snack Approvals</h1>
                  <p className="text-white/90">Review and manage snack applications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap gap-2">
              {['PENDING_APPROVAL', 'ALL', 'APPROVED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'All Applications' : status.replace('_', ' ')}
                  <span className="ml-2 text-xs opacity-75">
                    ({filterCounts[status] || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {filteredSnacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No snack applications found</h3>
            <p className="text-gray-500">
              {filter === 'ALL' 
                ? 'There are no snack applications yet.' 
                : `There are no ${filter.replace('_', ' ').toLowerCase()} snack applications.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSnacks.map((snack) => (
              <div key={snack.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {snack.snackName || 'Unnamed Snack'}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        by {snack.vendor?.businessName || 'Unknown Vendor'}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {getStatusBadge(snack.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{snack.category || 'N/A'}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Type:</span> 
                      <span className="truncate">{snack.snackType || 'N/A'}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Price:</span> 
                      <span>{formatPrice(snack.price)}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Quantity:</span> 
                      <span>{snack.quantity || 0}</span>
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 mb-6 space-y-1">
                    <p>Created: {formatDate(snack.createdDate)}</p>
                    <p>Last Updated: {formatDate(snack.approvalDate || snack.lastModified)}</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setViewingSnack(snack)}
                      className="w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    
                    {snack.status === 'PENDING_APPROVAL' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(snack.id)}
                          disabled={isSubmitting && actioningSnackId === snack.id}
                          className="flex-1 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting && actioningSnackId === snack.id ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(snack.id)}
                          disabled={isSubmitting && actioningSnackId === snack.id}
                          className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting && actioningSnackId === snack.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Snack Details Modal */}
        {viewingSnack && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{viewingSnack.snackName || 'Unnamed Snack'}</h2>
                      <p className="text-white/90">Snack Application Details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingSnack(null)}
                    className="text-white/70 hover:text-white p-2 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-blue-600" />
                        Product Information
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Name:</span> {viewingSnack.snackName || 'N/A'}</p>
                        <p><span className="font-medium">Type:</span> {viewingSnack.snackType || 'N/A'}</p>
                        <p><span className="font-medium">Category:</span> {viewingSnack.category || 'N/A'}</p>
                        <p><span className="font-medium">Price:</span> {formatPrice(viewingSnack.price)}</p>
                        <p><span className="font-medium">Quantity:</span> {viewingSnack.quantity || 0}</p>
                        <p><span className="font-medium">Expiry (Months):</span> {viewingSnack.expiryInMonths || 'N/A'}</p>
                        <p><span className="font-medium">SKU:</span> {viewingSnack.sku || 'Not provided'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-blue-600" />
                        Vendor Information
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Business:</span> {viewingSnack.vendor?.businessName || 'Unknown'}</p>
                        <p><span className="font-medium">Owner:</span> {viewingSnack.vendor?.user?.name || 'N/A'}</p>
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {viewingSnack.vendor?.businessEmail || 'Not provided'}
                        </p>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {viewingSnack.vendor?.businessPhone || 'Not provided'}
                        </p>
                        {viewingSnack.vendor?.businessAddress && (
                          <p className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                            {viewingSnack.vendor.businessAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Application Status
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Status:</span> {getStatusBadge(viewingSnack.status)}</p>
                        <p><span className="font-medium">Created:</span> {formatDate(viewingSnack.createdDate)}</p>
                        <p><span className="font-medium">Last Modified:</span> {formatDate(viewingSnack.lastModified)}</p>
                        {viewingSnack.approvalDate && (
                          <p><span className="font-medium">Approval Date:</span> {formatDate(viewingSnack.approvalDate)}</p>
                        )}
                        {viewingSnack.approvedByUser && (
                          <p><span className="font-medium">Approved By:</span> {viewingSnack.approvedByUser.name}</p>
                        )}
                      </div>
                    </div>

                    {viewingSnack.description && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                          {viewingSnack.description}
                        </div>
                      </div>
                    )}

                    {viewingSnack.ingredients && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                          {viewingSnack.ingredients}
                        </div>
                      </div>
                    )}

                    {viewingSnack.nutritionalInfo && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Nutritional Information</h3>
                        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                          {viewingSnack.nutritionalInfo}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons for pending snacks */}
                {viewingSnack.status === 'PENDING_APPROVAL' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleReject(viewingSnack.id)}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting && actioningSnackId === viewingSnack.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject Application
                      </button>
                      <button
                        onClick={() => handleApprove(viewingSnack.id)}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting && actioningSnackId === viewingSnack.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Snack
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveSnacks;
