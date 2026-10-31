import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bicycle,
  CheckCircle,
  FileText,
  Headset,
  LockKey,
  Question,
  ShieldCheck,
  ShoppingBagOpen,
  Storefront,
} from '@phosphor-icons/react'
import Button from '../components/ui/Button'

const HELP_TOPICS = {
  'cara-belanja': {
    id: 'cara-belanja',
    title: 'Cara Belanja di SEAPEDIA',
    tag: 'Panduan Pembeli',
    icon: ShoppingBagOpen,
    summary: 'Langkah mudah menemukan produk lokal favorit, pembayaran instan via dompet digital, hingga pelacakan paket pesanan.',
    content: (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Alur Belanja Mudah & Cepat</h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Berbelanja di SEAPEDIA dirancang sederhana, transparan, dan aman untuk semua pengguna. Berikut tahapan lengkapnya:
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              step: '1',
              title: 'Cari & Pilih Produk',
              desc: 'Gunakan kolom pencarian di bagian atas atau jelajahi kategori seperti Alat Pancing, Budidaya, Akuarium, Biota Hidup, Hasil Laut, dan Kuliner Laut.',
            },
            {
              step: '2',
              title: 'Cek Detail & Masukkan Keranjang',
              desc: 'Pastikan membaca deskripsi barang, varian, stok, dan ulasan pembeli lain sebelum menekan tombol "Tambah ke Keranjang" atau "Beli Sekarang".',
            },
            {
              step: '3',
              title: 'Tentukan Alamat & Kurir',
              desc: 'Pilih alamat pengiriman Anda yang tersimpan atau tambahkan alamat baru. Sistem akan menghitung estimasi biaya antar secara transparan.',
            },
            {
              step: '4',
              title: 'Pembayaran Saldo Dompet Digital',
              desc: 'Konfirmasikan pembayaran instan menggunakan Saldo Dompet SEAPEDIA. Saldo dipotong otomatis dan pembayaran langsung terverifikasi seketika.',
            },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-700 text-sm font-black text-white">
                {item.step}
              </span>
              <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
          <h3 className="font-bold text-primary-950 flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary-700" />
            Jaminan Keamanan Belanja
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Dana pembayaran Anda aman di dalam sistem penampungan SEAPEDIA dan hanya akan diteruskan ke penjual setelah paket pesanan Anda terima dengan baik.
          </p>
        </div>

        <div className="pt-2">
          <Button as={Link} to="/products" rightIcon={<ArrowRight size={18} />}>
            Mulai Belanja Sekarang
          </Button>
        </div>
      </div>
    ),
  },

  'cara-jadi-penjual': {
    id: 'cara-jadi-penjual',
    title: 'Cara Menjadi Penjual di SEAPEDIA',
    tag: 'Panduan Mitra UMKM',
    icon: Storefront,
    summary: 'Buka toko online gratis, kelola katalog produk lokal Anda, dan jangkau ribuan pembeli tanpa biaya pendaftaran.',
    content: (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Buka Toko & Kembangkan Usaha Lokalmu</h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            SEAPEDIA mendukung penuh UMKM dan penjual lokal di seluruh Nusantara. Anda dapat membuka toko dan mulai berjualan dalam hitungan menit dari satu akun.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              num: 'Langkah 1',
              title: 'Daftar atau Masuk Akun SEAPEDIA',
              detail: 'Cukup gunakan satu akun SEAPEDIA. Jika Anda sudah mendaftar sebagai Pembeli, Anda dapat langsung mengaktifkan peran Penjual tanpa membuat email baru.',
            },
            {
              num: 'Langkah 2',
              title: 'Buka Menu Pengaturan & Isi Data Toko',
              detail: 'Buka menu Pengaturan Profil atau Dasbor Penjual. Masukkan nama toko Anda, deskripsi singkat usaha, nomor telepon kontak, dan alamat penjemputan barang.',
            },
            {
              num: 'Langkah 3',
              title: 'Unggah Produk Pertama Anda',
              detail: 'Tambahkan nama produk, deskripsi yang informatif, kategori yang tepat, harga, jumlah stok, dan foto produk yang jelas serta menarik.',
            },
            {
              num: 'Langkah 4',
              title: 'Terima & Proses Pesanan Masuk',
              detail: 'Setiap ada pembeli memesan produk Anda, status pesanan akan langsung muncul di Dasbor Penjual. Anda cukup mengemas barang dan menyerahkan ke mitra kurir.',
            },
            {
              num: 'Langkah 5',
              title: 'Pencairan Hasil Penjualan',
              detail: 'Setelah pesanan selesai diterima pembeli, saldo hasil penjualan langsung masuk ke dompet digital Anda dan dapat ditarik kapan saja ke rekening bank.',
            },
          ].map((step, idx) => (
            <div key={idx} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-100 font-bold text-orange-700 text-sm">
                {idx + 1}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{step.num}</span>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
            <p className="text-xs font-bold text-slate-500">Biaya Langganan</p>
            <p className="mt-1 text-lg font-black text-slate-900">Rp 0 (Gratis)</p>
            <p className="mt-1 text-xs text-slate-600">Tidak ada biaya bulanan atau pendaftaran.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
            <p className="text-xs font-bold text-slate-500">Dukungan Logistik</p>
            <p className="mt-1 text-lg font-black text-slate-900">Kurir Terintegrasi</p>
            <p className="mt-1 text-xs text-slate-600">Driver mengambil paket langsung ke tokomu.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
            <p className="text-xs font-bold text-slate-500">Pencairan Dana</p>
            <p className="mt-1 text-lg font-black text-slate-900">Instan & Transparan</p>
            <p className="mt-1 text-xs text-slate-600">Tarik saldo langsung ke rekeningmu.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button as={Link} to="/register" rightIcon={<ArrowRight size={18} />}>
            Daftar Jadi Penjual
          </Button>
          <Button as={Link} to="/login" variant="outline">
            Masuk ke Toko Saya
          </Button>
        </div>
      </div>
    ),
  },

  'cara-jadi-driver': {
    id: 'cara-jadi-driver',
    title: 'Cara Menjadi Driver Pengantar di SEAPEDIA',
    tag: 'Panduan Mitra Pengantar',
    icon: Bicycle,
    summary: 'Dapatkan penghasilan harian dengan mengantarkan pesanan belanja lokal di sekitarmu dengan jam kerja fleksibel.',
    content: (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gabung Jadi Mitra Pengantar Kilat SEAPEDIA</h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Mitra driver adalah urat nadi pengiriman lokal di SEAPEDIA. Nikmati komisi transparan per pesanan dan fleksibilitas mengatur waktu kerja sendiri.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="font-bold text-slate-900">Persyaratan Utama Mitra Driver:</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
            <li className="flex items-center gap-2.5">
              <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
              Warga Negara Indonesia (WNI), usia minimal 18 tahun.
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
              Memiliki kendaraan bermotor (sepeda motor) dalam kondisi layak dan aman.
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
              Memiliki Surat Izin Mengemudi (SIM C) yang masih aktif.
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
              Memiliki smartphone Android/iOS dengan koneksi internet aktif.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">Cara Kerja Pengantaran:</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: '1. Ambil Order',
                desc: 'Buka Dasbor Driver dan pantau daftar pesanan "Menunggu Kurir" di toko-toko sekitarmu.',
              },
              {
                step: '2. Jemput & Antar',
                desc: 'Konfirmasi penerimaan tugas, ambil paket di lokasi toko penjual, lalu antar ke alamat pembeli.',
              },
              {
                step: '3. Terima Komisi',
                desc: 'Begitu paket diserahkan dan selesai, ongkos kirim langsung tercatat masuk ke saldo dompet Anda.',
              },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card-sm">
                <span className="inline-block rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  {card.step}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button as={Link} to="/register" rightIcon={<ArrowRight size={18} />}>
            Daftar Menjadi Driver
          </Button>
        </div>
      </div>
    ),
  },

  'kebijakan-privasi': {
    id: 'kebijakan-privasi',
    title: 'Kebijakan Privasi & Perlindungan Data',
    tag: 'Kebijakan Hukum',
    icon: LockKey,
    summary: 'Komitmen SEAPEDIA dalam menjaga kerahasiaan, integritas, dan keamanan informasi pribadi seluruh pengguna.',
    content: (
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Komitmen Privasi SEAPEDIA</h2>
          <p className="mt-2 text-slate-600">
            Terakhir diperbarui: Oktober 2026. Kami menghargai dan melindungi hak privasi setiap pengguna yang mengakses platform SEAPEDIA.
          </p>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card-sm">
          <div>
            <h3 className="font-bold text-slate-900 text-base">1. Informasi yang Kami Kumpulkan</h3>
            <p className="mt-1.5 text-slate-600">
              Kami mengumpulkan informasi yang Anda berikan saat mendaftar, seperti nama lengkap, alamat email, kata sandi terenkripsi, alamat pengiriman, nomor telepon, dan data transaksi dompet.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">2. Tujuan Penggunaan Informasi</h3>
            <p className="mt-1.5 text-slate-600">
              Informasi digunakan untuk: (a) Memproses transaksi belanja dan pesanan antar, (b) Verifikasi akun dan pencegahan penipuan, (c) Komunikasi status transaksi dan pembaruan layanan, (d) Memenuhi kewajiban hukum yang berlaku di Indonesia.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">3. Kerahasiaan & Tidak Ada Penjualan Data</h3>
            <p className="mt-1.5 text-slate-600">
              SEAPEDIA tidak pernah dan tidak akan menjual, menyewakan, atau memperdagangkan data pribadi pengguna kepada pihak ketiga mana pun untuk tujuan periklanan atau pemasaran tanpa persetujuan Anda.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">4. Enkripsi dan Keamanan Standar Tinggi</h3>
            <p className="mt-1.5 text-slate-600">
              Kata sandi disimpan sebagai hash bcrypt. HTTPS perlu dikonfigurasi pada layanan hosting sebelum aplikasi digunakan secara publik; tidak ada sertifikasi keamanan khusus yang diklaim oleh proyek demo ini.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">5. Hak Pengguna atas Data</h3>
            <p className="mt-1.5 text-slate-600">
              Anda berhak melihat, memperbarui profil, mengubah alamat, atau mengajukan permohonan penonaktifan akun secara permanen melalui menu Pengaturan Akun atau menghubungi tim bantuan kami.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  'syarat-ketentuan': {
    id: 'syarat-ketentuan',
    title: 'Syarat & Ketentuan Penggunaan',
    tag: 'Ketentuan Layanan',
    icon: FileText,
    summary: 'Aturan dan tata tertib bertransaksi di SEAPEDIA untuk menjaga ekosistem belanja yang adil, jujur, dan aman.',
    content: (
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ketentuan Layanan SEAPEDIA</h2>
          <p className="mt-2 text-slate-600">
            Dengan menggunakan platform SEAPEDIA, Anda menyetujui seluruh ketentuan dan pedoman transaksi berikut.
          </p>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card-sm">
          <div>
            <h3 className="font-bold text-slate-900 text-base">1. Ketentuan Akun Pengguna</h3>
            <p className="mt-1.5 text-slate-600">
              Pengguna wajib memberikan identitas yang jujur dan bertanggung jawab penuh atas keamanan kredensial akun masing-masing. Dilarang keras menyalahgunakan akun untuk tindakan melanggar hukum.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">2. Kebijakan Produk & Penjualan</h3>
            <p className="mt-1.5 text-slate-600">
              Penjual dilarang memajang barang tiruan/palsu, narkotika, senjata, barang curian, atau produk yang melanggar hak cipta. Penjual wajib mencantumkan stok riil dan harga jujur tanpa markup palsu.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">3. Alur Pembayaran & Saldo Dompet</h3>
            <p className="mt-1.5 text-slate-600">
              Pembayaran menggunakan saldo simulasi di database. Top-up, pemotongan saldo, dan refund ditujukan untuk demonstrasi alur aplikasi; tidak ada transfer uang atau rekening escrow nyata.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">4. Pembatalan & Pengembalian Dana (*Refund*)</h3>
            <p className="mt-1.5 text-slate-600">
              Jika pesanan dibatalkan sebelum diproses atau barang terbukti rusak/tidak sesuai dengan bukti yang sah, dana akan dikembalikan penuh 100% ke saldo dompet pembeli seketika.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">5. Tanggung Jawab Pengantaran</h3>
            <p className="mt-1.5 text-slate-600">
              Mitra kurir wajib menjaga keutuhan paket dan mengantarkan sesuai instruksi alamat. Pembeli wajib memastikan adanya penerima di alamat tujuan saat kurir tiba.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  'keamanan-data': {
    id: 'keamanan-data',
    title: 'Keamanan Data & Sistem Transaksi',
    tag: 'Infrastruktur Keamanan',
    icon: ShieldCheck,
    summary: 'Bagaimana SEAPEDIA melindungi akun, saldo dompet, dan integritas setiap transaksi dari risiko siber.',
    content: (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Arsitektur Keamanan Multi-Lapis</h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            SEAPEDIA mendemonstrasikan autentikasi, pembatasan akses per peran, dan konsistensi transaksi database. Saldo serta pembayaran di aplikasi ini bersifat simulasi.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Proteksi Transaksi Bersamaan (Concurrency Control)',
              desc: 'Checkout memeriksa stok dan saldo dalam transaksi database dengan penguncian baris pada database yang mendukungnya. Beban ribuan pengguna belum diuji.',
            },
            {
              title: 'Idempotency Key Protection',
              desc: 'Setiap transaksi memiliki token unik. Menekan tombol submit berulang kali tidak akan menduplikasi order atau mendebet saldo Anda dua kali.',
            },
            {
              title: 'Dialog Konfirmasi Dua Langkah',
              desc: 'Setiap aksi penting (checkout pesanan, top-up saldo, kirim ulasan, upgrade role) dilengkapi jendela konfirmasi rincian untuk mencegah salah klik.',
            },
            {
              title: 'Isolasi Hak Akses Multi-Role',
              desc: 'Backend memeriksa peran aktif dan kepemilikan resource sebelum mengizinkan tindakan Pembeli, Penjual, Driver, atau Admin.',
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-800 font-black text-sm">
                ✓
              </span>
              <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="font-bold text-slate-900">Tips Keamanan untuk Pengguna:</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Jangan pernah membagikan password atau kredensial akun kepada siapa pun.</li>
            <li>• Selalu lakukan transaksi hanya di dalam aplikasi resmi SEAPEDIA.</li>
            <li>• Gunakan data percobaan saat menjelajahi proyek demo ini.</li>
          </ul>
        </div>
      </div>
    ),
  },

  faq: {
    id: 'faq',
    title: 'Pusat Bantuan & Tanya Jawab (FAQ)',
    tag: 'Bantuan Pengguna',
    icon: Question,
    summary: 'Jawaban atas pertanyaan yang paling sering diajukan seputar berbelanja, saldo dompet, jualan, dan pengantaran.',
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pertanyaan Umum (FAQ)</h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Temukan solusi cepat untuk pertanyaan seputar penggunaan platform SEAPEDIA.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Bagaimana cara mengisi ulang (top-up) saldo dompet?',
              a: 'Masuk ke Dasbor Pembeli lalu pilih menu "Dompet Digital". Masukkan jumlah nominal yang Anda inginkan (misal Rp 100.000) dan konfirmasikan pengisian. Saldo akan langsung bertambah seketika.',
            },
            {
              q: 'Apakah satu akun bisa berbelanja sekaligus berjualan?',
              a: 'Ya, tentu saja! SEAPEDIA mendukung sistem multi-role. Satu akun dapat memiliki peran Pembeli dan Penjual secara bersamaan. Anda dapat berganti peran secara instan dari menu profil di pojok kanan atas.',
            },
            {
              q: 'Berapa lama estimasi pengantaran pesanan?',
              a: 'Untuk pengiriman lokal dengan kurir instan SEAPEDIA, pesanan umumnya sampai dalam 1 hingga 3 jam setelah penjual selesai mengemas barang.',
            },
            {
              q: 'Bagaimana jika pesanan yang saya terima rusak atau tidak sesuai?',
              a: 'Jangan konfirmasi pesanan selesai terlebih dahulu. Anda dapat menghubungi penjual atau tim bantuan untuk pengembalian barang atau pengembalian saldo (refund) 100%.',
            },
            {
              q: 'Bagaimana cara menghubungi tim layanan pelanggan?',
              a: 'SEAPEDIA saat ini merupakan proyek demo dan portofolio. Panduan di halaman ini membantu mencoba fiturnya; belum ada kantor operasional atau layanan pelanggan komersial.',
            },
          ].map((item, idx) => (
            <details key={idx} className="group rounded-2xl border border-slate-200 bg-white p-5 open:bg-slate-50 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 focus:outline-none">
                <span>{item.q}</span>
                <span className="ml-4 text-primary-700 font-black group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 pt-2 border-t border-slate-100">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="rounded-2xl bg-primary-950 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Masih Butuh Bantuan Lain?</h3>
            <p className="mt-1 text-sm text-blue-200">Gunakan panduan untuk mencoba alur belanja, penjualan, dan pengantaran pada proyek demo ini.</p>
          </div>
          <Button as={Link} to="/products" variant="secondary" className="!bg-white !text-primary-950 font-bold shrink-0">
            Jelajahi Katalog Demo
          </Button>
        </div>
      </div>
    ),
  },
}

export default function HelpInfoPage() {
  const { topic } = useParams()
  const navigate = useNavigate()

  // Default to cara-belanja if no topic or invalid topic
  const currentKey = topic && HELP_TOPICS[topic] ? topic : 'cara-belanja'
  const activeTopic = HELP_TOPICS[currentKey]
  const Icon = activeTopic.icon

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentKey])

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-14">
      <div className="page-shell">
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>

        {/* Page Container */}
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">

          {/* Left Navigation Sidebar */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-card-sm lg:sticky lg:top-24">
            <div className="px-3 py-2 border-b border-slate-100 mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pusat Informasi & Bantuan</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">Topik Bantuan</p>
            </div>

            <nav className="space-y-1" aria-label="Daftar Topik Bantuan">
              {Object.values(HELP_TOPICS).map((item) => {
                const ItemIcon = item.icon
                const isActive = item.id === currentKey
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(`/help/${item.id}`)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-primary-900 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-primary-950'
                    }`}
                  >
                    <ItemIcon size={18} weight={isActive ? 'fill' : 'regular'} className="shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-6 border-t border-slate-100 p-3 text-xs text-slate-500">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Headset size={15} className="text-cyan-600" /> Butuh bantuan langsung?
              </p>
              <p className="mt-1 text-slate-500">Panduan ini mendampingi penggunaan proyek demo SEAPEDIA.</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <section aria-label={activeTopic.title} className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-card">
            {/* Header */}
            <div className="border-b border-slate-100 pb-7">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-800">
                  <Icon size={14} weight="duotone" />
                  {activeTopic.tag}
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {activeTopic.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {activeTopic.summary}
              </p>
            </div>

            {/* Dynamic Content Body */}
            <div className="pt-7">
              {activeTopic.content}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
