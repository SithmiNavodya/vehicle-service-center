import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import VehicleServicesPage from './pages/VehicleServicesPage';
import VehiclesPage from './pages/VehiclesPage';
import ServiceRecordsPage from './pages/ServiceRecordsPage';
import VehicleServiceRecordsPage from './pages/VehicleServiceRecordsPage';
import MessagesPage from './pages/MessagesPage';
import SparePartCategoriesPage from './pages/SparePartCategoriesPage';
import InventoryPage from './pages/InventoryPage';
import ProfilePage from './pages/ProfilePage';

// Inventory Pages
import SuppliersPage from './pages/Inventory/SuppliersPage';
import SparePartsPage from './pages/Inventory/SparePartsPage';
import CategoriesPage from './pages/Inventory/CategoriesPage';
import IncomePage from './pages/Inventory/IncomePage';
import UsagePage from './pages/Inventory/UsagePage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Report Pages
import StockReportPage from './pages/Reports/StockReportPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>{}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/services" element={<VehicleServicesPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/service-records" element={<ServiceRecordsPage />} />
              <Route path="/vehicles/:vehicleId/records" element={<VehicleServiceRecordsPage />} />
              <Route path="/spare-part-categories" element={<SparePartCategoriesPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/spare-parts" element={<SparePartsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/usage" element={<UsagePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/reports/stock" element={<StockReportPage />} />
              <Route path="/profile" element={<ProfilePage />} />


              {/* Placeholder Pages */}
              <Route path="/appointments" element={
                <div style={{ padding: '50px', textAlign: 'center' }}>
                  <h1>Appointments Page</h1>
                  <p>This page is under construction.</p>
                </div>
              } />
              <Route path="/orders" element={
                <div style={{ padding: '50px', textAlign: 'center' }}>
                  <h1>Service Orders Page</h1>
                  <p>This page is under construction.</p>
                </div>
              } />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/dashboard">Go to Dashboard</a>
            </div>
          } />
        </Routes>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
//hdfkaflhjhkhks