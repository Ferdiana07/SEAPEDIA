# BAB 12: Pengaturan Akun Terpusat (Settings Page)

> **Tujuan:** Membangun halaman `/settings` yang komprehensif sebagai pusat kendali akun pengguna — profil, alamat, keamanan, role, dan dompet dalam satu antarmuka terintegrasi.

---

## 1. Pendahuluan

Bab ini mendokumentasikan pembuatan halaman **Pengaturan Akun** (`/settings`) yang komprehensif, mirip dengan *dashboard* pengaturan pada platform e-commerce raksasa. Halaman ini berfungsi sebagai pusat kendali bagi pengguna untuk mengelola berbagai aspek akun mereka, termasuk profil, alamat pengiriman, keamanan, role (peran), dan dompet digital, semuanya dalam satu antarmuka yang terintegrasi.

Langkah ini diambil untuk memenuhi (dan melebihi) kriteria kelengkapan fitur dari dokumen PDF referensi.

```
┌─────────────────────────────────────────────────────────────────┐
│                   ARSITEKTUR SETTINGS PAGE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /settings                                                       │
│  ┌────────────────┬─────────────────────────────────────────┐   │
│  │   SIDEBAR      │           MAIN CONTENT                  │   │
│  │                │                                         │   │
│  │  [Avatar]      │  Tab 1: Informasi Pribadi (Profile)     │   │
│  │  [Nama]        │  Tab 2: Alamat Saya (Address)           │   │
│  │  [Email]       │  Tab 3: Keamanan Akun (Security)        │   │
│  │  [Role badge]  │  Tab 4: Manajemen Role (Roles)          │   │
│  │                │  Tab 5: Dompet Saya (Wallet)            │   │
│  │  [👤 Profil]   │                                         │   │
│  │  [📍 Alamat]   │                                         │   │
│  │  [🔒 Keamanan] │                                         │   │
│  │  [🎭 Role]     │                                         │   │
│  │  [💰 Dompet]   │                                         │   │
│  └────────────────┴─────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Pembaruan Database dan API Backend

### 2.1 Penambahan Kolom pada Tabel `users`
Agar profil pengguna lebih lengkap, kami membuat *migration* baru (`add_phone_to_users_table`) untuk menambahkan kolom berikut:

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `phone` | VARCHAR 20, Nullable | Nomor HP dengan prefiks +62 |
| `bio` | VARCHAR 255, Nullable | Bio singkat pengguna |
| `birth_date` | DATE, Nullable | Tanggal lahir |
| `gender` | VARCHAR 10, Nullable | Enum: `male`, `female`, `other` |

Kolom `avatar_url` (VARCHAR 500) sebelumnya sudah ada di migrasi awal.

Semua kolom baru ditambahkan ke `$fillable` di `User.php`:
```php
protected $fillable = [
    'name', 'email', 'password', 'avatar_url',
    'phone', 'bio', 'birth_date', 'gender',
];
```

### 2.2 Endpoint Baru di `AuthController.php`
Kami menambahkan dua fungsi penting untuk manajemen akun:

#### `updateProfile(Request $request)` — PUT `/api/auth/profile`
Update atribut profil pengguna:
```php
$validated = $request->validate([
    'name'       => ['sometimes', 'string', 'max:255'],
    'phone'      => ['sometimes', 'nullable', 'string', 'max:20'],
    'bio'        => ['sometimes', 'nullable', 'string', 'max:255'],
    'birth_date' => ['sometimes', 'nullable', 'date'],
    'gender'     => ['sometimes', 'nullable', 'in:male,female,other'],
    'avatar_url' => ['sometimes', 'nullable', 'url', 'max:500'],
]);
$user->update($validated);
```

#### `changePassword(Request $request)` — PUT `/api/auth/password`
Validasi password lama, lalu ganti dengan password baru:
```php
// Cek password lama
if (!Hash::check($validated['current_password'], $user->password)) {
    return response()->json(['success' => false, 'message' => 'Password lama tidak sesuai.'], 422);
}
$user->update(['password' => Hash::make($validated['password'])]);
```

### 2.3 Update `routes/api.php`
Kedua endpoint ditambahkan di dalam grup `auth:sanctum`:
```php
Route::prefix('auth')->group(function () {
    // ... route lain ...
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'changePassword']);
});
```

### 2.4 Update `authService.js` (Frontend)
Dua method baru ditambahkan di `src/services/authService.js`:
```javascript
updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.data
},
changePassword: async (data) => {
    const response = await api.put('/auth/password', data)
    return response.data
},
```

---

## 3. Frontend: Komponen `SettingsPage.jsx`

Halaman pengaturan dibangun menggunakan layout *Sidebar-Main Content* modern. File ini memiliki **765 baris** dan terdiri dari 5 komponen Tab yang dikelola oleh satu komponen utama `SettingsPage`.

### Struktur Komponen
```
SettingsPage (komponen utama)
├── Sidebar (user card + navigasi tab)
└── Main Content (render tab aktif)
    ├── ProfileTab    → Tab 1
    ├── AddressTab    → Tab 2
    ├── SecurityTab   → Tab 3
    ├── RolesTab      → Tab 4
    └── WalletTab     → Tab 5
