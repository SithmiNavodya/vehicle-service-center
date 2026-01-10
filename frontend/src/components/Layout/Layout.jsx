import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Home,
  Users,
  Car,
  Wrench,
  FileText,
  MessageSquare,
  Package,
  BarChart3,
  Menu,
  X,
  Bell,
  User,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get authentication state
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'Service Records', href: '/service-records', icon: FileText },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Reports', href: '/reports/stock', icon: BarChart3 },
  ];

  const inventorySubMenu = [
    { name: 'Suppliers', href: '/suppliers' },
    { name: 'Spare Parts', href: '/spare-parts' },
    { name: 'Categories', href: '/categories' },
    { name: 'Income', href: '/income' },
    { name: 'Usage', href: '/usage' },
  ];

  const isActive = (path) => location.pathname === path;

  const isInventoryActive = () =>
    location.pathname.startsWith('/suppliers') ||
    location.pathname.startsWith('/spare-parts') ||
    location.pathname.startsWith('/categories') ||
    location.pathname.startsWith('/income') ||
    location.pathname.startsWith('/usage') ||
    location.pathname === '/inventory';

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };

  // Get user info or show default
  const userName = user?.firstName || 'Admin User';
  const userEmail = user?.email || 'admin@vsc.com';
  const userRole = user?.role || 'ADMIN';

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentNav = navigation.find(nav => nav.href === location.pathname);
    if (currentNav) return currentNav.name;

    const currentSubNav = inventorySubMenu.find(sub => sub.href === location.pathname);
    if (currentSubNav) return currentSubNav.name;

    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/vehicles/')) return 'Vehicle Records';
    if (location.pathname.startsWith('/reports/')) return 'Reports';

    // Extract from path
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }

    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">VSC Manager</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                to={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>

              {/* Inventory Submenu */}
              {item.name === 'Inventory' && isInventoryActive() && (
                <div className="ml-8 mt-1 space-y-1">
                  {inventorySubMenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      className={`
                        block px-3 py-2 text-sm rounded-lg transition-colors
                        ${location.pathname === subItem.href
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              <p className="text-xs text-blue-600 font-medium">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {getCurrentPageTitle()}
              </h1>
              <p className="text-sm text-gray-500">
                Vehicle Service Center Management System
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <User size={20} />
                  <span className="hidden md:inline">{userName.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-700">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>

                    <div className="border-t my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content - Use Outlet instead of children */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;