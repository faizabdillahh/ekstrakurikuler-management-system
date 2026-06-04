# AGENTS.md
## Panduan AI Agent — Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang

> Baca file ini PERTAMA sebelum melakukan apapun di codebase ini.

---

## Identitas Proyek

Aplikasi web monolith untuk mengelola 27 ekstrakurikuler di SMKN 1 Bawang. Satu sekolah, satu server, satu database. Bukan multi-tenant.

---

## Constraints (JANGAN DILANGGAR)

### Bisnis — Source of Truth
- **`docs/planning/FAQ-dengan-client.md`** adalah SOT mutlak. Jika ada konflik antar dokumen, FAQ menang.
- Seleksi bersifat **biner** — hanya `diterima` atau `ditolak`. TIDAK ADA `waiting_list`, `cadangan`, `alasan penolakan`, atau `nilai seleksi`.
- Pendaftaran ekskul itu **opsional**. Siswa boleh tidak mendaftar ekskul manapun.
- Status anggota hanya `aktif` atau `dikeluarkan`. TIDAK ADA `resign`, `nonaktif`, atau `cuti`.
- **Tidak ada dark mode.** Tidak ada fitur AI. Tidak ada fitur rekomendasi otomatis.
- Perubahan email, NIS, nama, kelas, dan jurusan **hanya bisa dilakukan oleh developer** langsung di database. Tidak ada UI untuk ini.
- Suksesi kepengurusan dilakukan **manual** oleh pengurus lama, bukan otomatis berdasarkan kenaikan kelas.

### Teknis — Stack yang Sudah Final
- **Laravel 13** (PHP 8.5) — jangan downgrade ke PHP 8.3/8.4 karena `spatie/laravel-activitylog v5` requires PHP ≥ 8.4.
- **Inertia.js v3** — BUKAN REST API. Semua response GET return `Inertia::render(...)`. POST/PUT/DELETE return `redirect()`. JANGAN buat `response()->json(...)` kecuali untuk file download.
- **React 19** — required oleh Inertia.js v3. React 18 tidak didukung.
- **Tailwind CSS v4** — konfigurasi via `@theme {}` di CSS. JANGAN buat `tailwind.config.js`.
- **MySQL 8.4 LTS / 9.x** — bukan PostgreSQL. UUID v7 untuk semua primary key (disimpan sebagai CHAR(36)).
- **Inertia v3 tidak punya Axios** — gunakan `useForm()` untuk form submit dan `useHttp()` untuk non-navigation requests.

### Teknis — Package Versions
- `maatwebsite/laravel-excel` → pakai **v3.1** (v4 belum stable per Juni 2026)
- `spatie/laravel-activitylog` → pakai **v5** (requires PHP 8.4+)
- `spatie/laravel-permission` → pakai **v7.4.1** (requires Laravel 12+)
- `barryvdh/laravel-dompdf` → pakai **v3.1.2**

### Data — Immutabilitas
- Tabel `activity_log` **TIDAK BOLEH** punya endpoint DELETE atau UPDATE. Append-only.
- Konfigurasi: `delete_records_older_than_days => null`.
- Tabel `tahun_ajaran` — hanya 1 row yang boleh `is_aktif = true` (CHECK constraint).

---

## Commands

### Development
```bash
# Start development server
php artisan serve
npm run dev

# Run queue worker (WAJIB untuk import Excel & generate laporan)
php artisan queue:work

# Run scheduler (WAJIB untuk auto-cleanup sertifikat)
php artisan schedule:work
```

### Database
```bash
# Migration
php artisan migrate

# Seed data awal (27 ekskul, roles, permissions)
php artisan db:seed

# Fresh start (HATI-HATI: hapus semua data)
php artisan migrate:fresh --seed
```

