// File: src/pages/dashboard/seller/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'

// ============================================================
// SELLER DASHBOARD PAGE
// ============================================================
const SellerDashboardPage = () => {
  // Sample stats - akan fetch dari API nanti
  const [stats] = useState({
    totalProducts: 12,
    pendingOrders: 5,
    completedOrders: 47,
    totalRevenue: 2450000,
  })
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-1">Selamat datang di dashboard seller!</p>
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
                <p className="text-sm text-gray-500">Pesanan Baru</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {stats.pendingOrders}
                </p>
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Selesai</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.completedOrders}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Penjualan</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Pesanan Terbaru</h2>
              <Link to="/seller/orders" className="text-primary-500 hover:underline text-sm">
                Lihat Semua
              </Link>
            </div>
            
            <div className="space-y-4">
              {/* Sample order */}
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">#ORD-001</p>
                  <p className="text-sm text-gray-500">Ani - 2 items</p>
                </div>
                <Badge variant="warning">Menunggu</Badge>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">#ORD-002</p>
                  <p className="text-sm text-gray-500">Budi - 1 item</p>
                </div>
                <Badge variant="info">Dikirim</Badge>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">#ORD-003</p>
                  <p className="text-sm text-gray-500">Caca - 3 items</p>
                </div>
                <Badge variant="success">Selesai</Badge>
              </div>
            </div>
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