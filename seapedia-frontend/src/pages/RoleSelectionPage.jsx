import { Navigate, useNavigate } from 'react-router-dom'
import { Storefront, ShoppingBagOpen, Truck } from '@phosphor-icons/react'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'
import authService from '../services/authService'

const roleMeta = {
  buyer: { label: 'Pembeli', description: 'Belanja, kelola wallet, dan lacak pesanan.', icon: ShoppingBagOpen },
  seller: { label: 'Penjual', description: 'Kelola toko, produk, dan pesanan masuk.', icon: Storefront },
  driver: { label: 'Driver', description: 'Ambil job pengiriman dan pantau penghasilan.', icon: Truck },
}

export default function RoleSelectionPage() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { error: showError } = useUIStore()

  if (!token) return <Navigate to="/login" replace />
  if (user?.active_role) return <Navigate to={`/${user.active_role}/dashboard`} replace />

  const chooseRole = async (role) => {
    try {
      const response = await authService.selectRole(role)
      useAuthStore.setState({ user: response.user, activeRole: response.user.active_role })
      navigate(role === 'buyer' ? '/buyer/dashboard' : `/${role}/dashboard`, { replace: true })
    } catch (error) {
      showError(error.response?.data?.message || 'Role belum dapat diaktifkan.')
    }
  }

  const roles = user?.roles?.filter(({ role }) => roleMeta[role]) || []

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-primary-700">Satu akun, beberapa cara bekerja</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight text-slate-950">Pilih peran untuk sesi ini</h1>
        <p className="mt-3 max-w-xl text-slate-600">Hak akses dan dashboard akan mengikuti peran yang kamu pilih. Kamu dapat menggantinya lagi dari menu akun.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {roles.map(({ role }) => {
            const meta = roleMeta[role]
            const Icon = meta.icon
            return (
              <button key={role} onClick={() => chooseRole(role)} className="group flex min-h-44 flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-100">
                <span className="rounded-xl bg-primary-50 p-3 text-primary-700"><Icon size={28} weight="duotone" /></span>
                <span className="mt-6 text-xl font-bold text-slate-950">{meta.label}</span>
                <span className="mt-1 text-sm leading-6 text-slate-600">{meta.description}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
