import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone, Store, UserCheck, FileText, Hash, MapPin, Building } from 'lucide-react';
import { authAPI, setAuthToken } from '../utils/api'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
export default function UserAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [vendorSignupData, setVendorSignupData] = useState({
    businessName: '',
    businessLicenseNumber: '',
    taxId: '',
    businessAddress: '',
    businessDescription: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    
    if (name in vendorSignupData) {
      setVendorSignupData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setSignupData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    
    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    
    if (!signupData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (signupData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(signupData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number and special character';
    }
    
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!signupData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(signupData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (userType === 'vendor') {
      if (!vendorSignupData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      
      if (!vendorSignupData.businessLicenseNumber.trim()) {
        newErrors.businessLicenseNumber = 'Business license number is required';
      }
      
      if (!vendorSignupData.taxId.trim()) {
        newErrors.taxId = 'Tax ID is required';
      }
      
      if (!vendorSignupData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleLogin = async () => {
  if (!validateLogin()) return;
  
  setIsLoading(true);
  setErrors({});
  setSuccessMessage('');
  
  try {
    let response;
    if (userType === 'vendor') {
      response = await authAPI.vendorLogin(loginData.email, loginData.password);
    } else {
      response = await authAPI.userLogin(loginData.email, loginData.password);
    }
    
    setAuthToken(response.token,(userType === 'vendor' ? 'VENDOR' : 'USER'),response.userId || response.vendorId);
    setSuccessMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} login successful!`);
    
    // Reset form
    setLoginData({ email: '', password: '' });
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      if(localStorage.getItem('role') === 'USER') 
      window.location.href = '/'; // This will redirect to home and refresh the page
      else if(localStorage.getItem('role') === 'VENDOR') 
      window.location.href = '/add-snack'; // This will redirect to home and refresh the page
      else if(localStorage.getItem('role') === 'ADMIN' || 'PRODUCT_MANAGER') 
      window.location.href = '/approve-vendors'; // This will redirect to home and refresh the page
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    setErrors({ general: error.message || 'Login failed. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};

  const handleSignup = async () => {
    if (!validateSignup()) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      if (userType === 'vendor') {
        const vendorData = {
          userRegisterRequest: {
            username: signupData.username,
            email: signupData.email,
            password: signupData.password,
            phoneNumber: signupData.phoneNumber
          },
          businessName: vendorSignupData.businessName,
          businessLicenseNumber: vendorSignupData.businessLicenseNumber,
          taxId: vendorSignupData.taxId,
          businessAddress: vendorSignupData.businessAddress,
          businessDescription: vendorSignupData.businessDescription
        };
        
        await authAPI.vendorRegister(vendorData);
      } else {
        const userData = {
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          phoneNumber: signupData.phoneNumber
        };
        
        await authAPI.userRegister(userData);
      }
      
      setSuccessMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} account created successfully!`);
      
      // Reset forms
      setSignupData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
      });
      
      if (userType === 'vendor') {
        setVendorSignupData({
          businessName: '',
          businessLicenseNumber: '',
          taxId: '',
          businessAddress: '',
          businessDescription: ''
        });
      }
      
      // Switch to login tab after successful registration
      setTimeout(() => setActiveTab('login'), 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setLoginData({ email: '', password: '' });
    setSignupData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: ''
    });
    setVendorSignupData({
      businessName: '',
      businessLicenseNumber: '',
      taxId: '',
      businessAddress: '',
      businessDescription: ''
    });
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const switchUserType = (type) => {
    setUserType(type);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* User Type Toggle */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1">
            <div className="flex rounded-xl bg-white/10 p-1">
              <button
                onClick={() => switchUserType('user')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  userType === 'user'
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                User
              </button>
              <button
                onClick={() => switchUserType('vendor')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  userType === 'vendor'
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Store className="w-4 h-4 mr-2" />
                Vendor
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {userType === 'vendor' ? (
                  <Store className="w-8 h-8 text-white" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {activeTab === 'login' ? 'Welcome Back' : 'Join Us'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'login' 
                  ? `Sign in to your ${userType} account`
                  : `Create your ${userType} account`
                }
              </p>
            </div>

            {/* Success and Error Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => switchTab('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchTab('signup')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-500 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    `Sign In as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
                  )}
                </button>
              </div>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="signup-username"
                      name="username"
                      value={signupData.username}
                      onChange={handleSignupChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="signup-email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="signup-phone"
                      name="phoneNumber"
                      value={signupData.phoneNumber}
                      onChange={handleSignupChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="signup-confirm-password"
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Vendor-specific fields */}
                {userType === 'vendor' && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-green-600" />
                        Business Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="business-name"
                              name="businessName"
                              value={vendorSignupData.businessName}
                              onChange={handleSignupChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                errors.businessName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter your business name"
                            />
                          </div>
                          {errors.businessName && (
                            <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="business-license" className="block text-sm font-medium text-gray-700 mb-2">
                            Business License Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="business-license"
                              name="businessLicenseNumber"
                              value={vendorSignupData.businessLicenseNumber}
                              onChange={handleSignupChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                errors.businessLicenseNumber ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter business license number"
                            />
                          </div>
                          {errors.businessLicenseNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.businessLicenseNumber}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="tax-id" className="block text-sm font-medium text-gray-700 mb-2">
                            Tax ID
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Hash className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="tax-id"
                              name="taxId"
                              value={vendorSignupData.taxId}
                              onChange={handleSignupChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                errors.taxId ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter tax ID"
                            />
                          </div>
                          {errors.taxId && (
                            <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="business-address" className="block text-sm font-medium text-gray-700 mb-2">
                            Business Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea
                              id="business-address"
                              name="businessAddress"
                              value={vendorSignupData.businessAddress}
                              onChange={handleSignupChange}
                              rows={3}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                                errors.businessAddress ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter your business address"
                            />
                          </div>
                          {errors.businessAddress && (
                            <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="business-description" className="block text-sm font-medium text-gray-700 mb-2">
                            Business Description (Optional)
                          </label>
                          <textarea
                            id="business-description"
                            name="businessDescription"
                            value={vendorSignupData.businessDescription}
                            onChange={handleSignupChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            placeholder="Describe your business"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <button type="button" className="text-green-600 hover:text-green-500 font-medium">
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" className="text-green-600 hover:text-green-500 font-medium">
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    `Create ${userType.charAt(0).toUpperCase() + userType.slice(1)} Account`
                  )}
                </button>
              </div>
            )}

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => switchTab('signup')}
                      className="text-green-600 hover:text-green-500 font-medium"
                    >
                      Sign up here
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button 
                      onClick={() => switchTab('login')}
                      className="text-green-600 hover:text-green-500 font-medium"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}