```

### Contoh Kode: Komponen Utama (SettingsPage)
```jsx
// File: src/pages/SettingsPage.jsx

const NAV_ITEMS = [
  { id: 'profile',  icon: '👤', label: 'Informasi Pribadi' },
  { id: 'address',  icon: '📍', label: 'Alamat Saya' },
  { id: 'security', icon: '🔒', label: 'Keamanan Akun' },
  { id: 'roles',    icon: '🎭', label: 'Manajemen Role' },
  { id: 'wallet',   icon: '💰', label: 'Dompet Saya' },
]

const SettingsPage = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [currentUser, setCurrentUser] = useState(user)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64">
            {/* User Card: avatar, nama, email, role badge */}
            {/* Nav: tombol per tab */}
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-2xl p-6">
            {activeTab === 'profile'  && <ProfileTab user={currentUser} onUpdate={setCurrentUser} />}
            {activeTab === 'address'  && <AddressTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'roles'    && <RolesTab user={currentUser} />}
            {activeTab === 'wallet'   && <WalletTab />}
          </main>
        </div>
      </div>
    </div>
  )
}
```

---

## 4. Detail Setiap Tab

### 4.1 Tab: Informasi Pribadi (`ProfileTab`)

**Form fields:**
- Foto Profil (input URL dengan *live preview* avatar)
- Nama Lengkap (required)
- Nomor HP (dengan prefix +62)
- Jenis Kelamin (dropdown: Laki-laki, Perempuan, Lainnya)
- Tanggal Lahir (date picker dengan max hari ini)
- Email (readonly — tidak bisa diubah, untuk keamanan)
- Bio (textarea, max 255 karakter dengan counter)

**Alur kerja:**
```
User isi form → handleSubmit → authService.updateProfile(form)
    → PUT /api/auth/profile
    → Backend update user
    → Response: { success, user }
    → Update Zustand store (useAuthStore.setState)
    → Toast "Profil berhasil disimpan!"
```

**Fitur Preview Avatar:**
```javascript
const handleChange = (e) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
  if (name === 'avatar_url') setAvatarPreview(value)  // live preview!
}
```

---

### 4.2 Tab: Alamat Saya (`AddressTab`)

Menggunakan `addressService.js` untuk operasi CRUD penuh, langsung di dalam halaman pengaturan tanpa navigasi ke halaman lain.

**Fitur:**
- Daftar semua alamat dengan badge "Utama" untuk alamat default
- Form inline (muncul di atas daftar) untuk tambah/edit
- Tombol **"Jadikan Utama"** → panggil `POST /api/addresses/{id}/set-default`
- Tombol **"Ubah"** → buka form edit dengan data yang sudah terisi
- Tombol **"Hapus"** → konfirmasi `window.confirm` sebelum hapus

**Alur kerja:**
```
Klik "Tambah Alamat"
    → setShowForm(true) + resetForm
    → User isi form
    → handleSubmit → addressService.create(formData)
    → POST /api/addresses
    → fetchAddresses() untuk reload daftar

Klik "Jadikan Utama"
    → addressService.setDefault(id)
    → POST /api/addresses/{id}/set-default
    → fetchAddresses()
