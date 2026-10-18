import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, MapPin, Package, ShoppingBagOpen, Wallet } from '@phosphor-icons/react'
import orderService from '../../../services/orderService'
import walletService from '../../../services/walletService'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import { formatCurrency } from '../../../utils/formatCurrency'

const STATUS_LABELS = { packaging: 'Dikemas', waiting_shipper: 'Menunggu driver', shipping: 'Dikirim', completed: 'Selesai', returned: 'Dikembalikan' }

export default function BuyerDashboardPage() {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState(0)
  const [report, setReport] = useState({})
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let active = true
    Promise.all([walletService.getWallet(), orderService.getBuyerReport(), orderService.getAll({ per_page: 5 })])
      .then(([walletResponse, reportResponse, ordersResponse]) => {
        if (!active) return
        if (walletResponse.success) setWallet(walletResponse.data.balance || 0)
        if (reportResponse.success) setReport(reportResponse.data)
        if (ordersResponse.success) setOrders(ordersResponse.data)
      })
      .catch(() => { if (active) showError('Ringkasan pembeli belum dapat dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [showError])

  if (loading) return <div className="dashboard-page"><div className="h-44 animate-pulse rounded-3xl bg-primary-100" /><div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />)}</div></div>

  const stats = [
    ['Saldo wallet', formatCurrency(wallet), Wallet, 'bg-sky-100 text-sky-700'],
    ['Pesanan aktif', report.active_orders || 0, Package, 'bg-amber-100 text-amber-800'],
    ['Pesanan selesai', report.completed_orders || 0, CheckCircle, 'bg-emerald-100 text-emerald-700'],
    ['Total belanja', formatCurrency(report.total_spending || 0), ShoppingBagOpen, 'bg-indigo-100 text-indigo-700'],
  ]

  return (
    <div className="dashboard-page">
      <section className="flex flex-col gap-6 rounded-3xl bg-primary-950 p-7 text-white sm:p-9 md:flex-row md:items-end md:justify-between">
        <div><p className="text-sm font-bold text-primary-200">Mode Pembeli</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Halo, {user?.name}.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-primary-100">Pantau pesanan, saldo, dan alamat pengirimanmu dari satu tempat.</p></div>
        <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-accent-600">Jelajahi produk <ArrowRight size={17} /></Link>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Ringkasan pembeli">
        {stats.map(([label, value, Icon, tone]) => <article key={label} className="surface p-5"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={21} weight="duotone" /></span><p className="mt-4 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 truncate text-xl font-extrabold text-ink">{value}</p></article>)}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <section className="surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-extrabold text-ink">Pesanan terbaru</h2><p className="mt-1 text-xs text-slate-500">Status transaksi terakhirmu.</p></div><Link to="/buyer/orders" className="text-sm font-bold text-primary-700">Lihat semua</Link></div>
          <div className="p-5">
            {orders.length === 0 ? <div className="py-8 text-center"><Package size={36} className="mx-auto text-slate-300" /><p className="mt-3 font-bold text-ink">Belum ada pesanan</p></div> : <div className="space-y-3">{orders.map((order) => <Link key={order.id} to={`/buyer/orders/${order.id}`} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-primary-50"><div className="min-w-0"><p className="truncate text-sm font-extrabold text-ink">#{order.order_number}</p><p className="mt-1 truncate text-xs text-slate-500">{order.store?.name || 'Toko SEAPEDIA'}</p></div><div className="text-right"><p className="text-sm font-extrabold text-ink">{formatCurrency(order.total_amount)}</p><p className="mt-1 text-xs font-bold text-primary-700">{STATUS_LABELS[order.status] || order.status}</p></div></Link>)}</div>}
          </div>
        </section>

        <section className="surface p-5"><h2 className="font-extrabold text-ink">Akses cepat</h2><div className="mt-4 grid gap-2"><Link to="/cart" className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-700"><span className="flex items-center gap-3"><ShoppingBagOpen size={21} /> Keranjang</span><ArrowRight size={16} /></Link><Link to="/buyer/wallet" className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-700"><span className="flex items-center gap-3"><Wallet size={21} /> Dompet</span><ArrowRight size={16} /></Link><Link to="/buyer/addresses" className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-700"><span className="flex items-center gap-3"><MapPin size={21} /> Alamat</span><ArrowRight size={16} /></Link></div></section>
      </div>
    </div>
  )
}
