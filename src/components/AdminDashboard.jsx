// import React, { useState, useEffect } from 'react';
// import { 
//   BarChart, 
//   Bar, 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Area,
//   AreaChart
// } from 'recharts';
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   TrendingUp,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   Download,
//   Settings,
//   Bell,
//   Search,
//   Filter,
//   Calendar,
//   DollarSign,
//   Star,
//   AlertTriangle,
//   Activity,
//   FileText,
//   Award,
//   Target,
//   Zap
// } from 'lucide-react';

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [dateRange, setDateRange] = useState('30');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFilter, setSelectedFilter] = useState('all');

//   // Mock data - replace with actual API calls
//   const dashboardStats = {
//     totalProducts: 342,
//     totalVendors: 89,
//     totalCustomers: 1247,
//     totalRevenue: 45678.90,
//     pendingApprovals: 23,
//     activeOrders: 156,
//     avgRating: 4.7,
//     growthRate: 12.5
//   };

//   const recentActivity = [
//     { id: 1, type: 'product_approval', message: 'New product "Quinoa Bars" approved', time: '5 min ago', status: 'approved' },
//     { id: 2, type: 'vendor_registration', message: 'New vendor "Green Foods Co." registered', time: '15 min ago', status: 'pending' },
//     { id: 3, type: 'quality_check', message: 'Quality check completed for "Kale Chips"', time: '1 hour ago', status: 'completed' },
//     { id: 4, type: 'system_alert', message: 'Low inventory alert for "Almond Cookies"', time: '2 hours ago', status: 'warning' }
//   ];

//   const pendingApprovals = [
//     { id: 1, productName: 'Organic Trail Mix', vendor: 'Nature\'s Best', category: 'Nuts & Seeds', submittedDate: '2024-01-20', status: 'pending' },
//     { id: 2, productName: 'Coconut Protein Balls', vendor: 'Healthy Bites', category: 'Energy Snacks', submittedDate: '2024-01-19', status: 'pending' },
//     { id: 3, productName: 'Seaweed Crackers', vendor: 'Ocean Foods', category: 'Crackers', submittedDate: '2024-01-18', status: 'under_review' }
//   ];

//   const salesData = [
//     { month: 'Jan', revenue: 12000, orders: 145 },
//     { month: 'Feb', revenue: 15000, orders: 180 },
//     { month: 'Mar', revenue: 18000, orders: 220 },
//     { month: 'Apr', revenue: 22000, orders: 265 },
//     { month: 'May', revenue: 25000, orders: 310 },
//     { month: 'Jun', revenue: 28000, orders: 350 }
//   ];

//   const categoryData = [
//     { name: 'Protein Bars', value: 30, color: '#10B981' },
//     { name: 'Energy Snacks', value: 25, color: '#3B82F6' },
//     { name: 'Chips', value: 20, color: '#F59E0B' },
//     { name: 'Cookies', value: 15, color: '#EF4444' },
//     { name: 'Nuts & Seeds', value: 10, color: '#8B5CF6' }
//   ];

//   const topVendors = [
//     { id: 1, name: 'GreenSnacks Co.', products: 45, rating: 4.8, revenue: 12500 },
//     { id: 2, name: 'Pure Energy Foods', products: 32, rating: 4.7, revenue: 9800 },
//     { id: 3, name: 'Leafy Greens Ltd', products: 28, rating: 4.6, revenue: 8200 },
//     { id: 4, name: 'Sweet Treats Bakery', products: 22, rating: 4.5, revenue: 6900 }
//   ];

