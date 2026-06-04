# Architecture Decision Records (ADR)
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Format:** Michael Nygard (Title, Status, Context, Decision, Consequences)  
> **Tanggal mulai:** 3 Juni 2026  
> **Referensi:** `docs/architecture/architecture-context.md`, `docs/context/decision-log.md`

---

## Daftar ADR

| ADR | Judul | Status | Tanggal |
|---|---|---|---|
| ADR-001 | Arsitektur Monolith Modular | Accepted | 4 Jun 2026 |
| ADR-002 | Laravel 13 sebagai Backend Framework | Accepted | 4 Jun 2026 |
| ADR-003 | Inertia.js v3 + React 19 (Bukan REST API) | Accepted | 4 Jun 2026 |
| ADR-004 | MySQL 8.4 LTS / 9.x sebagai Database | Accepted | 4 Jun 2026 |
| ADR-005 | Tailwind CSS v4 dengan CSS-first Config | Accepted | 4 Jun 2026 |
| ADR-006 | Google OAuth 2.0 dengan Restricsi Domain | Accepted | 3 Jun 2026 |
| ADR-007 | Spatie Permission v7 untuk RBAC dengan Scope Per-Ekskul | Accepted | 4 Jun 2026 |
| ADR-008 | UUID v7 sebagai Primary Key | Accepted | 4 Jun 2026 |
| ADR-009 | Tahun Ajaran sebagai Partition Key Data | Accepted | 3 Jun 2026 |
| ADR-010 | Audit Log Immutable via Spatie Activitylog | Accepted | 3 Jun 2026 |
| ADR-011 | Notifikasi WhatsApp via wa.me (Gratis) | Accepted | 3 Jun 2026 |
| ADR-012 | Import Excel Massal via Queue (Async) | Accepted | 4 Jun 2026 |
| ADR-013 | Sertifikat Temporary dengan Auto-Cleanup | Accepted | 4 Jun 2026 |

---

## ADR-001: Arsitektur Monolith Modular

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Sistem ini melayani satu sekolah (SMKN 1 Bawang) dengan 2.000–5.000 pengguna. Tim pemelihara jangka panjang adalah staf IT sekolah dan guru RPL, bukan developer profesional. Perlu arsitektur yang mudah di-deploy, di-debug, dan dipelihara.

### Decision

Menggunakan arsitektur **monolith modular** — satu aplikasi, satu server, satu database. Kode diorganisir per domain bisnis (Auth, Ekskul, Pendaftaran, dll.) menggunakan pola Controller → Service → Repository. Tidak menggunakan microservices, API gateway, atau multi-region.

### Consequences

- ✅ Deployment sederhana — cukup satu VPS (2 vCPU, 4GB RAM, 50GB SSD)
- ✅ Debugging mudah — semua log dan stack trace ada di satu tempat
- ✅ Biaya hosting rendah — satu server untuk semua komponen
- ✅ Guru/staf IT sekolah mampu memelihara karena satu codebase
- ⚠️ Jika suatu saat butuh scaling horizontal, perlu refactoring signifikan
- ⚠️ Seluruh sistem down jika server bermasalah (no redundancy)

---

## ADR-002: Laravel 13 sebagai Backend Framework

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Sistem membutuhkan framework backend yang matang dengan ekosistem library siap pakai (OAuth, RBAC, Excel import, PDF export, Queue, Scheduler). Framework harus bisa dipelihara oleh guru RPL dan siswa jurusan RPL SMKN yang kurikulumnya berbasis PHP. Laravel 13 (rilis Maret 2026) adalah versi terbaru dengan security support hingga Maret 2028.

### Decision

Menggunakan **Laravel 13** dengan **PHP 8.5**. PHP 8.5 dipilih (bukan 8.3 atau 8.4) karena `spatie/laravel-activitylog v5` memerlukan PHP ≥ 8.4.

### Consequences

- ✅ Ekosistem library lengkap: Socialite, Queue, Scheduler, Eloquent ORM
- ✅ Dokumentasi sangat lengkap dan komunitas besar di Indonesia
- ✅ Kurikulum RPL SMK mayoritas berbasis PHP/Laravel
- ✅ Security support resmi hingga Maret 2028
- ⚠️ PHP 8.5 wajib — versi lebih rendah akan menyebabkan dependency conflict
- ⚠️ Laravel 13 mungkin ada breaking changes dari Laravel 12 yang perlu diperhatikan

---

