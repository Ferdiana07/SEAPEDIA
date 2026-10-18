import { useEffect, useState } from 'react'
import { CalendarBlank, CheckCircle, PauseCircle, Ticket } from '@phosphor-icons/react'
import adminService from '../../../services/adminService'
import useUIStore from '../../../stores/uiStore'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

const initialForm = { code: '', name: '', type: 'promo', calculation_type: 'percentage', value: 10, minimum_purchase: 0, maximum_discount: '', usage_limit: '', starts_at: '', expires_at: '' }

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const { success, error: showError } = useUIStore()

  const load = async () => {
    try { setDiscounts((await adminService.getDiscounts()).data) } catch { setDiscounts([]) }
  }
  useEffect(() => { load() }, [])

  const requestCreate = (event) => {
    event.preventDefault()
    setConfirmation({ type: 'create' })
  }

  const submit = async () => {
    setSaving(true)
    try {
      await adminService.createDiscount({ ...form, starts_at: form.starts_at || null, maximum_discount: form.maximum_discount || null, usage_limit: form.usage_limit || null })
      success('Diskon berhasil dibuat.'); setForm(initialForm); setConfirmation(null); await load()
    } catch (error) { showError(error.response?.data?.message || 'Diskon gagal dibuat.') }
    finally { setSaving(false) }
  }

  const toggleStatus = async (discount) => {
    setUpdatingId(discount.id)
    try {
      await adminService.updateDiscount(discount.id, { is_active: !discount.is_active })
      success(discount.is_active ? 'Diskon dinonaktifkan.' : 'Diskon diaktifkan kembali.')
      setConfirmation(null)
      await load()
    } catch (error) {
      showError(error.response?.data?.message || 'Status diskon gagal diubah.')
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (value) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

  return (
    <div className="min-h-screen bg-slate-50 py-10"><div className="mx-auto max-w-7xl px-4">
      <div className="flex items-center gap-4"><span className="rounded-2xl bg-primary-100 p-3 text-primary-700"><Ticket size={30} weight="duotone" /></span><div><h1 className="text-3xl font-black text-slate-950">Voucher dan Promo</h1><p className="text-slate-600">Kelola insentif checkout dari satu tempat.</p></div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={requestCreate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Buat diskon</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Kode<input className="input mt-2 uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></label>
            <label className="text-sm font-semibold">Nama<input className="input mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label className="text-sm font-semibold">Jenis<select className="input mt-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="promo">Promo</option><option value="voucher">Voucher</option></select></label>
            <label className="text-sm font-semibold">Perhitungan<select className="input mt-2" value={form.calculation_type} onChange={(e) => setForm({ ...form, calculation_type: e.target.value })}><option value="percentage">Persentase</option><option value="fixed">Nominal</option></select></label>
            <label className="text-sm font-semibold">Nilai<input type="number" min="1" className="input mt-2" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required /></label>
            <label className="text-sm font-semibold">Minimum belanja<input type="number" min="0" className="input mt-2" value={form.minimum_purchase} onChange={(e) => setForm({ ...form, minimum_purchase: Number(e.target.value) })} /></label>
            <label className="text-sm font-semibold">Maksimum diskon<input type="number" min="1" className="input mt-2" value={form.maximum_discount} onChange={(e) => setForm({ ...form, maximum_discount: e.target.value })} /></label>
            <label className="text-sm font-semibold">Batas penggunaan<input type="number" min="1" className="input mt-2" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} /></label>
            <label className="text-sm font-semibold">Mulai berlaku<input type="datetime-local" className="input mt-2" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></label>
            <label className="text-sm font-semibold">Berlaku sampai<input type="datetime-local" className="input mt-2" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} required /></label>
          </div>
          <Button type="submit" isLoading={saving} className="mt-5 w-full">Simpan Diskon</Button>
        </form>
        <div className="space-y-3">
          {discounts.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Belum ada diskon.</div> : discounts.map((discount) => (
            <article key={discount.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${discount.is_active ? 'border-slate-200' : 'border-slate-200 opacity-70'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2"><p className="text-xs font-bold uppercase tracking-wider text-primary-700">{discount.type}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${discount.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{discount.is_active ? 'Aktif' : 'Nonaktif'}</span></div>
                  <h2 className="mt-1 font-bold text-slate-950">{discount.code}</h2>
                  <p className="text-sm text-slate-600">{discount.name}</p>
                </div>
                <div className="text-right"><p className="text-lg font-black">{discount.calculation_type === 'percentage' ? `${Number(discount.value)}%` : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(discount.value)}</p><p className="text-xs text-slate-500">Dipakai {discount.used_count}{discount.usage_limit ? ` dari ${discount.usage_limit}` : ' kali'}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><CalendarBlank size={16} /> Hingga {formatDate(discount.expires_at)}</p>
                <Button variant="outline" size="sm" isLoading={updatingId === discount.id} onClick={() => setConfirmation({ type: 'toggle', discount })} leftIcon={discount.is_active ? <PauseCircle size={17} /> : <CheckCircle size={17} />}>
                  {discount.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ConfirmDialog
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        onConfirm={() => confirmation?.type === 'create' ? submit() : toggleStatus(confirmation.discount)}
        title={confirmation?.type === 'create' ? 'Simpan diskon baru?' : `${confirmation?.discount?.is_active ? 'Nonaktifkan' : 'Aktifkan'} diskon?`}
        description={confirmation?.type === 'create'
          ? 'Periksa kode, nilai, periode, dan batas penggunaan sebelum promo tersedia saat checkout.'
          : 'Perubahan status langsung memengaruhi apakah kode dapat dipakai Buyer saat checkout.'}
        details={confirmation?.type === 'create' ? [
          { label: 'Kode', value: form.code || '-' },
          { label: 'Nilai', value: form.calculation_type === 'percentage' ? `${form.value}%` : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(form.value) },
        ] : confirmation?.discount ? [{ label: 'Kode', value: confirmation.discount.code }, { label: 'Status baru', value: confirmation.discount.is_active ? 'Nonaktif' : 'Aktif' }] : []}
        confirmLabel={confirmation?.type === 'create' ? 'Simpan diskon' : 'Ubah status'}
        tone={confirmation?.type === 'toggle' && confirmation?.discount?.is_active ? 'danger' : 'primary'}
        isLoading={saving || updatingId === confirmation?.discount?.id}
      />
    </div></div>
  )
}
