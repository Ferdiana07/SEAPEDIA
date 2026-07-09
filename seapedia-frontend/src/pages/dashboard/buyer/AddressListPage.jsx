// File: src/pages/dashboard/buyer/AddressListPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useAddressStore from '../../../stores/addressStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// ADDRESS LIST PAGE
// ============================================================
const AddressListPage = () => {
  const navigate = useNavigate()
  
  // Stores
  const { addresses, defaultAddress, isLoading, fetchAddresses, deleteAddress, setDefault } = useAddressStore()
  const { success, error: showError, warning } = useUIStore()
  
  // Fetch on mount
  useEffect(() => {
    fetchAddresses()
  }, [])
  
  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus alamat ini?')) return
    
    try {
      await deleteAddress(id)
      success('Alamat berhasil dihapus')
    } catch (err) {
      showError('Gagal menghapus alamat')
    }
  }
  
  // Handle set default
  const handleSetDefault = async (id) => {
    try {
      await setDefault(id)
      success('Alamat default berhasil diubah')
    } catch (err) {
      showError('Gagal mengubah alamat default')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alamat Pengiriman</h1>
          <Link to="/buyer/addresses/new">
            <Button leftIcon={<span>➕</span>}>
              Tambah Alamat
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : addresses.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl">📍</span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Belum Ada Alamat
            </h2>
            <p className="text-gray-600 mb-6">
              Tambahkan alamat untuk checkout pesanan.
            </p>
            <Link to="/buyer/addresses/new">
              <Button>Tambah Alamat</Button>
            </Link>
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
                      onClick={() => handleSetDefault(address.id)}
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
                    onClick={() => handleDelete(address.id)}
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
    </div>
  )
}

export default AddressListPage