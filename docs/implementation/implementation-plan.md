# Implementation Plan
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Versi:** 1.0  
> **Tanggal:** 4 Juni 2026  
> **Referensi:** `docs/planning/prd.md`, `docs/planning/srs.md`, `docs/architecture/architecture-context.md`, `docs/architecture/api-design.md`, `docs/architecture/database-schema.md`

---

## 1. Pendahuluan

Dokumen ini berisi rencana implementasi teknis komprehensif untuk membangun Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang. Rencana ini disusun berdasarkan urutan dependensi logis (mana yang unblock mana) dan mengacu langsung pada Persyaratan (REQ-ID) dari `srs.md` dan struktur 83 route dari `api-design.md`.

### Prinsip Pengembangan Utama
1. **Arsitektur 3-Layer:** Controller (HTTP/Inertia Logic) → Service (Business Logic) → Repository (Data Access).
2. **Laravel 13 + Inertia v3 + React 19 + Tailwind v4**: Pastikan versi yang digunakan tepat (PHP 8.5 wajib).
3. **No REST API**: Semua request HTTP menggunakan pola Inertia.js (`useForm`, `useHttp`, atau redirect flash).
4. **Tahun Ajaran Aktif**: Filter wajib di setiap query operasional (`EnsureTahunAjaranAktif` Middleware).
5. **Testing Wajib:** Validasi manual / automation untuk tiap endpoint dan skenario.

---

## 2. Fase 1 — Foundation (P0)
**Fokus:** Persiapan awal, struktur database inti (27 tabel), autentikasi, dan master data.

### 2.1. Inisialisasi Proyek & Tools 
*(Dependensi: Tidak Ada)*
- [x] Install Laravel 13 (via PHP 8.5) & setup MySQL 8.4 / 9.x (`REQ-INST-001`).
- [x] Setup stack frontend: React 19, Inertia.js v3, Vite 6, Tailwind CSS v4 (`@theme`).
- [x] Install Packages: 
  - `laravel/socialite`
  - `spatie/laravel-permission` (^7.4)
  - `spatie/laravel-activitylog` (^5.0) -> Set `delete_records_older_than_days => null` (`REQ-SEC-003`).
  - `maatwebsite/laravel-excel` (^3.1)
  - `barryvdh/laravel-dompdf` (^3.1)
- [x] Setup Base Classes: Controller abstrak, Service abstrak, Repository interface, dan UUID v7 Model Trait.

### 2.2. Database Schema (27 Tabel)
*(Dependensi: 2.1)*
- [x] **Spatie (6):** Migrate Roles, Permissions, ActivityLog.
- [x] **Core (4):** Migrate `tahun_ajaran`, `users`, `ekskul`, `ekskul_tahun_ajaran`.
- [x] **Pendaftaran (3):** Migrate `periode_pendaftaran`, `pendaftaran`, `sertifikat`.
- [x] **Keanggotaan (3):** Migrate `anggota`, `struktur_organisasi`, `admin_ekskul_assignments`.
- [x] **Operasional (4):** Migrate `sesi_absensi`, `absensi`, `penilaian`, `jadwal`.
- [x] **Konten (6):** Migrate `pengumuman`, `lampiran_pengumuman`, `event`, `dokumentasi_event`, `album_foto`, `foto`.
- [x] **Sistem (1):** Migrate `notifikasi`.
- [x] **Seeding:** Seed 5 Role (Spatie), 1 Tahun Ajaran Aktif, 27 Ekskul Default, dan dummy user guru/kesiswaan.

### 2.3. Autentikasi Google OAuth & Middleware
*(Dependensi: 2.2)*
- [x] Implementasi `Auth/LoginController` dan UI `Auth/Login` (Inertia page).
- [x] Implementasi `SocialiteController@callback` -> Validasi `@smkn1bawang.sch.id` (`REQ-SEC-001`).
- [x] Buat Middleware `EnsureTahunAjaranAktif` (Inject shared props `tahunAjaranAktif` di `HandleInertiaRequests`).
- [x] Buat Middleware `EnsureEkskulAccess` (Validasi admin di tabel `admin_ekskul_assignments`).

