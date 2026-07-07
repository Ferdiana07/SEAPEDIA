# BAB 1: Setup Environment & Project Structure

> **Tujuan:** Menginstal semua tools yang dibutuhkan dan membuat struktur project SEAPEDIA

---

## 1.1 Overview - Tools yang Dibutuhkan

Sebelum mulai coding, kita perlu menyiapkan **alat-alat** yang akan digunakan:

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOOLS YANG AKAN DIINSTALL                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  NODE.JS                                                │    │
│  │  • JavaScript Runtime - untuk menjalankan React         │    │
│  │  • Includes: npm (package manager)                      │    │
│  │  • Download: https://nodejs.org                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PHP + XAMPP                                            │    │
│  │  • PHP: Bahasa pemrograman untuk Laravel Backend        │    │
│  │  • XAMPP: Paket termasuk Apache + MySQL + phpMyAdmin    │    │
│  │  • Download: https://www.apachefriends.org              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  COMPOSER                                               │    │
│  │  • PHP Package Manager - untuk install Laravel          │    │
│  │  • Download: https://getcomposer.org/download           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  GIT                                                    │    │
│  │  • Version Control - untuk tracking perubahan kode      │    │
│  │  • Download: https://git-scm.com                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.2 Install Node.js

### Apa itu Node.js?

Node.js adalah **JavaScript Runtime** yang memungkinkan kita menjalankan JavaScript di luar browser. Di butuhkan untuk:
- Menjalankan React (frontend framework)
- Menjalankan Vite (build tool)
- Menggunakan npm (package manager untuk JavaScript)

### Langkah Install

```
1. Buka https://nodejs.org
2. Klik tombol "LTS" (Recommended for most users)
3. Download file .msi
4. Jalankan installer
5. Klik "Next" terus sampai selesai
6. ✅ Selesai!
```

### Verifikasi

```bash
node --version
# Output: v20.10.0

npm --version
# Output: 10.2.1
```

---

## 1.3 Install XAMPP (PHP + MySQL)

### Kenapa XAMPP?

XAMPP adalah paket **all-in-one** yang sudah termasuk:
- **PHP** - Bahasa pemrograman backend
- **Apache** - Web server
- **MySQL/MariaDB** - Database
- **phpMyAdmin** - GUI untuk mengelola database

### Langkah Install

```
1. Buka https://www.apachefriends.org
2. Download XAMPP untuk Windows
3. Jalankan installer
4. SAAT INSTALL, centang:
   ☑️ Apache
   ☑️ MySQL
   ☑️ PHP
5. Klik "Next" sampai selesai
```

### Verifikasi XAMPP

```
1. Buka "XAMPP Control Panel"
2. Klik "Start" di Apache
3. Klik "Start" di MySQL
4. Buka browser, ketik: http://localhost
5. Harus muncul halaman XAMPP
```

### phpMyAdmin

Buka browser, ketik: `http://localhost/phpmyadmin`

Ini adalah **GUI (Graphical User Interface)** untuk mengelola database MySQL.

---

## 1.4 Install Composer

### Apa itu Composer?

Composer adalah **package manager untuk PHP** (seperti npm untuk JavaScript). Dibutuhkan untuk:
- Menginstall Laravel
- Menginstall library PHP lainnya

### Langkah Install

```
OPSI 1: Download dari Website (Recommended)
1. Buka https://getcomposer.org/download
2. Download Composer-Setup.exe
3. Jalankan installer
4. SAAT INSTALL, akan diminta path PHP
   → Arahkan ke: C:\xampp\php\php.exe
5. Selesai

OPSI 2: Via Command Line
1. Buka Command Prompt
2. Jalankan:
   php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
   php composer-setup.php
   php -r "unlink('composer-setup.php');"
3. Pindahkan composer.phar ke PATH:
   move composer.phar C:\php\composer.bat
```

### Verifikasi

```bash
composer --version
# Output: Composer version 2.x.x
```

---

## 1.5 Install Git

### Apa itu Git?

Git adalah **Version Control System** - alat untuk:
- Melacak perubahan kode
- Bekerja sama dengan developer lain
- Backup kode

### Langkah Install

```
1. Buka https://git-scm.com/download/win
2. Download otomatis start
3. Jalankan installer
4. SETIAP STEP PAKAI DEFAULT (klik Next aja)
   ⚠️ WAJIB: Pada step "Choosing the default editor"
             pilih "Use Notepad++" atau "Use Vim"
             (JANGAN pilih Nano, itu ribet)
5. Selesai
```

