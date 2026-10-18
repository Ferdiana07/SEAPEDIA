import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBagOpen,
  Star,
  Storefront,
  Truck,
} from '@phosphor-icons/react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import productService from '../services/productService'
import ProductImage from '../components/ui/ProductImage'
import reviewService from '../services/reviewService'
import useAuthStore from '../stores/authStore'
import useCartStore from '../stores/cartStore'
import useUIStore from '../stores/uiStore'
import { formatCurrency } from '../utils/formatCurrency'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, activeRole } = useAuthStore()
  const { addItem, store: cartStore } = useCartStore()
  const { success, warning, error: showError } = useUIStore()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ average_rating: 0, total_reviews: 0 })
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [adding, setAdding] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewConfirmOpen, setReviewConfirmOpen] = useState(false)

  const loadReviews = async () => {
    const response = await reviewService.getForProduct(Number(id))
    if (response.success) {
      setReviews(response.data || [])
      setSummary(response.summary || { average_rating: 0, total_reviews: 0 })
    }
  }

  useEffect(() => {
    let active = true
    Promise.all([productService.getById(Number(id)), reviewService.getForProduct(Number(id))])
      .then(([productResponse, reviewResponse]) => {
        if (!active) return
        if (productResponse.success) setProduct(productResponse.data)
        if (reviewResponse.success) {
          setReviews(reviewResponse.data || [])
          setSummary(reviewResponse.summary || { average_rating: 0, total_reviews: 0 })
        }
      })
      .catch(() => { if (active) setLoadError('Produk tidak ditemukan atau sedang tidak tersedia.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const addToCart = async () => {
    if (!isAuthenticated()) {
      warning('Masuk sebagai Pembeli untuk menambahkan produk.')
      navigate('/login')
      return false
    }
    if (activeRole !== 'buyer') {
      warning('Aktifkan role Pembeli untuk berbelanja.')
      return false
    }
    if (cartStore && cartStore.id !== product.store_id) {
      warning('Selesaikan atau kosongkan keranjang dari toko lain terlebih dahulu.')
      return false
    }
    setAdding(true)
    try {
      await addItem(product, quantity)
      success(`${product.name} ditambahkan ke keranjang.`)
      return true
    } catch (error) {
      showError(error.response?.data?.message || 'Produk belum dapat ditambahkan.')
      return false
    } finally {
      setAdding(false)
    }
  }

  const buyNow = async () => {
    if (await addToCart()) navigate('/cart')
  }

  const requestReview = (event) => {
    event.preventDefault()
    if (!isAuthenticated() || activeRole !== 'buyer') {
      warning('Aktifkan role Pembeli untuk memberi ulasan.')
      return
    }
    setReviewOpen(false)
    setReviewConfirmOpen(true)
  }

  const submitReview = async () => {
    setSubmittingReview(true)
    try {
      await reviewService.create(Number(id), { rating: reviewData.rating, comment: reviewData.comment.trim() || null })
      success('Ulasan produk berhasil dikirim.')
      setReviewOpen(false)
      setReviewConfirmOpen(false)
      setReviewData({ rating: 5, comment: '' })
      await loadReviews()
    } catch (error) {
      showError(error.response?.data?.message || 'Ulasan belum dapat dikirim.')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <div className="page-shell py-10"><div className="grid gap-8 lg:grid-cols-2"><div className="aspect-square animate-pulse rounded-3xl bg-slate-200" /><div className="h-96 animate-pulse rounded-3xl bg-slate-100" /></div></div>

  if (loadError || !product) return <div className="page-shell py-20 text-center"><Package size={48} className="mx-auto text-slate-400" /><h1 className="mt-4 text-2xl font-extrabold text-ink">Produk tidak ditemukan</h1><p className="mt-2 text-slate-500">{loadError}</p><Button as={Link} to="/products" variant="outline" className="mt-6" leftIcon={<ArrowLeft size={17} />}>Kembali ke katalog</Button></div>

  return (
    <div className="bg-white py-6 sm:py-10 pb-28 sm:pb-10">
      <div className="page-shell">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-700"><ArrowLeft size={18} /> Kembali ke katalog</Link>

        <section className="mt-5 grid gap-7 lg:grid-cols-[1fr_.9fr]">
          <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
            <ProductImage src={product.image_url} alt={product.name} iconSize={72} className="h-full w-full object-cover" />
          </div>

          <div className="surface flex flex-col p-6 sm:p-8">
            {product.category && <p className="text-sm font-bold text-primary-700">{product.category}</p>}
            <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {summary.total_reviews > 0 ? <span className="flex items-center gap-1 font-bold text-amber-700"><Star size={18} weight="fill" /> {summary.average_rating} <span className="font-medium text-slate-500">({summary.total_reviews} ulasan)</span></span> : <span className="text-slate-500">Belum ada ulasan</span>}
              <span className="text-slate-300">|</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-success-600' : 'text-danger-600'}`}>{product.stock > 0 ? `Stok ${product.stock}` : 'Stok habis'}</span>
            </div>
            <p className="mt-6 text-3xl font-extrabold text-primary-700">{formatCurrency(product.price)}</p>
            <p className="mt-5 leading-7 text-slate-600">{product.description || 'Penjual belum menambahkan deskripsi produk.'}</p>

            <Link to={`/stores/${product.store_id}`} className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition hover:bg-primary-50">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-700"><Storefront size={23} weight="duotone" /></span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-500">Dijual oleh</span><span className="mt-0.5 block truncate text-sm font-extrabold text-ink">{product.store?.name || 'Toko SEAPEDIA'}</span></span>
              <ArrowLeft size={18} className="rotate-180 text-slate-400" />
            </Link>

            <div className="mt-auto pt-7">
              <div className="flex items-center justify-between gap-4"><span className="text-sm font-bold text-ink">Jumlah</span><div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white"><button type="button" aria-label="Kurangi jumlah" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-10 w-10 place-items-center text-slate-600 hover:bg-slate-100"><Minus size={17} /></button><span className="w-10 text-center text-sm font-extrabold">{quantity}</span><button type="button" aria-label="Tambah jumlah" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="grid h-10 w-10 place-items-center text-primary-700 hover:bg-primary-50"><Plus size={17} /></button></div></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><Button variant="outline" size="lg" disabled={product.stock === 0} isLoading={adding} onClick={addToCart} leftIcon={<ShoppingBagOpen size={20} />}>Tambah ke keranjang</Button><Button size="lg" disabled={product.stock === 0} onClick={buyNow}>Beli sekarang</Button></div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold text-slate-500"><span className="flex items-center gap-2"><ShieldCheck size={18} className="text-success-600" /> Pembayaran wallet</span><span className="flex items-center gap-2"><Truck size={18} className="text-primary-600" /> 3 opsi pengiriman</span></div>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[.7fr_1.3fr]" aria-labelledby="reviews-heading">
          <div className="rounded-3xl bg-primary-950 p-7 text-white">
            <Star size={34} weight="duotone" className="text-amber-300" />
            <h2 id="reviews-heading" className="mt-5 text-2xl font-extrabold">Ulasan pembeli</h2>
            <p className="mt-3 text-sm leading-6 text-primary-100">Bagikan pengalaman produk agar pembeli lain dapat mengambil keputusan lebih baik.</p>
            {activeRole === 'buyer' && <Button className="mt-6 bg-accent-500 hover:bg-accent-600" onClick={() => setReviewOpen(true)}>Tulis ulasan</Button>}
          </div>
          <div className="surface p-6">
            {reviews.length === 0 ? <div className="py-8 text-center"><Star size={36} className="mx-auto text-slate-300" /><p className="mt-3 font-bold text-ink">Belum ada ulasan</p><p className="mt-1 text-sm text-slate-500">Jadilah pembeli pertama yang berbagi pengalaman.</p></div> : <div className="space-y-5">{reviews.map((review) => <article key={review.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"><div className="flex items-center justify-between gap-3"><p className="font-bold text-ink">{review.user?.name || 'Pengguna SEAPEDIA'}</p><span className="flex items-center gap-1 text-xs font-bold text-amber-700"><Star size={15} weight="fill" /> {review.rating}/5</span></div>{review.comment && <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>}</article>)}</div>}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Purchase Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 block border-t border-slate-200/90 bg-white/95 px-4 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] backdrop-blur-md sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[11px] font-medium text-slate-500">Harga Satuan</span>
            <span className="block truncate text-base font-extrabold text-primary-800">
              {formatCurrency(product.price)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={product.stock === 0}
              isLoading={adding}
              onClick={addToCart}
              className="!h-10 !px-3"
              aria-label="Tambah ke keranjang"
            >
              <ShoppingBagOpen size={18} weight="bold" />
            </Button>
            <Button
              size="sm"
              disabled={product.stock === 0}
              onClick={buyNow}
              className="!h-10 !px-4 text-xs font-bold"
            >
              Beli Sekarang
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Tulis ulasan produk">
        <form onSubmit={requestReview}>
          <fieldset><legend className="text-sm font-bold text-ink">Rating</legend><div className="mt-3 flex gap-2">{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" onClick={() => setReviewData((value) => ({ ...value, rating }))} aria-label={`${rating} bintang`} className={`grid h-10 w-10 place-items-center rounded-xl transition ${reviewData.rating >= rating ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}><Star size={20} weight={reviewData.rating >= rating ? 'fill' : 'regular'} /></button>)}</div></fieldset>
          <label htmlFor="product-review" className="mt-5 block text-sm font-bold text-ink">Komentar</label>
          <textarea id="product-review" value={reviewData.comment} onChange={(event) => setReviewData((value) => ({ ...value, comment: event.target.value }))} className="input mt-2 min-h-28 resize-y" maxLength={1000} placeholder="Ceritakan kualitas produk dan pengalamanmu" />
          <div className="mt-5 flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setReviewOpen(false)}>Batal</Button><Button type="submit" isLoading={submittingReview} leftIcon={<CheckCircle size={18} />}>Kirim ulasan</Button></div>
        </form>
      </Modal>
      <ConfirmDialog
        isOpen={reviewConfirmOpen}
        onClose={() => { setReviewConfirmOpen(false); setReviewOpen(true) }}
        onConfirm={submitReview}
        title="Kirim ulasan produk?"
        description="Ulasan akan tampil secara publik menggunakan nama akunmu. Pastikan rating dan komentar sudah sesuai pengalamanmu."
        details={[{ label: 'Rating', value: `${reviewData.rating} dari 5` }, { label: 'Komentar', value: reviewData.comment.trim() || 'Tanpa komentar' }]}
        confirmLabel="Kirim ulasan"
        isLoading={submittingReview}
      />
    </div>
  )
}
