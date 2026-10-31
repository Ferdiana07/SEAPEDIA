import { useEffect, useState } from 'react'
import { ChatCircleText, Star } from '@phosphor-icons/react'
import applicationReviewService from '../../services/applicationReviewService'
import useUIStore from '../../stores/uiStore'
import Button from '../ui/Button'

export default function ApplicationReviews() {
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ reviewer_name: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useUIStore()

  const loadReviews = async () => {
    const response = await applicationReviewService.getAll({ per_page: 6 })
    setReviews(response.data)
  }

  useEffect(() => {
    let active = true
    applicationReviewService.getAll({ per_page: 6 })
      .then((response) => { if (active) setReviews(response.data) })
      .catch(() => { if (active) setReviews([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await applicationReviewService.create(form)
      setForm({ reviewer_name: '', rating: 5, comment: '' })
      success('Terima kasih. Ulasanmu sudah ditambahkan.')
      await loadReviews()
    } catch (error) {
      showError(error.response?.data?.message || 'Ulasan belum dapat dikirim.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section-space bg-slate-50" aria-labelledby="review-heading">
      <div className="page-shell grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
        <div>
          <ChatCircleText size={36} weight="duotone" className="text-primary-700" />
          <h2 id="review-heading" className="mt-5 max-w-xl text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Apa Kata Komunitas SEAPEDIA?</h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">Pengalaman nyata dari para pembeli, pemilik toko lokal, dan mitra pengantar yang menggunakan SEAPEDIA setiap hari.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {loading && Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 animate-pulse rounded-2xl bg-white" />)}
            {!loading && reviews.length === 0 && <p className="rounded-2xl border border-slate-300 p-5 text-sm text-slate-600 sm:col-span-2">Belum ada ulasan publik. Jadilah yang pertama memberikan masukan tentang pengalamanmu.</p>}
            {!loading && reviews.slice(0, 4).map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div role="img" className="flex gap-1 text-warning-500" aria-label={`${review.rating} dari 5 bintang`}>
                  {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={15} weight="fill" />)}
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                <p className="mt-4 text-sm font-bold text-ink">{review.reviewer_name}</p>
              </article>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="self-start rounded-3xl border border-slate-200/80 bg-white p-6 text-ink shadow-card sm:p-8">
          <h3 className="text-xl font-extrabold">Bagikan Pengalamanmu</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Ceritakan kesan dan pengalaman bertransaksi dalam ekosistem SEAPEDIA.</p>
          <label className="mt-6 block text-sm font-bold" htmlFor="reviewer_name">Nama Lengkap</label>
          <input id="reviewer_name" className="input mt-2" value={form.reviewer_name} onChange={(event) => setForm({ ...form, reviewer_name: event.target.value })} required minLength={2} maxLength={100} placeholder="Contoh: Budi Santoso" />
          <label className="mt-4 block text-sm font-bold" htmlFor="rating">Penilaian Layanan</label>
          <select id="rating" className="input mt-2" value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} Bintang ({rating === 5 ? 'Sangat Puas' : rating === 4 ? 'Puas' : rating === 3 ? 'Cukup' : 'Kurang'})</option>)}
          </select>
          <label className="mt-4 block text-sm font-bold" htmlFor="comment">Ulasan & Masukan</label>
          <textarea id="comment" className="input mt-2 min-h-28 resize-y" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} required minLength={10} maxLength={1000} placeholder="Tuliskan pengalamanmu berbelanja atau berjualan di SEAPEDIA..." />
          <Button className="mt-5 w-full" type="submit" isLoading={submitting}>Kirim Ulasan Publik</Button>
        </form>
      </div>
    </section>
  )
}