### Verifikasi

```bash
git --version
# Output: git version 2.x.x
```

---

## 1.6 Checklist Tools

```
┌─────────────────────────────────────────────────────────────────┐
│                   CHECKLIST INSTALLATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tool        │ Command Verifikasi     │ Status                  │
│  ────────────┼────────────────────────┼───────────────        │
│  Node.js     │ node --version        │ ☐                        │
│  npm         │ npm --version         │ ☐                        │
│  PHP         │ php --version         │ ☐                        │
│  Composer    │ composer --version    │ ☐                        │
│  Git         │ git --version         │ ☐                        │
│  MySQL       │ via XAMPP             │ ☐                        │
│                                                                  │
│  XAMPP Services:                                                │
│  ☑️ Apache   → Running (http://localhost)                     │
│  ☑️ MySQL   → Running (http://localhost/phpmyadmin)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.7 Membuat Project Laravel Backend

### Arsitektur Request-Response di Laravel

```
┌─────────────────────────────────────────────────────────────────┐
│                      LARAVEL FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Browser/React                                                 │
│       │                                                         │
│       │ HTTP Request (JSON)                                     │
│       ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 1. ROUTES (routes/api.php)                               │   │
│   │    → "Route mana yang match dengan request ini?"        │   │
│   └─────────────────────────────────────────────────────────┘   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 2. MIDDLEWARE (auth, cors, etc.)                        │   │
│   │    → "Request ini boleh masuk?"                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 3. CONTROLLER (app/Http/Controllers)                   │   │
│   │    → "Apa yang harus dilakukan?"                        │   │
│   │    → Business Logic                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 4. MODEL (app/Models)                                   │   │
│   │    → "Ambil data dari database"                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 5. DATABASE (MySQL)                                     │   │
│   │    → SELECT, INSERT, UPDATE, DELETE                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│       │                                                         │
│       ▼                                                         │
│   HTTP Response (JSON)                                          │
│       │                                                         │
│       ▼                                                         │
│   Browser/React                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Struktur Folder Laravel

```
seapedia-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/        ← Logic utama aplikasi
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   └── OrderController.php
│   │   ├── Middleware/        ← Auth, CORS, dll
│   │   └── Requests/          ← Form validation
│   ├── Models/               ← Eloquent ORM (tabel → objek)
│   │   ├── User.php
│   │   ├── Product.php
│   │   └── Order.php
│   ├── Providers/            ← Service providers
│   └── ...
├── bootstrap/               ← Inisialisasi aplikasi
├── config/                  ← Konfigurasi (database, mail, dll)
├── database/
│   ├── migrations/          ← Script membuat tabel
│   ├── seeders/             ← Data awal
│   └── factories/           ← Datafaker untuk testing
├── routes/
│   ├── api.php              ← Endpoint API (INI YANG PENTING!)
│   └── web.php              ← Endpoint Web (HTML pages)
├── storage/                 ← File storage
├── tests/                   ← Unit testing
├── .env                     ← Environment variables (RAHASIA)
├── .gitignore               ← File yang tidak di-commit
├── artisan                  ← CLI command
├── composer.json            ← PHP dependencies
└── phpunit.xml             ← Testing config
```

### Membuat Project Laravel

```bash
# 1. Buka terminal di folder SEAPEDIA
cd e:\PROJEKAN GABUT\SEAPEDIA

# 2. Buat project Laravel baru
composer create-project laravel/laravel seapedia-backend

# ⏳ TUNGGU 3-5 MENIT - Composer mendownload semua dependencies

# 3. Masuk ke folder
cd seapedia-backend

# 4. Generate Application Key
php artisan key:generate

# Output: Application key set successfully.
```

### Troubleshooting Install Laravel

```
MASALAH: extention not found / PDO Exception
SOLUSI:
1. Buka C:\xampp\php\php.ini
2. Cari (Ctrl+F): extension=pdo_mysql
3. Hapus ; di depan baris tersebut
4. Cari: extension=mbstring
5. Hapus ; di depan baris tersebut
6. Restart terminal
```

---

## 1.8 Membuat React + Vite Frontend

### Kenapa Vite?

