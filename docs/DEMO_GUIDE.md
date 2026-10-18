# Demo Guide

Panduan ini dirancang untuk reviewer portofolio yang ingin memeriksa seluruh user story tanpa menyiapkan data manual. Jalankan seed terlebih dahulu dan gunakan password `password123` untuk semua akun.

## Persiapan

```powershell
cd seapedia-backend
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000

cd ..\seapedia-frontend
npm run dev -- --host 127.0.0.1
```

Buka `http://127.0.0.1:5173/login`. Klik kartu akun pada panel Developer mode untuk login otomatis.

## Skenario 1 - Public marketplace

1. Buka Beranda tanpa login.
2. Periksa kategori, produk terbaru, benefit multi-role, serta ulasan aplikasi.
3. Kirim ulasan aplikasi dengan nama, rating, dan komentar.
4. Gunakan pencarian Navbar atau buka Katalog.
5. Terapkan kategori dan rentang harga, lalu buka detail produk dan halaman tokonya.

Hasil yang diharapkan: katalog tetap dapat diakses Guest, filter tersinkron dengan URL, broken image diganti fallback, dan ulasan aplikasi baru muncul sebagai plain text.

## Skenario 2 - Buyer

Akun: `ani@seapedia.com`.

1. Periksa Ringkasan untuk saldo, order aktif/selesai, dan total belanja.
2. Buka Dompet dan lakukan top up simulasi.
3. Buka Alamat, tambah alamat, lalu jadikan default.
4. Tambahkan produk dari satu toko ke cart. Coba tambahkan produk toko lain untuk memeriksa aturan single-store cart.
5. Pilih metode pengiriman, masukkan kode `HEMAT10` atau `ONGKIR20`, lalu periksa quote subtotal, diskon, ongkir, PPN, dan total.
6. Checkout dan buka detail order untuk melihat timeline status.
7. Selama status masih `packaging`, coba pembatalan untuk memeriksa refund dan pengembalian stok.

Hasil yang diharapkan: saldo dan stok tidak pernah negatif, checkout invalid tidak mengubah data, dan refund hanya terjadi sekali.

## Skenario 3 - Seller

Akun: `budi@seapedia.com`.

1. Periksa dashboard toko dan ringkasan income dari order selesai.
2. Buka Profil Toko dan ubah informasi dasar.
3. Buka Produk, tambah produk baru dengan foto JPG/PNG/WebP, periksa preview dan konfirmasi, lalu edit stok/harga atau ganti fotonya.
4. Buka Pesanan dan filter status `Perlu Dikemas`.
5. Tandai order sebagai sudah dikemas agar berpindah ke `waiting_shipper`.

Hasil yang diharapkan: Seller hanya melihat dan mengubah resource tokonya sendiri; foto tampil di katalog setelah upload, foto lama dibersihkan saat diganti, dan income hanya menghitung subtotal order `completed`.

## Skenario 4 - Driver

Akun: `caca@seapedia.com`.

1. Periksa Job tersedia pada dashboard.
2. Buka Pengantaran dan ambil satu order `waiting_shipper`.
3. Selesaikan order aktif atau gunakan alur Kembalikan dengan alasan yang jelas.
4. Periksa tab Riwayat dan ringkasan earning.

Hasil yang diharapkan: pickup hanya dapat dimenangkan satu Driver, complete menghitung 80% ongkir sebagai earning, dan return memulihkan stok serta me-refund Buyer sekali saja.

## Skenario 5 - Admin

Akun: `admin@seapedia.com`.

1. Periksa Monitoring untuk statistik, order terbaru, stok rendah, dan pengantaran aktif.
2. Buka Pengguna dan coba pencarian nama/email.
3. Buka Promo, buat Voucher atau Promo, lalu edit status atau periodenya.
4. Kembali ke Monitoring, isi jumlah jam pada Simulasi overdue, lalu jalankan.

Hasil yang diharapkan: order yang melampaui SLA berpindah ke `returned`, riwayat status bertambah, refund/stock restore hanya sekali, dan ringkasan dashboard diperbarui.

## Skenario 6 - Multi-role

Akun: `fika@seapedia.com`.

1. Login dan pastikan halaman Pemilihan Role tampil sebelum dashboard.
2. Pilih Pembeli, lalu buka menu akun dan ganti ke Penjual.
3. Pastikan route privat role sebelumnya tidak dapat digunakan ketika role aktif berubah.

Hasil yang diharapkan: satu role aktif pada satu waktu dan backend mengembalikan 403 bila role aktif tidak sesuai endpoint.

## Checklist penutup demo

- Tidak ada error console atau request 500.
- Nilai quote sama dengan breakdown pada order setelah checkout.
- Timeline order memperlihatkan status, aktor, dan waktu.
- Tombol aksi hilang atau nonaktif pada status yang tidak valid.
- Layout tetap dapat dipakai pada viewport mobile.
- Akun demo tidak muncul pada `npm run build`/production mode.
