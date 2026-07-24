// File: src/pages/dashboard/buyer/OrderDetailPage.jsx
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import orderService from '../../../services/orderService'
import useUIStore from '../../../stores/uiStore'

// Status tracking steps
const TRACKING_STEPS = [
  { key: 'packaging',        icon: '📦', label: 'Pesanan Dikemas',        desc: 'Penjual sedang mengemas pesananmu' },
  { key: 'waiting_shipper',  icon: '⏳', label: 'Menunggu Driver',         desc: 'Pesanan siap dijemput driver' },
  { key: 'shipping',         icon: '🚗', label: 'Dalam Perjalanan',        desc: 'Driver sedang mengantarkan pesananmu' },
  { key: 'completed',        icon: '✅', label: 'Pesanan Selesai',         desc: 'Pesanan telah diterima' },
]

const STATUS_ORDER = ['packaging', 'waiting_shipper', 'shipping', 'completed']

const STATUS_COLORS = {
  packaging:       { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  waiting_shipper: { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300'   },
  shipping:        { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  completed:       { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300'  },
  returned:        { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300'    },
  cancelled:       { bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-300'   },
}

const STATUS_LABELS = {
  packaging:       'Sedang Dikemas',
  waiting_shipper: 'Menunggu Driver',
  shipping:        'Sedang Dikirim',
  completed:       'Selesai',
  returned:        'Dikembalikan',
  cancelled:       'Dibatalkan',
}

const OrderDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: showError } = useUIStore()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const res = await orderService.getById(id)
      if (res.success) setOrder(res.data)
    } catch (err) {
      showError('Pesanan tidak ditemukan')
      navigate('/buyer/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return
    setCancelling(true)
    try {
      const res = await orderService.cancel(id)
      if (res.success) {
        success('Pesanan berhasil dibatalkan')
        fetchOrder()
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal membatalkan pesanan')
    } finally {
      setCancelling(false)
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!order) return null

  const currentStatusIdx = STATUS_ORDER.indexOf(order.status)
  const isReturned = order.status === 'returned'
  const isCancellable = order.status === 'packaging'
  const color = STATUS_COLORS[order.status] || STATUS_COLORS.cancelled

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-500">Beranda</Link>
          <span>›</span>
          <Link to="/buyer/orders" className="hover:text-primary-500">Pesanan Saya</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">#{order.order_number}</span>
        </nav>

        {/* Order Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Nomor Pesanan</p>
              <p className="font-bold text-gray-900 text-lg">#{order.order_number}</p>
              <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border ${color.bg} ${color.text} ${color.border} self-start`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>

          {/* Toko */}
          {order.store && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">🏪</span>
              <div>
                <p className="text-xs text-gray-400">Toko</p>
                <p className="font-semibold text-gray-900 text-sm">{order.store.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* TRACKING PESANAN */}
        {!isReturned && order.status !== 'cancelled' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <h2 className="font-bold text-gray-900 mb-5">🗺️ Lacak Pesanan</h2>
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-200" />

              <div className="space-y-6">
                {TRACKING_STEPS.map((step, idx) => {
                  const isDone = currentStatusIdx >= idx
                  const isCurrent = currentStatusIdx === idx
                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      {/* Circle */}
                      <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                        isDone
                          ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                        {isDone ? (isCurrent ? step.icon : '✓') : step.icon}
                      </div>
                      {/* Info */}
                      <div className={`flex-1 pt-1.5 ${isCurrent ? '' : isDone ? 'opacity-70' : 'opacity-40'}`}>
                        <p className={`font-semibold text-sm ${isCurrent ? 'text-primary-600' : isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                          {isCurrent && <span className="ml-2 text-xs font-normal text-primary-400 animate-pulse">● Sekarang</span>}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                        {isCurrent && order.updated_at && (
                          <p className="text-xs text-primary-500 mt-1 font-medium">{formatDate(order.updated_at)}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Info Driver (saat shipping) */}
            {order.driver && order.status === 'shipping' && (
              <div className="mt-5 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3">
                <span className="text-2xl">🚗</span>
                <div>
                  <p className="text-xs text-purple-500">Driver</p>
                  <p className="font-bold text-purple-900 text-sm">{order.driver.name}</p>
                  {order.driver.phone && (
                    <p className="text-xs text-purple-600">📞 {order.driver.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RETURNED STATUS */}
        {isReturned && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">↩️</span>
              <h2 className="font-bold text-red-800">Pesanan Dikembalikan</h2>
            </div>
            <p className="text-sm text-red-600">Pesanan ini dikembalikan oleh driver.</p>
            {order.cancellation_reason && (
              <div className="mt-3 p-3 bg-red-100 rounded-lg">
                <p className="text-xs text-red-500 font-medium">Alasan:</p>
                <p className="text-sm text-red-700">{order.cancellation_reason}</p>
              </div>
            )}
            <p className="text-xs text-red-500 mt-2">Saldo wallet kamu sudah dikembalikan otomatis.</p>
          </div>
        )}

        {/* ORDER ITEMS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">🛍️ Detail Produk</h2>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.product?.image_url ? (
                    <img src={item.product.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.product_name || item.product?.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="font-bold text-gray-900 text-sm flex-shrink-0">{formatPrice(item.quantity * item.price)}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Ongkos Kirim</span>
              <span className="text-green-600 font-medium">Gratis</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
              <span>Total Pembayaran</span>
              <span className="text-primary-600">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* ALAMAT PENGIRIMAN */}
        {order.shipping_address && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <h2 className="font-bold text-gray-900 mb-3">📍 Alamat Pengiriman</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.shipping_address}</p>
          </div>
        )}

        {/* CATATAN */}
        {order.notes && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <h2 className="font-bold text-gray-900 mb-2">📝 Catatan</h2>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            to="/buyer/orders"
            className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 text-center transition-colors"
          >
            ← Kembali ke Pesanan
          </Link>

          {isCancellable && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {cancelling ? 'Membatalkan...' : '✕ Batalkan Pesanan'}
            </button>
          )}

          {order.status === 'completed' && order.items?.[0]?.product_id && (
            <Link
              to={`/products/${order.items[0].product_id}`}
              className="flex-1 py-3 bg-primary-500 text-white rounded-xl text-sm font-bold text-center hover:bg-primary-600 transition-colors"
            >
              🔄 Beli Lagi
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

export default OrderDetailPage