### 2.4. Dashboard & UI Layout
*(Dependensi: 2.3)*
- [x] Buat Base Layout (Navbar, Sidebar responsif, Context Switcher Role) (`REQ-INT-001`).
- [x] Buat UI `Home` (Publik), dan Routing `/dashboard` yang dire-route ke `Dashboard/{Role}`.

### 2.5. Import Data Siswa (Excel/PDF)
*(Dependensi: 2.4)*
- [x] Setup Laravel Queue Worker (Database driver).
- [x] Buat `Admin\ImportController` & UI `Admin/Siswa/Import` (Upload xlsx).
- [x] Implementasi `ImportSiswaJob` (via Laravel Excel) (`REQ-INT-012`, `REQ-PERF-003`).

---

## 3. Fase 2 — Core Flow (P0)
**Fokus:** Pendaftaran, upload sertifikat, dan manajemen seleksi ekskul.

### 3.1. Halaman Ekskul & Pendaftaran (Siswa)
*(Dependensi: 2.5)*
- [x] Buat `EkskulController` (UI List Ekskul aktif di tahun ajaran, filter kategori).
- [x] Implementasi `PendaftaranController`:
  - `create` / `store`: Form Daftar, cek periode pendaftaran aktif (`REQ-FUNC-020`).
  - `update`: Ubah pilihan ekskul (`REQ-FUNC-024`).
- [x] Implementasi File Upload `SertifikatController@store` (Validasi 2MB, PDF/JPG/PNG) (`REQ-FUNC-023`, `REQ-REL-001`).
- [x] Dashboard Siswa: Tampilkan status "Dalam Review" (`REQ-INT-004`).

### 3.2. Panel Admin Ekskul (Seleksi)
*(Dependensi: 3.1)*
- [x] Buat `Manage\SeleksiController` dan UI `Manage/Seleksi/Index`.
- [x] Fitur update seleksi individu/bulk: Terima/Tolak (Biner) (`REQ-FUNC-030`).
- [x] Fitur `finalize` seleksi: Kunci status, trigger Job migrasi pendaftar diterima -> tabel `anggota`.
- [x] Cron Job (Scheduler): `sertifikat:cleanup` otomatis hapus file jika seleksi final (`REQ-COMP-002`).

### 3.3. Manajemen Anggota Ekskul Aktif
*(Dependensi: 3.2)*
- [x] Buat `Manage\AnggotaController` dan UI `Manage/Anggota/Index`.
- [x] Fitur Tambah Anggota Manual (untuk siswa telat) (`REQ-FUNC-025`).
- [x] Fitur ubah status anggota: "Dikeluarkan" (`REQ-FUNC-040`).

### 3.4. Notifikasi Pendaftaran (WhatsApp & In-App)
*(Dependensi: 3.2)*
- [x] Logika Insert Notifikasi saat pendaftaran sukses, seleksi rilis.
- [x] Buat Helper JS frontend: `generateWaLink(noHp, pesan)`.
- [x] UI Notifikasi In-App (lonceng header) & tombol bulk WA di panel Admin Seleksi (`REQ-INT-011`, `REQ-FUNC-111`).

---

## 4. Fase 3 — Operational (P0)
**Fokus:** Absensi, Penilaian, Laporan, dan Audit Log.

### 4.1. Modul Absensi
*(Dependensi: 3.3)*
- [x] Buat `Manage\AbsensiController` (UI List Sesi & Buat Sesi).
- [x] UI Form Bulk Absensi Anggota per Sesi (Status: Hadir, Izin, Sakit, Alfa) (`REQ-FUNC-050`).
- [x] Fitur Edit Absensi (Update bulk array anggota).

### 4.2. Modul Penilaian
*(Dependensi: 3.3)*
- [x] Buat `Manage\PenilaianController` dan UI `Manage/Penilaian/Index`.
- [x] UI Form Bulk Penilaian (Table View Input) (Validasi nilai akhir 0-100) (`REQ-FUNC-060`).

### 4.3. Laporan & Ekspor (Kesiswaan & Pembina)
*(Dependensi: 4.1 & 4.2)*
- [x] Buat `Admin\LaporanController` (UI filter jenis laporan, ekskul, tahun ajaran).
- [x] Implementasi ekspor PDF (DomPDF) & Excel (Laravel Excel) untuk Daftar Anggota (`REQ-INT-013`).
- [x] Implementasi ekspor Rekap Absensi & Rekap Penilaian per Ekskul.

