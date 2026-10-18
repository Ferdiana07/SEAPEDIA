import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bicycle,
  HandHeart,
  Package,
  ShieldCheck,
  ShoppingBagOpen,
  Storefront,
  Truck,
  Wallet,
} from '@phosphor-icons/react'
import ApplicationReviews from '../components/home/ApplicationReviews'
import PromoBannerSlider from '../components/home/PromoBannerSlider'
import Button from '../components/ui/Button'
import CategoryIcon from '../components/ui/CategoryIcon'
import ProductImage from '../components/ui/ProductImage'
import productService from '../services/productService'
import { formatCurrency } from '../utils/formatCurrency'

const CATEGORIES = [
  { name: 'Alat Pancing', key: 'alat-pancing', desc: 'Joran & Reel' },
  { name: 'Budidaya', key: 'budidaya', desc: 'Keramba & Kincir' },
  { name: 'Pakan', key: 'pakan', desc: 'Nutrisi & Pelet' },
  { name: 'Akuarium', key: 'akuarium', desc: 'Tangki & Reef' },
  { name: 'Biota Hidup', key: 'biota-hidup', desc: 'Ikan & Anemon' },
  { name: 'Tanaman Laut', key: 'tanaman-laut', desc: 'Caulerpa & Alga' },
  { name: 'Hasil Laut', key: 'hasil-laut', desc: 'Tangkapan Segar' },
  { name: 'Kuliner Laut', key: 'kuliner-laut', desc: 'Olahan & Masakan' },
]

const VALUE_PROPS = [
  { icon: Truck, title: 'Pengiriman Sesuai Produk'},
  { icon: ShieldCheck, title: 'Asal Produk Jelas'},
  { icon: Wallet, title: 'Dompet & Bayar Aman'},
  { icon: HandHeart, title: 'Dukung Pesisir'},
]

const ROLE_BENEFITS = [
  {
    name: 'Pembeli',
    description: 'Temukan perlengkapan bahari, kebutuhan budidaya, dan hidangan laut segar dengan transaksi aman serta pelacakan transparan.',
    icon: ShoppingBagOpen,
  },
  {
    name: 'Penjual',
    description: 'Daftarkan usaha bahari atau toko pesisir Anda, kelola katalog produk secara mandiri, dan terima pencairan hasil penjualan dengan praktis.',
    icon: Storefront,
  },
  {
    name: 'Driver',
    description: 'Antar pesanan produk laut dan perlengkapan pesisir di rute Anda dengan sistem bagi hasil yang adil serta pencatatan penghasilan yang rapi.',
    icon: Bicycle,
  },
  {
    name: 'Admin',
    description: 'Kelola verifikasi mitra toko pesisir, konfigurasi promo diskon, dan awasi kelancaran seluruh transaksi platform secara terpadu.',
    icon: ShieldCheck,
  },
]

