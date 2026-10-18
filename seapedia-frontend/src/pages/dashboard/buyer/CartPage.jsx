// File: src/pages/dashboard/buyer/CartPage.jsx
import { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import ProductImage from '../../../components/ui/ProductImage'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import useCartStore from '../../../stores/cartStore'
import useAddressStore from '../../../stores/addressStore'
import useOrderStore from '../../../stores/orderStore'
import useWalletStore from '../../../stores/walletStore'
import useUIStore from '../../../stores/uiStore'
import orderService from '../../../services/orderService'
import { Lightbulb, ShoppingCart, Storefront, Trash } from '@phosphor-icons/react'

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
  const [checkoutConfirmOpen, setCheckoutConfirmOpen] = useState(false)
  const [cartAction, setCartAction] = useState(null)
  const [cartActionLoading, setCartActionLoading] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('regular')
  const [discountCode, setDiscountCode] = useState('')
  const [quote, setQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  
  // Fetch data on mount
  useEffect(() => {
    fetchAddresses()
    fetchWallet()
    fetchCart()
  }, [fetchAddresses, fetchCart, fetchWallet])
  
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

  const loadQuote = useCallback(async (code = '') => {
    if (items.length === 0) return
    setQuoteLoading(true)
    try {
      const response = await orderService.quote({
        delivery_method: deliveryMethod,
        discount_code: code.trim() || null,
      })
      setQuote(response.data)
    } catch (err) {
      setQuote(null)
      showError(err.response?.data?.message || 'Ringkasan checkout tidak dapat dihitung.')
    } finally {
      setQuoteLoading(false)
    }
  }, [deliveryMethod, items.length, showError])

  useEffect(() => {
    if (items.length > 0) loadQuote('')
  }, [items.length, loadQuote])
  
  // Handle checkout
  const requestCheckout = () => {
    if (items.length === 0) {
      warning('Cart kosong!')
      return
    }
    
    if (!selectedAddress) {
      warning('Pilih alamat pengiriman terlebih dahulu')
      return
    }
    
    const total = quote?.total_amount ?? getTotalPrice()
    if (balance < total) {
      warning(`Saldo tidak cukup. Butuh ${formatPrice(total - balance)} lagi.`)
      return
    }
    
    setCheckoutConfirmOpen(true)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    try {
      // Create order
      const response = await createOrder({
        address_id: selectedAddress.id,
        delivery_method: deliveryMethod,
        discount_code: discountCode.trim() || null,
      })
      
      if (response.success) {
        setCheckoutConfirmOpen(false)
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

  const confirmCartAction = async () => {
    if (!cartAction) return
    setCartActionLoading(true)
    try {
      if (cartAction.type === 'clear') await clearCart()
      else await removeItem(cartAction.item.id)
      setCartAction(null)
      success(cartAction.type === 'clear' ? 'Keranjang dikosongkan.' : 'Produk dihapus dari keranjang.')
    } catch (error) {
      showError(error.response?.data?.message || 'Keranjang belum dapat diperbarui.')
    } finally {
      setCartActionLoading(false)
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
            <ShoppingCart size={58} className="mx-auto text-primary-300" weight="duotone" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Keranjang Kosong
            </h2>
            <p className="text-gray-600 mb-6">
              Sepertinya kamu belum menambahkan produk ke keranjang.
            </p>
            <Button as={Link} to="/products">Belanja Sekarang</Button>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Store Info */}
            {store && (
              <Card>
                <Badge variant="secondary">
                  <Storefront size={18} className="text-primary-500" /> {store.name}
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
                  <ProductImage src={item.product?.image_url} alt={item.product?.name || 'Produk'} iconSize={22} className="h-full w-full object-cover" />
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                  <p className="text-lg font-bold text-primary-600 mt-1">
                    {formatPrice(item.product?.price)}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2.5 mt-3 pt-2 border-t border-slate-100">
                    {/* Quantity */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold"
                        aria-label="Kurang satu"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs sm:text-sm font-extrabold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold"
                        aria-label="Tambah satu"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Subtotal */}
                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                      Subtotal: {formatPrice((item.product?.price || 0) * item.quantity)}
                    </span>
                    
                    {/* Remove */}
                    <button
                      onClick={() => setCartAction({ type: 'remove', item })}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 ml-auto sm:ml-0"
                    >
                      <Trash size={15} /> Hapus
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Clear Cart */}
            <button
              onClick={() => setCartAction({ type: 'clear' })}
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
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(quote?.subtotal ?? getTotalPrice())}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Diskon</span><span className="text-emerald-700">- {formatPrice(quote?.discount_amount || 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Ongkir</span><span>{formatPrice(quote?.delivery_fee || 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">PPN 12%</span><span>{formatPrice(quote?.tax_amount || 0)}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-700">{quoteLoading ? 'Menghitung...' : formatPrice(quote?.total_amount ?? getTotalPrice())}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 font-semibold text-gray-900">Pengiriman dan Diskon</h3>
              <div className="grid gap-2">
                {[['regular', 'Regular', '3-5 hari'], ['next_day', 'Next Day', 'Tiba besok'], ['instant', 'Instant', 'Tiba hari ini']].map(([value, label, caption]) => (
                  <label key={value} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${deliveryMethod === value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                    <span><span className="block text-sm font-semibold">{label}</span><span className="text-xs text-gray-500">{caption}</span></span>
                    <input type="radio" name="delivery" checked={deliveryMethod === value} onChange={() => { setDeliveryMethod(value); setDiscountCode('') }} />
                  </label>
                ))}
              </div>
              <label className="mt-4 block text-sm font-medium text-gray-700">Voucher atau promo</label>
              <div className="mt-2 flex gap-2">
                <input value={discountCode} onChange={(event) => setDiscountCode(event.target.value.toUpperCase())} placeholder="Contoh: LAUT10" className="input" />
                <Button type="button" variant="outline" onClick={() => loadQuote(discountCode)} disabled={quoteLoading}>Pakai</Button>
              </div>
              {quote?.discount && <p className="mt-2 text-xs font-medium text-emerald-700">{quote.discount.name} diterapkan.</p>}
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
                  <Button as={Link} to="/buyer/addresses/new" size="sm">Tambah Alamat</Button>
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
              <p className={`text-xl font-bold ${balance >= (quote?.total_amount ?? getTotalPrice()) ? 'text-green-600' : 'text-red-600'}`}>
                {formatPrice(balance)}
              </p>
              {balance < (quote?.total_amount ?? getTotalPrice()) && (
                <p className="text-sm text-red-500 mt-1">
                  Saldo tidak cukup
                </p>
              )}
            </Card>
            
            {/* Checkout Button */}
            <Button
              onClick={requestCheckout}
              isLoading={isCheckingOut}
              disabled={!selectedAddress || !quote || balance < quote.total_amount}
              className="w-full"
              size="lg"
            >
              Bayar {formatPrice(quote?.total_amount ?? getTotalPrice())}
            </Button>
            
            {selectedAddress && balance < (quote?.total_amount ?? getTotalPrice()) && (
              <p className="text-sm text-gray-500 text-center">
                <Lightbulb size={17} className="shrink-0" /> Top up wallet terlebih dahulu untuk checkout
              </p>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={checkoutConfirmOpen}
        onClose={() => setCheckoutConfirmOpen(false)}
        onConfirm={handleCheckout}
        title="Konfirmasi pembayaran"
        description="Pastikan alamat, metode kirim, dan total pembayaran sudah benar. Saldo wallet akan langsung dipotong."
        details={[
          { label: 'Toko', value: store?.name || 'Toko' },
          { label: 'Alamat', value: selectedAddress?.label || '-' },
          { label: 'Pengiriman', value: deliveryMethod === 'instant' ? 'Instant' : deliveryMethod === 'next_day' ? 'Next Day' : 'Regular' },
          { label: 'Total bayar', value: formatPrice(quote?.total_amount ?? getTotalPrice()) },
        ]}
        confirmLabel="Bayar sekarang"
        isLoading={isCheckingOut}
      />
      <ConfirmDialog
        isOpen={!!cartAction}
        onClose={() => setCartAction(null)}
        onConfirm={confirmCartAction}
        title={cartAction?.type === 'clear' ? 'Kosongkan keranjang?' : 'Hapus produk dari keranjang?'}
        description={cartAction?.type === 'clear' ? 'Semua produk pada keranjang saat ini akan dihapus.' : 'Produk ini dapat ditambahkan lagi selama masih tersedia.'}
        details={cartAction?.item ? [{ label: 'Produk', value: cartAction.item.product?.name || 'Produk' }, { label: 'Jumlah', value: cartAction.item.quantity }] : []}
        confirmLabel={cartAction?.type === 'clear' ? 'Kosongkan' : 'Hapus produk'}
        tone="danger"
        isLoading={cartActionLoading}
      />
    </div>
  )
}

export default CartPage
