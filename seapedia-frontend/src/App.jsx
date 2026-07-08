import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/dashboard/buyer/CartPage'
import OrdersPage from './pages/dashboard/buyer/OrdersPage'
import WalletPage from './pages/dashboard/buyer/WalletPage'
import SellerDashboardPage from './pages/dashboard/seller/DashboardPage'
import SellerProductsPage from './pages/dashboard/seller/ProductsPage'
import DriverOrdersPage from './pages/dashboard/driver/OrdersPage'

// Stores
import useAuthStore from './stores/authStore'
import useUIStore from './stores/uiStore'

// ============================================================
// PROTECTED ROUTE WRAPPER
// ============================================================
/**
 * Wrapper untuk route yang butuh autentikasi
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, activeRole } = useAuthStore()
  
  // Belum login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  // Butuh role tertentu
  if (requiredRole && activeRole !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// ============================================================
// ROLE ROUTE WRAPPER
// ============================================================
/**
 * Wrapper untuk route berdasarkan role
 */
const RoleRoute = ({ children, role }) => {
  const { isAuthenticated, activeRole } = useAuthStore()
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  if (activeRole !== role) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// ============================================================
// TOAST COMPONENT
// ============================================================
const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore()
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg text-white
            animate-slide-in
            ${toast.type === 'success' ? 'bg-green-500' : ''}
            ${toast.type === 'error' ? 'bg-red-500' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500' : ''}
            ${toast.type === 'info' ? 'bg-blue-500' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            
            {/* Landing Page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Products */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* ==================== PROTECTED ROUTES ==================== */}
            
            {/* Buyer Routes */}
            <Route
              path="/cart"
              element={
                <RoleRoute role="buyer">
                  <CartPage />
                </RoleRoute>
              }
            />
            <Route
              path="/buyer/orders"
              element={
                <RoleRoute role="buyer">
                  <OrdersPage />
                </RoleRoute>
              }
            />
            <Route
              path="/buyer/wallet"
              element={
                <RoleRoute role="buyer">
                  <WalletPage />
                </RoleRoute>
              }
            />
            
            {/* Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <RoleRoute role="seller">
                  <SellerDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <RoleRoute role="seller">
                  <SellerProductsPage />
                </RoleRoute>
              }
            />
            
            {/* Driver Routes */}
            <Route
              path="/driver/orders"
              element={
                <RoleRoute role="driver">
                  <DriverOrdersPage />
                </RoleRoute>
              }
            />
            
            {/* ==================== CATCH ALL ==================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}

export default App