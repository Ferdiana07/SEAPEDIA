// File: src/pages/dashboard/buyer/WalletPage.jsx
import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import useWalletStore from '../../../stores/walletStore'
import useUIStore from '../../../stores/uiStore'
import { ArrowCounterClockwise, CreditCard, EnvelopeSimple, Money, Receipt, ShoppingCart, Wallet } from '@phosphor-icons/react'

// ============================================================
// WALLET PAGE (BUYER)
// ============================================================
const WalletPage = () => {
  // Stores
  const { balance, transactions, pagination, isLoading, fetchWallet, fetchTransactions, topUp } = useWalletStore()
  const { success, error: showError } = useUIStore()
  
  // Local state
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [confirmTopUpOpen, setConfirmTopUpOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [isTopUpLoading, setIsTopUpLoading] = useState(false)
  
  // Fetch on mount
  useEffect(() => {
    fetchWallet()
    fetchTransactions()
  }, [fetchTransactions, fetchWallet])
  
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
    })
  }
  
  // Handle top up
  const requestTopUp = () => {
    const amount = parseFloat(topUpAmount)
    if (Number.isNaN(amount) || amount < 1000) {
      showError('Masukkan jumlah yang valid')
      return
    }
    setShowTopUpModal(false)
    setConfirmTopUpOpen(true)
  }

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount)
    
    setIsTopUpLoading(true)
    
    try {
      await topUp(amount)
      success(`Top up ${formatPrice(amount)} berhasil!`)
      setShowTopUpModal(false)
      setConfirmTopUpOpen(false)
      setTopUpAmount('')
      fetchTransactions() // Refresh transactions
    } catch {
      showError('Top up gagal')
    } finally {
      setIsTopUpLoading(false)
    }
  }
  
  // Get transaction type badge
  const getTypeBadge = (type) => {
    const variants = {
      topup: { label: 'Top Up', icon: Money, tone: 'bg-emerald-50 text-emerald-700' },
      purchase: { label: 'Pembelian', icon: ShoppingCart, tone: 'bg-rose-50 text-rose-700' },
      refund: { label: 'Refund', icon: ArrowCounterClockwise, tone: 'bg-sky-50 text-sky-700' },
      withdrawal: { label: 'Penarikan', icon: Wallet, tone: 'bg-amber-50 text-amber-700' },
    }
    return variants[type] || { label: type, icon: CreditCard, tone: 'bg-slate-100 text-slate-600' }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dompet Digital</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <Card className="bg-primary-800 text-white">
              <p className="text-primary-100 mb-2">Saldo Aktif</p>
              <p className="text-4xl font-bold mb-6">{formatPrice(balance)}</p>
              
              <Button
                variant="secondary"
                className="w-full border-0 bg-white text-primary-800 hover:bg-primary-50"
                onClick={() => setShowTopUpModal(true)}
              >
                <Money size={18} weight="bold" /> Top Up
              </Button>
            </Card>
            
            {/* Quick Actions */}
            <Card className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3">
                  <Receipt size={19} />
                  <span>Riwayat Transaksi</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3">
                  <EnvelopeSimple size={19} />
                  <span>Export Statement</span>
                </button>
              </div>
            </Card>
          </div>
          
          {/* Transactions */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Riwayat Transaksi</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Belum ada transaksi
                </p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => {
                    const typeInfo = getTypeBadge(tx.type)
                    const TransactionIcon = typeInfo.icon
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`grid h-10 w-10 place-items-center rounded-xl ${typeInfo.tone}`}><TransactionIcon size={20} weight="duotone" /></span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {typeInfo.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(tx.created_at)}
                            </p>
                            {tx.description && (
                              <p className="text-sm text-gray-400">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className={`font-bold ${
                          tx.type === 'topup' || tx.type === 'refund'
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}>
                          {tx.type === 'topup' || tx.type === 'refund' ? '+' : '-'}
                          {formatPrice(tx.amount)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === 1}
                    onClick={() => fetchTransactions({ page: pagination.current_page - 1 })}
                  >
                    Prev
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    {pagination.current_page} / {pagination.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() => fetchTransactions({ page: pagination.current_page + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Top Up Modal */}
      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Top Up Wallet"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Masukkan jumlah yang ingin kamu top up ke wallet.
          </p>
          
          {/* Quick amounts */}
          <div className="flex gap-2 flex-wrap">
            {[10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
              <button
                key={amount}
                onClick={() => setTopUpAmount(amount.toString())}
                className={`
                  px-4 py-2 border rounded-lg text-sm font-medium
                  ${topUpAmount === amount.toString()
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
              >
                {formatPrice(amount)}
              </button>
            ))}
          </div>
          
          <Input
            label="Atau masukkan jumlah manual"
            type="number"
            placeholder="0"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowTopUpModal(false)}>
              Batal
            </Button>
            <Button
              onClick={requestTopUp}
              isLoading={isTopUpLoading}
              disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
            >
              Top Up {topUpAmount && formatPrice(parseFloat(topUpAmount))}
            </Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        isOpen={confirmTopUpOpen}
        onClose={() => { setConfirmTopUpOpen(false); setShowTopUpModal(true) }}
        onConfirm={handleTopUp}
        title="Konfirmasi Isi Ulang Saldo"
        description="Saldo akan ditambahkan seketika dan langsung tercatat pada riwayat mutasi dompet Anda."
        details={[
          { label: 'Nominal Isi Ulang', value: topUpAmount ? formatPrice(parseFloat(topUpAmount)) : '-' },
          { label: 'Estimasi Saldo Akhir', value: topUpAmount ? formatPrice(balance + parseFloat(topUpAmount)) : formatPrice(balance) },
        ]}
        confirmLabel="Konfirmasi Isi Ulang"
        isLoading={isTopUpLoading}
      />
    </div>
  )
}

export default WalletPage
