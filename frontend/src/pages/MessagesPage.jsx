// src/pages/MessagesPage.jsx
import { useState, useEffect } from 'react';
import {
  Search, Filter, RefreshCw, Send, CheckCircle,
  XCircle, Clock, MessageSquare, Phone, User, Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, pending: 0 });

  const [filters, setFilters] = useState({
    phoneNumber: '',
    status: '',
    customerId: ''
  });

  const statusColors = {
    SENT: 'bg-green-100 text-green-800 border-green-300',
    FAILED: 'bg-red-100 text-red-800 border-red-300',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    DELIVERED: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const statusIcons = {
    SENT: <CheckCircle className="w-4 h-4 mr-2" />,
    FAILED: <XCircle className="w-4 h-4 mr-2" />,
    PENDING: <Clock className="w-4 h-4 mr-2" />,
    DELIVERED: <CheckCircle className="w-4 h-4 mr-2" />
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: rowsPerPage,
        ...(filters.phoneNumber && { phoneNumber: filters.phoneNumber }),
        ...(filters.status && { status: filters.status }),
        ...(filters.customerId && { customerId: filters.customerId })
      };

      // CORRECTED: Just 'sms-log/page' since baseURL already has '/api'
      const response = await api.get('/sms-log/page', { params });
      setMessages(response.data.content || []);
      setTotalItems(response.data.totalItems || 0);
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Failed to load messages. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // CORRECTED: Just 'sms-log/stats'
      const response = await api.get('/sms-log/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Set default stats if API fails
      setStats({ total: 0, sent: 0, failed: 0, pending: 0 });
    }
  };

  useEffect(() => {
    loadMessages();
    loadStats();
  }, [page, rowsPerPage]);

  useEffect(() => {
    // Reload when filters change (with debounce)
    const timer = setTimeout(() => {
      setPage(0);
      loadMessages();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleResend = async (id) => {
    try {
      // CORRECTED: Just 'sms-log/resend/{id}'
      await api.post(`/sms-log/resend/${id}`);
      loadMessages();
      loadStats();
      alert('SMS has been queued for resending.');
    } catch (error) {
      console.error('Error resending message:', error);
      alert('Failed to resend SMS. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SMS Messages</h1>
            <p className="text-gray-600">View and manage all sent SMS messages</p>
          </div>
        </div>
        <button
          onClick={() => {
            loadMessages();
            loadStats();
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sent</p>
              <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.phoneNumber}
                onChange={(e) => setFilters({...filters, phoneNumber: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search phone number..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="SENT">Sent</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={filters.customerId}
                onChange={(e) => setFilters({...filters, customerId: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Customer ID"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Record
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {message.phoneNumber || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 truncate" title={message.message}>
                            {message.message || 'No message'}
                          </p>
                          {message.errorMessage && (
                            <p className="text-xs text-red-600 mt-1" title={message.errorMessage}>
                              Error: {message.errorMessage.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[message.status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                          {statusIcons[message.status]}
                          {message.status || 'UNKNOWN'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(message.sentAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {message.serviceRecordId ? (
                          <a
                            href={`/service-records/${message.serviceRecordId}`}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Record #{message.serviceRecordId}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {message.status === 'FAILED' && (
                          <button
                            onClick={() => handleResend(message.id)}
                            className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm"
                            title="Resend SMS"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Resend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">of {totalItems} messages</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  «
                </button>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  ‹
                </button>

                <span className="px-3 py-1 text-sm">
                  Page {page + 1} of {totalPages || 1}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  ›
                </button>
                <button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;