# 📘 Referensi: Tools, Bahasa & Framework SEAPEDIA

> **Tujuan:** Menjelaskan semua teknologi yang digunakan di SEAPEDIA agar kamu paham "alat-alat" yang dipakai dan fungsinya

---

## Daftar Isi

1. [Bahasa Pemrograman](#1-bahasa-pemrograman)
2. [Frontend Framework & Library](#2-frontend-framework--library)
3. [Backend Framework](#3-backend-framework)
4. [Database](#4-database)
5. [Build Tools](#5-build-tools)
6. [Package Manager](#6-package-manager)
7. [Authentication](#7-authentication)
8. [CSS Framework](#8-css-framework)
9. [API & Communication](#9-api--communication)
10. [State Management](#10-state-management)
11. [Routing](#11-routing)
12. [Version Control](#12-version-control)
13. [Server](#13-server)
14. [Glosarium Singkat](#14-glosarium-singkat)

---

## 1. Bahasa Pemrograman

### JavaScript (JS)

```
┌─────────────────────────────────────────────────────────────────┐
│                        JAVASCRIPT                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Bahasa pemrograman untuk membuat website INTERAKTIF     │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  HTML = Kerangka rumah (dinding, atap, lantai)                   │
│  CSS  = Cat warna, furniture, dekorasi                           │
│  JS   = Listrik, Air, Gas (membuat rumah berfungsi)              │
│                                                                  │
│  CONTOH PENGGUNAAN:                                              │
│  • Klik tombol → Muncul popup                                    │
│  • Form submit → Data dikirim ke server                         │
│  • Animasi hover → Element bergerak                              │
│  • Loading → Tampilkan spinner                                   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • React (ditulis dengan JS/JSX)                                │
│  • Interaksi user                                               │
│  • Validasi form                                                │
│                                                                  │
│  VERSI: ES6+ (ECMAScript 2015+)                                 │
│  SYNTAX CONTOH:                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ const nama = "Budi";                                   │   │
│  │ function sapa() {                                      │   │
│  │   console.log("Halo " + nama);                         │   │
│  │ }                                                      │   │
│  │ sapa(); // Output: "Halo Budi"                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### PHP

```
┌─────────────────────────────────────────────────────────────────┐
│                            PHP                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Bahasa pemrograman untuk membuat website DINAMIS       │
│           yang berjalan di SERVER                                │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  JavaScript = Koki yang MASAK di DAPUR (di browser/user)        │
│  PHP        = Koki yang MASAK di GUDANG (di server)             │
│                                                                  │
│  CONTOH PENGGUNAAN:                                              │
│  • Generate halaman HTML berdasarkan data                       │
│  • Koneksi ke database                                          │
│  • Session management                                           │
│  • CRUD data                                                    │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Laravel Backend                                              │
│  • API Endpoints                                                │
│  • Logic bisnis                                                 │
│                                                                  │
│  VERSI: PHP 8.2+                                                 │
│  SYNTAX CONTOH:                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ <?php                                                      │   │
│  │ $nama = "Budi";                                         │   │
│  │ echo "Halo " . $nama;                                   │   │
│  │ // Output: "Halo Budi"                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### HTML

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTML                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: HyperText Markup Language - Bahasa untuk MEMBUAT       │
│           STRUKTUR halaman web                                   │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  HTML = Kerangka/skeleton rumah                                 │
│  Kamu nggak bisa "tinggal" di skeleton rumah, tapi rumah         │
│  butuh kerangka itu                                             │
│                                                                  │
│  CONTOH PENGGUNAAN:                                              │
│  • <h1>Judul</h1> = Heading                                    │
│  • <button>Klik</button> = Tombol                               │
│  • <div>Kontainer</div> = Wadah/containers                      │
│                                                                  │
│  VERSI: HTML5                                                    │
│  SYNTAX CONTOH:                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ <div>                                                    │   │
│  │   <h1>SEAPEDIA</h1>                                    │   │
│  │   <button>Login</button>                               │   │
│  │ </div>                                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### CSS

```
┌─────────────────────────────────────────────────────────────────┐
│                          CSS                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Cascading Style Sheets - Bahasa untuk MEMPERCANTIK     │
│           tampilan halaman web                                   │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  HTML  = Kerangka rumah                                          │
│  CSS   = Cat, lantai, curtain, furniture                        │
│  JS    = Listrik (membuat hidup)                                │
│                                                                  │
│  CONTOH PENGGUNAAN:                                              │
│  • Warna: color: red                                            │
│  • Ukuran: width: 100px                                         │
│  • Font: font-family: Arial                                      │
│  • Posisi: margin: 10px                                         │
│                                                                  │
│  VERSI: CSS3                                                     │
│  SYNTAX CONTOH:                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ .button {                                               │   │
│  │   background-color: blue;                               │   │
│  │   color: white;                                        │   │
│  │   padding: 10px 20px;                                  │   │
│  │   border-radius: 5px;                                  │   │
│  │ }                                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Tailwind CSS (CSS framework modern)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### SQL

```
┌─────────────────────────────────────────────────────────────────┐
│                          SQL                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Structured Query Language - Bahasa untuk               │
│           BERKOMUNIKASI dengan database                          │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Database = Gudang makanan                                       │
│  SQL      = Bahasa untuk NGAMBIL/MASUKIN makanan ke gudang       │
│                                                                  │
│  CONTOH PERINTAH:                                                │
│  • SELECT * FROM users;              → Ambil semua user        │
│  • INSERT INTO users (name) VALUES ('Budi'); → Tambah user     │
│  • UPDATE users SET name='Ani' WHERE id=1; → Update user       │
│  • DELETE FROM users WHERE id=1;    → Hapus user              │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • MySQL (database server)                                      │
│  • Query dijalankan via Eloquent ORM Laravel                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Framework & Library

### React

```
┌─────────────────────────────────────────────────────────────────┐
│                          REACT                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Library/Framework JavaScript untuk MEMBANGUN            │
│           TAMPILAN ANTARMUKA (User Interface/UI)                │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  React = Pabrik yang bikin komponen UI siap pakai                 │
│  • Ada komponen Button                                           │
│  • Ada komponen Card                                             │
│  • Tinggal rakit sesuai kebutuhan                                │
│                                                                  │
│  FITUR UTAMA:                                                    │
│  1. Component-based → Bikin UI sekali, pakai berkali-kali        │
│  2. Virtual DOM → Update halaman lebih cepat                     │
│  3. Reusable → Button, Card, Modal bisa dipakai ulang           │
│  4. State Management → Data berubah → UI update otomatis         │
│                                                                  │
│  CONTOH KOMPONEN:                                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ function Button({ label, onClick }) {                  │   │
│  │   return <button onClick={onClick}>{label}</button>;   │   │
│  │ }                                                      │   │
│  │                                                       │   │
│  │ // Penggunaan:                                         │   │
│  │ <Button label="Login" onClick={handleLogin} />        │   │
│  │ <Button label="Register" onClick={handleRegister} /> │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Landing page                                                  │
│  • Halaman produk                                                │
│  • Dashboard (Seller, Buyer, Driver)                            │
│  • Cart & Checkout                                              │
│                                                                  │
│  VERSI: React 19 (latest)                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### JSX

```
┌─────────────────────────────────────────────────────────────────┐
│                          JSX                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Sintaks/ekstensi JavaScript yang memungkinkan         │
│           kita menulis HTML di dalam JavaScript                  │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  JSX = Resep makanan yang dicampur jadi satu dokumen             │
│  (Bahan + Instruksi masak = satu halaman)                       │
│                                                                  │
│  CONTOH JSX:                                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ // JSX (ditulis di file .jsx)                          │   │
│  │ return (                                               │   │
│  │   <div className="card">                              │   │
│  │     <h1>{product.name}</h1>                           │   │
│  │     <p>Harga: Rp{product.price}</p>                   │   │
│  │   </div>                                               │   │
│  │ );                                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  CATATAN:                                                        │
│  • className (bukan class) karena 'class' reserved JS          │
│  • {} untuk masukkan variabel JavaScript                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Backend Framework

### Laravel

```
┌─────────────────────────────────────────────────────────────────┐
│                         LARAVEL                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: PHP Framework untuk MEMBANGUN aplikasi WEB            │
│           dengan cara yang lebih MUDAH dan TERSTUKTUR            │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  PHP Native = Bangun rumah dari nol (sendiri)                     │
│  Laravel   = Pabrik rumah prefab (banyak tools siap pakai)        │
│                                                                  │
│  FITUR UTAMA LARAVEL:                                            │
│  1. Eloquent ORM → Komunikasi DB pakai kode PHP, bukan SQL      │
│  2. Routing → Mudah bikin endpoint API                          │
│  3. Blade → Template engine untuk HTML                          │
│  4. Middleware → Auth, CORS, Validasi                           │
│  5. Artisan CLI → Command line tools                            │
│  6. Migrations → Kelola database versioning                     │
│  7. Authentication → Login/Register sudah siap                   │
│                                                                  │
│  ALUR REQUEST DI LARAVEL:                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Browser → Route → Middleware → Controller → Model → DB │   │
│  │              ↑                                          │   │
│  │         routes/api.php                                  │   │
│  │                                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  STRUKTUR FOLDER:                                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ app/                                                    │   │
│  │   ├── Http/Controllers/  ← Logic aplikasi             │   │
│  │   └── Models/             ← Representasi tabel DB       │   │
│  │ routes/api.php            ← Endpoint API               │   │
│  │ database/migrations/       ← Skema database             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Backend API (RESTful API)                                    │
│  • Authentication (Sanctum)                                     │
│  • Business Logic (CRUD, validation, dll)                       │
│                                                                  │
│  VERSI: Laravel 12 (latest)                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Blade

```
┌─────────────────────────────────────────────────────────────────┐
│                          BLADE                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Template engine LARAVEL untuk menulis HTML dengan      │
│           fitur tambahan (looping, conditional, dll)            │
│                                                                  │
│  KAPAN DIPAKAI:                                                  │
│  ─────────────────────────────────────────────────────────────   │
│  • Mengembalikan halaman HTML (server-side rendering)           │
│  • SEAPEDIA TIDAK menggunakan Blade untuk UI utama              │
│  • SEAPEDIA menggunakan React untuk Frontend                    │
│                                                                  │
│  KAPAN BLADE DIPAKAI DI SEAPEDIA:                               │
│  • Halaman error (404, 500)                                    │
│  • Email templates                                              │
│  • Admin panel sederhana (optional)                             │
│                                                                  │
│  CONTOH BLADE:                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ <!-- resources/views/welcome.blade.php -->              │   │
│  │ <html>                                                   │   │
│  │ <body>                                                   │   │
│  │   <h1>{{ $title }}</h1>                                │   │
│  │   @foreach($products as $product)                       │   │
│  │     <p>{{ $product->name }}</p>                        │   │
│  │   @endforeach                                           │   │
│  │ </body>                                                  │   │
│  │ </html>                                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  PENJELASAN:                                                     │
│  • {{ }} → Tampilkan variabel                                   │
│  • @foreach → Loop/iterasi                                      │
│  • @if/@else → Conditional                                     │
│                                                                  │
│  ⚠️ DI SEAPEDIA, kita fokus ke API (routes/api.php)            │
│     Frontend terpisah (React), jadi Blade jarang dipakai        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Database

### MySQL

```
┌─────────────────────────────────────────────────────────────────┐
│                          MySQL                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Database Management System (DBMS) - Sistem untuk       │
│           MENYIMPAN dan MENGELOLA data secara terstruktur        │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Excel Spreadsheet = Buku catatan sederhana                       │
│  MySQL            = Sistem arsip perusahaan (digital, advanced)   │
│                                                                  │
│  FITUR UTAMA:                                                    │
│  1. Relational Database → Data tersimpan dalam tabel             │
│  2. SQL → Bahasa untuk query                                    │
│  3. ACID → Data konsisten dan aman                              │
│  4. InnoDB → Engine penyimpanan default                          │
│  5. phpmyAdmin → GUI untuk manage database                      │
│                                                                  │
│  CONTOH STRUKTUR TABEL:                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ users                                                    │   │
│  │ ────────────                                            │   │
│  │ id (PK)     │ INTEGER, AUTO_INCREMENT                  │   │
│  │ name        │ VARCHAR(255)                             │   │
│  │ email       │ VARCHAR(255), UNIQUE                      │   │
│  │ password    │ VARCHAR(255)                              │   │
│  │ created_at  │ TIMESTAMP                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Database utama                                                │
│  • Menyimpan: Users, Products, Orders, dll                      │
│                                                                  │
│  VERSI: MySQL 8.x                                                │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • PostgreSQL (lebih advanced)                                  │
│  • SQLite (local, simple)                                       │
│  • MariaDB (fork MySQL)                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Build Tools

### Vite

```
┌─────────────────────────────────────────────────────────────────┐
│                          VITE                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Next-generation build tool & dev server untuk          │
│           JavaScript/TypeScript applications                     │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Tanpa Vite = Masak pakai kompor tradisional (lama)               │
│  Dengan Vite = Masak pakai kompor gas modern (cepat)            │
│                                                                  │
│  FITUR UTAMA:                                                    │
│  1. Lightning-fast HMR (Hot Module Replacement)                 │
│     → Perubahan kode langsung terlihat tanpa reload              │
│  2. Native ES Modules → Tidak perlu bundler berat                │
│  3. Instant Server Start → Server langsung nyala                 │
│  4. Optimized Builds → File production lebih kecil               │
│                                                                  │
│  CARA KERJA:                                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ DEV MODE:                                                │   │
│  │ Browser ──── ES Modules ──── Vite ──── Source Files     │   │
│  │              (native, fast)     (transforms on demand)   │   │
│  │                                                         │   │
│  │ PRODUKSI:                                                │   │
│  │ Source Files ──── Vite ──── Bundle ──── dist/           │   │
│  │               (build, optimize, bundle)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Development server React (npm run dev)                        │
│  • Build production (npm run build)                             │
│                                                                  │
│  VERSI: Vite 8.x (latest)                                      │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • Webpack (lebih lama, lebih kompleks)                         │
│  • Parcel (simpler)                                             │
│  • esbuild (faster, tapi untuk bundling)                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Node.js

```
┌─────────────────────────────────────────────────────────────────┐
│                         NODE.JS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: JavaScript Runtime - Memungkinkan JavaScript          │
│           berjalan di SERVER (bukan di browser)                  │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Browser JS = Ikan di laut                                       │
│  Node.js   = Ikan yang dipindahkan ke akuarium (server)          │
│                                                                  │
│  BIASA DIGUNAKAN UNTUK:                                          │
│  • Running React Development Server                             │
│  • npm (Node Package Manager)                                   │
│  • Build tools (Vite, Webpack)                                  │
│  • Running scripts                                               │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Menjalankan React (via Vite)                                 │
│  • Package management (npm)                                     │
│                                                                  │
│  VERSI: Node.js 20.x LTS                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Package Manager

### npm (Node Package Manager)

```
┌─────────────────────────────────────────────────────────────────┐
│                           NPM                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Package manager untuk JavaScript/Node.js               │
│           (Menginstall, update, dan manage library/dependencies)  │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  npm = Toko aplikasi untuk JavaScript                            │
│  • Mau aplikasi "Auth"? → npm install laravel/sanctum           │
│  • Mau aplikasi "HTTP"? → npm install axios                     │
│                                                                  │
│  COMMAND UTAMA:                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ npm install                    → Install semua dependencies│   │
│  │ npm install <package>         → Install 1 package        │   │
│  │ npm install -D <package>      → Install dev dependency   │   │
│  │ npm uninstall <package>       → Hapus package            │   │
│  │ npm run dev                  → Jalankan dev server      │   │
│  │ npm run build                → Build production         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  FILE PENTING:                                                   │
│  • package.json → Daftar dependencies                           │
│  • package-lock.json → Versi pasti semua package               │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Menginstall React libraries                                  │
│  • Menginstall Tailwind CSS                                     │
│  • Menginstall Vite                                             │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • yarn (faster, dari Facebook)                                 │
│  • pnpm (efficient, dari Zack)                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Composer

```
┌─────────────────────────────────────────────────────────────────┐
│                         COMPOSER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Package manager untuk PHP                              │
│           (Seperti npm tapi untuk PHP)                          │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Composer = Toko buku untuk PHP                                  │
│  • Mau library "Auth"? → composer require laravel/sanctum        │
│  • Mau library "Image"? → composer require intervention/image   │
│                                                                  │
│  COMMAND UTAMA:                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ composer install          → Install semua dependencies     │   │
│  │ composer require <pkg>   → Install 1 package              │   │
│  │ composer update         → Update semua packages          │   │
│  │ composer dump-autoload  → Regenerate autoload            │   │
│  │ composer dump-autoload  → Regenerate autoload            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  FILE PENTING:                                                   │
│  • composer.json → Daftar dependencies PHP                       │
│  • composer.lock → Versi pasti semua package                   │
│  • vendor/ → Folder tempat packages terinstall                  │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Install Laravel                                              │
│  • Install Laravel Sanctum (auth)                               │
│  • Install Faker (data dummy)                                   │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • Tidak ada alternatif mainstream yang sebanding              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Authentication

### Laravel Sanctum

```
┌─────────────────────────────────────────────────────────────────┐
│                     LARAVEL SANCTUM                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Package Laravel untuk Authentication API               │
│           (Login, logout, token management)                      │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Tanpa Sanctum = Tamu masuk rumah tanpa ID card                   │
│  Dengan Sanctum = Tamu harus scan ID card (token) untuk masuk    │
│                                                                  │
│  CARA KERJA:                                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  1. User Login (POST /api/auth/login)                   │   │
│  │     Server: "Email & password benar!"                    │   │
│  │     Server: "Ini token kamu: abc123xyz"                  │   │
│  │                                                         │   │
│  │  2. Request berikutnya                                  │   │
│  │     Client: "GET /api/cart"                             │   │
│  │     Header: Authorization: Bearer abc123xyz              │   │
│  │     Server: "Token valid! Ambil data cart Budi..."      │   │
│  │                                                         │   │
│  │  3. User Logout (POST /api/auth/logout)                 │   │
│  │     Server: "Token invalidated!"                         │   │
│  │                                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  JENIS TOKEN:                                                    │
│  1. Cookie-based (SPA) → Token disimpan di cookie browser       │
│     → Cocok untuk React (kita pakai ini)                        │
│  2. Token-based (API) → Token dikirim manual di header          │
│     → Cocok untuk mobile app atau third-party                    │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Login/Register user                                          │
│  • Session management                                           │
│  • Role-based access control                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. CSS Framework

### Tailwind CSS

```
┌─────────────────────────────────────────────────────────────────┐
│                       TAILWIND CSS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: CSS Framework yang menggunakan utility classes        │
│           (bikin styling langsung di HTML tanpa file CSS baru)   │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  CSS Biasa = Beli bahan mentah, masak sendiri                    │
│  Tailwind  = Beli makanan siap saji (tinggal panaskan)           │
│                                                                  │
│  CONTOH:                                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ <!-- CSS Biasa -->                                       │   │
│  │ <style>                                                 │   │
│  │   .btn { background: blue; color: white; padding: 10px }│   │
│  │ </style>                                                │   │
│  │ <button class="btn">Kirim</button>                     │   │
│  │                                                         │   │
│  │ <!-- Tailwind CSS -->                                   │   │
│  │ <button class="bg-blue-500 text-white px-4 py-2">     │   │
│  │   Kirim                                                    │   │
│  │ </button>                                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  KEUNTUNGAN TAILWIND:                                            │
│  1. Faster development → Nggak perlu bolak-balik file CSS       │
│  2. Consistent design → Sudah ada design system                  │
│  3. Responsive by default → tinggal tambah prefix (md:, lg:)    │
│  4. Customizable → Bikin design system sendiri                  │
│                                                                  │
│  CONTOH UTILITY CLASSES:                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Layout:                                                   │   │
│  │   flex, grid, block, hidden                             │   │
│  │   w-10, h-10, p-4, m-2                                 │   │
│  │                                                         │   │
│  │ Colors:                                                  │   │
│  │   bg-blue-500, text-white, border-red-300               │   │
│  │                                                         │   │
│  │ Typography:                                              │   │
│  │   text-lg, font-bold, text-center                       │   │
│  │                                                         │   │
│  │ Spacing:                                                 │   │
│  │   mt-4, mb-2, px-6, py-3                                │   │
│  │                                                         │   │
│  │ Responsive:                                              │   │
│  │   md:flex, lg:w-1/2, sm:hidden                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Semua styling frontend                                       │
│  • Component styling (Card, Button, Navbar)                      │
│  • Responsive design                                           │
│                                                                  │
│  VERSI: Tailwind CSS 3.4 (latest)                               │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • Bootstrap (popular, komponen siap pakai)                      │
│  • Material UI (design system Google)                           │
│  • Chakra UI (React-specific)                                   │
│  • Plain CSS (tanpa framework)                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. API & Communication

### REST API

```
┌─────────────────────────────────────────────────────────────────┐
│                        REST API                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Arsitektur/standar untuk komunikasi antar aplikasi     │
│           melalui HTTP protocol                                 │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  REST API = Pelayan restoran                                     │
│  • Customer (Frontend) pesan makanan                             │
│  • Pelayan (API) sampaikan ke dapur (Backend)                   │
│  • Pelayan (API) bawa makanan ke customer                       │
│                                                                  │
│  HTTP METHODS:                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ GET    → Ambil data (READ)                              │   │
│  │ POST   → Buat data baru (CREATE)                        │   │
│  │ PUT    → Update seluruh data (UPDATE)                   │   │
│  │ DELETE → Hapus data (DELETE)                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  CONTOH ENDPOINT:                                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ GET    /api/products       → Ambil semua produk         │   │
│  │ GET    /api/products/1     → Ambil produk ID 1          │   │
│  │ POST   /api/products       → Buat produk baru           │   │
│  │ PUT    /api/products/1     → Update produk ID 1        │   │
│  │ DELETE /api/products/1     → Hapus produk ID 1         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  CONTOH REQUEST/RESPONSE:                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ // GET /api/products                                    │   │
│  │                                                         │   │
│  │ Response:                                               │   │
│  │ {                                                      │   │
│  │   "success": true,                                     │   │
│  │   "data": [                                            │   │
│  │     {"id": 1, "name": "Nasi Goreng", "price": 25000}, │   │
│  │     {"id": 2, "name": "Ayam Geprek", "price": 22000}  │   │
│  │   ]                                                    │   │
│  │ }                                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • React (Frontend) ←→ Laravel (Backend) via REST API           │
│  • Semua fitur: Auth, Products, Cart, Orders, dll               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Axios

```
┌─────────────────────────────────────────────────────────────────┐
│                          AXIOS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: HTTP Client library untuk JavaScript                   │
│           (Memudahkan ngirim HTTP request)                      │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  fetch() = Kirim surat manual (alamat, amplop, cara sendiri)   │
│  axios   = Pakai jasa ekspedisi (udah ada template)             │
│                                                                  │
│  CONTOH:                                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ // Dengan fetch                                          │   │
│  │ fetch('http://localhost:8000/api/products')              │   │
│  │   .then(res => res.json())                              │   │
│  │   .then(data => console.log(data));                     │   │
│  │                                                         │   │
│  │ // Dengan axios (lebih clean)                           │   │
│  │ axios.get('/api/products')                              │   │
│  │   .then(res => console.log(res.data));                  │   │
│  │                                                         │   │
│  │ // Async/await (paling recommended)                     │   │
│  │ const response = await axios.get('/api/products');     │   │
│  │ console.log(response.data);                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  KEUNTUNGAN AXIOS:                                               │
│  1. Syntax lebih clean & readable                               │
│  2. Auto JSON transform                                         │
│  3. Interceptors (modifikasi request/response)                  │
│  4. Error handling lebih baik                                   │
│  5. Cancel request                                              │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Semua API call dari React ke Laravel                         │
│  • Auth, Products, Cart, Orders, dll                            │
│                                                                  │
│  VERSI: Axios 1.x                                                │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • fetch() (built-in browser)                                   │
│  • ky (simpler, dari Sindre)                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. State Management

### Zustand

```
┌─────────────────────────────────────────────────────────────────┐
│                         ZUSTAND                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: State management library untuk React                   │
│           (Menyimpan data yang bisa diakses di mana-mana)       │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  State = Kulkas di dapur (tempat menyimpan bahan)                │
│  • Tanpa state management = Harus turun ke basement tiap mau     │
│    ambil bahan                                                    │
│  • Dengan Zustand = Kulkas ada di setiap sudut rumah           │
│                                                                  │
│  KENAPA BUTUH STATE MANAGEMENT?                                  │
│  1. Data perlu diakses di banyak halaman                         │
│  2. Data berubah → semua komponen perlu update                   │
│  3. Prop drilling = Gampang kirim data ke child (OK)           │
│  4. Tapi prop drilling berkali-kali = BAHAYA (avoid this)       │
│                                                                  │
│  CONTOH ZUSTAND:                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ import { create } from 'zustand';                       │   │
│  │                                                         │   │
│  │ const useAuthStore = create((set) => ({                │   │
│  │   user: null,                                          │   │
│  │   isAuthenticated: false,                               │   │
│  │   login: (userData) => set({ user: userData,          │   │
│  │                        isAuthenticated: true }),         │   │
│  │   logout: () => set({ user: null,                      │   │
│  │                  isAuthenticated: false }),             │   │
│  │ }));                                                   │   │
│  │                                                         │   │
│  │ // Penggunaan di component:                             │   │
│  │ function Navbar() {                                    │   │
│  │   const { user, isAuthenticated, logout } =            │   │
│  │     useAuthStore();                                     │   │
│  │   // ... render navbar                                 │   │
│  │ }                                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Auth state (user login, role)                                │
│  • Cart state (items di keranjang)                              │
│  • UI state (loading, errors)                                   │
│                                                                  │
│  VERSI: Zustand 5.x (latest)                                    │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • Redux (more complex, more features)                          │
│  • Context API (built-in React)                                 │
│  • Recoil (from Facebook)                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Routing

### React Router DOM

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT ROUTER DOM                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Library routing untuk React                           │
│           (Memudahkan navigasi antar halaman)                   │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Tanpa Router = Harus reload browser tiap pindah halaman          │
│  Dengan Router = Pindah halaman INSTAN tanpa reload              │
│                                                                  │
│  CONTOH ROUTING:                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ // App.jsx                                              │   │
│  │ import { BrowserRouter, Routes, Route } from           │   │
│  │   'react-router-dom';                                  │   │
│  │ import Home from './pages/Home';                        │   │
│  │ import Products from './pages/Products';                │   │
│  │ import Login from './pages/Login';                     │   │
│  │                                                         │   │
│  │ function App() {                                       │   │
│  │   return (                                              │   │
│  │     <BrowserRouter>                                     │   │
│  │       <Routes>                                          │   │
│  │         <Route path="/" element={<Home />} />          │   │
│  │         <Route path="/products" element={<Products />} />│  │
│  │         <Route path="/login" element={<Login />} />    │   │
│  │       </Routes>                                         │   │
│  │     </BrowserRouter>                                    │   │
│  │   );                                                    │   │
│  │ }                                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  JENIS ROUTE:                                                    │
│  1. Public Route → Semua orang bisa akses                       │
│     /, /products, /login, /register                             │
│                                                                  │
│  2. Protected Route → Hanya user login                          │
│     /dashboard, /cart, /orders                                  │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Navigasi antar halaman                                       │
│  • Protected routes (dashboard)                                  │
│  • URL parameters (/products/:id)                               │
│                                                                  │
│  VERSI: React Router 7.x (latest)                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Version Control

### Git

```
┌─────────────────────────────────────────────────────────────────┐
│                           GIT                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Version Control System - Sistem untuk MELACAK          │
│           PERUBAHAN kode seiring waktu                          │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Tanpa Git = Nulis tugas di kertas, tiap revisi overwrite        │
│  Dengan Git = Nulis tugas di Google Docs (auto save, history)   │
│                                                                  │
│  FITUR UTAMA:                                                    │
│  1. Versioning → Bisa kembali ke versi sebelumnya               │
│  2. Branching → Kerja di fitur baru tanpa ganggu yang lain      │
│  3. Collaboration → Banyak orang kerja bareng                   │
│  4. Backup → Kode tersimpan di cloud (GitHub)                  │
│                                                                  │
│  COMMAND UTAMA:                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ git init              → Inisialisasi repo baru          │   │
│  │ git add .             → Tandai file untuk di-commit    │   │
│  │ git commit -m "msg"   → Simpan perubahan                │   │
│  │ git push              → Upload ke remote (GitHub)       │   │
│  │ git pull              → Download perubahan terbaru      │   │
│  │ git branch            → Lihat branch                    │   │
│  │ git checkout -b new   → Buat branch baru               │   │
│  │ git merge             → Gabung branch                  │   │
│  │ git status            → Lihat status file              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Track perubahan kode                                          │
│  • Kolaborasi tim                                                │
│  • Backup otomatis                                              │
│                                                                  │
│  VERSI: Git 2.x                                                  │
│                                                                  │
│  REMOTE HOSTING:                                                 │
│  • GitHub (popular)                                             │
│  • GitLab                                                       │
│  • BitBucket                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Server

### Apache

```
┌─────────────────────────────────────────────────────────────────┐
│                         APACHE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Web server - Software yang MENYAJIKAN halaman web      │
│           kepada browser/user                                   │
│                                                                  │
│  ANALOGI:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  Web Server = Pelayan hotel                                     │
│  • Tamu (browser) datang                                        │
│  • Pelayan (Apache) layani kamar (halaman web)                  │
│  • Tamu nggak perlu tau dapur di mana (server这边)               │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • XAMPP includes Apache                                        │
│  • Untuk development local                                      │
│  • Bisa juga pakai PHP built-in server (php artisan serve)      │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • Nginx (lebih performant, popular untuk production)           │
│  • PHP Built-in Server (untuk development sederhana)             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### XAMPP

```
┌─────────────────────────────────────────────────────────────────┐
│                         XAMPP                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APA ITU: Paket software all-in-one untuk development web       │
│           (X = Cross-platform, A = Apache, M = MySQL/MariaDB,  │
│            P = PHP, P = Perl)                                   │
│                                                                  │
│  YANG ADA DI XAMPP:                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │  Apache     → Web Server                                 │   │
│  │  MySQL      → Database Server                            │   │
│  │  PHP        → PHP Interpreter                           │   │
│  │  phpMyAdmin → GUI untuk manage MySQL (browser-based)     │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  KAPAN PAKAI XAMPP?                                              │
│  • Development local (development)                              │
│  • Belajar PHP & MySQL                                          │
│  • Testing sebelum deploy                                       │
│                                                                  │
│  DI SEAPEDIA:                                                    │
│  • Local development                                            │
│  • Running MySQL database                                       │
│  • phpMyAdmin untuk manage database                             │
│                                                                  │
│  ALTERNATIF:                                                     │
│  • WAMP (Windows Apache MySQL PHP)                              │
│  • MAMP (Mac Apache MySQL PHP)                                  │
│  • Laragon (khusus Laravel development)                        │
│  • Docker (container-based, lebih advanced)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. Glosarium Singkat

```
┌─────────────────────────────────────────────────────────────────┐
│                    GLOSARIUM ISTILAH                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TERM              │ PENJELASAN                                  │
│  ──────────────────┼───────────────────────────────────────────  │
│  Frontend          │ Tampilan website yang dilihat user           │
│  Backend           │ Logic di server (tidak dilihat user)        │
│  Full-Stack        │ Frontend + Backend                         │
│  API               │ Interface komunikasi antar aplikasi          │
│  Framework         │ Kerangka kerja untuk mempercepat coding     │
│  Library           │ Kumpulan kode siap pakai                     │
│  Package           │ Kode pihak ketiga yang bisa diinstall       │
│  Dependency        │ Package yang dibutuhkan package lain        │
│  Compiler          │ Menerjemahkan kode ke bahasa mesin          │
│  Transpiler        │ Menerjemahkan JS modern ke JS lama          │
│  Bundler           │ Menggabungkan banyak file jadi satu         │
│  Minifier          │ Mengecilkan file (hapus spasi, dll)        │
│  Runtime           │ Lingkungan untuk menjalankan kode            │
│  CLI               │ Command Line Interface (terminal)           │
│  IDE               │ Integrated Development Environment          │
│  (VS Code)        │                                              │
│  SDK               │ Software Development Kit                    │
│  ORM               │ Object-Relational Mapping                   │
│  (Eloquent)       │                                              │
│  Migration         │ Script untuk membuat tabel database        │
│  Seeder            │ Script untuk mengisi data awal             │
│  Factory           │ Template untuk generate data fake           │
│  Middleware        │ Kode yang jalan sebelum/sesudah request     │
│  Controller        │ Pengendali logic untuk endpoint             │
│  Model             │ Representasi tabel database                 │
│  Route             │ Endpoint URL                               │
│  View              │ Tampilan HTML (Blade)                      │
│  Component         │ UI building block di React                  │
│  Props             │ Data yang dikirim ke component              │
│  State             │ Data internal component (bisa berubah)      │
│  Hook              │ Fungsi khusus React                        │
│  Context           │ State global di React                       │
│  CSR               │ Client-Side Rendering (React)              │
│  SSR               │ Server-Side Rendering (Laravel Blade)      │
│  SPA               │ Single Page Application (React)            │
│  PWA               │ Progressive Web App                         │
│  JWT               │ JSON Web Token (auth)                      │
│  HTTPS             │ HTTP Secure (enkripsi)                      │
│  localhost         │ Komputer sendiri (127.0.0.1)               │
│  port              │ Jalur/port untuk koneksi                   │
│  localhost:8000    │ Laravel server                              │
│  localhost:5173    │ React dev server                           │
│  localhost/phpmyadmin │ GUI untuk MySQL                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Ringkasan Tech Stack SEAPEDIA

```
┌─────────────────────────────────────────────────────────────────┐
│                  TECH STACK SEAPEDIA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    FRONTEND                             │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Bahasa:     JavaScript (JSX)                         │    │
│  │  Framework:  React 19                                 │    │
│  │  Styling:    Tailwind CSS 3.4                         │    │
│  │  Build Tool: Vite 8                                   │    │
│  │  Routing:    React Router DOM 7                       │    │
│  │  HTTP:       Axios 1                                 │    │
│  │  State:      Zustand 5                               │    │
│  │  Package:    npm                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    BACKEND                              │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Bahasa:     PHP 8.2+                                 │    │
│  │  Framework:  Laravel 12                               │    │
│  │  Template:   Blade (jarang dipakai)                   │    │
│  │  Auth:       Laravel Sanctum                          │    │
│  │  ORM:        Eloquent                                 │    │
│  │  Package:    Composer                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    DATABASE                             │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  DBMS:       MySQL 8                                 │    │
│  │  GUI:        phpMyAdmin                              │    │
│  │  Management: XAMPP                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    INFRASTRUCTURE                       │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  VCS:        Git                                     │    │
│  │  Web Server: Apache (via XAMPP)                       │    │
│  │  Dev Server: php artisan serve (Laravel)              │    │
│  │  API Port:   localhost:8000                          │    │
│  │  Front Port:  localhost:5173                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagram Alur Teknologi

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SEAPEDIA FLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│     USER                                                                  │
│       │                                                                  │
│       ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      BROWSER (User Interface)                    │   │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │   │
│  │  │   React      │ │    Tailwind   │ │ React Router  │         │   │
│  │  │  (Component) │ │   (Styling)  │ │  (Routing)    │         │   │
│  │  └───────┬───────┘ └───────────────┘ └───────────────┘         │   │
│  │          │                                                       │   │
│  │          │ axios (HTTP Request)                                 │   │
│  │          ▼                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │              HTTP Request (JSON)                          │ │   │
│  │  │              GET/POST /api/products                        │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│       │                                                                  │
│       │ localhost:8000                                               │
│       ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    LARAVEL BACKEND                               │   │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │   │
│  │  │  Sanctum      │ │  Eloquent    │ │  Controllers  │         │   │
│  │  │ (Auth)        │ │  (ORM)       │ │ (Logic)       │         │   │
│  │  └───────────────┘ └───────────────┘ └───────────────┘         │   │
│  │          │                                                       │   │
│  │          │ Query                                                 │   │
│  │          ▼                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │                     MySQL Database                         │ │   │
│  │  │  users │ products │ orders │ wallets │ transactions │ ...  │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│     Tools yang dipakai:                                                   │
│     • Development: npm (frontend), composer (backend)                   │
│     • Versioning: Git                                                    │
│     • Server: Apache (XAMPP) + PHP built-in                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

*Dokumentasi ini adalah referensi pelengkap untuk pembelajaran SEAPEDIA*
*Tanggal: 2026-07-05*
