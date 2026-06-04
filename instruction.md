# Panduan Konfigurasi Google OAuth & Autentikasi Lokal

Karena proses Google OAuth memerlukan *Credentials API* resmi yang dikeluarkan oleh Google Cloud Console, Anda perlu melakukan beberapa langkah konfigurasi manual berikut di komputer Anda:

---

## 🛠️ Langkah 1: Buat OAuth Credentials di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/) dan login menggunakan akun Google Anda.
2. Buat proyek baru atau pilih proyek yang sudah ada.
3. Buka menu **APIs & Services** -> **OAuth consent screen**:
   * Pilih **User Type:** `External` (jika menggunakan Gmail biasa untuk pengujian) atau `Internal` (jika menggunakan akun Google Workspace sekolah).
   * Isi kolom nama aplikasi (misal: `Ekskul SMKN 1 Bawang`) dan email dukungan.
   * Pada tab Scopes, tambahkan scope `.../auth/userinfo.email` dan `.../auth/userinfo.profile`.
   * Pada tab Test Users (jika statusnya testing), tambahkan email Google pribadi Anda agar bisa login untuk uji coba.
4. Buka menu **APIs & Services** -> **Credentials**:
   * Klik **+ Create Credentials** -> **OAuth client ID**.
   * Pilih **Application type:** `Web application`.
   * Isi nama client (misal: `Development Local`).
   * Pada bagian **Authorized redirect URIs**, tambahkan URL callback lokal berikut:
     ```
     http://localhost:8000/auth/google/callback
     ```
   * Klik **Create**.

---

## ⚙️ Langkah 2: Konfigurasi File `.env` Lokal Anda

Setelah credential dibuat, Anda akan mendapatkan **Client ID** dan **Client Secret**. Buka file `.env` di proyek Anda, cari baris konfigurasi berikut, lalu lengkapi isinya:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=masukkan_client_id_anda_disini.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=masukkan_client_secret_anda_disini
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Set to true untuk mewajibkan email @smkn1bawang.sch.id (Production)
# Set to false agar bisa login menggunakan Gmail biasa saat testing (Local)
GOOGLE_OAUTH_RESTRICT_DOMAIN=false
```

---

## 🧪 Langkah 3: Jalankan dan Uji Coba

1. Buka terminal Laragon Anda, jalankan perintah server:
   ```bash
   composer dev
   ```
2. Buka browser dan buka alamat:
   ```
   http://127.0.0.1:8000
   ```
3. Klik tombol **Masuk Aplikasi** di pojok kanan atas untuk masuk ke halaman Login.
4. Klik tombol **Masuk dengan Google Sekolah** untuk memulai proses autentikasi.
5. Setelah login sukses, Anda akan dialihkan ke halaman **Dashboard Utama** yang menampilkan nama dan profil Anda!