export default function HomePage() {
  const [products, setProducts]   = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    productService.getAll({ per_page: 8 })
      .then((response) => { if (active && response.success) setProducts(response.data) })
      .catch(() => { if (active) setLoadError('Produk terbaru belum dapat dimuat.') })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Viewport ─────────────────────────────────────────── */}
      <section className="relative flex min-h-0 lg:min-h-[calc(100vh-68px)] items-center overflow-hidden bg-primary-900 py-8 sm:py-10 lg:py-14">
        {/* Ambient atmospheric sea lights */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[550px] w-[550px] rounded-full bg-cyan-500/15 blur-[140px]" aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-700/30 blur-[160px]" aria-hidden="true" />

        {/* Wave pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url('/ocean-pattern.jpg')", backgroundSize: '160px' }}
          aria-hidden="true"
        />

        {/* Subtle gradient fade to bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary-950/40 to-transparent" aria-hidden="true" />

        <div className="page-shell relative z-10 w-full py-4 sm:py-6 lg:py-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1.1fr] lg:gap-14">
            {/* Copy */}
            <div className="animate-fade-up">
              <h1 className="text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.25rem]">
                Marketplace Bahari Indonesia,<br />
                <span className="bg-gradient-to-r from-blue-200 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                  Dari Pesisir ke Rumahmu.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
                Temukan alat pancing, kebutuhan budidaya, perlengkapan akuarium, biota hasil budidaya, serta olahan laut dari mitra pesisir tepercaya.
              </p>

              {/* Service Guarantees Bar (Real e-commerce value props) */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300 shadow-inner backdrop-blur-sm border border-white/10">
                      <Icon size={22} weight="duotone" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white sm:text-sm leading-snug">{title}</p>
                      <p className="mt-1 text-xs text-blue-100/85 leading-snug break-words">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image card */}
            <div className="relative block animate-fade-up" style={{ animationDelay: '150ms' }}>
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-primary-950/40 p-2 shadow-2xl backdrop-blur-sm ring-1 ring-white/10 sm:rounded-3xl">
                <div className="aspect-[16/10] overflow-hidden rounded-xl sm:aspect-[16/9] sm:rounded-2xl">
                  <img
                    src="/hero-ocean-marketplace.webp"
                    alt="Armada kapal dan pelabuhan pesisir mitra SEAPEDIA di Labuan Bajo"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    width={720}
                    height={405}
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kategori ──────────────────────────────────────────────── */}
      <section className="page-shell py-10 sm:py-16" aria-labelledby="category-heading">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="category-heading" className="text-lg font-bold text-ink sm:text-xl">
              Belanja per Kategori
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">Pilih kelompok produk sesuai kebutuhanmu</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs font-semibold text-primary-700 transition-colors hover:text-primary-900 sm:text-sm"
          >
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map(({ name, key, desc }) => (
            <Link
              key={key}
              to={`/products?category=${encodeURIComponent(name)}`}
              className="group flex flex-col items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-300 hover:shadow-card active:scale-95 sm:p-4"
            >
              <div className="relative mb-2.5 flex items-center justify-center">
                <CategoryIcon
                  category={key}
                  variant="badge"
                  className="h-13 w-13 rounded-xl transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
                />
              </div>
              <div className="w-full">
                <span className="block text-xs font-bold text-slate-800 leading-snug group-hover:text-primary-900 sm:text-sm">
                  {name}
                </span>
                <span className="mt-0.5 hidden text-[11px] font-medium text-slate-400 group-hover:text-slate-600 sm:block">
                  {desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Manfaat per peran ─────────────────────────────────────── */}
      <section className="bg-slate-50 py-14 sm:py-20" aria-labelledby="benefit-heading">
        <div className="page-shell">
          <div className="max-w-2xl">
            <h2 id="benefit-heading" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Ekosistem Bahari yang Terhubung
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Satu platform yang menghubungkan pembeli, usaha pesisir, dan mitra pengantar dalam alur transaksi produk bahari yang aman dan transparan.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLE_BENEFITS.map(({ name, description, icon: Icon }) => (
              <article key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-900">
                  <Icon size={22} weight="duotone" />
                </span>
                <h3 className="mt-4 font-bold text-ink">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner Promosi Bergerak (Loop Slider) ────────────────── */}
      <PromoBannerSlider />

      {/* ── Produk terbaru ─────────────────────────────────────────── */}
      <section className="bg-white py-14 sm:py-20" aria-labelledby="latest-heading">
        <div className="page-shell">
          <div className="flex items-center justify-between gap-4">
            <h2 id="latest-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Produk Terbaru Minggu Ini
            </h2>
            <Button as={Link} to="/products" variant="outline" size="sm" rightIcon={<ArrowRight size={15} />}>
              Lihat Semua Produk
            </Button>
          </div>

          {loadError && (
            <div className="mt-8 rounded-2xl border border-danger-200 bg-danger-50 p-5 text-sm font-semibold text-danger-600">
              {loadError}
            </div>
          )}

          {!loadError && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {isLoading && Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="aspect-square animate-pulse bg-slate-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
              {!isLoading && products.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                  <Package size={36} className="mx-auto text-slate-300" />
                  <p className="mt-3 font-semibold text-ink">Belum ada produk</p>
                </div>
              )}
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="product-card group">
                  <div className="aspect-square overflow-hidden bg-slate-50">
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      iconSize={40}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-700 group-hover:text-primary-900">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-base font-bold text-ink">{formatCurrency(product.price)}</p>
                    <p className="mt-1.5 flex items-center gap-1 truncate text-xs text-slate-400">
                      <Storefront size={13} className="shrink-0" /> {product.store?.name || 'Toko SEAPEDIA'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Ulasan aplikasi ───────────────────────────────────────── */}
      <ApplicationReviews />

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-primary-900 py-14 sm:py-20">
        <div className="page-shell text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Mulai Jelajahi Kebutuhan Baharimu
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-blue-200">
            Temukan produk laut dari mitra tepercaya atau buka toko untuk membawa usaha pesisirmu ke lebih banyak pelanggan.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              as={Link}
              to="/register"
              size="lg"
              variant="secondary"
              className="!bg-white !text-primary-900 font-bold hover:!bg-blue-50"
              rightIcon={<ArrowRight size={18} />}
            >
              Buat Akun Gratis
            </Button>
            <Button
              as={Link}
              to="/products"
              size="lg"
              variant="outline"
              className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20"
            >
              Jelajahi Produk
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
