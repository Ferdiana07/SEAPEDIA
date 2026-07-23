import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import adminService from '../../../services/adminService'

const STATS_CONFIG = [
  { key: 'total_users',    label: 'Total Pengguna',    icon: '👥', color: 'text-blue-600',   bg: 'bg-blue-50' },
  { key: 'total_stores',   label: 'Toko Aktif',        icon: '🏪', color: 'text-green-600',  bg: 'bg-green-50' },
  { key: 'total_products', label: 'Produk Aktif',      icon: '📦', color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'total_orders',   label: 'Total Pesanan',     icon: '📋', color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'total_revenue',  label: 'Total Pendapatan',  icon: '💰', color: 'text-green-700',  bg: 'bg-green-50', isCurrency: true },
  { key: 'pending_orders', label: 'Pesanan Pending',   icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50' },
]

const AdminDashboardPage = () => {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentUsers, setRecentUsers] = useState([])

  const formatPrice = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
        ])
        if (statsRes.success) setStats(statsRes.data)
        if (usersRes.success) setRecentUsers(usersRes.data.slice(0, 8))
      } catch (err) {
        showError('Gagal memuat data admin')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Selamat datang, {user?.name}! Kelola platform SEAPEDIA.</p>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {STATS_CONFIG.map(s => (
            <div key={s.key} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                    {s.isCurrency ? formatPrice(stats[s.key]) : (stats[s.key] ?? 0)}
                  </p>
                </div>
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Users */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Pengguna Terbaru</h2>
              <Link to="/admin/users" className="text-sm text-primary-500 hover:underline">
                Lihat Semua
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nama</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-600">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles?.length > 0 ? u.roles.map(r => (
                            <span key={r.role} className={`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase ${
                              r.is_active ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {r.role}
                            </span>
                          )) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Menu Admin</h2>
            <div className="space-y-2">
              {[
                { to: '/admin/users', icon: '👥', label: 'Kelola Pengguna', desc: 'Lihat & kelola semua user' },
                { to: '/products', icon: '📦', label: 'Lihat Produk', desc: 'Semua produk di marketplace' },
                { to: '/', icon: '🏠', label: 'Beranda', desc: 'Kembali ke halaman utama' },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
