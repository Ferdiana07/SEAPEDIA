// File: src/pages/dashboard/buyer/CartPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useCartStore from '../../../stores/cartStore'
import useAddressStore from '../../../stores/addressStore'
import useOrderStore from '../../../stores/orderStore'
import useWalletStore from '../../../stores/walletStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// CART PAGE
// ============================================================
const CartPage = () => {
  const navigate = useNavigate()
  
  // Stores
  const { items, store, getTotalPrice, getTotalItems, updateQuantity, removeItem, clearCart, fetchCart, isLoading } = useCartStore()
  const { addresses, defaultAddress, fetchAddresses } = useAddressStore()
  const { createOrder } = useOrderStore()
  const { balance, fetchWallet } = useWalletStore()
  const { success, error: showError, warning } = useUIStore()
  
  // Local state
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  // Fetch data on mount
  useEffect(() => {
    fetchAddresses()
    fetchWallet()
    fetchCart()
  }, [])
  
  // Set initial selected address
  const selectedAddress = selectedAddressId 
    ? addresses.find(a => a.id === selectedAddressId)
    : defaultAddress
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Handle checkout
  const handleCheckout = async () => {
    if (items.length === 0) {
      warning('Cart kosong!')
      return
    }
    
    if (!selectedAddress) {
      warning('Pilih alamat pengiriman terlebih dahulu')
      return
    }
    
    const total = getTotalPrice()
    if (balance < total) {
      warning(`Saldo tidak cukup. Butuh ${formatPrice(total - balance)} lagi.`)
      return
    }
    
    setIsCheckingOut(true)
    
    try {
      // Create order
      const response = await createOrder({
        address_id: selectedAddress.id,
        shipping_address: selectedAddress.full_address,
      })
      
      if (response.success) {
        // Clear cart
        clearCart()
        
        // Show success
        success('Pesanan berhasil dibuat!')
        
        // Navigate to orders
        navigate('/buyer/orders')
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Checkout gagal')
    } finally {
      setIsCheckingOut(false)
    }
  }
  
  // Empty cart
  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <span className="text-6xl">🛒</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Cart Kosong
            </h2>
            <p className="text-gray-600 mb-6">
              Sepertinya kamu belum menambahkan apapun ke cart.
            </p>
            <Link to="/products">
              <Button>Belanja Sekarang</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Store Info */}
            {store && (
              <Card>
                <Badge variant="secondary">
                  🏪 {store.name}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  Semua item dari toko yang sama
                </p>
              </Card>
            )}
            
            {/* Items */}
            {items.map((item) => (
              <Card key={item.product_id} className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      📦
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-lg font-bold text-primary-600 mt-1">
                    {formatPrice(item.price)}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Subtotal */}
                    <span className="font-medium">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </span>
                    
                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-red-500 hover:text-red-700 ml-auto"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Clear Cart */}
            <button
              onClick={() => {
                if (confirm('Kosongkan cart?')) {
                  clearCart()
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Kosongkan Cart
            </button>
          </div>
          
          {/* Summary */}
          <div className="space-y-4">
            {/* Order Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Item</span>
                  <span className="font-medium">{getTotalItems()} items</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </Card>
            
            {/* Address Selection */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Alamat Pengiriman</h3>
              
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`
                        flex items-start gap-3 p-3 border rounded-lg cursor-pointer
                        ${selectedAddressId === addr.id || (!selectedAddressId && addr.is_default)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id || (!selectedAddressId && addr.is_default)}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{addr.label}</p>
                        <p className="text-sm text-gray-600">{addr.recipient_name}</p>
                        <p className="text-sm text-gray-500">{addr.full_address}</p>
                        <p className="text-sm text-gray-500">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  
                  <Link 
                    to="/buyer/addresses/new"
                    className="block text-center text-primary-500 hover:underline text-sm"
                  >
                    + Tambah Alamat Baru
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">Belum ada alamat</p>
                  <Link to="/buyer/addresses/new">
                    <Button size="sm">Tambah Alamat</Button>
                  </Link>
                </div>
              )}
            </Card>
            
            {/* Wallet Balance */}
            <Card>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Saldo Wallet</span>
                <Link to="/buyer/wallet" className="text-primary-500 text-sm hover:underline">
                  Top Up
                </Link>
              </div>
              <p className={`text-xl font-bold ${balance >= getTotalPrice() ? 'text-green-600' : 'text-red-600'}`}>
                {formatPrice(balance)}
              </p>
              {balance < getTotalPrice() && (
                <p className="text-sm text-red-500 mt-1">
                  Saldo tidak cukup
                </p>
              )}
            </Card>
            
            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              isLoading={isCheckingOut}
              disabled={!selectedAddress || balance < getTotalPrice()}
              className="w-full"
              size="lg"
            >
              Checkout ({formatPrice(getTotalPrice())})
            </Button>
            
            {selectedAddress && balance < getTotalPrice() && (
              <p className="text-sm text-gray-500 text-center">
                💡 Top up wallet terlebih dahulu untuk checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage