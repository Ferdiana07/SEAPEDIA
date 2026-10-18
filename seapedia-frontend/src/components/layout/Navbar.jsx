import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  CaretDown,
  GearSix,
  List,
  MagnifyingGlass,
  ShoppingBag,
  SignOut,
  Storefront,
  UserCircle,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import authService from '../../services/authService'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'
import useUIStore from '../../stores/uiStore'
import BrandMark from '../ui/BrandMark'
import Button from '../ui/Button'

const ROLE_LABELS = {
  buyer: 'Pembeli',
  seller: 'Penjual',
  driver: 'Driver',
  admin: 'Admin',
}

const ROLE_DESTINATIONS = {
  buyer: '/buyer/dashboard',
  seller: '/seller/dashboard',
  driver: '/driver/dashboard',
  admin: '/admin/dashboard',
}

const ROLE_LINKS = {
  buyer: [
    ['/buyer/dashboard', 'Ringkasan'],
    ['/buyer/orders', 'Pesanan'],
    ['/buyer/wallet', 'Dompet'],
  ],
  seller: [
    ['/seller/dashboard', 'Ringkasan toko'],
    ['/seller/products', 'Produk'],
    ['/seller/orders', 'Pesanan masuk'],
  ],
  driver: [
    ['/driver/dashboard', 'Ringkasan'],
    ['/driver/orders', 'Pengantaran'],
  ],
  admin: [
    ['/admin/dashboard', 'Monitoring'],
    ['/admin/users', 'Pengguna'],
    ['/admin/discounts', 'Voucher & promo'],
  ],
}

const isActive = (pathname, to) =>
  to === '/products' ? pathname.startsWith('/products') : pathname === to

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout, activeRole } = useAuthStore()
  const { getTotalItems, resetLocalCart } = useCartStore()
  const { success, error: showError } = useUIStore()

  const authenticated = isAuthenticated()
  const roleLinks = ROLE_LINKS[activeRole] || []

  const handleSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
    setMobileOpen(false)
  }

  const handleLogout = async () => {
    try { await authService.logout() } catch { /* local logout still works */ }
    resetLocalCart()
    logout()
    navigate('/')
  }

  const switchRole = async (role) => {
    try {
      const response = await authService.selectRole(role)
      useAuthStore.setState({ user: response.user, activeRole: response.user.active_role })
      success(`Mode ${ROLE_LABELS[role]} aktif.`)
      navigate(ROLE_DESTINATIONS[role])
      setMobileOpen(false)
    } catch (error) {
      showError(error.response?.data?.message || 'Role belum dapat diubah.')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/75 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="page-shell flex h-[68px] items-center gap-3">
        {/* Brand */}
        <Link to="/" aria-label="SEAPEDIA beranda" className="shrink-0">
          <BrandMark />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden max-w-lg flex-1 md:block">
          <label htmlFor="nav-search" className="sr-only">Cari produk</label>
          <MagnifyingGlass
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="nav-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input pl-10 pr-4"
            placeholder="Cari produk atau toko…"
          />
        </form>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Navigasi utama">
          <Link
            to="/products"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              isActive(location.pathname, '/products')
                ? 'bg-primary-50 text-primary-900 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
            }`}
          >
            Jelajahi
          </Link>
          {roleLinks.slice(0, 2).map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(location.pathname, to)
                  ? 'bg-primary-50 text-primary-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Cart badge (buyer only) */}
        {authenticated && activeRole === 'buyer' && (
          <Link
            to="/cart"
            aria-label={`Keranjang, ${getTotalItems()} barang`}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-900 transition-colors"
          >
            <ShoppingBag size={21} weight="bold" />
            {getTotalItems() > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-cobalt-500 px-1 text-[10px] font-extrabold text-white">
                {Math.min(getTotalItems(), 99)}
              </span>
            )}
          </Link>
        )}

        {/* User menu */}
        {authenticated ? (
          <details className="group relative hidden sm:block">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 pr-2.5 text-sm transition hover:border-primary-300 hover:bg-primary-50">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-900 text-xs font-extrabold text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
              <span className="max-w-24 truncate font-semibold text-ink">{user?.name}</span>
              <CaretDown size={13} className="text-slate-400 transition group-open:rotate-180" />
            </summary>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-card-up animate-slide-down">
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-ink">{user?.email}</p>
                <span className="mt-1 inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-900">
                  Mode {ROLE_LABELS[activeRole]}
                </span>
              </div>
              <div className="my-1 h-px bg-slate-100" />
              {(user?.roles || []).filter((item) => item.role !== activeRole).map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => switchRole(item.role)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-900"
                >
                  <UsersThree size={17} /> Ganti ke {ROLE_LABELS[item.role]}
                </button>
              ))}
              <Link
                to="/settings"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-ink"
              >
                <GearSix size={17} /> Pengaturan
              </Link>
              <div className="my-1 h-px bg-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-danger-600 hover:bg-danger-50"
              >
                <SignOut size={17} /> Keluar
              </button>
            </div>
          </details>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            <Button as={Link} to="/login" variant="ghost" size="sm">Masuk</Button>
            <Button as={Link} to="/register" size="sm">Daftar</Button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={21} weight="bold" /> : <List size={21} weight="bold" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden animate-fade-in">
          <form onSubmit={handleSearch} className="relative mb-4 md:hidden">
            <MagnifyingGlass size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input pl-9 pr-4"
              placeholder="Cari produk atau toko…"
              aria-label="Cari produk"
            />
          </form>
          <div className="grid gap-0.5">
            <Link to="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-900">
              <Storefront size={19} /> Jelajahi produk
            </Link>
            {roleLinks.map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-900">
                <UserCircle size={19} /> {label}
              </Link>
            ))}
            {authenticated ? (
              <>
                <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <GearSix size={19} /> Pengaturan
                </Link>
                <button type="button" onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger-600 hover:bg-danger-50">
                  <SignOut size={19} /> Keluar
                </button>
              </>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button as={Link} to="/login" className="w-full" variant="outline">Masuk</Button>
                <Button as={Link} to="/register" className="w-full">Daftar</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
