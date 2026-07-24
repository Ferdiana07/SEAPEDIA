import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import productService from '../services/productService'

// ============================================================
// KATEGORI — filter by kolom category di database
// ============================================================
const CATEGORIES = [
  { id: 'all',        label: 'Semua Kategori',      icon: '🌐', value: '' },
  { id: 'elektronik', label: 'Elektronik',           icon: '📱', value: 'elektronik' },
  { id: 'pakaian',   label: 'Pakaian & Fashion',    icon: '👗', value: 'pakaian' },
  { id: 'makanan',   label: 'Makanan & Minuman',    icon: '🍔', value: 'makanan' },
  { id: 'kesehatan', label: 'Kesehatan',             icon: '💊', value: 'kesehatan' },
  { id: 'olahraga',  label: 'Olahraga',              icon: '⚽', value: 'olahraga' },
  { id: 'otomotif',  label: 'Otomotif',              icon: '🚗', value: 'otomotif' },
]

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Terbaru' },
  { value: 'price:asc', label: 'Harga Terendah' },
  { value: 'price:desc', label: 'Harga Tertinggi' },
  { value: 'name:asc', label: 'Nama A-Z' },
]

// ============================================================
// PRODUCTS PAGE
// ============================================================
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  })

  // Filter state — sync with URL params
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at:desc')

  // Format currency
  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  // Build API params from current filter state
  const buildParams = useCallback((page = 1) => {
    const cat = CATEGORIES.find(c => c.id === selectedCategory)
    const [sortField, sortOrder] = sortBy.split(':')

    const params = {
      page,
      per_page: 12,
      sort_by: sortField,
      sort_order: sortOrder,
    }

    // Category filter — kirim sebagai param `category` ke backend
    if (cat && cat.value) params.category = cat.value

    // Text search
    if (search) params.search = search

    if (minPrice) params.min_price = parseInt(minPrice)
    if (maxPrice) params.max_price = parseInt(maxPrice)

    return params
  }, [search, selectedCategory, minPrice, maxPrice, sortBy])

  // Fetch products
  const fetchProducts = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await productService.getAll(buildParams(page))
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
  }, [buildParams])

  // Initial + on filter change
  useEffect(() => {
    fetchProducts(1)
  }, [selectedCategory, sortBy]) // auto-fetch when category or sort changes

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(1)
  }

  // Handle apply price filter
  const handleApplyFilter = () => {
    fetchProducts(1)
  }

  // Handle reset all
  const handleReset = () => {
    setSearch('')
    setSelectedCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('created_at:desc')
    // Will trigger useEffect via sortBy change
  }

  return (
    <div className="min-h-screen bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">

        {/* ==================== SIDEBAR FILTER ==================== */}
        <div className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900">Filter</h2>
              <button
                onClick={handleReset}
                className="text-xs text-primary-500 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Category */}
            <div className="mb-5">
              <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Kategori</h3>
              <div className="space-y-0.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary-50 text-primary-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Harga</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                    <span className="px-2 text-xs text-gray-400 bg-gray-50 border-r border-gray-300 py-1.5">Rp</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="flex-1 text-sm px-2 py-1.5 outline-none"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Maksimum</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                    <span className="px-2 text-xs text-gray-400 bg-gray-50 border-r border-gray-300 py-1.5">Rp</span>
                    <input
                      type="number"
                      placeholder="∞"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="flex-1 text-sm px-2 py-1.5 outline-none"
                      min="0"
                    />
                  </div>
                </div>
                <button
                  onClick={handleApplyFilter}
                  className="w-full py-1.5 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="flex-1 min-w-0">

          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {selectedCategory === 'all'
                  ? 'Semua Produk'
                  : CATEGORIES.find(c => c.id === selectedCategory)?.label}
              </h1>
              {!isLoading && (
                <p className="text-sm text-gray-500">{pagination.total} produk ditemukan</p>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:w-64">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                  Cari
                </button>
              </form>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm px-2 py-2 outline-none bg-white"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Badge */}
          {(selectedCategory !== 'all' || minPrice || maxPrice || search) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                  <button onClick={() => setSelectedCategory('all')} className="ml-1 text-primary-500 hover:text-primary-700">×</button>
                </span>
              )}
              {minPrice && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                  Min: {formatPrice(minPrice)}
                  <button onClick={() => setMinPrice('')} className="ml-1 text-primary-500 hover:text-primary-700">×</button>
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                  Maks: {formatPrice(maxPrice)}
                  <button onClick={() => setMaxPrice('')} className="ml-1 text-primary-500 hover:text-primary-700">×</button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                  "{search}"
                  <button onClick={() => setSearch('')} className="ml-1 text-primary-500 hover:text-primary-700">×</button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <span className="text-5xl block mb-3">🔍</span>
              <h3 className="font-bold text-gray-900 mb-1">Produk tidak ditemukan</h3>
              <p className="text-gray-500 mb-4 text-sm">Coba ubah kata kunci atau hapus filter pencarian.</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      <h3 className="text-sm text-gray-800 leading-snug line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors h-10">
                        {product.name}
                      </h3>
                      <p className="font-bold text-gray-900 mb-1">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{product.store?.name || 'Toko'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="mr-1">4.9</span>
                        <span className="mx-1">|</span>
                        <span>Stok: {product.stock}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => fetchProducts(pagination.current_page - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                ← Sebelumnya
              </button>
              <span className="px-4 py-2 text-gray-600 text-sm">
                Halaman {pagination.current_page} dari {pagination.last_page}
              </span>
              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => fetchProducts(pagination.current_page + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage