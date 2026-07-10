// File: src/pages/dashboard/buyer/AddressFormPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import useAddressStore from '../../../stores/addressStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// ADDRESS FORM PAGE
// ============================================================
const AddressFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  // Stores
  const { addresses, addAddress, updateAddress, fetchAddresses } = useAddressStore()
  const { success, error: showError } = useUIStore()

  // Form state
  const [formData, setFormData] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    full_address: '',
    is_default: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Fetch addresses and populate form when editing
  useEffect(() => {
    fetchAddresses()
  }, [])

  // Populate form when addresses are loaded (edit mode)
  useEffect(() => {
    if (isEdit && id && addresses.length > 0) {
      const address = addresses.find(a => a.id === parseInt(id))
      if (address) {
        setFormData({
          label: address.label || '',
          recipient_name: address.recipient_name || '',
          phone: address.phone || '',
          full_address: address.full_address || '',
          is_default: address.is_default || false,
        })
      }
    }
  }, [id, isEdit, addresses])
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    try {
      if (isEdit) {
        await updateAddress(parseInt(id), formData)
        success('Alamat berhasil diupdate!')
      } else {
        await addAddress(formData)
        success('Alamat berhasil ditambahkan!')
      }
      navigate('/buyer/addresses')
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        showError('Gagal menyimpan alamat')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEdit ? 'Edit Alamat' : 'Tambah Alamat Baru'}
        </h1>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Label Alamat"
              name="label"
              placeholder="Rumah, Kantor, dll"
              value={formData.label}
              onChange={handleChange}
              error={errors.label?.[0]}
              required
            />
            
            <Input
              label="Nama Penerima"
              name="recipient_name"
              placeholder="Nama lengkap penerima"
              value={formData.recipient_name}
              onChange={handleChange}
              error={errors.recipient_name?.[0]}
              required
            />
            
            <Input
              label="Nomor Telepon"
              name="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone?.[0]}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="full_address"
                rows={4}
                placeholder="Jl. nama jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                value={formData.full_address}
                onChange={handleChange}
                className={`
                  w-full px-4 py-2 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${errors.full_address ? 'border-red-500' : 'border-gray-300'}
                `}
              />
              {errors.full_address?.[0] && (
                <p className="mt-1 text-sm text-red-500">{errors.full_address[0]}</p>
              )}
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="rounded text-primary-500 focus:ring-primary-500"
              />
              <span className="text-gray-700">Jadikan alamat default</span>
            </label>
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/buyer/addresses')}
              >
                Batal
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                {isEdit ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default AddressFormPage