## ADR-003: Inertia.js v3 + React 19 (Bukan REST API)

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Sistem membutuhkan pengalaman SPA (Single Page Application) tanpa full page reload, tetapi juga tanpa kompleksitas membangun dan memelihara REST API terpisah + JWT/token management. Tim pemelihara (guru RPL) sudah familiar dengan routing Laravel tradisional.

### Decision

Menggunakan **Inertia.js v3** sebagai bridge antara Laravel (server) dan **React 19** (client). Seluruh routing tetap di Laravel. Data dikirim sebagai props ke komponen React. Tidak ada REST API endpoint, tidak ada JWT, tidak ada Axios (dihapus di Inertia v3).

### Consequences

- ✅ Developer hanya perlu menguasai Laravel routing + React components
- ✅ Auth/RBAC/session sepenuhnya ditangani Laravel — tidak perlu token management
- ✅ Tidak ada API versioning, CORS, atau auth token di frontend
- ✅ SEO-ready (Inertia mendukung SSR jika diperlukan)
- ⚠️ **Breaking changes Inertia v3:** Axios dihapus, layout system baru, requires React 19
- ⚠️ Tidak bisa expose API publik ke pihak ketiga tanpa tambahan route API
- ⚠️ Semua form submit menggunakan `useForm()` hook (bukan fetch/axios langsung)

---

## ADR-004: MySQL 8.4 LTS / 9.x sebagai Database

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Sistem menyimpan data relasional kompleks (anggota, pendaftaran, absensi, penilaian) dengan multi-join untuk laporan. Audit log membutuhkan integritas tinggi. Beberapa entitas (struktur organisasi, media sosial ekskul) memerlukan penyimpanan data semi-structured.

### Decision

Menggunakan **MySQL 8.4 LTS / 9.x** sebagai database tunggal. Dipilih karena kemudahan pemeliharaan oleh staf IT sekolah (MySQL sangat umum diajarkan di kurikulum RPL SMK) serta ketersediaan hosting/VPS lokal yang dominan menyertakan MySQL.

### Consequences

- ✅ Kurikulum RPL SMK mayoritas berbasis PHP/Laravel & MySQL, mempermudah suksesi maintainer sekolah
- ✅ Kemudahan deployment di web hosting / VPS lokal sekolah
- ✅ Mendukung tipe data `JSON` untuk menyimpan konfigurasi organisasi dinamis
- ✅ Mendukung `CHECK` constraints (sejak MySQL 8.0.16) untuk integritas data
- ⚠️ Penanganan UUID v7 di MySQL sebagai primary key membutuhkan konversi string ke biner (`BINARY(16)`) atau disimpan sebagai `CHAR(36)` yang sedikit lebih boros kapasitas dibanding integer auto-increment biasa.

---

## ADR-005: Tailwind CSS v4 dengan CSS-first Config

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Sistem membutuhkan styling yang cepat dikembangkan dan konsisten. Setiap ekskul memiliki warna branding sendiri yang harus bisa diubah secara dinamis oleh admin (`REQ-MAINT-001`). Palet warna desain sistem telah ditentukan: `#fff000` (primary), `#00a2e9` (secondary).

### Decision

Menggunakan **Tailwind CSS v4.3** dengan konfigurasi `@theme {}` di file CSS (bukan `tailwind.config.js`). Warna ekskul disimpan sebagai CSS Variables yang dapat di-override secara dinamis per halaman ekskul.

### Consequences

- ✅ Konfigurasi di CSS langsung — tidak perlu file JS terpisah
- ✅ CSS Variables native memungkinkan warna dinamis per ekskul
- ✅ Build time lebih cepat (engine berbasis Rust)
- ✅ Zero-config content detection
- ⚠️ **Breaking change:** `tailwind.config.js` tidak lagi digunakan — migrasi dari v3 tidak trivial
- ⚠️ Dokumentasi dan tutorial Tailwind v4 masih lebih sedikit dibanding v3

---

## ADR-006: Google OAuth 2.0 dengan Restricsi Domain

**Status:** Accepted  
**Tanggal:** 3 Juni 2026

### Context

Seluruh pengguna sistem (siswa, guru, staf) sudah memiliki akun Google Workspace sekolah dengan domain `@smkn1bawang.sch.id`. Sistem tidak boleh bisa diakses oleh email personal (Gmail, Yahoo, dll). Tidak diperlukan fitur registrasi manual.

### Decision

Menggunakan **Google OAuth 2.0** via `laravel/socialite`. Setelah callback Google berhasil, sistem memvalidasi bahwa email berakhiran `@smkn1bawang.sch.id`. Email di luar domain ditolak. Tidak ada halaman register — user hanya bisa masuk via tombol "Login dengan Google".

### Consequences

- ✅ Tidak perlu implementasi password hashing, forgot password, email verification
- ✅ Keamanan delegasi ke Google (2FA, breach detection, dll)
- ✅ Siswa tidak perlu mengingat password baru
- ✅ Secara otomatis membatasi akses hanya untuk komunitas sekolah
- ⚠️ Bergantung 100% pada Google — jika Google down, tidak ada fallback login
- ⚠️ Memerlukan Google Workspace admin untuk konfigurasi OAuth consent screen

---

## ADR-007: Spatie Permission v7 untuk RBAC dengan Scope Per-Ekskul

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Sistem memiliki 5 role (siswa, admin-ekskul, pengurus-osis, pembina, kesiswaan) dengan hak akses berbeda. Admin ekskul dan pembina hanya boleh mengelola ekskul yang secara spesifik ditugaskan padanya. Satu user bisa memiliki lebih dari satu role (dual role).

### Decision

Menggunakan **Spatie Laravel Permission v7.4.1** untuk RBAC. Scope per-ekskul diimplementasikan via tabel pivot `admin_ekskul_assignments` dan custom middleware `EnsureEkskulAccess`. Dual role didukung secara native oleh Spatie (satu user bisa punya multiple roles).

### Consequences

- ✅ Library battle-tested dan well-maintained
- ✅ Dual role bawaan — tidak perlu custom implementation
- ✅ Integrasi mulus dengan Laravel middleware dan Policy
- ⚠️ Scope per-ekskul **bukan** fitur bawaan Spatie — perlu custom middleware tambahan
- ⚠️ Semakin banyak role & permission, semakin kompleks testing otorisasinya

---

## ADR-008: UUID v7 sebagai Primary Key

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Audit log membutuhkan identifier unik yang tidak bisa ditebak urutannya. UUID juga mencegah enumeration attack pada URL (misal: `/siswa/1`, `/siswa/2`). MySQL mendukung UUID yang dapat disimpan sebagai tipe `CHAR(36)`.

### Decision

Seluruh tabel menggunakan **UUID v7** sebagai primary key. UUID v7 dipilih (bukan v4) karena masih time-ordered sehingga tidak merusak performa index B-tree database.

### Consequences

- ✅ Keamanan URL — tidak bisa ditebak ID berikutnya
- ✅ Aman untuk audit log dan data sensitif
- ✅ Time-ordered (UUID v7) sehingga index tetap efisien
- ⚠️ UUID lebih besar (16 bytes vs 4 bytes integer) — sedikit dampak ke storage dan join
- ⚠️ URL menjadi lebih panjang dan kurang human-readable

---

## ADR-009: Tahun Ajaran sebagai Partition Key Data

**Status:** Accepted  
**Tanggal:** 3 Juni 2026

### Context

Data ekskul berganti setiap tahun ajaran — pengurus baru, anggota baru, jadwal baru. Data tahun lama harus bisa diarsipkan (read-only) tanpa mengganggu operasional tahun berjalan. Hampir semua query operasional perlu di-filter berdasarkan tahun ajaran aktif.

### Decision

`tahun_ajaran_id` menjadi foreign key di hampir semua tabel operasional, melalui pivot `ekskul_tahun_ajaran`. Middleware `EnsureTahunAjaranAktif` otomatis menginjeksi tahun ajaran aktif ke semua request. Data diarsipkan dengan flag `is_archived = true`, yang membuat data menjadi read-only.

### Consequences

- ✅ Isolasi data antar tahun ajaran — operasional bersih setiap tahun baru
- ✅ Arsip tahun lama otomatis menjadi read-only tanpa delete
- ✅ Query default selalu di-scope ke tahun aktif — performa terjaga
- ⚠️ Semua query dan controller harus sadar akan konteks tahun ajaran
- ⚠️ Laporan lintas tahun ajaran memerlukan query khusus

---

## ADR-010: Audit Log Immutable via Spatie Activitylog

**Status:** Accepted  
**Tanggal:** 3 Juni 2026

### Context

`REQ-SEC-003` mewajibkan audit log yang mencatat WHO, WHAT, WHEN, IP Address pada setiap mutasi data kritis. Log tidak boleh bisa dihapus atau diedit oleh siapapun melalui UI/API. Log harus otomatis diarsipkan saat siswa menjadi alumni.

