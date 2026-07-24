# BAB 10: UI/UX Upgrade (Modern E-Commerce Design)

> **Tujuan:** Merombak total tampilan SEAPEDIA agar memiliki UI/UX modern, bersih, dan profesional — setara platform e-commerce besar Indonesia.

---

## 10.1 Pendahuluan

Bab ini fokus pada **perombakan besar-besaran** (*major upgrade*) aspek *User Interface* (UI) dan *User Experience* (UX) agar SEAPEDIA memiliki tampilan yang modern, bersih, dan profesional — terinspirasi dari platform e-commerce besar seperti Tokopedia. Sebelumnya, tampilan dinilai "tua, monoton, dan kaku".

Ini adalah titik balik visual SEAPEDIA: dari aplikasi fungsional biasa menjadi aplikasi yang layak disebut **platform e-commerce modern**.

---

## 10.2 Sistem Desain & Warna

### Perubahan Color Palette

Pembaruan dilakukan pada `tailwind.config.js` untuk mengganti *primary color palette* secara menyeluruh:

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Primary Color | Biru Tailwind (`#3b82f6`) | Hijau E-commerce (`#00AA5B`) |
| Filosofi | Warna default library | Warna identik marketplace Indonesia |
| Makna | Netral, umum | Pertumbuhan, keamanan transaksi, kepercayaan |

Warna hijau `#00AA5B` dipilih karena:
- Identik dengan Tokopedia dan marketplace Indonesia
- Secara psikologi menyampaikan rasa aman dan kepercayaan dalam bertransaksi
- Memberi identitas visual yang kuat dan berbeda dari aplikasi biru generik

### Konfigurasi Tailwind

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50:  '#f0fdf4',
        100: '#dcfce7',
        300: '#86efac',
        400: '#4ade80',
        500: '#00AA5B',  // ← Primary utama
        600: '#009950',
        700: '#007a40',
      }
    }
  }
}
```

---

## 10.3 Komponen Inti (Core UI)

Pembaruan `src/index.css` dan komponen dasar UI:

### Button
- Menggunakan `rounded-xl` (sudut lebih membulat dari `rounded-lg`)
- Tulisan lebih tebal (`font-bold` bukan `font-medium`)
- Animasi klik: `active:scale-[0.98]` — tombol terasa "membal" saat diklik (feedback haptic visual)

### Card
- Sudut dibuat lebih membulat: `rounded-2xl`
- Shadow jauh lebih tipis dan halus: dari `shadow-md` menjadi `shadow-sm`
- Border sangat halus: `border border-gray-100` menciptakan kesan "mengambang" (*floating*)

### Product Card
Class baru `.product-card` dengan fitur:
- **Aspect ratio gambar 1:1** — konsistensi visual di grid
- **Hover zoom-in**: gambar sedikit membesar saat di-hover (`scale-105`) dengan transisi smooth
- **Tipografi rapi**: nama produk dibatasi 2 baris (`line-clamp-2`) mencegah card tidak rata
- **Badge informasi**: stok, rating bintang, dan lokasi toko

---

## 10.4 Perombakan Layout Halaman

### 1. Navbar (Sticky Header)
- Diubah menjadi *sticky header* (`sticky top-0 z-50`)
- **Search Bar** panjang dan menonjol di bagian tengah (seperti Tokopedia)
- Menu profil pengguna menjadi **dropdown card** dengan desain modern dan shadow
- Ikon keranjang dengan badge angka item

### 2. Home Page
- *Hero Section*: dari banner solid full-width menjadi **Banner Card melengkung** yang lebih dinamis
- **Ikon Kategori**: placeholder grid ikon kategori (Elektronik, Pakaian, Makanan, Olahraga, dll.)
- **Grid Produk**: direstrukturisasi menjadi 5-kolom di layar besar dengan:
  - Rating bintang
  - Lokasi toko
  - Badge "Terlaris" / "Diskon"

### 3. Products Page
Layout dua kolom:
- **Kiri**: Sidebar Filter (kategori, range harga) — statis untuk visual UI modern
- **Kanan**: Grid Produk utama dengan pagination

### 4. Product Detail Page
Layout 3-area ala e-commerce raksasa:
```
┌──────────────────────────────────────────────────────┐
│  [Gambar Produk]  │  [Info Produk]  │  [Kotak Beli]  │
│   (persegi 1:1)   │  Nama, Harga,   │  Qty, Subtotal │
│                   │  Rating, Toko,  │  + Keranjang   │
│                   │  Deskripsi,     │  Beli Langsung │
│                   │  Ulasan         │  (Sticky/Float)│
└──────────────────────────────────────────────────────┘
```

### 5. Auth Pages (Login & Register)
- Form card *clean white* tanpa border kasar
- *Soft shadow* tebal dan lembut
- Logo SEAPEDIA ditempatkan di tengah atas form untuk **branding** yang kuat

---

## 10.5 Ringkasan File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `tailwind.config.js` | Ganti primary color ke hijau `#00AA5B` |
| `src/index.css` | Update CSS global: button, card, product-card |
| `src/pages/HomePage.jsx` | Hero card, kategori grid, product grid 5-col |
| `src/pages/ProductsPage.jsx` | Layout 2-kolom dengan sidebar filter |
| `src/pages/ProductDetailPage.jsx` | Layout 3-area dengan sticky kotak beli |
| `src/pages/LoginPage.jsx` | Form clean white dengan logo branding |
| `src/pages/RegisterPage.jsx` | Form clean white dengan logo branding |
| `src/components/layout/Navbar.jsx` | Sticky header + search bar + dropdown modern |

