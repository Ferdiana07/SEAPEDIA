# SEAPEDIA

SEAPEDIA adalah marketplace bahari full-stack multi-role yang menghubungkan Pembeli, Penjual, Driver, dan Admin dalam satu alur transaksi yang dapat diaudit. Katalognya mencakup alat pancing, budidaya, pakan, akuarium, biota hasil budidaya, tanaman laut, hasil laut, dan kuliner laut. Proyek ini berawal dari brief kompetisi, lalu dikembangkan sebagai proyek portofolio dengan fokus pada aturan bisnis nyata, keamanan transaksi, test otomatis, dan UI responsif.

## Sorotan produk

- Katalog bahari publik dengan 16 fixture realistis, foto WebP lokal, pencarian, filter kategori/harga, detail produk, dan halaman toko.
- Satu akun dapat memiliki beberapa role dengan role aktif yang diverifikasi backend.
- Buyer: wallet simulasi, alamat, cart satu toko, quote checkout, voucher/promo, ongkir, PPN 12%, order timeline, cancel, dan refund.
- Seller: profil toko, CRUD produk, upload/preview foto produk, stok, pesanan masuk, dan laporan pendapatan selesai.
- Driver: job tersedia, pickup atomik, complete/return, riwayat, dan ringkasan penghasilan.
- Admin: statistik marketplace, pencarian pengguna, monitoring order/stok/pengantaran, promo, serta simulasi overdue SLA.
- Ulasan aplikasi publik dan ulasan produk terautentikasi dipisahkan sebagai domain berbeda.
- Demo account satu klik tersedia hanya pada development mode.

## Stack

| Area | Teknologi |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Zustand, Axios, Tailwind CSS 4, Phosphor Icons |
| Backend | Laravel 12, Sanctum, Eloquent ORM |
| Database | SQLite untuk development/test, PostgreSQL untuk production |
| Media | Laravel Filesystem; local public disk atau S3-compatible object storage |
| Quality | PHPUnit feature tests, Laravel Pint, ESLint, Playwright E2E |

## Arsitektur singkat

Frontend dan backend berada dalam dua aplikasi terpisah. Vite meneruskan request `/api` ke Laravel pada `localhost:8000`. Bearer token Sanctum disimpan oleh auth store, sedangkan semua otorisasi penting tetap diverifikasi di backend.

Checkout, refund, pickup Driver, dan transisi penting memakai database transaction serta row lock. Setiap perubahan status order dicatat pada `order_status_histories` dengan aktor dan waktu. Detail keputusan teknis tersedia di [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Menjalankan secara lokal

Prasyarat: PHP 8.2+, Composer, Node.js 20+, npm, dan ekstensi SQLite PHP.

### 1. Backend

```powershell
cd seapedia-backend
composer install
Copy-Item .env.example .env
php artisan key:generate
if (-not (Test-Path database/database.sqlite)) { New-Item database/database.sqlite -ItemType File }
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

### 2. Frontend

Buka terminal kedua dari root proyek:

```powershell
cd seapedia-frontend
npm install
npm run dev -- --host 127.0.0.1
```

Buka `http://127.0.0.1:5173`. Vite proxy sudah diarahkan ke API Laravel.

## Akun demo

Semua akun memakai password `password123`.

| Role | Email | Tujuan demo |
|---|---|---|
| Buyer | `ani@seapedia.com` | Wallet, alamat, cart, checkout, dan order |
| Seller | `budi@seapedia.com` | Toko, produk, stok, pesanan, dan income |
| Driver | `caca@seapedia.com` | Job, pickup, complete/return, dan earning |
| Admin | `admin@seapedia.com` | Monitoring, pengguna, promo, dan overdue |
| Multi-role | `fika@seapedia.com` | Pemilihan dan perpindahan role Buyer/Seller |

Panel akun demo tampil otomatis pada halaman login saat menjalankan `npm run dev`, dan disembunyikan pada production build. Skenario demonstrasi lengkap ada di [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md).

## Quality gate

```powershell
cd seapedia-backend
php artisan test --compact
vendor\bin\pint --test
composer audit --locked

cd ..\seapedia-frontend
npm run lint
npm run build
npm run test:e2e
npm audit
```

Checkpoint terverifikasi 18 Oktober 2026:

- Backend: 20 test, 135 assertion lulus.
- Frontend: ESLint tanpa error/warning dan production build lulus.
- E2E: 10 smoke test lulus untuk public flow, mobile navigation, invalid login, konfirmasi checkout, preview upload Seller, dan seluruh akun demo.
- Dependency audit penuh: 0 advisory pada Composer dan npm.
- Visual QA: desktop dan mobile 390 px lulus untuk Home; dashboard utama seluruh role diperiksa pada desktop.

## Dokumentasi

- [Product specification](docs/PRODUCT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API OpenAPI](docs/OPENAPI.yaml)
- [Demo guide](docs/DEMO_GUIDE.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Quality gate](docs/QUALITY.md)
- [Progress dan handoff](docs/PROGRESS.md)
- [Roadmap](docs/ROADMAP.md)

## Catatan ruang lingkup

Payment gateway, GPS real-time, dan settlement eksternal sengaja tidak diintegrasikan. Wallet top-up dan time simulation adalah mekanisme demo yang membuat lifecycle transaksi dapat diperiksa secara deterministik. Source of truth produk berada di `docs/PRODUCT_SPEC.md`; PDF kompetisi tetap disimpan sebagai referensi asal.

## Lisensi

Proyek ini dibuat untuk pembelajaran dan portofolio. Gunakan atau adaptasi source code dengan tetap mencantumkan atribusi yang layak.
