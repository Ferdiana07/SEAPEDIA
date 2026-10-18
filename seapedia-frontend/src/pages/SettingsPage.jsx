import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'
import authService from '../services/authService'
import addressService from '../services/addressService'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import {
  CaretRight,
  Eye,
  EyeSlash,
  IdentificationCard,
  Lightbulb,
  LockKey,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingCart,
  Storefront,
  User,
  Wallet,
  Car,
} from '@phosphor-icons/react'

// ============================================================
// SETTINGS PAGE - Mirip E-Commerce Profesional
// ============================================================

const GENDER_OPTIONS = [
  { value: '', label: 'Pilih jenis kelamin' },
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
  { value: 'other', label: 'Lainnya' },
]

const ROLE_META = {
  buyer:  { icon: <ShoppingCart size={26} weight="duotone" />, label: 'Pembeli',  desc: 'Belanja produk dari seller lokal' },
  seller: { icon: <Storefront size={26} weight="duotone" />, label: 'Penjual',  desc: 'Buka toko dan jual produk' },
  driver: { icon: <Car size={26} weight="duotone" />, label: 'Driver',   desc: 'Antar pesanan dan dapatkan komisi' },
  admin:  { icon: <ShieldCheck size={26} weight="duotone" />, label: 'Admin', desc: 'Kelola seluruh platform SEAPEDIA' },
}

const NAV_ITEMS = [
  { id: 'profile', icon: <User size={19} />, label: 'Informasi Pribadi' },
  { id: 'address', icon: <MapPin size={19} />, label: 'Alamat Saya' },
  { id: 'security', icon: <LockKey size={19} />, label: 'Keamanan Akun' },
  { id: 'roles', icon: <IdentificationCard size={19} />, label: 'Manajemen Role' },
  { id: 'wallet', icon: <Wallet size={19} />, label: 'Dompet Saya' },
]

// ============================================================
// TABS
// ============================================================

