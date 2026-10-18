// File: src/pages/dashboard/buyer/AddressListPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import Badge from '../../../components/ui/Badge'
import useAddressStore from '../../../stores/addressStore'
import useUIStore from '../../../stores/uiStore'
import { MapPin, Plus } from '@phosphor-icons/react'

// ============================================================
// ADDRESS LIST PAGE
// ============================================================
const AddressListPage = () => {
  // Stores
  const { addresses, isLoading, fetchAddresses, deleteAddress, setDefault } = useAddressStore()
  const { success, error: showError } = useUIStore()
  const [confirmation, setConfirmation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Fetch on mount
  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])
  
  // Handle delete
  const handleDelete = async (id) => {
    setSubmitting(true)
    try {
      await deleteAddress(id)
      success('Alamat berhasil dihapus')
      setConfirmation(null)
    } catch {
      showError('Gagal menghapus alamat')
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle set default
  const handleSetDefault = async (id) => {
    setSubmitting(true)
    try {
      await setDefault(id)
      success('Alamat default berhasil diubah')
      setConfirmation(null)
    } catch {
      showError('Gagal mengubah alamat default')
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alamat Pengiriman</h1>
          <Button as={Link} to="/buyer/addresses/new" leftIcon={<Plus size={18} weight="bold" />}>Tambah Alamat</Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : addresses.length === 0 ? (
          <Card className="text-center py-12">
            <MapPin size={54} className="mx-auto text-primary-300" weight="duotone" />
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Belum Ada Alamat
            </h2>
            <p className="text-gray-600 mb-6">
              Tambahkan alamat untuk checkout pesanan.
            </p>
            <Button as={Link} to="/buyer/addresses/new">Tambah Alamat</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{address.label}</span>
                    {address.is_default && (
                      <Badge variant="primary" size="sm">Default</Badge>
                    )}
                  </div>
                  <p className="text-gray-900">{address.recipient_name}</p>
                  <p className="text-gray-600">{address.phone}</p>
                  <p className="text-gray-500 mt-2">{address.full_address}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {!address.is_default && (
                    <button
                      onClick={() => setConfirmation({ type: 'default', address })}
                      className="text-primary-500 hover:underline text-sm"
                    >
                      Jadikan Default
                    </button>
                  )}
                  <Link 
                    to={`/buyer/addresses/${address.id}/edit`}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmation({ type: 'delete', address })}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        onConfirm={() => confirmation?.type === 'delete' ? handleDelete(confirmation.address.id) : handleSetDefault(confirmation.address.id)}
        title={confirmation?.type === 'delete' ? 'Hapus alamat?' : 'Jadikan alamat utama?'}
        description={confirmation?.type === 'delete'
          ? 'Alamat akan dihapus dari buku alamat. Pesanan lama tetap menyimpan salinan alamatnya.'
          : 'Alamat ini akan dipilih otomatis pada checkout berikutnya.'}
        details={confirmation ? [{ label: 'Label', value: confirmation.address.label }, { label: 'Penerima', value: confirmation.address.recipient_name }] : []}
        confirmLabel={confirmation?.type === 'delete' ? 'Hapus alamat' : 'Jadikan utama'}
        tone={confirmation?.type === 'delete' ? 'danger' : 'primary'}
        isLoading={submitting}
      />
    </div>
  )
}

export default AddressListPage
