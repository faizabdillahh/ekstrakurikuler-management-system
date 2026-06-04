# Known Issues & Limitations

> Bug aktif, limitasi teknis, dan hal yang perlu diwaspadai.

**Terakhir diperbarui:** 4 Juni 2026

---

## Limitasi yang Diketahui

### L-001: Laravel Excel v4 Belum Stable
- **Status:** Active
- **Detail:** Per Juni 2026, `maatwebsite/laravel-excel v4` belum dirilis sebagai versi stable. Gunakan v3.1.
- **Dampak:** Jika PHP di-upgrade ke 8.6+ di masa depan, mungkin ada isu kompatibilitas v3.1. Monitor rilis v4.

### L-002: Notifikasi WhatsApp Bukan Real-Time
- **Status:** By Design
- **Detail:** Notifikasi WA menggunakan tautan wa.me yang harus diklik manual oleh admin. Bukan push notification otomatis.
- **Dampak:** Admin harus membuka setiap link wa.me secara manual (atau batch open tabs). Tidak ada delivery tracking.

### L-003: Album Foto Publik Tanpa Rate Limiting
- **Status:** To Monitor
- **Detail:** Galeri foto publik (REQ-FUNC-012) dapat diakses tanpa login. Belum ada strategi rate limiting untuk mencegah scraping massal.
- **Dampak:** Potensi bandwidth abuse. Pertimbangkan rate limiting di Nginx jika terjadi.

### L-004: Import PDF Lebih Kompleks dari Excel
- **Status:** To Research
- **Detail:** SRS mensyaratkan import data siswa via PDF dan Excel. Parsing PDF terstruktur jauh lebih kompleks dan error-prone dibanding Excel.
- **Dampak:** Mungkin perlu library tambahan (misal: Smalot/PdfParser) dan validasi data post-parsing yang lebih ketat.

---

## Bug Aktif

Belum ada — proyek masih dalam fase perencanaan/arsitektur.