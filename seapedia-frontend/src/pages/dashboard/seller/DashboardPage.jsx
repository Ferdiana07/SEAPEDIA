import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CurrencyCircleDollar, Package, ShoppingBag, Storefront, Warning } from '@phosphor-icons/react'
import Button from '../../../components/ui/Button'
import orderService from '../../../services/orderService'
import productService from '../../../services/productService'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import { formatCurrency } from '../../../utils/formatCurrency'

const STATUS_LABELS = { packaging: 'Perlu dikemas', waiting_shipper: 'Menunggu driver', shipping: 'Dikirim', completed: 'Selesai', returned: 'Dikembalikan' }

export default function SellerDashboardPage() {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()
  const hasStore = Boolean(user?.store)
  const [loading, setLoading] = useState(hasStore)
  const [products, setProducts] = useState({})
  const [report, setReport] = useState({})
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!hasStore) return undefined
    let active = true
    Promise.all([productService.getMyStats(), orderService.getSellerReport(), orderService.getSellerOrders({ per_page: 5 })])
      .then(([productResponse, reportResponse, ordersResponse]) => {
        if (!active) return
        if (productResponse.success) setProducts(productResponse.data)
        if (reportResponse.success) setReport(reportResponse.data)
        if (ordersResponse.success) setOrders(ordersResponse.data)
      })
      .catch(() => { if (active) showError('Ringkasan toko belum dapat dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [hasStore, showError])

  if (!hasStore) return <div className="dashboard-page"><div className="rounded-3xl bg-primary-950 p-10 text-center text-white"><Storefront size={52} weight="duotone" className="mx-auto text-accent-300" /><h1 className="mt-5 text-3xl font-extrabold">Buka toko pertamamu.</h1><p className="mx-auto mt-3 max-w-xl text-primary-100">Lengkapi profil toko untuk mulai menambahkan produk dan menerima pesanan.</p><Button as={Link} to="/seller/store" className="mt-7 bg-accent-500 hover:bg-accent-600">Buat toko</Button></div></div>
  if (loading) return <div className="dashboard-page"><div className="h-44 animate-pulse rounded-3xl bg-primary-100" /></div>

  const stats = [
    ['Total produk', products.total_products || 0, Package, 'bg-sky-100 text-sky-700'],
    ['Stok habis', products.out_of_stock || 0, Warning, 'bg-amber-100 text-amber-800'],
    ['Pesanan tertunda', report.pending_orders || 0, ShoppingBag, 'bg-indigo-100 text-indigo-700'],
    ['Pendapatan selesai', formatCurrency(report.income || 0), CurrencyCircleDollar, 'bg-emerald-100 text-emerald-700'],
  ]

  return <div className="dashboard-page">
    <section className="flex flex-col gap-6 rounded-3xl bg-primary-950 p-7 text-white sm:p-9 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-bold text-primary-200">Mode Penjual</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Kelola tokomu, {user?.name}.</h1><p className="mt-3 text-sm text-primary-100">Produk, stok, pesanan, dan pendapatan dalam satu ringkasan.</p></div><Button as={Link} to="/seller/products" className="bg-accent-500 hover:bg-accent-600" rightIcon={<ArrowRight size={17} />}>Kelola produk</Button></section>
    <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([label, value, Icon, tone]) => <article key={label} className="surface p-5"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={21} weight="duotone" /></span><p className="mt-4 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 truncate text-xl font-extrabold text-ink">{value}</p></article>)}</section>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><section className="surface overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-extrabold text-ink">Pesanan terbaru</h2><p className="mt-1 text-xs text-slate-500">Pesanan yang masuk ke tokomu.</p></div><Link to="/seller/orders" className="text-sm font-bold text-primary-700">Lihat semua</Link></div><div className="p-5">{orders.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Belum ada pesanan.</p> : <div className="space-y-3">{orders.map((order) => <div key={order.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><div><p className="text-sm font-extrabold text-ink">#{order.order_number}</p><p className="mt-1 text-xs text-slate-500">{order.user?.name || 'Pembeli'}</p></div><div className="text-right"><p className="text-sm font-extrabold text-ink">{formatCurrency(order.subtotal || order.total_amount)}</p><p className="mt-1 text-xs font-bold text-primary-700">{STATUS_LABELS[order.status] || order.status}</p></div></div>)}</div>}</div></section><section className="surface p-5"><h2 className="font-extrabold text-ink">Akses cepat</h2><div className="mt-4 grid gap-2"><Link to="/seller/products" className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-primary-50"><span className="flex items-center gap-3"><Package size={21} /> Produk</span><ArrowRight size={16} /></Link><Link to="/seller/orders" className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-primary-50"><span className="flex items-center gap-3"><ShoppingBag size={21} /> Pesanan</span><ArrowRight size={16} /></Link><Link to="/seller/store" className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-primary-50"><span className="flex items-center gap-3"><Storefront size={21} /> Profil toko</span><ArrowRight size={16} /></Link></div></section></div>
  </div>
}
