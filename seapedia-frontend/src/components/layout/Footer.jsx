import { Link } from 'react-router-dom'
import {
  CheckCircle,
  EnvelopeSimple,
  Headset,
  LockKey,
  MapPin,
  ShieldCheck,
} from '@phosphor-icons/react'
import BrandMark from '../ui/BrandMark'

const FOOTER_CATEGORIES = [
  { label: 'Semua Produk', to: '/products' },
  { label: 'Alat Pancing', to: '/products?category=Alat%20Pancing' },
  { label: 'Budidaya', to: '/products?category=Budidaya' },
  { label: 'Pakan Ikan', to: '/products?category=Pakan' },
  { label: 'Akuarium Laut', to: '/products?category=Akuarium' },
  { label: 'Biota Hidup', to: '/products?category=Biota%20Hidup' },
  { label: 'Tanaman Laut', to: '/products?category=Tanaman%20Laut' },
  { label: 'Hasil Laut Segar', to: '/products?category=Hasil%20Laut' },
  { label: 'Kuliner Laut', to: '/products?category=Kuliner%20Laut' },
]

const FOOTER_ACCOUNT = [
  { label: 'Masuk', to: '/login' },
  { label: 'Daftar gratis', to: '/register' },
  { label: 'Dasbor pembeli', to: '/buyer/dashboard' },
  { label: 'Kelola toko', to: '/seller/dashboard' },
  { label: 'Dasbor driver', to: '/driver/dashboard' },
  { label: 'Dompet digital', to: '/buyer/wallet' },
]

const FOOTER_HELP = [
  { label: 'Cara belanja', to: '/help/cara-belanja' },
  { label: 'Cara jadi penjual', to: '/help/cara-jadi-penjual' },
  { label: 'Cara jadi driver', to: '/help/cara-jadi-driver' },
  { label: 'Kebijakan privasi', to: '/help/kebijakan-privasi' },
  { label: 'Syarat & ketentuan', to: '/help/syarat-ketentuan' },
  { label: 'Pusat bantuan', to: '/help/faq' },
]

export default function Footer() {
  return (
    <footer className="border-t border-primary-950 bg-primary-950 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Navigasi Footer SEAPEDIA</h2>

      {/* Main footer content */}
      <div className="page-shell py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]">

          {/* Brand info & trust summary */}
          <div className="space-y-6">
            <Link to="/" aria-label="Beranda SEAPEDIA" className="inline-block">
              <BrandMark inverse />
            </Link>

            <p className="max-w-sm text-sm leading-6 text-blue-100/80">
              Marketplace bahari Indonesia yang menghubungkan pembeli, usaha pesisir, dan pengantar dalam satu ekosistem yang transparan dan mudah digunakan.
            </p>

            {/* Security Badges with informative links */}
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/help/keamanan-data"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-sm transition-colors hover:border-emerald-300 hover:text-white"
                title="Pelajari sistem proteksi keamanan data SEAPEDIA"
              >
                <LockKey size={14} weight="bold" /> SSL Aman 256-bit
              </Link>
              <Link
                to="/help/keamanan-data"
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/30 bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-sm transition-colors hover:border-blue-300 hover:text-white"
                title="Pelajari enkripsi database dan transaksi SEAPEDIA"
              >
                <ShieldCheck size={14} weight="bold" /> Data Terenkripsi
              </Link>
              <Link
                to="/help/keamanan-data"
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-sm transition-colors hover:border-cyan-300 hover:text-white"
                title="Pelajari jaminan escrow dan proteksi transaksi SEAPEDIA"
              >
                <CheckCircle size={14} weight="bold" /> Transaksi Terlindungi
              </Link>
            </div>

            {/* Office & Customer Support */}
            <div className="space-y-2 border-t border-white/10 pt-5 text-xs text-blue-200/80">
              <Link to="/help/faq" className="flex items-center gap-2 hover:text-white transition-colors">
                <MapPin size={15} className="text-cyan-400 shrink-0" />
                <span>Gedung Bahari Nusantara, Jakarta Pusat, Indonesia</span>
              </Link>
              <Link to="/help/faq" className="flex items-center gap-2 hover:text-white transition-colors">
                <Headset size={15} className="text-cyan-400 shrink-0" />
                <span>Layanan Pelanggan: Senin - Minggu (08:00 - 21:00 WIB)</span>
              </Link>
              <a href="mailto:support@seapedia.id" className="flex items-center gap-2 hover:text-white transition-colors">
                <EnvelopeSimple size={15} className="text-cyan-400 shrink-0" />
                <span>Bantuan: support@seapedia.id</span>
              </a>
            </div>
          </div>

          {/* Belanja Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Belanja</h3>
            <nav className="mt-4 grid gap-2.5 text-sm" aria-label="Navigasi Belanja">
              {FOOTER_CATEGORIES.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-blue-100/75 transition-colors hover:text-white hover:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Akun Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Akun</h3>
            <nav className="mt-4 grid gap-2.5 text-sm" aria-label="Navigasi Akun">
              {FOOTER_ACCOUNT.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-blue-100/75 transition-colors hover:text-white hover:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Bantuan Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Bantuan</h3>
            <nav className="mt-4 grid gap-2.5 text-sm" aria-label="Navigasi Bantuan">
              {FOOTER_HELP.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-blue-100/75 transition-colors hover:text-white hover:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

        </div>

        {/* Copyright & Legal Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-blue-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SEAPEDIA. Seluruh hak cipta dilindungi undang-undang Republik Indonesia.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link to="/help/syarat-ketentuan" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            <span className="text-white/20">•</span>
            <Link to="/help/kebijakan-privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <span className="text-white/20">•</span>
            <Link to="/help/keamanan-data" className="hover:text-white transition-colors">Keamanan Data</Link>
            <span className="text-white/20">•</span>
            <span className="text-blue-400 font-semibold">Dibuat untuk UMKM Nusantara 🇮🇩</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
