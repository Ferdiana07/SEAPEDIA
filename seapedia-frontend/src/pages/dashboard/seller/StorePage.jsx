// File: src/pages/dashboard/seller/StorePage.jsx
// Penjelasan: Halaman untuk seller mengelola profil toko mereka

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import useUIStore from '../../../stores/uiStore'
import storeService from '../../../services/storeService'

// ============================================================
// SELLER STORE PAGE
// ============================================================
const SellerStorePage = () => {
  // Stores
  const { success, error: showError } = useUIStore()

  // Local state
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasStore, setHasStore] = useState(true)

  // Form state for create
  const [isCreating, setIsCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    logo_url: '',
  })

  // Form state for update
  const [isEditing, setIsEditing] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    logo_url: '',
  })

  // Form errors
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch store on mount
  useEffect(() => {
    fetchStore()
  }, [])

  // Fetch store
  const fetchStore = async () => {
    setIsLoading(true)
    try {
      const response = await storeService.getMyStore()

      if (response.success) {
        setStore(response.data)
        setHasStore(true)
        setUpdateForm({
          name: response.data.name || '',
          description: response.data.description || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          logo_url: response.data.logo_url || '',
        })
      }
    } catch (err) {
      // Check if error is "belum punya toko"
      if (err.response?.status === 404) {
        setHasStore(false)
      } else {
        showError('Gagal mengambil data toko')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle create form change
  const handleCreateChange = (e) => {
    const { name, value } = e.target
    setCreateForm(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setUpdateForm(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Start creating
  const handleStartCreate = () => {
    setIsCreating(true)
    setIsEditing(false)
    setCreateForm({
      name: '',
      description: '',
      address: '',
      phone: '',
      logo_url: '',
    })
    setFormErrors({})
  }

  // Cancel create
  const handleCancelCreate = () => {
    setIsCreating(false)
    setCreateForm({
      name: '',
      description: '',
      address: '',
      phone: '',
      logo_url: '',
    })
    setFormErrors({})
  }

  // Start editing
  const handleStartEdit = () => {
    setIsEditing(true)
    setIsCreating(false)
    setFormErrors({})
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false)
    setUpdateForm({
      name: store.name || '',
      description: store.description || '',
      address: store.address || '',
      phone: store.phone || '',
      logo_url: store.logo_url || '',
    })
    setFormErrors({})
  }

  // Handle create submit
  const handleCreate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    try {
      const response = await storeService.create(createForm)

      if (response.success) {
        success('Toko berhasil dibuat!')
        setStore(response.data)
        setHasStore(true)
        setIsCreating(false)
        fetchStore()
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
      } else {
        showError(err.response?.data?.message || 'Gagal membuat toko')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle update submit
  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    try {
      const response = await storeService.update(updateForm)

      if (response.success) {
        success('Toko berhasil diupdate!')
        setStore(response.data)
        setIsEditing(false)
        fetchStore()
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
      } else {
        showError(err.response?.data?.message || 'Gagal update toko')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        </div>
      </div>
    )
  }

  // No store yet - show create form
  if (!hasStore && !isCreating) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <div className="text-center py-8">
              <span className="text-6xl">🏪</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                Belum Punya Toko
              </h2>
              <p className="text-gray-600 mb-6">
                Buat toko pertamamu untuk mulai berjualan!
              </p>
              <Button onClick={handleStartCreate}>
                Buat Toko Sekarang
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pengaturan Toko</h1>
            <p className="text-gray-600 mt-1">Kelola profil toko kamu</p>
          </div>
          {!isEditing && !isCreating && (
            <Button variant="outline" onClick={handleStartEdit}>
              Edit Toko
            </Button>
          )}
        </div>

        {/* Create Store Form */}
        {isCreating && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Buat Toko Baru</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Nama Toko"
                name="name"
                value={createForm.name}
                onChange={handleCreateChange}
                error={formErrors.name?.[0]}
                placeholder="Contoh: Dapur Enak"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Toko
                </label>
                <textarea
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Jelaskan toko kamu..."
                />
                {formErrors.description?.[0] && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.description[0]}</p>
                )}
              </div>

              <Input
                label="Alamat Toko"
                name="address"
                value={createForm.address}
                onChange={handleCreateChange}
                error={formErrors.address?.[0]}
                placeholder="Contoh: Jl. Sehat No. 5, Jakarta"
                required
              />

              <Input
                label="Nomor Telepon"
                name="phone"
                value={createForm.phone}
                onChange={handleCreateChange}
                error={formErrors.phone?.[0]}
                placeholder="Contoh: 081234567890"
                required
              />

              <Input
                label="URL Logo (opsional)"
                name="logo_url"
                type="url"
                value={createForm.logo_url}
                onChange={handleCreateChange}
                error={formErrors.logo_url?.[0]}
                placeholder="https://example.com/logo.jpg"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelCreate}
                >
                  Batal
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Buat Toko
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* View Store */}
        {store && !isCreating && !isEditing && (
          <Card>
            <div className="flex items-start gap-6">
              {/* Store Logo */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {store.logo_url ? (
                  <img
                    src={store.logo_url}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🏪
                  </div>
                )}
              </div>

              {/* Store Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{store.name}</h2>
                <div className="mt-2 space-y-1">
                  {store.description && (
                    <p className="text-gray-600">{store.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">📍</span> {store.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">📞</span> {store.phone}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    store.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {store.is_active ? '✅ Aktif' : '❌ Tidak Aktif'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {store.products?.length || 0} produk
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-900 mb-3">Aksi Cepat</h3>
              <div className="flex gap-3">
                <Link to="/seller/products">
                  <Button variant="outline" size="sm">
                    📦 Kelola Produk
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Edit Store Form */}
        {isEditing && store && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Toko</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Nama Toko"
                name="name"
                value={updateForm.name}
                onChange={handleEditChange}
                error={formErrors.name?.[0]}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Toko
                </label>
                <textarea
                  name="description"
                  value={updateForm.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {formErrors.description?.[0] && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.description[0]}</p>
                )}
              </div>

              <Input
                label="Alamat Toko"
                name="address"
                value={updateForm.address}
                onChange={handleEditChange}
                error={formErrors.address?.[0]}
                required
              />

              <Input
                label="Nomor Telepon"
                name="phone"
                value={updateForm.phone}
                onChange={handleEditChange}
                error={formErrors.phone?.[0]}
                required
              />

              <Input
                label="URL Logo (opsional)"
                name="logo_url"
                type="url"
                value={updateForm.logo_url}
                onChange={handleEditChange}
                error={formErrors.logo_url?.[0]}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Batal
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SellerStorePage
