import {
  AnchorSimple,
  Basket,
  BowlFood,
  Fish,
  FishSimple,
  Grains,
  Plant,
  SquaresFour,
  Waves,
} from '@phosphor-icons/react'

const normalizeCategoryKey = (value = '') => {
  const category = String(value).toLowerCase().trim()

  if (!category || category === 'all' || category === 'semua') return 'all'
  if (category.includes('pancing')) return 'alat-pancing'
  if (category.includes('budi') || category.includes('tambak')) return 'budidaya'
  if (category.includes('pakan') || category.includes('pelet')) return 'pakan'
  if (category.includes('akuarium') || category.includes('aquarium')) return 'akuarium'
  if (category.includes('biota') || category.includes('hidup')) return 'biota-hidup'
  if (category.includes('tanaman') || category.includes('caulerpa') || category.includes('alga')) return 'tanaman-laut'
  if (category.includes('hasil') || category.includes('segar')) return 'hasil-laut'
  if (category.includes('kuliner') || category.includes('olahan') || category.includes('masak')) return 'kuliner-laut'

  return 'all'
}

const CATEGORY_THEMES = {
  all: { label: 'Semua Kategori', icon: SquaresFour, badge: 'bg-slate-100 text-slate-700' },
  'alat-pancing': { label: 'Alat Pancing', icon: AnchorSimple, badge: 'bg-sky-50 text-sky-700' },
  budidaya: { label: 'Budidaya', icon: Waves, badge: 'bg-teal-50 text-teal-700' },
  pakan: { label: 'Pakan', icon: Grains, badge: 'bg-amber-50 text-amber-700' },
  akuarium: { label: 'Akuarium', icon: Fish, badge: 'bg-cyan-50 text-cyan-700' },
  'biota-hidup': { label: 'Biota Hidup', icon: FishSimple, badge: 'bg-orange-50 text-orange-700' },
  'tanaman-laut': { label: 'Tanaman Laut', icon: Plant, badge: 'bg-emerald-50 text-emerald-700' },
  'hasil-laut': { label: 'Hasil Laut', icon: Basket, badge: 'bg-rose-50 text-rose-700' },
  'kuliner-laut': { label: 'Kuliner Laut', icon: BowlFood, badge: 'bg-violet-50 text-violet-700' },
}

export default function CategoryIcon({ category, className = 'h-10 w-10', variant = 'badge' }) {
  const key = normalizeCategoryKey(category)
  const theme = CATEGORY_THEMES[key] || CATEGORY_THEMES.all
  const Icon = theme.icon

  if (variant === 'icon') {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center ${className}`} aria-hidden="true">
        <Icon className="h-full w-full" weight="regular" />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${theme.badge} ${className}`}
      aria-hidden="true"
    >
      <Icon className="h-[58%] w-[58%]" weight="regular" />
    </span>
  )
}
