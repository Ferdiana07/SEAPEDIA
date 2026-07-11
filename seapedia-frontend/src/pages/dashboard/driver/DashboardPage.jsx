// File: src/pages/dashboard/driver/DashboardPage.jsx
// Penjelasan: Dashboard utama untuk driver

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import useOrderStore from '../../../stores/orderStore'

// ============================================================
// DRIVER DASHBOARD PAGE
// ============================================================
const DriverDashboardPage = () => {
  // Stores
  const { orders, isLoading, fetchOrders } = useOrderStore()

  // Stats
  const [stats, setStats] = useState({
    available: 0,
    active: 0,
    completed: 0,
  })

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  // Fetch stats
  const fetchStats = async () => {
    try {
      // Fetch available orders (waiting_shipper)
      const availableRes = await fetchOrders({ status: 'waiting_shipper' })

      // Update stats
      setStats({
        available: orders.length,
        active: 0,
        completed: 0,
      })
    } catch (err) {
      console.error('Gagal mengambil statistik:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di dashboard driver!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Tersedia</p>
                <p className="text-3xl font-bold text-warning-600 mt-1">
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
                <p className="text-3xl font-bold text-primary-600 mt-1">
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
                <p className="text-3xl font-bold text-success-600 mt-1">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders Summary */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Pesanan Terbaru</h2>
              <Link to="/driver/orders" className="text-primary-500 hover:underline text-sm">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-4">
              {/* Placeholder - will be populated from orders */}
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl">📦</span>
                <p className="mt-2">Cek pesanan yang tersedia untuk diantar</p>
              </div>
            </div>
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