---

## 10.6 Checklist BAB 10

- [x] Primary color diganti ke hijau `#00AA5B` di `tailwind.config.js`
- [x] CSS global diperbarui (button, card, product-card)
- [x] Navbar: sticky header dengan search bar dan dropdown modern
- [x] Home Page: hero card melengkung + ikon kategori + grid 5-kolom
- [x] Products Page: layout 2-kolom dengan sidebar filter
- [x] Product Detail Page: layout 3-area dengan sticky kotak beli
- [x] Auth Pages: form clean white dengan logo branding di tengah

---

## 10.7 Kesimpulan

Perubahan UI/UX ini memastikan SEAPEDIA tidak sekadar fungsional (memiliki database dan API yang kuat), tetapi juga memberikan **pengalaman visual yang memanjakan mata** pengguna, meningkatkan kredibilitas aplikasi, dan membuatnya pantas disebut sebagai aplikasi E-Commerce modern.

```
┌─────────────────────────────────────────────────────────────────┐
│                      YANG SUDAH DIPELAJARI                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Desain sistem warna yang konsisten (primary = hijau)         │
│  ✅ Komponen UI yang responsif dan beranimasi                    │
│  ✅ Navbar sticky dengan search bar berpusat                     │
│  ✅ Home Page dengan hero dinamis dan grid 5-kolom               │
│  ✅ Products Page dengan layout filter + grid 2-kolom            │
│  ✅ Product Detail Page layout 3-area ala marketplace raksasa    │
│  ✅ Auth Pages dengan branding logo kuat                         │
│                                                                  │
│  PELAJARAN UTAMA:                                                │
│  UI yang baik = konsistensi warna + komponen beranimasi          │
│              + layout informatif + branding yang kuat            │
│                                                                  │
│  NEXT: BAB 11 — Fitur Lengkap Semua Role & Filter Produk        │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan membuat:                                              │
│  1. Filter produk yang benar-benar terhubung ke API              │
│  2. Admin Dashboard lengkap                                      │
│  3. Seller Orders Page                                           │
│  4. Perbaikan Driver Orders                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 11?** [Fitur Lengkap Semua Role](../11-complete-features/11-complete-features.md)

---

*Update terakhir: 2026-07-24*