//   const qualityMetrics = [
//     { metric: 'Product Compliance', value: 98, status: 'excellent' },
//     { metric: 'Customer Satisfaction', value: 94, status: 'good' },
//     { metric: 'Vendor Rating Avg', value: 92, status: 'good' },
//     { metric: 'Return Rate', value: 3, status: 'excellent' }
//   ];

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'approved': case 'completed': case 'excellent': return 'text-green-600 bg-green-100';
//       case 'pending': case 'under_review': case 'good': return 'text-yellow-600 bg-yellow-100';
//       case 'rejected': case 'failed': return 'text-red-600 bg-red-100';
//       case 'warning': return 'text-orange-600 bg-orange-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const StatCard = ({ title, value, icon, change, color = 'green' }) => (
//     <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-sm font-medium">{title}</p>
//           <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
//           {change && (
//             <p className={`text-sm mt-1 flex items-center ${color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
//               <TrendingUp size={14} className="mr-1" />
//               {change}% vs last month
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-full ${color === 'green' ? 'bg-green-100' : color === 'blue' ? 'bg-blue-100' : color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
//           {React.cloneElement(icon, { 
//             size: 24, 
//             className: color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : color === 'purple' ? 'text-purple-600' : 'text-yellow-600' 
//           })}
//         </div>
//       </div>
//     </div>
//   );

//   const renderOverview = () => (
//     <div className="space-y-8">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard 
//           title="Total Products" 
//           value={dashboardStats.totalProducts} 
//           icon={<Package />} 
//           change={8.2}
//           color="green"
//         />
//         <StatCard 
//           title="Active Vendors" 
//           value={dashboardStats.totalVendors} 
//           icon={<Users />} 
//           change={5.1}
//           color="blue"
//         />
//         <StatCard 
//           title="Total Revenue" 
//           value={`$${dashboardStats.totalRevenue.toLocaleString()}`} 
//           icon={<DollarSign />} 
//           change={12.5}
//           color="purple"
//         />
//         <StatCard 
//           title="Pending Approvals" 
//           value={dashboardStats.pendingApprovals} 
//           icon={<Clock />} 
//           change={-2.3}
//           color="yellow"
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Chart */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Category Distribution */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={categoryData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {categoryData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Activity & Quality Metrics */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
//           <div className="space-y-4">
//             {recentActivity.map(activity => (
//               <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status).split(' ')[1]}`}></div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-800">{activity.message}</p>
//                   <p className="text-xs text-gray-500">{activity.time}</p>
//                 </div>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
//                   {activity.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quality Metrics */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Metrics</h3>
//           <div className="space-y-4">
//             {qualityMetrics.map((metric, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-sm text-gray-700">{metric.metric}</span>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-20 h-2 bg-gray-200 rounded-full">
//                     <div 
//                       className={`h-2 rounded-full ${metric.status === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'}`}
//                       style={{ width: `${metric.value}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium">{metric.value}%</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderProductManagement = () => (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
//             <p className="text-gray-600 mt-1">Manage all products and approvals</p>
//           </div>
//           <div className="flex space-x-3">
//             <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
//               <Plus size={16} />
//               <span>Add Product</span>
//             </button>
//             <button className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
//               <Download size={16} />
//               <span>Export</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Pending Approvals */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//           <Clock className="mr-2 text-yellow-600" size={20} />
//           Pending Approvals ({pendingApprovals.length})
//         </h3>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendor</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingApprovals.map(product => (
//                 <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
//                   <td className="py-3 px-4 font-medium text-gray-800">{product.productName}</td>
//                   <td className="py-3 px-4 text-gray-600">{product.vendor}</td>
//                   <td className="py-3 px-4">
//                     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                       {product.category}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-gray-600">{product.submittedDate}</td>
//                   <td className="py-3 px-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
//                       {product.status.replace('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex space-x-2">
//                       <button className="text-green-600 hover:text-green-800 p-1" title="Approve">
//                         <CheckCircle size={16} />
//                       </button>
//                       <button className="text-red-600 hover:text-red-800 p-1" title="Reject">
//                         <XCircle size={16} />
//                       </button>
//                       <button className="text-blue-600 hover:text-blue-800 p-1" title="View Details">
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* All Products */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
//           <h3 className="text-lg font-semibold text-gray-800">All Products</h3>
//           <div className="flex space-x-3 w-full lg:w-auto">
//             <div className="relative flex-1 lg:flex-initial">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full lg:w-64"
//               />
//             </div>
//             <select
//               value={selectedFilter}
//               onChange={(e) => setSelectedFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="all">All Status</option>
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Product cards would go here - using mock data */}
//           {[1,2,3,4,5,6].map(i => (
//             <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex justify-between items-start mb-3">
//                 <h4 className="font-medium text-gray-800">Sample Product {i}</h4>
//                 <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
//                   Approved
//                 </span>
//               </div>
//               <p className="text-gray-600 text-sm mb-3">Sample product description...</p>
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-green-700">$19.99</span>
//                 <div className="flex space-x-2">
//                   <button className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
//                     <Edit size={14} />
//                   </button>
//                   <button className="text-gray-600 hover:text-gray-800 p-1" title="View">
//                     <Eye size={14} />
//                   </button>
//                   <button className="text-red-600 hover:text-red-800 p-1" title="Delete">
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderVendorManagement = () => (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Vendor Management</h2>
//             <p className="text-gray-600 mt-1">Manage vendors and their performance</p>
//           </div>
//           <div className="flex space-x-3">
//             <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
//               <Plus size={16} />
//               <span>Add Vendor</span>
//             </button>
//             <button className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
//               <Download size={16} />
//               <span>Export Report</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Top Vendors */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
//           <Award className="mr-2 text-yellow-600" size={20} />
//           Top Performing Vendors
//         </h3>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendor</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Products</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topVendors.map(vendor => (
//                 <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
//                   <td className="py-3 px-4">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                         <span className="text-green-600 font-semibold text-sm">
//                           {vendor.name.charAt(0)}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-800">{vendor.name}</p>
//                         <p className="text-xs text-gray-500">Active since 2023</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4 text-gray-600">{vendor.products}</td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center space-x-1">
//                       <Star className="text-yellow-500 fill-current" size={14} />
//                       <span className="text-gray-700">{vendor.rating}</span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4 font-medium text-green-700">${vendor.revenue.toLocaleString()}</td>
//                   <td className="py-3 px-4">
//                     <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
//                       Active
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex space-x-2">
//                       <button className="text-blue-600 hover:text-blue-800 p-1" title="View Profile">
//                         <Eye size={16} />
//                       </button>
//                       <button className="text-green-600 hover:text-green-800 p-1" title="Edit">
//                         <Edit size={16} />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-800 p-1" title="Analytics">
//                         <Activity size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   const renderAnalytics = () => (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
//             <p className="text-gray-600 mt-1">Comprehensive insights and data analysis</p>
//           </div>
//           <div className="flex space-x-3">
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="7">Last 7 days</option>
//               <option value="30">Last 30 days</option>
//               <option value="90">Last 3 months</option>
//               <option value="365">Last year</option>
//             </select>
//             <button className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
//               <Download size={16} />
//               <span>Export Report</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard 
//           title="Total Orders" 
//           value="1,234" 
//           icon={<ShoppingCart />} 
//           change={15.2}
//           color="green"
//         />
//         <StatCard 
//           title="Conversion Rate" 
//           value="3.2%" 
//           icon={<Target />} 
//           change={0.8}
//           color="blue"
//         />
//         <StatCard 
//           title="Avg Order Value" 
//           value="$47.50" 
//           icon={<DollarSign />} 
//           change={8.1}
//           color="purple"
//         />
//         <StatCard 
//           title="Customer Satisfaction" 
//           value="94%" 
//           icon={<Star />} 
//           change={2.3}
//           color="yellow"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Sales Performance */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Performance</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
//               <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Product Performance */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Performance</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="orders" fill="#10B981" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );

//   const renderSystemConfig = () => (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">System Configuration</h2>
//             <p className="text-gray-600 mt-1">Manage system settings and configurations</p>
//           </div>
//           <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
//             <Settings size={16} />
//             <span>Save Changes</span>
//           </button>
//         </div>
//       </div>

//       {/* Configuration Sections */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* General Settings */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <Settings className="mr-2 text-blue-600" size={20} />
//             General Settings
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
//               <input
//                 type="text"
//                 defaultValue="Healthy Snacks Marketplace"
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
//               <input
//                 type="number"
//                 defaultValue="15"
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value</label>
//               <input
//                 type="number"
//                 defaultValue="25"
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <div className="flex items-center">
//               <input type="checkbox" id="maintenance" className="mr-2" defaultChecked={false} />
//               <label htmlFor="maintenance" className="text-sm text-gray-700">Maintenance Mode</label>
//             </div>
//           </div>
//         </div>

//         {/* Quality Control Settings */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <CheckCircle className="mr-2 text-green-600" size={20} />
//             Quality Control
//           </h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Auto-approve verified vendors</span>
//               <input type="checkbox" defaultChecked={true} className="toggle" />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Require organic certification</span>
//               <input type="checkbox" defaultChecked={false} className="toggle" />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Enable customer reviews</span>
//               <input type="checkbox" defaultChecked={true} className="toggle" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Review approval threshold</label>
//               <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
//                 <option>Auto-approve all</option>
//                 <option>Manual review required</option>
//                 <option>Auto-approve 4+ stars</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Payment Settings */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <DollarSign className="mr-2 text-purple-600" size={20} />
//             Payment Settings
//           </h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Accept Credit Cards</span>
//               <input type="checkbox" defaultChecked={true} className="toggle" />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Accept PayPal</span>
//               <input type="checkbox" defaultChecked={true} className="toggle" />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Accept Crypto</span>
//               <input type="checkbox" defaultChecked={false} className="toggle" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Payment Processing Fee (%)</label>
//               <input
//                 type="number"
//                 step="0.1"
//                 defaultValue="2.9"
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Notification Settings */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <Bell className="mr-2 text-yellow-600" size={20} />
//             Notifications
//           </h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Email notifications</span>
//               <input type="checkbox" defaultChecked={true} className="toggle" />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">SMS alerts</span>
//               <input type="checkbox" defaultChecked={false} className="toggle" />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Push notifications</span>
//               <input type="checkbox" defaultChecked={false} className="toggle" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold (%)</label>
//               <input
//                 type="number"
//                 defaultValue="90"
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return renderOverview();
//       case 'products':
//         return renderProductManagement();
//       case 'vendors':
//         return renderVendorManagement();
//       case 'analytics':
//         return renderAnalytics();
//       case 'settings':
//         return renderSystemConfig();
//       default:
//         return renderOverview();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
//       {/* Header and Controls */}
//       <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">Welcome back, Administrator. Here's a quick overview of your marketplace.</p>
//         </div>
//         <div className="flex items-center space-x-3 mt-4 md:mt-0">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//             <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           </div>
//           <button className="p-2 rounded-full bg-white text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors">
//             <Bell size={20} />
//           </button>
//           <div className="w-10 h-10 rounded-full bg-gray-300"></div>
//         </div>
//       </header>

//       {/* Main Content Area */}
//       <main>
//         {/* Tabs Navigation */}
//         <nav className="mb-8">
//           <ul className="flex bg-white rounded-xl shadow-lg p-3 space-x-2">
//             <li>
//               <button
//                 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('overview')}
//               >
//                 <Eye size={16} /> <span>Overview</span>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${activeTab === 'products' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('products')}
//               >
//                 <Package size={16} /> <span>Products</span>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${activeTab === 'vendors' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('vendors')}
//               >
//                 <Users size={16} /> <span>Vendors</span>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${activeTab === 'analytics' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('analytics')}
//               >
//                 <Activity size={16} /> <span>Analytics</span>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${activeTab === 'settings' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setActiveTab('settings')}
//               >
//                 <Settings size={16} /> <span>Settings</span>
//               </button>
//             </li>
//           </ul>
//         </nav>
        
//         {renderContent()}

//       </main>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Users,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Bell,
  Search
} from 'lucide-react';

// StatCard component
const StatCard = ({ title, value, icon, change }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={14} className="mr-1" />
            {change}% vs last month
          </p>
        )}
      </div>
      <div className="p-2 rounded-full bg-green-100 text-green-600">
        {icon}
      </div>
    </div>
  </div>
);