// --- Tab: Informasi Pribadi ---
const ProfileTab = ({ user, onUpdate }) => {
  const { success, error: showError } = useUIStore()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    birth_date: user?.birth_date || '',
    gender: user?.gender || '',
    avatar_url: user?.avatar_url || '',
  })
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'avatar_url') setAvatarPreview(value)
  }

  const requestSubmit = (event) => {
    event.preventDefault()
    setConfirmOpen(true)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const res = await authService.updateProfile(form)
      if (res.success) {
        useAuthStore.setState(s => ({
          user: { ...s.user, ...res.user },
          activeRole: res.user.active_role || s.activeRole,
        }))
        onUpdate(res.user)
        success('Profil berhasil disimpan!')
        setConfirmOpen(false)
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?'

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Informasi Pribadi</h2>
      <p className="text-sm text-gray-500 mb-6">Kelola informasi profil kamu untuk keamanan akun</p>

      <form onSubmit={requestSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-100 border-4 border-white shadow-md">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover"
                  onError={() => setAvatarPreview('')} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary-600">
                  {getInitial(form.name)}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 mb-1">Foto Profil</p>
            <p className="text-xs text-gray-500 mb-2">Masukkan URL foto profil kamu</p>
            <input
              name="avatar_url"
              type="url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Nama lengkap kamu"
            />
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-sm text-gray-500">
                +62
              </span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                maxLength={20}
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-r-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="8123456789"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 bg-white"
            >
              {GENDER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-xs text-gray-400">(tidak bisa diubah)</span>
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={2}
              maxLength={255}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 resize-none"
              placeholder="Ceritakan sedikit tentang dirimu..."
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/255</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary-500 text-white text-sm font-bold rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        title="Simpan informasi pribadi?"
        description="Perubahan profil akan langsung digunakan di seluruh role pada akun yang sama."
        details={[{ label: 'Nama', value: form.name || '-' }, { label: 'Nomor HP', value: form.phone || '-' }]}
        confirmLabel="Simpan profil"
        isLoading={saving}
      />
    </div>
  )
}

// --- Tab: Alamat ---
const AddressTab = () => {
  const { success, error: showError } = useUIStore()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ label: '', recipient_name: '', phone: '', full_address: '', is_default: false })
  const [confirmation, setConfirmation] = useState(null)

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const res = await addressService.getAll()
      if (res.success) setAddresses(res.data)
    } catch {
      setAddresses([])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAddresses() }, [])

  const openForm = (addr = null) => {
    setEditTarget(addr)
    setFormData(addr
      ? { label: addr.label, recipient_name: addr.recipient_name, phone: addr.phone, full_address: addr.full_address, is_default: addr.is_default }
      : { label: '', recipient_name: '', phone: '', full_address: '', is_default: false }
    )
    setShowForm(true)
  }

  const requestSubmit = (event) => {
    event.preventDefault()
    setConfirmation({ type: 'save', address: editTarget })
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const res = editTarget
        ? await addressService.update(editTarget.id, formData)
        : await addressService.create(formData)
      if (res.success) {
        success(editTarget ? 'Alamat diupdate!' : 'Alamat ditambahkan!')
        setConfirmation(null)
        setShowForm(false)
        fetchAddresses()
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal menyimpan alamat')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    setSaving(true)
    try {
      await addressService.delete(id)
      success('Alamat dihapus')
      setConfirmation(null)
      fetchAddresses()
    } catch { showError('Gagal menghapus') }
    finally { setSaving(false) }
  }

  const handleSetDefault = async (id) => {
    setSaving(true)
    try {
      await addressService.setDefault(id)
      success('Alamat default diubah!')
      setConfirmation(null)
      fetchAddresses()
    } catch { showError('Gagal mengubah default') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Alamat Saya</h2>
          <p className="text-sm text-gray-500">Kelola alamat pengiriman kamu</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white text-sm font-bold rounded-lg hover:bg-primary-600 transition-colors"
        >
          <span>+</span> Tambah Alamat
        </button>
      </div>

      {/* Form tambah/edit */}
      {showForm && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">{editTarget ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
          <form onSubmit={requestSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Label Alamat</label>
                <input type="text" placeholder="Rumah / Kantor" value={formData.label}
                  onChange={e => setFormData(p => ({ ...p, label: e.target.value }))} required
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Penerima</label>
                <input type="text" placeholder="Nama lengkap penerima" value={formData.recipient_name}
                  onChange={e => setFormData(p => ({ ...p, recipient_name: e.target.value }))} required
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nomor HP Penerima</label>
                <input type="tel" placeholder="08xx..." value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} required
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Alamat Lengkap</label>
                <textarea rows={2} placeholder="Jl. ..." value={formData.full_address}
                  onChange={e => setFormData(p => ({ ...p, full_address: e.target.value }))} required
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 resize-none" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={formData.is_default}
                onChange={e => setFormData(p => ({ ...p, is_default: e.target.checked }))}
                className="rounded text-primary-500" />
              Jadikan alamat utama
            </label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 bg-primary-500 text-white text-sm font-bold rounded-lg hover:bg-primary-600 disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Alamat */}
      {loading ? (
        <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto" /></div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <MapPin size={42} className="mx-auto mb-2 text-primary-300" weight="duotone" />
          <p className="text-gray-500 text-sm">Belum ada alamat tersimpan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className={`border rounded-xl p-4 transition-all ${addr.is_default ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-xs font-bold bg-primary-500 text-white px-2 py-0.5 rounded">
                        Utama
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{addr.recipient_name}</p>
                  <p className="text-sm text-gray-500">{addr.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">{addr.full_address}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!addr.is_default && (
                    <button onClick={() => setConfirmation({ type: 'default', address: addr })}
                      className="text-xs text-primary-500 hover:underline font-medium">
                      Jadikan Utama
                    </button>
                  )}
                  <button onClick={() => openForm(addr)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                    Ubah
                  </button>
                  <button onClick={() => setConfirmation({ type: 'delete', address: addr })}
                    className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        onConfirm={() => confirmation?.type === 'save' ? handleSubmit() : confirmation?.type === 'delete' ? handleDelete(confirmation.address.id) : handleSetDefault(confirmation.address.id)}
        title={confirmation?.type === 'save' ? (editTarget ? 'Simpan perubahan alamat?' : 'Tambahkan alamat?') : confirmation?.type === 'delete' ? 'Hapus alamat?' : 'Jadikan alamat utama?'}
        description={confirmation?.type === 'delete' ? 'Alamat akan dihapus dari akunmu.' : 'Perubahan ini akan memengaruhi pilihan alamat pada checkout berikutnya.'}
        details={confirmation?.type === 'save'
          ? [{ label: 'Label', value: formData.label || '-' }, { label: 'Penerima', value: formData.recipient_name || '-' }]
          : confirmation?.address ? [{ label: 'Label', value: confirmation.address.label }, { label: 'Penerima', value: confirmation.address.recipient_name }] : []}
        confirmLabel={confirmation?.type === 'delete' ? 'Hapus alamat' : 'Simpan'}
        tone={confirmation?.type === 'delete' ? 'danger' : 'primary'}
        isLoading={saving}
      />
    </div>
  )
}

// --- Tab: Keamanan ---
const SecurityTab = () => {
  const { success, error: showError } = useUIStore()
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [saving, setSaving] = useState(false)
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false })
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const requestSubmit = (event) => {
    event.preventDefault()
    if (form.password !== form.password_confirmation) {
      showError('Konfirmasi password tidak sesuai')
      return
    }
    setConfirmOpen(true)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const res = await authService.changePassword(form)
      if (res.success) {
        success('Password berhasil diubah!')
        setConfirmOpen(false)
        setForm({ current_password: '', password: '', password_confirmation: '' })
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mengubah password')
    } finally { setSaving(false) }
  }

  const renderPassInput = (name, label, keyName) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={showPass[keyName] ? 'text' : 'password'}
          value={form[name]}
          onChange={handleChange}
          required
          minLength={name === 'current_password' ? 1 : 8}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 pr-10"
          placeholder={name === 'current_password' ? 'Password saat ini' : name === 'password' ? 'Min. 8 karakter' : 'Ulangi password baru'}
        />
        <button type="button" onClick={() => setShowPass(p => ({ ...p, [keyName]: !p[keyName] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
          {showPass[keyName] ? <EyeSlash size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Keamanan Akun</h2>
      <p className="text-sm text-gray-500 mb-6">Pastikan akun kamu menggunakan password yang kuat</p>

      <div className="max-w-md">
        <form onSubmit={requestSubmit} className="space-y-4">
          {renderPassInput('current_password', 'Password Saat Ini', 'current')}
          {renderPassInput('password', 'Password Baru', 'new')}
          {renderPassInput('password_confirmation', 'Konfirmasi Password Baru', 'confirm')}

          {/* Strength Indicator */}
          {form.password && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Kekuatan password:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                    form.password.length >= i * 2
                      ? form.password.length >= 12 ? 'bg-green-500' : form.password.length >= 8 ? 'bg-yellow-500' : 'bg-red-400'
                      : 'bg-gray-200'
                  }`} />
                ))}
              </div>
              <p className="text-xs mt-1 text-gray-400">
                {form.password.length < 8 ? 'Terlalu pendek' : form.password.length < 12 ? 'Cukup kuat' : 'Sangat kuat'}
              </p>
            </div>
          )}

          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-primary-500 text-white text-sm font-bold rounded-lg hover:bg-primary-600 disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </form>
        <ConfirmDialog
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleSubmit}
          title="Ubah password akun?"
          description="Password baru berlaku untuk semua role pada akun ini. Pastikan kamu menyimpannya dengan aman."
          details={[{ label: 'Panjang password baru', value: `${form.password.length} karakter` }]}
          confirmLabel="Ubah password"
          tone="danger"
          isLoading={saving}
        />

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-blue-700"><Lightbulb size={18} /> Tips Keamanan</p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Gunakan kombinasi huruf, angka, dan simbol</li>
            <li>• Minimal 8 karakter, disarankan 12+</li>
            <li>• Jangan gunakan password yang sama dengan akun lain</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// --- Tab: Roles ---
