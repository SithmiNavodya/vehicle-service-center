import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Users, Car, Wrench, Calendar, DollarSign,
  Clock, Package, ShoppingCart, AlertCircle,
  CheckCircle, XCircle, RefreshCw, Box
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    totalServices: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    lowStockItems: 0,
    totalSuppliers: 0
  });
  const [recentServices, setRecentServices] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api/';

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Create axios instance with auth header
  const createApiClient = () => {
    return axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCHING DASHBOARD DATA ===');

      const apiClient = createApiClient();

      // 1. Fetch customers
      console.log('1. Fetching customers...');
      const customersRes = await apiClient.get('/customers');
      const customers = extractDataFromResponse(customersRes.data);
      console.log(`Customers found: ${customers.length}`);

      // 2. Fetch vehicles
      console.log('2. Fetching vehicles...');
      const vehiclesRes = await apiClient.get('/vehicles');
      const vehicles = extractDataFromResponse(vehiclesRes.data);
      console.log(`Vehicles found: ${vehicles.length}`);

      // 3. Fetch services
      console.log('3. Fetching services...');
      const servicesRes = await apiClient.get('/services');
      const services = extractDataFromResponse(servicesRes.data);
      console.log(`Services found: ${services.length}`);

      // 4. Try to fetch inventory/low stock items
      console.log('4. Fetching inventory data...');
      let inventoryItems = [];
      let lowStockCount = 0;

      try {
        // Try different inventory endpoints
        const inventoryEndpoints = [
          '/inventory',
          '/spareparts',
          '/parts',
          '/items',
          '/spare-parts',
          '/inventory/items'
        ];

        for (const endpoint of inventoryEndpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const inventoryRes = await apiClient.get(endpoint);
            const data = extractDataFromResponse(inventoryRes.data);
            if (Array.isArray(data) && data.length > 0) {
              inventoryItems = data;
              console.log(`Found ${data.length} items via ${endpoint}`);
              break;
            }
          } catch (err) {
            // Continue to next endpoint
          }
        }

        // Calculate low stock items
        if (inventoryItems.length > 0) {
          console.log('Checking for low stock items...');
          console.log('First inventory item:', inventoryItems[0]);
          console.log('Inventory item keys:', Object.keys(inventoryItems[0]));

          lowStockCount = inventoryItems.filter(item => {
            // Try different quantity fields
            const quantity = item.quantity || item.stock || item.currentStock || item.availableQuantity || 0;
            const minStock = item.minStock || item.minimumStock || item.reorderLevel || 5; // Default to 5
            console.log(`Item: ${item.name || item.partName}, Quantity: ${quantity}, Min Stock: ${minStock}`);
            return quantity <= minStock;
          }).length;

          console.log(`Low stock items: ${lowStockCount}`);
        }
      } catch (err) {
        console.log('No inventory endpoints available:', err.message);
      }

      // 5. Calculate MONTHLY REVENUE
      console.log('5. Calculating monthly revenue...');
      let monthlyRevenue = 0;
      services.forEach(service => {
        const cost = service.totalCost || service.price || service.amount || service.cost || 0;
        monthlyRevenue += parseFloat(cost) || 0;
      });
      console.log(`Monthly revenue: $${monthlyRevenue}`);

      // 6. Calculate TODAY'S REVENUE
      console.log('6. Calculating today\'s revenue...');
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      let todayRevenue = 0;
      services.forEach(service => {
        const dateField = Object.keys(service).find(key =>
          key.toLowerCase().includes('date') || key.toLowerCase().includes('created')
        );

        if (dateField && service[dateField]) {
          try {
            const serviceDate = new Date(service[dateField]).toISOString().split('T')[0];
            if (serviceDate === todayString) {
              const cost = service.totalCost || service.price || service.amount || service.cost || 0;
              todayRevenue += parseFloat(cost) || 0;
            }
          } catch (e) {
            // Invalid date format
          }
        }
      });
      console.log(`Today's revenue: $${todayRevenue}`);

      // 7. Get RECENT SERVICES (last 5)
      console.log('7. Getting recent services...');
      const sortedServices = [...services]
        .sort((a, b) => {
          const dateA = getServiceDate(a);
          const dateB = getServiceDate(b);
          return new Date(dateB) - new Date(dateA);
        })
        .slice(0, 5);

      // 8. Get RECENT CUSTOMERS (last 3)
      console.log('8. Getting recent customers...');
      const sortedCustomers = [...customers]
        .sort((a, b) => {
          const dateA = a.createdAt || a.createdDate || a.dateAdded;
          const dateB = b.createdAt || b.createdDate || b.dateAdded;
          return new Date(dateB) - new Date(dateA);
        })
        .slice(0, 3);

      // 9. Update stats
      console.log('9. Updating dashboard stats...');
      setStats({
        totalCustomers: customers.length,
        totalVehicles: vehicles.length,
        totalServices: services.length,
        monthlyRevenue: monthlyRevenue,
        todayRevenue: todayRevenue,
        lowStockItems: lowStockCount, // Low stock items count
        totalSuppliers: 0 // Since suppliers endpoint doesn't work
      });

      setRecentServices(sortedServices);
      setRecentCustomers(sortedCustomers);
      setLoading(false);

      console.log('=== DASHBOARD DATA LOADED SUCCESSFULLY ===');

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check console for details.');
      setLoading(false);
    }
  };

  // Helper function to extract service date
  const getServiceDate = (service) => {
    const dateFields = Object.keys(service).filter(key =>
      key.toLowerCase().includes('date') || key.toLowerCase().includes('created')
    );

    for (const field of dateFields) {
      if (service[field]) {
        return service[field];
      }
    }

    return new Date();
  };

  // Helper function to get service name
  const getServiceName = (service) => {
    const nameFields = [
      'serviceType', 'type', 'name', 'title',
      'description', 'serviceName', 'serviceDescription'
    ];

    for (const field of nameFields) {
      if (service[field]) {
        return service[field];
      }
    }

    return 'Service';
  };

  // Helper function to get service cost
  const getServiceCost = (service) => {
    const costFields = ['totalCost', 'price', 'amount', 'cost', 'totalPrice'];

    for (const field of costFields) {
      if (service[field] !== undefined && service[field] !== null) {
        return parseFloat(service[field]) || 0;
      }
    }

    return 0;
  };

  // Helper function to get service status
  const getServiceStatus = (service) => {
    const status = (service.status || '').toString().toLowerCase();
    return status || 'pending';
  };

  // Helper function to extract data from various response formats
  const extractDataFromResponse = (response) => {
    if (!response) return [];

    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.items && Array.isArray(response.items)) return response.items;
    if (response.result && Array.isArray(response.result)) return response.result;
    if (response.customers && Array.isArray(response.customers)) return response.customers;
    if (response.vehicles && Array.isArray(response.vehicles)) return response.vehicles;
    if (response.services && Array.isArray(response.services)) return response.services;

    if (typeof response === 'object') {
      for (const key in response) {
        if (Array.isArray(response[key])) {
          return response[key];
        }
      }
    }

    return [];
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      link: '/customers',
      description: 'Registered customers'
    },
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: <Car className="h-6 w-6" />,
      color: 'bg-green-500',
      link: '/vehicles',
      description: 'All vehicles in system'
    },
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: <Wrench className="h-6 w-6" />,
      color: 'bg-purple-500',
      link: '/services',
      description: 'All services in system'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <Package className="h-6 w-6" />,
      color: 'bg-red-500',
      link: '/inventory',
      description: 'Items need restocking'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500',
      link: '/services',
      description: 'This month total'
    },
    {
      title: 'Today\'s Revenue',
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-blue-500',
      link: '/services',
      description: 'Revenue today'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching from: {API_BASE_URL}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="block">
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-900 font-medium">{stat.title}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Services */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Services</h2>
            <Link to="/service-records" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentServices.length > 0 ? (
              recentServices.map((service, index) => (
                <div key={service._id || service.id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {getServiceName(service)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        getServiceStatus(service) === 'completed' ? 'bg-green-100 text-green-800' :
                        getServiceStatus(service) === 'in progress' || getServiceStatus(service) === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getServiceStatus(service)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(getServiceDate(service)).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-800">
                    ${getServiceCost(service).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent services found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Customers</h2>
            <Link to="/customers" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentCustomers.length > 0 ? (
              recentCustomers.map((customer, index) => (
                <div key={customer._id || customer.id || index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{customer.email || 'No email'}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {customer.vehicleCount || customer.vehicles?.length || 0} vehicles
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No customers found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;