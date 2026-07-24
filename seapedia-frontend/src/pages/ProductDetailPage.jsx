// File: src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import useProductStore from '../stores/productStore'
import useCartStore from '../stores/cartStore'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'
import reviewService from '../services/reviewService'

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Stores
  const { currentProduct, fetchById, isLoading, error } = useProductStore()
  const { addItem, items, store } = useCartStore()
  const { isAuthenticated, activeRole } = useAuthStore()
  const { success, warning, error: showError } = useUIStore()
  
  // Local state
  const [quantity, setQuantity] = useState(1)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewSummary, setReviewSummary] = useState({ average_rating: 0, total_reviews: 0 })
  const [reviewsLoading, setReviewsLoading] = useState(false)

  // Fetch product
  useEffect(() => {
    fetchById(parseInt(id))

    return () => {
      // Cleanup
    }
  }, [id])

  // Fetch review publik untuk produk (BAB 9 - COMPFEST Level 1)
  useEffect(() => {
    const loadReviews = async () => {
      setReviewsLoading(true)
      try {
        const res = await reviewService.getForProduct(parseInt(id))
        if (res.success) {
          setReviews(res.data || [])
          setReviewSummary(res.summary || { average_rating: 0, total_reviews: 0 })
        }
      } catch (err) {
        // Gagal load review tidak boleh menghalangi tampil produk
        console.error('Gagal memuat review:', err)
      } finally {
        setReviewsLoading(false)
      }
    }
    loadReviews()
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
  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      warning('Silakan login terlebih dahulu')
      return false
    }
    
    if (activeRole !== 'buyer') {
      warning('Hanya buyer yang bisa menambahkan ke cart')
      return false
    }
    
    // Cek single-store rule
    if (store && store.id !== currentProduct.store_id) {
      warning('Cart dari toko lain akan dihapus. Checkout cart dulu atau kosongkan cart.')
    }
    
    try {
      await addItem(currentProduct, quantity)
      success(`${currentProduct.name} ditambahkan ke cart!`)
      return true
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal menambahkan ke cart')
      return false
    }
  }

  // Handle beli langsung
  const handleBuyNow = async () => {
    const success = await handleAddToCart()
    if (success) {
      navigate('/cart')
    }
  }
  
  // Submit review (BAB 9)
  const handleSubmitReview = async () => {
    if (!isAuthenticated()) {
      warning('Silakan login terlebih dahulu untuk memberi review')
      return
    }

    setSubmittingReview(true)
    try {
      const res = await reviewService.create(parseInt(id), {
        rating: reviewData.rating,
        comment: reviewData.comment?.trim() || null,
      })

      if (res.success) {
        success('Review berhasil dikirim!')
        setShowReviewModal(false)
        setReviewData({ rating: 5, comment: '' })

        // Refresh daftar review agar review baru langsung muncul
        const list = await reviewService.getForProduct(parseInt(id))
        if (list.success) {
          setReviews(list.data || [])
          setReviewSummary(list.summary || { average_rating: 0, total_reviews: 0 })
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengirim review'
      showError(msg)
    } finally {
      setSubmittingReview(false)
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
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ==================== LEFT: IMAGE ==================== */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm sticky top-24">
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
          </div>
          
          {/* ==================== MIDDLE: INFO & REVIEWS ==================== */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              
              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              
              {/* Rating Summary (Top) */}
              <div className="flex items-center text-sm mb-4 pb-4 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-bold">{reviewSummary.average_rating ? Number(reviewSummary.average_rating).toFixed(1) : '-'}</span>
                  <span className="text-gray-500">({reviewSummary.total_reviews} rating)</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="text-gray-600">
                  Terjual <span className="font-bold">100+</span>
                </div>
              </div>

              {/* Price */}
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                {formatPrice(currentProduct.price)}
              </h2>

              {/* Description Tabs */}
              <div className="mb-2">
                <h3 className="font-bold text-gray-900 border-b-2 border-primary-500 inline-block pb-2 text-primary-600">
                  Detail
                </h3>
              </div>
              <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed pb-6 border-b border-gray-100 mb-6">
                {currentProduct.description || 'Tidak ada deskripsi'}
              </div>

              {/* Store Profile */}
              {currentProduct.store && (
                <div className="flex items-center gap-4 py-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                    {currentProduct.store.name.charAt(0)}
                  </div>
                  <div>
                    <Link to={`/stores/${currentProduct.store_id}`} className="font-bold text-gray-900 hover:text-primary-600">
                      {currentProduct.store.name}
                    </Link>
                    <p className="text-xs text-green-600 font-semibold mt-1">• Online</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto rounded-full font-bold">
                    Follow
                  </Button>
                </div>
              )}
            </div>
            
            {/* ==================== REVIEWS SECTION ==================== */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="reviews-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Ulasan Pembeli</h2>
                <Button variant="ghost" size="sm" className="text-primary-600 font-bold" onClick={() => {
                  if (!isAuthenticated()) {
                    warning('Silakan login untuk memberi review')
                    return
                  }
                  setShowReviewModal(true)
                }}>
                  Tulis Ulasan
                </Button>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-8 text-gray-500">Memuat ulasan...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                          {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-400 text-sm">
                              {'★'.repeat(review.rating)}
                              {'☆'.repeat(5 - review.rating)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(review.created_at).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm block mb-2">
                            {review.user?.name || 'Anonymous'}
                          </span>
                          {review.comment && (
                            <p className="text-gray-700 text-sm whitespace-pre-line">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="font-bold text-gray-900 mb-1">Belum ada ulasan</p>
                  <p className="text-sm text-gray-500 mb-4">Jadilah yang pertama memberikan ulasan untuk produk ini.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* ==================== RIGHT: KOTAK BELI ==================== */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Atur jumlah dan catatan</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9 w-24">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(currentProduct.stock, parseInt(e.target.value) || 1)))}
                    className="w-8 h-full text-center border-none focus:ring-0 p-0 text-sm font-semibold"
                    min="1"
                    max={currentProduct.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                    className="w-8 h-full flex items-center justify-center text-primary-500 font-bold hover:bg-gray-100 active:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Stok: <span className="font-bold">{currentProduct.stock}</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatPrice(currentProduct.price * quantity)}
                </span>
              </div>

              {currentProduct.stock > 0 ? (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full rounded-xl"
                  >
                    + Keranjang
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={handleBuyNow}
                  >
                    Beli Langsung
                  </Button>
                </div>
              ) : (
                <Button className="w-full rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                  Stok Habis
                </Button>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-gray-500 text-sm">
                <button className="flex items-center gap-1 hover:text-gray-900">
                  <span>♡</span> Wishlist
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button className="flex items-center gap-1 hover:text-gray-900">
                  <span>↗</span> Share
                </button>
              </div>
            </div>
          </div>

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
            <Button onClick={handleSubmitReview} disabled={submittingReview}>
              {submittingReview ? 'Mengirim...' : 'Kirim Review'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetailPage