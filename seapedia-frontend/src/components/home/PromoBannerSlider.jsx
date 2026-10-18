import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  Fire,
  Lightning,
  Sparkle,
  Tag,
} from '@phosphor-icons/react'
import Button from '../ui/Button'

const BANNERS = [
  {
    id: 1,
    badge: 'MULAI PETUALANGAN PESISIR',
    badgeIcon: Fire,
    badgeColor: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
    title: 'Perlengkapan Pancing Laut Diskon s.d 25%',
    subtitle: 'Joran pantai, reel tahan korosi, tackle box, dan rompi praktis untuk menyiapkan perjalanan memancing berikutnya.',
    cta: 'Lihat Alat Pancing',
    link: '/products?category=Alat%20Pancing',
    image: '/images/products/set-pancing-pantai.webp',
    accentGradient: 'from-amber-400 to-orange-400',
    bgGradient: 'from-primary-950 via-primary-900 to-amber-950/40',
  },
  {
    id: 2,
    badge: 'SOLUSI BUDIDAYA PESISIR',
    badgeIcon: Lightning,
    badgeColor: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300',
    title: 'Peralatan Andal untuk Tambak yang Terukur',
    subtitle: 'Kincir aerator, jaring keramba apung, pakan bergizi, dan sensor air untuk menjaga produktivitas budidaya pesisir.',
    cta: 'Kebutuhan Budidaya',
    link: '/products?category=Budidaya',
    image: '/images/products/aerator-kolam.webp',
    accentGradient: 'from-cyan-300 to-blue-400',
    bgGradient: 'from-primary-950 via-slate-900 to-blue-950/70',
  },
  {
    id: 3,
    badge: 'BANGUN DUNIA BAWAH AIR',
    badgeIcon: Sparkle,
    badgeColor: 'border-indigo-400/30 bg-indigo-500/10 text-indigo-300',
    title: 'Mulai Akuarium Laut dengan Peralatan Tepat',
    subtitle: 'Starter kit nano reef, pasir aragonit, pencahayaan, dan filtrasi pilihan untuk ekosistem yang lebih stabil.',
    cta: 'Jelajahi Akuarium',
    link: '/products?category=Akuarium',
    image: '/images/products/akuarium-nano-reef.webp',
    accentGradient: 'from-sky-300 to-indigo-300',
    bgGradient: 'from-primary-950 via-indigo-950/60 to-primary-900',
  },
  {
    id: 4,
    badge: 'RASA SEGAR DARI PESISIR',
    badgeIcon: Tag,
    badgeColor: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    title: 'Hasil Laut Segar hingga Siap Santap',
    subtitle: 'Pilih bahan berantai dingin atau menu laut yang dimasak setelah pesanan diterima, langsung dari mitra pesisir.',
    cta: 'Pilih Kuliner Laut',
    link: '/products?category=Kuliner%20Laut',
    image: '/images/products/rice-bowl-tuna.webp',
    accentGradient: 'from-teal-300 to-emerald-300',
    bgGradient: 'from-primary-950 via-slate-900 to-teal-950/40',
  },
]

export default function PromoBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)
  }, [])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Auto-play loop every 4.5 seconds
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 4500)
    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide()
      else prevSlide()
    }
  }

  return (
    <section
      className="page-shell pt-12 pb-4 sm:pt-14 sm:pb-6"
      aria-label="Promo & Banner Pilihan SEAPEDIA"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-primary-950 shadow-2xl">

        {/* Carousel Slides Track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner) => {
            const BadgeIcon = banner.badgeIcon
            return (
              <div
                key={banner.id}
                className={`relative min-w-full flex-shrink-0 bg-gradient-to-r ${banner.bgGradient} p-7 sm:p-10 lg:p-14`}
              >
                {/* Background ambient lighting */}
                <div
                  className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
                  {/* Left Column: Copy & Actions */}
                  <div className="z-10 max-w-xl">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wide backdrop-blur-md ${banner.badgeColor}`}
                    >
                      <BadgeIcon size={14} weight="fill" />
                      {banner.badge}
                    </span>

                    <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                      {banner.title.split('Diskon')[0]}
                      {banner.title.includes('Diskon') && (
                        <span className={`bg-gradient-to-r ${banner.accentGradient} bg-clip-text text-transparent`}>
                          Diskon{banner.title.split('Diskon')[1]}
                        </span>
                      )}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">
                      {banner.subtitle}
                    </p>

                    <div className="mt-7 flex items-center gap-4">
                      <Button
                        as={Link}
                        to={banner.link}
                        size="md"
                        variant="secondary"
                        className="!bg-white !text-primary-950 font-extrabold hover:!bg-blue-50 shadow-md hover:shadow-lg transition-all"
                        rightIcon={<ArrowRight size={17} weight="bold" />}
                      >
                        {banner.cta}
                      </Button>
                      <Link
                        to="/products"
                        className="text-xs sm:text-sm font-semibold text-blue-200 hover:text-white transition-colors"
                      >
                        Lihat Semua Promo
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Visual Showcase */}
                  <div className="relative hidden sm:block">
                    <div className="relative mx-auto aspect-[16/10] max-w-md overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur-sm">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                      {/* Gradient overlay on image */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Arrow Left */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Banner sebelumnya"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-primary-950/60 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary-950 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <CaretLeft size={20} weight="bold" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Banner selanjutnya"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-primary-950/60 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-primary-950 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <CaretRight size={20} weight="bold" />
        </button>

        {/* Bottom Pagination Dots / Pill Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {BANNERS.map((banner, index) => {
            const isActive = index === currentIndex
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Pindah ke banner ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'w-7 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            )
          })}
        </div>

      </div>
    </section>
  )
}
