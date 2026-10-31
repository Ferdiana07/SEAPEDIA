import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Package, Phone, Storefront } from '@phosphor-icons/react'
import Button from '../components/ui/Button'
import storeService from '../services/storeService'
import ProductImage from '../components/ui/ProductImage'
import { formatCurrency } from '../utils/formatCurrency'

export default function StoreDetailPage() {
  const { id } = useParams()
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    storeService.getById(Number(id))
      .then((response) => { if (active && response.success) setStore(response.data) })
      .catch(() => { if (active) setError('Toko tidak ditemukan atau sedang tidak aktif.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <div className="page-shell py-10"><div className="h-64 animate-pulse rounded-3xl bg-primary-100" /><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-60 animate-pulse rounded-2xl bg-slate-100" />)}</div></div>
  if (error || !store) return <div className="page-shell py-20 text-center"><Storefront size={48} className="mx-auto text-slate-400" /><h1 className="mt-4 text-2xl font-extrabold text-ink">Toko tidak ditemukan</h1><p className="mt-2 text-slate-500">{error}</p><Button as={Link} to="/products" variant="outline" className="mt-6" leftIcon={<ArrowLeft size={17} />}>Kembali ke katalog</Button></div>

  return (
    <div className="bg-white py-8 sm:py-10">
      <div className="page-shell">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-700"><ArrowLeft size={18} /> Kembali ke katalog</Link>
        <section className="mt-5 overflow-hidden rounded-3xl bg-primary-950 text-white">
          <div className="grid gap-6 p-7 sm:p-9 md:grid-cols-[auto_1fr] md:items-center">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl bg-white text-primary-700">
              <ProductImage src={store.logo_url} alt={`Logo ${store.name}`} fallbackIcon={Storefront} iconSize={48} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-200">Toko aktif di SEAPEDIA</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{store.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-100">{store.description || 'Penjual belum menambahkan deskripsi toko.'}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-primary-100"><span className="flex items-center gap-2"><MapPin size={17} /> {store.address}</span><span className="flex items-center gap-2"><Phone size={17} /> {store.phone}</span></div>
            </div>
          </div>
        </section>

        <section className="section-space" aria-labelledby="store-products-heading">
          <div><p className="text-sm font-bold text-primary-700">Katalog toko</p><h2 id="store-products-heading" className="mt-1 text-2xl font-extrabold text-ink">Produk dari {store.name}</h2></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {store.products?.map((product) => <Link key={product.id} to={`/products/${product.id}`} className="product-card group"><div className="aspect-square overflow-hidden bg-slate-100"><ProductImage src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-4"><h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-700 group-hover:text-primary-700">{product.name}</h3><p className="mt-2 font-extrabold text-ink">{formatCurrency(product.price)}</p><p className="mt-1 text-xs font-semibold text-success-600">Stok {product.stock}</p></div></Link>)}
            {!store.products?.length && <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white py-14 text-center"><Package size={42} className="mx-auto text-slate-400" /><p className="mt-3 font-extrabold text-ink">Belum ada produk aktif</p></div>}
          </div>
        </section>
      </div>
    </div>
  )
}
