# Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

Aplikasi web monolith premium untuk mengelola data dan operasional 27 ekstrakurikuler di SMKN 1 Bawang dalam satu platform terpadu.

---

## 🚀 Tech Stack

Aplikasi ini menggunakan perpaduan stack web modern untuk performa tinggi, kemudahan pemeliharaan, dan skalabilitas:

- **Backend:** Laravel 13 (PHP 8.5)
- **Frontend:** React 19 + TypeScript via Inertia.js v3
- **Styling:** Tailwind CSS v4.0 (CSS-first configuration)
- **Database:** MySQL 8.4 LTS / 9.x dengan primary key **UUID v7** (stored as `CHAR(36)`)
- **Library Utama:**
  - `laravel/socialite` — Autentikasi Google OAuth 2.0 (domain `@smkn1bawang.sch.id`)
  - `spatie/laravel-permission` (v7.4) — Role-Based Access Control (RBAC)
  - `spatie/laravel-activitylog` (v5.0) — Immutable audit log aktivitas kritis
  - `maatwebsite/laravel-excel` (v3.1) — Impor/ekspor data siswa massal via background queue
  - `barryvdh/laravel-dompdf` (v3.1) — Laporan unduhan PDF (absensi, nilai, sertifikat)

---

## ⚙️ Persyaratan Sistem

- PHP ≥ 8.5
- Composer ≥ 2.x
- Node.js ≥ 22.x (LTS) & npm
- MySQL ≥ 8.4 / 9.x
- Laragon atau environment local development serupa

---

## 🛠️ Langkah Instalasi

Ikuti instruksi berikut untuk menjalankan proyek di komputer lokal Anda:

### 1. Klon Repositori
```bash
git clone https://github.com/username/nama-repo.git
cd "Ekstrakurikuler Management System"
```

### 2. Instalasi Dependensi Backend
```bash
composer install
```

### 3. Konfigurasi Environment File
Salin `.env.example` ke `.env` dan buat database baru di MySQL dengan nama `db_ekskul_bawang`:
```bash
cp .env.example .env
php artisan key:generate
```
Sesuaikan konfigurasi database Anda di `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_ekskul_bawang
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Migrasi & Seeding Database
Jalankan migrasi seluruh tabel (27 tabel terstruktur) beserta seed data bawaan (role, tahun ajaran aktif, 27 ekskul default, dan akun pengelola dummy):
```bash
php artisan migrate:fresh --seed
```

### 5. Instalasi Dependensi Frontend
```bash
npm install
```

### 6. Jalankan Server Development
Jalankan server backend PHP dan build server Vite (Tailwind CSS v4 + React compilation) secara bersamaan:
```bash
npm run dev
```

Server Anda akan berjalan pada `http://127.0.0.1:8000`.

---

## 📦 Alur & Pola Arsitektur (3-Layer)

Untuk menjaga kode tetap bersih, modular, dan mudah diuji, kami mengadopsi pola **Controller → Service → Repository**:

1. **Controller (`app/Http/Controllers`)**: Menangani HTTP Request, navigasi Inertia, dan input validation.
2. **Service (`app/Services`)**: Menampung logika bisnis utama (business logic layer).
3. **Repository (`app/Repositories`)**: Bertanggung jawab atas interaksi data dan query ke database via Eloquent.

Seluruh model database menggunakan trait `HasUuidV7` untuk menjamin kunci utama non-sekuensial berbasis waktu yang terurut (UUID v7).

---

## 👥 Matriks Hak Akses (RBAC)

Aplikasi memiliki 5 role bawaan dengan batas akses berikut:
- **Kesiswaan:** Akses penuh seluruh kebijakan sekolah, alokasi pembina, review laporan gabungan.
- **Pembina:** Mengawasi operasional ekskul yang dibina, persetujuan admin ekskul, review akhir nilai.
- **Pengurus OSIS / Himpunan:** Pemasukan data master, administrasi pendaftaran umum, distribusi hak akses.
- **Admin Ekskul (Siswa Kelas 11):** Manajemen internal (jadwal, absensi, input nilai anggota, posting pengumuman).
- **Siswa (Kelas 10):** Pendaftaran ekskul, melihat pengumuman, melihat detail jadwal & kalender kegiatan.

---

## 📝 Panduan Perintah Tambahan

### Queue Worker (Wajib untuk Impor Excel & Laporan)
```bash
php artisan queue:work
```

### Pembersihan File Sertifikat (Scheduled Task)
```bash
php artisan sertifikat:cleanup
```

### Menjalankan Testing
```bash
php artisan test
npm run test
```

---

## 📄 Lisensi

Proyek ini dibuat khusus untuk keperluan internal SMKN 1 Bawang. Seluruh hak cipta dilindungi undang-undang.
