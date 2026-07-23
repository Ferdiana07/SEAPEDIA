// File: src/pages/dashboard/buyer/OrdersPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useOrderStore from '../../../stores/orderStore'

// ============================================================
// ORDERS PAGE (BUYER)
// ============================================================
const OrdersPage = () => {
  // Stores
  const { orders, pagination, isLoading, fetchOrders, updateStatus } = useOrderStore()
  
  // Local state
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Fetch orders on mount
  useEffect(() => {
    fetchOrders({ status: filterStatus !== 'all' ? filterStatus : undefined })
  }, [filterStatus])
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'packaging', label: 'Dikemas' },
    { value: 'waiting_shipper', label: 'Menunggu Driver' },
    { value: 'shipping', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
    { value: 'returned', label: 'Dikembalikan' },
  ]
  
  // Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      packaging: 'warning',
      waiting_shipper: 'info',
      shipping: 'primary',
      completed: 'success',
      returned: 'danger',
    }
    return variants[status] || 'default'
  }
  
  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      packaging: 'Sedang Dikemas',
      waiting_shipper: 'Menunggu Driver',
      shipping: 'Sedang Dikirim',
      completed: 'Selesai',
      returned: 'Dikembalikan',
    }
    return labels[status] || status
  }
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${filterStatus === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl">📦</span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Tidak ada pesanan
            </h2>
            <p className="text-gray-600 mb-6">
              Kamu belum memiliki pesanan.
            </p>
            <Link to="/products">
              <Button>Mulai Belanja</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">{order.order_number}</p>
                  </div>
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                
                {/* Items Preview */}
                <div className="flex gap-4 mb-4">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          📦
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">+{order.items.length - 3}</span>
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="font-bold text-lg text-primary-600">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/buyer/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </Link>

                    {order.status === 'completed' && order.items?.[0]?.product_id && (
                      <Link to={`/products/${order.items[0].product_id}`}>
                        <Button variant="ghost" size="sm">
                          Beli Lagi
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === 1}
              onClick={() => fetchOrders({ page: pagination.current_page - 1 })}
            >
              Prev
            </Button>
            <span className="px-4 py-2">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchOrders({ page: pagination.current_page + 1 })}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage