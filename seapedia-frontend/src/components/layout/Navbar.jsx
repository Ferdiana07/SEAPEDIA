import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'
import useUIStore from '../../stores/uiStore'
import authService from '../../services/authService'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

// ============================================================
// NAVBAR COMPONENT
// ============================================================
// Navigasi utama di atas halaman

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, activeRole } = useAuthStore()
  const { getTotalItems, resetLocalCart } = useCartStore()
  const { success, error: showError } = useUIStore()
  
  const cartItemCount = getTotalItems()
  
  // Handle logout
  const handleLogout = () => {
    resetLocalCart()
    logout()
    navigate('/')
  }

  // Helper check if user has role
  const hasUserRole = (roleName) => {
    if (!user || !user.roles) return false
    return user.roles.some(r => r.role === roleName)
  }

  // Handle Switch Role
  const handleSwitchRole = async (role) => {
    try {
      const res = await authService.selectRole(role)
      if (res.success) {
        useAuthStore.setState({ 
          user: res.user,
          activeRole: res.user.active_role 
        })
        success(`Role ${role === 'buyer' ? 'Pembeli' : role === 'seller' ? 'Penjual' : 'Driver'} diaktifkan!`)
        
        // Redirect based on role
        if (role === 'seller') {
          navigate('/seller/dashboard')
        } else if (role === 'driver') {
          navigate('/driver/orders')
        } else if (role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mengubah role')
    }
  }

  // Handle Assign & Select Role
  const handleAssignAndSelectRole = async (role) => {
    try {
      const assignRes = await authService.assignRole(role)
      if (assignRes.success) {
        const selectRes = await authService.selectRole(role)
        if (selectRes.success) {
          useAuthStore.setState({ 
            user: selectRes.user,
            activeRole: selectRes.user.active_role 
          })
          success(`Berhasil mendaftar & mengaktifkan role ${role === 'buyer' ? 'Pembeli' : role === 'seller' ? 'Penjual' : 'Driver'}!`)
          
          if (role === 'seller') {
            navigate('/seller/dashboard')
          } else if (role === 'driver') {
            navigate('/driver/orders')
          } else {
            navigate('/')
          }
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mendaftar role baru')
    }
  }
  
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4 md:gap-8">
          
          {/* Logo & Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-primary-500 tracking-tight">SEAPEDIA</span>
            </Link>
          </div>
          
          {/* Middle - Search Bar (Visual Only for now) */}
          <div className="flex-1 hidden md:flex">
            <div className="w-full relative">
              <input 
                type="text" 
                placeholder="Cari di Seapedia..." 
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 bg-transparent">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Side - Auth & Cart */}
          <div className="flex-shrink-0 flex items-center gap-3 md:gap-5">
            {/* Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-6 mr-2">
              <Link to="/products" className="text-gray-500 hover:text-primary-500 font-medium text-sm transition-colors">
                Semua Kategori
              </Link>
            </div>

            {/* Cart */}
            {isAuthenticated() && activeRole === 'buyer' && (
              <Link 
                to="/cart" 
                className="relative p-2 text-gray-500 hover:text-primary-500 transition-colors group rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {/* Cart Badge */}
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
            
            {/* Auth Buttons */}
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all">
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100 overflow-hidden">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-600 font-bold text-sm">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    
                    {/* Name */}
                    <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[100px]">{user?.name}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    
                    {/* Header Dropdown */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        {activeRole && (
                          <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full inline-block mt-1">
                            {activeRole}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-2">
                      {/* Role-specific links */}
                      {activeRole === 'buyer' && (
                        <>
                          <Link to="/buyer/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            Dashboard Pembeli
                          </Link>
                          <Link to="/buyer/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            Daftar Transaksi
                          </Link>
                        </>
                      )}

                      {activeRole === 'seller' && (
                        <>
                          <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            Dashboard Toko
                          </Link>
                          <Link to="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            Kelola Produk
                          </Link>
                          <Link to="/seller/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            Pesanan Masuk
                          </Link>
                        </>
                      )}

                      {activeRole === 'driver' && (
                        <>
                          <Link to="/driver/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            Dashboard Driver
                          </Link>
                          <Link to="/driver/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            Ambil Pesanan
                          </Link>
                        </>
                      )}

                      {activeRole === 'admin' && (
                        <>
                          <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            🛡️ Admin Dashboard
                          </Link>
                          <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                            👥 Kelola Pengguna
                          </Link>
                        </>
                      )}

                      <div className="h-px bg-gray-100 my-2"></div>
                      
                      {/* Settings Link */}
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium">
                        ⚙️ Pengaturan Akun
                      </Link>

                      <div className="h-px bg-gray-100 my-2"></div>
                      
                      {/* Role Switcher Section */}
                      <div className="px-4 py-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ganti / Daftar Role</p>
                        <div className="space-y-1">
                          {[
                            { id: 'buyer', label: 'Pembeli 🛒' },
                            { id: 'seller', label: 'Penjual 🏪' },
                            { id: 'driver', label: 'Driver 🚗' }
                          ].map((roleItem) => {
                            const isAssigned = hasUserRole(roleItem.id);
                            const isActive = activeRole === roleItem.id;
                            
                            return (
                              <button
                                key={roleItem.id}
                                onClick={() => isAssigned ? handleSwitchRole(roleItem.id) : handleAssignAndSelectRole(roleItem.id)}
                                className={`w-full text-left px-2 py-1 rounded text-xs flex justify-between items-center transition-all ${
                                  isActive 
                                    ? 'bg-primary-50 text-primary-600 font-bold' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <span>{roleItem.label}</span>
                                {isActive && <span className="text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
                                {!isActive && !isAssigned && <span className="text-[9px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded border border-gray-200">Daftar</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <button className="px-4 py-1.5 text-sm font-bold text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
                    Masuk
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-1.5 text-sm font-bold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors shadow-sm hidden md:block">
                    Daftar
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar