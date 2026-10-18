// File: src/pages/dashboard/driver/OrdersPage.jsx
// Penjelasan: Halaman untuk driver mengelola pesanan.
// BAB 9: pakai endpoint baru /driver/orders/{id}/{pickup|complete|return}.

import { useCallback, useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import useUIStore from '../../../stores/uiStore'
import orderService from '../../../services/orderService'
import { ArrowCounterClockwise, Car, CheckCircle, ClockCounterClockwise, MapPin, Package, Storefront } from '@phosphor-icons/react'

// ============================================================
// DRIVER ORDERS PAGE
// ============================================================
const DriverOrdersPage = () => {
  const { success, error: showError } = useUIStore()

  // Local state
  const [activeTab, setActiveTab] = useState('available') // 'available' | 'active'
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [returnTarget, setReturnTarget] = useState(null)
  const [returnReason, setReturnReason] = useState('')
  const [submittingReturn, setSubmittingReturn] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [actionConfirm, setActionConfirm] = useState(null)

  // Format currency
  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0)

  // Format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  // Fetch orders based on active tab
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      let status = 'waiting_shipper'
      if (activeTab === 'active') status = 'shipping'
      if (activeTab === 'history') status = 'history'

      const res = await orderService.getDriverOrders({ status })
      if (res.success) setOrders(res.data)
    } catch {
      showError('Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }, [activeTab, showError])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Handle pickup → POST /driver/orders/{id}/pickup
  const handlePickup = async (orderId) => {
    setUpdatingId(orderId)
    try {
      const res = await orderService.pickupOrder(orderId)
      if (res.success) {
        success('Pesanan berhasil diambil! Silakan antarkan ke pembeli.')
        setActionConfirm(null)
        fetchOrders()
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mengambil pesanan')
    } finally {
      setUpdatingId(null)
    }
  }

  // Handle deliver → POST /driver/orders/{id}/complete
  const handleDeliver = async (orderId) => {
    setUpdatingId(orderId)
    try {
      const res = await orderService.completeOrder(orderId)
      if (res.success) {
        success('Pesanan berhasil diantarkan! Pembeli akan menerima notifikasi.')
        setActionConfirm(null)
        fetchOrders()
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mengkonfirmasi pengantaran')
    } finally {
      setUpdatingId(null)
    }
  }

  // Handle return → POST /driver/orders/{id}/return
  const handleReturnSubmit = async () => {
    if (!returnTarget) return
    if (!returnReason.trim()) { showError('Alasan pengembalian wajib diisi'); return }
    setSubmittingReturn(true)
    try {
      const res = await orderService.returnOrder(returnTarget.id, returnReason.trim())
      if (res.success) {
        success('Pesanan dikembalikan. Stok direstore & saldo buyer direfund.')
        setReturnTarget(null)
        setReturnReason('')
        fetchOrders()
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mengembalikan pesanan')
    } finally {
      setSubmittingReturn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Driver</h1>
          <p className="text-gray-500 mt-1">Kelola pesanan yang perlu diantar</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              activeTab === 'available'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package size={17} /> Pesanan Tersedia
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              activeTab === 'active'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Car size={17} /> Pesanan Aktif
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              activeTab === 'history'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ClockCounterClockwise size={17} /> Riwayat
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            {activeTab === 'available' ? <Package size={50} className="mx-auto mb-3 text-primary-300" weight="duotone" /> : activeTab === 'active' ? <Car size={50} className="mx-auto mb-3 text-primary-300" weight="duotone" /> : <ClockCounterClockwise size={50} className="mx-auto mb-3 text-primary-300" weight="duotone" />}
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {activeTab === 'available' ? 'Tidak Ada Pesanan Tersedia' : activeTab === 'active' ? 'Tidak Ada Pesanan Aktif' : 'Belum Ada Riwayat Pesanan'}
            </h2>
            <p className="text-gray-500 text-sm">
              {activeTab === 'available'
                ? 'Saat ini belum ada pesanan yang perlu diantar.'
                : activeTab === 'active' ? 'Kamu belum mengambil pesanan apapun.' : 'Kamu belum menyelesaikan atau mengembalikan pesanan.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="flex justify-between items-start p-4 border-b border-gray-100">
                  <div>
                    <p className="font-bold text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    {order.store && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600"><Storefront size={16} /> {order.store.name}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === 'waiting_shipper' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipping' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'waiting_shipper' ? 'Menunggu Pickup' :
                     order.status === 'shipping' ? 'Sedang Diantar' :
                     order.status === 'completed' ? 'Selesai' : 'Dikembalikan'}
                  </span>
                </div>

                {/* Items */}
                <div className="p-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                  <ul className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}× {item.product?.name || 'Produk'}</span>
                        <span className="font-medium text-gray-600">
                          {formatPrice((item.price_at_purchase || 0) * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Alamat Pengantaran</p>
                  <p className="text-gray-800 text-sm">{order.shipping_address || 'Alamat tidak tersedia'}</p>
                </div>

                {/* Actions */}
                <div className={`p-4 border-t border-gray-100 ${
                  activeTab === 'available' ? 'bg-yellow-50' : activeTab === 'active' ? 'bg-blue-50' : 'bg-gray-50'
                }`}>
                  {order.status === 'waiting_shipper' && (
                    <div className="flex justify-between items-center">
                      <p className="flex items-center gap-2 text-sm font-medium text-amber-700"><Package size={17} /> Siap diambil</p>
                      <button
                        onClick={() => setActionConfirm({ type: 'pickup', order })}
                        disabled={updatingId === order.id}
                        className="px-4 py-2 bg-primary-500 text-white text-sm font-bold rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
                      >
                        {updatingId === order.id ? 'Memproses...' : <span className="inline-flex items-center gap-2"><Car size={17} weight="bold" /> Ambil Pesanan</span>}
                      </button>
                    </div>
                  )}

                  {order.status === 'shipping' && (
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => { setReturnTarget(order); setReturnReason('') }}
                        className="px-4 py-2 border border-red-300 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <ArrowCounterClockwise size={17} /> Kembalikan
                      </button>
                      <button
                        onClick={() => setActionConfirm({ type: 'deliver', order })}
                        disabled={updatingId === order.id}
                        className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                      >
                        {updatingId === order.id ? 'Memproses...' : <span className="inline-flex items-center gap-2"><CheckCircle size={17} weight="bold" /> Pesanan Terkirim</span>}
                      </button>
                    </div>
                  )}

                  {(order.status === 'completed' || order.status === 'returned') && (
                    <div className="flex justify-between items-center">
                      <p className={`text-sm font-medium ${order.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                        {order.status === 'completed' ? <span className="inline-flex items-center gap-2"><CheckCircle size={17} /> Pengantaran berhasil</span> : `Dikembalikan: ${order.cancellation_reason || 'Gagal antar'}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Return Order */}
      <Modal
        isOpen={!!returnTarget}
        onClose={() => setReturnTarget(null)}
        title={`Kembalikan Pesanan ${returnTarget?.order_number || ''}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Pesanan akan ditandai <b>dikembalikan</b>. Stok produk akan di-restore dan saldo buyer akan di-refund otomatis.
          </p>
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center gap-2"><MapPin size={17} /> Alasan Pengembalian <span className="text-red-500">*</span></span>
            </label>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="Contoh: Alamat tidak ditemukan, buyer tidak di rumah..."
            />
            <p className="text-xs text-gray-400 mt-1">{returnReason.length}/500 karakter</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setReturnTarget(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleReturnSubmit}
              disabled={submittingReturn || !returnReason.trim()}
              className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {submittingReturn ? 'Memproses...' : 'Kembalikan Pesanan'}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        isOpen={!!actionConfirm}
        onClose={() => setActionConfirm(null)}
        onConfirm={() => actionConfirm?.type === 'pickup' ? handlePickup(actionConfirm.order.id) : handleDeliver(actionConfirm.order.id)}
        title={actionConfirm?.type === 'pickup' ? 'Ambil job pengantaran?' : 'Konfirmasi pesanan diterima'}
        description={actionConfirm?.type === 'pickup'
          ? 'Job akan terikat ke akun Driver ini dan hilang dari daftar Driver lain.'
          : 'Gunakan aksi ini hanya setelah pesanan benar-benar diterima pembeli. Status selesai tidak dapat dibatalkan.'}
        details={actionConfirm ? [
          { label: 'Pesanan', value: actionConfirm.order.order_number },
          { label: 'Toko', value: actionConfirm.order.store?.name || 'Toko' },
          { label: 'Total', value: formatPrice(actionConfirm.order.total_amount) },
        ] : []}
        confirmLabel={actionConfirm?.type === 'pickup' ? 'Ambil job' : 'Pesanan diterima'}
        tone={actionConfirm?.type === 'deliver' ? 'success' : 'primary'}
        isLoading={updatingId === actionConfirm?.order.id}
      />
    </div>
  )
}

export default DriverOrdersPage
