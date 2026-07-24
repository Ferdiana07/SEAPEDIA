# BAB 12: Pengaturan Akun Terpusat (Settings Page)

## 1. Pendahuluan

Bab ini mendokumentasikan pembuatan halaman **Pengaturan Akun** (`/settings`) yang komprehensif, mirip dengan *dashboard* pengaturan pada platform e-commerce raksasa. Halaman ini berfungsi sebagai pusat kendali bagi pengguna untuk mengelola berbagai aspek akun mereka, termasuk profil, alamat pengiriman, keamanan, role (peran), dan dompet digital, semuanya dalam satu antarmuka yang terintegrasi.

Langkah ini diambil untuk memenuhi (dan melebihi) kriteria kelengkapan fitur dari dokumen PDF referensi.

---

## 2. Pembaruan Database dan API Backend

### 2.1 Penambahan Kolom pada Tabel `users`
Agar profil pengguna lebih lengkap, kami membuat *migration* baru (`add_phone_to_users_table`) untuk menambahkan kolom berikut:
- `phone` (VARCHAR 20, Nullable)
- `bio` (VARCHAR 255, Nullable)
- `birth_date` (DATE, Nullable)
- `gender` (VARCHAR 10, enum: male, female, other, Nullable)

### 2.2 Endpoint Baru di `AuthController.php`
Kami menambahkan dua fungsi penting untuk manajemen akun:
1. **`updateProfile(Request $request)`**: Mengizinkan *update* pada atribut profil.
   - *Method*: `PUT /api/auth/profile`
2. **`changePassword(Request $request)`**: Memvalidasi password lama dan mengubahnya ke password baru yang dikonfirmasi.
   - *Method*: `PUT /api/auth/password`

Kedua *endpoint* tersebut kini tersedia di `routes/api.php` dan terhubung dengan fungsi-fungsi *frontend* di `authService.js`.

---

## 3. Frontend: Komponen `SettingsPage.jsx`

Halaman pengaturan dibangun menggunakan layout *Sidebar-Main Content* modern dengan 5 *tab* utama yang bisa diklik.

### 3.1 Tab: Informasi Pribadi (`ProfileTab`)
- Form interaktif untuk mengubah nama, nomor HP, jenis kelamin, tanggal lahir, dan bio.
- Fitur *preview* Avatar (URL) langsung muncul ketika diisi.
- Email sengaja dibuat *readonly* untuk alasan keamanan.

### 3.2 Tab: Alamat Saya (`AddressTab`)
- Menggunakan integrasi dengan `addressService.js`.
- Pengguna dapat melihat daftar alamat, menambahkan alamat baru (dengan penanda utama/default), mengubah, dan menghapusnya.
- Tombol **"Jadikan Utama"** telah ditambahkan (lewat integrasi endpoint `POST /addresses/{id}/set-default`).

### 3.3 Tab: Keamanan Akun (`SecurityTab`)
- Form pergantian *password* dengan fitur **"Show/Hide Password"** (ikon mata).
- Validasi visual kekuatan password (Indikator bar berwarna: *Merah -> Kuning -> Hijau*).

### 3.4 Tab: Manajemen Role (`RolesTab`)
- Halaman sentralistik bagi pengguna untuk melihat status peran (*roles*) mereka.
- Semua ketersediaan role (Pembeli, Penjual, Driver) ditampilkan menggunakan komponen Card yang estetik.
- Tombol aksi cerdas:
  - **"Beralih ke [Role]"**: Jika pengguna sudah memiliki peran tersebut.
  - **"Daftar Jadi [Role]"**: Jika pengguna belum memiliki peran tersebut (langsung mendaftarkan ke backend dan beralih otomatis).
- Role **Admin** hanya ditampilkan secara eksklusif jika pengguna sudah memilikinya. Tidak ada tombol mendaftar sebagai admin untuk mencegah pelanggaran keamanan.

### 3.5 Tab: Dompet Saya (`WalletTab`)
- Menampilkan akses cepat ke menu Saldo (`/buyer/wallet`) dan Riwayat Transaksi (`/buyer/orders`) menggunakan desain *Banner* gradien yang menarik.

---

## 4. Pembaruan Navigasi (`Navbar.jsx` & `App.jsx`)

- **Route Baru**: `/settings` ditambahkan ke `App.jsx` dengan bungkus `<ProtectedRoute>` agar dapat diakses oleh semua *role* yang sudah terautentikasi (baik ia sedang aktif sebagai buyer, seller, driver, atau admin).
- **Navbar Dropdown**: Menambahkan menu akses cepat **"⚙️ Pengaturan Akun"** pada dropdown profil di *Navbar*.

---

## 5. Kesimpulan
Dengan adanya Halaman Pengaturan Akun ini, SEAPEDIA tidak hanya memenuhi kebutuhan dasar aplikasi e-commerce, tetapi juga memberikan pengalaman *User Experience* (UX) yang premium. Fitur-fiturnya melebihi standar dasar dengan menyediakan mekanisme *multi-role* terpadu dan indikator keamanan *password* interaktif.
