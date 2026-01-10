import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Box, Tag, AlertTriangle, TrendingUp,
  ShoppingCart, BarChart3, Download, RefreshCw,
  Database, AlertCircle, FileText, FileSpreadsheet,
  FileDown, ChevronDown, Printer, Loader2
} from 'lucide-react';
import axios from 'axios';
import { InventoryReportGenerator } from '../utils/reportGenerator';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState({
    totalParts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    restockNeededCount: 0,
    loading: true,
    error: null
  });

  const [spareParts, setSpareParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  const fetchInventoryData = async () => {
    try {
      setInventoryData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch all data in parallel
      const [partsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/spare-parts`),
        axios.get(`${API_BASE_URL}/spare-part-categories`)
      ]);

      const allParts = partsResponse.data || [];
      const allCategories = categoriesResponse.data || [];

      // Calculate metrics
      const lowStockItems = allParts.filter(part => {
        const minQty = part.minQuantity || 10;
        return part.quantity < minQty;
      });

      setSpareParts(allParts);
      setCategories(allCategories);

      setInventoryData({
        totalParts: allParts.length,
        totalCategories: allCategories.length,
        lowStockCount: lowStockItems.length,
        restockNeededCount: lowStockItems.length,
        loading: false,
        error: null
      });

      // Recent activity
      if (allParts.length > 0) {
        const recentItems = allParts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(part => ({
            id: part.id,
            type: 'part',
            name: part.partName,
            code: part.partCode,
            quantity: part.quantity,
            status: part.quantity < (part.minQuantity || 10) ? 'low' : 'normal',
            date: new Date(part.createdAt).toLocaleDateString(),
            brand: part.brand,
            price: part.price
          }));
        setRecentActivity(recentItems);
      }

    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setInventoryData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load inventory data. Please check your backend connection.'
      }));
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportReport = async (format) => {
    setReportLoading(true);
    setShowExportMenu(false);

    try {
      const result = await InventoryReportGenerator.generateComprehensiveReport(
        inventoryData,
        spareParts,
        categories,
        format
      );

      if (result.success) {
        // Show success toast/notification
        alert(`✅ Report exported successfully as ${format.toUpperCase()}!`);

        // Optional: Log download event
        console.log(`Report downloaded: ${format}, Items: ${inventoryData.totalParts}`);
      } else {
        alert(`❌ ${result.message || 'Failed to generate report. Please try again.'}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Error generating report. Please check console for details.');
    } finally {
      setReportLoading(false);
    }
  };

  const getStockHealth = () => {
    if (inventoryData.totalParts === 0) return 0;
    const healthyItems = inventoryData.totalParts - inventoryData.lowStockCount;
    return Math.round((healthyItems / inventoryData.totalParts) * 100);
  };

  const inventoryCards = [
    {
      title: 'Spare Parts',
      count: inventoryData.totalParts,
      icon: <Box size={24} className="text-blue-600" />,
      path: '/spare-parts',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      description: 'Total items in inventory'
    },
    {
      title: 'Categories',
      count: inventoryData.totalCategories,
      icon: <Tag size={24} className="text-purple-600" />,
      path: '/spare-part-categories',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      description: 'Inventory categories'
    },
    {
      title: 'Low Stock',
      count: inventoryData.lowStockCount,
      icon: <AlertTriangle size={24} className="text-yellow-600" />,
      path: '/spare-parts',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      description: 'Items below minimum level'
    },
    {
      title: 'Stock Health',
      count: `${getStockHealth()}%`,
      icon: <TrendingUp size={24} className="text-green-600" />,
      path: '/inventory/analytics',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      description: 'Overall inventory health'
    },
  ];

  const exportOptions = [
    { id: 'excel', label: 'Excel Report (.xlsx)', icon: <FileSpreadsheet size={16} />, color: 'text-green-600' },
    { id: 'pdf', label: 'PDF Report (.pdf)', icon: <FileText size={16} />, color: 'text-red-600' },
    { id: 'csv', label: 'CSV Data (.csv)', icon: <FileDown size={16} />, color: 'text-blue-600' },
  ];

  if (inventoryData.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage spare parts, categories, and stock levels</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInventoryData}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-50"
            title="Refresh data"
            disabled={inventoryData.loading}
          >
            <RefreshCw size={18} className={inventoryData.loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={reportLoading || inventoryData.totalParts === 0}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reportLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Export Report</span>
                  <ChevronDown size={16} />
                </>
              )}
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">Export Format</p>
                  <p className="text-xs text-gray-500">Choose report format</p>
                </div>
                {exportOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleExportReport(option.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <span className={option.color}>{option.icon}</span>
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </button>
                ))}
                <div className="border-t px-4 py-2">
                  <p className="text-xs text-gray-500">
                    {inventoryData.totalParts} items • {inventoryData.totalCategories} categories
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${card.textColor}`}>{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color.replace('bg-', 'bg-').replace('50', '100')}`}>
                {card.icon}
              </div>
            </div>
            {card.title === 'Stock Health' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStockHealth() > 70 ? 'bg-green-500' : getStockHealth() > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${getStockHealth()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity in Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/spare-parts/create"
              className="flex items-center space-x-3 p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
            >
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                <Box size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Add New Spare Part</h3>
                <p className="text-sm text-gray-500">Register new inventory item</p>
              </div>
            </Link>

            <Link
              to="/spare-part-categories/create"
              className="flex items-center space-x-3 p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
            >
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <Tag size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create Category</h3>
                <p className="text-sm text-gray-500">Organize inventory structure</p>
              </div>
            </Link>

            <Link
              to="/inventory/analytics"
              className="flex items-center space-x-3 p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-500">Inventory insights & trends</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/spare-parts" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.name}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>Code: {activity.code}</span>
                        <span>•</span>
                        <span>Qty: {activity.quantity}</span>
                        {activity.price && (
                          <>
                            <span>•</span>
                            <span>${activity.price.toFixed(2)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.date}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${activity.status === 'low' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {activity.status === 'low' ? 'Low Stock' : 'Normal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No inventory items found</p>
              <p className="text-sm text-gray-500 mt-1">Start by adding your first spare part</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Preview */}
      {inventoryData.totalParts > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready for Detailed Reports?</h3>
              <p className="text-gray-600 mt-1">
                Export comprehensive inventory data including {inventoryData.totalParts} items across {inventoryData.totalCategories} categories
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <span className="text-gray-600">
                  <span className="font-medium">{inventoryData.lowStockCount}</span> items need attention
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Stock Health: <span className={`font-medium ${getStockHealth() > 70 ? 'text-green-600' : getStockHealth() > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {getStockHealth()}%
                  </span>
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => handleExportReport('excel')}
                disabled={reportLoading}
                className="flex items-center space-x-2 bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
              >
                {reportLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileSpreadsheet size={18} />
                )}
                <span>{reportLoading ? 'Generating...' : 'Quick Export (Excel)'}</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Includes summary, details, and low stock analysis
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;


//hfahdjjdka