**Vite** adalah build tool modern untuk frontend:
- ⚡ Hot Reload INSTAN (perubahan langsung terlihat)
- 📦 ES Modules native
- 🎯 Easy React + Vue + Svelte setup
- 🚀 DX (Developer Experience) yang bagus

### Membuat Project React

```bash
# 1. Buka terminal baru (pisahkan dari Laravel)

# 2. Masuk ke folder SEAPEDIA
cd e:\PROJEKAN GABUT\SEAPEDIA

# 3. Buat project Vite dengan template React
npm create vite@latest seapedia-frontend -- --template react

# ⏳ TUNGGU

# 4. Masuk ke folder frontend
cd seapedia-frontend

# 5. Install dependencies
npm install

# ⏳ TUNGGU
```

### Install Package Tambahan

```bash
# Install dependencies tambahan
npm install react-router-dom axios zustand

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Init Tailwind config
npx tailwindcss init -p
```

### Penjelasan Package

| Package | Fungsi |
|---------|--------|
| `react-router-dom` | Routing - navigasi antar halaman |
| `axios` | HTTP Client - panggil API Laravel |
| `zustand` | State Management - simpan state global |
| `tailwindcss` | CSS Framework - styling cepat |
| `postcss` | CSS Processor - untuk Tailwind |
| `autoprefixer` | Auto CSS prefix untuk browser |

---

## 1.9 Setup Tailwind CSS

### Langkah Setup

```bash
# 1. Buat tailwind config
npx tailwindcss init -p

# Akan membuat file:
# - tailwind.config.js
# - postcss.config.js
```

### Konfigurasi tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Tambahkan Tailwind ke CSS

Buka `src/index.css`, **GANTI SEMUA ISI** dengan:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Tailwind Directives Explained

```css
@tailwind base;      /* Reset CSS / normalize */
@tailwind components; /* Komponen kustom (.btn, .card) */
@tailwind utilities;  /* Utility classes (flex, mt-4, text-center) */
```

---

## 1.10 Konfigurasi Project

### Struktur Folder Final

```
SEAPEDIA/
│
├── seapedia-backend/          ← Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/api.php         ← Endpoint API
│   ├── .env                   ← Konfigurasi
│   ├── artisan                ← CLI
│   └── composer.json
│
├── seapedia-frontend/         ← React Frontend
│   ├── src/
│   │   ├── components/       ← UI Components
│   │   ├── pages/            ← Halaman
│   │   ├── hooks/           ← Custom Hooks
│   │   ├── contexts/        ← React Context
│   │   ├── services/        ← API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── docs/                     ← Dokumentasi
```

### Konfigurasi .env Laravel

Buka `seapedia-backend/.env`, pastikan isinya:

```env
APP_NAME=SEAPEDIA
APP_ENV=local
APP_KEY=base64:xxxxx  # Sudah di-generate oleh key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=seapedia
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# CORS - Penting untuk React
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### Membuat Database MySQL

```
OPSI 1: Via phpMyAdmin (Gampang)
1. Buka http://localhost/phpmyadmin
2. Klik "Databases" di menu atas
3. Isi nama: seapedia
4. Collation: utf8mb4_unicode_ci
5. Klik "Create"

OPSI 2: Via Command Line
1. Buka terminal
2. mysql -u root
3. CREATE DATABASE seapedia;
4. SHOW DATABASES;
5. EXIT;
```

---

## 1.11 Git Setup

### Inisialisasi Repository

```bash
# 1. Buka terminal di folder SEAPEDIA
cd e:\PROJEKAN GABUT\SEAPEDIA

# 2. Init git
git init