### Maintenance
```bash
# Manual cleanup sertifikat (biasanya otomatis via scheduler)
php artisan sertifikat:cleanup

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Testing
```bash
php artisan test
npm run test
```

---

## Non-Obvious Patterns

### 1. `ekskul_tahun_ajaran` adalah Pivot Sentral
Data operasional (pendaftaran, anggota, absensi, jadwal, pengumuman, event) **TIDAK** merujuk langsung ke `ekskul.id`. Semuanya FK ke `ekskul_tahun_ajaran.id`. Tabel ini adalah pivot antara `ekskul` + `tahun_ajaran` dan merupakan unit kerja utama sistem.

```
❌ SALAH: Pendaftaran → ekskul_id
✅ BENAR: Pendaftaran → ekskul_tahun_ajaran.id (ekskul_ta_id)
```

### 2. Tahun Ajaran di-inject Otomatis
Middleware `EnsureTahunAjaranAktif` menyuntikkan tahun ajaran aktif sebagai **shared prop** ke semua halaman Inertia. Jangan query tahun ajaran manual di setiap controller — gunakan shared prop.

```php
// ❌ SALAH
$ta = TahunAjaran::where('is_aktif', true)->first();

// ✅ BENAR — sudah tersedia via middleware
// Di HandleInertiaRequests.php → share tahunAjaranAktif
```

### 3. Scope Admin Ekskul via Pivot Table
Admin ekskul hanya boleh akses ekskul yang ditugaskan padanya. Pengecekan dilakukan oleh custom middleware `EnsureEkskulAccess`, BUKAN oleh Spatie Permission secara langsung. Middleware ini mengecek tabel `admin_ekskul_assignments`.

```php
// Route group untuk admin ekskul
Route::middleware(['auth', 'role:admin-ekskul|pembina', 'ekskul.access'])
    ->prefix('manage/ekskul/{ekskul_ta_id}')
    ->group(function () { ... });
```

### 4. Form Submit = useForm(), BUKAN fetch/axios
Inertia.js v3 menghapus Axios. Semua form submit menggunakan hook `useForm()`. Response bukan JSON, melainkan redirect dengan flash message.

```tsx
// ✅ Pattern yang benar
const form = useForm({ status: 'diterima' });
form.put(`/manage/ekskul/${id}/seleksi/${pendaftaranId}`);

