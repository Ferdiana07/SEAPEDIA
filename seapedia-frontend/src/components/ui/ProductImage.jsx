import { useEffect, useState } from 'react'
import { Package } from '@phosphor-icons/react'

export default function ProductImage({ src, alt, className = '', iconSize = 40, fallbackIcon: FallbackIcon = Package }) {
  const [failed, setFailed] = useState(false)
  const isLegacyPlaceholder = typeof src === 'string' && src.includes('via.placeholder.com')

  useEffect(() => setFailed(false), [src])

  if (!src || failed || isLegacyPlaceholder) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-primary-50 px-3 text-center text-primary-700 ${className}`} role="img" aria-label={`Gambar ${alt} belum tersedia`}>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-card">
          <FallbackIcon size={iconSize} weight="duotone" />
        </span>
        <span className="text-[11px] font-semibold text-primary-700">Foto belum tersedia</span>
      </div>
    )
  }

  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
}
