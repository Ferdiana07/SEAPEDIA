import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bicycle,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Receipt,
  Storefront,
  WarningCircle,
} from '@phosphor-icons/react'
import Button from '../../../components/ui/Button'
import ProductImage from '../../../components/ui/ProductImage'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import orderService from '../../../services/orderService'
import useUIStore from '../../../stores/uiStore'
import { formatCurrency } from '../../../utils/formatCurrency'

const STATUS_META = {
  packaging: { label: 'Sedang dikemas', icon: Package, tone: 'bg-amber-100 text-amber-800' },
  waiting_shipper: { label: 'Menunggu driver', icon: Clock, tone: 'bg-sky-100 text-sky-800' },
  shipping: { label: 'Dalam perjalanan', icon: Bicycle, tone: 'bg-indigo-100 text-indigo-800' },
  completed: { label: 'Selesai', icon: CheckCircle, tone: 'bg-emerald-100 text-emerald-800' },
  returned: { label: 'Dikembalikan', icon: WarningCircle, tone: 'bg-rose-100 text-rose-800' },
  cancelled: { label: 'Dibatalkan', icon: WarningCircle, tone: 'bg-slate-100 text-slate-700' },
}

const formatDateTime = (value) => new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'long',
  timeStyle: 'short',
}).format(new Date(value))

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: showError } = useUIStore()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  const loadOrder = async () => {
    const response = await orderService.getById(id)
    if (response.success) setOrder(response.data)
  }

  useEffect(() => {
    let active = true
    orderService.getById(id)
      .then((response) => { if (active && response.success) setOrder(response.data) })
      .catch(() => {
        if (active) {
          showError('Pesanan tidak ditemukan.')
          navigate('/buyer/orders')
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, navigate, showError])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const response = await orderService.cancel(id)
      if (response.success) {
        success('Pesanan dibatalkan dan saldo dikembalikan.')
        setCancelOpen(false)
        await loadOrder()
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Pesanan belum dapat dibatalkan.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return <div className="dashboard-page"><div className="h-36 animate-pulse rounded-3xl bg-slate-200" /><div className="mt-4 h-80 animate-pulse rounded-3xl bg-slate-100" /></div>
  }

  if (!order) return null

  const status = STATUS_META[order.status] || STATUS_META.cancelled
  const StatusIcon = status.icon
  const histories = order.status_histories || []
  const subtotal = Number(order.subtotal ?? order.total_amount ?? 0)
  const discount = Number(order.discount_amount || 0)
  const deliveryFee = Number(order.delivery_fee || 0)
  const tax = Number(order.tax_amount || 0)
  const total = Number(order.total_amount || subtotal - discount + deliveryFee + tax)

  return (
    <div className="dashboard-page max-w-5xl">
      <Link to="/buyer/orders" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-700"><ArrowLeft size={18} /> Kembali ke pesanan</Link>

      <section className="overflow-hidden rounded-3xl bg-primary-950 text-white">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold text-primary-200">Pesanan #{order.order_number}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{status.label}</h1>
            <p className="mt-3 text-sm text-primary-100">Dibuat {formatDateTime(order.created_at)}</p>
          </div>
          <span className={`inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold ${status.tone}`}><StatusIcon size={19} weight="fill" /> {status.label}</span>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-5">
          <section className="surface p-6" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="text-lg font-extrabold text-ink">Perjalanan pesanan</h2>
            <div className="mt-6 space-y-0">
              {histories.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Riwayat status akan tampil setelah pesanan diproses.</p>}
              {histories.map((history, index) => {
                const itemMeta = STATUS_META[history.status] || STATUS_META.cancelled
                const ItemIcon = itemMeta.icon
                const latest = index === histories.length - 1
                return (
                  <div key={history.id} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < histories.length - 1 && <div className="absolute bottom-0 left-[19px] top-10 w-px bg-slate-200" />}
                    <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${latest ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}><ItemIcon size={20} weight={latest ? 'fill' : 'duotone'} /></span>
                    <div className="pt-0.5">
                      <p className="text-sm font-extrabold text-ink">{itemMeta.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDateTime(history.created_at)}{history.actor?.name ? ` oleh ${history.actor.name}` : ''}</p>
                      {history.note && <p className="mt-2 text-sm leading-6 text-slate-600">{history.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="surface p-6" aria-labelledby="items-heading">
            <div className="flex items-center gap-2"><Package size={22} className="text-primary-600" /><h2 id="items-heading" className="text-lg font-extrabold text-ink">Produk</h2></div>
            <div className="mt-4 space-y-4">
              {order.items?.map((item) => (
                <article key={item.id} className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <ProductImage src={item.product?.image_url} alt={item.product_name || item.product?.name || 'Produk'} iconSize={28} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{item.product_name || item.product?.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.quantity} x {formatCurrency(item.price_at_purchase || item.price || 0)}</p>
                  </div>
                  <p className="text-sm font-extrabold text-ink">{formatCurrency(item.quantity * Number(item.price_at_purchase || item.price || 0))}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="surface p-6" aria-labelledby="payment-heading">
            <div className="flex items-center gap-2"><Receipt size={22} className="text-primary-600" /><h2 id="payment-heading" className="text-lg font-extrabold text-ink">Rincian pembayaran</h2></div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-slate-600"><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between gap-4 text-success-600"><dt>Diskon{order.discount?.code ? ` (${order.discount.code})` : ''}</dt><dd>-{formatCurrency(discount)}</dd></div>}
              <div className="flex justify-between gap-4 text-slate-600"><dt>Ongkir {order.delivery_method ? `(${order.delivery_method})` : ''}</dt><dd>{deliveryFee === 0 ? 'Gratis' : formatCurrency(deliveryFee)}</dd></div>
              <div className="flex justify-between gap-4 text-slate-600"><dt>PPN 12%</dt><dd>{formatCurrency(tax)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-4 text-base font-extrabold text-ink"><dt>Total</dt><dd className="text-primary-700">{formatCurrency(total)}</dd></div>
            </dl>
          </section>

          {order.store && <section className="surface flex items-center gap-3 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-700"><Storefront size={23} weight="duotone" /></span><div><p className="text-xs font-semibold text-slate-500">Penjual</p><p className="mt-0.5 text-sm font-extrabold text-ink">{order.store.name}</p></div></section>}
          {order.driver && <section className="surface flex items-center gap-3 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><Bicycle size={23} weight="duotone" /></span><div><p className="text-xs font-semibold text-slate-500">Driver</p><p className="mt-0.5 text-sm font-extrabold text-ink">{order.driver.name}</p></div></section>}
          {order.shipping_address && <section className="surface p-5"><div className="flex items-center gap-2"><MapPin size={20} className="text-primary-600" /><h2 className="text-sm font-extrabold text-ink">Alamat pengiriman</h2></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{order.shipping_address}</p></section>}
        </aside>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {order.status === 'packaging' && <Button variant="danger" isLoading={cancelling} onClick={() => setCancelOpen(true)}>Batalkan pesanan</Button>}
        {order.status === 'completed' && order.items?.[0]?.product_id && <Button as={Link} to={`/products/${order.items[0].product_id}`} className="w-full sm:w-auto">Beli lagi</Button>}
      </div>
      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Batalkan pesanan?"
        description="Pesanan akan ditutup, stok dikembalikan, dan refund masuk ke wallet secara otomatis."
        details={[{ label: 'Pesanan', value: order.order_number }, { label: 'Refund', value: formatCurrency(total) }]}
        confirmLabel="Ya, batalkan"
        tone="danger"
        isLoading={cancelling}
      />
    </div>
  )
}