### 4.4. Audit Log Viewer
*(Dependensi: 2.1)*
- [x] Buat `Admin\AuditLogController` (UI List Logs read-only).
- [x] Tampilkan detail WHO (Causer), WHAT (Properties changes), WHEN (Created At) (`REQ-FUNC-101`).

---

## 5. Fase 4 — Enrichment (P1)
**Fokus:** Media informasi, pengumuman, kalender, dan UI kustom.

### 5.1. Pengumuman & Media Publik
*(Dependensi: 2.4)*
- [ ] Modul `Manage\PengumumanController` (Internal Ekskul, mendukung lampiran file, scheduler terbit) (`REQ-FUNC-070`).
- [ ] Modul `Manage\EventController` & `DokumentasiController` (Event Publik tanpa form peserta) (`REQ-FUNC-071`).
- [ ] Modul `Manage\AlbumController` & `FotoController`.
- [ ] Endpoint Publik `/galeri/{album_id}` (Bisa diakses tanpa auth) (`REQ-FUNC-012`).

### 5.2. Jadwal & Kalender Terpadu
*(Dependensi: 3.3)*
- [ ] Modul `Manage\JadwalController` (Set hari, jam, lokasi).
- [ ] UI `Kalender/Index` (View gabungan semua jadwal ekskul) (`REQ-FUNC-081`).
- [ ] Implementasi SQL Query deteksi bentrok jadwal di dashboard siswa (`REQ-FUNC-080`).

### 5.3. Dashboard Personalisasi & Pencarian
*(Dependensi: 3.1)*
- [ ] Modul Edit Profil Ekskul `Manage\EkskulController@edit` (Input warna primer/sekunder).
- [ ] Implementasi Inject CSS Variables (`--color-primary`) ke UI React saat membuka profil ekskul (`REQ-MAINT-001`).
- [ ] Buat `PencarianController` (Global Search) (`REQ-INT-003`).

### 5.4. Suksesi Kepengurusan (OSIS)
*(Dependensi: 3.3)*
- [ ] Buat `Admin\PengurusController` (Fitur assign admin ekskul baru, suksesi OSIS) (`REQ-CM-001`).

---

## 6. Fase 5 — Enhancement & Polish (P2)
**Fokus:** Optimasi, aksesibilitas, dan deployment akhir.

### 6.1. Ranking & Statistik
*(Dependensi: 3.3)*
- [ ] Tambahkan UI Statistik (Total Anggota, Total Pendaftar, Ranking Pendaftar Terbanyak) di Dashboard Kesiswaan.

### 6.2. Kepatuhan Aksesibilitas (WCAG AA)
*(Dependensi: Semua Fase)*
- [ ] Jalankan Lighthouse / axe accessibility testing.
- [ ] Perbaikan Color Contrast Ratio (Text ≥ 4.5:1), Tab Navigation focus (`REQ-INT-002`, `REQ-COMP-001`).

### 6.3. Load & Security Testing
*(Dependensi: Semua Fase)*
- [ ] Validasi middleware `EnsureEkskulAccess` tidak tembus cross-ekskul id (`REQ-SEC-002`).
- [ ] Stress testing endpoint pendaftaran dan import excel bulk (`REQ-PERF-002`).

### 6.4. Server Setup & Deployment
*(Dependensi: Semua Fase)*
- [ ] Konfigurasi Server Linux (Nginx, PHP-FPM 8.5).
- [ ] Setup Laravel Supervisor untuk `queue:work`.
- [ ] Setup Cron Job `* * * * * cd /path-to-your-project && php artisan schedule:run`.
- [ ] Run skrip migrasi inisialisasi awal.

---

## Aturan Komitmen & Pull Request (Branching)
- Prefix branch: `feat/`, `fix/`, `chore/`, `refactor/`.
- Tiap PR harus lolos static analysis (PHPStan Level 5+) dan Laravel Pint / ESLint.
- Reviewer harus memastikan UI patuh aturan `AGENTS.md` (misal: Tidak ada dark mode).
