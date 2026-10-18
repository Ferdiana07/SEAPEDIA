import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bicycle,
  EnvelopeSimple,
  Key,
  ShieldCheck,
  ShoppingBag,
  Storefront,
  UsersThree,
} from '@phosphor-icons/react'
import BrandMark from '../components/ui/BrandMark'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import authService from '../services/authService'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'

const DEMO_ACCOUNTS = [
  { role: 'Pembeli', email: 'ani@seapedia.com', icon: ShoppingBag, color: 'bg-sky-100 text-sky-700' },
  { role: 'Penjual', email: 'budi@seapedia.com', icon: Storefront, color: 'bg-orange-100 text-orange-700' },
  { role: 'Driver', email: 'caca@seapedia.com', icon: Bicycle, color: 'bg-emerald-100 text-emerald-700' },
  { role: 'Admin', email: 'admin@seapedia.com', icon: ShieldCheck, color: 'bg-rose-100 text-rose-700' },
  { role: 'Multi-role', email: 'fika@seapedia.com', icon: UsersThree, color: 'bg-indigo-100 text-indigo-700' },
]

const destinationFor = (role) => ({
  seller: '/seller/dashboard',
  driver: '/driver/dashboard',
  admin: '/admin/dashboard',
  buyer: '/buyer/dashboard',
}[role] || '/select-role')

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { success, error: showError } = useUIStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeDemo, setActiveDemo] = useState('')

  const authenticate = async (credentials, demoEmail = '') => {
    setIsLoading(true)
    setActiveDemo(demoEmail)
    setErrors({})
    try {
      const response = await authService.login(credentials)
      if (response.success) {
        setAuth(response.user, response.token)
        success(`Selamat datang, ${response.user.name}.`)
        navigate(destinationFor(response.user.active_role))
      }
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors)
      else showError(error.response?.data?.message || 'Login gagal. Periksa email dan password.')
    } finally {
      setIsLoading(false)
      setActiveDemo('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    authenticate(formData)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const loginAsDemo = (account) => {
    const credentials = { email: account.email, password: 'password123' }
    setFormData(credentials)
    authenticate(credentials, account.email)
  }

  return (
    <div className="bg-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card-hover lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12" aria-labelledby="login-heading">
          <Link to="/" className="self-start"><BrandMark /></Link>
          <div className="mt-10 max-w-md">
            <h1 id="login-heading" className="text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">Masuk dan lanjutkan perjalananmu.</h1>
            <p className="mt-3 leading-7 text-slate-600">Satu akun untuk belanja, mengelola toko, mengantar pesanan, atau memantau sistem.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 max-w-md">
            <Input label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} error={errors.email?.[0]} required leftIcon={<EnvelopeSimple size={20} className="text-slate-400" />} />
            <Input label="Password" name="password" type="password" autoComplete="current-password" placeholder="Masukkan password" value={formData.password} onChange={handleChange} error={errors.password?.[0]} required leftIcon={<Key size={20} className="text-slate-400" />} />
            <Button type="submit" className="mt-2 w-full" size="lg" isLoading={isLoading && !activeDemo} rightIcon={<ArrowRight size={19} weight="bold" />}>Masuk</Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">Belum punya akun? <Link to="/register" className="font-bold text-primary-700 hover:text-primary-900">Daftar sekarang</Link></p>
        </section>

        <aside className="bg-primary-950 p-6 text-white sm:p-10 lg:p-12">
          <div className="max-w-lg">
            <p className="text-sm font-bold text-primary-200">Akses Cepat Pengguna</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Eksplorasi Fitur Lengkap SEAPEDIA.</h2>
            <p className="mt-3 text-sm leading-6 text-primary-100">Klik salah satu profil terdaftar berikut untuk masuk langsung dan mencoba pengalaman masing-masing peran:</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon
              return (
                <button key={account.email} type="button" onClick={() => loginAsDemo(account)} disabled={isLoading} className="group flex min-h-28 flex-col items-start rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.12] disabled:opacity-60">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${account.color}`}><Icon size={22} weight="duotone" /></span>
                  <span className="mt-4 flex w-full items-center justify-between gap-2">
                    <span><span className="block text-sm font-extrabold text-white">{account.role}</span><span className="mt-0.5 block text-[11px] text-primary-200">{account.email}</span></span>
                    {activeDemo === account.email && <span className="text-xs font-bold text-accent-300">Masuk...</span>}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-accent-500/90 p-5 text-sm leading-6 text-white backdrop-blur">
            <strong className="block font-extrabold">Keunggulan Multi-Role SEAPEDIA</strong>
            Satu akun dapat memiliki peran ganda (Pembeli & Penjual) secara bersamaan. Pengguna dapat berganti peran secara instan dari menu profil atas.
          </div>
        </aside>
      </div>
    </div>
  )
}
