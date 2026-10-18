# Architecture

## Stack

### Frontend

- React 19 + Vite
- React Router 7
- Zustand persistence untuk auth dan state domain ringan
- Axios dengan bearer token Sanctum
- Tailwind CSS 4 dengan plugin resmi Vite

### Backend

- Laravel 12
- Laravel Sanctum personal access token
- Eloquent ORM
- SQLite lokal dan test
- PostgreSQL untuk production
- Laravel Filesystem untuk upload foto produk: disk `public` lokal dan S3-compatible object storage di production

## Boundary

- Controller menerima request dan membentuk response API.
- Form Request menangani validasi input yang reusable.
- Service domain menangani operasi multi-resource seperti checkout, refund, dan overdue.
- Model menyimpan relasi, cast, scope, konstanta status, dan helper kecil.
- Policy atau role middleware menangani authorization.

## Data model

Entitas yang sudah ada:

`users`, `user_roles`, `stores`, `products`, `wallets`, `addresses`, `carts`, `cart_items`, `orders`, `order_items`, `transactions`, `reviews`.

Entitas dan field commerce yang ditambahkan pada pengembangan portofolio:

- `application_reviews` untuk ulasan aplikasi Guest.
- `discounts` dengan type `voucher|promo`.
- `order_status_histories` untuk audit lifecycle.
- Breakdown subtotal, diskon, ongkir, PPN, dan total pada `orders`.
- Timestamp `refunded_at` dan `stock_restored_at` untuk idempotensi.

## Security model

- Semua endpoint privat memakai `auth:sanctum`.
- Group route Buyer, Seller, Driver, dan Admin memakai middleware `role:<role>`.
- Middleware memverifikasi role dimiliki dan sedang aktif.
- Ownership tetap diverifikasi pada query resource.
- Input divalidasi server-side dan output user-generated tidak dirender sebagai HTML.
- Upload produk dibatasi ke JPG/PNG/WebP valid, maksimal 2 MB dan 6000 x 6000 piksel; SVG tidak diterima.
- Perubahan finansial dan inventory memakai transaction database serta row lock.

## Product image storage

- Produk demo lama tetap memakai path aset frontend melalui `image_url`.
- Upload Seller menyimpan `image_path` dan `image_disk`; URL publik dibentuk saat response agar perubahan domain tidak membuat URL database kedaluwarsa.
- Penggantian foto menyimpan file baru lebih dahulu, mengunci row produk saat update, lalu menghapus file lama hanya setelah transaction berhasil.
- Development memakai `PRODUCT_IMAGE_DISK=public` dan membutuhkan `php artisan storage:link`.
- Production memakai `PRODUCT_IMAGE_DISK=s3` dengan bucket S3-compatible seperti Cloudflare R2. File tidak disimpan pada filesystem sementara container Railway.

## API response convention

Response sukses:

```json
{
  "success": true,
  "message": "Opsional",
  "data": {}
}
```

Response gagal:

```json
{
  "success": false,
  "message": "Pesan yang dapat ditindaklanjuti",
  "errors": {}
}
```

Pagination memakai `data` dan `meta` yang konsisten.

## Frontend routing

- Public: home, catalog, product detail, store detail, login, register, dan application reviews.
- Shared authenticated: role selection dan account settings.
- Buyer: dashboard, wallet, addresses, cart/checkout, orders, dan order detail.
- Seller: dashboard, store, products, orders, dan report.
- Driver: dashboard, available jobs, active job, history, dan report.
- Admin: monitoring, users, discounts, dan overdue operations.

Semua page route dimuat dengan React lazy loading. Initial JavaScript bundle sekitar 306 kB sebelum gzip dan 95 kB sesudah gzip pada build terverifikasi.

## Concurrency dan idempotensi

- Checkout mengunci wallet, cart, produk, dan penggunaan discount dalam satu transaction.
- Cancel Buyer memeriksa ulang status setelah order dikunci.
- Seller processing, Driver pickup, complete, dan return memeriksa state di dalam transaction.
- Refund dan stock restoration memakai timestamp guard sehingga retry tidak menggandakan uang atau stok.
- Migrasi backfill mengisi subtotal order historis dari snapshot `order_items` tanpa mengarang breakdown lama.

## Keputusan desain

- Redesign mode: targeted overhaul. Route utama dan model mental yang sudah ada dipertahankan, tetapi visual foundation, navigasi, feedback state, dan dashboard shell dirapikan.
- `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 3`, `VISUAL_DENSITY: 6`.
- Motion dibatasi pada feedback dan transition ringan. Tidak ada scroll hijack.
- Shape system: card 16px, input 12px, button 12px. Pill hanya untuk status atau filter.
