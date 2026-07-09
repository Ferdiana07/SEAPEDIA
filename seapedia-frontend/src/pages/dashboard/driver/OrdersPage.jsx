// File: src/pages/dashboard/driver/OrdersPage.jsx
import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useOrderStore from '../../../stores/orderStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// DRIVER ORDERS PAGE
// ============================================================
const DriverOrdersPage = () => {
  // Stores
  const { orders, isLoading, fetchOrders, updateStatus } = useOrderStore()
  const { success, error: showError } = useUIStore()
  
  // Fetch available orders on mount
  useEffect(() => {
    // Fetch orders yang waiting_shipper
    fetchOrders({ status: 'waiting_shipper' })
  }, [])
  
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
  
  // Handle pickup
  const handlePickup = async (orderId) => {
    try {
      await updateStatus(orderId, 'shipping')
      success('Pesanan berhasil diambil!')
      // Refresh list
      fetchOrders({ status: 'waiting_shipper' })
    } catch (err) {
      showError('Gagal mengambil pesanan')
    }
  }
  
  // Handle deliver
  const handleDeliver = async (orderId) => {
    try {
      await updateStatus(orderId, 'completed')
      success('Pesanan berhasil diantar!')
      // Refresh list
      fetchOrders({ status: 'shipping' })
    } catch (err) {
      showError('Gagal mengkonfirmasi pengantaran')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Tersedia</h1>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl">🚗</span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Tidak Ada Pesanan
            </h2>
            <p className="text-gray-600">
              Saat ini belum ada pesanan yang perlu diantar.
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
                    {order.status === 'waiting_shipper' ? 'Menunggu' : 'Dikirim'}
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
                          {formatPrice(item.price_at_purchase * item.quantity)}
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
                
                {/* Actions */}
                <div className="flex gap-3">
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
                    <Button
                      onClick={() => handleDeliver(order.id)}
                      className="flex-1"
                      variant="success"
                      leftIcon={<span>✅</span>}
                    >
                      Konfirmasi Selesai
                    </Button>
                  )}
                  
                  <Button variant="outline" className="flex-1">
                    Detail
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DriverOrdersPage