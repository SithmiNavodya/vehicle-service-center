// import React from 'react';
// import {
//   BarChart3, LineChart, PieChart, TrendingUp,
//   Users, Car, Wrench, DollarSign, Package, Target,
//   Clock, Calendar, Settings, Activity, Search,
//   Shield, Award, Zap, ChevronRight, Plus,
//   MessageSquare, FileText, Filter, Download
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
//
// const HomePage = () => {
//   // Quick actions for the service center
//   const quickActions = [
//     { icon: <Plus size={20} />, label: 'Add New Service', color: 'bg-blue-500 hover:bg-blue-600', path: '/services' },
//     { icon: <Users size={20} />, label: 'Add Customer', color: 'bg-green-500 hover:bg-green-600', path: '/customers' },
//     { icon: <Car size={20} />, label: 'Register Vehicle', color: 'bg-purple-500 hover:bg-purple-600', path: '/vehicles' },
//     { icon: <Package size={20} />, label: 'Add Inventory', color: 'bg-orange-500 hover:bg-orange-600', path: '/inventory' },
//     { icon: <FileText size={20} />, label: 'Create Record', color: 'bg-indigo-500 hover:bg-indigo-600', path: '/service-records' },
//     { icon: <Calendar size={20} />, label: 'Schedule', color: 'bg-red-500 hover:bg-red-600', path: '/appointments' }
//   ];
//
//   // Key metrics display (static UI - no hardcoded values)
//   const metrics = [
//     {
//       id: 1,
//       title: 'Service Efficiency',
//       description: 'Track performance metrics',
//       icon: <Target className="h-8 w-8 text-blue-600" />,
//       color: 'bg-blue-50 border-blue-200',
//       action: 'View Analytics →'
//     },
//     {
//       id: 2,
//       title: 'Customer Satisfaction',
//       description: 'Monitor feedback and ratings',
//       icon: <Award className="h-8 w-8 text-green-600" />,
//       color: 'bg-green-50 border-green-200',
//       action: 'Check Reports →'
//     },
//     {
//       id: 3,
//       title: 'Revenue Overview',
//       description: 'Financial performance insights',
//       icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
//       color: 'bg-purple-50 border-purple-200',
//       action: 'See Details →'
//     },
//     {
//       id: 4,
//       title: 'Inventory Health',
//       description: 'Stock levels and alerts',
//       icon: <Package className="h-8 w-8 text-orange-600" />,
//       color: 'bg-orange-50 border-orange-200',
//       action: 'Manage Stock →'
//     }
//   ];
//
//   // Recent activity placeholder UI
//   const activityTypes = [
//     { type: 'service', label: 'Service Requests', icon: <Wrench size={18} /> },
//     { type: 'vehicle', label: 'Vehicle Updates', icon: <Car size={18} /> },
//     { type: 'customer', label: 'Customer Actions', icon: <Users size={18} /> },
//     { type: 'inventory', label: 'Inventory Changes', icon: <Package size={18} /> }
//   ];
//
//   return (
//     <div className="space-y-6">
//       {/* Welcome Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Welcome back, Admin</h1>
//             <p className="text-blue-100 mb-4 max-w-2xl">
//               Manage your service center efficiently with real-time insights and tools
//             </p>
//             <div className="flex items-center space-x-4">
//               <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
//                 <span className="flex items-center">
//                   <Activity className="mr-2" size={18} />
//                   Get Started
//                 </span>
//               </button>
//               <button className="bg-blue-500/30 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500/40 transition-colors">
//                 <span className="flex items-center">
//                   <Settings className="mr-2" size={18} />
//                   Settings
//                 </span>
//               </button>
//             </div>
//           </div>
//           <div className="mt-6 lg:mt-0">
//             <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
//               <div className="flex items-center space-x-3">
//                 <Shield className="h-10 w-10" />
//                 <div>
//                   <p className="font-semibold">System Status</p>
//                   <p className="text-sm text-green-300">All Systems Operational</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* Quick Actions Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl shadow-sm border p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
//               <div className="flex items-center space-x-2 text-gray-500">
//                 <Search size={18} />
//                 <Filter size={18} />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {quickActions.map((action) => (
//                 <Link
//                   key={action.label}
//                   to={action.path}
//                   className={`${action.color} text-white rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg`}
//                 >
//                   <div className="mb-3">{action.icon}</div>
//                   <span className="font-semibold text-center">{action.label}</span>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//
//         {/* System Overview */}
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">System Overview</h2>
//           <div className="space-y-4">
//             {metrics.map((metric) => (
//               <div key={metric.id} className={`${metric.color} border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer`}>
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center">
//                     <div className="mr-3 p-2 bg-white rounded-lg">
//                       {metric.icon}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-800">{metric.title}</h3>
//                       <p className="text-sm text-gray-600">{metric.description}</p>
//                     </div>
//                   </div>
//                   <ChevronRight className="text-gray-400" size={20} />
//                 </div>
//                 <div className="mt-3 text-right">
//                   <span className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700">
//                     {metric.action}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//
//       {/* Charts and Analytics Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Analytics Chart Placeholder */}
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Performance Analytics</h2>
//             <div className="flex items-center space-x-2">
//               <button className="text-gray-500 hover:text-gray-700 p-2">
//                 <Download size={18} />
//               </button>
//               <select className="border rounded-lg px-3 py-1 text-sm">
//                 <option>This Week</option>
//                 <option>This Month</option>
//                 <option>This Year</option>
//               </select>
//             </div>
//           </div>
//           <div className="h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl flex items-center justify-center">
//             <div className="text-center">
//               <LineChart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
//               <p className="text-gray-600 mb-2">Analytics Dashboard</p>
//               <p className="text-sm text-gray-500">Visualize your service center performance</p>
//             </div>
//           </div>
//         </div>
//
//         {/* Recent Activity Panel */}
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
//             <MessageSquare className="text-gray-500" size={20} />
//           </div>
//
//           <div className="mb-6">
//             <div className="flex space-x-4 overflow-x-auto pb-2">
//               {activityTypes.map((type) => (
//                 <button
//                   key={type.type}
//                   className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 whitespace-nowrap"
//                 >
//                   {type.icon}
//                   <span>{type.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//
//           <div className="space-y-4">
//             <div className="border-l-4 border-blue-500 pl-4 py-2">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-medium text-gray-800">Service Center Ready</p>
//                   <p className="text-sm text-gray-600">All systems are operational and ready for business</p>
//                 </div>
//                 <span className="text-xs text-gray-500">Just now</span>
//               </div>
//             </div>
//
//             <div className="border-l-4 border-green-500 pl-4 py-2">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-medium text-gray-800">Welcome to Dashboard</p>
//                   <p className="text-sm text-gray-600">Start managing your service center operations</p>
//                 </div>
//                 <span className="text-xs text-gray-500">Today</span>
//               </div>
//             </div>
//
//             <div className="text-center py-8">
//               <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//               <p className="text-gray-500">Activities will appear here as you use the system</p>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* Bottom Stats Preview */}
//       <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="text-center p-4">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
//               <Zap className="h-8 w-8 text-yellow-500" />
//             </div>
//             <h3 className="font-bold text-gray-800 mb-2">Fast Operations</h3>
//             <p className="text-gray-600 text-sm">Quick access to all service management tools</p>
//           </div>
//
//           <div className="text-center p-4">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
//               <Shield className="h-8 w-8 text-green-500" />
//             </div>
//             <h3 className="font-bold text-gray-800 mb-2">Secure & Reliable</h3>
//             <p className="text-gray-600 text-sm">Enterprise-grade security for your data</p>
//           </div>
//
//           <div className="text-center p-4">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
//               <TrendingUp className="h-8 w-8 text-blue-500" />
//             </div>
//             <h3 className="font-bold text-gray-800 mb-2">Growth Ready</h3>
//             <p className="text-gray-600 text-sm">Scalable solutions for your growing business</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default HomePage;
////kjjhhgghgjhkjl
//jjfgsjlgl