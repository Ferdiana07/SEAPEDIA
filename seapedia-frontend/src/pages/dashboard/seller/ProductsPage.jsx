// File: src/pages/dashboard/seller/ProductsPage.jsx
// Penjelasan: Halaman untuk seller mengelola produk mereka sendiri

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import useUIStore from '../../../stores/uiStore'
import productService from '../../../services/productService'

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
    price: '',
    stock: '',
    image_url: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [])

  // Fetch products
  const fetchProducts = async (page = 1) => {
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
    } catch (err) {
      showError('Gagal mengambil produk')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await productService.getMyStats()

      if (response.success) {
        setStats(response.data)
      }
    } catch (err) {
      console.error('Gagal mengambil statistik:', err)
    }
  }

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
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || '',
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
    })
    setFormErrors({})
    setSelectedProduct(null)
  }

  // Handle create
  const handleCreate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    try {
      const response = await productService.create({
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      })

      if (response.success) {
        success('Produk berhasil ditambahkan!')
        setShowCreateModal(false)
        resetForm()
        fetchProducts()
        fetchStats()
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
      } else {
        showError(err.response?.data?.message || 'Gagal membuat produk')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!selectedProduct) return

    setIsSubmitting(true)
    setFormErrors({})

    try {
      const response = await productService.update(selectedProduct.id, {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      })

      if (response.success) {
        success('Produk berhasil diupdate!')
        setShowEditModal(false)
        resetForm()
        fetchProducts()
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
      } else {
        showError(err.response?.data?.message || 'Gagal update produk')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (product) => {
    if (!confirm(`Yakin ingin menghapus "${product.name}"?`)) return

    try {
      const response = await productService.delete(product.id)

      if (response.success) {
        success('Produk berhasil dihapus!')
        fetchProducts()
        fetchStats()
      }
    } catch (err) {
      showError('Gagal menghapus produk')
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
            leftIcon={<span>➕</span>}
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
                <span className="text-3xl">📦</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Produk Aktif</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_products}</p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stok Habis</p>
                  <p className="text-2xl font-bold text-red-600">{stats.out_of_stock}</p>
                </div>
                <span className="text-3xl">⚠️</span>
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
              <span className="text-6xl">📦</span>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Produk</th>
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
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                📦
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.description || 'Tidak ada deskripsi'}
                            </p>
                          </div>
                        </div>
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
                        <Badge variant={product.stock > 0 ? 'success' : 'danger'} dot>
                          {product.stock > 0 ? 'Tersedia' : 'Stok Habis'}
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
                            onClick={() => handleDelete(product)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nama Produk"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name?.[0]}
            placeholder="Contoh: Nasi Goreng Spesial"
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

          <Input
            label="URL Gambar (opsional)"
            name="image_url"
            type="url"
            value={formData.image_url}
            onChange={handleChange}
            error={formErrors.image_url?.[0]}
            placeholder="https://example.com/image.jpg"
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
        <form onSubmit={handleUpdate} className="space-y-4">
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

          <Input
            label="URL Gambar (opsional)"
            name="image_url"
            type="url"
            value={formData.image_url}
            onChange={handleChange}
            error={formErrors.image_url?.[0]}
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
    </div>
  )
}

export default SellerProductsPage
