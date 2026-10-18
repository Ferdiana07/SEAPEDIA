import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CheckCircle, Info, Warning, WarningCircle, X } from '@phosphor-icons/react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BottomNav from './components/layout/BottomNav'
import useAuthStore from './stores/authStore'
import useUIStore from './stores/uiStore'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const StoreDetailPage = lazy(() => import('./pages/StoreDetailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'))
const BuyerDashboardPage = lazy(() => import('./pages/dashboard/buyer/DashboardPage'))
const CartPage = lazy(() => import('./pages/dashboard/buyer/CartPage'))
const OrdersPage = lazy(() => import('./pages/dashboard/buyer/OrdersPage'))
const OrderDetailPage = lazy(() => import('./pages/dashboard/buyer/OrderDetailPage'))
const WalletPage = lazy(() => import('./pages/dashboard/buyer/WalletPage'))
const AddressListPage = lazy(() => import('./pages/dashboard/buyer/AddressListPage'))
const AddressFormPage = lazy(() => import('./pages/dashboard/buyer/AddressFormPage'))
const SellerDashboardPage = lazy(() => import('./pages/dashboard/seller/DashboardPage'))
const SellerProductsPage = lazy(() => import('./pages/dashboard/seller/ProductsPage'))
const SellerStorePage = lazy(() => import('./pages/dashboard/seller/StorePage'))
const SellerOrdersPage = lazy(() => import('./pages/dashboard/seller/OrdersPage'))
const DriverDashboardPage = lazy(() => import('./pages/dashboard/driver/DashboardPage'))
const DriverOrdersPage = lazy(() => import('./pages/dashboard/driver/OrdersPage'))
const AdminDashboardPage = lazy(() => import('./pages/dashboard/admin/DashboardPage'))
const AdminUsersPage = lazy(() => import('./pages/dashboard/admin/UsersPage'))
const AdminDiscountsPage = lazy(() => import('./pages/dashboard/admin/DiscountsPage'))
const HelpInfoPage = lazy(() => import('./pages/HelpInfoPage'))

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, activeRole } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  if (role && activeRole !== role) return <Navigate to="/select-role" replace />
  return children
}

function ToastContainer() {
  const { toasts, removeToast } = useUIStore()
  const icons = {
    success: CheckCircle,
    error: WarningCircle,
    warning: Warning,
    info: Info,
  }
  const colors = {
    success: 'border-success-500/30 text-success-600',
    error: 'border-danger-500/30 text-danger-600',
    warning: 'border-warning-500/30 text-warning-600',
    info: 'border-primary-500/30 text-primary-600',
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm space-y-2 pointer-events-none" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info
        return (
          <div key={toast.id} className={`pointer-events-auto animate-fade-up rounded-2xl border bg-white px-4 py-3 shadow-card-hover ${colors[toast.type] || colors.info}`}>
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 shrink-0" size={20} weight="fill" />
              <span className="flex-1 text-sm font-semibold leading-5 text-ink">{toast.message}</span>
              <button type="button" onClick={() => removeToast(toast.id)} className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup notifikasi"><X size={15} weight="bold" /></button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const guard = (element, role) => <ProtectedRoute role={role}>{element}</ProtectedRoute>

function PageLoader() {
  return <div className="page-shell py-10" aria-label="Memuat halaman"><div className="h-36 animate-pulse rounded-3xl bg-primary-100" /><div className="mt-5 grid gap-4 sm:grid-cols-3"><div className="h-28 animate-pulse rounded-2xl bg-slate-200" /><div className="h-28 animate-pulse rounded-2xl bg-slate-200" /><div className="h-28 animate-pulse rounded-2xl bg-slate-200" /></div></div>
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/stores/:id" element={<StoreDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/settings" element={guard(<SettingsPage />)} />
            <Route path="/select-role" element={guard(<RoleSelectionPage />)} />

            <Route path="/buyer/dashboard" element={guard(<BuyerDashboardPage />, 'buyer')} />
            <Route path="/cart" element={guard(<CartPage />, 'buyer')} />
            <Route path="/buyer/orders" element={guard(<OrdersPage />, 'buyer')} />
            <Route path="/buyer/orders/:id" element={guard(<OrderDetailPage />, 'buyer')} />
            <Route path="/buyer/wallet" element={guard(<WalletPage />, 'buyer')} />
            <Route path="/buyer/addresses" element={guard(<AddressListPage />, 'buyer')} />
            <Route path="/buyer/addresses/new" element={guard(<AddressFormPage />, 'buyer')} />
            <Route path="/buyer/addresses/:id/edit" element={guard(<AddressFormPage />, 'buyer')} />

            <Route path="/seller/dashboard" element={guard(<SellerDashboardPage />, 'seller')} />
            <Route path="/seller/products" element={guard(<SellerProductsPage />, 'seller')} />
            <Route path="/seller/store" element={guard(<SellerStorePage />, 'seller')} />
            <Route path="/seller/orders" element={guard(<SellerOrdersPage />, 'seller')} />

            <Route path="/driver/dashboard" element={guard(<DriverDashboardPage />, 'driver')} />
            <Route path="/driver/orders" element={guard(<DriverOrdersPage />, 'driver')} />

            <Route path="/admin/dashboard" element={guard(<AdminDashboardPage />, 'admin')} />
            <Route path="/admin/users" element={guard(<AdminUsersPage />, 'admin')} />
            <Route path="/admin/discounts" element={guard(<AdminDiscountsPage />, 'admin')} />
            <Route path="/help" element={<HelpInfoPage />} />
            <Route path="/help/:topic" element={<HelpInfoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </main>
        <Footer />
        <BottomNav />
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}
