import PropTypes from 'prop-types'

/**
 * SEAPEDIA BrandMark
 *
 * Menggunakan logo resmi SEAPEDIA:
 * - Wordmark SEAPEDIA dengan ikon perahu layar (sailboat) pada huruf 'A',
 *   ombak samudera mengalir pada huruf 'S', kanopi toko pada huruf 'I',
 *   dan aksen ombak bahari pada 'A' akhir.
 * - Versi standar (ocean blue) untuk navbar & halaman login/register.
 * - Versi inverse (putih bersih) untuk footer gelap & permukaan dark-mode.
 */
export default function BrandMark({ compact = false, inverse = false, className = '' }) {
  if (compact) {
    return (
      <img
        src="/favicon.png"
        alt="SEAPEDIA"
        width={36}
        height={36}
        className={`inline-block h-8 w-8 object-contain transition-transform duration-200 hover:scale-105 select-none ${className}`}
        loading="eager"
      />
    )
  }

  const logoSrc = inverse ? '/logo-seapedia-white.png' : '/logo-seapedia.png'

  return (
    <img
      src={logoSrc}
      alt="SEAPEDIA"
      width={190}
      height={38}
      className={`inline-block h-8 sm:h-[34px] w-auto max-w-[160px] sm:max-w-[185px] object-contain transition-transform duration-200 group-hover:scale-105 select-none ${className}`}
      loading="eager"
    />
  )
}

BrandMark.propTypes = {
  compact: PropTypes.bool,
  inverse: PropTypes.bool,
  className: PropTypes.string,
}
