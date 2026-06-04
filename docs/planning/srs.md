# Software Requirements Specification
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

Version 1.0  
Prepared by Tim Pengembang  
SMKN 1 Bawang  
4 Juni 2026

## Table of Contents
<!-- TOC -->
* [1. Introduction](#1-introduction)
    * [1.1 Document Purpose](#11-document-purpose)
    * [1.2 Product Scope](#12-product-scope)
    * [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    * [1.4 References](#14-references)
    * [1.5 Document Overview](#15-document-overview)
* [2. Product Overview](#2-product-overview)
    * [2.1 Product Perspective](#21-product-perspective)
    * [2.2 Product Functions](#22-product-functions)
    * [2.3 Product Constraints](#23-product-constraints)
    * [2.4 User Characteristics](#24-user-characteristics)
    * [2.5 Assumptions and Dependencies](#25-assumptions-and-dependencies)
    * [2.6 Apportioning of Requirements](#26-apportioning-of-requirements)
* [3. Requirements](#3-requirements)
    * [3.1 External Interfaces](#31-external-interfaces)
        * [3.1.1 User Interfaces](#311-user-interfaces)
        * [3.1.2 Hardware Interfaces](#312-hardware-interfaces)
        * [3.1.3 Software Interfaces](#313-software-interfaces)
    * [3.2 Functional Requirements](#32-functional-requirements)
        * [3.2.1 F01: Autentikasi dan Manajemen Akun](#321-f01-autentikasi-dan-manajemen-akun)
        * [3.2.2 F02: Manajemen Data Ekskul](#322-f02-manajemen-data-ekskul)
        * [3.2.3 F03: Pendaftaran Ekskul](#323-f03-pendaftaran-ekskul)
        * [3.2.4 F04: Seleksi](#324-f04-seleksi)
        * [3.2.5 F05: Manajemen Anggota Ekskul](#325-f05-manajemen-anggota-ekskul)
        * [3.2.6 F06: Absensi](#326-f06-absensi)
        * [3.2.7 F07: Penilaian](#327-f07-penilaian)
        * [3.2.8 F08: Pengumuman dan Event](#328-f08-pengumuman-dan-event)
        * [3.2.9 F09: Jadwal dan Kalender](#329-f09-jadwal-dan-kalender)
        * [3.2.10 F10: Tahun Ajaran](#3210-f10-tahun-ajaran)
        * [3.2.11 F11: Laporan dan Audit](#3211-f11-laporan-dan-audit)
        * [3.2.12 F12: Notifikasi](#3212-f12-notifikasi)
    * [3.3 Quality of Service](#33-quality-of-service)
        * [3.3.1 Performance](#331-performance)
        * [3.3.2 Security](#332-security)
        * [3.3.3 Reliability](#333-reliability)
        * [3.3.4 Availability](#334-availability)
        * [3.3.5 Observability](#335-observability)
    * [3.4 Compliance](#34-compliance)
    * [3.5 Design and Implementation](#35-design-and-implementation)
        * [3.5.1 Installation](#351-installation)
        * [3.5.2 Build and Delivery](#352-build-and-delivery)
        * [3.5.3 Distribution](#353-distribution)
        * [3.5.4 Maintainability](#354-maintainability)
        * [3.5.7 Cost](#357-cost)
        * [3.5.8 Deadline](#358-deadline)
        * [3.5.10 Change Management](#3510-change-management)
* [4. Verification](#4-verification)
* [5. Appendixes](#5-appendixes)
<!-- TOC -->

## Revision History

| Name | Date | Reason For Changes | Version |
|------|------|--------------------|---------|
| Tim Pengembang | 3 Juni 2026 | Draf Awal berdasarkan FAQ | 0.1 |
| Tim Pengembang | 4 Juni 2026 | Spesifikasi Lengkap & Konsistensi FAQ/PRD/Design | 1.0 |

---

## 1. Introduction

Dokumen ini merupakan Software Requirements Specification (SRS) untuk Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang, sebuah platform web terpadu yang mendigitalisasi seluruh siklus pengelolaan kegiatan ekstrakurikuler sekolah. SRS ini mendefinisikan apa yang harus dilakukan sistem, bukan bagaimana sistem diimplementasikan, dan berfungsi sebagai acuan tunggal bagi seluruh pemangku kepentingan teknis maupun non-teknis.

### 1.1 Document Purpose

SRS ini mendeskripsikan persyaratan fungsional dan non-fungsional sistem secara verifikatif untuk mendukung perancangan, pengembangan, pengujian, dan penerimaan sistem. Dokumen ini ditujukan untuk tim pengembang (desain dan implementasi), tim QA (penyusunan test case), manajemen sekolah (validasi ruang lingkup), serta Admin Ekskul dan Kesiswaan (verifikasi kesesuaian kebutuhan operasional). Source of truth utama dokumen ini adalah FAQ klien yang telah disepakati; jika terdapat konflik antara SRS ini dengan FAQ, maka FAQ yang berlaku.

### 1.2 Product Scope

**Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang v1.0** adalah aplikasi web berbasis Google OAuth yang mengelola 27 ekstrakurikuler dalam satu sekolah. Sistem ini mencakup pendaftaran dan seleksi anggota, pengelolaan operasional ekskul, absensi, penilaian, notifikasi, pelaporan, dan arsip tahun ajaran. Sistem dirancang untuk mendukung 2.000–5.000 siswa dan berjalan secara responsif di perangkat mobile, tablet, dan desktop. Sistem ini **tidak** dirancang untuk multi-sekolah dan tidak berpotensi digunakan sekolah lain. Fitur di luar lingkup yang disebutkan di atas — seperti dark mode, waiting list, dan verifikasi berkas formal — secara eksplisit dikecualikan sesuai kesepakatan dengan klien.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| Admin Ekskul | Siswa kelas 11 yang ditunjuk untuk mengelola operasional satu atau lebih ekskul tertentu |
| API | Application Programming Interface — sekumpulan definisi dan protokol untuk membangun dan mengintegrasikan perangkat lunak |
| Ekskul | Ekstrakurikuler — kegiatan di luar jam pelajaran formal yang diikuti siswa |
| FAQ | Frequently Asked Questions — dokumen tanya jawab dengan klien yang menjadi source of truth mutlak |
| Kesiswaan | Staf bagian kesiswaan sekolah yang mengelola kebijakan tingkat sekolah |
| NIS | Nomor Induk Siswa — identifikasi unik dan permanen setiap siswa |
| OSIS | Organisasi Siswa Intra Sekolah |
| Pembina | Guru yang membina satu atau lebih ekskul |
| Pengurus Himpunan + OSIS | Siswa kelas 11 yang mengelola data ekskul lintas organisasi |
| PRD | Product Requirements Document — dokumen persyaratan produk yang menjadi acuan pengembangan |
| RBAC | Role-Based Access Control — sistem kontrol akses berbasis peran pengguna |
| SRS | Software Requirements Specification — dokumen ini |
| Tahun Ajaran | Entitas utama sistem yang membatasi periode operasional data |
| UI | User Interface — antarmuka visual aplikasi yang digunakan pengguna |
| WCAG | Web Content Accessibility Guidelines — standar aksesibilitas konten web |

### 1.4 References

| Title | Owner | Version | Date | Type |
|-------|-------|---------|------|------|
| FAQ Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang | Tim Klien SMKN 1 Bawang | 1.0 | 2026 | Normative |
| Product Requirements Document (PRD) — Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang | Tim Pengembang | 1.0 | 3 Juni 2026 | Normative |
| WCAG 2.1 | W3C | 2.1 | 2018 | Normative |
| Google OAuth 2.0 Documentation | Google | — | Current | Informative |

### 1.5 Document Overview

Bagian 2 menyediakan konteks dan latar belakang produk termasuk perspektif sistem, fungsi utama, batasan, dan karakteristik pengguna. Bagian 3 mendefinisikan seluruh persyaratan yang dapat diverifikasi, mencakup antarmuka eksternal, fungsional, kualitas layanan, kepatuhan, serta desain dan implementasi. Bagian 4 mendeskripsikan metode verifikasi untuk setiap persyaratan. Bagian 5 berisi lampiran pendukung. Dokumen ini menggunakan kata kunci **shall** untuk persyaratan wajib, **should** untuk rekomendasi, dan **may** untuk opsi. Revisi dicatat pada tabel Revision History di atas.

---

## 2. Product Overview

### 2.1 Product Perspective

Sistem ini merupakan produk baru yang dibangun dari awal untuk menggantikan proses manual pengelolaan ekskul di SMKN 1 Bawang. Sistem berdiri sendiri (tidak terintegrasi ke sistem informasi sekolah yang sudah ada), hanya digunakan oleh satu sekolah, dan tidak memiliki dependensi ke sistem eksternal selain Google OAuth untuk autentikasi dan layanan WhatsApp (wa.me) untuk notifikasi semi-otomatis. Kepemilikan sistem berada di bawah pengelolaan sekolah, dengan developer sebagai pihak yang bertanggung jawab atas perubahan teknis level rendah (misalnya perubahan akun email dan jurusan siswa).

### 2.2 Product Functions

Fungsi utama sistem meliputi:
- **Autentikasi berbasis Google OAuth** dengan pembatasan domain sekolah dan kontrol akses berbasis peran (RBAC)
- **Manajemen data ekskul** mencakup profil, kategori, struktur organisasi, galeri, dan pengumuman internal
- **Pendaftaran dan seleksi anggota** dengan dukungan upload sertifikat dan notifikasi hasil via dashboard dan WhatsApp
- **Pengelolaan anggota ekskul** termasuk status keanggotaan, periode, dan riwayat
- **Absensi ekskul** yang dapat dikonfigurasi dengan empat status kehadiran
- **Penilaian anggota** dengan input manual dan dukungan bulk input
- **Jadwal dan kalender terpadu** dengan deteksi bentrok jadwal
- **Event dan galeri kegiatan** sebagai media informasi publik
- **Laporan dan audit log** dalam format PDF dan Excel
- **Manajemen tahun ajaran** dengan arsip data antar periode

### 2.3 Product Constraints

- Sistem **harus** dibangun sebagai aplikasi web yang responsif (mobile, tablet, desktop) — tidak sebagai aplikasi native.
- Sistem **harus** menggunakan Google OAuth 2.0 dengan pembatasan domain email sekolah sebagai satu-satunya metode autentikasi.
- Sistem **harus** mendukung 2.000–5.000 siswa aktif.
- Sistem **harus** mendukung tepat satu sekolah — arsitektur multi-tenant tidak diperlukan dan tidak boleh diimplementasikan.
- Format file upload **harus** dibatasi pada PDF, JPG, JPEG, dan PNG dengan ukuran maksimal 2 MB per file.
- Sistem **tidak boleh** menyediakan fitur dark mode.
- Notifikasi WhatsApp **harus** bersifat semi-otomatis menggunakan tautan wa.me (bukan API WhatsApp Business berbayar).
- Laporan **harus** dapat diekspor dalam format PDF dan Excel.
- Perubahan akun Google dan data jurusan siswa **hanya** dapat dilakukan oleh developer (bukan melalui UI sistem).

### 2.4 User Characteristics

| Persona | Kelas/Status | Frekuensi Penggunaan | Kebutuhan Kritis |
|---------|--------------|----------------------|------------------|
| **Siswa (Peserta)** | Kelas 10 | Tinggi saat periode pendaftaran, sedang setelahnya | Antarmuka mobile-friendly, dashboard personal |
| **Admin Ekskul** | Kelas 11 | Tinggi sepanjang tahun ajaran | Manajemen pendaftar, seleksi, absensi, penilaian per ekskul |
| **Pengurus Himpunan + OSIS** | Kelas 11 | Sedang | Pengelolaan data lintas ekskul, manajemen admin |
| **Pembina** | Guru | Sedang | Supervisi ekskul, input penilaian, ekspor laporan |
| **Kesiswaan** | Staf sekolah | Rendah hingga sedang | Laporan tingkat sekolah, manajemen kebijakan, audit log |
| **Alumni** | Lulus | Sangat rendah | Akses baca-saja untuk album foto kegiatan |

Semua pengguna menggunakan akun Google domain sekolah. Tidak ada persyaratan aksesibilitas khusus yang didefinisikan selain WCAG 2.1 Level AA sebagai target minimum.

### 2.5 Assumptions and Dependencies

| # | Asumsi / Dependensi | Tipe | Dampak Jika Salah |
|---|---------------------|------|-------------------|
| A1 | Seluruh siswa, guru, dan staf memiliki akun Google aktif dengan domain sekolah | Asumsi | Sistem autentikasi tidak dapat digunakan |
| A2 | Infrastruktur server mampu menangani beban 2.000–5.000 pengguna bersamaan | Asumsi | Degradasi performa atau downtime |
| A3 | Koneksi internet tersedia di lingkungan sekolah secara memadai | Asumsi | Akses sistem terganggu |
| A4 | Layanan Google OAuth tetap tersedia untuk penggunaan sekolah | Dependensi | Sistem autentikasi gagal total |
| A5 | Layanan wa.me tetap mendukung link langsung untuk notifikasi semi-otomatis | Dependensi | Fitur notifikasi WhatsApp tidak berfungsi |
| A6 | Data siswa tersedia dalam format Excel atau PDF untuk diimpor | Asumsi | Proses onboarding data awal terhambat |
| A7 | Jumlah ekskul adalah 27 dan tidak berubah secara signifikan dalam tahun ajaran pertama | Asumsi | Konfigurasi awal perlu disesuaikan |

### 2.6 Apportioning of Requirements

| Fase | Fitur Utama | Area Requirement | Prioritas |
|------|-------------|------------------|-----------|
| Fase 1 — Foundation | Autentikasi Google, Import Data Siswa, Manajemen Ekskul, Tahun Ajaran | REQ-FUNC, REQ-SEC, REQ-INT | P0 |
| Fase 2 — Core Flow | Pendaftaran, Upload Sertifikat, Seleksi, Notifikasi, Manajemen Anggota | REQ-FUNC | P0 |
| Fase 3 — Operational | Absensi, Penilaian, Laporan, Audit Log | REQ-FUNC, REQ-COMP | P0 |
| Fase 4 — Enrichment | Pengumuman, Event, Galeri, Jadwal, Kalender, Pencarian Global, Dashboard Personal | REQ-FUNC | P1 |
| Fase 5 — Enhancement | Ranking Ekskul Terfavorit | REQ-FUNC | P2 |

---

## 3. Requirements

### 3.1 External Interfaces

#### 3.1.1 User Interfaces

- ID: REQ-INT-001
- Title: Responsivitas Antarmuka
- Statement: Sistem shall menampilkan antarmuka yang responsif dan dapat digunakan secara penuh pada perangkat mobile (lebar layar ≥ 320px), tablet (lebar layar ≥ 768px), dan desktop (lebar layar ≥ 1024px).
- Rationale: Mayoritas siswa mengakses sistem menggunakan perangkat smartphone mereka.
- Acceptance Criteria: Seluruh halaman utama dapat digunakan tanpa scroll horizontal pada viewport 320px, 768px, dan 1280px.
- Verification Method: Test

---

- ID: REQ-INT-002
- Title: Aksesibilitas WCAG 2.1 AA
- Statement: Sistem shall memenuhi WCAG 2.1 Level AA, termasuk rasio kontras minimum 4.5:1 untuk body text dan 3:1 untuk large text.
- Rationale: Memastikan aksesibilitas bagi seluruh pengguna sekolah.
- Acceptance Criteria: Audit aksesibilitas otomatis (axe/Lighthouse) dan manual tidak menemukan pelanggaran Level AA.
- Verification Method: Test + Analysis

---

- ID: REQ-INT-003
- Title: Pencarian Global
- Statement: Sistem shall menyediakan bar pencarian global yang dapat diakses oleh pengguna dari seluruh halaman untuk mencari ekskul, anggota, dan pengumuman.
- Rationale: Memudahkan navigasi cepat di dalam sistem.
- Acceptance Criteria: Hasil pencarian menampilkan data yang relevan dalam waktu < 2 detik.
- Verification Method: Test

---

- ID: REQ-INT-004
- Title: Dashboard Personalisasi Siswa
- Statement: Sistem shall menampilkan dashboard yang disesuaikan secara personal untuk siswa, memuat status pendaftaran dan ekskul yang diikuti.
- Rationale: Meningkatkan kegunaan dan personalisasi antarmuka pengguna.
- Acceptance Criteria: Dashboard siswa menampilkan widget status pendaftaran, jadwal ekskul yang diikuti, dan pengumuman relevan.
- Verification Method: Test

#### 3.1.2 Hardware Interfaces

Sistem tidak berinteraksi langsung dengan perangkat keras khusus. Sistem harus dapat berjalan pada browser modern dengan koneksi internet standar.

#### 3.1.3 Software Interfaces

- ID: REQ-INT-010
- Title: Integrasi Google OAuth 2.0
- Statement: Sistem shall mengintegrasikan Google OAuth 2.0 untuk proses login dengan batasan hanya email domain sekolah.
- Rationale: Autentikasi terpusat dan aman menggunakan akun sekolah.
- Acceptance Criteria: Login dengan email domain sekolah berhasil; login dengan email lain (seperti @gmail.com) ditolak.
- Verification Method: Test

---

- ID: REQ-INT-011
- Title: Integrasi Notifikasi WhatsApp via wa.me
- Statement: Sistem shall mengintegrasikan tautan wa.me untuk menghasilkan pesan notifikasi otomatis (pendaftaran, jadwal, seleksi) yang siap dikirim secara manual atau massal oleh admin.
- Rationale: Menggunakan layanan WhatsApp gratis untuk notifikasi semi-otomatis sesuai kendala biaya.
- Acceptance Criteria: Sistem menghasilkan url wa.me dengan teks pesan yang terisi otomatis berdasarkan template dan data dinamis siswa.
- Verification Method: Test + Demonstration

---

- ID: REQ-INT-012
- Title: Impor Data Massal Excel dan PDF
- Statement: Sistem shall menyediakan antarmuka untuk mengimpor data siswa massal via file Excel (.xlsx) dan PDF.
- Rationale: Efisiensi onboarding data siswa pada awal tahun ajaran.
- Acceptance Criteria: Unggahan file format .xlsx dan .pdf berhasil menginput data siswa baru ke database dalam satu kali aksi.
- Verification Method: Test

---

- ID: REQ-INT-013
- Title: Ekspor Laporan PDF dan Excel
- Statement: Sistem shall menyediakan fitur unduh laporan dalam format PDF dan Excel (.xlsx) untuk data absensi, penilaian, dan anggota.
- Rationale: Kebutuhan cetak dokumen administratif untuk pembina ekskul dan kesiswaan.
- Acceptance Criteria: Seluruh laporan yang dihasilkan dapat diunduh dalam format .pdf dan .xlsx secara rapi dan akurat.
- Verification Method: Test

### 3.2 Functional Requirements

#### 3.2.1 F01: Autentikasi dan Manajemen Akun

- ID: REQ-FUNC-001
- Title: Login Akun Google Sekolah
- Statement: Sistem shall mengizinkan login pengguna hanya melalui akun Google sekolah dengan domain email resmi yang telah dikonfigurasi.
- Rationale: Membatasi hak akses sistem hanya untuk warga SMKN 1 Bawang.
- Acceptance Criteria: Login berhasil jika domain email cocok dengan konfigurasi domain sekolah. Pengguna di luar domain ditolak.
- Verification Method: Test

---

- ID: REQ-FUNC-002
- Title: Role-Based Access Control (RBAC)
- Statement: Sistem shall menerapkan pembatasan hak akses berbasis peran (Siswa, Admin Ekskul, Pengurus Himpunan + OSIS, Pembina, Kesiswaan) pada level server.
- Rationale: Melindungi data sensitif dan membatasi operasional ekskul hanya pada admin yang berwenang.
- Acceptance Criteria: Admin Ekskul hanya dapat mengelola ekskulnya sendiri. Siswa tidak dapat mengakses halaman manajemen admin.
- Verification Method: Test

---

- ID: REQ-FUNC-003
- Title: Dukungan Peran Ganda (Dual Role)
- Statement: Sistem shall mendukung satu pengguna memiliki peran ganda (misal: siswa kelas 11 sebagai anggota aktif di ekskul PMR sekaligus Admin Ekskul di ekskul Basket).
- Rationale: Akomodasi struktur kepengurusan riil di sekolah.
- Acceptance Criteria: Pengguna dengan peran ganda dapat berpindah konteks halaman atau mengakses menu admin ekskul tertentu tanpa mengganggu status anggotanya di ekskul lain.
- Verification Method: Test

---

- ID: REQ-FUNC-004
- Title: Perubahan Akun Google Hanya oleh Developer
- Statement: Sistem shall membatasi perubahan data email sekolah/Google OAuth pengguna hanya dapat dilakukan oleh developer secara manual.
- Rationale: Mencegah manipulasi identitas pengguna secara tidak sah di dalam sistem.
- Acceptance Criteria: Tidak ada fitur perubahan email di UI pengguna manapun. Perubahan hanya dilakukan langsung pada database atau file konfigurasi.
- Verification Method: Inspection

#### 3.2.2 F02: Manajemen Data Ekskul

- ID: REQ-FUNC-010
- Title: Pengelolaan Profil Ekskul
- Statement: Sistem shall menyimpan dan menampilkan data profil ekskul mencakup nama, kategori, logo/foto, deskripsi, media sosial, dan warna/branding ekskul.
- Rationale: Menyediakan informasi profil publik 27 ekskul.
- Acceptance Criteria: Profil ekskul dapat diperbarui oleh Admin Ekskul terkait. Pilihan branding warna ekskul dapat dikonfigurasi secara manual.
- Verification Method: Test

---

- ID: REQ-FUNC-011
- Title: Konfigurasi Struktur Organisasi Ekskul
- Statement: Sistem shall menyediakan fitur bagi Admin Ekskul untuk menyusun struktur organisasi internal ekskul secara fleksibel.
- Rationale: Struktur jabatan panitia/pengurus berbeda-beda pada setiap ekskul.
- Acceptance Criteria: Admin Ekskul dapat mendefinisikan jabatan baru dan menugaskan anggota aktif ke dalam struktur organisasi tersebut.
- Verification Method: Test

---

- ID: REQ-FUNC-012
- Title: Galeri dan Album Foto Kegiatan
- Statement: Sistem shall menyediakan fitur pembuatan album foto galeri kegiatan ekskul yang bersifat publik dan dapat diakses tanpa login (termasuk oleh alumni).
- Rationale: Mempublikasikan dokumentasi kegiatan ekskul kepada masyarakat dan alumni.
- Acceptance Criteria: Pengunjung tanpa autentikasi dapat melihat galeri kegiatan dan mengunduh foto kegiatan ekskul.
- Verification Method: Test

#### 3.2.3 F03: Pendaftaran Ekskul

- ID: REQ-FUNC-020
- Title: Pembukaan Periode Pendaftaran
- Statement: Sistem shall mendukung pembukaan periode pendaftaran tepat satu kali dalam satu tahun ajaran.
- Rationale: Pendaftaran ekskul di SMKN 1 Bawang dikonsolidasikan dalam satu periode terpusat.
- Acceptance Criteria: Form pendaftaran bagi siswa hanya aktif dan dapat disubmit selama periode pendaftaran yang ditentukan oleh admin aktif.
- Verification Method: Test

---

- ID: REQ-FUNC-021
- Title: Tidak Ada Batas Pilihan Pendaftaran
- Statement: Sistem shall mengizinkan siswa mendaftar ke sebanyak mungkin ekskul tanpa batas maksimal.
- Rationale: Membebaskan siswa mendaftar karena proses seleksi akan dilakukan oleh masing-masing ekskul.
- Acceptance Criteria: Siswa dapat mengirimkan formulir pendaftaran ke lebih dari satu ekskul selama periode pendaftaran aktif.
- Verification Method: Test

---

- ID: REQ-FUNC-022
- Title: Pendaftaran Bersifat Opsional
- Statement: Sistem shall tidak mewajibkan siswa untuk memilih ekskul.
- Rationale: Keikutsertaan ekskul tidak diwajibkan bagi seluruh siswa.
- Acceptance Criteria: Siswa yang memilih untuk tidak mendaftar ke ekskul manapun tidak mendapatkan peringatan error dan tetap dapat masuk ke sistem.
- Verification Method: Test

---

- ID: REQ-FUNC-023
- Title: Upload Lampiran Sertifikat
- Statement: Sistem shall mendukung unggahan satu atau beberapa file sertifikat pendukung (format PDF, JPG, JPEG, PNG; maksimal 2 MB per file) pada saat pendaftaran. Sertifikat dapat diganti oleh siswa selama proses seleksi belum final.
- Rationale: Sertifikat digunakan sebagai bahan pertimbangan seleksi.
- Acceptance Criteria: Sistem menolak file berukuran > 2 MB atau format selain yang ditentukan. File dapat diganti sebelum seleksi final.
- Verification Method: Test

---

- ID: REQ-FUNC-024
- Title: Penggantian Pilihan Pendaftaran
- Statement: Sistem shall mengizinkan siswa mengubah atau mengganti pilihan ekskul mereka setelah mendaftar selama proses seleksi belum dinyatakan final.
- Rationale: Siswa diberikan kelonggaran mengubah pilihan sebelum seleksi dikunci.
- Acceptance Criteria: Fitur "Ubah Pilihan" aktif pada dashboard siswa untuk pendaftaran yang berstatus "Dalam Review".
- Verification Method: Test

---

- ID: REQ-FUNC-025
- Title: Penambahan Anggota Manual
- Statement: Sistem shall menyediakan fitur penambahan anggota ekskul secara manual oleh Admin Ekskul atau Pengurus Himpunan + OSIS untuk mengakomodasi siswa yang terlambat mendaftar.
- Rationale: Penanganan kasus khusus keterlambatan pendaftaran di luar sistem normal.
- Acceptance Criteria: Admin Ekskul dapat memasukkan NIS siswa langsung ke daftar anggota ekskul tanpa melalui form pendaftaran.
- Verification Method: Test

#### 3.2.4 F04: Seleksi

- ID: REQ-FUNC-030
- Title: Hasil Seleksi Biner (Diterima/Ditolak)
- Statement: Sistem shall membatasi status hasil seleksi hanya menjadi "Diterima" atau "Ditolak", tanpa adanya nilai seleksi, waiting list, atau pencatatan alasan penolakan.
- Rationale: Sederhana dan langsung sesuai kebutuhan klien.
- Acceptance Criteria: Input seleksi berupa tombol/pilihan biner Diterima/Ditolak. Tidak ada field komentar alasan penolakan atau status cadangan.
- Verification Method: Inspection + Test

---

- ID: REQ-FUNC-031
- Title: Kuota Anggota Pasca Seleksi
- Statement: Sistem shall menerapkan kuota jumlah siswa yang diterima, yang dikonfigurasi oleh Admin Ekskul saat/setelah proses seleksi (bukan kuota pendaftaran).
- Rationale: Kuota membatasi jumlah anggota ekskul aktif, bukan jumlah pendaftar.
- Acceptance Criteria: Jumlah pendaftar dengan status "Diterima" tidak boleh melebihi kuota pasca seleksi yang ditentukan oleh Admin Ekskul.
- Verification Method: Test

---

- ID: REQ-FUNC-032
- Title: Penerimaan Ganda Anggota
- Statement: Sistem shall mendukung satu siswa diterima dan menjadi anggota aktif di beberapa ekskul sekaligus.
- Rationale: Tidak ada larangan mengikuti lebih dari satu kegiatan ekskul.
- Acceptance Criteria: Status siswa yang diterima di ekskul A dan ekskul B tercatat sebagai "Aktif" di kedua ekskul tersebut.
- Verification Method: Test

---

- ID: REQ-FUNC-033
- Title: Pengumuman Hasil Seleksi
- Statement: Sistem shall menampilkan hasil seleksi di dashboard siswa dan mengenerate tautan WhatsApp wa.me untuk notifikasi hasil seleksi.
- Rationale: Distribusi informasi hasil seleksi secara transparan dan cepat.
- Acceptance Criteria: Ketika status seleksi diubah menjadi diterima/ditolak, info terbaru langsung muncul di dashboard siswa.
- Verification Method: Test + Demonstration

#### 3.2.5 F05: Manajemen Anggota Ekskul

- ID: REQ-FUNC-040
- Title: Status Anggota Aktif atau Dikeluarkan
- Statement: Sistem shall hanya mengenal status anggota "Aktif" atau "Dikeluarkan". Tidak ada status "nonaktif" dan siswa tidak dapat mengundurkan diri secara mandiri dari sistem.
- Rationale: Kendali keanggotaan sepenuhnya dipegang oleh Admin Ekskul.
- Acceptance Criteria: Siswa tidak memiliki tombol "Keluar Ekskul" di UI. Hanya Admin Ekskul yang dapat menonaktifkan dengan mengubah status menjadi "Dikeluarkan".
- Verification Method: Inspection + Test

---

- ID: REQ-FUNC-041
- Title: Retensi Data Anggota Lama
- Statement: Sistem shall mempertahankan record data anggota lama (termasuk yang dikeluarkan atau telah lulus) untuk kebutuhan laporan absensi dan nilai historis.
- Rationale: Keperluan audit dan pelaporan historis kesiswaan.
- Acceptance Criteria: Data siswa yang berstatus dikeluarkan tetap muncul di pencarian laporan historis tahun ajaran terkait.
- Verification Method: Test

---

- ID: REQ-FUNC-042
- Title: Penggantian Admin Ekskul di Tengah Tahun
- Statement: Sistem shall memungkinkan Pengurus Himpunan + OSIS mengganti Admin Ekskul di tengah tahun ajaran.
- Rationale: Suksesi kepengurusan darurat atau pergantian di tengah tahun.
- Acceptance Criteria: Pengurus Himpunan + OSIS dapat mencabut hak akses Admin Ekskul siswa A dan memberikannya kepada siswa B.
- Verification Method: Test

#### 3.2.6 F06: Absensi

- ID: REQ-FUNC-050
- Title: Pengelolaan Absensi Ekskul
- Statement: Sistem shall menyediakan modul absensi dengan status: Hadir, Izin, Sakit, dan Alfa, yang dapat dikonfigurasi per sesi latihan oleh Admin Ekskul.
- Rationale: Pencatatan kehadiran anggota ekskul secara rutin.
- Acceptance Criteria: Admin Ekskul dapat membuat sesi absensi baru berdasarkan tanggal dan mencatat status kehadiran setiap anggota.
- Verification Method: Test

#### 3.2.7 F07: Penilaian

- ID: REQ-FUNC-060
- Title: Input Penilaian Akhir Massal
- Statement: Sistem shall mendukung penginputan satu nilai akhir per siswa oleh Admin Ekskul atau Pembina/Kesiswaan, baik secara individu maupun bulk input (massal).
- Rationale: Penilaian akhir ekskul diinput ke sistem untuk diserahkan ke kesiswaan.
- Acceptance Criteria: (1) Tersedia halaman bulk input nilai berupa tabel. (2) Nilai tersimpan dengan sukses dan dapat diekspor.
- Verification Method: Test

#### 3.2.8 F08: Pengumuman dan Event

- ID: REQ-FUNC-070
- Title: Pengumuman Internal Ekskul
- Statement: Sistem shall memungkinkan Admin Ekskul menerbitkan pengumuman internal ekskul yang mendukung lampiran file dan dapat dijadwalkan tanggal rilisnya.
- Rationale: Penyebaran informasi internal anggota ekskul.
- Acceptance Criteria: Pengumuman terjadwal hanya akan tampil di dashboard anggota ekskul setelah waktu penjadwalan tercapai.
- Verification Method: Test

---

- ID: REQ-FUNC-071
- Title: Event Informasi Ekskul
- Statement: Sistem shall mendukung pembuatan event ekskul yang berfungsi murni sebagai media informasi (berisi deskripsi, tautan WhatsApp EO, dan dokumentasi foto/kegiatan), tanpa adanya fitur pendaftaran peserta event.
- Rationale: Event dibuat untuk menginformasikan kegiatan publik, bukan mengelola pendaftar event.
- Acceptance Criteria: Di halaman detail event tidak terdapat formulir atau tombol daftar sebagai peserta. Hanya ada tautan kontak WhatsApp.
- Verification Method: Inspection

#### 3.2.9 F09: Jadwal dan Kalender

- ID: REQ-FUNC-080
- Title: Deteksi Bentrok Jadwal Siswa
- Statement: Sistem shall mengizinkan pembuatan jadwal latihan ekskul yang bentrok, namun shall mendeteksi dan menampilkan indikator bentrok jadwal tersebut pada dashboard siswa dan dashboard admin.
- Rationale: Mengingat siswa boleh mengikuti banyak ekskul, deteksi bentrok membantu koordinasi kehadiran.
- Acceptance Criteria: Jika siswa terdaftar di ekskul A (latihan Senin 14:00) dan ekskul B (latihan Senin 14:00), sistem menampilkan status bentrok visual pada kalender/dashboard.
- Verification Method: Test

---

- ID: REQ-FUNC-081
- Title: Kalender Kegiatan Terpadu
- Statement: Sistem shall menyediakan kalender terpadu yang menggabungkan seluruh jadwal latihan dan event dari 27 ekskul.
- Rationale: Memudahkan Kesiswaan dan OSIS memantau seluruh kegiatan ekskul sekolah.
- Acceptance Criteria: Kalender menampilkan event dari seluruh ekskul dengan kode warna atau filter pencarian ekskul.
- Verification Method: Test + Demonstration

#### 3.2.10 F10: Tahun Ajaran

- ID: REQ-FUNC-090
- Title: Entitas Utama Tahun Ajaran dan Pengarsipan
- Statement: Sistem shall menjadikan Tahun Ajaran sebagai filter data utama. Data tahun sebelumnya shall dapat diarsipkan (read-only) untuk memulai tahun ajaran baru.
- Rationale: Menjaga pemisahan data operasional kepengurusan ekskul yang berganti tiap tahun.
- Acceptance Criteria: (1) Admin dapat mengarsipkan tahun ajaran aktif. (2) Setelah diarsipkan, data anggota, nilai, dan absensi di tahun ajaran tersebut tidak dapat diedit kembali.
- Verification Method: Test

#### 3.2.11 F11: Laporan dan Audit

- ID: REQ-FUNC-100
- Title: Download Laporan Format PDF/Excel
- Statement: Sistem shall menyediakan fitur unduh laporan rekap absensi, penilaian, dan daftar anggota dalam bentuk PDF dan Excel.
- Rationale: Memudahkan pelaporan ke Kesiswaan dan Pembina.
- Acceptance Criteria: File PDF dan Excel yang diunduh memuat data yang sesuai dengan filter ekskul dan tahun ajaran yang dipilih.
- Verification Method: Test

---

- ID: REQ-FUNC-101
- Title: Audit Log Aktivitas Siswa dan Admin
- Statement: Sistem shall mencatat log aktivitas CRUD pada entitas kritis (anggota, nilai, seleksi, jadwal) ke dalam log audit yang tidak bisa dihapus. Audit log otomatis diarsipkan ketika data siswa diubah statusnya menjadi alumni.
- Rationale: Keamanan data dan pelacakan riwayat aktivitas.
- Acceptance Criteria: (1) Log mencatat: WHO, WHAT, WHEN, dan IP Address. (2) Tidak ada opsi hapus log di UI. (3) Log otomatis diarsipkan bersama profil siswa saat lulus.
- Verification Method: Test + Inspection

#### 3.2.12 F12: Notifikasi

- ID: REQ-FUNC-110
- Title: Notifikasi Instan di Dashboard Siswa
- Statement: Sistem shall memicu notifikasi instan pada dashboard siswa ketika pendaftaran berhasil disubmit, jadwal seleksi berubah, atau hasil seleksi dirilis.
- Rationale: Memberikan pembaruan informasi secara real-time kepada siswa.
- Acceptance Criteria: Notifikasi muncul di panel notifikasi siswa segera setelah event pendaftaran/seleksi dipicu.
- Verification Method: Test

---

- ID: REQ-FUNC-111
- Title: Notifikasi Semi-Otomatis WhatsApp Massal
- Statement: Sistem shall memformulasikan pesan WhatsApp otomatis dan menyediakan tombol kirim massal menggunakan url API wa.me.
- Rationale: Mempercepat pengiriman pesan notifikasi massal tanpa biaya tambahan API berbayar.
- Acceptance Criteria: Admin dapat mengklik tombol "Kirim Notifikasi WA" yang akan membuka tab baru wa.me berisi pesan terformat ke nomor HP siswa tujuan.
- Verification Method: Test + Demonstration

---

### 3.3 Quality of Service

#### 3.3.1 Performance

- ID: REQ-PERF-001
- Title: Waktu Respon Halaman Utama
- Statement: Waktu pemuatan halaman utama (first contentful paint) sistem shall ≤ 3 detik pada kondisi jaringan internet 3G/4G standar.
- Rationale: Menjaga kenyamanan pengguna mobile.
- Acceptance Criteria: Pengujian performa Lighthouse menunjukkan skor FCP < 3 detik.
- Verification Method: Test + Analysis

---

- ID: REQ-PERF-002
- Title: Skalabilitas Jumlah Pengguna
- Statement: Sistem shall mampu menangani hingga 5.000 pengguna aktif dengan concurrent request hingga 500 requests per detik (RPS).
- Rationale: Mengantisipasi lonjakan trafik tinggi saat pengumuman seleksi atau hari pendaftaran ekskul.
- Acceptance Criteria: Hasil pengujian load test menunjukkan rata-rata latency ≤ 3 detik dan error rate ≤ 1% pada beban 500 RPS.
- Verification Method: Test

---

- ID: REQ-PERF-003
- Title: Penanganan Impor Massal Tanpa Timeout
- Statement: Proses impor file data siswa massal (Excel/PDF) berisi hingga 5.000 baris data shall diselesaikan dalam waktu kurang dari 3 menit tanpa memicu timeout koneksi.
- Rationale: Memperlancar migrasi data awal siswa.
- Acceptance Criteria: Proses impor massal selesai sepenuhnya dan memuat semua record ke database dalam batas waktu yang ditentukan.
- Verification Method: Test

#### 3.3.2 Security

- ID: REQ-SEC-001
- Title: Pembatasan Login Domain Email
- Statement: Autentikasi Google OAuth 2.0 shall memverifikasi domain email pengguna dan menolak login jika tidak menggunakan domain email sekolah.
- Rationale: Mencegah akses dari email personal/luar sekolah.
- Acceptance Criteria: Pengguna dengan email @gmail.com tidak dapat melewati proses autentikasi masuk.
- Verification Method: Test

---

- ID: REQ-SEC-002
- Title: Otorisasi API di Sisi Server
- Statement: Seluruh endpoint API internal shall memvalidasi token sesi dan hak akses (RBAC) di sisi server sebelum memproses data.
- Rationale: Mencegah manipulasi client-side bypass atau privilege escalation.
- Acceptance Criteria: Request HTTP POST/PUT/DELETE ke endpoint administratif tanpa token otorisasi yang valid menghasilkan status kode HTTP 401 atau 403.
- Verification Method: Test

---

- ID: REQ-SEC-003
- Title: Keamanan Audit Log
- Statement: Audit log sistem shall bersifat read-only dan tidak dapat dimodifikasi atau dihapus melalui antarmuka admin manapun.
- Rationale: Menjamin keaslian data log untuk kebutuhan audit.
- Acceptance Criteria: Tidak ada fungsi penghapusan atau penyuntingan data pada tabel audit log di aplikasi.
- Verification Method: Inspection

#### 3.3.3 Reliability

- ID: REQ-REL-001
- Title: Penanganan Kegagalan Unggahan File
- Statement: Sistem shall melakukan validasi tipe file dan ukuran file sertifikat pendaftaran di sisi client dan server, serta menangani kegagalan unggahan dengan mengembalikan file ke state semula tanpa korupsi data.
- Rationale: Menghindari crash aplikasi dan penumpukan file sampah pada storage.
- Acceptance Criteria: File yang gagal diunggah (misal koneksi terputus tengah jalan) tidak tersimpan di storage dan menampilkan pesan gagal di UI.
- Verification Method: Test

#### 3.3.4 Availability

- ID: REQ-AVAIL-001
- Title: Ketersediaan Sistem Jam Operasional
- Statement: Layanan aplikasi shall memiliki tingkat ketersediaan (uptime) ≥ 99.5% selama jam sekolah aktif (Senin-Jumat, 07:00 - 17:00 WIB).
- Rationale: Memastikan sistem dapat diakses saat kegiatan KBM dan latihan ekskul berlangsung.
- Acceptance Criteria: Total akumulasi waktu downtime yang tidak direncanakan ≤ 2.2 jam per bulan pada jam operasional sekolah.
- Verification Method: Analysis

#### 3.3.5 Observability

- ID: REQ-OBS-001
- Title: Telemetri dan Monitoring Server
- Statement: Sistem shall menyediakan logging error server-side ke dalam log file terenkripsi untuk memantau performa dan crash sistem.
- Rationale: Memudahkan developer mendiagnosis bug di production.
- Acceptance Criteria: Setiap error 500 server-side memicu penulisan stack trace ke sistem log server.
- Verification Method: Test

---

### 3.4 Compliance

- ID: REQ-COMP-001
- Title: Kepatuhan Aksesibilitas WCAG 2.1 AA
- Statement: Seluruh halaman UI sistem shall mematuhi standar aksesibilitas WCAG 2.1 Level AA untuk melayani pengguna dengan disabilitas visual ringan atau buta warna.
- Rationale: Kewajiban standar inklusivitas aplikasi sekolah.
- Acceptance Criteria: Tidak ada temuan kritis (critical issue) pada audit aksesibilitas otomatis.
- Verification Method: Test + Analysis

---

- ID: REQ-COMP-002
- Title: Kebijakan Penghapusan Data Sertifikat
- Statement: Sistem shall menghapus secara permanen seluruh file sertifikat pendaftaran siswa yang diunggah setelah periode seleksi selesai dan status pendaftaran dinyatakan final.
- Rationale: Menghemat kapasitas penyimpanan storage dan melindungi privasi dokumen siswa.
- Acceptance Criteria: Skrip terjadwal (cron job) berjalan otomatis untuk menghapus file fisik sertifikat siswa setelah status pendaftaran "Diterima" atau "Ditolak".
- Verification Method: Test

---

### 3.5 Design and Implementation

#### 3.5.1 Installation

- ID: REQ-INST-001
- Title: Dukungan Browser dan Device
- Statement: Sistem shall dapat dipasang di server Linux berbasis Node.js/PHP/Docker dan diakses melalui browser web modern (Chrome, Edge, Firefox, Safari) di perangkat Windows, macOS, Android, dan iOS.
- Rationale: Portabilitas akses aplikasi bagi seluruh pengguna.
- Acceptance Criteria: Aplikasi web render dengan benar dan fungsional di seluruh lingkungan browser yang disebutkan.
- Verification Method: Test

---

- ID: REQ-INST-002
- Title: Kesiapan Sistem di Tahun Ajaran Baru
- Statement: Konfigurasi sistem shall memungkinkan pengaturan database bersih untuk tahun ajaran baru dengan satu klik/skrip inisialisasi.
- Rationale: Kecepatan penyiapan sistem menjelang tahun ajaran baru dimulai.
- Acceptance Criteria: Skrip inisialisasi berhasil membuat entitas tahun ajaran baru dan mengarsipkan data tahun ajaran sebelumnya.
- Verification Method: Demonstration

#### 3.5.2 Build and Delivery

- ID: REQ-BUILD-001
- Title: Layout Mobile-First
- Statement: Desain layout antarmuka shall menggunakan grid fluid dengan pendekatan mobile-first untuk mendukung perangkat ponsel pintar siswa.
- Rationale: Mayoritas akses pendaftaran dilakukan oleh siswa menggunakan smartphone.
- Acceptance Criteria: Komponen UI menyesuaikan lebar layar secara dinamis dari lebar minimal 320px tanpa kerusakan layout.
- Verification Method: Test

#### 3.5.3 Distribution

Aplikasi dipasang pada server tunggal (single instance deployment) di lingkungan hosting sekolah atau VPS cloud. Arsitektur multi-tenant dan multi-region tidak diterapkan.

#### 3.5.4 Maintainability

- ID: REQ-MAINT-001
- Title: Konfigurasi Warna Ekskul Dinamis
- Statement: Warna branding ekskul shall dapat diubah oleh Admin Ekskul melalui halaman pengaturan profil ekskul secara dinamis (menggunakan CSS Variables) tanpa perlu menyunting kode CSS static.
- Rationale: Kemudahan kustomisasi tampilan identitas ekskul secara mandiri.
- Acceptance Criteria: Perubahan warna primer/sekunder ekskul di UI langsung memperbarui variabel warna halaman profil ekskul terkait.
- Verification Method: Test

#### 3.5.7 Cost

Sistem dirancang untuk meminimalkan biaya operasional dengan menggunakan library open-source dan notifikasi WhatsApp gratis via link wa.me (tanpa biaya langganan API berbayar).

#### 3.5.8 Deadline

Sistem P0 (Fase 1-3) harus siap dideploy dan diuji coba sebelum periode pendaftaran siswa baru dimulai pada awal tahun ajaran baru.

#### 3.5.10 Change Management

- ID: REQ-CM-001
- Title: Suksesi Pengurus Manual
- Statement: Suksesi kepengurusan Admin Ekskul dan Pengurus Himpunan + OSIS shall dilakukan secara manual oleh pengurus tahun ajaran sebelumnya, tidak otomatis berdasarkan algoritma kenaikan kelas.
- Rationale: Penentuan kepengurusan organisasi sekolah didasarkan pada hasil musyawarah internal, bukan sekadar kenaikan jenjang kelas.
- Acceptance Criteria: Admin lama memilih siswa kelas 11 pengganti lewat UI manajemen pengurus sebelum masa kepengurusannya diarsipkan.
- Verification Method: Test

---

## 4. Verification

| Requirement ID | Title | Verification Method | Status | Notes / Artifact Link |
|----------------|-------|---------------------|--------|-----------------------|
| REQ-INT-001 | Responsivitas Antarmuka | Test | Pending | Uji pada browser mobile/desktop |
| REQ-INT-002 | Aksesibilitas WCAG 2.1 AA | Test + Analysis | Pending | Lighthouse / axe accessibility report |
| REQ-INT-003 | Pencarian Global | Test | Pending | Verifikasi hasil pencarian instan |
| REQ-INT-004 | Dashboard Personalisasi | Test | Pending | Verifikasi widget siswa |
| REQ-INT-010 | Integrasi Google OAuth | Test | Pending | Uji login email domain sekolah |
| REQ-INT-011 | Notifikasi WhatsApp wa.me | Test + Demonstration | Pending | Uji link wa.me tergenerate otomatis |
| REQ-INT-012 | Impor Data Massal Excel/PDF | Test | Pending | Impor file sampel 2.000 record |
| REQ-INT-013 | Ekspor Laporan PDF/Excel | Test | Pending | Verifikasi integritas file hasil ekspor |
| REQ-FUNC-001 | Login Akun Google Sekolah | Test | Pending | Uji email dalam & luar domain sekolah |
| REQ-FUNC-002 | Otorisasi RBAC Server-side | Test | Pending | Uji bypass otorisasi via Postman |
| REQ-FUNC-003 | Dukungan Peran Ganda | Test | Pending | Uji akun siswa + admin ekskul |
| REQ-FUNC-004 | Perubahan Akun Level Developer | Inspection | Pending | Verifikasi tidak ada UI edit email |
| REQ-FUNC-010 | Pengelolaan Profil Ekskul | Test | Pending | Uji ganti deskripsi, sosmed, branding |
| REQ-FUNC-011 | Struktur Organisasi Ekskul | Test | Pending | Uji konfigurasi jabatan |
| REQ-FUNC-012 | Galeri & Album Foto Publik | Test | Pending | Uji akses tanpa login |
| REQ-FUNC-020 | Pembukaan Periode Pendaftaran | Test | Pending | Uji submit di luar tanggal aktif |
| REQ-FUNC-021 | Pendaftaran Banyak Ekskul | Test | Pending | Uji daftar 5 ekskul berbeda |
| REQ-FUNC-022 | Pendaftaran Opsional | Test | Pending | Uji siswa tanpa ekskul |
| REQ-FUNC-023 | Upload Lampiran Sertifikat | Test | Pending | Uji batas 2 MB & tipe file |
| REQ-FUNC-024 | Penggantian Pilihan | Test | Pending | Uji ubah ekskul sebelum final |
| REQ-FUNC-025 | Penambahan Anggota Manual | Test | Pending | Uji tambah anggota oleh admin ekskul |
| REQ-FUNC-030 | Hasil Seleksi Biner | Inspection + Test | Pending | Cek tidak ada waiting list / input alasan |
| REQ-FUNC-031 | Kuota Pasca Seleksi | Test | Pending | Uji batas penerimaan anggota |
| REQ-FUNC-032 | Penerimaan Ganda Anggota | Test | Pending | Verifikasi keanggotaan aktif ganda |
| REQ-FUNC-033 | Pengumuman Seleksi | Test + Demonstration | Pending | Cek dashboard siswa |
| REQ-FUNC-040 | Status Anggota Aktif/Dikeluarkan | Inspection + Test | Pending | Uji status anggota |
| REQ-FUNC-041 | Retensi Data Anggota Lama | Test | Pending | Verifikasi histori data anggota |
| REQ-FUNC-042 | Penggantian Admin Tengah Tahun | Test | Pending | Uji ganti hak akses admin ekskul |
| REQ-FUNC-050 | Pengelolaan Absensi | Test | Pending | Uji rekap kehadiran anggota |
| REQ-FUNC-060 | Input Penilaian Bulk | Test | Pending | Uji mass-input nilai |
| REQ-FUNC-070 | Pengumuman Internal | Test | Pending | Uji rilis pengumuman terjadwal |
| REQ-FUNC-071 | Event Informasi Ekskul | Inspection | Pending | Pastikan tidak ada tombol daftar event |
| REQ-FUNC-080 | Deteksi Bentrok Jadwal | Test | Pending | Uji visual warning di kalender siswa |
| REQ-FUNC-081 | Kalender Terpadu | Test + Demonstration | Pending | Cek integrasi kalender 27 ekskul |
| REQ-FUNC-090 | Filter & Arsip Tahun Ajaran | Test | Pending | Uji status read-only arsip |
| REQ-FUNC-100 | Laporan Format PDF/Excel | Test | Pending | Unduh berkas rekap |
| REQ-FUNC-101 | Audit Log Immutable | Test + Inspection | Pending | Cek audit log saat siswa jadi alumni |
| REQ-FUNC-110 | Notifikasi Dashboard Siswa | Test | Pending | Uji trigger notifikasi |
| REQ-FUNC-111 | Notifikasi WA Massal wa.me | Test + Demonstration | Pending | Uji bulk wa.me link generation |
| REQ-PERF-001 | FCP ≤ 3 Detik | Test + Analysis | Pending | Lighthouse performance report |
| REQ-PERF-002 | Skalabilitas 5.000 Users | Test | Pending | JMeter load test report |
| REQ-PERF-003 | Impor Massal < 3 Menit | Test | Pending | Uji dengan berkas 5.000 data |
| REQ-SEC-001 | Pembatasan Google OAuth | Test | Pending | Cek kegagalan login non-sekolah email |
| REQ-SEC-002 | Validasi API Server-side | Test | Pending | Uji REST API dengan curl |
| REQ-SEC-003 | Read-Only Audit Log | Inspection | Pending | Verifikasi database schema log |
| REQ-REL-001 | Error Handling Unggah File | Test | Pending | Uji upload interupsi |
| REQ-AVAIL-001| Uptime Jam Sekolah ≥ 99.5% | Analysis | Pending | Sistem monitoring dashboard log |
| REQ-OBS-001 | Logging Stack Trace Error | Test | Pending | Cek file /var/log/app.log |
| REQ-COMP-001| Audit WCAG AA Pass | Test + Analysis | Pending | WAVE / axe validation report |
| REQ-COMP-002| Auto-Delete Sertifikat | Test | Pending | Cek storage setelah seleksi final |
| REQ-INST-001 | Lintas Platform Web | Test | Pending | Uji pada Safari iOS, Chrome Android, dll |
| REQ-INST-002 | Skrip Inisialisasi DB | Demonstration | Pending | Uji reset database tahun ajaran baru |
| REQ-BUILD-001| Pengujian Responsive Grid | Test | Pending | Uji resize window viewport |
| REQ-MAINT-001| Kustomisasi CSS Dynamic | Test | Pending | Uji update warna via profile settings |
| REQ-CM-001 | Alur Kerja Suksesi Manual | Test | Pending | Penyerahan wewenang admin lama ke baru |

---

## 5. Appendixes

### Appendix A: Daftar 27 Ekskul

Sistem dikonfigurasi saat inisialisasi untuk memuat 27 ekstrakurikuler yang terbagi ke dalam berbagai kategori (misal: Olahraga, Seni, Keagamaan, Akademik, dan Sosial). Nama dan kategori ekskul dapat disesuaikan oleh Kesiswaan/OSIS melalui panel manajemen ekskul tingkat sekolah.

### Appendix B: Atribut Data Siswa

| Field | Tipe Data | Keterangan | Aturan Modifikasi |
|---|---|---|---|
| NIS | String | Unik, 10 digit, primer key | Hanya dapat diinput saat import awal. Tidak dapat diubah oleh siswa/admin ekskul. |
| Nama Lengkap | String | Nama siswa sesuai dapodik | Hanya dapat diubah oleh developer secara manual. |
| Kelas | String | Kelas 10 (peserta) atau Kelas 11 (pengurus) | Hanya dapat diubah oleh developer secara manual. |
| Jurusan | String | Satu dari 8 jurusan resmi SMKN 1 Bawang | Hanya dapat diubah oleh developer secara manual. |
| Jenis Kelamin | Enum | L/P | Hanya dapat diubah oleh developer secara manual. |
| Nomor HP | String | Nomor WhatsApp aktif siswa | Dapat diubah sendiri oleh siswa via profil dashboard. |
| Email Sekolah | String | Email sekolah terikat Google OAuth | Hanya dapat diubah oleh developer secara manual. |
| Foto Profil | String (URL) | URL path foto | Dapat diimpor dari akun Google atau diunggah mandiri. |
| Status Siswa | Enum | Aktif / Pindah Sekolah / Alumni | Diperbarui oleh Kesiswaan/OSIS atau diarsipkan otomatis saat kelulusan. |

### Appendix C: Matriks Hak Akses Peran

| Peran | Pendaftaran Ekskul | Edit Profil Ekskul | Kelola Anggota | Input Absensi | Input Penilaian | Akses Audit Log | Konfig Tahun Ajaran |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Siswa (Kelas 10)** | ✅ | — | — | — | — | — | — |
| **Admin Ekskul (Kelas 11)**| — | ✅ * | ✅ * | ✅ * | ✅ * | — | — |
| **Pengurus Himpunan/OSIS**| — | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| **Pembina (Guru)** | — | ✅ * | ✅ * | ✅ * | ✅ | ✅ | — |
| **Kesiswaan (Staf)** | — | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| **Alumni (Lulus)** | — | — | — | — | — | — | — |

*\* Hanya untuk ekskul yang secara spesifik ditugaskan kepadanya.*

### Appendix D: Alur Kerja Utama Sistem

#### 1. Siklus Pendaftaran dan Seleksi Siswa Baru
```
Siswa Login Google School → Masuk Dashboard → Cari & Pilih Ekskul →
Isi Form Pendaftaran (Opsional: Unggah Sertifikat) → Kirim Pendaftaran →
Status: "Dalam Review" (Siswa dapat membatalkan/mengubah pilihan) →
Admin Ekskul: Review Berkas Sertifikat → Tentukan Biner: Diterima / Ditolak →
Pengumuman Hasil Rilis → Dashboard Siswa Terupdate & Tautan Notifikasi wa.me Aktif
```

#### 2. Siklus Absensi dan Penilaian Anggota Aktif
```
Hasil Seleksi Final → Siswa Terdaftar sebagai Anggota Ekskul Aktif →
Admin Ekskul membuat sesi latihan mingguan → Admin menginput status kehadiran anggota →
Pada akhir semester/tahun ajaran, Pembina/Admin Ekskul membuka tabel bulk input nilai →
Menginput Nilai Akhir Anggota → Mengunduh Laporan Latihan & Nilai (PDF / Excel)
```

#### 3. Siklus Pergantian Tahun Ajaran Baru
```
Kesiswaan mengaktifkan fitur "Arsipkan Tahun Ajaran" → Data lama dikunci menjadi Read-only →
Pengurus OSIS lama menunjuk Pengurus OSIS baru secara manual →
Admin Ekskul lama menunjuk Admin Ekskul baru (Siswa kelas 11 baru) secara manual →
Kesiswaan mengimpor data siswa kelas 10 baru dari file Excel/PDF →
Membuka periode pendaftaran baru → Siklus berulang
```