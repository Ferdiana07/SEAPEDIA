// File: src/pages/dashboard/driver/OrdersPage.jsx
// Penjelasan: Halaman untuk driver mengelola pesanan.
// BAB 9: pakai endpoint baru /driver/orders/{id}/{pickup|complete|return}.

import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import useOrderStore from '../../../stores/orderStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// DRIVER ORDERS PAGE
// ============================================================
const DriverOrdersPage = () => {
  // Stores - BAB 9: pakai helper khusus driver
  const {
    orders,
    isLoading,
    fetchOrders,
    pickupOrder,
    deliverOrder,
    returnOrder,
  } = useOrderStore()
  const { success, error: showError } = useUIStore()

  // Local state for tab & return modal
  const [activeTab, setActiveTab] = useState('available') // 'available' | 'active'
  const [returnTarget, setReturnTarget] = useState(null) // order yg akan di-return
  const [returnReason, setReturnReason] = useState('')
  const [submittingReturn, setSubmittingReturn] = useState(false)

  // Fetch orders based on tab
  useEffect(() => {
    if (activeTab === 'available') {
      fetchOrders({ status: 'waiting_shipper' })
    } else {
      fetchOrders({ status: 'shipping' })
    }
  }, [activeTab])

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // BAB 9: Handle pickup -> POST /driver/orders/{id}/pickup
  const handlePickup = async (orderId) => {
    try {
      await pickupOrder(orderId)
      success('Pesanan berhasil diambil!')
      fetchOrders({ status: 'waiting_shipper' })
    } catch (err) {
      showError(err.message || 'Gagal mengambil pesanan')
    }
  }

  // BAB 9: Handle deliver -> POST /driver/orders/{id}/complete
  const handleDeliver = async (orderId) => {
    try {
      await deliverOrder(orderId)
      success('Pesanan berhasil diantar!')
      fetchOrders({ status: 'shipping' })
    } catch (err) {
      showError(err.message || 'Gagal mengkonfirmasi pengantaran')
    }
  }

  // BAB 9: Handle return -> POST /driver/orders/{id}/return
  const handleReturnSubmit = async () => {
    if (!returnTarget) return
    if (!returnReason.trim()) {
      showError('Alasan pengembalian wajib diisi')
      return
    }
    setSubmittingReturn(true)
    try {
      await returnOrder(returnTarget.id, returnReason.trim())
      success('Pesanan dikembalikan. Stok direstore & saldo buyer direfund.')
      setReturnTarget(null)
      setReturnReason('')
      fetchOrders({ status: 'shipping' })
    } catch (err) {
      showError(err.message || 'Gagal mengembalikan pesanan')
    } finally {
      setSubmittingReturn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pesanan Driver</h1>
            <p className="text-gray-600 mt-1">Kelola pesanan yang perlu diantar</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📦 Pesanan Tersedia
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🚗 Pesanan Aktif
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl">
              {activeTab === 'available' ? '📦' : '🚗'}
            </span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              {activeTab === 'available'
                ? 'Tidak Ada Pesanan Tersedia'
                : 'Tidak Ada Pesanan Aktif'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'available'
                ? 'Saat ini belum ada pesanan yang perlu diantar.'
                : 'Kamu belum mengambil pesanan apapun.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <Badge variant={order.status === 'waiting_shipper' ? 'warning' : 'primary'}>
                    {order.status === 'waiting_shipper' ? 'Menunggu' : 'Sedang Diantar'}
                  </Badge>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Items:</p>
                  <ul className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product?.name || 'Produk'}</span>
                        <span className="font-medium">
                          {formatPrice((item.price_at_purchase || 0) * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Alamat Tujuan:</p>
                  <p className="text-gray-900">{order.shipping_address}</p>
                </div>

                {/* Store Info */}
                {order.store && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Toko:</p>
                    <p className="text-gray-900">{order.store.name}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {order.status === 'waiting_shipper' && (
                    <Button
                      onClick={() => handlePickup(order.id)}
                      className="flex-1"
                      leftIcon={<span>🚗</span>}
                    >
                      Ambil Pesanan
                    </Button>
                  )}

                  {order.status === 'shipping' && (
                    <>
                      <Button
                        onClick={() => handleDeliver(order.id)}
                        className="flex-1"
                        variant="success"
                        leftIcon={<span>✅</span>}
                      >
                        Konfirmasi Selesai
                      </Button>
                      <Button
                        variant="danger"
                        leftIcon={<span>↩️</span>}
                        onClick={() => {
                          setReturnTarget(order)
                          setReturnReason('')
                        }}
                      >
                        Kembalikan
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* BAB 9: Modal Return Order */}
      <Modal
        isOpen={!!returnTarget}
        onClose={() => setReturnTarget(null)}
        title={`Kembalikan Pesanan ${returnTarget?.order_number || ''}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Pesanan akan ditandai <b>dikembalikan</b>. Stok produk akan
            di-restore dan saldo buyer akan di-refund otomatis.
          </p>
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Alasan Pengembalian <span className="text-red-500">*</span>
            </label>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Contoh: Alamat tidak ditemukan, buyer tidak di rumah..."
            />
            <p className="text-xs text-gray-400 mt-1">
              {returnReason.length}/500 karakter
            </p>
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setReturnTarget(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleReturnSubmit}
              disabled={submittingReturn || !returnReason.trim()}
            >
              {submittingReturn ? 'Memproses...' : 'Kembalikan Pesanan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DriverOrdersPage
