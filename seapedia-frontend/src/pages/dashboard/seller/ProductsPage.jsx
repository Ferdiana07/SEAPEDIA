// File: src/pages/dashboard/seller/ProductsPage.jsx
// Penjelasan: Halaman untuk seller mengelola produk mereka sendiri

import { useCallback, useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import Input from '../../../components/ui/Input'
import ProductImage from '../../../components/ui/ProductImage'
import ProductImageUpload from '../../../components/ui/ProductImageUpload'
import useUIStore from '../../../stores/uiStore'
import productService from '../../../services/productService'
import { CheckCircle, Package, Plus, Warning } from '@phosphor-icons/react'

const PRODUCT_CATEGORIES = [
  ['alat pancing', 'Alat Pancing'],
  ['budidaya', 'Budidaya'],
  ['pakan', 'Pakan'],
  ['akuarium', 'Akuarium'],
  ['biota hidup', 'Biota Hidup'],
  ['tanaman laut', 'Tanaman Laut'],
  ['hasil laut', 'Hasil Laut'],
  ['kuliner laut', 'Kuliner Laut'],
  ['lainnya', 'Lainnya'],
]

const categoryLabel = (value) => PRODUCT_CATEGORIES.find(([id]) => id === value)?.[1] || 'Lainnya'

// ============================================================
// SELLER PRODUCTS PAGE
// ============================================================
const SellerProductsPage = () => {
  // Stores
  const { success, error: showError } = useUIStore()

  // Local state
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'alat pancing',
    price: '',
    stock: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  // Fetch products
  const fetchProducts = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await productService.getMyProducts({ page })

      if (response.success) {
        setProducts(response.data)
        if (response.meta) {
          setPagination({
            current_page: response.meta.current_page,
            last_page: response.meta.last_page,
            total: response.meta.total,
          })
        }
      }
    } catch {
      showError('Gagal mengambil produk')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await productService.getMyStats()

      if (response.success) {
        setStats(response.data)
      }
    } catch {
      showError('Statistik produk belum dapat dimuat')
    }
  }, [showError])

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [fetchProducts, fetchStats])

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Open edit modal
  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category || 'lainnya',
      price: product.price.toString(),
      stock: product.stock.toString(),
    })
    setImageFile(null)
    setFormErrors({})
    setShowEditModal(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'alat pancing',
      price: '',
      stock: '',
    })
    setImageFile(null)
    setFormErrors({})
    setSelectedProduct(null)
  }

  // Handle create
  const requestSave = (event, type) => {
    event.preventDefault()
    setShowCreateModal(false)
    setShowEditModal(false)
    setConfirmation({ type, product: selectedProduct })
  }

  const handleCreate = async () => {
    setIsSubmitting(true)
    setFormErrors({})

    try {
      const response = await productService.create({
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        image: imageFile,
      })

      if (response.success) {
        success('Produk berhasil ditambahkan!')
        setConfirmation(null)
        setShowCreateModal(false)
        resetForm()
        fetchProducts()
        fetchStats()
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
        setConfirmation(null)
        setShowCreateModal(true)
      } else {
        showError(err.response?.data?.message || 'Gagal membuat produk')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle update
  const handleUpdate = async () => {
    if (!selectedProduct) return

    setIsSubmitting(true)
    setFormErrors({})

    try {
      const response = await productService.update(selectedProduct.id, {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        image: imageFile,
      })

      if (response.success) {
        success('Produk berhasil diupdate!')
        setConfirmation(null)
        setShowEditModal(false)
        resetForm()
        fetchProducts()
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
        setConfirmation(null)
        setShowEditModal(true)
      } else {
        showError(err.response?.data?.message || 'Gagal update produk')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAvailability = async (product) => {
    const nextActive = !product.is_active
    setIsSubmitting(true)
    try {
      const response = await productService.update(product.id, { is_active: nextActive })

      if (response.success) {
        success(nextActive ? 'Produk kembali aktif.' : 'Produk dinonaktifkan.')
        setConfirmation(null)
        fetchProducts()
        fetchStats()
      }
    } catch {
      showError('Status produk gagal diubah')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="text-gray-600 mt-1">Kelola produk di toko kamu</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowCreateModal(true)
            }}
            leftIcon={<Plus size={18} weight="bold" />}
          >
            Tambah Produk
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Produk</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
                </div>
                <Package size={30} className="text-primary-500" weight="duotone" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Produk Aktif</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_products}</p>
                </div>
                <CheckCircle size={30} className="text-emerald-500" weight="duotone" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stok Habis</p>
                  <p className="text-2xl font-bold text-red-600">{stats.out_of_stock}</p>
                </div>
                <Warning size={30} className="text-amber-500" weight="duotone" />
              </div>
            </Card>
          </div>
        )}

        {/* Products Table */}
        <Card>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package size={54} className="mx-auto text-primary-300" weight="duotone" />
              <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                Belum Ada Produk
              </h2>
              <p className="text-gray-600 mb-6">
                Tambahkan produk pertamamu untuk mulai berjualan!
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Tambah Produk
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Produk</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Kategori</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Harga</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Stok</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <ProductImage src={product.image_url} alt={product.name} iconSize={22} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description || 'Tidak ada deskripsi'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-600">
                          {categoryLabel(product.category)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-primary-600">
                            {formatPrice(product.price)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={product.stock > 0 ? 'text-gray-900' : 'text-red-600'}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={product.is_active && product.stock > 0 ? 'success' : 'danger'} dot>
                            {!product.is_active ? 'Nonaktif' : product.stock > 0 ? 'Tersedia' : 'Stok Habis'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmation({ type: 'availability', product })}
                              className={product.is_active ? 'text-red-500 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-700'}
                            >
                              {product.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="space-y-3 md:hidden">
                {products.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                    <div className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <ProductImage src={product.image_url} alt={product.name} iconSize={24} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="truncate text-sm font-bold text-slate-800">{product.name}</h4>
                          <Badge variant={product.is_active && product.stock > 0 ? 'success' : 'danger'} dot className="shrink-0 text-[10px]">
                            {!product.is_active ? 'Nonaktif' : product.stock > 0 ? 'Tersedia' : 'Habis'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-extrabold text-primary-700">{formatPrice(product.price)}</p>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">{categoryLabel(product.category)}</span>
                          <span>•</span>
                          <span className={product.stock > 0 ? 'font-semibold text-slate-700' : 'font-semibold text-danger-600'}>
                            Stok: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="text-xs !py-1 !px-3"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmation({ type: 'availability', product })}
                        className={`text-xs !py-1 !px-3 ${product.is_active ? 'text-danger-600 hover:bg-danger-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                      >
                        {product.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() => fetchProducts(pagination.current_page - 1)}
              >
                Prev
              </Button>
              <span className="px-4 py-2 text-gray-600">
                Halaman {pagination.current_page} dari {pagination.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => fetchProducts(pagination.current_page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetForm()
        }}
        title="Tambah Produk Baru"
      >
        <form onSubmit={(event) => requestSave(event, 'create')} className="space-y-4">
          <Input
            label="Nama Produk"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name?.[0]}
            placeholder="Contoh: Reel Spinning Laut"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Jelaskan produk kamu..."
            />
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Kategori
            <select name="category" value={formData.category} onChange={handleChange} className="input mt-1" required>
              {PRODUCT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {formErrors.category?.[0] && <span className="mt-1 block text-xs font-semibold text-danger-600">{formErrors.category[0]}</span>}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Harga (Rp)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={formErrors.price?.[0]}
              placeholder="25000"
              required
            />

            <Input
              label="Stok"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              error={formErrors.stock?.[0]}
              placeholder="10"
              required
            />
          </div>

          <ProductImageUpload
            inputId="create-product-image"
            file={imageFile}
            error={Array.isArray(formErrors.image) ? formErrors.image[0] : formErrors.image}
            onChange={setImageFile}
            onError={(message) => setFormErrors((current) => ({ ...current, image: message }))}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                resetForm()
              }}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          resetForm()
        }}
        title="Edit Produk"
      >
        <form onSubmit={(event) => requestSave(event, 'update')} className="space-y-4">
          <Input
            label="Nama Produk"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name?.[0]}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Kategori
            <select name="category" value={formData.category} onChange={handleChange} className="input mt-1" required>
              {PRODUCT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {formErrors.category?.[0] && <span className="mt-1 block text-xs font-semibold text-danger-600">{formErrors.category[0]}</span>}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Harga (Rp)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={formErrors.price?.[0]}
              required
            />

            <Input
              label="Stok"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              error={formErrors.stock?.[0]}
              required
            />
          </div>

          <ProductImageUpload
            inputId="edit-product-image"
            file={imageFile}
            currentImage={selectedProduct?.image_url}
            error={Array.isArray(formErrors.image) ? formErrors.image[0] : formErrors.image}
            onChange={setImageFile}
            onError={(message) => setFormErrors((current) => ({ ...current, image: message }))}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                resetForm()
              }}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Update
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        isOpen={!!confirmation}
        onClose={() => {
          const type = confirmation?.type
          setConfirmation(null)
          if (type === 'create') setShowCreateModal(true)
          if (type === 'update') setShowEditModal(true)
        }}
        onConfirm={() => confirmation?.type === 'create' ? handleCreate() : confirmation?.type === 'update' ? handleUpdate() : handleAvailability(confirmation.product)}
        title={confirmation?.type === 'create' ? 'Publikasikan produk?' : confirmation?.type === 'update' ? 'Simpan perubahan produk?' : `${confirmation?.product?.is_active ? 'Nonaktifkan' : 'Aktifkan'} produk?`}
        description={confirmation?.type === 'availability'
          ? 'Status katalog berubah langsung. Cart Buyer tetap divalidasi ulang saat checkout.'
          : 'Periksa nama, kategori, harga, dan stok sebelum data produk disimpan.'}
        details={confirmation?.type === 'availability' && confirmation?.product ? [
          { label: 'Produk', value: confirmation.product.name },
          { label: 'Status baru', value: confirmation.product.is_active ? 'Nonaktif' : 'Aktif' },
        ] : [
          { label: 'Produk', value: formData.name || '-' },
          { label: 'Harga', value: formData.price ? formatPrice(formData.price) : '-' },
          { label: 'Stok', value: formData.stock || '0' },
          { label: 'Foto', value: imageFile?.name || (selectedProduct?.image_url ? 'Tetap gunakan foto saat ini' : 'Tanpa foto') },
        ]}
        confirmLabel={confirmation?.type === 'create' ? 'Publikasikan' : confirmation?.type === 'update' ? 'Simpan perubahan' : 'Ubah status'}
        tone={confirmation?.type === 'availability' && confirmation?.product?.is_active ? 'danger' : 'primary'}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default SellerProductsPage
