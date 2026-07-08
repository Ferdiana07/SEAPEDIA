import { Link } from 'react-router-dom'

// ============================================================
// FOOTER COMPONENT
// ============================================================
// Footer untuk setiap halaman

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-white">SEAPEDIA</span>
            </div>
            <p className="text-gray-400 mb-4">
              Platform e-commerce multi-role untuk kompetisi COMPFEST.
              Belajar membangun aplikasi full-stack dengan Laravel dan React.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Roles */}
          <div>
            <h3 className="font-semibold text-white mb-4">Roles</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">👤 Buyer</li>
              <li className="text-gray-400">🏪 Seller</li>
              <li className="text-gray-400">🚗 Driver</li>
              <li className="text-gray-400">👔 Admin</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} SEAPEDIA. 
            Dibuat untuk COMPFEST Competition.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer