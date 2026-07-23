import { useState, useEffect } from 'react'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import adminService from '../../../services/adminService'

const AdminUsersPage = () => {
  const { error: showError } = useUIStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [search, setSearch] = useState('')

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const res = await adminService.getUsers({ page, search: search || undefined })
      if (res.success) {
        setUsers(res.data)
        if (res.meta) setPagination({
          current_page: res.meta.current_page,
          last_page: res.meta.last_page,
          total: res.meta.total,
        })
      }
    } catch (err) {
      showError('Gagal memuat data user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const getRoleBadge = (role, isActive) => {
    const colors = {
      admin: 'bg-red-100 text-red-700',
      seller: 'bg-blue-100 text-blue-700',
      buyer: 'bg-green-100 text-green-700',
      driver: 'bg-purple-100 text-purple-700',
    }
    return (
      <span key={role} className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded uppercase mr-1 ${
        isActive ? colors[role] || 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-400'
      }`}>
        {role}{isActive ? ' ✓' : ''}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Pengguna</h1>
          <p className="text-gray-500 mt-1">Total {pagination.total} pengguna terdaftar</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 p-4">
          <form onSubmit={(e) => { e.preventDefault(); fetchUsers(1) }} className="flex gap-3">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
            />
            <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600">
              Cari
            </button>
            {search && (
              <button type="button" onClick={() => { setSearch(''); fetchUsers(1) }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Reset
              </button>
            )}
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-3 text-gray-500 text-sm">Memuat...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pengguna</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Terdaftar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-400">#{u.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{u.email}</td>
                      <td className="py-3 px-4">
                        {u.roles?.length > 0
                          ? u.roles.map(r => getRoleBadge(r.role, r.is_active))
                          : <span className="text-xs text-gray-400">Belum ada role</span>
                        }
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <p>Tidak ada pengguna ditemukan</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => fetchUsers(pagination.current_page - 1)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => fetchUsers(pagination.current_page + 1)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage
