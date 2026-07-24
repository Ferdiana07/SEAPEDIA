// File: src/pages/dashboard/seller/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import productService from '../../../services/productService'
import orderService from '../../../services/orderService'

// ============================================================
// SELLER DASHBOARD PAGE
// ============================================================
const SellerDashboardPage = () => {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()

  // State untuk data
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  // Inisialisasi langsung dari user untuk menghindari race condition
  const hasStore = Boolean(user?.store)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!hasStore) return

      setLoading(true)
      try {
        // Fetch stats dan orders secara parallel
        const [statsRes, ordersRes] = await Promise.all([
          productService.getMyStats(),
          orderService.getAll({ status: 'packaging' })
        ])

        if (statsRes.success) {
          setStats({
            totalProducts: statsRes.data.total_products || 0,
            activeProducts: statsRes.data.active_products || 0,
            outOfStock: statsRes.data.out_of_stock || 0,
          })
        }

        if (ordersRes.success) {
          setRecentOrders(ordersRes.data.slice(0, 5))
        }
      } catch (err) {
        console.error('Gagal memuat dashboard:', err)
        showError('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [hasStore])

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
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

  // Jika belum punya toko - tampilkan placeholder
  if (!hasStore) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <span className="text-6xl">🏪</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Kamu Belum Punya Toko
            </h2>
            <p className="text-gray-600 mb-6">
              Buat toko terlebih dahulu untuk mulai berjualan
            </p>
            <Link to="/seller/store/new">
              <Button>Buat Toko Sekarang</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-1">Selamat datang, {user?.name}!</p>
          </div>
          <Link to="/seller/products/new">
            <Button leftIcon={<span>➕</span>}>
              Tambah Produk
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Produk</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalProducts}
                </p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Produk Aktif</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.activeProducts}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Stok Habis</p>
                <p className="text-3xl font-bold text-red-500 mt-1">
                  {stats.outOfStock}
                </p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Baru</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {recentOrders.length}
                </p>
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Pesanan Masuk</h2>
              <Link to="/seller/orders" className="text-primary-500 hover:underline text-sm">
                Lihat Semua
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Belum ada pesanan masuk
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.items_count || order.items?.length || 0} items
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
                to="/seller/products"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-medium text-gray-900">Kelola Produk</p>
                  <p className="text-sm text-gray-500">Tambah, edit, atau hapus produk</p>
                </div>
              </Link>

              <Link
                to="/seller/orders"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium text-gray-900">Kelola Pesanan</p>
                  <p className="text-sm text-gray-500">Proses pesanan masuk</p>
                </div>
              </Link>

              <Link
                to="/seller/store"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">🏪</span>
                <div>
                  <p className="font-medium text-gray-900">Pengaturan Toko</p>
                  <p className="text-sm text-gray-500">Edit info toko</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboardPage