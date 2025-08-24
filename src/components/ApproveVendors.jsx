import React, { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, Clock, Globe, AlertCircle, Eye, Mail, Phone, MapPin, Calendar, Building, X, Shield } from 'lucide-react';

const ApproveVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [viewingVendor, setViewingVendor] = useState(null);
  const [filter, setFilter] = useState('PENDING');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actioningVendorId, setActioningVendorId] = useState(null);

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
      fetchVendors();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch('https://springapp-production.up.railway.app/admin/vendors', {
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
        throw new Error('Failed to fetch vendors');
      }
      
      const data = await response.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch vendors');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    setIsSubmitting(true);
    setActioningVendorId(vendorId);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`https://springapp-production.up.railway.app/admin/vendor/approve/${vendorId}`, {
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
          throw new Error('Vendor not found.');
        }
        throw new Error('Failed to approve vendor');
      }

      // Update local state
      setVendors(prevVendors => prevVendors.map(vendor => 
        vendor.id === vendorId 
          ? { ...vendor, approvalStatus: 'APPROVED', approvalDate: new Date().toISOString() }
          : vendor
      ));
      
      setMessage('Vendor approved successfully!');
      setError('');
      setViewingVendor(null);
    } catch (err) {
      setError(err.message || 'Failed to approve vendor. Please try again.');
    } finally {
      setIsSubmitting(false);
      setActioningVendorId(null);
    }
  };

  const handleReject = async (vendorId) => {
    setIsSubmitting(true);
    setActioningVendorId(vendorId);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`https://springapp-production.up.railway.app/admin/vendor/reject/${vendorId}`, {
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
          throw new Error('Vendor not found.');
        }
        throw new Error('Failed to reject vendor');
      }

      // Update local state
      setVendors(prevVendors => prevVendors.map(vendor => 
        vendor.id === vendorId 
          ? { ...vendor, approvalStatus: 'REJECTED', approvalDate: new Date().toISOString() }
          : vendor
      ));
      
      setMessage('Vendor rejected successfully!');
      setError('');
      setViewingVendor(null);
    } catch (err) {
      setError(err.message || 'Failed to reject vendor. Please try again.');
    } finally {
      setIsSubmitting(false);
      setActioningVendorId(null);
    }
  };

  const getStatusBadge = (approvalStatus) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Approved' },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'Pending Review' },
      'REJECTED': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, text: 'Rejected' },
      'SUSPENDED': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle, text: 'Suspended' }
    };
    
    const config = statusConfig[approvalStatus] || statusConfig['PENDING'];
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

  const filteredVendors = vendors.filter(vendor => {
    if (filter === 'ALL') return true;
    return vendor.approvalStatus === filter;
  });

  const getFilterCounts = () => {
    return {
      ALL: vendors.length,
      PENDING: vendors.filter(v => v.approvalStatus === 'PENDING').length,
      APPROVED: vendors.filter(v => v.approvalStatus === 'APPROVED').length,
      REJECTED: vendors.filter(v => v.approvalStatus === 'REJECTED').length
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
          <p className="text-gray-600 mb-6">Please login as an admin to manage vendors.</p>
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
          <p className="text-gray-600">You need administrator privileges to approve vendors.</p>
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
          <h2 className="text-xl font-semibold text-gray-800">Loading vendor applications...</h2>
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
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Vendor Approvals</h1>
                  <p className="text-white/90">Review and manage vendor applications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap gap-2">
              {['PENDING', 'ALL', 'APPROVED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'All Applications' : status}
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
        {filteredVendors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendor applications found</h3>
            <p className="text-gray-500">
              {filter === 'ALL' 
                ? 'There are no vendor applications yet.' 
                : `There are no ${filter.toLowerCase()} vendor applications.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {vendor.businessName || 'Unnamed Business'}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {vendor.user?.name || 'Business Owner'}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {getStatusBadge(vendor.approvalStatus)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{vendor.businessEmail || 'N/A'}</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{vendor.businessPhone || 'N/A'}</span>
                    </p>
                    <p className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>License: {vendor.businessLicenseNumber || 'N/A'}</span>
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 mb-6 space-y-1">
                    <p>Applied: {formatDate(vendor.createdAt)}</p>
                    <p>Last Updated: {formatDate(vendor.approvalDate || vendor.updatedAt)}</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setViewingVendor(vendor)}
                      className="w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    
                    {vendor.approvalStatus === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          disabled={isSubmitting && actioningVendorId === vendor.id}
                          className="flex-1 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting && actioningVendorId === vendor.id ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          disabled={isSubmitting && actioningVendorId === vendor.id}
                          className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting && actioningVendorId === vendor.id ? (
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

        {/* View Vendor Details Modal */}
        {viewingVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{viewingVendor.businessName || 'Unnamed Business'}</h2>
                      <p className="text-white/90">Vendor Application Details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingVendor(null)}
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
                        <Building className="h-5 w-5 mr-2 text-blue-600" />
                        Business Information
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Business Name:</span> {viewingVendor.businessName || 'N/A'}</p>
                        <p><span className="font-medium">Owner:</span> {viewingVendor.user?.name || 'N/A'}</p>
                        <p><span className="font-medium">License Number:</span> {viewingVendor.businessLicenseNumber || 'Not provided'}</p>
                        {viewingVendor.establishedYear && (
                          <p><span className="font-medium">Established:</span> {viewingVendor.establishedYear}</p>
                        )}
                        {viewingVendor.businessDescription && (
                          <p><span className="font-medium">Description:</span> {viewingVendor.businessDescription}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                        Legal Information
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Tax ID:</span> {viewingVendor.taxId || 'Not provided'}</p>
                        <p><span className="font-medium">License Number:</span> {viewingVendor.businessLicenseNumber || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-blue-600" />
                        Contact Information
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {viewingVendor.businessEmail || 'Not provided'}
                        </p>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {viewingVendor.businessPhone || 'Not provided'}
                        </p>
                        <p className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                          {viewingVendor.businessAddress || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Application Status
                      </h3>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-medium">Status:</span> {getStatusBadge(viewingVendor.approvalStatus)}</p>
                        <p><span className="font-medium">Applied:</span> {formatDate(viewingVendor.createdAt)}</p>
                        <p><span className="font-medium">Last Updated:</span> {formatDate(viewingVendor.approvalDate || viewingVendor.updatedAt)}</p>
                        {viewingVendor.approvedBy && (
                          <p><span className="font-medium">Approved By:</span> {viewingVendor.approvedBy.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons for pending vendors */}
                {viewingVendor.approvalStatus === 'PENDING' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleReject(viewingVendor.id)}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting && actioningVendorId === viewingVendor.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject Application
                      </button>
                      <button
                        onClick={() => handleApprove(viewingVendor.id)}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting && actioningVendorId === viewingVendor.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Vendor
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

export default ApproveVendors;
