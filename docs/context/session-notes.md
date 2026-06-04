# Session Notes — Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang

> Ringkasan sesi kerja terakhir agar context tidak hilang saat memulai sesi baru.

---

## Sesi 1 — 3 Juni 2026
**Fokus:** Pembuatan dokumen perencanaan awal.
- Membaca dan memahami FAQ klien sebagai SOT mutlak.
- Membuat PRD (`docs/planning/prd.md`) dari FAQ — mencakup 19 fitur (F01–F19) dengan prioritas MoSCoW.
- Membuat draf awal SRS (`docs/planning/srs.md`) dengan template kosong.
- Memperbarui integrasi WhatsApp dari "API berbayar" menjadi "wa.me gratis" sesuai FAQ.

## Sesi 2 — 4 Juni 2026
**Fokus:** Finalisasi SRS, Tech Stack, dan Arsitektur.
- Menulis ulang SRS secara lengkap (v1.0) — 56 requirement ID (REQ-*), tabel verifikasi, appendix matriks hak akses.
- Melakukan riset versi terkini dependensi (Juni 2026):
  - Laravel 13 (Mar 2026), PHP 8.5 (Nov 2025), Inertia.js v3 (Mar 2026), React 19, Tailwind CSS v4.3 (Mei 2026), MySQL 8.4 LTS / 9.x.
  - Spatie Activitylog v5 (requires PHP 8.4+), Spatie Permission v7.4.1, Laravel Excel v3.1 (v4 belum stable), DomPDF v3.1.2.
- Membuat `docs/architecture/tech-stack.md` (v1.0) dengan versi akurat, breaking changes, dan perintah instalasi.
- Merancang arsitektur dalam `docs/architecture/architecture.md`:
  - Monolith modular, pola Controller → Service → Repository.
  - Entity Relationship Diagram (Mermaid) untuk 12+ entitas utama.
  - Alur request Inertia, alur OAuth, alur background job import.
  - Strategi file storage, caching, keamanan, deployment single-server.
- Mengisi seluruh context files (decision-log, progress, session-notes, known-issues).

### Langkah Selanjutnya
1. Finalisasi database schema detail (`docs/architecture/database-schema.md`).
2. Definisikan route/page mapping (`docs/architecture/api-design.md`).

## Sesi 3 — 4 Juni 2026 (Lanjutan)
**Fokus:** Penyiapan Standar Keamanan, Desain, dan Rencana Implementasi.
- Mengkompilasi aturan visual ke dalam `docs/design/design-system.md` berdasar referensi *craft rules* (color, typography, animation, accessibility, form-validation, state-coverage).
- Memperbarui `AGENTS.md` dengan mendaftarkan folder dokumen baru (`design`, `implementation`, `security`) dan merujuk aset gambar yang sah di `referensi/images/`.
- Merombak ulang `docs/implementation/implementation-plan.md` menjadi Fase 1–5 terperinci dengan pemetaan Arsitektur 3-Layer dan referensi ke REQ-ID dari SRS.
- Menyusun `docs/security/full-stack-security.md` berdasarkan riset standar OWASP Top 10:2025 terbaru, aturan keamanan Laravel 13 (AES-256-GCM, Eloquent protection), pola CSRF dari Inertia v3 XHR client, serta hardening MySQL (SSL, otentikasi aman).
- Memperbarui berkas konteks (`progress.md` dan `session-notes.md`) karena seluruh proses perencanaan dokumentasi arsitektur dan sistem telah usai.

### Langkah Selanjutnya
1. Definisikan folder structure Laravel (`docs/architecture/folder-structure.md`).
2. Inisialisasi Project Base (Scaffolding): `composer create-project laravel/laravel` sesuai `tech-stack.md`.
3. Mulai pengerjaan Fase 1 (Foundation): Setup DB migrations untuk 27 tabel dan middleware Auth Google.

## Sesi 4 — 4 Juni 2026 (Lanjutan)
**Fokus:** Migrasi Database Lengkap, Pembuatan Model Eloquent, dan Seeding Foundation.
- Menulis dan mematangkan migrasi tersisa (Pendaftaran, Keanggotaan, Operasional, Konten, Sistem) sehingga lengkap mencakup 27 tabel.
- Mengonfigurasi environment `.env` untuk terhubung ke database MySQL Laragon (`db_ekskul_bawang`).
- Membuat 20 model Eloquent yang mewakili entitas skema database dengan relasi lengkap dan menggunakan trait `HasUuidV7`.
- Menyelesaikan isu seeding roles di Spatie Permission dengan mematikan trait `WithoutModelEvents` pada `DatabaseSeeder.php` agar event `creating` untuk generator UUID v7 dapat berjalan.
- Menguji database migration dan seeding secara menyeluruh melalui `php artisan migrate:fresh --seed`.
- Memperbarui file rencana implementasi (`implementation-plan.md`) dan status progress (`progress.md`).

## Sesi 5 — 4 Juni 2026 (Lanjutan)
**Fokus:** Autentikasi Google OAuth, Middleware Keamanan, dan Interface Login/Dashboard.
- Mengintegrasikan package `laravel/socialite` dengan konfigurasi Google OAuth di `config/services.php` dan `.env`.
- Membuat `SocialiteController` untuk menangani alur redirect Google, callback, verifikasi domain email sekolah `@smkn1bawang.sch.id` (dapat ditoggle via `GOOGLE_OAUTH_RESTRICT_DOMAIN`), pencarian user terdaftar, penyesuaian avatar profil, dan regenerasi session.
- Membuat middleware `EnsureTahunAjaranAktif` yang melacak dan menyuntikkan tahun ajaran aktif secara global sebagai shared prop Inertia, serta middleware `EnsureEkskulAccess` untuk validasi penugasan admin ekskul di pivot table.
- Mendaftarkan middleware di `bootstrap/app.php` dengan alias (`ekskul.access`, `role`, `permission`, `role_or_permission`) dan menyisipkannya ke rute web yang sesuai di `routes/web.php`.
- Mengimplementasikan view Inertia React: `Auth/Login.tsx` (kartu login premium dengan flash error alerts) dan `Dashboard.tsx` (dashboard profil user terintegrasi).
- Menulis dokumen `instruction.md` berisi panduan manual integrasi Google Cloud Console Client ID/Secret ke lingkungan lokal.
- Membuat `AuthenticatedLayout.tsx` yang mencakup Sidebar responsif (mobile drawer & desktop menu), info akun pengguna, dan menu navigasi dinamis berbasis peran aktif.
- Membuat fitur ganti peran (*Context Switcher Role*) untuk menangani pengguna dengan peran ganda (*dual role*).
- Membuat kelas parser `SiswaImport` yang secara fleksibel membaca data NIS, nama, kelas, jurusan, gender, dan nomor HP dari spreadsheet serta mengotomatisasi generasi alamat email sekolah siswa (`nis@jurusan.smkn1bawang.sch.id`).
- Membuat `ImportSiswaJob` untuk memproses unggahan file secara asinkron di antrean *background queue* (`database` driver).
- Membuat `Admin\ImportController` untuk validasi unggahan berkas spreadsheet Excel, menyimpannya di folder aman sementara, serta memicu pekerjaan *queue job*.
- Mendaftarkan rute-rute admin kesiswaan untuk pengelolaan data impor siswa di `routes/web.php` dan mendesain antarmuka `Admin/Siswa/Import.tsx` lengkap dengan panduan kolom Excel.
- Memperbarui berkas rencana implementasi (`implementation-plan.md`) dengan status selesai pada item 2.3, 2.4, dan 2.5.

### Langkah Selanjutnya
1. **Fase 2 — Core Flow (P0) - Halaman Ekskul & Pendaftaran (3.1 & 3.2):** Pembuatan halaman beranda pendaftaran ekskul bagi siswa, menampilkan periode yang aktif, dan formulir pengunggahan sertifikat prestasi pendukung (maks. 2 MB) secara dinamis.
2. **Seleksi Administratif & Finalisasi (3.3):** Pembuatan dasbor seleksi administratif bagi pembina ekskul untuk menentukan status penerimaan (diterima/ditolak) serta mengunci keputusan final seleksi.

## Sesi 6 — 4 Juni 2026 (Lanjutan)
**Fokus:** Implementasi Fase 2 — Core Flow (Pendaftaran, Seleksi, Manajemen Anggota, Notifikasi, & Scheduler).
- **Halaman Ekskul & Pendaftaran (Siswa):**
  - Membuat `EkskulController` untuk memproyeksikan daftar ekstrakurikuler aktif di tahun ajaran ini dan profil detail (jadwal latihan, daftar pembina, media sosial).
  - Membuat `PendaftaranController` untuk pendaftaran CRUD, pengecekan keabsahan periode pendaftaran, kuota, pencegahan pendaftaran ganda, dan pembatalan pendaftaran.
  - Membuat `SertifikatController` untuk melampirkan berkas sertifikat pendukung (maks 2MB, PDF/JPG/PNG) dan penghapusan berkas sebelum seleksi final.
  - Membuat halaman Inertia React: `Ekskul/Index`, `Ekskul/Show`, `Pendaftaran/Index`, `Pendaftaran/Create`, dan `Pendaftaran/Show`.
- **Panel Admin Ekskul (Seleksi):**
  - Membuat `Manage\SeleksiController` untuk manajemen review siswa pendaftar.
  - Mendukung keputusan status biner (Terima/Tolak) secara instan baik individu maupun bulk-selection.
  - Mengimplementasikan fitur finalisasi seleksi (`finalize`) yang mengunci keputusan, memigrasikan pendaftar diterima menjadi data resmi ke tabel `anggota`, serta menyebarkan notifikasi kelulusan.
  - Membuat antarmuka admin `Manage/Seleksi/Index.tsx` yang kaya visual grafik/stat, edit kuota ekskul, pratinjau sertifikat, dan tombol bulk-actions.
- **Manajemen Anggota Ekskul Aktif:**
  - Membuat `Manage\AnggotaController` dan antarmuka `Manage/Anggota/Index.tsx`.
  - Mendukung penambahan anggota secara manual oleh pembina (sumber: manual) untuk siswa telat daftar.
  - Menyediakan fitur pemberhentian status anggota ("Dikeluarkan") dengan pencatatan penanggung jawab.
- **Notifikasi & Auto-Cleanup:**
  - Mengintegrasikan penulisan log `Notifikasi` in-app saat pendaftaran diajukan dan saat seleksi dirilis (finalisasi).
  - Menambahkan template generator pesan WhatsApp otomatis (`wa.me`) pada tabel seleksi admin.
  - Membuat Artisan command `sertifikat:cleanup` yang berjalan harian (`daily()` di `routes/console.php`) guna menghapus file sertifikat pendaftar yang seleksinya sudah final.
- **Bugs & Type-Safety Resolution:**
  - Menyelesaikan warning TypeScript *missing index signature* pada generic prop `AuthProps` di `Dashboard.tsx`.
  - Memperbaiki deklarasi variabel signature `$signature` pada Artisan command `CreateUser`.

### Langkah Selanjutnya
1. **Fase 3 — Operational (P0) - Modul Absensi (4.1):** Pembuatan pembukuan absensi latihan rutin (sesi, bulk status kehadiran Hadir/Izin/Sakit/Alfa, dan edit kehadiran).
2. **Modul Penilaian (4.2):** Formulir penginputan nilai akhir anggota per tahun ajaran (skala 0.00 - 100.00).
3. **Ekspor & Laporan (4.3):** Pembuatan laporan rekap anggota, rekap absensi, dan penilaian ke format PDF (DomPDF) & Excel (Laravel Excel).
4. **Audit Log Viewer (4.4):** Halaman log pelacak aktivitas sistem untuk administrator kesiswaan.

## Sesi 7 — 4 Juni 2026 (Lanjutan)
**Fokus:** Implementasi Fase 3 — Operational (Absensi, Penilaian, Laporan, & Audit Log).
- **Modul Absensi (Siswa):**
  - Membuat `Manage\AbsensiController` untuk mengelola sesi latihan dan bulk absensi.
  - Saat sesi latihan baru dibuat, secara otomatis menginisialisasi lembar presensi default ("Hadir") bagi seluruh anggota aktif ekskul tersebut.
  - Membuat halaman Inertia React: `Manage/Absensi/Index` (daftar sesi latihan, form pencatatan sesi baru, penghapusan sesi) dan `Manage/Absensi/Show` (bulk status presensi siswa: Hadir, Izin, Sakit, Alfa dengan menu *Setel Semua* presensi cepat).
- **Modul Penilaian (Siswa):**
  - Membuat `Manage\PenilaianController` untuk input nilai akhir tahun ajaran (skala 0 s/d 100).
  - Membuat halaman Inertia React: `Manage/Penilaian/Index` yang menampilkan daftar anggota aktif beserta input nilai desimal yang bisa di-upsert secara bulk.
- **Ekspor & Laporan (PDF & Excel):**
  - Membuat `Manage\LaporanController` yang menyajikan dasbor pengunduhan berkas laporan di `Manage/Laporan/Index`.
  - Mengembangkan 3 kelas Excel Export: `AnggotaExport`, `AbsensiExport`, dan `PenilaianExport` dengan fitur auto-size kolom dan mapping data rapi.
  - Membuat 3 template cetak PDF menggunakan DomPDF: `pdf.anggota`, `pdf.absensi`, dan `pdf.penilaian` yang kompatibel dengan format halaman sekolah resmi.
- **Audit Log Viewer (Kesiswaan):**
  - Membuat `Admin\AuditLogController` untuk melacak WHO, WHAT, WHEN seluruh aktivitas pengguna pada sistem.
  - Membuat halaman Inertia React: `Admin/AuditLog/Index` yang menyajikan tabel riwayat perubahan data (paginated) lengkap dengan panel penelaah data payload JSON sebelum/sesudah diubah.

### Langkah Selanjutnya
1. **Fase 4 — Enrichment (P1) - Pengumuman & Media Publik (5.1):** Pembuatan manajemen pengumuman internal ekskul dengan lampiran file, scheduler rilis, dokumentasi event publik, dan album foto publik (tanpa login).
2. **Jadwal & Kalender (5.2):** Integrasi jadwal rutin dan event ke kalender interaktif.
3. **Struktur Organisasi (5.3):** Visualisasi kepengurusan ekskul (Bagan Struktur Organisasi) yang di-generate dinamis dari data anggota.