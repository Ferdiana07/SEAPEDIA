import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bicycle,
  ClockCounterClockwise,
  CurrencyCircleDollar,
  Package,
  ShieldCheck,
  ShoppingBag,
  Storefront,
  Ticket,
  UsersThree,
  Warning,
} from '@phosphor-icons/react'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import adminService from '../../../services/adminService'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import { formatCurrency } from '../../../utils/formatCurrency'

const STAT_CARDS = [
  ['total_users', 'Pengguna', UsersThree, 'bg-sky-100 text-sky-700'],
  ['total_stores', 'Toko aktif', Storefront, 'bg-orange-100 text-orange-700'],
  ['total_products', 'Produk aktif', Package, 'bg-indigo-100 text-indigo-700'],
  ['total_orders', 'Total pesanan', ShoppingBag, 'bg-emerald-100 text-emerald-700'],
  ['completed_gmv', 'GMV selesai', CurrencyCircleDollar, 'bg-amber-100 text-amber-800', true],
  ['active_discounts', 'Promo aktif', Ticket, 'bg-rose-100 text-rose-700'],
]

const STATUS_LABELS = {
  packaging: 'Dikemas',
  waiting_shipper: 'Menunggu driver',
  shipping: 'Dikirim',
  completed: 'Selesai',
  returned: 'Dikembalikan',
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const { success, error: showError } = useUIStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [monitoring, setMonitoring] = useState({})
  const [simulationHours, setSimulationHours] = useState(72)
  const [simulating, setSimulating] = useState(false)
  const [confirmSimulation, setConfirmSimulation] = useState(false)

  const loadDashboard = async () => {
    const [statsResponse, monitoringResponse] = await Promise.all([
      adminService.getStats(),
      adminService.getMonitoring(),
    ])
    if (statsResponse.success) setStats(statsResponse.data)
    if (monitoringResponse.success) setMonitoring(monitoringResponse.data)
  }

  useEffect(() => {
    let active = true
    Promise.all([adminService.getStats(), adminService.getMonitoring()])
      .then(([statsResponse, monitoringResponse]) => {
        if (!active) return
        if (statsResponse.success) setStats(statsResponse.data)
        if (monitoringResponse.success) setMonitoring(monitoringResponse.data)
      })
      .catch(() => { if (active) showError('Data monitoring belum dapat dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [showError])

  const simulateOverdue = async () => {
    setSimulating(true)
    try {
      const response = await adminService.simulateTime(Number(simulationHours))
      success(response.message)
      setConfirmSimulation(false)
      await loadDashboard()
    } catch (error) {
      showError(error.response?.data?.message || 'Simulasi belum dapat dijalankan.')
    } finally {
      setSimulating(false)
    }
  }

  if (loading) return <div className="dashboard-page"><div className="h-32 animate-pulse rounded-3xl bg-primary-100" /><div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />)}</div></div>

  return (
    <div className="dashboard-page">
      <section className="grid overflow-hidden rounded-3xl bg-primary-950 text-white lg:grid-cols-[1fr_auto]">
        <div className="p-7 sm:p-9">
          <p className="flex items-center gap-2 text-sm font-bold text-primary-200"><ShieldCheck size={19} weight="fill" /> Pusat kendali platform</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Selamat datang, {user?.name}.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-100">Pantau transaksi, stok, pengantaran, promo, dan kejadian melewati SLA dari satu layar.</p>
        </div>
        <div className="flex items-center border-t border-white/10 p-7 lg:border-l lg:border-t-0">
          <div className="w-full min-w-72">
            <label htmlFor="simulation-hours" className="text-sm font-bold text-white">Simulasi overdue</label>
            <div className="mt-2 flex gap-2">
              <input id="simulation-hours" type="number" min="1" max="720" value={simulationHours} onChange={(event) => setSimulationHours(event.target.value)} className="input" />
              <Button onClick={() => setConfirmSimulation(true)} isLoading={simulating} className="bg-accent-500 hover:bg-accent-600" leftIcon={<ClockCounterClockwise size={18} />}>Jalankan</Button>
            </div>
            <p className="mt-2 text-xs text-primary-200">Jam simulasi, maksimal 720.</p>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Statistik platform">
        {STAT_CARDS.map(([key, label, Icon, tone, currency]) => (
          <article key={key} className="surface p-4">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={21} weight="duotone" /></span>
            <p className="mt-4 text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-1 truncate text-xl font-extrabold text-ink">{currency ? formatCurrency(stats[key] || 0) : stats[key] ?? 0}</p>
          </article>
        ))}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <section className="surface overflow-hidden" aria-labelledby="orders-monitoring-heading">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
            <div><h2 id="orders-monitoring-heading" className="font-extrabold text-ink">Pesanan terbaru</h2><p className="mt-1 text-xs text-slate-500">Aktivitas lintas pembeli, toko, dan driver.</p></div>
            <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">{monitoring.recent_orders?.length || 0} ditampilkan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3 font-bold">Pesanan</th><th className="px-5 py-3 font-bold">Pembeli</th><th className="px-5 py-3 font-bold">Toko</th><th className="px-5 py-3 font-bold">Status</th><th className="px-5 py-3 text-right font-bold">Total</th></tr></thead>
              <tbody>
                {(monitoring.recent_orders || []).map((order) => <tr key={order.id} className="border-t border-slate-100"><td className="px-5 py-3 font-bold text-ink">#{order.order_number}</td><td className="px-5 py-3 text-slate-600">{order.user?.name || 'Pengguna'}</td><td className="px-5 py-3 text-slate-600">{order.store?.name || 'Toko'}</td><td className="px-5 py-3"><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{STATUS_LABELS[order.status] || order.status}</span></td><td className="px-5 py-3 text-right font-bold text-ink">{formatCurrency(order.total_amount)}</td></tr>)}
                {!monitoring.recent_orders?.length && <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">Belum ada pesanan untuk dipantau.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-5">
          <section className="surface p-5">
            <div className="flex items-center gap-2"><Warning size={20} weight="fill" className="text-amber-500" /><h2 className="font-extrabold text-ink">Stok perlu perhatian</h2></div>
            <div className="mt-4 space-y-3">
              {(monitoring.low_stock_products || []).slice(0, 5).map((product) => <div key={product.id} className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-ink">{product.name}</p><p className="truncate text-xs text-slate-500">{product.store?.name}</p></div><span className={`rounded-lg px-2 py-1 text-xs font-extrabold ${product.stock === 0 ? 'bg-danger-50 text-danger-600' : 'bg-amber-100 text-amber-800'}`}>{product.stock} unit</span></div>)}
              {!monitoring.low_stock_products?.length && <p className="text-sm text-slate-500">Semua stok dalam kondisi aman.</p>}
            </div>
          </section>

          <section className="surface p-5">
            <div className="flex items-center gap-2"><Bicycle size={21} className="text-primary-600" /><h2 className="font-extrabold text-ink">Pengantaran aktif</h2></div>
            <div className="mt-4 space-y-3">
              {(monitoring.delivery_jobs || []).slice(0, 4).map((job) => <div key={job.id} className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold text-ink">#{job.order_number}</p><p className="text-xs text-slate-500">{job.driver?.name || 'Belum ada driver'}</p></div><span className="text-xs font-bold text-primary-700">{STATUS_LABELS[job.status] || job.status}</span></div>)}
              {!monitoring.delivery_jobs?.length && <p className="text-sm text-slate-500">Tidak ada pengantaran aktif.</p>}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/users" className="surface flex items-center justify-between p-4 text-sm font-bold text-ink hover:border-primary-200">Pengguna <ArrowRight size={17} /></Link>
            <Link to="/admin/discounts" className="surface flex items-center justify-between p-4 text-sm font-bold text-ink hover:border-primary-200">Promo <ArrowRight size={17} /></Link>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmSimulation}
        onClose={() => setConfirmSimulation(false)}
        onConfirm={simulateOverdue}
        title="Jalankan simulasi overdue?"
        description="Pesanan yang melewati SLA akan dikembalikan, stok dipulihkan, dan saldo Buyer direfund. Aksi ini mengubah data transaksi."
        details={[{ label: 'Waktu dimajukan', value: `${simulationHours} jam` }]}
        confirmLabel="Jalankan simulasi"
        tone="danger"
        isLoading={simulating}
      />
    </div>
  )
}
