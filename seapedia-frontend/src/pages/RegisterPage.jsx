import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, EnvelopeSimple, Key, ShieldCheck, User } from '@phosphor-icons/react'
import BrandMark from '../components/ui/BrandMark'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import authService from '../services/authService'
import useUIStore from '../stores/uiStore'

const BENEFITS = [
  'Akses ribuan produk lokal pilihan dengan harga jujur',
  'Dompet digital terintegrasi untuk checkout instan & aman',
  'Bisa buka toko atau jadi mitra driver kapan saja dari satu akun',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { success, error: showError } = useUIStore()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const requestSubmit = (event) => {
    event.preventDefault()
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ['Konfirmasi password tidak sama.'] })
      return
    }
    setConfirmOpen(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setErrors({})
    try {
      const response = await authService.register(formData)
      if (response.success) {
        success('Akun berhasil dibuat. Silakan masuk.')
        navigate('/login')
      }
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors)
      else showError(error.response?.data?.message || 'Registrasi gagal. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card-hover lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="order-2 bg-primary-950 p-7 text-white sm:p-10 lg:order-1 lg:p-12">
          <Link to="/" className="inline-flex"><BrandMark inverse /></Link>
          <p className="mt-12 text-sm font-bold text-primary-200">Mulai sebagai pembeli</p>
          <h1 className="mt-3 max-w-md text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Satu akun untuk seluruh ekosistem marketplace.</h1>
          <p className="mt-4 max-w-md leading-7 text-primary-100">Daftar sebagai pembeli, lalu aktifkan peran penjual atau driver kapan saja dari pengaturan akun.</p>

          <div className="mt-8 space-y-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-primary-50">
                <CheckCircle size={20} className="shrink-0 text-accent-300" weight="fill" />
                {benefit}
              </div>
            ))}
          </div>
        </aside>

        <section className="order-1 flex flex-col justify-center p-6 sm:p-10 lg:order-2 lg:p-12" aria-labelledby="register-heading">
          <div className="max-w-lg">
            <p className="text-sm font-bold text-primary-700">Buat akun baru</p>
            <h2 id="register-heading" className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">Selamat datang di SEAPEDIA.</h2>
            <p className="mt-3 leading-7 text-slate-600">Isi data dasar berikut. Role awal akunmu adalah Pembeli.</p>
          </div>

          <form onSubmit={requestSubmit} className="mt-8 grid max-w-lg gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Input label="Nama lengkap" name="name" type="text" autoComplete="name" placeholder="Nama kamu" value={formData.name} onChange={handleChange} error={errors.name?.[0]} required leftIcon={<User size={20} className="text-slate-400" />} /></div>
            <div className="sm:col-span-2"><Input label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} error={errors.email?.[0]} required leftIcon={<EnvelopeSimple size={20} className="text-slate-400" />} /></div>
            <Input label="Password" name="password" type="password" autoComplete="new-password" placeholder="Min. 8 karakter" value={formData.password} onChange={handleChange} error={errors.password?.[0]} required leftIcon={<Key size={20} className="text-slate-400" />} />
            <Input label="Konfirmasi" name="password_confirmation" type="password" autoComplete="new-password" placeholder="Ulangi password" value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation?.[0]} required leftIcon={<ShieldCheck size={20} className="text-slate-400" />} />
            <Button type="submit" className="mt-2 w-full sm:col-span-2" size="lg" isLoading={isLoading} rightIcon={<ArrowRight size={19} weight="bold" />}>Buat akun</Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">Sudah punya akun? <Link to="/login" className="font-bold text-primary-700 hover:text-primary-900">Masuk di sini</Link></p>
        </section>
      </div>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        title="Konfirmasi Pendaftaran Akun"
        description="Periksa kembali data Anda. Akun baru langsung aktif dengan dompet digital dan siap digunakan untuk berbelanja."
        details={[{ label: 'Nama Lengkap', value: formData.name || '-' }, { label: 'Alamat Email', value: formData.email || '-' }, { label: 'Peran Akun', value: 'Pembeli (Dapat upgrade)' }]}
        confirmLabel="Buat akun"
        isLoading={isLoading}
      />
    </div>
  )
}
