// File: src/pages/dashboard/driver/DashboardPage.jsx
// Penjelasan: Dashboard utama untuk driver

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import orderService from '../../../services/orderService'

// ============================================================
// DRIVER DASHBOARD PAGE
// ============================================================
const DriverDashboardPage = () => {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()

  // State untuk data
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    available: 0,
    active: 0,
    completed: 0,
  })
  const [availableOrders, setAvailableOrders] = useState([])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch orders yang tersedia (waiting_shipper) dan yang sedang diantar (shipping)
        const [availableRes, activeRes] = await Promise.all([
          orderService.getAll({ status: 'waiting_shipper' }),
          orderService.getAll({ status: 'shipping' })
        ])

        // Update stats
        setStats({
          available: availableRes.success ? availableRes.data.length : 0,
          active: activeRes.success ? activeRes.data.length : 0,
          completed: 0, // TODO: hitung dari completed orders
        })

        // Set available orders
        if (availableRes.success) {
          setAvailableOrders(availableRes.data.slice(0, 5))
        }
      } catch (err) {
        console.error('Gagal mengambil statistik:', err)
        showError('Gagal memuat dashboard')
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
    }).format(price)
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
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
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Tersedia</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {stats.available}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Pesanan yang bisa diambil
                </p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Aktif</p>
                <p className="text-3xl font-bold text-blue-500 mt-1">
                  {stats.active}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Sedang dalam pengantaran
                </p>
              </div>
              <span className="text-4xl">🚗</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Selesai</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {stats.completed}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Total pesanan selesai
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </Card>
        </div>

        {/* Available Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Orders */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Pesanan Tersedia</h2>
              <Link to="/driver/orders" className="text-primary-500 hover:underline text-sm">
                Lihat Semua
              </Link>
            </div>

            {availableOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl">📦</span>
                <p className="mt-2">Tidak ada pesanan yang tersedia</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.store_name || 'Toko'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    <Link to={`/driver/orders/${order.id}`}>
                      <Button size="sm" variant="outline">
                        Ambil
                      </Button>
                    </Link>
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
                to="/driver/orders"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-medium text-gray-900">Lihat Pesanan</p>
                  <p className="text-sm text-gray-500">Ambil atau antar pesanan</p>
                </div>
              </Link>

              <Link
                to="/"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">🏠</span>
                <div>
                  <p className="font-medium text-gray-900">Kembali ke Beranda</p>
                  <p className="text-sm text-gray-500">Lihat produk marketplace</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DriverDashboardPage
