import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import productService from '../services/productService'

// ============================================================
// HOME PAGE
// ============================================================
const HomePage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll({ per_page: 8 })
        if (response.success) {
          setProducts(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  return (
    <div className="min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section className="bg-white pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-8 md:p-12 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Dekorasi background */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
            <div className="absolute bottom-0 right-32 -mb-12 w-32 h-32 rounded-full bg-white opacity-10"></div>
            
            <div className="relative z-10 max-w-xl">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                Belanja Nyaman, <br/>Jualan Cuan.
              </h1>
              <p className="text-lg md:text-xl text-primary-50 mb-8 opacity-90">
                Temukan jutaan produk dari ribuan toko terpercaya. Gratis ongkir se-Indonesia!
              </p>
              <div className="flex gap-4">
                <Link to="/products">
                  <button className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
                    Mulai Belanja
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Ilustrasi Placeholder */}
            <div className="hidden md:flex relative z-10">
              <div className="w-64 h-48 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center shadow-lg">
                <span className="text-6xl">🛍️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Kategori Pilihan</h2>
            <div className="flex overflow-x-auto gap-4 pb-2 snap-x hide-scrollbar">
              {[
                { icon: '📱', name: 'Elektronik' },
                { icon: '👕', name: 'Pakaian' },
                { icon: '🍔', name: 'Makanan' },
                { icon: '🎮', name: 'Hobi & Mainan' },
                { icon: '💄', name: 'Kecantikan' },
                { icon: '🏠', name: 'Rumah Tangga' },
              ].map((cat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[100px] cursor-pointer group snap-start">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl group-hover:bg-primary-50 group-hover:border-primary-100 group-hover:shadow-sm transition-all duration-200">
                    {cat.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Kenapa SEAPEDIA?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Belanja Mudah</h3>
              <p className="text-gray-600">
                Pilihkan produk dari berbagai toko dan checkout dengan satu klik.
              </p>
            </Card>
            
            {/* Feature 2 */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Jualan Praktis</h3>
              <p className="text-gray-600">
                Buka toko dan kelola produk dengan mudah. Terima pesanan langsung.
              </p>
            </Card>
            
            {/* Feature 3 */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Antar Cepat</h3>
              <p className="text-gray-600">
                Driver antar pesanan dengan cepat ke alamat tujuan.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* ==================== PRODUCTS SECTION ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Produk Terbaru
            </h2>
            <Link to="/products">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <div className="product-card h-full group bg-white">
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      {/* Name */}
                      <h3 className="text-sm text-gray-800 leading-snug line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors h-10">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <p className="font-bold text-gray-900 mb-1">
                        {formatPrice(product.price)}
                      </p>
                      
                      {/* Store */}
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{product.store?.name || 'Toko'}</span>
                      </div>
                      
                      {/* Rating (Placeholder) & Sold */}
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="mr-1">4.9</span>
                        <span className="mx-1">|</span>
                        <span>Terjual 100+</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Bergabunglah dengan SEAPEDIA hari ini dan mulai pengalaman e-commerce baru!
          </p>
          <Link to="/register">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage