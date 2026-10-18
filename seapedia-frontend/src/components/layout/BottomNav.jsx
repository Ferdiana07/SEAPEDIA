import { Link, useLocation } from 'react-router-dom'
import {
  House,
  Package,
  Receipt,
  ShoppingBag,
  Storefront,
  UserCircle,
} from '@phosphor-icons/react'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'

export default function BottomNav() {
  const location = useLocation()
  const { isAuthenticated, activeRole } = useAuthStore()
  const { getTotalItems } = useCartStore()

  const authenticated = isAuthenticated()
  const cartCount = authenticated && activeRole === 'buyer' ? getTotalItems() : 0

  // On product detail page, hide BottomNav in favor of product sticky buy action bar
  if (location.pathname.startsWith('/products/') && location.pathname !== '/products') {
    return null
  }

  // Determine orders / dashboard destination based on active role
  const getOrdersPath = () => {
    if (!authenticated) return '/login'
    if (activeRole === 'seller') return '/seller/orders'
    if (activeRole === 'driver') return '/driver/orders'
    return '/buyer/orders'
  }

  const getAccountPath = () => {
    if (!authenticated) return '/login'
    if (activeRole === 'seller') return '/seller/dashboard'
    if (activeRole === 'driver') return '/driver/dashboard'
    if (activeRole === 'admin') return '/admin/dashboard'
    return '/buyer/dashboard'
  }

  const items = [
    {
      label: 'Beranda',
      to: '/',
      icon: House,
      isActive: location.pathname === '/',
    },
    {
      label: 'Katalog',
      to: '/products',
      icon: Storefront,
      isActive: location.pathname.startsWith('/products'),
    },
    {
      label: 'Keranjang',
      to: authenticated && activeRole === 'buyer' ? '/cart' : '/products',
      icon: ShoppingBag,
      badge: cartCount > 0 ? (cartCount > 99 ? '99+' : cartCount) : null,
      isActive: location.pathname === '/cart',
    },
    {
      label: 'Pesanan',
      to: getOrdersPath(),
      icon: activeRole === 'seller' || activeRole === 'driver' ? Package : Receipt,
      isActive: location.pathname.includes('/orders'),
    },
    {
      label: authenticated ? 'Akun' : 'Masuk',
      to: getAccountPath(),
      icon: UserCircle,
      isActive:
        location.pathname.includes('/dashboard') ||
        location.pathname.includes('/settings') ||
        location.pathname === '/login' ||
        location.pathname === '/register',
    },
  ]

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 block border-t border-slate-200/80 bg-white/95 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-lg md:hidden"
      aria-label="Navigasi bawah mobile"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map(({ label, to, icon: Icon, badge, isActive }) => (
          <Link
            key={label}
            to={to}
            className={`relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-all ${
              isActive
                ? 'text-primary-900 font-bold'
                : 'text-slate-500 hover:text-primary-700 font-medium'
            }`}
          >
            <div className="relative">
              <Icon
                size={22}
                weight={isActive ? 'fill' : 'regular'}
                className={`transition-transform duration-200 ${isActive ? 'scale-110 text-primary-900' : ''}`}
              />
              {badge && (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-cyan-600 px-1 text-[9px] font-black text-white shadow-sm ring-1 ring-white">
                  {badge}
                </span>
              )}
            </div>
            <span
              className={`mt-1 text-[10px] tracking-tight transition-colors ${
                isActive ? 'font-bold text-primary-900' : 'text-slate-500'
              }`}
            >
              {label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-primary-900" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
