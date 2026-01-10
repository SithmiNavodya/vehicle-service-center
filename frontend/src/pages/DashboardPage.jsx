import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Users, Car, Wrench, Calendar, Package,
  DollarSign, TrendingUp, Activity, Clock
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    activeServices: 0,
    pendingAppointments: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    efficiency: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalCustomers: 156,
        totalVehicles: 243,
        activeServices: 18,
        pendingAppointments: 7,
        monthlyRevenue: 12500.50,
        todayRevenue: 850.75,
        efficiency: 92.5
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: <Car className="h-6 w-6" />,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Active Services',
      value: stats.activeServices,
      icon: <Wrench className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: '-3%'
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-yellow-500',
      change: '+5%'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      title: 'Service Efficiency',
      value: `${stats.efficiency}%`,
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-red-500',
      change: '+2%'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'service', title: 'Oil Change Completed', customer: 'John Smith', time: '10 min ago' },
    { id: 2, type: 'vehicle', title: 'New Vehicle Registered', customer: 'Sarah Johnson', time: '1 hour ago' },
    { id: 3, type: 'appointment', title: 'Appointment Scheduled', customer: 'Mike Wilson', time: '2 hours ago' },
    { id: 4, type: 'service', title: 'AC Service Completed', customer: 'Robert Brown', time: '3 hours ago' },
    { id: 5, type: 'payment', title: 'Payment Received', customer: 'Emma Davis', time: '4 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName || 'Admin'}!</h1>
            <p className="text-blue-100">Here's what's happening with your service center today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>Last updated: Just now</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`p-2 rounded ${
                  activity.type === 'service' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'vehicle' ? 'bg-green-100 text-green-600' :
                  activity.type === 'appointment' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'service' && <Wrench className="h-4 w-4" />}
                  {activity.type === 'vehicle' && <Car className="h-4 w-4" />}
                  {activity.type === 'appointment' && <Calendar className="h-4 w-4" />}
                  {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.customer}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Today's Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Services Completed</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${stats.todayRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
//kkkk