// ❌ JANGAN lakukan ini
fetch('/api/seleksi', { method: 'PUT', body: JSON.stringify(...) });
```

### 5. Warna Ekskul Dinamis via CSS Variables
Setiap ekskul punya `warna_primer` dan `warna_sekunder` di database. Saat halaman ekskul dimuat, override CSS Variables di root element:

```tsx
// Pattern di komponen React halaman ekskul
<div style={{
  '--color-primary': ekskul.warna_primer,
  '--color-secondary': ekskul.warna_sekunder
} as React.CSSProperties}>
```

### 6. Sertifikat File = Temporary
File sertifikat pendaftaran dihapus otomatis oleh `sertifikat:cleanup` (daily cron) setelah `is_seleksi_final = true`. Jangan asumsikan file sertifikat selalu ada — selalu cek `Storage::exists()` sebelum serve.

### 7. WhatsApp = Frontend Helper, Bukan Backend
Notifikasi WhatsApp bukan API call dari server. Ini hanya URL generator di frontend:
```ts
const waLink = `https://wa.me/62${noHp.slice(1)}?text=${encodeURIComponent(pesan)}`;
window.open(waLink, '_blank');
```

### 8. Import Excel = Async via Queue
Import data siswa massal TIDAK diproses di HTTP request. File diunggah, lalu `ImportSiswaJob` di-dispatch ke Queue Worker. Controller langsung return "sedang diproses". Jangan `$import->import()` secara synchronous.

### 9. Dual Role User
Satu user bisa punya multiple Spatie roles (contoh: `siswa` + `admin-ekskul`). Dashboard menampilkan context switcher. Saat mengecek permission, gunakan `$user->hasRole(...)` bukan asumsi bahwa user hanya punya 1 role.

### 10. Album Foto = Publik, Tanpa Login
Route `/galeri` dan `/galeri/{album_id}` tidak memerlukan autentikasi. Album foto ekskul bisa diakses oleh siapapun, termasuk alumni yang sudah logout.

---

## Struktur Dokumentasi

```
docs/
├── planning/                    # Fase perencanaan (sudah final)
│   ├── FAQ-dengan-client.md     # ⭐ SOURCE OF TRUTH — baca ini pertama
│   ├── prd.md                   # Product Requirements Document
│   └── srs.md                   # Software Requirements Specification (56 REQ-IDs)
├── architecture/                # Arsitektur teknis (sudah final)
│   ├── architecture-context.md  # 🧠 Ringkasan cepat arsitektur (baca ini untuk konteks)
│   ├── architecture.md          # Arsitektur lengkap (layer, flow, deployment)
│   ├── tech-stack.md            # Versi dependency + install commands
│   ├── database-schema.md       # 27 tabel (kolom, tipe, constraint, index)
│   ├── api-design.md            # 83 route (Method, URI, Controller, Props)
│   └── adr/                     # Architecture Decision Records (13 ADR)
├── context/                     # Konteks proyek (update berkala)
│   ├── decision-log.md          # 13 keputusan (DEC-001 s/d DEC-013)
│   ├── progress.md              # Status deliverable (selesai/belum)
│   ├── session-notes.md         # Ringkasan sesi kerja terakhir
│   └── known-issues.md          # Limitasi & bug yang diketahui
├── design/                      # Desain UI & Standar Visual
│   ├── design-system.md         # ⭐ Acuan utama warna, komponen, spacing, & a11y
│   ├── color.md                 # Aturan penggunaan warna & kontras minimum
│   ├── typography.md            # Aturan font, ukuran, & letter-spacing
│   ├── typography-hierarchy.md  # Hierarki visual & information flow
│   ├── state-coverage.md        # 5 state wajib untuk setiap permukaan data
│   ├── animation-discipline.md  # Batasan durasi, easing, & prefers-reduced-motion
│   ├── accessibility-baseline.md# Checklist kepatuhan WCAG 2.2 AA
│   ├── form-validation.md       # Timing & state machine form validation
│   ├── laws-of-ux.md            # Heuristik & hukum UX yang diterapkan
│   ├── anti-ai-slop.md          # Anti-pattern visual yang dilarang keras
│   └── rtl-and-bidi.md          # Penanganan teks dua arah (LTR/RTL)
├── implementation/              # Panduan & Rencana Implementasi
│   ├── implementation-plan.md   # Rencana 5 fase pengembangan per-P0/P1/P2
│   ├── coding-standards.md      # Standar penulisan kode Backend & Frontend
│   └── build-plan.md            # Langkah & instruksi build/scaffolding
├── security/                    # Kebijakan & Implementasi Keamanan
│   └── full-stack-security.md   # Aturan validasi input, CSRF, & RBAC
└── referensi/                   # Dokumen referensi & aset
    └── images/                  # Aset gambar & logo resmi sekolah
```

### Aset Gambar Resmi (`docs/referensi/images/`)
Semua aset gambar berikut telah disediakan dan **boleh digunakan secara langsung** di dalam aplikasi:
- `logo-SMKN1-Bawang.png` (Logo resmi sekolah SMKN 1 Bawang)
- `SMK-Bisa-Hebat.png` (Logo SMK Bisa Hebat)
- `Sekolah-Berintegritas.png` (Logo Sekolah Berintegritas)
- `logo-pendidikan.png` (Logo Tut Wuri Handayani)
- `laman-website.png` (Ikon/aset web)
- `facebook.png`, `instagram.png`, `tiktok.png.png`, `youtube.png` (Ikon media sosial resmi)

---

## Quick Reference

| Aspek | Detail |
|---|---|
| **Database** | MySQL 8.4 LTS / 9.x, UUID v7 PK, Eloquent ORM |
| **Auth** | Google OAuth, domain `@smkn1bawang.sch.id` wajib |
| **RBAC** | 5 role: siswa, admin-ekskul, pengurus-osis, pembina, kesiswaan |
| **Frontend** | React 19 + TypeScript + Inertia.js v3 + Tailwind CSS v4 |
| **Backend** | Laravel 13, PHP 8.5, pattern Controller → Service → Repository |
| **Build** | Vite 6 dengan `@inertiajs/vite` plugin |
| **Deploy** | Single VPS Linux, Nginx, PHP-FPM, MySQL, Queue Worker |
| **Palet warna** | Primary `#fff000`, Secondary `#00a2e9`, Accent `#fda800` |
| **Total route** | 83 (6 public, 10 shared, 8 siswa, 38 manage, 4 osis, 17 admin) |
| **Total tabel** | 27 (21 custom + 6 Spatie auto-generated) |