// Main Dashboard component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified mock data
  const dashboardStats = {
    totalProducts: 342,
    totalVendors: 89,
    totalRevenue: 45678.90,
    pendingApprovals: 23
  };

  const recentActivity = [
    { id: 1, message: 'New product "Quinoa Bars" approved', time: '5 min ago', status: 'approved' },
    { id: 2, message: 'New vendor "Green Foods Co." registered', time: '15 min ago', status: 'pending' },
    { id: 3, message: 'Quality check completed for "Kale Chips"', time: '1 hour ago', status: 'completed' }
  ];

  const pendingApprovals = [
    { id: 1, productName: 'Organic Trail Mix', vendor: 'Nature\'s Best', submittedDate: '2024-01-20', status: 'pending' },
    { id: 2, productName: 'Coconut Protein Balls', vendor: 'Healthy Bites', submittedDate: '2024-01-19', status: 'pending' }
  ];

  const salesData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 }
  ];

  const categoryData = [
    { name: 'Protein Bars', value: 30, color: '#10B981' },
    { name: 'Energy Snacks', value: 25, color: '#3B82F6' },
    { name: 'Chips', value: 20, color: '#F59E0B' },
    { name: 'Cookies', value: 15, color: '#EF4444' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products" 
          value={dashboardStats.totalProducts} 
          icon={<Package size={20} />} 
          change={8.2}
        />
        <StatCard 
          title="Active Vendors" 
          value={dashboardStats.totalVendors} 
          icon={<Users size={20} />} 
          change={5.1}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${dashboardStats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={20} />} 
          change={12.5}
        />
        <StatCard 
          title="Pending Approvals" 
          value={dashboardStats.pendingApprovals} 
          icon={<Clock size={20} />} 
          change={-2.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
            <p className="text-gray-600">Manage all products and approvals</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1">
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Pending Approvals ({pendingApprovals.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Product</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Vendor</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Submitted</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{product.productName}</td>
                  <td className="py-2 px-3">{product.vendor}</td>
                  <td className="py-2 px-3">{product.submittedDate}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-2">
                      <button className="text-green-600 p-1" title="Approve">
                        <CheckCircle size={16} />
                      </button>
                      <button className="text-red-600 p-1" title="Reject">
                        <XCircle size={16} />
                      </button>
                      <button className="text-blue-600 p-1" title="View">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'products':
        return renderProductManagement();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Administrator</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="p-1 rounded bg-white text-gray-600">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Tabs Navigation */}
        <nav className="mb-6">
          <div className="flex bg-white rounded-lg shadow p-1 gap-1">
            <button
              className={`px-3 py-2 rounded text-sm flex items-center gap-1 ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              <Eye size={16} /> <span>Overview</span>
            </button>
            <button
              className={`px-3 py-2 rounded text-sm flex items-center gap-1 ${activeTab === 'products' ? 'bg-green-600 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={16} /> <span>Products</span>
            </button>
          </div>
        </nav>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;