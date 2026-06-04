# Architecture Context
## Pemahaman Komprehensif Arsitektur — SMKN 1 Bawang Ekskul System

> **Tanggal:** 4 Juni 2026  
> **Tujuan:** Dokumen ini merangkum pemahaman mendalam dari seluruh file di folder `docs/architecture/` (tech-stack.md, architecture.md, database-schema.md, api-design.md) sebagai referensi cepat untuk sesi kerja berikutnya tanpa perlu membaca ulang semua file.

---

## 1. Gambaran Besar Sistem

Sistem ini adalah **aplikasi web monolith modular** untuk mengelola 27 ekstrakurikuler di SMKN 1 Bawang. Satu sekolah, satu instance deployment, satu database. Tidak ada multi-tenant, tidak ada REST API eksternal, tidak ada microservices.

**Stack final yang sudah diputuskan dan tidak berubah:**
- **Backend:** Laravel 13 (PHP 8.5)
- **Frontend:** React 19 + TypeScript via Inertia.js v3
- **Styling:** Tailwind CSS v4.3 (CSS-first `@theme {}`, tanpa `tailwind.config.js`)
- **Database:** MySQL 8.4 LTS / 9.x
- **Build tool:** Vite 6

---

## 2. Prinsip Arsitektur yang Harus Selalu Diingat

| Prinsip | Implikasi Praktis |
|---|---|
| **Inertia.js, bukan REST** | Semua response GET return `Inertia::render(...)`. POST/PUT/DELETE return `redirect()`. Tidak ada `response()->json()` |
| **Server-side authority** | Semua logika bisnis, RBAC, validasi ada di Laravel. Frontend React hanya rendering |
| **Tahun Ajaran sebagai partition key** | Hampir semua query harus di-scope ke `tahun_ajaran_id` aktif |
| **`ekskul_tahun_ajaran` adalah pivot sentral** | Data operasional (pendaftaran, anggota, absensi, jadwal) FK ke `ekskul_tahun_ajaran.id`, bukan langsung ke `ekskul.id` |
| **Audit log immutable** | Tidak ada DELETE/UPDATE pada `activity_log`. Spatie Activitylog berjalan otomatis di background |
| **Zero paid services** | Google OAuth (gratis) + wa.me (gratis). Tidak ada API WhatsApp Business |

---

## 3. Tech Stack — Hal Kritis yang Tidak Boleh Dilupakan

### PHP & Laravel
- **PHP 8.5 wajib** (bukan 8.3 atau 8.4) — karena `spatie/laravel-activitylog v5` requires PHP ≥ 8.4
- **Laravel 13** — rilis Maret 2026, security support hingga Maret 2028
- **Composer pattern:** Controller → Service → Repository

### Inertia.js v3 — Breaking Changes
- **Axios DIHAPUS** → diganti built-in XHR client
- Gunakan `useForm()` untuk form submission
- Gunakan `useHttp()` untuk non-navigation requests (polling, dll)
- Layout system baru: props-based API (bukan `useLayoutProps`)
- Plugin Vite: `@inertiajs/vite` (auto page resolution)
- Requires React 19 (React 18 tidak didukung)

### Tailwind CSS v4
- Konfigurasi via CSS `@theme {}`, **bukan** `tailwind.config.js`
- Zero-config content detection (tidak perlu definisikan `content` paths)
- CSS Variables native → warna ekskul dinamis via `--color-primary` override
- Palet warna sistem: `#fff000` (primary), `#00a2e9` (secondary), `#fda800` (accent), `#15160c` (dark), `#124272` (navy)

### Package Versions (Penting!)
| Package | Versi | Catatan |
|---|---|---|
| `laravel/socialite` | latest | Google OAuth, domain validation manual |
| `spatie/laravel-permission` | ^7.4.1 | RBAC, requires Laravel 12+ |
| `spatie/laravel-activitylog` | ^5.0.0 | Audit log, **requires PHP 8.4+** |
| `maatwebsite/laravel-excel` | **^3.1** | Import Excel, v4 belum stable |
| `barryvdh/laravel-dompdf` | ^3.1.2 | Export PDF |

---

## 4. Database — Struktur Kunci

### Hirarki Tabel Utama
```
tahun_ajaran
  └── ekskul_tahun_ajaran (pivot: ekskul + tahun_ajaran)
        ├── pendaftaran
        │     └── sertifikat (temporary, auto-delete)
        ├── anggota
        │     ├── absensi (via sesi_absensi)
        │     └── penilaian
        ├── jadwal
        ├── pengumuman
        │     └── lampiran_pengumuman
        ├── event
        │     └── dokumentasi_event
        ├── struktur_organisasi
        └── admin_ekskul_assignments

ekskul (master data — tidak bergantung tahun ajaran)
  └── album_foto
        └── foto (publik, dapat diakses alumni)

users (semua role: siswa, guru, staf — satu tabel)
  └── model_has_roles (Spatie RBAC)
```

