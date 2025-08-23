// api.js
const API_BASE_URL = 'http://localhost:8080';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Auth API functions
export const authAPI = {
  // User login
  userLogin: (email, password) => 
    apiCall('/auth/user/login', {
      method: 'POST',
      body: { email, password }
    }),

  // Vendor login
  vendorLogin: (email, password) => 
    apiCall('/auth/vendor/login', {
      method: 'POST',
      body: { email, password }
    }),

  // User registration
  userRegister: (userData) => 
    apiCall('/auth/user/register', {
      method: 'POST',
      body: userData
    }),

  // Vendor registration
  vendorRegister: (vendorData) => 
    apiCall('/auth/vendor/register', {
      method: 'POST',
      body: vendorData
    }),
};

// Store token in localStorage
export const setAuthToken = (token,role,id) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem((role === 'USER' ? 'userId' : 'vendorId'),id);
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Remove token from localStorage (logout)
export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId' || 'vendorId');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};