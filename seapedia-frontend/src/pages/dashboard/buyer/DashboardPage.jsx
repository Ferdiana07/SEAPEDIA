// File: src/pages/dashboard/buyer/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import walletService from '../../../services/walletService'
import orderService from '../../../services/orderService'

// ============================================================
// BUYER DASHBOARD PAGE
// ============================================================
const BuyerDashboardPage = () => {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()

  // State untuk data
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    balance: 0,
    activeOrders: 0,
    completedOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch wallet dan orders secara parallel
        const [walletRes, activeOrdersRes, completedOrdersRes] = await Promise.all([
          walletService.getWallet(),
          orderService.getAll({ status: 'packaging,waiting_shipper,shipping' }),
          orderService.getAll({ status: 'completed' })
        ])

        // Update wallet stats
        if (walletRes.success) {
          setStats(prev => ({
            ...prev,
            balance: walletRes.data.balance || 0,
          }))
        }

        // Update order stats
        if (activeOrdersRes.success) {
          setStats(prev => ({
            ...prev,
            activeOrders: activeOrdersRes.data.length || 0,
          }))
        }

        if (completedOrdersRes.success) {
          setStats(prev => ({
            ...prev,
            completedOrders: completedOrdersRes.data.length || 0,
          }))
        }

        // Set recent orders (dari active orders)
        if (activeOrdersRes.success) {
          setRecentOrders(activeOrdersRes.data.slice(0, 5))
        }
      } catch (err) {
        console.error('Gagal memuat dashboard:', err)
        showError('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      packaging: 'Sedang Dikemas',
      waiting_shipper: 'Menunggu Driver',
      shipping: 'Sedang Dikirim',
      completed: 'Selesai',
      returned: 'Dikembalikan',
    }
    return labels[status] || status
  }

  // Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      packaging: 'warning',
      waiting_shipper: 'info',
      shipping: 'primary',
      completed: 'success',
      returned: 'danger',
    }
    return variants[status] || 'default'
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo Wallet</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatPrice(stats.balance)}
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Aktif</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {stats.activeOrders}
                </p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Selesai</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {stats.completedOrders}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Pesanan Aktif</h2>
              <Link to="/buyer/orders" className="text-primary-500 hover:underline text-sm">
                Lihat Semua
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Tidak ada pesanan aktif
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h2>

            <div className="space-y-3">
              <Link
                to="/products"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">🛒</span>
                <div>
                  <p className="font-medium text-gray-900">Belanja Sekarang</p>
                  <p className="text-sm text-gray-500">Jelajahi produk marketplace</p>
                </div>
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">🛒</span>
                <div>
                  <p className="font-medium text-gray-900">Lihat Keranjang</p>
                  <p className="text-sm text-gray-500">Checkout dan lanjutkan belanja</p>
                </div>
              </Link>

              <Link
                to="/buyer/wallet"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium text-gray-900">Top Up Wallet</p>
                  <p className="text-sm text-gray-500">Tambah saldo untuk belanja</p>
                </div>
              </Link>

              <Link
                to="/buyer/addresses"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium text-gray-900">Kelola Alamat</p>
                  <p className="text-sm text-gray-500">Tambah atau edit alamat pengiriman</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboardPage
