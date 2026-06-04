# Full-Stack Security Policy
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Versi:** 1.0  
> **Tanggal:** 4 Juni 2026  
> **Status:** Berlaku Aktif (Mandatory)  
> **Referensi:** `srs.md`, OWASP Top 10:2025, Laravel 13 Docs

---

## 1. Pendahuluan

Dokumen ini mendefinisikan postur keamanan untuk seluruh tumpukan teknologi (full-stack) pada aplikasi ini. Aturan di bawah mengacu pada OWASP Top 10:2025, standar kriptografi 2026, dan batasan teknologi Laravel 13, Inertia v3, serta MySQL 8.4 / 9.x.

> **Setiap Pull Request yang melanggar aturan di dokumen ini akan ditolak secara otomatis.**

---

## 2. Kepatuhan OWASP Top 10:2025

Aplikasi wajib menangani risiko keamanan sesuai dengan standar OWASP Top 10:2025 yang terbaru:

1. **A01:2025 - Broken Access Control (termasuk SSRF)**
   - Semua rute administratif wajib menggunakan middleware `EnsureEkskulAccess` (mengecek `admin_ekskul_assignments`), bukan hanya mengecek role Spatie secara global.
   - *SSRF Protection:* Jika sistem sewaktu-waktu harus melakukan fetch ke URL eksternal (misal: webhook), URL tujuan harus menggunakan *allowlist* dan memblokir request ke jaringan internal (`127.0.0.0/8`, `10.0.0.0/8`, `169.254.169.254`).
2. **A02:2025 - Security Misconfiguration**
   - Di production, `APP_DEBUG=false` wajib dijalankan. Error tidak boleh menampilkan stack trace ke pengguna.
   - Direktori `.git`, `.env`, dan `storage/` tidak boleh terekspos di public web root.
3. **A03:2025 - Software Supply Chain Failures**
   - Lakukan `composer audit` dan `npm audit` secara berkala.
   - Versi dependensi (Laravel 13, React 19, Tailwind v4) sudah dikunci di `architecture.md`. Jangan tambahkan package pihak ketiga yang usang (deprecated) atau memiliki kerentanan yang diketahui.
4. **A04:2025 - Cryptographic Failures**
   - Laravel 13 menggunakan **AES-256-GCM** sebagai cipher standar (authenticated encryption). Konfigurasi `APP_KEY` harus menggunakan `php artisan key:generate` dan tidak boleh di-*hardcode* di source code.
5. **A05:2025 - Injection**
   - SQL Injection dicegah 100% menggunakan Eloquent ORM & Query Builder dengan PDO bindings.
   - **LARANGAN KERAS:** Jangan gunakan `DB::raw()` dengan variabel yang bersumber dari user input. Gunakan placeholder (parameter binding) jika raw query terpaksa digunakan.
6. **A10:2025 - Mishandling of Exceptional Conditions**
   - Penanganan error wajib elegan. Jika upload gagal atau Google OAuth terputus, kembalikan response yang jelas dengan pesan yang tidak mengekspos internal sistem (contoh: *Database connection timeout*).

---

## 3. Keamanan Backend (Laravel 13 & MySQL)

### 3.1 Otentikasi dan OAuth 2.0 (REQ-SEC-001)
- **PKCE Wajib:** Proses Google OAuth 2.0 melalui Laravel Socialite menggunakan Proof Key for Code Exchange (PKCE) untuk mencegah *authorization code injection*.
- **Hosted Domain Validation:** Parameter `hd=smkn1bawang.sch.id` di URL OAuth hanya mitigasi UI. Validasi hakiki **wajib** dilakukan di controller *callback* server-side:
  ```php
  $user = Socialite::driver('google')->user();
  $domain = substr(strrchr($user->getEmail(), "@"), 1);
  if (!str_ends_with($domain, 'smkn1bawang.sch.id')) {
      abort(403, 'Gunakan email sekolah @smkn1bawang.sch.id');
  }
  ```