# 3. Buat .gitignore
# Buat file .gitignore dengan isi berikut:
```

### File .gitignore

```
# Laravel
/vendor
/node_modules
.env
.env.backup
.env.production
.phpunit.result.cache
storage/*.key
npm-debug.log
yarn-error.log

# React
/dist
/build
*.local

# IDE
.vscode/*
!.vscode/settings.json
.idea
*.sw?

# OS
.DS_Store
Thumbs.db
```

### Commit Awal

```bash
git add .
git commit -m "Initial commit - SEAPEDIA project structure"
```

---

## 1.12 Menjalankan Development Server

### Terminal 1: Laravel Backend

```bash
# Buka terminal baru
cd e:\PROJEKAN GABUT\SEAPEDIA\seapedia-backend

# Jalankan server
php artisan serve

# Output:
# INFO  Server running on [http://localhost:8000].

# ✅ Backend running di http://localhost:8000
```

### Terminal 2: React Frontend

```bash
# Buka terminal baru
cd e:\PROJEKAN GABUT\SEAPEDIA\seapedia-frontend

# Jalankan dev server
npm run dev

# Output:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help

# ✅ Frontend running di http://localhost:5173
```

### Browser Preview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER TEST                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Buka Browser:                                                  │
│                                                                  │
│  http://localhost:8000   → Halaman default Laravel             │
│                            → Seharusnya tampil "Laravel"        │
│                                                                  │
│  http://localhost:5173   → Halaman default React               │
│                            → Seharusnya tampil counter app     │
│                                                                  │
│  ✅ Jika keduanya tampil, berarti setup BERHASIL!               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.13 Konsep Penting yang Sudah Dipelajari

### Perbedaan npm dan Composer

| Aspect | npm | Composer |
|--------|-----|----------|
| Untuk | JavaScript/Node.js | PHP |
| Managed | Frontend dependencies | PHP libraries |
| Command | `npm install` | `composer install` |
| Config File | `package.json` | `composer.json` |
| Lock File | `package-lock.json` | `composer.lock` |

### Perbedaan php artisan dan npm

| Command | Fungsi |
|---------|--------|
| `php artisan` | Laravel CLI - migrate, seed, serve, dll |
| `npm run dev` | Vite dev server - hot reload |
| `npm run build` | Build untuk production |

### routes/api.php vs routes/web.php

| File | Fungsi |
|------|--------|
| `routes/api.php` | Endpoint API (REST API) - return JSON |
| `routes/web.php` | Halaman web (HTML) - return Blade views |

### Konsep CORS

```
┌─────────────────────────────────────────────────────────────────┐
│                         CORS ERROR                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  React (http://localhost:5173)                                 │
│       │                                                         │
│       │ Mau kirim request ke...                                 │
│       │ POST /api/login                                         │
│       ▼                                                         │
│  Laravel (http://localhost:8000)                               │
│       │                                                         │
│       │ "Hey, kamu dari domain berbeda!"                        │
│       │ BLOCKED BY CORS                                         │
│                                                                  │
│  Kenapa terjadi?                                                 │
│  Browser BLOCKS request dari domain berbeda demi keamanan.       │
│                                                                  │
│  Solusi:                                                         │
│  Konfigurasi CORS di Laravel (sudah handle oleh Laravel)         │
│  Set: supports_credentials = true                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.14 Troubleshooting

```
┌─────────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING GUIDE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ composer : The term 'composer' is not recognized           │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                        │
│  1. Pastikan Composer sudah terinstall                           │
│  2. Restart terminal/VSCode                                    │
│  3. Cek PATH Windows:                                           │
│     Settings → System → Environment Variables → Path            │
│     Tambah: C:\ProgramData\ComposerSetup\bin                   │
│                                                                  │
│  ❌ php : The term 'php' is not recognized                     │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                        │
│  1. Cek PHP ada di: C:\xampp\php                               │
│  2. Tambah ke PATH Windows:                                     │
│     C:\xampp\php                                                │
│                                                                  │
│  ❌ npm : The term 'npm' is not recognized                     │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                        │
│  1. Pastikan Node.js sudah terinstall                           │
│  2. Restart terminal/VSCode                                    │
│  3. Cek: node --version                                        │
│                                                                  │
│  ❌ MySQL Connection Refused                                    │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                        │
│  1. Pastikan MySQL running di XAMPP                             │
│  2. Cek port MySQL (biasanya 3306)                             │
│  3. Cek .env: DB_PORT=3306                                     │
│                                                                  │
│  ❌ Vite Error: Port already used                               │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                        │
│  1. Hapus proses lain di port tersebut                          │
│  2. Atau ubah port di vite.config.js:                          │
│     server: { port: 3000 }                                     │
│                                                                  │
│  ❌ CORS Error di Browser Console                               │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                        │
│  1. Pastikan Laravel CORS config benar                          │
│  2. Pastikan supports_credentials = true                        │
│  3. Cek FRONTEND_URL di .env                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.15 Latihan BAB 1

### Latihan Teori

**Q1.** Jelaskan perbedaan antara:
- `npm` dan `composer`
- `php artisan` dan `npm run dev`
- `routes/api.php` dan `routes/web.php` di Laravel

**Q2.** Urutkan langkah-langkah berikut (A-E):
```
A. Install dependencies (npm install / composer install)
B. Generate app key (php artisan key:generate)
C. Buat database di MySQL
D. Konfigurasi .env
E. Create project (composer create-project / npm create vite)
```

**Q3.** Apa fungsi dari:
- `tailwind.config.js`
- `vite.config.js`
- `.env` file

**Q4.** Kenapa kita butuh 2 terminal untuk development?
- Terminal 1 untuk...?
- Terminal 2 untuk...?

**Q5.** Apa itu CORS? Kapan error CORS terjadi?

### Latihan Praktik

**P1.** Verifikasi semua tools sudah terinstall:
```bash
node --version
npm --version
php --version
composer --version
git --version
```

**P2.** Pastikan kedua server bisa jalan:
```bash
# Terminal 1: Laravel
cd seapedia-backend
php artisan serve
# Buka: http://localhost:8000

# Terminal 2: React
cd seapedia-frontend
npm run dev
# Buka: http://localhost:5173
```

**P3.** Buka browser, harusnya:
- `http://localhost:8000` menampilkan halaman Laravel
- `http://localhost:5173` menampilkan halaman React (counter app).

---

## 1.16 Jawaban Latihan

<details>
<summary>Klik untuk melihat jawaban</summary>

**Q1.**
- `npm` = Package manager untuk JavaScript (Node.js), untuk frontend
- `composer` = Package manager untuk PHP, untuk backend Laravel
- `php artisan` = Laravel CLI untuk migrate, seed, serve, dll
- `npm run dev` = Vite dev server untuk hot reload frontend
- `routes/api.php` = Endpoint API yang return JSON
- `routes/web.php` = Endpoint web yang return Blade/HTML

**Q2.** Urutan yang benar:
```
E → A → D → B → C
1. Create project
2. Install dependencies
3. Konfigurasi .env
4. Generate key
5. Buat database
```

**Q3.**
- `tailwind.config.js` = Konfigurasi Tailwind (content paths, theme)
- `vite.config.js` = Konfigurasi Vite (port, proxy, plugins)
- `.env` = Environment variables (database, app config, secrets)

**Q4.**
- Terminal 1 = Backend Laravel (port 8000)
- Terminal 2 = Frontend React (port 5173)
- Keduanya perlu jalan bersamaan karena React panggil API dari Laravel

**Q5.**
- CORS = Cross-Origin Resource Sharing
- Terjadi ketika frontend (domain A) mau akses API backend (domain B)
- Browser block demi keamanan, kecuali server explicit mengijinkan

</details>

---

## 1.17 Checklist BAB 1

- [ ] Install Node.js
- [ ] Install XAMPP (PHP + MySQL)
- [ ] Install Composer
- [ ] Install Git
- [ ] Buat Laravel project
- [ ] Buat React + Vite project
- [ ] Install Tailwind CSS
- [ ] Konfigurasi .env
- [ ] Generate APP_KEY
- [ ] Buat database "seapedia"
- [ ] Setup Git
- [ ] Jalankan Laravel server
- [ ] Jalankan React dev server
- [ ] Akses http://localhost:8000
- [ ] Akses http://localhost:5173

---

## 1.18 Ringkasan BAB 1

```
┌─────────────────────────────────────────────────────────────────┐
│                     YANG SUDAH DIPELAJARI                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Tools yang dibutuhkan (Node.js, PHP, Composer, Git)         │
│  ✅ Arsitektur Laravel (Routes → Controller → Model → DB)       │
│  ✅ Membuat Laravel Backend                                     │
│  ✅ Membuat React + Vite Frontend                               │
│  ✅ Setup Tailwind CSS                                          │
│  ✅ Konfigurasi .env                                            │
│  ✅ Membuat database MySQL                                       │
│  ✅ Setup Git                                                   │
│  ✅ Menjalankan development server                              │
│  ✅ Konsep CORS                                                 │
│                                                                  │
│  NEXT: BAB 2 - Database & Migration                             │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan:                                                      │
│  1. Mendesain database schema sesuai ERD BAB 0                 │
│  2. Membuat migration di Laravel                               │
│  3. Memahami relasi antar tabel                                │
│  4. Seed data awal                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 2?** [Database & Migration](02-database.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-04*
