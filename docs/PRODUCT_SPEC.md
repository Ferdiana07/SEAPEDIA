# Product Specification

## Visi

SEAPEDIA adalah marketplace bahari Indonesia yang memperlihatkan satu transaksi lengkap dari katalog publik hingga pengantaran dan monitoring admin. Nilai portofolionya terletak pada konsistensi aturan bisnis lintas role, kualitas state transition, keamanan backend, dan pengalaman pengguna yang rapi.

Katalog portofolio berfokus pada delapan kategori: alat pancing, budidaya, pakan, akuarium, biota hidup hasil budidaya legal, tanaman laut hasil perbanyakan, hasil laut berantai dingin, dan kuliner laut siap santap. Produk hidup wajib memiliki keterangan penanganan serta pengiriman khusus dan tidak boleh berasal dari pengambilan liar yang dilarang.

## Aktor

- Guest: melihat katalog, detail produk, toko, serta membaca dan mengirim ulasan aplikasi publik.
- Buyer: mengelola wallet, alamat, cart satu toko, checkout, dan histori pesanan.
- Seller: mengelola toko dan produk miliknya, lalu memproses pesanan masuk.
- Driver: menemukan job siap antar, mengambil tepat satu job, menyelesaikan atau mengembalikannya, serta melihat penghasilan.
- Admin: memonitor marketplace, mengelola voucher/promo, dan menjalankan simulasi overdue.

## Aturan bisnis wajib

### Role dan akses

- Satu akun non-admin dapat memiliki beberapa role.
- Semua operasi privat mengikuti role aktif, bukan sekadar role yang dimiliki.
- Akun multi-role harus memilih role aktif setelah login sebelum masuk dashboard.
- Authorization backend adalah sumber kebenaran. Guard frontend hanya membantu UX.

### Cart dan checkout

- Satu cart hanya boleh berisi produk dari satu toko.
- Checkout mendukung `instant`, `next_day`, dan `regular`.
- Ringkasan transaksi selalu memuat subtotal, diskon, ongkir, PPN 12%, dan total akhir.
- PPN dihitung dari subtotal setelah diskon. Ongkir tidak dikenai PPN.
- Hanya satu kode diskon dapat digunakan per checkout. Kode tersebut dapat berupa Voucher atau Promo.
- Checkout memakai database transaction dan row lock agar saldo atau stok tidak menjadi negatif.

### Order lifecycle

Urutan normal:

`packaging -> waiting_shipper -> shipping -> completed`

Urutan gagal:

`packaging|waiting_shipper|shipping -> returned`

Label pengguna:

- `packaging`: Sedang Dikemas
- `waiting_shipper`: Menunggu Pengirim
- `shipping`: Sedang Dikirim
- `completed`: Pesanan Selesai
- `returned`: Dikembalikan

Setiap perubahan status harus memiliki timestamp, aktor, dan catatan opsional.

### Uang, stok, dan laporan

- Wallet Buyer didebit saat checkout berhasil.
- Stock dikurangi saat checkout dan dikembalikan sekali saja jika order direfund/returned.
- Seller income hanya menghitung order `completed`.
- Driver earning adalah 80% dari delivery fee untuk order `completed`.
- Refund harus idempotent dan dicatat di transaction history.

### Overdue SLA

- Instant: overdue setelah 6 jam.
- Next Day: overdue setelah 36 jam.
- Regular: overdue setelah 5 hari.
- Simulasi demo dilakukan melalui endpoint Admin yang menerima jumlah hari/jam maju dan menjalankan evaluasi overdue.

### Ulasan

- Ulasan aplikasi publik berbeda dari ulasan produk.
- Guest boleh mengirim nama, rating 1-5, dan komentar.
- Komentar diperlakukan sebagai plain text, divalidasi panjangnya, dan tidak dirender sebagai HTML.

## Ruang lingkup portofolio

Fitur yang dipertahankan dari brief: seluruh alur inti level 1-7, demo account, dokumentasi API, dan test bisnis utama.

Penyederhanaan yang disengaja:

- Tidak ada payment gateway nyata. Wallet top-up adalah simulasi.
- Tidak ada peta atau GPS real-time. Tracking menggunakan status timeline.
- Tidak ada multi-store checkout. Konflik toko dijelaskan dan ditolak secara eksplisit.
- Tidak ada settlement eksternal. Income dan earning diturunkan dari order completed.

## Bahasa dan desain

- Bahasa antarmuka utama: Bahasa Indonesia.
- Accent utama: hijau laut yang lebih tenang dari hijau marketplace generik.
- Public pages: visual commerce yang tepercaya, fokus produk dan alur multi-role.
- Dashboard: informasi padat tetapi mudah dipindai, status dan tindakan utama harus jelas.
- Ikon memakai satu library. Emoji dekoratif dan SVG buatan tangan akan dihapus dari UI produksi.