### 3.2 Immutabilitas Data Audit (REQ-SEC-003)
- Audit log menggunakan `spatie/laravel-activitylog` v5.
- Log record bersifat **append-only**.
- Pengaturan config: `delete_records_older_than_days => null`.
- Tidak ada route, controller, atau command yang memanggil fungsi penghapusan atau update pada tabel `activity_log`.

### 3.3 Database Hardening (MySQL 8.4 LTS / 9.x)
Sesuai standar keamanan database MySQL tahun 2026:
- Koneksi ke database wajib dienkripsi via SSL (`PDO::MYSQL_ATTR_SSL_KEY`).
- Password menggunakan otentikasi aman bawaan seperti `caching_sha2_password` (bukan plugin autentikasi usang).
- Batasi hak akses user database hanya pada skema database aplikasi dengan hak `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP`, `INDEX`, `ALTER`. Hindari pemberian grant `SUPER` privilege pada user aplikasi.

### 3.4 Validasi & Mass Assignment
- Selalu deklarasikan `$fillable` di seluruh Eloquent model.
- Semua validasi form menggunakan `FormRequest` class, lalu manfaatkan input tervalidasi menggunakan `$request->validated()`.
- Jangan gunakan `$request->all()` saat melakukan insert atau update ke database.

---

## 4. Keamanan Frontend (Inertia.js v3 & React 19)

### 4.1 XSS (Cross-Site Scripting)
- React 19 secara otomatis lolos (escape) dari serangan XSS saat merender variabel string via JSX `{data}`.
- **LARANGAN:** Tidak menggunakan prop `dangerouslySetInnerHTML` kecuali mem-parsing pengumuman internal sekolah yang berasal dari teks editor admin yang telah melalui proses sanitasi server (HTML Purifier).

### 4.2 CSRF (Cross-Site Request Forgery)
- Inertia.js v3 **telah menghapus Axios**. Internal XHR-client Inertia kini secara otomatis menangani `XSRF-TOKEN` cookie dan menyertakannya di `X-XSRF-TOKEN` header.
- **LARANGAN:** Jangan merender `<meta name="csrf-token">` di layout blade karena framework Inertia v3 dan Laravel sudah mengaturnya secara dinamis.
- Gunakan `useForm()` dari `@inertiajs/react` untuk seluruh aksi form (POST/PUT/DELETE) karena helper ini otomatis menerapkan aturan keamanan di atas.

### 4.3 Penanganan Token Mismatch
Jika CSRF token kadaluarsa (HTTP 419), aplikasi Inertia harus merespons secara mulus. Konfigurasi `Handler.php` Laravel agar meredirect back dan menyertakan flash message "Sesi kadaluarsa, silakan coba lagi" alih-alih melempar exception JSON error raw.

---

## 5. Keamanan Operasional & Otorisasi API (REQ-SEC-002)

1. **Rate Limiting:** Terapkan Laravel Rate Limiter pada fungsi-fungsi sensitif, contohnya endpoint form import massal (maks 3 per menit) dan upload file (maks 10 per menit) untuk menghindari kelelahan I/O server.
2. **Validasi RBAC Server-side:** Middleware Spatie `role` dan `permission` **wajib** disematkan di level Route atau Controller constructor. Menyembunyikan tombol UI di React tidaklah cukup.
3. **Pengamanan Penyimpanan File:** File sertifikat (`REQ-COMP-002`) disimpan di *private storage path*, BUKAN di public direktori. Mengunduh sertifikat wajib melewati route controller yang mengecek hak akses (harus admin/pembina ekskul terkait). File akan dihapus harian oleh cron job `sertifikat:cleanup`.

---

## 6. Checklist Keamanan Deployment (Release Gate)

Sebelum pindah ke tahap produksi, periksa:
- [ ] Environment file (`.env`) production menggunakan `APP_ENV=production` dan `APP_DEBUG=false`.
- [ ] Database credentials menggunakan user khusus aplikasi (bukan `root` superuser).
- [ ] Cookie session dilindungi dengan bendera `Secure`, `HttpOnly`, dan `SameSite=Lax`.
- [ ] Header keamanan di-set oleh Nginx/Laravel (Strict-Transport-Security, X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff).
- [ ] Tidak ada dependency dengan rating CVE 'High' atau 'Critical'.
