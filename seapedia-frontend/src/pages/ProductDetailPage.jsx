// File: src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import useProductStore from '../stores/productStore'
import useCartStore from '../stores/cartStore'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
const ProductDetailPage = () => {
  const { id } = useParams()
  
  // Stores
  const { currentProduct, fetchById, isLoading, error } = useProductStore()
  const { addItem, items, store } = useCartStore()
  const { isAuthenticated, activeRole } = useAuthStore()
  const { success, warning, error: showError } = useUIStore()
  
  // Local state
  const [quantity, setQuantity] = useState(1)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  
  // Fetch product
  useEffect(() => {
    fetchById(parseInt(id))
    
    return () => {
      // Cleanup
    }
  }, [id])
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      warning('Silakan login terlebih dahulu')
      return
    }
    
    if (activeRole !== 'buyer') {
      warning('Hanya buyer yang bisa menambahkan ke cart')
      return
    }
    
    // Cek single-store rule
    if (store && store.id !== currentProduct.store_id) {
      warning('Cart dari toko lain akan dihapus. Checkout cart dulu atau kosongkan cart.')
    }
    
    addItem(currentProduct, quantity)
    success(`${currentProduct.name} ditambahkan ke cart!`)
  }
  
  // Submit review
  const handleSubmitReview = async () => {
    try {
      // TODO: Call review API
      success('Review berhasil dikirim!')
      setShowReviewModal(false)
      setReviewData({ rating: 5, comment: '' })
    } catch (err) {
      showError('Gagal mengirim review')
    }
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat produk...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Produk tidak ditemukan
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'Produk yang kamu cari tidak tersedia'}
          </p>
          <Link to="/products">
            <Button variant="outline">Kembali ke Produk</Button>
          </Link>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{currentProduct.name}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="aspect-square">
              {currentProduct.image_url ? (
                <img
                  src={currentProduct.image_url}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-6xl text-gray-300">📦</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <Card>
              {/* Store */}
              {currentProduct.store && (
                <Link 
                  to={`/stores/${currentProduct.store_id}`}
                  className="inline-block mb-4"
                >
                  <Badge variant="secondary" size="md">
                    🏪 {currentProduct.store.name}
                  </Badge>
                </Link>
              )}
              
              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              
              {/* Price */}
              <p className="text-3xl font-bold text-primary-600 mb-4">
                {formatPrice(currentProduct.price)}
              </p>
              
              {/* Stock */}
              <div className="flex items-center gap-4 mb-6">
                <Badge variant={currentProduct.stock > 0 ? 'success' : 'danger'} dot>
                  {currentProduct.stock > 0 ? 'Tersedia' : 'Stok Habis'}
                </Badge>
                <span className="text-gray-600">
                  Stok: {currentProduct.stock}
                </span>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {currentProduct.description || 'Tidak ada deskripsi'}
                </p>
              </div>
              
              {/* Quantity & Add to Cart */}
              {currentProduct.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700">Jumlah:</label>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(currentProduct.stock, parseInt(e.target.value) || 1)))}
                        className="w-16 text-center border-none focus:ring-0"
                        min="1"
                        max={currentProduct.stock}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1"
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      }
                    >
                      Tambah ke Cart
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowReviewModal(true)}
                    >
                      📝 Beri Review
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Share */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">
                  Bagikan: 
                  <button className="text-primary-500 hover:underline ml-2">Facebook</button>
                  <button className="text-primary-500 hover:underline ml-2">Twitter</button>
                  <button className="text-primary-500 hover:underline ml-2">WhatsApp</button>
                </p>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ulasan Produk</h2>
          
          {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
            <div className="grid gap-4">
              {currentProduct.reviews.map((review) => (
                <Card key={review.id}>
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {review.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-yellow-400">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-gray-500">Belum ada ulasan untuk produk ini</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowReviewModal(true)}
              >
                Jadilah yang pertama memberikan review
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Beri Review"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className={`text-2xl ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-2">Komentar</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tulis pengalamanmu dengan produk ini..."
            />
          </div>
          
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowReviewModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitReview}>
              Kirim Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetailPage