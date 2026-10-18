# Initial Audit

Tanggal audit: 2026-10-16

> Dokumen ini mempertahankan temuan baseline untuk histori. Seluruh gap wajib di bawah sudah diselesaikan; hasil akhir dan command verifikasi berada di `PROGRESS.md` dan `QUALITY.md`.

## Yang sudah ada

- Public home, catalog, dan detail produk.
- Register, login, logout API, profile, password, dan role assignment/switch.
- Seller store dan product CRUD.
- Buyer wallet top-up, address CRUD, cart satu toko, checkout dasar, order list/detail.
- Seller order list dan transition ke waiting shipper.
- Driver available job, pickup, complete, return, dan history awal.
- Admin overview stats dan user list awal.
- Production frontend build berhasil.

## Gap fungsional utama

- Review yang ada adalah review produk dan mewajibkan login. Brief membutuhkan application review publik.
- Route domain belum memakai middleware active role walaupun middleware-nya sudah tersedia.
- Login multi-role belum memaksa role selection.
- Checkout baru menghitung total produk. Belum ada delivery method, fee, discount, PPN, atau breakdown tersimpan.
- Belum ada Voucher/Promo resource dan UI.
- Belum ada order status history dengan timestamp.
- Pickup Driver belum memakai lock sehingga race condition masih mungkin.
- Refund di cancel/return memiliki mismatch parameter dan belum idempotent.
- Seller income dan Driver earning belum didefinisikan secara benar.
- Admin monitoring belum mencakup semua resource.
- Overdue simulation dan auto-refund belum ada.
- API docs dan demo guide belum ada.

## Gap kualitas

- Backend test hanya dua test contoh bawaan.
- Frontend lint baseline: 52 error dan 18 warning.
- Banyak string mengalami mojibake, misalnya karakter emoji dan simbol menjadi teks rusak.
- UI menggunakan emoji dekoratif dan SVG inline campur aduk.
- Search Navbar masih visual-only.
- Homepage masih memakai statistik/rating placeholder yang tidak bersumber dari data.
- Empty, error, dan loading states belum konsisten.
- `App.css` masih berisi CSS starter yang tidak digunakan.

## Perubahan lokal pengguna yang dipertahankan

- Auth response memuat summary toko.
- Driver endpoint mendukung available, active, dan history.
- Driver UI menambah tab history.
- Seller dashboard mengarah ke route store yang benar.
- Seller store menyinkronkan store ke auth state.

## Baseline verifikasi

- `php artisan test --compact`: lulus, 2 test contoh.
- `npm run build`: lulus.
- `npm run lint`: gagal, 52 error dan 18 warning.
