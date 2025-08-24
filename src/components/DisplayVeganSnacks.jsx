import React, { useState, useEffect } from 'react';
import { Package, Star, Search, Filter, User, Eye, X, AlertCircle, CheckCircle } from 'lucide-react';

const DisplayVeganSnacks = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [categories, setCategories] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

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
  
  // Check authentication
  const isAuthenticated = !!getAuthToken();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Fetch approved products
      const response = await fetch('https://springapp-production.up.railway.app/snacks/approved', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      const approvedProducts = Array.isArray(data) ? data.filter(product => product.status === 'APPROVED') : [];
      setProducts(approvedProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(approvedProducts.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating, size = "h-4 w-4") => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.snackName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.vendor?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view products.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading delicious vegan snacks...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-white">Vegan Snacks</h1>
                  <p className="text-white/90 text-sm sm:text-base">Discover plant-based snacks</p>
                </div>
              </div>
              <div className="text-white text-left sm:text-right">
                <p className="text-sm opacity-90">Welcome back,</p>
                <p className="font-semibold">{currentUser.name || 'Guest'}</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 sm:p-6 border-b bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Search snacks, descriptions, or vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center text-sm sm:text-base">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center text-sm sm:text-base">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Debug info - remove in production
        {products.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
            <p>Debug: Found {filteredProducts.length} products</p>
            <p>First product structure: {JSON.stringify(products[0])}</p>
          </div>
        )} */}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchQuery || categoryFilter !== 'ALL' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No approved products are available yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                {/* Product Image - FIXED */}
                <div className="h-40 sm:h-48 bg-gray-100 relative overflow-hidden">
                  {product.productImage?.imageUrl && !imageErrors[product.id] ? (
                    <img 
                      src={product.productImage.imageUrl} 
                      alt={product.snackName}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(product.id)}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <Package className="h-10 w-10 sm:h-12 sm:w-12 text-white/80" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {product.category || 'Snack'}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {product.snackName || 'Unnamed Snack'}
                    </h3>
                  </div>

                  {/* <div className="flex items-center justify-between mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <div className="flex items-center">
                      {renderStars(getAverageRating(product.productReviews))}
                      <span className="ml-1 text-xs sm:text-sm text-gray-500">
                        ({product.productReviews?.length || 0})
                      </span>
                    </div>
                  </div> */}

                  <div className="space-y-1 mb-4 text-xs sm:text-sm text-gray-600">
                    {product.snackType && (
                      <p><span className="font-medium">Type:</span> {product.snackType}</p>
                    )}
                    <p><span className="font-medium">Stock:</span> {product.quantity || 0}</p>
                    {product.expiryInMonths && (
                      <p><span className="font-medium">Shelf Life:</span> {product.expiryInMonths} months</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-green-50 text-green-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 flex items-center justify-center transition-colors"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center max-w-[80%]">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="truncate">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{selectedProduct.snackName}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-white/70 hover:text-white p-1 sm:p-2 transition-colors"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-6">
                    {/* Product Image - FIXED */}
                    <div className="aspect-square bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden relative">
                      {selectedProduct.productImage?.imageUrl && !imageErrors[selectedProduct.id] ? (
                        <img 
                          src={selectedProduct.productImage.imageUrl} 
                          alt={selectedProduct.snackName}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(selectedProduct.id)}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-white/80" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-600" />
                        Product Information
                      </h3>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p><span className="font-medium">Price:</span> ${selectedProduct.price}</p>
                        <p><span className="font-medium">Type:</span> {selectedProduct.snackType || 'N/A'}</p>
                        <p><span className="font-medium">Category:</span> {selectedProduct.category || 'N/A'}</p>
                        <p><span className="font-medium">Available Stock:</span> {selectedProduct.quantity || 0}</p>
                        <p><span className="font-medium">Shelf Life:</span> {selectedProduct.expiryInMonths || 'N/A'} months</p>
                        <p><span className="font-medium">SKU:</span> {selectedProduct.sku || 'N/A'}</p>
                      </div>
                    </div>

                    {selectedProduct.description && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Description</h3>
                        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg">
                          {selectedProduct.description}
                        </div>
                      </div>
                    )}

                    {selectedProduct.ingredients && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Ingredients</h3>
                        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg">
                          {selectedProduct.ingredients}
                        </div>
                      </div>
                    )}

                    {selectedProduct.nutritionalInfo && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3">Nutritional Information</h3>
                        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg">
                          {selectedProduct.nutritionalInfo}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Reviews List */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">
                        Customer Reviews ({selectedProduct.productReviews?.length || 0})
                      </h3>
                      <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                        {selectedProduct.productReviews && selectedProduct.productReviews.length > 0 ? (
                          selectedProduct.productReviews.map((review, index) => (
                            <div key={index} className="bg-white border border-gray-200 p-3 sm:p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 text-xs sm:text-sm">{review.user?.name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">{review.createdAt}</p>
                                  </div>
                                </div>
                                {renderStars(review.rating, "h-4 w-4 sm:h-5 sm:w-5")}
                              </div>
                              <p className="text-gray-700 text-xs sm:text-sm">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-6 text-sm sm:text-base">
                            <p>No reviews yet for this product.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayVeganSnacks;


// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Star, 
//   ShoppingCart, 
//   Eye, 
//   Heart,
//   Clock,
//   DollarSign,
//   Package,
//   Tag,
//   MapPin,
//   Calendar,
//   ChevronDown,
//   Grid,
//   List,
//   SortAsc,
//   X
// } from 'lucide-react';

// export default function DisplayVeganSnacks() {
//   const [snacks, setSnacks] = useState([]);
//   const [filteredSnacks, setFilteredSnacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [sortBy, setSortBy] = useState('createdDate');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
//   const [showFilters, setShowFilters] = useState(false);
//   const [favorites, setFavorites] = useState(new Set());

//   // Mock data - replace with actual API call
//   const mockSnacks = [
//     {
//       id: 1,
//       snackName: "Organic Quinoa Crunch Bars",
//       snackType: "Protein Bar",
//       description: "Delicious protein-packed quinoa bars with almonds and dates. Perfect for post-workout nutrition.",
//       ingredients: "Quinoa, Almonds, Dates, Coconut Oil, Vanilla Extract",
//       nutritionalInfo: "Calories: 180, Protein: 8g, Carbs: 22g, Fat: 7g",
//       quantity: "12 bars per pack",
//       price: 24.99,
//       expiryInMonths: 12,
//       sku: "QCB-001",
//       status: "APPROVED",
//       createdDate: "2024-01-15T10:30:00",
//       lastModified: "2024-01-15T10:30:00",
//       approvalDate: "2024-01-16T09:00:00",
//       vendor: { id: 1, name: "GreenSnacks Co.", location: "California, USA" },
//       category: { id: 1, name: "Protein Bars" },
//       inventory: { id: 1, stockQuantity: 150, availabilityStatus: "IN_STOCK" },
//       productReviews: [
//         { id: 1, rating: 5, comment: "Amazing taste!" },
//         { id: 2, rating: 4, comment: "Great protein content" }
//       ]
//     },
//     {
//       id: 2,
//       snackName: "Coconut Energy Bites",
//       snackType: "Energy Snack",
//       description: "Raw coconut and cashew energy balls rolled in coconut flakes. Natural energy boost!",
//       ingredients: "Cashews, Coconut, Medjool Dates, Vanilla, Sea Salt",
//       nutritionalInfo: "Calories: 120, Protein: 4g, Carbs: 8g, Fat: 9g",
//       quantity: "20 pieces per container",
//       price: 18.99,
//       expiryInMonths: 6,
//       sku: "CEB-002",
//       status: "APPROVED",
//       createdDate: "2024-01-10T14:20:00",
//       lastModified: "2024-01-10T14:20:00",
//       approvalDate: "2024-01-11T11:30:00",
//       vendor: { id: 2, name: "Pure Energy Foods", location: "Oregon, USA" },
//       category: { id: 2, name: "Energy Snacks" },
//       inventory: { id: 2, stockQuantity: 85, availabilityStatus: "IN_STOCK" },
//       productReviews: [
//         { id: 3, rating: 5, comment: "Perfect for pre-workout!" },
//         { id: 4, rating: 5, comment: "Love the coconut flavor" }
//       ]
//     },
//     {
//       id: 3,
//       snackName: "Kale Chips Original",
//       snackType: "Chips",
//       description: "Crispy kale chips seasoned with nutritional yeast and sea salt. A healthy alternative to potato chips.",
//       ingredients: "Organic Kale, Nutritional Yeast, Sea Salt, Olive Oil",
//       nutritionalInfo: "Calories: 50, Protein: 3g, Carbs: 5g, Fat: 2g",
//       quantity: "85g bag",
//       price: 8.99,
//       expiryInMonths: 8,
//       sku: "KC-003",
//       status: "APPROVED",
//       createdDate: "2024-01-08T09:15:00",
//       lastModified: "2024-01-08T09:15:00",
//       approvalDate: "2024-01-09T16:45:00",
//       vendor: { id: 3, name: "Leafy Greens Ltd", location: "New York, USA" },
//       category: { id: 3, name: "Chips" },
//       inventory: { id: 3, stockQuantity: 200, availabilityStatus: "IN_STOCK" },
//       productReviews: [
//         { id: 5, rating: 4, comment: "Surprisingly addictive!" },
//         { id: 6, rating: 4, comment: "Great healthy snack option" }
//       ]
//     },
//     {
//       id: 4,
//       snackName: "Almond Butter Cookies",
//       snackType: "Cookie",
//       description: "Soft-baked cookies made with organic almond butter and sweetened with maple syrup.",
//       ingredients: "Almond Butter, Oat Flour, Maple Syrup, Coconut Oil, Vanilla",
//       nutritionalInfo: "Calories: 140, Protein: 5g, Carbs: 12g, Fat: 8g",
//       quantity: "8 cookies per pack",
//       price: 12.99,
//       expiryInMonths: 4,
//       sku: "ABC-004",
//       status: "PENDING_APPROVAL",
//       createdDate: "2024-01-20T11:00:00",
//       lastModified: "2024-01-20T11:00:00",
//       vendor: { id: 4, name: "Sweet Treats Bakery", location: "Texas, USA" },
//       category: { id: 4, name: "Cookies" },
//       inventory: { id: 4, stockQuantity: 75, availabilityStatus: "LOW_STOCK" },
//       productReviews: []
//     }
//   ];

//   const categories = ["Protein Bars", "Energy Snacks", "Chips", "Cookies", "Crackers", "Nuts & Seeds"];
//   const statuses = ["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED"];

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setSnacks(mockSnacks);
//       setFilteredSnacks(mockSnacks);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     let filtered = snacks.filter(snack => {
//       const matchesSearch = snack.snackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            snack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            snack.ingredients.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesCategory = !selectedCategory || snack.category?.name === selectedCategory;
//       const matchesStatus = !selectedStatus || snack.status === selectedStatus;
      
//       const matchesPrice = (!priceRange.min || snack.price >= parseFloat(priceRange.min)) &&
//                           (!priceRange.max || snack.price <= parseFloat(priceRange.max));
      
//       return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
//     });

//     // Sort filtered results
//     filtered.sort((a, b) => {
//       let aValue, bValue;
      
//       switch(sortBy) {
//         case 'price':
//           aValue = a.price;
//           bValue = b.price;
//           break;
//         case 'name':
//           aValue = a.snackName.toLowerCase();
//           bValue = b.snackName.toLowerCase();
//           break;
//         case 'rating':
//           aValue = calculateAverageRating(a.productReviews || []);
//           bValue = calculateAverageRating(b.productReviews || []);
//           break;
//         default:
//           aValue = new Date(a.createdDate);
//           bValue = new Date(b.createdDate);
//       }
      
//       if (sortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     setFilteredSnacks(filtered);
//   }, [snacks, searchTerm, selectedCategory, selectedStatus, priceRange, sortBy, sortOrder]);

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
//     return sum / reviews.length;
//   };

//   const getStatusBadgeColor = (status) => {
//     switch(status) {
//       case 'APPROVED': return 'bg-green-100 text-green-800';
//       case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
//       case 'REJECTED': return 'bg-red-100 text-red-800';
//       case 'DRAFT': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStockStatusColor = (status, quantity) => {
//     if (status === 'OUT_OF_STOCK' || quantity === 0) return 'text-red-600';
//     if (status === 'LOW_STOCK' || quantity < 50) return 'text-yellow-600';
//     return 'text-green-600';
//   };

//   const toggleFavorite = (snackId) => {
//     const newFavorites = new Set(favorites);
//     if (newFavorites.has(snackId)) {
//       newFavorites.delete(snackId);
//     } else {
//       newFavorites.add(snackId);
//     }
//     setFavorites(newFavorites);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setSelectedStatus('');
//     setPriceRange({ min: '', max: '' });
//     setSortBy('createdDate');
//     setSortOrder('desc');
//   };

//   const renderStarRating = (rating) => {
//     return (
//       <div className="flex items-center space-x-1">
//         {[1, 2, 3, 4, 5].map(star => (
//           <Star
//             key={star}
//             size={16}
//             className={star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
//           />
//         ))}
//         <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
//         <div className="container mx-auto px-6">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//             <span className="ml-3 text-green-600 font-medium">Loading delicious snacks...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
//       <div className="container mx-auto px-6 py-8">
        
//         {/* Header
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
//             Discover Vegan Snacks
//           </h1>
//           <p className="text-green-600 text-lg">
//             Explore our curated collection of delicious plant-based snacks
//           </p>
//         </div> */}

//         {/* Search and Filters */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            
//             {/* Search Bar */}
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search snacks, ingredients, descriptions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>

//             {/* View Toggle and Sort */}
//             <div className="flex items-center space-x-4">
//               <div className="flex bg-gray-100 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
//                 >
//                   <Grid size={20} className="text-gray-600" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
//                 >
//                   <List size={20} className="text-gray-600" />
//                 </button>
//               </div>

//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//               >
//                 <Filter size={20} />
//                 <span>Filters</span>
//                 <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//               </button>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           {showFilters && (
//             <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
//               {/* Category Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Status Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">All Statuses</option>
//                   {statuses.map(status => (
//                     <option key={status} value={status}>{status.replace('_', ' ')}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Price Range */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     placeholder="Min"
//                     value={priceRange.min}
//                     onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
//                     className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max"
//                     value={priceRange.max}
//                     onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
//                     className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//               </div>

//               {/* Sort By */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
//                 <div className="flex space-x-2">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="createdDate">Date Added</option>
//                     <option value="name">Name</option>
//                     <option value="price">Price</option>
//                     <option value="rating">Rating</option>
//                   </select>
//                   <button
//                     onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                     className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
//                   >
//                     <SortAsc size={16} className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
//                   </button>
//                 </div>
//               </div>

//               {/* Clear Filters */}
//               <div className="md:col-span-2 lg:col-span-4 flex justify-end">
//                 <button
//                   onClick={clearFilters}
//                   className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                 >
//                   <X size={16} />
//                   <span>Clear All Filters</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Results Count */}
//         <div className="mb-6">
//           <p className="text-gray-600">
//             Showing <span className="font-semibold text-green-700">{filteredSnacks.length}</span> of <span className="font-semibold">{snacks.length}</span> snacks
//           </p>
//         </div>

//         {/* Snacks Grid/List */}
//         {filteredSnacks.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">🍃</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No snacks found</h3>
//             <p className="text-gray-500">Try adjusting your search criteria or filters</p>
//           </div>
//         ) : (
//           <div className={viewMode === 'grid' 
//             ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
//             : 'space-y-4'
//           }>
//             {filteredSnacks.map(snack => (
//               viewMode === 'grid' ? (
//                 // Grid View Card
//                 <div key={snack.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden">
                  
//                   {/* Card Header */}
//                   <div className="relative">
//                     <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
//                       <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
//                         {snack.snackType === 'Protein Bar' ? '🥜' :
//                          snack.snackType === 'Energy Snack' ? '⚡' :
//                          snack.snackType === 'Chips' ? '🥬' :
//                          snack.snackType === 'Cookie' ? '🍪' : '🌱'}
//                       </div>
//                     </div>
                    
//                     {/* Status Badge */}
//                     <div className="absolute top-3 left-3">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(snack.status)}`}>
//                         {snack.status.replace('_', ' ')}
//                       </span>
//                     </div>
                    
//                     {/* Favorite Button */}
//                     <button
//                       onClick={() => toggleFavorite(snack.id)}
//                       className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
//                     >
//                       <Heart
//                         size={18}
//                         className={favorites.has(snack.id) ? 'text-red-500 fill-current' : 'text-gray-400'}
//                       />
//                     </button>
//                   </div>

//                   {/* Card Body */}
//                   <div className="p-6">
//                     <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{snack.snackName}</h3>
//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">{snack.description}</p>
                    
//                     {/* Rating */}
//                     {snack.productReviews && snack.productReviews.length > 0 && (
//                       <div className="mb-3">
//                         {renderStarRating(calculateAverageRating(snack.productReviews))}
//                       </div>
//                     )}
                    
//                     {/* Price and Stock */}
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center space-x-1">
//                         <DollarSign size={16} className="text-green-600" />
//                         <span className="font-bold text-xl text-green-700">${snack.price}</span>
//                       </div>
//                       <div className={`text-sm ${getStockStatusColor(snack.inventory?.availabilityStatus, snack.inventory?.stockQuantity)}`}>
//                         {snack.inventory?.stockQuantity > 0 ? `${snack.inventory?.stockQuantity} in stock` : 'Out of stock'}
//                       </div>
//                     </div>
                    
//                     {/* Quick Info */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
//                         {snack.category?.name}
//                       </span>
//                       <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
//                         {snack.quantity}
//                       </span>
//                     </div>
                    
//                     {/* Actions */}
//                     <div className="flex space-x-2">
//                       <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2">
//                         <ShoppingCart size={16} />
//                         <span>Add to Cart</span>
//                       </button>
//                       <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                         <Eye size={16} className="text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // List View Card
//                 <div key={snack.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
//                   <div className="flex flex-col lg:flex-row gap-6">
                    
//                     {/* Image */}
//                     <div className="flex-shrink-0">
//                       <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
//                         <div className="text-3xl">
//                           {snack.snackType === 'Protein Bar' ? '🥜' :
//                            snack.snackType === 'Energy Snack' ? '⚡' :
//                            snack.snackType === 'Chips' ? '🥬' :
//                            snack.snackType === 'Cookie' ? '🍪' : '🌱'}
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Content */}
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h3 className="text-xl font-semibold text-gray-800 mb-2">{snack.snackName}</h3>
//                           <div className="flex items-center space-x-3 mb-2">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(snack.status)}`}>
//                               {snack.status.replace('_', ' ')}
//                             </span>
//                             <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
//                               {snack.category?.name}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <div className="text-right">
//                           <div className="flex items-center space-x-1 mb-1">
//                             <DollarSign size={16} className="text-green-600" />
//                             <span className="font-bold text-2xl text-green-700">${snack.price}</span>
//                           </div>
//                           <div className={`text-sm ${getStockStatusColor(snack.inventory?.availabilityStatus, snack.inventory?.stockQuantity)}`}>
//                             {snack.inventory?.stockQuantity > 0 ? `${snack.inventory?.stockQuantity} in stock` : 'Out of stock'}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <p className="text-gray-600 mb-4">{snack.description}</p>
                      
//                       {/* Rating */}
//                       {snack.productReviews && snack.productReviews.length > 0 && (
//                         <div className="mb-4">
//                           {renderStarRating(calculateAverageRating(snack.productReviews))}
//                         </div>
//                       )}
                      
//                       {/* Details */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <div className="flex items-center space-x-2">
//                           <Package size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">{snack.quantity}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Clock size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">{snack.expiryInMonths} months shelf life</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <MapPin size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">{snack.vendor?.location}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Tag size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">SKU: {snack.sku}</span>
//                         </div>
//                       </div>
                      
//                       {/* Actions */}
//                       <div className="flex space-x-3">
//                         <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2">
//                           <ShoppingCart size={16} />
//                           <span>Add to Cart</span>
//                         </button>
//                         <button className="border border-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2">
//                           <Eye size={16} />
//                           <span>View Details</span>
//                         </button>
//                         <button
//                           onClick={() => toggleFavorite(snack.id)}
//                           className="border border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                           <Heart
//                             size={16}
//                             className={favorites.has(snack.id) ? 'text-red-500 fill-current' : 'text-gray-600'}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Star, 
//   ShoppingCart, 
//   Eye, 
//   Heart,
//   Clock,
//   DollarSign,
//   Package,
//   Tag,
//   MapPin,
//   ChevronDown,
//   Grid,
//   List,
//   SortAsc,
//   X
// } from 'lucide-react';

// export default function DisplayVeganSnacks() {
//   const [snacks, setSnacks] = useState([]);
//   const [filteredSnacks, setFilteredSnacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [sortBy, setSortBy] = useState('createdDate');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [viewMode, setViewMode] = useState('grid');
//   const [showFilters, setShowFilters] = useState(false);
//   const [favorites, setFavorites] = useState(new Set());
//   const [categories, setCategories] = useState([]);

//   // API base URL - replace with your actual backend endpoint
//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

//   // Fetch snacks from backend
//   useEffect(() => {
//     const fetchSnacks = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_BASE_URL}/snacks`);
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         setSnacks(data);
//         setFilteredSnacks(data);
//       } catch (err) {
//         console.error('Error fetching snacks:', err);
//         setError('Failed to load snacks. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Fetch categories from backend
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/categories`);
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         setCategories(data);
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//         // If categories API fails, we can use a default set
//         setCategories(["Protein Bars", "Energy Snacks", "Chips", "Cookies", "Crackers", "Nuts & Seeds"]);
//       }
//     };

//     fetchSnacks();
//     fetchCategories();
//   }, [API_BASE_URL]);

//   // Filter and sort snacks
//   useEffect(() => {
//     let filtered = snacks.filter(snack => {
//       const matchesSearch = snack.snackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            snack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            snack.ingredients.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesCategory = !selectedCategory || snack.category?.name === selectedCategory;
//       const matchesStatus = !selectedStatus || snack.status === selectedStatus;
      
//       const matchesPrice = (!priceRange.min || snack.price >= parseFloat(priceRange.min)) &&
//                           (!priceRange.max || snack.price <= parseFloat(priceRange.max));
      
//       return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
//     });

//     // Sort filtered results
//     filtered.sort((a, b) => {
//       let aValue, bValue;
      
//       switch(sortBy) {
//         case 'price':
//           aValue = a.price;
//           bValue = b.price;
//           break;
//         case 'name':
//           aValue = a.snackName.toLowerCase();
//           bValue = b.snackName.toLowerCase();
//           break;
//         case 'rating':
//           aValue = calculateAverageRating(a.productReviews || []);
//           bValue = calculateAverageRating(b.productReviews || []);
//           break;
//         default:
//           aValue = new Date(a.createdDate);
//           bValue = new Date(b.createdDate);
//       }
      
//       if (sortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     setFilteredSnacks(filtered);
//   }, [snacks, searchTerm, selectedCategory, selectedStatus, priceRange, sortBy, sortOrder]);

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
//     return sum / reviews.length;
//   };

//   const getStatusBadgeColor = (status) => {
//     switch(status) {
//       case 'APPROVED': return 'bg-green-100 text-green-800';
//       case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
//       case 'REJECTED': return 'bg-red-100 text-red-800';
//       case 'DRAFT': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStockStatusColor = (status, quantity) => {
//     if (status === 'OUT_OF_STOCK' || quantity === 0) return 'text-red-600';
//     if (status === 'LOW_STOCK' || quantity < 50) return 'text-yellow-600';
//     return 'text-green-600';
//   };

//   const toggleFavorite = (snackId) => {
//     const newFavorites = new Set(favorites);
//     if (newFavorites.has(snackId)) {
//       newFavorites.delete(snackId);
//     } else {
//       newFavorites.add(snackId);
//     }
//     setFavorites(newFavorites);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setSelectedStatus('');
//     setPriceRange({ min: '', max: '' });
//     setSortBy('createdDate');
//     setSortOrder('desc');
//   };

//   const renderStarRating = (rating) => {
//     return (
//       <div className="flex items-center space-x-1">
//         {[1, 2, 3, 4, 5].map(star => (
//           <Star
//             key={star}
//             size={16}
//             className={star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
//           />
//         ))}
//         <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
//       </div>
//     );
//   };

//   const statuses = ["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED"];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
//         <div className="container mx-auto px-6">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//             <span className="ml-3 text-green-600 font-medium">Loading delicious snacks...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
//         <div className="container mx-auto px-6 py-8">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
//       <div className="container mx-auto px-6 py-8">
        
//         {/* Search and Filters */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            
//             {/* Search Bar */}
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search snacks, ingredients, descriptions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>

//             {/* View Toggle and Sort */}
//             <div className="flex items-center space-x-4">
//               <div className="flex bg-gray-100 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
//                 >
//                   <Grid size={20} className="text-gray-600" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
//                 >
//                   <List size={20} className="text-gray-600" />
//                 </button>
//               </div>

//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//               >
//                 <Filter size={20} />
//                 <span>Filters</span>
//                 <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//               </button>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           {showFilters && (
//             <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
//               {/* Category Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map(category => (
//                     <option key={category.id || category} value={category.name || category}>
//                       {category.name || category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Status Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">All Statuses</option>
//                   {statuses.map(status => (
//                     <option key={status} value={status}>{status.replace('_', ' ')}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Price Range */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     placeholder="Min"
//                     value={priceRange.min}
//                     onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
//                     className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max"
//                     value={priceRange.max}
//                     onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
//                     className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//               </div>

//               {/* Sort By */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
//                 <div className="flex space-x-2">
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="createdDate">Date Added</option>
//                     <option value="name">Name</option>
//                     <option value="price">Price</option>
//                     <option value="rating">Rating</option>
//                   </select>
//                   <button
//                     onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                     className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
//                   >
//                     <SortAsc size={16} className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
//                   </button>
//                 </div>
//               </div>

//               {/* Clear Filters */}
//               <div className="md:col-span-2 lg:col-span-4 flex justify-end">
//                 <button
//                   onClick={clearFilters}
//                   className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                 >
//                   <X size={16} />
//                   <span>Clear All Filters</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Results Count */}
//         <div className="mb-6">
//           <p className="text-gray-600">
//             Showing <span className="font-semibold text-green-700">{filteredSnacks.length}</span> of <span className="font-semibold">{snacks.length}</span> snacks
//           </p>
//         </div>

//         {/* Snacks Grid/List */}
//         {filteredSnacks.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">🍃</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No snacks found</h3>
//             <p className="text-gray-500">Try adjusting your search criteria or filters</p>
//           </div>
//         ) : (
//           <div className={viewMode === 'grid' 
//             ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
//             : 'space-y-4'
//           }>
//             {filteredSnacks.map(snack => (
//               viewMode === 'grid' ? (
//                 // Grid View Card
//                 <div key={snack.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden">
                  
//                   {/* Card Header */}
//                   <div className="relative">
//                     <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
//                       <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
//                         {snack.snackType === 'Protein Bar' ? '🥜' :
//                          snack.snackType === 'Energy Snack' ? '⚡' :
//                          snack.snackType === 'Chips' ? '🥬' :
//                          snack.snackType === 'Cookie' ? '🍪' : '🌱'}
//                       </div>
//                     </div>
                    
//                     {/* Status Badge */}
//                     <div className="absolute top-3 left-3">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(snack.status)}`}>
//                         {snack.status.replace('_', ' ')}
//                       </span>
//                     </div>
                    
//                     {/* Favorite Button */}
//                     <button
//                       onClick={() => toggleFavorite(snack.id)}
//                       className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
//                     >
//                       <Heart
//                         size={18}
//                         className={favorites.has(snack.id) ? 'text-red-500 fill-current' : 'text-gray-400'}
//                       />
//                     </button>
//                   </div>

//                   {/* Card Body */}
//                   <div className="p-6">
//                     <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{snack.snackName}</h3>
//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">{snack.description}</p>
                    
//                     {/* Rating */}
//                     {snack.productReviews && snack.productReviews.length > 0 && (
//                       <div className="mb-3">
//                         {renderStarRating(calculateAverageRating(snack.productReviews))}
//                       </div>
//                     )}
                    
//                     {/* Price and Stock */}
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center space-x-1">
//                         <DollarSign size={16} className="text-green-600" />
//                         <span className="font-bold text-xl text-green-700">${snack.price}</span>
//                       </div>
//                       <div className={`text-sm ${getStockStatusColor(snack.inventory?.availabilityStatus, snack.inventory?.stockQuantity)}`}>
//                         {snack.inventory?.stockQuantity > 0 ? `${snack.inventory?.stockQuantity} in stock` : 'Out of stock'}
//                       </div>
//                     </div>
                    
//                     {/* Quick Info */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
//                         {snack.category?.name}
//                       </span>
//                       <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
//                         {snack.quantity}
//                       </span>
//                     </div>
                    
//                     {/* Actions */}
//                     <div className="flex space-x-2">
//                       <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2">
//                         <ShoppingCart size={16} />
//                         <span>Add to Cart</span>
//                       </button>
//                       <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                         <Eye size={16} className="text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // List View Card
//                 <div key={snack.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
//                   <div className="flex flex-col lg:flex-row gap-6">
                    
//                     {/* Image */}
//                     <div className="flex-shrink-0">
//                       <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
//                         <div className="text-3xl">
//                           {snack.snackType === 'Protein Bar' ? '🥜' :
//                            snack.snackType === 'Energy Snack' ? '⚡' :
//                            snack.snackType === 'Chips' ? '🥬' :
//                            snack.snackType === 'Cookie' ? '🍪' : '🌱'}
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Content */}
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h3 className="text-xl font-semibold text-gray-800 mb-2">{snack.snackName}</h3>
//                           <div className="flex items-center space-x-3 mb-2">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(snack.status)}`}>
//                               {snack.status.replace('_', ' ')}
//                             </span>
//                             <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
//                               {snack.category?.name}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <div className="text-right">
//                           <div className="flex items-center space-x-1 mb-1">
//                             <DollarSign size={16} className="text-green-600" />
//                             <span className="font-bold text-2xl text-green-700">${snack.price}</span>
//                           </div>
//                           <div className={`text-sm ${getStockStatusColor(snack.inventory?.availabilityStatus, snack.inventory?.stockQuantity)}`}>
//                             {snack.inventory?.stockQuantity > 0 ? `${snack.inventory?.stockQuantity} in stock` : 'Out of stock'}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <p className="text-gray-600 mb-4">{snack.description}</p>
                      
//                       {/* Rating */}
//                       {snack.productReviews && snack.productReviews.length > 0 && (
//                         <div className="mb-4">
//                           {renderStarRating(calculateAverageRating(snack.productReviews))}
//                         </div>
//                       )}
                      
//                       {/* Details */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <div className="flex items-center space-x-2">
//                           <Package size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">{snack.quantity}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Clock size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">{snack.expiryInMonths} months shelf life</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <MapPin size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">{snack.vendor?.location}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Tag size={16} className="text-gray-400" />
//                           <span className="text-gray-600 text-sm">SKU: {snack.sku}</span>
//                         </div>
//                       </div>
                      
//                       {/* Actions */}
//                       <div className="flex space-x-3">
//                         <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2">
//                           <ShoppingCart size={16} />
//                           <span>Add to Cart</span>
//                         </button>
//                         <button className="border border-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2">
//                           <Eye size={16} />
//                           <span>View Details</span>
//                         </button>
//                         <button
//                           onClick={() => toggleFavorite(snack.id)}
//                           className="border border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                           <Heart
//                             size={16}
//                             className={favorites.has(snack.id) ? 'text-red-500 fill-current' : 'text-gray-600'}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