```

---

### 4.3 Tab: Keamanan Akun (`SecurityTab`)

Form pergantian *password* dengan fitur keamanan tambahan:

**Fitur:**
- 3 input password: Password Saat Ini, Password Baru, Konfirmasi Password Baru
- **Show/Hide Password**: setiap field punya tombol toggle `👁️` / `🙈`
- **Indikator Kekuatan Password** (bar berwarna 4 segmen):
  - Merah → password < 8 karakter (terlalu pendek)
  - Kuning → password 8–11 karakter (cukup kuat)
  - Hijau → password ≥ 12 karakter (sangat kuat)
- **Tips Keamanan**: kotak biru dengan 3 tips password yang aman

**Logika kekuatan password:**
```javascript
// 4 bar — makin panjang makin hijau
{[1, 2, 3, 4].map(i => (
  <div className={`h-1 flex-1 rounded-full ${
    password.length >= i * 2
      ? password.length >= 12 ? 'bg-green-500'
        : password.length >= 8 ? 'bg-yellow-500'
        : 'bg-red-400'
      : 'bg-gray-200'
  }`} />
))}
```

---

### 4.4 Tab: Manajemen Role (`RolesTab`)

Halaman sentralistik bagi pengguna untuk melihat dan mengelola semua role mereka.

**Tampilan:**
- Grid card per role (Pembeli, Penjual, Driver)
- Setiap card menampilkan ikon, nama role, dan deskripsi
- Badge status: **Aktif** (primary), **Dimiliki** (hijau), atau tidak ada badge (belum dimiliki)

**Tombol aksi cerdas (3 kondisi):**

| Kondisi | Tampilan | Aksi |
|---------|----------|------|
| Role sedang aktif | "✓ Role ini sedang aktif" (teks, bukan tombol) | — |
| Role dimiliki tapi tidak aktif | "Beralih ke [Role]" (border primary) | `authService.selectRole(role)` |
| Role belum dimiliki | "Daftar Jadi [Role]" (background hitam) | `authService.assignRole(role)` lalu otomatis `selectRole` |

**Alur daftar role baru:**
```javascript
const handleRegisterRole = async (role) => {
  // 1. Assign role baru ke backend
  const assignRes = await authService.assignRole(role)
  // 2. Langsung aktifkan role tersebut
  const selectRes = await authService.selectRole(role)
  // 3. Update Zustand store
  useAuthStore.setState({ user: selectRes.user, activeRole: selectRes.user.active_role })
  // 4. Navigasi ke dashboard role baru
  if (role === 'seller') navigate('/seller/dashboard')
  else if (role === 'driver') navigate('/driver/orders')
}
```

**Role Admin (khusus):**
- Card Admin **hanya muncul** jika user sudah memiliki role admin
- Tidak ada tombol "Daftar Jadi Admin" — mencegah pelanggaran keamanan
- Jika sudah admin: bisa beralih ke role admin via tombol "Beralih ke Admin"

---

### 4.5 Tab: Dompet Saya (`WalletTab`)

Tab ini adalah *shortcut* ke fitur wallet yang sudah ada — bukan fitur baru, melainkan **akses cepat** yang terintegrasi di halaman pengaturan.

**Tampilan:**
- Banner gradien hijau dengan teks "Dompet SEAPEDIA"
- 2 tombol akses cepat (grid 2 kolom):
  - 💰 **Saldo & Top Up** → navigasi ke `/buyer/wallet`
  - 📋 **Riwayat Pesanan** → navigasi ke `/buyer/orders`

---

## 5. Pembaruan Navigasi

### 5.1 Route di `App.jsx`
```jsx
// Route baru: /settings (akses semua role yang sudah login)
<Route
  path="/settings"
  element={
    <ProtectedRoute>  {/* bukan RoleRoute — semua role bisa akses */}
      <SettingsPage />
    </ProtectedRoute>
  }
