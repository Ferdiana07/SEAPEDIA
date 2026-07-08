import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import productService from '../services/productService'

// ============================================================
// PRODUCTS PAGE
// ============================================================
const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  })
  
  // Fetch products
  const fetchProducts = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await productService.getAll({
        page,
        per_page: pagination.per_page,
        search: search || undefined,
      })
      
      if (response.success) {
        setProducts(response.data)
        setPagination({
          current_page: response.meta?.current_page || 1,
          per_page: response.meta?.per_page || 12,
          total: response.meta?.total || 0,
          last_page: response.meta?.last_page || 1,
        })
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [])
  
  // Search handler
  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(1) // Reset to page 1
  }
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Semua Produk
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <Button type="submit">Cari</Button>
          </form>
        </div>
        
        {/* Results Info */}
        <div className="mb-4 text-gray-600">
          Menampilkan {products.length} dari {pagination.total} produk
        </div>
        
        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} padding="none" className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 mb-4">Tidak ada produk ditemukan</p>
            <Button variant="outline" onClick={() => { setSearch(''); fetchProducts(); }}>
              Reset Pencarian
            </Button>
          </Card>
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
        
        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === 1}
              onClick={() => fetchProducts(pagination.current_page - 1)}
            >
              Previous
            </Button>
            
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchProducts(pagination.current_page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage