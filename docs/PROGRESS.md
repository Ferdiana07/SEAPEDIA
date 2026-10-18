# Progress Log

## Current checkpoint

Tanggal: 2026-10-18

Status: milestone portofolio utama selesai dan seluruh quality gate lulus.

Jika sesi berikutnya dimulai, baca berurutan:

1. `PRODUCT_SPEC.md` untuk aturan bisnis.
2. `ARCHITECTURE.md` untuk boundary dan keputusan teknis.
3. `QUALITY.md` untuk command serta hasil verifikasi terbaru.
4. `ROADMAP.md` untuk status milestone.
5. `DEMO_GUIDE.md` untuk memeriksa setiap role.

Tidak ada blocker atau pekerjaan wajib tersisa. Kandidat pengembangan opsional: deployment publik, payment gateway sandbox, background scheduler untuk overdue, dan observability.

## Session log

### 2026-10-16 - Audit dan domain foundation

- Membaca penuh 22 halaman `SEAPEDIA.pdf` dan menurunkan aturan bisnis ke `PRODUCT_SPEC.md`.
- Mengaudit React/Laravel, route, model, controller, service, store, serta page utama.
- Mengganti dokumentasi tutorial lama dengan continuity docs berbasis implementasi nyata.
- Menambah application reviews, discounts, financial breakdown order, dan order status histories.
- Memasang middleware active role dan flow pemilihan role untuk akun multi-role.
- Membuat checkout quote, PPN 12%, delivery fee, Voucher/Promo, transaction locking, dan idempotent refund.
- Menambah report Buyer, Seller, Driver, Admin monitoring, serta overdue simulation.

### 2026-10-16 - Reliability dan test

- Memperbaiki race pada cancel, Seller processing, Driver pickup, complete, dan return.
- Menambah test ownership, lifecycle, return/refund, invalid discount, Admin search, dan overdue.
- Menambah migration backfill subtotal agar database lama tidak menampilkan income Seller Rp0.
- Menemukan drift `stores.image_url` versus `logo_url` melalui fresh-seed audit, lalu menormalisasi schema lama dan baru.
- Memperbarui 58 dependency Composer ke patch aman; Composer audit menjadi 0 advisory.
- Memperbarui dependency npm non-breaking; production audit menjadi 0 vulnerability.
- Checkpoint saat itu: 10 test, 50 assertion, Pint lulus.

### 2026-10-16 - UI/UX dan portfolio polish

- Menetapkan fondasi visual awal, Plus Jakarta Sans, shape, shadow, dan responsive shell.
- Mengganti emoji/SVG campur dengan Phosphor Icons pada UI aktif.
- Mendesain ulang Home, catalog, product/store detail, auth, role selection, Settings, dashboard, cart, orders, wallet, address, Seller tools, Driver tools, dan Admin tools.
- Menambah ilustrasi hero awal; aset ini kemudian dihapus pada audit 17 Oktober karena terasa terlalu generatif.
- Menambah fallback image untuk URL produk gagal.
- Menambah route-level lazy loading; initial JS menjadi 306.90 kB sebelum gzip.
- Menambah panel demo account development-only untuk Buyer, Seller, Driver, Admin, dan Multi-role.
- Menambah Playwright smoke suite: 6 test lulus.
- Menjalankan visual QA desktop 1440 px dan mobile 390 px serta memperbaiki issue yang ditemukan.

### 2026-10-16 - Dokumentasi akhir

- Menambah root `README.md` untuk presentasi portofolio dan setup lokal.
- Menambah `OPENAPI.yaml` valid untuk seluruh route API.
- Menambah `DEMO_GUIDE.md` dengan skenario per role dan expected result.
- Menyinkronkan `ROADMAP.md`, `QUALITY.md`, `ARCHITECTURE.md`, dan file ini dengan hasil final.

### 2026-10-17 - Audit regresi dan penyelesaian UI

- Memperbaiki bug update/delete cart yang sebelumnya mengirim ID produk alih-alih ID cart item.
- Memperbaiki soft-delete produk, validasi kategori, guard produk/toko nonaktif, normalisasi kode promo, serta email auth.
- Memperbaiki average review lintas halaman, pagination limit, fallback gambar, subtotal Seller, dan error state yang masih tersembunyi.
- Menambah aksesibilitas form, menghapus nested interactive element, serta memastikan login gagal tidak memicu reload berulang.
- Mengganti hero bergambar AI dengan banner editorial berbasis alur Buyer, Seller, dan Driver.
- Menyederhanakan kategori, manfaat per role, dan area ulasan dengan satu aksen warna, tanpa glow atau gradien dekoratif.
- Memigrasikan Tailwind CSS 3 ke 4 memakai plugin Vite; audit npm penuh menjadi 0 vulnerability.
- Menyelaraskan schema OpenAPI dengan field backend aktual untuk application review, produk, cart, dan discount.
- Mengganti URL gambar demo yang tidak stabil dengan empty-image state lokal yang jujur dan konsisten.
- Hasil akhir: 15 backend test dengan 73 assertion, 8 Playwright E2E, lint, build, Pint, audit dependency, fresh seed, dan visual QA lulus.

### 2026-10-18 - Katalog bahari dan ikon kategori

- Mengganti seluruh produk umum dengan 16 produk kelautan pada delapan kategori beserta tiga toko demo yang relevan.
- Menambah 16 foto produk WebP lokal dan satu hero bahari, lalu mengganti seluruh banner, copy, review, order fixture, dan tautan kategori lama.
- Memisahkan data demo dari migration sehingga instalasi baru tidak lagi menyisipkan katalog legacy.
- Menyederhanakan logo kategori menjadi delapan ikon garis tunggal yang unik tanpa SVG ilustratif kompleks atau gradien.
- Menambah saldo akun demo agar skenario cart bertema laut tetap dapat mencapai konfirmasi checkout.
- Hasil akhir: 18 backend test dengan 108 assertion, 9 Playwright E2E, lint, build, Pint, fresh seed, dan pemeriksaan HTTP dua server lulus.

### 2026-10-18 - Upload foto produk Seller

- Mengganti input URL pada CRUD produk Seller dengan file picker modern, drag-and-drop, preview, dan ringkasan nama file pada dialog konfirmasi.
- Menambah validasi berlapis untuk JPG/PNG/WebP, batas 2 MB, dan resolusi maksimal 6000 x 6000 piksel; SVG dan file berbahaya ditolak.
- Menambah metadata `image_path` dan `image_disk`, URL dinamis, cleanup file gagal, serta penghapusan foto lama setelah update transaction berhasil.
- Menyiapkan disk lokal untuk development dan adapter S3-compatible untuk object storage production.
- Menambah regression test upload, replacement, privasi path storage, cleanup file lama, dan penolakan format tidak aman.
- Hasil: 20 backend test dengan 135 assertion, 10 Playwright E2E, frontend lint/build, dan Pint lulus.

## Handoff notes

- Jangan reset atau checkout perubahan lokal pengguna.
- `PRODUCT_SPEC.md` adalah source of truth, bukan seluruh detail lomba di PDF.
- Database development memiliki backup pra-migrasi di `seapedia-backend/database/database.sqlite.backup-before-20261016` dan file tersebut diabaikan Git.
- Screenshot QA berada di `tmp/qa` dan sengaja diabaikan Git.
- Jalankan seluruh command di `QUALITY.md` setelah perubahan lintas domain.
