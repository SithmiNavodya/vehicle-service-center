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
      const servicesRes = await apiClient.get('/service-records').catch(() => apiClient.get('/services'));
      const services = extractDataFromResponse(servicesRes.data);
      console.log(`Services/Records found: ${services.length}`);

      // 4. Try to fetch inventory/low stock items
      console.log('4. Fetching inventory data...');
      let inventoryItems = [];
      let lowStockCount = 0;

      try {
        // Try known inventory endpoints
        const inventoryEndpoints = [
          '/v1/spare-parts',
          '/spare-parts',
          '/spareparts',
          '/inventory'
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
            // Continue
          }
        }

        // Calculate low stock items
        if (inventoryItems.length > 0) {
          lowStockCount = inventoryItems.filter(item => {
            const quantity = item.quantity || item.stock || item.currentStock || item.availableQuantity || 0;
            const minStock = item.minStock || item.minimumStock || item.reorderLevel || 5;
            return quantity <= minStock;
          }).length;
        }
      } catch (err) {
        console.log('Inventory fetch issue:', err.message);
      }

      // 5. Calculate Revenue
      let monthlyRevenue = 0;
      let todayRevenue = 0;
      const todayString = new Date().toISOString().split('T')[0];

      services.forEach(service => {
        const cost = parseFloat(service.totalAmount || service.totalCost || service.price || 0);
        monthlyRevenue += cost;

        const dateField = service.serviceDate || service.createdAt || service.createdDate;
        if (dateField && dateField.split('T')[0] === todayString) {
          todayRevenue += cost;
        }
      });

      // 7. Get RECENT ACTIVITIES
      const sortedServices = [...services]
        .sort((a, b) => new Date(b.serviceDate || b.createdAt) - new Date(a.serviceDate || a.createdAt))
        .slice(0, 5);

      const sortedCustomers = [...customers]
        .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
        .slice(0, 3);

      // 9. Update stats
      setStats({
        totalCustomers: customers.length,
        totalVehicles: vehicles.length,
        totalServices: services.length,
        monthlyRevenue: monthlyRevenue,
        todayRevenue: todayRevenue,
        lowStockItems: lowStockCount,
        totalSuppliers: 0
      });

      setRecentServices(sortedServices);
      setRecentCustomers(sortedCustomers);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to synchronize dashboard telemetry.');
      setLoading(false);
    }
  };

  const getServiceDate = (service) => service.serviceDate || service.createdAt || new Date();

  const getServiceName = (service) => service.serviceName || service.serviceType || 'Service Log';

  const getServiceCost = (service) => parseFloat(service.totalAmount || service.price || 0);

  const getServiceStatus = (service) => (service.status || 'pending').toLowerCase();

  const extractDataFromResponse = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.items && Array.isArray(response.items)) return response.items;
    return [];
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      link: '/customers',
      description: 'Registered clients'
    },
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: <Car className="h-6 w-6" />,
      color: 'bg-green-500',
      link: '/vehicles',
      description: 'Vehicle registry count'
    },
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: <Wrench className="h-6 w-6" />,
      color: 'bg-purple-500',
      link: '/service-records',
      description: 'Operations handled'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <Package className="h-6 w-6" />,
      color: 'bg-red-500',
      link: '/inventory',
      description: 'Restock recommended'
    },
    {
      title: 'Monthly Revenue',
      value: `Rs.${stats.monthlyRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-emerald-500',
      link: '/income',
      description: 'Current month total'
    },
    {
      title: 'Today\'s Revenue',
      value: `Rs.${stats.todayRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-sky-500',
      link: '/income',
      description: 'Accumulated today'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Syncing telemetry data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sync Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry Sync</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName || 'Admin'}</p>
        </div>
        <button onClick={fetchDashboardData} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Service Records</h2>
            <Link to="/service-records" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Full Audit →</Link>
          </div>
          <div className="space-y-4">
            {recentServices.length > 0 ? (
              recentServices.map((service, index) => (
                <div key={service.id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{getServiceName(service)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getServiceStatus(service) === 'completed' ? 'bg-green-100 text-green-800' :
                          getServiceStatus(service) === 'in progress' || getServiceStatus(service) === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {getServiceStatus(service)}
                      </span>
                      <span className="text-sm text-gray-600">{new Date(getServiceDate(service)).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-800">Rs.{getServiceCost(service).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent operational logs</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Customers</h2>
            <Link to="/customers" className="text-blue-600 hover:text-blue-800 text-sm font-medium">All Clients →</Link>
          </div>
          <div className="space-y-4">
            {recentCustomers.length > 0 ? (
              recentCustomers.map((customer, index) => (
                <div key={customer.id || index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email || 'No email registered'}</p>
                  </div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent client activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;