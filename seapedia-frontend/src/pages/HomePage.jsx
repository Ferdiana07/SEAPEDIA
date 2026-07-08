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
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang di SEAPEDIA
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Platform e-commerce multi-role untuk Buyer, Seller, dan Driver.
              Belanja, jualan, dan antar dengan mudah!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  Browse Products
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Get Started
                </Button>
              </Link>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} padding="none" className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card padding="none" hover className="h-full">
                    {/* Image */}
                    <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Store */}
                      {product.store && (
                        <Badge variant="default" size="sm" className="mb-2">
                          {product.store.name}
                        </Badge>
                      )}
                      
                      {/* Name */}
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <p className="text-lg font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </p>
                      
                      {/* Stock */}
                      <p className="text-sm text-gray-500 mt-1">
                        Stok: {product.stock}
                      </p>
                    </div>
                  </Card>
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