/>
```

**Mengapa `ProtectedRoute` bukan `RoleRoute`?**
Karena halaman pengaturan harus bisa diakses oleh **semua role** (buyer, seller, driver, admin) yang sudah login. `RoleRoute` akan membatasi ke satu role saja.

### 5.2 Navbar Dropdown
Menu baru ditambahkan di dropdown profil Navbar:
```
⚙️ Pengaturan Akun  →  /settings
```
Menu ini muncul untuk semua role yang sudah login.

---

## 6. Ringkasan File yang Dibuat/Dimodifikasi

| File | Status | Keterangan |
|------|--------|-----------|
| `src/pages/SettingsPage.jsx` | NEW | Halaman pengaturan 5 tab (765 baris) |
| `src/services/authService.js` | MODIFIED | +`updateProfile`, +`changePassword` |
| `src/App.jsx` | MODIFIED | Route `/settings` dengan `ProtectedRoute` |
| `src/components/layout/Navbar.jsx` | MODIFIED | Menu "⚙️ Pengaturan Akun" di dropdown |
| `app/Http/Controllers/AuthController.php` | MODIFIED | +`updateProfile()`, +`changePassword()` |
| `database/migrations/2026_07_23_084728_add_phone_to_users_table.php` | NEW | Kolom phone, bio, birth_date, gender |
| `app/Models/User.php` | MODIFIED | Tambah kolom baru ke `$fillable` |
| `routes/api.php` | MODIFIED | Route `PUT /auth/profile` & `PUT /auth/password` |

---

## 7. Checklist BAB 12

- [x] Migration `add_phone_to_users_table` dibuat dan dijalankan
- [x] `User.php` $fillable diperbarui (phone, bio, birth_date, gender)
- [x] `AuthController::updateProfile()` — PUT `/api/auth/profile`
- [x] `AuthController::changePassword()` — PUT `/api/auth/password`
- [x] Routes baru di `routes/api.php`
- [x] `authService.js` — method `updateProfile` & `changePassword`
- [x] `SettingsPage.jsx` — komponen utama dengan layout Sidebar-Main
- [x] `ProfileTab`: form profil lengkap + live preview avatar
- [x] `AddressTab`: CRUD alamat inline + tombol "Jadikan Utama"
- [x] `SecurityTab`: form ganti password + show/hide + indikator kekuatan
- [x] `RolesTab`: card per role + tombol cerdas 3 kondisi + admin-only card
- [x] `WalletTab`: akses cepat ke wallet & riwayat pesanan
- [x] Route `/settings` di `App.jsx` dengan `ProtectedRoute`
- [x] Menu "⚙️ Pengaturan Akun" di Navbar dropdown

---

## 8. Kesimpulan

```
┌─────────────────────────────────────────────────────────────────┐
│                      YANG SUDAH DIPELAJARI                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Database migration untuk kolom profil tambahan              │
│  ✅ Backend API: updateProfile + changePassword                 │
│  ✅ Frontend SettingsPage dengan 5 tab terintegrasi             │
│                                                                  │
│  ✅ ProfileTab: form profil + live preview avatar               │
│  ✅ AddressTab: CRUD alamat inline tanpa pindah halaman         │
│  ✅ SecurityTab: ganti password + indikator kekuatan            │
│  ✅ RolesTab: manajemen multi-role dengan tombol cerdas         │
│  ✅ WalletTab: akses cepat ke wallet & riwayat                  │
│                                                                  │
│  ✅ ProtectedRoute (bukan RoleRoute) untuk akses semua role     │
│  ✅ Menu Pengaturan di Navbar dropdown                          │
│                                                                  │
│  PELAJARAN UTAMA:                                               │
│  • ProtectedRoute vs RoleRoute: tergantung siapa yang boleh akses│
│  • Komponen Tab: pisahkan logika setiap tab ke komponen sendiri │
│  • Zustand setState: cara update store dari dalam komponen      │
│  • UX: form inline > navigasi ke halaman lain untuk operasi CRUD│
│                                                                  │
│  🎉 SEAPEDIA SELESAI! Semua fitur dari BAB 0 hingga BAB 12      │
│     sudah selesai diimplementasikan.                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Dengan adanya Halaman Pengaturan Akun ini, SEAPEDIA tidak hanya memenuhi kebutuhan dasar aplikasi e-commerce, tetapi juga memberikan pengalaman *User Experience* (UX) yang premium. Fitur-fiturnya melebihi standar dasar dengan menyediakan mekanisme *multi-role* terpadu dan indikator keamanan *password* interaktif.

---

*Update terakhir: 2026-07-24*
