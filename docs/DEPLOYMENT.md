# Deploy SEAPEDIA: Neon → Render → frontend

Backend dapat disiapkan terlebih dahulu. Tidak perlu membuat Vercel atau membeli domain untuk menjalankan API di Render.

## 1. Asal APP_KEY, APP_URL, dan CORS

| Variabel | Asalnya | Apa yang perlu dilakukan sekarang |
|---|---|---|
| `APP_KEY` | Kunci enkripsi Laravel yang sudah ada di `seapedia-backend/.env` | Nilainya sudah disalin ke `.env.render` lokal. Pertahankan kunci yang sama pada setiap deploy. |
| `APP_URL` | Alamat backend yang dibuat Render, misalnya `https://nama-api.onrender.com` | Boleh tidak diisi. Script Docker mengambilnya dari `RENDER_EXTERNAL_URL` yang disediakan Render. |
| `CORS_ALLOWED_ORIGINS` | Alamat **frontend**, bukan alamat database atau backend | Belum perlu diisi selagi frontend belum dideploy. Tambahkan domain Vercel setelah frontend tersedia. |

`.env.render` adalah file lokal berisi kredensial, sudah diabaikan Git dan Docker. File ini tidak otomatis terkirim ke Render lewat GitHub; masukkan isinya melalui dashboard Environment Render. Jangan memasukkannya ke repository.

## 2. Buat Web Service di Render

Pastikan perubahan Docker sudah tersedia di repository Git yang dihubungkan ke Render.

1. Pilih **New → Web Service** dan hubungkan repository SEAPEDIA.
2. Isi **Root Directory**: `seapedia-backend`.
3. Pilih runtime **Docker**. Dockerfile berada di `./Dockerfile` relatif terhadap Root Directory. Gunakan context folder yang sama.
4. Pilih instance **Free** untuk demo.
5. Isi **Health Check Path**: `/up`.
6. Di **Environment**, pilih **Add from .env**, lalu salin isi `seapedia-backend/.env.render` dari komputer lokal.
7. Biarkan Docker Command mengikuti `CMD` Dockerfile; tidak perlu menambahkan Build/Start Command PHP terpisah.
8. Klik **Create Web Service** dan tunggu build/deploy selesai.

Variabel yang disiapkan `.env.render`:

```dotenv
APP_NAME=SEAPEDIA
APP_ENV=production
APP_DEBUG=false
APP_KEY=<kunci yang sudah ada di .env backend>
DB_CONNECTION=pgsql
DB_URL=<connection string Neon milikmu>
DB_SSLMODE=require
PGCHANNELBINDING=require
LOG_CHANNEL=stderr
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=sync
RUN_MIGRATIONS=true
```

Template di atas hanya penjelasan; file `.env.render` lokal sudah berisi nilai kunci dan URL database yang sebenarnya. Nilai kredensial tidak dicetak di dokumen ini.

`PGCHANNELBINDING=require` meneruskan persyaratan channel binding ke libpq yang digunakan PDO. Laravel meneruskan `sslmode` dari DB_URL, tetapi connector bawaannya tidak memasukkan parameter URL `channel_binding` ke DSN.

## 3. Yang dilakukan Docker

- Memasang PHP 8.4, Apache, Composer, dan ekstensi `pdo_pgsql`, `mbstring`, `bcmath`, `zip`, serta OPcache.
- Memasang dependency production dari `composer.lock`; dependency test dan `.env` lokal tidak dimasukkan ke image.
- Menyajikan hanya folder `public/` dan meneruskan header Authorization melalui aturan Laravel.
- Mendengarkan port `PORT` yang diberikan Render (default 10000).
- Mengambil APP_URL dari Render ketika APP_URL belum diisi; URL HTTPS tetap digunakan di balik proxy Render.
- Menjalankan **`php artisan migrate --force`**, lalu membuat cache konfigurasi, route, dan view sebelum memulai Apache.
- Tidak menjalankan `migrate:fresh`, tidak mereset database, dan tidak menjalankan full seeder otomatis pada restart.

Migrasi membuat tabel jika Neon masih kosong. Untuk deployment yang migrasinya dikelola terpisah, set `RUN_MIGRATIONS=false` dan jalankan migrasi sebelum menyalakan versi aplikasi baru.

## 4. Memeriksa backend

Render akan memberi alamat seperti `https://nama-api.onrender.com`. Buka:

- `/up` — health check Laravel, seharusnya HTTP 200.
- `/api/products` — respons JSON katalog. Jika database baru belum berisi data, hasil `data: []` adalah normal.

Backend Render adalah API Laravel, sedangkan tampilan React masih berada pada proyek frontend. Halaman utama backend tidak menampilkan marketplace React.

Data demo belum otomatis berpindah dari database lokal ke Neon. Jika memang ingin memakai akun dan produk demo pada **database Neon baru**, jalankan `php artisan db:seed --force` satu kali setelah migrasi. Full seeder bukan sinkronisasi untuk database yang sudah terisi; jangan memasangnya sebagai perintah startup berulang.

## 5. Frontend setelah backend selesai

Setelah backend berjalan, frontend dapat dideploy ke Vercel dengan:

```text
Root Directory : seapedia-frontend
Framework      : Vite
Build Command  : npm run build
Output         : dist
```

Isi environment **frontend**:

```dotenv
VITE_API_URL=https://nama-api.onrender.com/api
```

Setelah Vercel memberi URL frontend, tambahkan environment **backend Render**:

```dotenv
CORS_ALLOWED_ORIGINS=https://nama-frontend.vercel.app
```

Gunakan origin tanpa path dan tanpa trailing slash. Untuk beberapa origin, pisahkan dengan koma. Deploy ulang backend setelah mengubah konfigurasi; redeploy frontend setelah mengganti variabel `VITE_*`.

## 6. Foto produk

Seluruh 40 foto fixture sudah berada dalam image dan tidak memerlukan bucket tambahan. Foto **upload seller** pada disk `public` berada di filesystem container yang dapat hilang saat redeploy; gunakan S3-compatible object storage untuk menyimpan upload secara persisten.

Jika bucket sudah tersedia, isi `PRODUCT_IMAGE_DISK=s3` dan pengaturan `AWS_*` sesuai penyedia. Credential storage hanya disimpan pada backend.

## Pengujian Docker lokal

Dari folder `seapedia-backend`:

```powershell
docker build -t seapedia-api:local .
docker run --rm -p 10000:10000 --env-file .env.render -e APP_URL=http://localhost:10000 seapedia-api:local
```

Perintah `docker run` tersebut memakai database dari `.env.render` dan menjalankan migrasi karena `RUN_MIGRATIONS=true`. Untuk pemeriksaan tanpa migrasi, override `-e RUN_MIGRATIONS=false`.

Referensi resmi: [Laravel dengan Docker di Render](https://render.com/docs/deploy-php-laravel-docker), [environment bawaan Render](https://render.com/docs/environment-variables), dan [port Web Service](https://render.com/docs/web-services).
