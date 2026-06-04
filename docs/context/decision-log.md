# Decision Log — Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang

> Catat keputusan yang sudah dibuat agar tidak diulang atau dipertanyakan kembali.

---

## DEC-001: Source of Truth
- **Tanggal:** 3 Juni 2026
- **Keputusan:** FAQ klien (`docs/planning/FAQ-dengan-client.md`) adalah SOT mutlak. Jika ada konflik dengan PRD atau SRS, FAQ yang berlaku.

## DEC-002: Arsitektur — Single School, Non Multi-Tenant
- **Tanggal:** 3 Juni 2026
- **Keputusan:** Sistem hanya untuk SMKN 1 Bawang. Tidak multi-tenant, tidak berpotensi digunakan sekolah lain.

## DEC-003: Tanpa Dark Mode
- **Tanggal:** 3 Juni 2026
- **Keputusan:** Tidak ada dark mode. Tidak dibutuhkan siswa.

## DEC-004: Seleksi Biner — Tanpa Waiting List
- **Tanggal:** 3 Juni 2026
- **Keputusan:** Status seleksi hanya Diterima/Ditolak. Tidak ada waiting list, status cadangan, nilai seleksi, atau alasan penolakan.

## DEC-005: WhatsApp via wa.me (Gratis)
- **Tanggal:** 3 Juni 2026
- **Keputusan:** Notifikasi WhatsApp menggunakan tautan wa.me (semi-otomatis, gratis), bukan API WhatsApp Business berbayar.

## DEC-006: Perubahan Akun & Jurusan Hanya Developer
- **Tanggal:** 3 Juni 2026
- **Keputusan:** Perubahan email Google dan data jurusan siswa hanya bisa dilakukan oleh developer langsung di database. Tidak ada UI untuk ini.

## DEC-007: Status Anggota — Hanya Aktif atau Dikeluarkan
- **Tanggal:** 3 Juni 2026
- **Keputusan:** Tidak ada status "nonaktif". Siswa tidak bisa resign mandiri. Hanya Admin Ekskul yang mengubah status.

## DEC-008: Audit Log — Immutable
- **Tanggal:** 3 Juni 2026
- **Keputusan:** Audit log tidak dapat dihapus oleh siapapun melalui UI/API. Auto-archive saat siswa menjadi alumni.

## DEC-009: Tech Stack — Laravel 13 + Inertia.js v3 + React 19 + Tailwind CSS v4 + MySQL 8.4 LTS / 9.x
- **Tanggal:** 4 Juni 2026
- **Keputusan:** Dipilih berdasarkan kemudahan pemeliharaan oleh sekolah (PHP/Laravel & MySQL sangat populer di kurikulum RPL SMK), efisiensi library ecosystem, dan kemudahan deployment lokal.
- **Detail versi:** PHP 8.5, Inertia.js v3 (tanpa Axios, requires React 19), Tailwind CSS v4.3 (CSS-first config), MySQL 8.4 LTS / 9.x.

## DEC-010: Arsitektur — Monolith Modular
- **Tanggal:** 4 Juni 2026
- **Keputusan:** Arsitektur monolith modular (bukan microservices). Satu server, satu database. Skala 2.000–5.000 siswa tidak memerlukan arsitektur terdistribusi.

## DEC-011: RBAC — Spatie Permission dengan Scope Per-Ekskul
- **Tanggal:** 4 Juni 2026
- **Keputusan:** Admin Ekskul memiliki permission yang di-scope ke ekskul tertentu via pivot table `admin_ekskul_assignments`. Dual role didukung.

## DEC-012: Import Excel — Queue-based (Async)
- **Tanggal:** 4 Juni 2026
- **Keputusan:** Import massal data siswa (hingga 5.000 record) diproses secara asinkron via Laravel Queue Worker menggunakan `maatwebsite/laravel-excel v3.1 + ShouldQueue`.

## DEC-013: Sertifikat — Temporary Storage dengan Auto-Cleanup
- **Tanggal:** 4 Juni 2026
- **Keputusan:** File sertifikat pendaftaran dihapus otomatis oleh scheduled command harian setelah seleksi dinyatakan final.

## DEC-014: Pail Logger Dinonaktifkan pada Dev Script Windows
- **Tanggal:** 4 Juni 2026
- **Keputusan:** Menghapus `php artisan pail` dari konfigurasi `composer dev` karena ketergantungan pada ekstensi `pcntl` yang tidak kompatibel dengan sistem operasi Windows. Log developer tetap dapat ditinjau via `storage/logs/laravel.log`.