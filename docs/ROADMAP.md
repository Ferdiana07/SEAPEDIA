# Roadmap

Status: `[ ]` belum mulai, `[-]` dikerjakan, `[x]` selesai dan terverifikasi.

## M0 - Audit dan continuity docs

- [x] Membaca seluruh brief PDF dan memeriksa layout 22 halaman.
- [x] Mengaudit route, model, controller, page, service, dan state utama.
- [x] Menjalankan baseline backend test, frontend build, dan lint.
- [x] Mengganti dokumentasi lama dengan dokumentasi continuity baru.

## M1 - Domain foundation dan authorization

- [x] Memasang middleware active role pada seluruh route privat.
- [x] Memperbaiki flow login multi-role dan role selection page.
- [x] Menambah application review publik beserta test.
- [x] Menambah order status history.
- [x] Menambah financial breakdown dan delivery fields pada order.
- [x] Menambah discount resource untuk Voucher dan Promo.

## M2 - Checkout dan lifecycle yang aman

- [x] Membuat quote/preview checkout.
- [x] Mengimplementasikan delivery fee, discount, PPN 12%, dan total.
- [x] Membuat checkout atomic dengan stock dan wallet locking.
- [x] Membuat transition Seller dan Driver yang tercatat di history.
- [x] Membuat refund/return idempotent dan stock restoration aman.
- [x] Menambah report Buyer, Seller, dan Driver.

## M3 - Admin dan overdue

- [x] Memperluas monitoring API dan UI Admin.
- [x] Membuat Voucher/Promo management UI.
- [x] Membuat SLA evaluator dan simulasi waktu.
- [x] Membuat overdue refund/return yang dapat diaudit.

## M4 - UI/UX overhaul

- [x] Menetapkan token, type scale, icon library, dan dashboard shell.
- [x] Merapikan public home, navigation, catalog, product, dan store detail.
- [x] Menambah public application review section/form.
- [x] Merapikan auth dan role selection.
- [x] Merapikan Buyer flow dari cart hingga order timeline.
- [x] Merapikan Seller, Driver, dan Admin dashboard.
- [x] Menghapus mojibake, fake metrics, dan emoji dekoratif dari UI aktif.
- [x] Memastikan responsive, keyboard, focus, contrast, loading, empty, dan error states.
- [x] Mengganti hero generatif dengan banner editorial berbasis alur produk tanpa gambar AI, glow, atau gradien dekoratif.
- [x] Menyederhanakan kategori, manfaat per role, serta ulasan agar hierarki visual lebih tenang dan konsisten.

## M5 - Quality dan handoff

- [x] Menambah feature test untuk authorization, checkout, status, refund, discount, dan overdue.
- [x] Membuat lint frontend lulus tanpa warning.
- [x] Membuat backend test dan frontend build lulus.
- [x] Menambah Playwright smoke test untuk public page dan seluruh akun demo.
- [x] Menjalankan visual QA desktop dan mobile.
- [x] Menambah OpenAPI, demo accounts, setup guide, dan E2E demo checklist.
- [x] Memperbarui root README untuk kebutuhan portofolio.
- [x] Memigrasikan Tailwind CSS 3 ke 4 dan membersihkan seluruh advisory npm.
- [x] Menambah regression test untuk ID cart item, produk nonaktif, normalisasi voucher, login gagal, serta navigasi mobile.

## M6 - Deployment readiness

- [x] Menambah upload foto produk Seller dengan preview dan dialog konfirmasi.
- [x] Menambah validasi MIME, ukuran, dimensi, ownership, serta lifecycle penggantian file.
- [x] Menyiapkan storage lokal dan S3-compatible object storage production.
- [ ] Deploy frontend ke Vercel serta Laravel/PostgreSQL ke Railway.
- [ ] Hubungkan bucket production dan jalankan smoke test pada domain publik.

## Status akhir

Seluruh milestone aplikasi lokal selesai dan terverifikasi. Pekerjaan berikutnya adalah deployment publik dan smoke test production.