const RolesTab = ({ user }) => {
  const { success, error: showError } = useUIStore()
  const [switching, setSwitching] = useState(null)
  const [registering, setRegistering] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const navigate = useNavigate()

  const allRoles = ['buyer', 'seller', 'driver']
  const userRoles = user?.roles || []
  const activeRole = user?.active_role || user?.roles?.find(r => r.is_active)?.role

  const handleSwitchRole = async (role) => {
    setSwitching(role)
    try {
      const res = await authService.selectRole(role)
      if (res.success) {
        setConfirmation(null)
        useAuthStore.setState({ user: res.user, activeRole: res.user.active_role })
        success(`Berhasil beralih ke role ${ROLE_META[role]?.label}!`)
        if (role === 'seller') navigate('/seller/dashboard')
        else if (role === 'driver') navigate('/driver/orders')
        else if (role === 'admin') navigate('/admin/dashboard')
        else navigate('/')
      }
    } catch (err) { showError(err.response?.data?.message || 'Gagal mengubah role')
    } finally { setSwitching(null) }
  }

  const handleRegisterRole = async (role) => {
    setRegistering(role)
    try {
      const assignRes = await authService.assignRole(role)
      if (assignRes.success) {
        const selectRes = await authService.selectRole(role)
        if (selectRes.success) {
          setConfirmation(null)
          useAuthStore.setState({ user: selectRes.user, activeRole: selectRes.user.active_role })
          success(`Berhasil mendaftar sebagai ${ROLE_META[role]?.label}!`)
          if (role === 'seller') navigate('/seller/dashboard')
          else if (role === 'driver') navigate('/driver/orders')
        }
      }
    } catch (err) { showError(err.response?.data?.message || 'Gagal mendaftar role')
    } finally { setRegistering(null) }
  }

  const hasRole = (role) => userRoles.some(r => r.role === role)
  const isActive = (role) => activeRole === role

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Manajemen Role</h2>
      <p className="text-sm text-gray-500 mb-6">Kelola peran kamu di platform SEAPEDIA. Satu akun bisa punya banyak role!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allRoles.map(role => {
          const meta = ROLE_META[role]
          const owned = hasRole(role)
          const active = isActive(role)

          return (
            <div key={role} className={`border-2 rounded-xl p-5 transition-all ${
              active ? 'border-primary-400 bg-primary-50' : owned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{meta.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{meta.label}</p>
                    <p className="text-xs text-gray-500">{meta.desc}</p>
                  </div>
                </div>
                {active && (
                  <span className="text-[10px] font-bold bg-primary-500 text-white px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
                {owned && !active && (
                  <span className="text-[10px] font-bold bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                    Dimiliki
                  </span>
                )}
              </div>

              {active ? (
                <p className="text-xs text-primary-600 font-medium">✓ Role ini sedang aktif</p>
              ) : owned ? (
                <button
                  onClick={() => setConfirmation({ type: 'switch', role })}
                  disabled={switching === role}
                  className="w-full py-2 text-sm font-bold text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 transition-colors"
                >
                  {switching === role ? 'Beralih...' : `Beralih ke ${meta.label}`}
                </button>
              ) : (
                <button
                  onClick={() => setConfirmation({ type: 'register', role })}
                  disabled={registering === role}
                  className="w-full py-2 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {registering === role ? 'Mendaftar...' : `Daftar Jadi ${meta.label}`}
                </button>
              )}
            </div>
          )
        })}

        {/* Admin card (info only, tidak bisa daftar sendiri) */}
        {hasRole('admin') && (
          <div className={`border-2 rounded-xl p-5 transition-all ${isActive('admin') ? 'border-red-400 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ROLE_META.admin.icon}</span>
                <div>
                  <p className="font-bold text-gray-900">{ROLE_META.admin.label}</p>
                  <p className="text-xs text-gray-500">{ROLE_META.admin.desc}</p>
                </div>
              </div>
              {isActive('admin') && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">Aktif</span>}
            </div>
            {isActive('admin') ? (
              <p className="text-xs text-red-600 font-medium">✓ Kamu adalah Administrator platform</p>
            ) : (
              <button onClick={() => setConfirmation({ type: 'switch', role: 'admin' })}
                className="w-full py-2 text-sm font-bold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                Beralih ke Admin
              </button>
            )}
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        onConfirm={() => confirmation?.type === 'register' ? handleRegisterRole(confirmation.role) : handleSwitchRole(confirmation.role)}
        title={confirmation?.type === 'register' ? `Tambah role ${ROLE_META[confirmation?.role]?.label}?` : `Beralih ke ${ROLE_META[confirmation?.role]?.label}?`}
        description={confirmation?.type === 'register'
          ? 'Role baru terhubung ke akun yang sama. Profil dan login tetap satu, sementara dashboard menyesuaikan role aktif.'
          : 'Menu dan izin aktif akan berganti. Data dari role lain tetap tersimpan dan dapat diakses saat beralih kembali.'}
        details={confirmation ? [{ label: 'Role', value: ROLE_META[confirmation.role]?.label || confirmation.role }] : []}
        confirmLabel={confirmation?.type === 'register' ? 'Tambah role' : 'Beralih role'}
        isLoading={switching === confirmation?.role || registering === confirmation?.role}
      />
    </div>
  )
}

// --- Tab: Wallet ---
const WalletTab = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Dompet Saya</h2>
      <p className="text-sm text-gray-500 mb-6">Lihat saldo dan riwayat transaksi</p>

      <div className="mb-6 rounded-2xl bg-primary-800 p-6 text-white">
        <p className="text-sm opacity-80 mb-1">Dompet SEAPEDIA</p>
        <p className="text-3xl font-bold mb-4">Lihat di Halaman Wallet</p>
        <p className="text-sm opacity-70">Kelola saldo, top-up, dan lihat riwayat transaksi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => navigate('/buyer/wallet')}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-left">
          <Wallet size={28} className="text-primary-500" weight="duotone" />
          <div>
            <p className="font-semibold text-gray-900">Saldo & Top Up</p>
            <p className="text-xs text-gray-500">Lihat saldo dan isi ulang</p>
          </div>
        </button>
        <button onClick={() => navigate('/buyer/orders')}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-left">
          <Package size={28} className="text-primary-500" weight="duotone" />
          <div>
            <p className="font-semibold text-gray-900">Riwayat Pesanan</p>
            <p className="text-xs text-gray-500">Lihat semua transaksi</p>
          </div>
        </button>
      </div>
    </div>
  )
}

// ============================================================
// SETTINGS PAGE UTAMA
// ============================================================
const SettingsPage = () => {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [currentUser, setCurrentUser] = useState(user)
  const [avatarFailed, setAvatarFailed] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) navigate('/login')
  }, [isAuthenticated, navigate])

  useEffect(() => setAvatarFailed(false), [currentUser?.avatar_url])

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?'
  const activeRoleName = currentUser?.roles?.find(r => r.is_active)?.role

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* Page Header */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-primary-500">Beranda</Link>
            <CaretRight size={15} />
            <span className="text-gray-900 font-medium">Pengaturan Akun</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            {/* User Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-100 border-4 border-primary-50 shadow mx-auto mb-3">
                {currentUser?.avatar_url && !avatarFailed ? (
                  <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover"
                    onError={() => setAvatarFailed(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary-600">
                    {getInitial(currentUser?.name)}
                  </div>
                )}
              </div>
              <p className="font-bold text-gray-900 truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate mb-2">{currentUser?.email}</p>
              {activeRoleName && (
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-primary-100 text-primary-700 rounded-full uppercase">
                  {ROLE_META[activeRoleName]?.label || activeRoleName}
                </span>
              )}
            </div>

            {/* Nav */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-l-2 ${
                    activeTab === item.id
                      ? 'bg-primary-50 text-primary-600 font-semibold border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 border-transparent hover:text-gray-900'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {activeTab === 'profile'  && <ProfileTab user={currentUser} onUpdate={setCurrentUser} />}
            {activeTab === 'address'  && <AddressTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'roles'    && <RolesTab user={currentUser} />}
            {activeTab === 'wallet'   && <WalletTab />}
          </main>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