### Konvensi Database
- **Primary Key:** UUID v7 di semua tabel
- **Soft Delete:** Hanya tabel `users` (kolom `deleted_at`)
- **Status enum** digunakan sebagai pengganti soft delete di tabel lain
- **Naming:** snake_case, FK = `{singular_table}_id`
- **Timestamps:** `created_at` + `updated_at` di semua tabel

### Tabel Kritis & Aturannya
| Tabel | Aturan Khusus |
|---|---|
| `tahun_ajaran` | CHECK constraint: hanya 1 row dengan `is_aktif = true` |
| `pendaftaran` | UNIQUE(`user_id`, `ekskul_ta_id`) — 1 pendaftaran per ekskul per tahun |
| `anggota` | UNIQUE(`user_id`, `ekskul_ta_id`) — bisa jadi anggota banyak ekskul |
| `absensi` | UNIQUE(`sesi_absensi_id`, `anggota_id`) |
| `penilaian` | UNIQUE(`anggota_id`) — 1 nilai akhir per anggota |
| `activity_log` | **Immutable** — `delete_records_older_than_days => null` |
| `sertifikat` | Temporary — dihapus oleh `sertifikat:cleanup` cron harian |

### Enum Values
| Tabel | Kolom | Values |
|---|---|---|
| `users` | `status` | `aktif`, `pindah_sekolah`, `alumni` |
| `users` | `jenis_kelamin` | `L`, `P` |
| `pendaftaran` | `status` | `dalam_review`, `diterima`, `ditolak` |
| `anggota` | `status` | `aktif`, `dikeluarkan` |
| `absensi` | `status` | `hadir`, `izin`, `sakit`, `alfa` |
| `anggota` | `sumber` | `seleksi`, `manual` |
| `notifikasi` | `tipe` | `pendaftaran_berhasil`, `jadwal_berubah`, `seleksi_diterima`, `seleksi_ditolak`, `pengumuman`, `umum` |

---

## 5. Route Architecture — Pola & Middleware

### Pengelompokan Route
```
Route::middleware('guest')      → Public routes (/, /login, /galeri)
Route::middleware('auth')       → Semua user login (dashboard, profil, notifikasi)
Route::middleware(['auth', 'role:siswa']) → Pendaftaran
Route::middleware(['auth', 'role:admin-ekskul|pembina', 'ekskul.access']) → /manage/ekskul/{id}/*
Route::middleware(['auth', 'role:pengurus-osis']) → /admin/pengurus/*
Route::middleware(['auth', 'role:kesiswaan']) → /admin/*
```

### Shared Props (Tersedia di SEMUA Halaman via HandleInertiaRequests)
```ts
{
  auth: { user: { id, nama, email, roles: string[] } },
  tahunAjaranAktif: { id, nama },
  flash: { success?: string, error?: string },
  notifikasiUnreadCount: number
}
```

### Custom Middleware yang Harus Dibuat
1. **`EnsureTahunAjaranAktif`** — inject tahun ajaran aktif ke semua request
2. **`EnsureEkskulAccess`** (`ekskul.access`) — validasi admin-ekskul hanya akses ekskul yang di-assign di `admin_ekskul_assignments`

### RBAC Roles
| Role | Scope Akses |
|---|---|
| `siswa` | Global — pendaftaran, profil sendiri |
| `admin-ekskul` | Per-ekskul (via `admin_ekskul_assignments`) — seleksi, anggota, absensi, penilaian |
| `pembina` | Per-ekskul — sama seperti admin-ekskul + penilaian |
| `pengurus-osis` | Global lintas ekskul — assign admin, suksesi |
| `kesiswaan` | Global — tahun ajaran, import, laporan, audit log |

### Dual Role
Satu user bisa punya multiple roles (misal: `siswa` + `admin-ekskul`). UI menampilkan context switcher.

---

## 6. Alur Kerja Sistem Kunci

### Alur Autentikasi Google OAuth
```
/auth/google → Google consent screen → /auth/google/callback
→ Validasi: email.endsWith('@smkn1bawang.sch.id')
  → Valid: find_or_create user → assign role → session → /dashboard
  → Invalid: /login dengan error message
```

