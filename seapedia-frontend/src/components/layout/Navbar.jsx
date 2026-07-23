import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

// ============================================================
// NAVBAR COMPONENT
// ============================================================
// Navigasi utama di atas halaman

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, activeRole } = useAuthStore()
  const { getTotalItems } = useCartStore()
  
  const cartItemCount = getTotalItems()
  
  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900">SEAPEDIA</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-600 hover:text-primary-500 transition-colors"
            >
              Products
            </Link>
          </div>
          
          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-4">
            {/* Cart (hanya untuk buyer) */}
            {isAuthenticated() && activeRole === 'buyer' && (
              <Link 
                to="/cart" 
                className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                
                {/* Cart Badge */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Auth Buttons */}
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    
                    {/* Name */}
                    <span className="hidden md:block text-gray-700">{user?.name}</span>
                    
                    {/* Role Badge */}
                    {activeRole && (
                      <Badge variant="primary" size="sm">
                        {activeRole}
                      </Badge>
                    )}
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      
                      {/* Role-specific links */}
                      {activeRole === 'buyer' && (
                        <>
                          <Link
                            to="/buyer/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/buyer/orders"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Pesanan Saya
                          </Link>
                        </>
                      )}

                      {activeRole === 'seller' && (
                        <Link
                          to="/seller/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Seller Dashboard
                        </Link>
                      )}

                      {activeRole === 'driver' && (
                        <Link
                          to="/driver/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Driver Dashboard
                        </Link>
                      )}
                      
                      <hr className="my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
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