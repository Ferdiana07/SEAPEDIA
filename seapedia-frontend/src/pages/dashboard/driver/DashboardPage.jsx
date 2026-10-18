import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bicycle, CheckCircle, CurrencyCircleDollar, Package } from '@phosphor-icons/react'
import orderService from '../../../services/orderService'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import { formatCurrency } from '../../../utils/formatCurrency'

export default function DriverDashboardPage() {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState({})
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    let active = true
    Promise.all([orderService.getDriverReport(), orderService.getDriverOrders({ status: 'waiting_shipper' })])
      .then(([reportResponse, jobsResponse]) => {
        if (!active) return
        if (reportResponse.success) setReport(reportResponse.data)
        if (jobsResponse.success) setJobs(jobsResponse.data.slice(0, 5))
      })
      .catch(() => { if (active) showError('Ringkasan driver belum dapat dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [showError])

  if (loading) return <div className="dashboard-page"><div className="h-44 animate-pulse rounded-3xl bg-primary-100" /></div>

  const stats = [
    ['Job tersedia', report.available_jobs || 0, Package, 'bg-amber-100 text-amber-800'],
    ['Sedang diantar', report.active_jobs || 0, Bicycle, 'bg-sky-100 text-sky-700'],
    ['Selesai', report.completed_jobs || 0, CheckCircle, 'bg-emerald-100 text-emerald-700'],
    ['Pendapatan', formatCurrency(report.earnings || 0), CurrencyCircleDollar, 'bg-indigo-100 text-indigo-700'],
  ]

  return <div className="dashboard-page">
    <section className="flex flex-col gap-6 rounded-3xl bg-primary-950 p-7 text-white sm:p-9 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-bold text-primary-200">Mode Driver</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Siap mengantar, {user?.name}?</h1><p className="mt-3 text-sm text-primary-100">Ambil job tersedia dan perbarui status saat pengantaran berlangsung.</p></div><Link to="/driver/orders" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-extrabold text-white hover:bg-accent-600">Lihat pengantaran <ArrowRight size={17} /></Link></section>
    <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([label, value, Icon, tone]) => <article key={label} className="surface p-5"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={21} weight="duotone" /></span><p className="mt-4 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 truncate text-xl font-extrabold text-ink">{value}</p></article>)}</section>
    <section className="surface mt-5 overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-extrabold text-ink">Job terdekat</h2><p className="mt-1 text-xs text-slate-500">Pesanan yang siap diambil.</p></div><Link to="/driver/orders" className="text-sm font-bold text-primary-700">Lihat semua</Link></div><div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">{jobs.map((job) => <article key={job.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between"><p className="text-sm font-extrabold text-ink">#{job.order_number}</p><span className="text-xs font-bold text-primary-700">{job.delivery_method}</span></div><p className="mt-2 text-sm text-slate-600">{job.store?.name || 'Toko SEAPEDIA'}</p><p className="mt-3 font-extrabold text-ink">{formatCurrency(job.delivery_fee)} ongkir</p></article>)}{jobs.length === 0 && <div className="col-span-full py-8 text-center"><Bicycle size={38} className="mx-auto text-slate-300" /><p className="mt-3 text-sm text-slate-500">Belum ada job tersedia.</p></div>}</div></section>
  </div>
}
