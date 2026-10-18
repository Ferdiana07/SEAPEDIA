import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  FadersHorizontal,
  MagnifyingGlass,
  Storefront,
  X,
} from '@phosphor-icons/react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import CategoryIcon from '../components/ui/CategoryIcon'
import productService from '../services/productService'
import ProductImage from '../components/ui/ProductImage'
import { formatCurrency } from '../utils/formatCurrency'

const CATEGORIES = [
  { id: 'all', label: 'Semua', value: '' },
  { id: 'alat-pancing', label: 'Alat Pancing', value: 'Alat Pancing' },
  { id: 'budidaya', label: 'Budidaya', value: 'Budidaya' },
  { id: 'pakan', label: 'Pakan', value: 'Pakan' },
  { id: 'akuarium', label: 'Akuarium', value: 'Akuarium' },
  { id: 'biota-hidup', label: 'Biota Hidup', value: 'Biota Hidup' },
  { id: 'tanaman-laut', label: 'Tanaman Laut', value: 'Tanaman Laut' },
  { id: 'hasil-laut', label: 'Hasil Laut', value: 'Hasil Laut' },
  { id: 'kuliner-laut', label: 'Kuliner Laut', value: 'Kuliner Laut' },
]

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Terbaru' },
  { value: 'price:asc', label: 'Harga terendah' },
  { value: 'price:desc', label: 'Harga tertinggi' },
  { value: 'name:asc', label: 'Nama A-Z' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const normalizedCategory = CATEGORIES.some((item) => item.id === initialCategory)
    ? initialCategory
    : (CATEGORIES.find((item) => item.value === initialCategory)?.id || 'all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [pagination, setPagination] = useState({ current_page: 1, total: 0, last_page: 1 })
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(normalizedCategory)
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'created_at:desc')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true)
    setLoadError('')
    const selected = CATEGORIES.find((item) => item.id === category)
    const [sort_by, sort_order] = sort.split(':')
    try {
      const response = await productService.getAll({
        page,
        per_page: 12,
        sort_by,
        sort_order,
        ...(selected?.value ? { category: selected.value } : {}),
        ...(appliedSearch ? { search: appliedSearch } : {}),
        ...(minPrice ? { min_price: Number(minPrice) } : {}),
        ...(maxPrice ? { max_price: Number(maxPrice) } : {}),
      })
      if (response.success) {
        setProducts(response.data)
        setPagination(response.meta || { current_page: 1, total: response.data.length, last_page: 1 })
      }
    } catch {
      setLoadError('Katalog belum dapat dimuat. Coba beberapa saat lagi.')
    } finally {
      setLoading(false)
    }
  }, [appliedSearch, category, maxPrice, minPrice, sort])

  useEffect(() => { fetchProducts(1) }, [fetchProducts])

  const syncUrl = (overrides = {}) => {
    const values = { search: appliedSearch, category, min_price: minPrice, max_price: maxPrice, sort, ...overrides }
    const next = {}
    Object.entries(values).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'created_at:desc') next[key] = value
    })
    setSearchParams(next, { replace: true })
  }

  const submitSearch = (event) => {
    event.preventDefault()
    const nextSearch = search.trim()
    setAppliedSearch(nextSearch)
    syncUrl({ search: nextSearch })
  }

  const applyPrice = () => syncUrl()

  const reset = () => {
    setSearch('')
    setAppliedSearch('')
    setCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setSort('created_at:desc')
    setSearchParams({}, { replace: true })
  }

  const selectCategory = (value) => {
    setCategory(value)
    syncUrl({ category: value })
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-10">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-primary-700">Katalog Bahari Pilihan</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">Semua Kebutuhan Laut dalam Satu Tempat.</h1>
          <p className="mt-3 leading-7 text-slate-600">Jelajahi alat pancing, kebutuhan budidaya, akuarium, biota hasil budidaya, hingga kuliner laut dengan transaksi yang transparan.</p>
        </div>

        <form onSubmit={submitSearch} className="surface mt-6 sm:mt-8 flex gap-2 p-1.5 sm:p-2">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input border-0 pl-9 sm:pl-10 text-xs sm:text-sm shadow-none focus:ring-0" placeholder="Cari nama produk, kategori, atau toko..." aria-label="Cari produk" />
          </div>
          <Button type="submit" size="sm" className="sm:!h-11 sm:!px-5">Cari</Button>
        </form>

        <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 hide-scrollbar touch-pan-x" aria-label="Kategori produk">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectCategory(id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-bold transition active:scale-95 ${
                category === id
                  ? 'border-primary-900 bg-primary-900 text-white shadow-sm'
                  : 'border-slate-200/90 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-900 hover:shadow-card-sm'
              }`}
            >
              <CategoryIcon
                category={id}
                variant="icon"
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${category === id ? 'scale-110 brightness-125' : ''}`}
              />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Desktop Filter Sidebar */}
          <aside className="surface hidden h-fit p-5 lg:block lg:sticky lg:top-24">
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-ink">Filter</h2><button type="button" onClick={reset} className="text-xs font-bold text-primary-700 hover:text-primary-900">Reset</button></div>
            <div className="mt-5 space-y-4">
              <div><label htmlFor="min-price" className="text-xs font-bold text-slate-500">Harga minimum</label><input id="min-price" type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className="input mt-2" placeholder="Rp0" /></div>
              <div><label htmlFor="max-price" className="text-xs font-bold text-slate-500">Harga maksimum</label><input id="max-price" type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="input mt-2" placeholder="Tanpa batas" /></div>
              <Button type="button" variant="outline" className="w-full" onClick={applyPrice}>Terapkan harga</Button>
            </div>
          </aside>

          <main>
            {/* Toolbar: Category Title + Filter Trigger (Mobile) + Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-ink">
                  {CATEGORIES.find((item) => item.id === category)?.label || 'Semua produk'}
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                  {loading ? 'Mencari produk...' : `${pagination.total || 0} produk ditemukan`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-primary-300 hover:text-primary-800 lg:hidden active:scale-95"
                >
                  <FadersHorizontal size={16} weight="bold" />
                  <span>Filter</span>
                  {(minPrice || maxPrice) && (
                    <span className="h-2 w-2 rounded-full bg-primary-600" />
                  )}
                </button>
                <select
                  value={sort}
                  onChange={(event) => { setSort(event.target.value); syncUrl({ sort: event.target.value }) }}
                  className="input h-10 w-auto flex-1 sm:w-48 text-xs font-bold py-1 px-3"
                  aria-label="Urutkan produk"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {(appliedSearch || minPrice || maxPrice) && <div className="mt-4 flex flex-wrap gap-2">{appliedSearch && <span className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">“{appliedSearch}” <button type="button" aria-label="Hapus pencarian" onClick={() => { setSearch(''); setAppliedSearch(''); syncUrl({ search: '' }) }}><X size={13} /></button></span>}{minPrice && <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">Min. {formatCurrency(minPrice)}</span>}{maxPrice && <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">Maks. {formatCurrency(maxPrice)}</span>}</div>}

            {loadError && <div className="mt-6 rounded-2xl border border-danger-200 bg-danger-50 p-5 text-sm font-semibold text-danger-600">{loadError}</div>}
            {!loadError && <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {loading && Array.from({ length: 8 }, (_, index) => <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="aspect-square animate-pulse bg-slate-100" /><div className="space-y-3 p-4"><div className="h-3 animate-pulse rounded bg-slate-100" /><div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" /></div></div>)}
              {!loading && products.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white py-14 text-center"><MagnifyingGlass size={40} className="mx-auto text-slate-400" /><h3 className="mt-4 font-extrabold text-ink">Produk tidak ditemukan</h3><p className="mt-2 text-sm text-slate-500">Ubah kata kunci atau hapus filter aktif.</p><Button type="button" variant="outline" className="mt-5" onClick={reset}>Reset filter</Button></div>}
              {!loading && products.map((product) => <Link key={product.id} to={`/products/${product.id}`} className="product-card group"><div className="aspect-square overflow-hidden bg-slate-100"><ProductImage src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-3 sm:p-4"><h3 className="line-clamp-2 min-h-9 sm:min-h-10 text-xs sm:text-sm font-semibold leading-snug sm:leading-5 text-slate-700 group-hover:text-primary-700">{product.name}</h3><p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-extrabold text-ink">{formatCurrency(product.price)}</p><p className="mt-1.5 sm:mt-2 flex items-center gap-1 truncate text-[11px] sm:text-xs text-slate-500"><Storefront size={14} className="text-primary-600 shrink-0" /> <span className="truncate">{product.store?.name || 'Toko SEAPEDIA'}</span></p><p className="mt-1 text-[11px] sm:text-xs font-semibold text-success-600">Stok {product.stock}</p></div></Link>)}
            </div>}

            {pagination.last_page > 1 && <div className="mt-8 flex items-center justify-center gap-3"><Button variant="outline" size="sm" disabled={pagination.current_page === 1} onClick={() => fetchProducts(pagination.current_page - 1)} leftIcon={<ArrowLeft size={16} />}>Sebelumnya</Button><span className="text-sm font-semibold text-slate-500">{pagination.current_page} / {pagination.last_page}</span><Button variant="outline" size="sm" disabled={pagination.current_page === pagination.last_page} onClick={() => fetchProducts(pagination.current_page + 1)} rightIcon={<ArrowRight size={16} />}>Selanjutnya</Button></div>}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Rentang Harga"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="mobile-min-price" className="text-xs font-bold text-slate-600">Harga minimum (Rp)</label>
            <input
              id="mobile-min-price"
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="input mt-1.5"
              placeholder="Contoh: 10000"
            />
          </div>
          <div>
            <label htmlFor="mobile-max-price" className="text-xs font-bold text-slate-600">Harga maksimum (Rp)</label>
            <input
              id="mobile-max-price"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="input mt-1.5"
              placeholder="Contoh: 500000"
            />
          </div>
          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setMinPrice('')
                setMaxPrice('')
                syncUrl({ min_price: '', max_price: '' })
                setMobileFilterOpen(false)
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => {
                applyPrice()
                setMobileFilterOpen(false)
              }}
            >
              Terapkan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
