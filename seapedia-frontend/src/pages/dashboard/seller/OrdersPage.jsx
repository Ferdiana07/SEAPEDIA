import { useState, useEffect } from 'react'
import useUIStore from '../../../stores/uiStore'
import orderService from '../../../services/orderService'

const STATUS_LABELS = {
  packaging:       'Dikemas',
  waiting_shipper: 'Menunggu Driver',
  shipping:        'Dikirim',
  completed:       'Selesai',
  returned:        'Dikembalikan',
}

const STATUS_COLORS = {
  packaging:       'bg-yellow-100 text-yellow-800',
  waiting_shipper: 'bg-blue-100 text-blue-800',
  shipping:        'bg-purple-100 text-purple-800',
  completed:       'bg-green-100 text-green-800',
  returned:        'bg-red-100 text-red-800',
}

const FILTER_TABS = [
  { value: '', label: 'Semua' },
  { value: 'packaging', label: 'Perlu Dikemas' },
  { value: 'waiting_shipper', label: 'Menunggu Driver' },
  { value: 'shipping', label: 'Sedang Dikirim' },
  { value: 'completed', label: 'Selesai' },
]

const SellerOrdersPage = () => {
  const { success, error: showError } = useUIStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const formatPrice = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await orderService.getSellerOrders(statusFilter ? { status: statusFilter } : {})
      if (res.success) setOrders(res.data)
    } catch (err) {
      showError('Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [statusFilter])

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await orderService.updateSellerOrderStatus(orderId, newStatus)
      if (res.success) {
        success(`Status pesanan berhasil diupdate!`)
        fetchOrders()
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Masuk</h1>
          <p className="text-gray-500 mt-1">Kelola semua pesanan dari pembeli</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-3 text-gray-500">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <span className="text-5xl block mb-3">📋</span>
            <h3 className="font-bold text-gray-900 mb-1">Belum ada pesanan</h3>
            <p className="text-gray-500 text-sm">
              {statusFilter ? `Tidak ada pesanan dengan status "${STATUS_LABELS[statusFilter]}"` : 'Pesanan akan muncul di sini ketika ada pembeli yang checkout'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <p className="font-bold text-primary-600">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Pembeli</p>
                  <p className="text-sm font-medium text-gray-800 mb-3">{order.user?.name || 'Pembeli'}</p>

                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Item Pesanan</p>
                  <div className="space-y-2">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.product?.name || 'Produk'} × {item.quantity}</span>
                        <span className="text-gray-600">{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action */}
                {order.status === 'packaging' && (
                  <div className="p-4 border-t border-gray-100 bg-yellow-50">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-yellow-700 font-medium">⚡ Pesanan menunggu dikemas</p>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'waiting_shipper')}
                        disabled={updatingId === order.id}
                        className="px-4 py-2 bg-primary-500 text-white text-sm font-bold rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
                      >
                        {updatingId === order.id ? 'Memproses...' : '✅ Tandai Sudah Dikemas'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerOrdersPage
