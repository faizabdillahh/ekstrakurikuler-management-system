# Tech Stack
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Versi:** 1.0  
> **Tanggal:** 4 Juni 2026  
> **Status:** Final — Approved  
> **Referensi SRS:** `docs/planning/srs.md`

---

## 1. Ringkasan Arsitektur

Sistem ini menggunakan **Laravel 13 + Inertia.js v3 + React 19 + Tailwind CSS v4 + MySQL 8.4 LTS / 9.x** sebagai satu kesatuan stack modern yang kohesif. Seluruh request diproses oleh Laravel sebagai backend tunggal; Inertia.js menjembatani PHP dan React untuk menghasilkan pengalaman Single Page Application (SPA) tanpa memerlukan API REST terpisah.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│           React 19 + Inertia.js v3 + Tailwind CSS v4           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ XHR (Inertia Protocol, bukan REST)
┌───────────────────────────▼─────────────────────────────────────┐
│                       LARAVEL 13 (PHP 8.5)                      │
│  Routing → Middleware (Auth/RBAC) → Controller → Eloquent ORM   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐ │
│  │  Queue/Jobs │  │  Scheduler  │  │  Socialite (Google OAuth) │ │
│  │ (Mass Import│  │ (Auto-delete│  │  Domain restriction filter│ │
│  │  & Export)  │  │  sertifikat)│  └──────────────────────────┘ │
│  └─────────────┘  └─────────────┘                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                   MySQL 8.4 LTS / 9.x                           │
│         (Relational DB — Audit Log, Tahun Ajaran, RBAC)         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Stack

### 2.1 Backend — Laravel 13

| Komponen | Versi | Keterangan |
|---|---|---|
| **Laravel** | `^13.x` | Rilis 17 Maret 2026. Latest stable. Security support hingga Maret 2028. |
| **PHP** | `^8.5` | Rilis November 2025. Versi stable terkini. Wajib PHP ≥ 8.5 karena `spatie/laravel-activitylog v5` requires PHP 8.4+. |
| **Composer** | `^2.x` | Dependency manager PHP. |

**Alasan memilih Laravel 13:**
- Framework PHP paling matang, aman, dan terdokumentasi dengan baik di dunia.
- Dukungan bug fix resmi hingga Q3 2027, security fix hingga Maret 2028 — memadai untuk lifecycle proyek ini.
- Ekosistem library siap pakai (Socialite, Queue, Excel, PDF, Permission) mempercepat implementasi seluruh fitur SRS tanpa membangun dari awal.
- Kurikulum jurusan RPL di SMKN Indonesia umumnya berbasis PHP/Laravel — memudahkan pemeliharaan jangka panjang oleh guru/siswa sekolah.

---

### 2.2 Frontend — React 19 via Inertia.js v3

| Komponen | Versi | Keterangan |
|---|---|---|
| **Inertia.js** | `^3.x` | Rilis 26 Maret 2026. Latest stable. |
| **@inertiajs/react** | `^3.x` | React adapter untuk Inertia.js v3. |
| **React** | `^19.x` | Wajib oleh Inertia.js v3 (v18 tidak didukung lagi). |
| **TypeScript** | `^5.x` | Direkomendasikan untuk type safety komponen React & Inertia. |
| **Vite** | `^6.x` | Build tool bawaan Laravel 13. Inertia.js v3 menyediakan plugin `@inertiajs/vite`. |

**Perubahan penting Inertia.js v3 yang perlu diperhatikan:**
- **Axios dihapus** — diganti built-in XHR client yang lebih ringan. Jika memerlukan interceptor khusus, Axios masih bisa dipasang manual sebagai peer dependency opsional.
- **Plugin Vite baru** — `@inertiajs/vite` menyederhanakan konfigurasi page resolution dan SSR secara signifikan.
- **Layout system baru** — `useLayoutProps` dihapus, diganti props-based API yang lebih simpel.
- **Hook `useHttp`** — tersedia untuk request HTTP yang tidak memicu navigasi halaman (menggantikan peran Axios di banyak kasus).

**Alasan memilih Inertia.js v3:**
- Memungkinkan pembuatan SPA penuh tanpa memerlukan REST API terpisah — semua route tetap di Laravel.
- Developer hanya perlu menguasai satu bahasa server-side (PHP/Laravel) dan satu frontend (React) tanpa lapisan API management tambahan.
- Autentikasi, RBAC, dan session sepenuhnya ditangani Laravel — tidak perlu JWT atau token management di frontend.

---

### 2.3 Styling — Tailwind CSS v4

| Komponen | Versi | Keterangan |
|---|---|---|
| **Tailwind CSS** | `^4.3.0` | Rilis 8 Mei 2026. Latest stable. |
| **@tailwindcss/vite** | `^4.x` | Plugin Vite resmi untuk integrasi Tailwind CSS v4. |

**Perubahan penting Tailwind CSS v4 yang perlu diperhatikan:**
- **CSS-first configuration** — konfigurasi dilakukan langsung di file CSS menggunakan `@theme {}`, bukan di `tailwind.config.js`. File konfigurasi JS tidak lagi diperlukan.
- **Zero-config content detection** — Tailwind v4 mendeteksi file secara otomatis, tidak perlu mendefinisikan `content` paths.
- **Engine berbasis Rust** — build time jauh lebih cepat dibanding versi sebelumnya.
- **CSS Variables native** — semua token desain (warna, spacing, font) tersedia sebagai CSS custom properties (`--color-primary`, dll.), memudahkan integrasi dengan sistem warna dinamis ekskul (`REQ-MAINT-001`).

**Integrasi dengan Design System proyek:**
Palet warna ekskul (`#fff000`, `#00a2e9`, dll.) didefinisikan sebagai token dalam `@theme {}` di file CSS utama, dan dapat di-override per-ekskul menggunakan CSS Variables secara dinamis sesuai `REQ-MAINT-001`.

```css
/* resources/css/app.css */
@import "tailwindcss";

@theme {
  --color-primary: #fff000;
  --color-secondary: #00a2e9;
  --color-accent: #fda800;
  --color-dark: #15160c;
  --color-navy: #124272;
  /* ... */
}
```

---

### 2.4 Database — MySQL 8.4 LTS / 9.x

| Komponen | Versi | Keterangan |
|---|---|---|
| **MySQL** | `^8.4` atau `^9.x` | Rilis LTS 8.4 (April 2024) atau versi terbaru 9.x. |

**Alasan memilih MySQL:**
- Kemudahan pemeliharaan oleh sekolah (PHP/Laravel & MySQL sangat umum diajarkan di kurikulum RPL SMK).
- Driver database bawaan Laravel (`mysql` via PDO) sangat matang dan teruji.
- Mendukung tipe data `JSON` untuk menyimpan konfigurasi organisasi dinamis (`REQ-FUNC-011`).
- Mendukung `CHECK` constraints (sejak MySQL 8.0.16) untuk pembatasan integritas data.
- Kemudahan deployment di web hosting / VPS lokal yang biasanya menyertakan MySQL secara default.

---

## 3. Package Library Pendukung

### 3.1 Autentikasi & Otorisasi

| Package | Versi | Fungsi | Relevansi SRS |
|---|---|---|---|
| `laravel/socialite` | `latest` | Integrasi Google OAuth 2.0. | `REQ-FUNC-001`, `REQ-INT-010`, `REQ-SEC-001` |
| `spatie/laravel-permission` | `^7.4.1` | RBAC — Role & Permission per pengguna. Rilis 29 April 2026. Requires Laravel 12+. | `REQ-FUNC-002`, `REQ-SEC-002` |

**Catatan implementasi Google OAuth + domain restriction:**

Domain sekolah divalidasi di `App\Http\Controllers\Auth\SocialiteController.php` setelah callback Google berhasil:

```php
$user = Socialite::driver('google')->user();

// Validasi domain sekolah
if (!str_ends_with($user->email, '@smkn1bawang.sch.id')) {
    return redirect('/login')->withErrors(['email' => 'Login hanya untuk akun email sekolah.']);
}
```

---

### 3.2 Import & Export Data

| Package | Versi | Fungsi | Relevansi SRS |
|---|---|---|---|
| `maatwebsite/laravel-excel` | `^3.1` | Import data siswa via Excel (.xlsx) massal dengan Queue Job (async, tidak timeout). | `REQ-INT-012`, `REQ-PERF-003` |
| `barryvdh/laravel-dompdf` | `^3.1.2` | Generate & download laporan PDF (absensi, penilaian, anggota). Rilis 17 Maret 2026. | `REQ-INT-013`, `REQ-FUNC-100` |

> [!NOTE]
> `maatwebsite/laravel-excel v4` belum memiliki rilis stable per Juni 2026. Tetap gunakan **v3.1** yang sudah battle-tested untuk production.

**Pola import massal tanpa timeout (v3.1 + Queue):**

```php
// Import class menggunakan ShouldQueue — proses berjalan di background worker
class SiswaImport implements ToModel, ShouldQueue, WithHeadingRow
{
    public function model(array $row): Siswa
    {
        return new Siswa(['nis' => $row['nis'], 'nama' => $row['nama'], ...]);
    }
}

// Controller
Excel::queueImport(new SiswaImport, $request->file('file'));
```

---

### 3.3 Audit Log & Keamanan

| Package | Versi | Fungsi | Relevansi SRS |
|---|---|---|---|
| `spatie/laravel-activitylog` | `^5.0.0` | Audit log otomatis pada setiap aksi CRUD model kritis. Rilis 25 Maret 2026. **Requires PHP 8.4+**. | `REQ-FUNC-101`, `REQ-SEC-003`, `REQ-OBS-001` |

**Implementasi immutable audit log:**
Log dikonfigurasi sebagai `read-only` di level aplikasi. Tidak ada route atau policy yang mengizinkan operasi `delete` atau `update` pada tabel `activity_log`.

```php
// config/activitylog.php
'delete_records_older_than_days' => null, // JANGAN diaktifkan — log harus immutable
```

---

### 3.4 Penghapusan Sertifikat Otomatis (Scheduled Task)

Sesuai `REQ-COMP-002`, file sertifikat pendaftaran dihapus otomatis setelah seleksi final. Menggunakan **Laravel Scheduler** bawaan:

```php
// app/Console/Kernel.php
$schedule->command('sertifikat:cleanup')->daily();
```

---

## 4. Build & Development Tools

| Tool | Versi | Fungsi |
|---|---|---|
| **Node.js** | `^22.x (LTS)` | Runtime untuk Vite build tool. |
| **npm / pnpm** | `latest` | Package manager untuk dependensi JavaScript. |
| **Vite** | `^6.x` | Build tool frontend. Sudah terintegrasi default di Laravel 13. |
| **@inertiajs/vite** | `^3.x` | Plugin Vite resmi Inertia.js v3 untuk page resolution otomatis. |

---

## 5. Infrastructure & Deployment

| Komponen | Pilihan | Keterangan |
|---|---|---|
| **Web Server** | Nginx / Caddy | Nginx lebih umum, Caddy lebih mudah konfigurasi HTTPS otomatis. |
| **PHP Process Manager** | PHP-FPM 8.5 | Menangani concurrent request dari pengguna. |
| **Queue Worker** | Laravel Queue (database driver) | Untuk proses import Excel massal async. Bisa diupgrade ke Redis jika dibutuhkan. |
| **Task Scheduler** | Laravel Cron | Auto-delete sertifikat, auto-archive audit log alumni. |
| **Hosting** | VPS Linux (Ubuntu 24.04) | Minimum 2 vCPU, 4 GB RAM, 50 GB SSD untuk 5.000 pengguna. |

---

## 6. Matriks Kompatibilitas Versi

Tabel berikut merangkum seluruh dependensi dan kompatibilitas versi minimum yang harus dipenuhi:

| Package | Versi yang Digunakan | PHP Min | Laravel Min | Tanggal Rilis |
|---|---|---|---|---|
| **Laravel** | 13.x | 8.3 | — | 17 Mar 2026 |
| **PHP** | **8.5** | — | — | Nov 2025 |
| **Inertia.js** | 3.x | 8.2 | 11 | 26 Mar 2026 |
| **React** | 19.x | — | — | — |
| **Tailwind CSS** | 4.3.0 | — | — | 8 Mei 2026 |
| **MySQL** | 8.4 LTS / 9.x | — | — | Rolling |
| **laravel/socialite** | latest | 8.x | 10 | Rolling |
| **spatie/laravel-permission** | 7.4.1 | 8.3 | **12** | 29 Apr 2026 |
| **spatie/laravel-activitylog** | 5.0.0 | **8.4** | 11 | 25 Mar 2026 |
| **maatwebsite/laravel-excel** | 3.1.x | 8.1 | 9 | Stable |
| **barryvdh/laravel-dompdf** | 3.1.2 | 8.1 | 9 | 17 Mar 2026 |

> [!IMPORTANT]
> Gunakan **PHP 8.5** (bukan 8.3) karena `spatie/laravel-activitylog v5` memerlukan PHP minimal 8.4. Dengan PHP 8.5, seluruh dependensi di atas terpenuhi tanpa konflik.

---

## 7. Perintah Instalasi Lengkap

```bash
# 1. Buat project Laravel 13 baru
composer create-project laravel/laravel smkn1bawang-ekskul "^13.0"
cd smkn1bawang-ekskul

# 2. Install Inertia.js v3 (Server-side adapter)
composer require inertiajs/inertia-laravel

# 3. Install React 19 + Inertia.js v3 React adapter + TypeScript + Vite plugin
npm install @inertiajs/react@^3 react@^19 react-dom@^19
npm install -D @inertiajs/vite typescript @types/react @types/react-dom

# 4. Install Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# 5. Install Spatie Permission & Activitylog
composer require spatie/laravel-permission:^7.4
composer require spatie/laravel-activitylog:^5.0

# 6. Install Google OAuth
composer require laravel/socialite

# 7. Install Excel Import
composer require maatwebsite/excel:^3.1

# 8. Install PDF Export
composer require barryvdh/laravel-dompdf:^3.1

# 9. Publish config & migration
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"

# 10. Setup database MySQL di .env & jalankan migrasi
php artisan migrate
```

---

## 8. Referensi Dokumentasi Resmi

| Teknologi | URL Dokumentasi |
|---|---|
| Laravel 13 | https://laravel.com/docs/13.x |
| Inertia.js v3 | https://inertiajs.com |
| React 19 | https://react.dev |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| MySQL 8.4 LTS | https://dev.mysql.com/doc/refman/8.4/en/ |
| Laravel Socialite | https://laravel.com/docs/13.x/socialite |
| Spatie Permission v7 | https://spatie.be/docs/laravel-permission |
| Spatie Activitylog v5 | https://spatie.be/docs/laravel-activitylog |
| Laravel Excel v3.1 | https://docs.laravel-excel.com/3.1 |
| Laravel DomPDF v3 | https://github.com/barryvdh/laravel-dompdf |