### Alur Pendaftaran Ekskul
```
Siswa buka /ekskul → Pilih ekskul → /pendaftaran/buat/{ekskul_ta_id}
→ POST /pendaftaran (cek: periode aktif? sudah daftar?)
→ Optional: POST /pendaftaran/{id}/sertifikat (maks 2MB, pdf/jpg/jpeg/png)
→ Status: dalam_review
→ Admin: PUT /manage/ekskul/{id}/seleksi/{pendaftaran_id} (diterima|ditolak)
→ Jika diterima: otomatis buat record di tabel `anggota`
→ PUT /manage/ekskul/{id}/seleksi/finalize → lock seleksi (is_seleksi_final = true)
→ Cron: sertifikat:cleanup → hapus file sertifikat
```

### Alur Import Excel Massal (Async)
```
POST /admin/siswa/import (file Excel)
→ Validasi file (mimes:xlsx, max:10MB)
→ dispatch(ImportSiswaJob) → return "sedang diproses"
→ Queue Worker: Laravel Excel chunk → insert users → ActivityLog
```

### Alur Pergantian Tahun Ajaran
```
PUT /admin/tahun-ajaran/{id}/archive → data lama = read-only
→ Manual: OSIS lama tunjuk OSIS baru
→ Manual: Admin Ekskul lama tunjuk Admin Ekskul baru (Kelas 11 baru)
→ POST /admin/siswa/import (data siswa kelas 10 baru)
→ POST /admin/tahun-ajaran (buat tahun ajaran baru)
→ PUT /admin/tahun-ajaran/{id}/activate
→ POST /admin/periode-pendaftaran (buka periode baru)
```

---

## 7. File Storage Strategy

| Jenis File | Path | Retensi |
|---|---|---|
| Sertifikat pendaftaran | `storage/app/sertifikat/{pendaftaran_id}/` | **Temporary** — auto-delete post seleksi |
| Logo/foto ekskul | `storage/app/public/ekskul/{ekskul_id}/` | Permanen |
| Album foto galeri | `storage/app/public/galeri/{album_id}/` | Permanen |
| Lampiran pengumuman | `storage/app/pengumuman/{pengumuman_id}/` | Permanen |
| Foto profil | `storage/app/public/profil/{user_id}/` | Permanen |

**Semua file upload:** validasi MIME + ukuran di server, rename ke UUID.

---

## 8. Notifikasi WhatsApp

**Bukan** API WhatsApp Business. Menggunakan helper frontend:
```ts
// Format: https://wa.me/628xxx?text=pesan_encoded
function generateWaLink(noHp: string, pesan: string): string
```
Admin klik tombol → buka tab baru wa.me per siswa. Pengiriman massal = buka multiple tabs.

---

## 9. Deployment

Single VPS Linux (Ubuntu 24.04):
- **Nginx/Caddy** → Reverse proxy
- **PHP-FPM 8.5** → Laravel app
- **Queue Worker** → `php artisan queue:work` (import Excel, generate laporan)
- **Cron Scheduler** → `sertifikat:cleanup`, arsip otomatis
- **MySQL 8.4 LTS / 9.x** → localhost:3306

Minimum spec: 2 vCPU, 4 GB RAM, 50 GB SSD.

---

## 10. Keamanan Ringkas

| Aspek | Implementasi |
|---|---|
| Auth | Google OAuth + domain `@smkn1bawang.sch.id` |
| Otorisasi | Spatie Permission RBAC + Laravel Policy + `ekskul.access` middleware |
| CSRF | Laravel built-in (semua POST/PUT/DELETE) |
| XSS | React auto-escaping |
| SQL Injection | Eloquent ORM parameterized queries |
| Audit | Spatie Activitylog — append-only, tidak bisa dihapus |
| Session | Server-side, HttpOnly cookies |

---

## 11. Jumlah Route Ringkas

| Grup | Route Count |
|---|---|
| Public | 6 |
| Shared (auth) | 10 |
| Siswa (pendaftaran) | 8 |
| Admin Ekskul (manage) | 38 |
| Pengurus OSIS | 4 |
| Kesiswaan (admin) | 17 |
| **Total** | **83** |

---

## 12. File Architecture & Tujuannya

| File | Tujuan |
|---|---|
| `tech-stack.md` | Versi tepat semua dependency, breaking changes, install commands |
| `architecture.md` | Gambaran sistem, layer, request flow, auth flow, keamanan, deployment |
| `database-schema.md` | Definisi 27 tabel (kolom, tipe, constraint, index, FK) + ERD Mermaid |
| `api-design.md` | 83 route mapping (Method, URI, Controller, Inertia Page, Props, Validation) |
| `architecture-context.md` | **File ini** — ringkasan cepat untuk sesi baru |
