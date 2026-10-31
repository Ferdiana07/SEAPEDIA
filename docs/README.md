# SEAPEDIA Project Continuity

Dokumen ini adalah titik masuk utama untuk melanjutkan pengembangan SEAPEDIA di sesi berikutnya.

## Cara melanjutkan

1. Baca `docs/PROGRESS.md` untuk posisi terakhir dan pekerjaan berikutnya.
2. Baca `docs/ROADMAP.md` untuk status tiap milestone.
3. Baca `docs/PRODUCT_SPEC.md` sebelum mengubah aturan bisnis.
4. Baca `docs/ARCHITECTURE.md` sebelum mengubah schema, autentikasi, atau lifecycle order.
5. Jalankan pemeriksaan baseline yang dicatat di `docs/QUALITY.md`.

## Ringkasan proyek

SEAPEDIA adalah marketplace full-stack multi-role dengan empat peran: Buyer, Seller, Driver, dan Admin. Frontend menggunakan React 19, Vite, React Router, Zustand, Axios, dan Tailwind CSS 4. Backend menggunakan Laravel 12, Sanctum, SQLite untuk pengembangan/test, serta PostgreSQL untuk target production.

Brief awal berada di `SEAPEDIA.pdf`. Proyek ini dilanjutkan sebagai proyek portofolio, jadi ketentuan lomba dipakai sebagai fondasi produk, bukan batas kaku. Prioritas utama adalah demo end-to-end yang benar, aman, mudah dijalankan, dan memiliki UI/UX yang kuat.

## Dokumen aktif

- `PRODUCT_SPEC.md`: ruang lingkup produk dan aturan bisnis yang dipilih.
- `ARCHITECTURE.md`: arsitektur, lifecycle, dan keputusan teknis.
- `AUDIT.md`: hasil audit awal terhadap source code.
- `AUDIT-2026-10-31.md`: audit terbaru, katalog 40 produk, kredit foto, perbaikan, hasil pengujian, serta temuan tersisa.
- `ROADMAP.md`: checklist milestone implementasi.
- `PROGRESS.md`: log progres kronologis dan handoff sesi.
- `QUALITY.md`: command verifikasi dan status kualitas.
- `OPENAPI.yaml`: kontrak seluruh endpoint publik dan private.
- `DEMO_GUIDE.md`: alur demo end-to-end untuk setiap role.
- `DEPLOYMENT.md`: langkah Neon → backend Docker di Render → frontend Vercel; sumber APP_KEY/APP_URL/CORS dan konfigurasi object storage.

## Prinsip dokumentasi

- `PROGRESS.md` harus diperbarui setelah setiap milestone atau perubahan arah.
- Checklist hanya boleh ditandai selesai setelah implementasi dan verifikasi lulus.
- Gap atau bug baru harus dicatat, bukan disimpan sebagai asumsi percakapan.
- Perubahan lokal milik pengguna tidak boleh dibuang tanpa izin eksplisit.
