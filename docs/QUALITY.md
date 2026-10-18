# Quality Gate

Tanggal verifikasi terakhir: 2026-10-18.

## Commands

### Backend

```powershell
cd seapedia-backend
php artisan test --compact
vendor\bin\pint --test
composer audit --locked --no-interaction
php artisan route:list --path=api
```

### Frontend

```powershell
cd seapedia-frontend
npm run lint
npm run build
npm run test:e2e
npm audit
```

### OpenAPI

```powershell
npx --yes @redocly/cli@2.3.0 lint docs/OPENAPI.yaml
```

OpenAPI valid. Recommended Redocly rules memberi warning dokumentasi gaya karena kontrak sengaja tidak memakai `operationId` dan tidak menambahkan respons 4xx generik pada setiap operasi read-only; tidak ada schema error.

## Hasil terakhir (Upload foto produk Seller - 2026-10-18)

| Check | Status | Hasil |
|---|---|---|
| Backend feature test | **Lulus** | **20 test, 135 assertion** |
| Laravel Pint | Lulus | 0 formatting issue |
| Composer audit | Lulus | 0 advisory |
| Frontend ESLint | Lulus | 0 error, 0 warning |
| Frontend production build | Lulus | initial JS 375.22 kB, gzip 117.50 kB |
| Playwright E2E | **Lulus** | **10 test** |
| Fresh seed | Lulus | 29 migration dan seluruh seeder bersih pada SQLite development |
| npm audit penuh | Lulus | 0 vulnerability |
| OpenAPI parser/lint | Lulus | OpenAPI 3.1 valid, 47 path objects |
| Visual QA desktop | Lulus | Home, catalog, Buyer, Seller, Driver, dan Admin - 0 JS error, 0 respons 5xx, 0 overflow |
| Visual mobile | Lulus | Home dan navigasi pada viewport 390 x 844 |

## Dependency audit note

Frontend sudah dimigrasikan ke Tailwind CSS 4 dengan plugin Vite. Audit npm penuh, termasuk dependency development, kini bersih tanpa `audit fix --force`.

## Cakupan test backend

- Guest application review dan validasi.
- Active-role authorization.
- Cross-buyer order ownership.
- Checkout quote dan checkout atomik.
- Invalid discount tidak memutasi cart, wallet, atau stock.
- Update dan delete cart memakai ID cart item, bukan ID produk.
- Produk atau toko nonaktif ditolak sebelum masuk cart.
- Kategori produk tersimpan konsisten dan soft-delete produk benar-benar mengubah status aktif.
- Upload foto produk memvalidasi tipe file dan menyembunyikan path internal; replacement menghapus file lama setelah transaction berhasil.
- Kode Voucher/Promo dinormalisasi sebelum pemeriksaan unik.
- Lifecycle Seller ke Driver beserta status histories.
- Driver return, refund, dan stock restoration hanya sekali.
- Admin user search dan overdue simulation.
- Fresh migration/seed untuk mendeteksi drift schema dan fixture.

## Cakupan E2E

- Public home dan katalog render tanpa horizontal overflow.
- Visible image tidak broken; URL gambar gagal memakai fallback.
- Buyer, Seller, Driver, dan Admin demo login menuju dashboard yang benar.
- Akun multi-role menuju halaman pemilihan role.
- Invalid login memberi feedback tanpa reload berulang.
- Home mobile tidak overflow dan menu navigasi dapat dibuka.
- Checkout Buyer menampilkan ringkasan konfirmasi sebelum pembayaran diproses.
- Seller dapat memilih file foto, melihat preview, dan memeriksa nama file pada konfirmasi tanpa langsung menyimpan.

## Definition of done

- Behavior utama memiliki test otomatis atau langkah demo yang dapat diulang.
- Authorization dan ownership diverifikasi backend.
- Operasi uang, stok, dan status aman terhadap retry atau race umum.
- Loading, empty, error, dan success state tersedia pada UI utama.
- Tidak ada error lint, build, backend test, production dependency audit, atau E2E.
- Dokumentasi progres, API, demo, dan aturan bisnis sesuai implementasi.
