# Deployment Guide

Target production SEAPEDIA:

- Frontend React/Vite di Vercel.
- Laravel API dan PostgreSQL di Railway.
- Foto produk upload di bucket S3-compatible, direkomendasikan Cloudflare R2.

## Kenapa gambar tidak disimpan langsung di Railway

Filesystem container dapat diganti ketika redeploy. Upload Seller harus berada pada object storage yang persisten. Disk `public` hanya digunakan untuk development lokal; jangan gunakan sebagai storage production kecuali Railway service dipasangi persistent volume dan hanya berjalan satu replica.

## Environment Laravel

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.example.com

DB_CONNECTION=pgsql
DB_URL=${{Postgres.DATABASE_URL}}

PRODUCT_IMAGE_DISK=s3
AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY>
AWS_DEFAULT_REGION=auto
AWS_BUCKET=<R2_BUCKET_NAME>
AWS_ENDPOINT=https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_URL=https://media.example.com
AWS_USE_PATH_STYLE_ENDPOINT=false

LOG_CHANNEL=stderr
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

Bucket foto harus dapat dibaca publik melalui custom domain atau public development URL karena gambar ditampilkan pada katalog Guest. Credential write hanya disimpan di Railway, tidak pernah di Vercel atau source control.

## Release command

```bash
php artisan migrate --force
php artisan optimize
```

Seeder demo hanya dijalankan sekali bila memang dibutuhkan:

```bash
php artisan db:seed --force
```

Jangan menjalankan `migrate:fresh` pada production karena menghapus seluruh data.

## Frontend

Vercel menggunakan root directory `seapedia-frontend`, build command `npm run build`, dan output directory `dist`. API client sudah membaca `VITE_API_URL` (sertakan suffix `/api`), dan `vercel.json` sudah menyediakan fallback route SPA. Isi `CORS_ALLOWED_ORIGINS` pada backend dengan origin frontend, dipisahkan koma bila lebih dari satu. Seluruh nilai `VITE_*` bersifat publik; simpan kredensial database/storage hanya pada backend.

Foto fixture katalog sudah tersimpan lokal di kedua aplikasi. Foto upload seller tetap perlu object storage persisten. Ini konfigurasi untuk persiapan hosting; deployment publik belum diverifikasi pada audit 31 Oktober 2026.

## Smoke test production

1. Login sebagai Seller dan unggah JPG/PNG/WebP di bawah 2 MB.
2. Pastikan gambar tampil pada dashboard Seller, katalog Guest, detail produk, cart, dan order.
3. Ganti foto dan pastikan URL baru dapat dibuka.
4. Redeploy Laravel lalu pastikan gambar tetap tersedia.
5. Uji file SVG, file lebih dari 2 MB, dan akses Seller lain; semuanya harus ditolak.