### Decision

Menggunakan **Spatie Laravel Activitylog v5** dengan konfigurasi `delete_records_older_than_days => null` (tidak pernah auto-delete). Tidak ada route PUT/DELETE untuk tabel `activity_log`. Model-model kritis (pendaftaran, anggota, seleksi, penilaian) menggunakan trait `LogsActivity`.

### Consequences

- ✅ Audit trail lengkap dan tidak bisa dimanipulasi via aplikasi
- ✅ Otomatis mencatat old values & new values dalam JSON
- ✅ Requires PHP 8.4+ (compatible dengan stack kita PHP 8.5)
- ⚠️ Tabel `activity_log` akan terus tumbuh — perlu monitoring disk space
- ⚠️ Jika perlu hapus log (misal GDPR), harus langsung via SQL — tidak ada UI

---

## ADR-011: Notifikasi WhatsApp via wa.me (Gratis)

**Status:** Accepted  
**Tanggal:** 3 Juni 2026

### Context

Klien menginginkan notifikasi ke siswa via WhatsApp (medium paling populer). Namun budget tidak memungkinkan langganan API WhatsApp Business (berbayar). Sistem harus bisa mengirim pesan massal tanpa biaya tambahan.

### Decision

Menggunakan tautan `https://wa.me/{nomor}?text={pesan}` yang di-generate otomatis oleh frontend. Admin klik tombol → buka tab baru WhatsApp Web per siswa. Tidak ada API WhatsApp Business, tidak ada delivery tracking.

### Consequences

- ✅ Gratis — tidak ada biaya langganan API
- ✅ Implementasi sangat sederhana (helper function JavaScript)
- ✅ Tidak perlu registrasi WhatsApp Business atau verifikasi akun
- ⚠️ **Tidak real-time** — admin harus klik manual per siswa (atau batch open tabs)
- ⚠️ Tidak ada delivery tracking (apakah pesan sampai atau dibaca)
- ⚠️ Browser mungkin blokir multiple tab jika pop-up blocker aktif

---

## ADR-012: Import Excel Massal via Queue (Async)

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Kesiswaan perlu mengimpor data siswa baru (hingga 5.000 baris) dari file Excel setiap awal tahun ajaran. Proses ini tidak boleh menyebabkan timeout pada HTTP request (`REQ-PERF-003`). Waktu maksimal yang diperbolehkan adalah 3 menit.

### Decision

Menggunakan **maatwebsite/laravel-excel v3.1** dengan interface `ShouldQueue`. File diunggah ke server, lalu proses parsing dan insert didelegasikan ke **Laravel Queue Worker** yang berjalan di background. User menerima feedback "Import sedang diproses" secara instan.

### Consequences

- ✅ Tidak ada HTTP timeout — response langsung kembali ke user
- ✅ Proses chunked (batch per 1.000 baris) — efisien memori
- ✅ Jika gagal di tengah jalan, queue job bisa di-retry
- ⚠️ User tidak melihat progress real-time (perlu polling atau refresh manual)
- ⚠️ Laravel Excel v4 belum stable — harus tetap di v3.1
- ⚠️ Queue Worker harus running terus (`php artisan queue:work` sebagai daemon)

---

## ADR-013: Sertifikat Temporary dengan Auto-Cleanup

**Status:** Accepted  
**Tanggal:** 4 Juni 2026

### Context

Siswa bisa mengunggah file sertifikat (PDF/gambar, maks 2MB) saat mendaftar ekskul. File ini hanya dibutuhkan selama proses seleksi. Setelah seleksi final, file harus dihapus otomatis untuk menghemat storage dan melindungi privasi (`REQ-COMP-002`).

### Decision

File sertifikat disimpan di `storage/app/sertifikat/{pendaftaran_id}/`. Sebuah Artisan command `sertifikat:cleanup` dijalankan harian oleh Laravel Scheduler. Command ini menghapus file fisik untuk semua pendaftaran yang `is_seleksi_final = true`.

### Consequences

- ✅ Storage tidak menumpuk file yang sudah tidak dibutuhkan
- ✅ Privasi dokumen siswa terlindungi — file dihapus setelah digunakan
- ✅ Otomatis via cron — tidak perlu aksi manual dari admin
- ⚠️ Jika admin butuh melihat sertifikat setelah seleksi final, file sudah tidak ada
- ⚠️ Cron scheduler harus dikonfigurasi dengan benar di server production