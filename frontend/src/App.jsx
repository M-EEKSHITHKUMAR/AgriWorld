import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import MarketplaceCreate from './pages/MarketplaceCreate';
import DiseaseScanner from './pages/DiseaseScanner';
import ScanHistory from './pages/ScanHistory';
import GovernmentSchemes from './pages/GovernmentSchemes';
import CropWorks from './pages/CropWorks';
import Profile from './pages/Profile';

const Protected = ({ children }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
          <Route path="/marketplace/new" element={<Protected><MarketplaceCreate /></Protected>} />
          <Route path="/disease-scanner" element={<Protected><DiseaseScanner /></Protected>} />
          <Route path="/disease-scanner/history" element={<Protected><ScanHistory /></Protected>} />
          <Route path="/government-schemes" element={<Protected><GovernmentSchemes /></Protected>} />
          <Route path="/crop-works" element={<Protected><CropWorks /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
