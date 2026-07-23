# BAB 10: UI/UX Upgrade (Modern E-Commerce Design)

## 1. Pendahuluan
Bab ini difokuskan pada perombakan besar-besaran (major upgrade) pada aspek *User Interface* (UI) dan *User Experience* (UX) agar SEAPEDIA memiliki tampilan yang modern, bersih, dan profesional—terinspirasi dari platform e-commerce besar seperti Tokopedia. Sebelumnya, tampilan dinilai "tua, monoton, dan kaku".

## 2. Sistem Desain & Warna
Kami melakukan pembaruan pada konfigurasi `tailwind.config.js` untuk mengganti *primary color palette*.
- **Warna Sebelumnya**: Biru Tailwind (`#3b82f6`)
- **Warna Baru**: Hijau E-commerce (`#00AA5B`) yang melambangkan pertumbuhan, keamanan transaksi, dan identik dengan marketplace modern di Indonesia.

## 3. Komponen Inti (Core UI)
Pembaruan `src/index.css` dan komponen dasar:
- **Button**: Menggunakan `rounded-xl`, tulisan lebih tebal (`font-bold`), dan menambahkan animasi `active:scale-[0.98]` agar tombol terasa membal (responsif) saat diklik.
- **Card**: Sudut dibuat lebih membulat (`rounded-2xl`) dengan *shadow* yang jauh lebih tipis dan *border* yang sangat halus (`border-gray-100`) untuk menciptakan kesan "mengambang" (floating).
- **Product Card**: Class baru `.product-card` dengan *aspect ratio* gambar 1:1, transisi hover (gambar sedikit membesar/zoom-in), dan tipografi yang rapi (nama produk dibatasi 2 baris).

## 4. Perombakan Layout Halaman
1. **Navbar**: Diubah menjadi *sticky header* dengan *Search Bar* yang panjang dan menonjol di bagian tengah. Menu profil pengguna dibuat rapi dengan bentuk dropdown berdesain card modern.
2. **Home Page**:
   - *Hero Section* tidak lagi full-width solid, melainkan berbentuk *Banner Card* melengkung yang lebih dinamis.
   - Penambahan placeholder ikon kategori (Elektronik, Pakaian, Makanan, dll).
   - Grid produk direstrukturisasi menjadi 5-kolom di layar besar dengan detail informasi seperti rating bintang, lokasi toko, dan badge.
3. **Products Page**:
   - Layout dua kolom: Kiri untuk *Sidebar Filter* (kategori, harga) dan Kanan untuk Grid Produk utama. Sidebar bersifat statis untuk keperluan visualisasi UI modern.
4. **Product Detail Page**:
   - Diubah menjadi layout 3-area ala e-commerce raksasa:
     - Kiri: Gambar produk (persegi).
     - Tengah: Informasi produk (Nama, Harga, Rating, Toko, Deskripsi, dan Ulasan).
     - Kanan: Kotak Beli (*Floating / Sticky Box*) untuk mengatur jumlah, melihat subtotal, dan tombol "+ Keranjang" serta "Beli Langsung".
5. **Auth Pages (Login/Register)**:
   - Form card dibuat *clean white* tanpa border kasar, menggunakan *soft shadow* tebal, dan logo SEAPEDIA ditempatkan di tengah atas halaman untuk memberikan *branding* yang kuat.

## 5. Kesimpulan
Perubahan UI/UX ini memastikan SEAPEDIA tidak sekadar fungsional (memiliki database dan API yang kuat), tetapi juga memberikan pengalaman visual yang memanjakan mata pengguna, meningkatkan kredibilitas aplikasi, dan membuatnya pantas disebut sebagai aplikasi E-Commerce modern.
