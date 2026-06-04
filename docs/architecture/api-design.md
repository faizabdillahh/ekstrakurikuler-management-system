# Route & Page Design (Inertia.js)
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Versi:** 1.0  
> **Tanggal:** 4 Juni 2026  
> **Protokol:** Inertia.js v3 (XHR, bukan REST API)  
> **Referensi:** `architecture.md`, `database-schema.md`, `srs.md`

---

## Konvensi

| Aspek | Aturan |
|---|---|
| **Response GET** | `Inertia::render('Page/Name', [...props])` |
| **Response POST/PUT/DELETE** | `redirect()->back()` atau `redirect()->route(...)` dengan session flash |
| **Parameter UUID** | Seluruh `{id}` di URL adalah UUID v7 string |
| **Middleware Auth** | `auth` = login wajib, `guest` = hanya untuk belum login |
| **Middleware Role** | `role:nama` menggunakan Spatie Permission |
| **Middleware Scope** | `ekskul.access` = custom middleware cek `admin_ekskul_assignments` |
| **Tahun Ajaran** | Diinjeksi otomatis via middleware `EnsureTahunAjaranAktif` sebagai shared prop |

---

## 1. Public Routes (Tanpa Login)

**Middleware:** `guest` atau none

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/` | `HomeController@index` | `Home` | Landing page publik |
| GET | `/login` | `Auth\LoginController@index` | `Auth/Login` | Halaman login Google |
| GET | `/auth/google` | `Auth\SocialiteController@redirect` | — (redirect ke Google) | Redirect ke Google OAuth |
| GET | `/auth/google/callback` | `Auth\SocialiteController@callback` | — (redirect ke /dashboard) | Callback OAuth + validasi domain |
| POST | `/logout` | `Auth\LoginController@destroy` | — (redirect ke /) | Logout & hapus session |
| GET | `/galeri` | `GaleriPublikController@index` | `Galeri/Index` | Daftar album foto publik |
| GET | `/galeri/{album_id}` | `GaleriPublikController@show` | `Galeri/Show` | Detail album + foto |

### Props: `Home`
```ts
{
  ekskulList: { id, nama, kategori, logo_url, deskripsi }[],
  pengumumanPublik: { judul, konten, tanggal }[]
}
```

### Props: `Galeri/Index`
```ts
{
  albums: {
    id, judul, deskripsi, ekskul_nama, cover_url, jumlah_foto, created_at
  }[]
}
```

---

## 2. Shared Routes (Semua Role yang Login)

**Middleware:** `auth`

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/dashboard` | `DashboardController@index` | `Dashboard/{Role}` | Dashboard sesuai role aktif user |
| GET | `/profil` | `ProfilController@edit` | `Profil/Edit` | Edit profil (no HP, foto) |
| PUT | `/profil` | `ProfilController@update` | — (redirect back) | Simpan perubahan profil |
| POST | `/profil/foto` | `ProfilController@updateFoto` | — (redirect back) | Upload foto profil |
| GET | `/notifikasi` | `NotifikasiController@index` | `Notifikasi/Index` | Daftar notifikasi user |
| PUT | `/notifikasi/{id}/read` | `NotifikasiController@markRead` | — (redirect back) | Tandai sudah dibaca |
| PUT | `/notifikasi/read-all` | `NotifikasiController@markAllRead` | — (redirect back) | Tandai semua dibaca |
| GET | `/ekskul` | `EkskulController@index` | `Ekskul/Index` | Daftar 27 ekskul + filter kategori |
| GET | `/ekskul/{id}` | `EkskulController@show` | `Ekskul/Show` | Detail profil ekskul |
| GET | `/kalender` | `KalenderController@index` | `Kalender/Index` | Kalender terpadu semua ekskul |
| GET | `/pencarian` | `PencarianController@index` | `Pencarian/Index` | Pencarian global |

### Props: `Dashboard/Siswa`
```ts
{
  user: { id, nama, kelas, jurusan, foto_profil },
  pendaftaranAktif: { id, ekskul_nama, status, created_at }[],
  ekskulDiikuti: { id, ekskul_nama, jadwal_hari, jadwal_jam }[],
  jadwalBentrok: { ekskul_a, ekskul_b, hari, jam }[],
  notifikasiUnread: number,
  periodePendaftaran: { is_buka, tanggal_tutup } | null
}
```

### Props: `Dashboard/AdminEkskul`
```ts
{
  user: { id, nama },
  ekskulDikelola: {
    id, ekskul_ta_id, nama, jumlah_pendaftar, jumlah_anggota, kuota
  }[],
  notifikasiUnread: number
}
```

### Props: `Dashboard/Kesiswaan`
```ts
{
  user: { id, nama },
  tahunAjaranAktif: { id, nama, tanggal_mulai, tanggal_selesai },
  statistik: {
    total_siswa, total_ekskul, total_pendaftar, total_anggota
  },
  notifikasiUnread: number
}
```

### Shared Props (Injected via Middleware)
```ts
// HandleInertiaRequests middleware — tersedia di SEMUA halaman
{
  auth: { user: { id, nama, email, roles: string[] } },
  tahunAjaranAktif: { id, nama },
  flash: { success?: string, error?: string },
  notifikasiUnreadCount: number
}
```

---

## 3. Siswa Routes — Pendaftaran

**Middleware:** `auth`, `role:siswa`

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/pendaftaran` | `PendaftaranController@index` | `Pendaftaran/Index` | Daftar pendaftaran siswa |
| GET | `/pendaftaran/buat/{ekskul_ta_id}` | `PendaftaranController@create` | `Pendaftaran/Create` | Form pendaftaran ke ekskul |
| POST | `/pendaftaran` | `PendaftaranController@store` | — (redirect back) | Submit pendaftaran |
| GET | `/pendaftaran/{id}` | `PendaftaranController@show` | `Pendaftaran/Show` | Detail & status pendaftaran |
| PUT | `/pendaftaran/{id}` | `PendaftaranController@update` | — (redirect back) | Ubah pilihan (sebelum final) |
| DELETE | `/pendaftaran/{id}` | `PendaftaranController@destroy` | — (redirect back) | Batalkan pendaftaran |
| POST | `/pendaftaran/{id}/sertifikat` | `SertifikatController@store` | — (redirect back) | Upload sertifikat |
| DELETE | `/sertifikat/{id}` | `SertifikatController@destroy` | — (redirect back) | Hapus sertifikat |

### Form Validation: `StorePendaftaranRequest`
```php
[
    'ekskul_ta_id' => 'required|uuid|exists:ekskul_tahun_ajaran,id',
]
// Custom: cek periode_pendaftaran aktif, cek unique(user_id, ekskul_ta_id)
```

### Form Validation: `StoreSertifikatRequest`
```php
[
    'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048', // 2 MB
]
```

---

## 4. Admin Ekskul Routes — Manajemen Operasional

**Middleware:** `auth`, `role:admin-ekskul|pembina`, `ekskul.access:{ekskul_ta_id}`

> Prefix: `/manage/ekskul/{ekskul_ta_id}`

### 4.1 Profil & Pengaturan Ekskul

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/manage/ekskul/{id}` | `Manage\EkskulController@edit` | `Manage/Ekskul/Edit` | Edit profil ekskul |
| PUT | `/manage/ekskul/{id}` | `Manage\EkskulController@update` | — (redirect back) | Simpan profil |
| POST | `/manage/ekskul/{id}/logo` | `Manage\EkskulController@updateLogo` | — (redirect back) | Upload logo |

### Form Validation: `UpdateEkskulRequest`
```php
[
    'nama'           => 'sometimes|string|max:100',
    'deskripsi'      => 'nullable|string',
    'kategori'       => 'sometimes|string|max:50',
    'warna_primer'   => 'nullable|regex:/^#[0-9A-Fa-f]{6}$/',
    'warna_sekunder' => 'nullable|regex:/^#[0-9A-Fa-f]{6}$/',
    'media_sosial'   => 'nullable|json',
]
```

### 4.2 Seleksi Pendaftar

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../seleksi` | `Manage\SeleksiController@index` | `Manage/Seleksi/Index` | List pendaftar + sertifikat |
| PUT | `.../seleksi/{pendaftaran_id}` | `Manage\SeleksiController@update` | — (redirect back) | Set diterima/ditolak |
| PUT | `.../seleksi/bulk` | `Manage\SeleksiController@bulkUpdate` | — (redirect back) | Bulk set keputusan |
| POST | `.../seleksi/finalize` | `Manage\SeleksiController@finalize` | — (redirect back) | Kunci seleksi (final) |
| PUT | `.../kuota` | `Manage\SeleksiController@updateKuota` | — (redirect back) | Set kuota anggota |

### Form Validation: `UpdateSeleksiRequest`
```php
[
    'status' => 'required|in:diterima,ditolak',
]
// Custom: cek is_seleksi_final == false, cek jumlah diterima <= kuota
```

### Props: `Manage/Seleksi/Index`
```ts
{
  ekskulTa: { id, ekskul_nama, kuota_anggota, is_seleksi_final },
  pendaftar: {
    id, user: { nama, nis, kelas, jurusan },
    status, sertifikat: { id, nama_file, url }[],
    created_at
  }[],
  statistik: { total, dalam_review, diterima, ditolak }
}
```

### 4.3 Anggota

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../anggota` | `Manage\AnggotaController@index` | `Manage/Anggota/Index` | List anggota aktif |
| POST | `.../anggota` | `Manage\AnggotaController@store` | — (redirect back) | Tambah anggota manual |
| PUT | `.../anggota/{id}/keluarkan` | `Manage\AnggotaController@keluarkan` | — (redirect back) | Keluarkan anggota |

### Form Validation: `StoreAnggotaManualRequest`
```php
[
    'user_id' => 'required|uuid|exists:users,id',
]
// Custom: cek user belum jadi anggota di ekskul_ta ini
```

### 4.4 Absensi

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../absensi` | `Manage\AbsensiController@index` | `Manage/Absensi/Index` | List sesi absensi |
| GET | `.../absensi/create` | `Manage\AbsensiController@create` | `Manage/Absensi/Create` | Form buat sesi + isi absensi |
| POST | `.../absensi` | `Manage\AbsensiController@store` | — (redirect back) | Simpan sesi + bulk absensi |
| GET | `.../absensi/{sesi_id}` | `Manage\AbsensiController@show` | `Manage/Absensi/Show` | Detail sesi + edit absensi |
| PUT | `.../absensi/{sesi_id}` | `Manage\AbsensiController@update` | — (redirect back) | Update bulk absensi |

### Form Validation: `StoreAbsensiRequest`
```php
[
    'tanggal'              => 'required|date',
    'keterangan'           => 'nullable|string|max:255',
    'absensi'              => 'required|array|min:1',
    'absensi.*.anggota_id' => 'required|uuid|exists:anggota,id',
    'absensi.*.status'     => 'required|in:hadir,izin,sakit,alfa',
]
```

### 4.5 Penilaian

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../penilaian` | `Manage\PenilaianController@index` | `Manage/Penilaian/Index` | Tabel nilai anggota |
| PUT | `.../penilaian/bulk` | `Manage\PenilaianController@bulkUpdate` | — (redirect back) | Bulk input/update nilai |

### Form Validation: `BulkPenilaianRequest`
```php
[
    'penilaian'               => 'required|array|min:1',
    'penilaian.*.anggota_id'  => 'required|uuid|exists:anggota,id',
    'penilaian.*.nilai_akhir' => 'required|numeric|min:0|max:100',
]
```

### 4.6 Pengumuman

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../pengumuman` | `Manage\PengumumanController@index` | `Manage/Pengumuman/Index` | List pengumuman |
| GET | `.../pengumuman/create` | `Manage\PengumumanController@create` | `Manage/Pengumuman/Create` | Form buat |
| POST | `.../pengumuman` | `Manage\PengumumanController@store` | — (redirect back) | Simpan + lampiran |
| GET | `.../pengumuman/{id}` | `Manage\PengumumanController@show` | `Manage/Pengumuman/Show` | Detail |
| GET | `.../pengumuman/{id}/edit` | `Manage\PengumumanController@edit` | `Manage/Pengumuman/Edit` | Form edit |
| PUT | `.../pengumuman/{id}` | `Manage\PengumumanController@update` | — (redirect back) | Update |
| DELETE | `.../pengumuman/{id}` | `Manage\PengumumanController@destroy` | — (redirect back) | Hapus |

### 4.7 Event

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../event` | `Manage\EventController@index` | `Manage/Event/Index` | List event |
| POST | `.../event` | `Manage\EventController@store` | — (redirect back) | Buat event baru |
| GET | `.../event/{id}/edit` | `Manage\EventController@edit` | `Manage/Event/Edit` | Form edit event |
| PUT | `.../event/{id}` | `Manage\EventController@update` | — (redirect back) | Update event |
| DELETE | `.../event/{id}` | `Manage\EventController@destroy` | — (redirect back) | Hapus event |
| POST | `.../event/{id}/dokumentasi` | `Manage\DokumentasiController@store` | — (redirect back) | Upload foto dokumentasi |
| DELETE | `.../dokumentasi/{id}` | `Manage\DokumentasiController@destroy` | — (redirect back) | Hapus foto |

### 4.8 Jadwal

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../jadwal` | `Manage\JadwalController@index` | `Manage/Jadwal/Index` | List jadwal latihan |
| POST | `.../jadwal` | `Manage\JadwalController@store` | — (redirect back) | Tambah jadwal |
| PUT | `.../jadwal/{id}` | `Manage\JadwalController@update` | — (redirect back) | Edit jadwal |
| DELETE | `.../jadwal/{id}` | `Manage\JadwalController@destroy` | — (redirect back) | Hapus jadwal |

### 4.9 Struktur Organisasi

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../struktur` | `Manage\StrukturController@index` | `Manage/Struktur/Index` | Tampilkan struktur |
| POST | `.../struktur` | `Manage\StrukturController@store` | — (redirect back) | Tambah jabatan |
| PUT | `.../struktur/{id}` | `Manage\StrukturController@update` | — (redirect back) | Edit jabatan |
| DELETE | `.../struktur/{id}` | `Manage\StrukturController@destroy` | — (redirect back) | Hapus jabatan |

### 4.10 Album & Galeri

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `.../album` | `Manage\AlbumController@index` | `Manage/Album/Index` | List album ekskul |
| POST | `.../album` | `Manage\AlbumController@store` | — (redirect back) | Buat album |
| PUT | `.../album/{id}` | `Manage\AlbumController@update` | — (redirect back) | Edit album |
| DELETE | `.../album/{id}` | `Manage\AlbumController@destroy` | — (redirect back) | Hapus album |
| POST | `.../album/{id}/foto` | `Manage\FotoController@store` | — (redirect back) | Upload foto |
| DELETE | `.../foto/{id}` | `Manage\FotoController@destroy` | — (redirect back) | Hapus foto |

---

## 5. Pengurus OSIS Routes

**Middleware:** `auth`, `role:pengurus-osis`

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/admin/pengurus` | `Admin\PengurusController@index` | `Admin/Pengurus/Index` | Kelola admin ekskul & pengurus |
| POST | `/admin/pengurus/assign` | `Admin\PengurusController@assign` | — (redirect back) | Tugaskan admin ekskul baru |
| DELETE | `/admin/pengurus/{id}` | `Admin\PengurusController@revoke` | — (redirect back) | Cabut akses admin ekskul |
| POST | `/admin/pengurus/suksesi-osis` | `Admin\PengurusController@suksesiOsis` | — (redirect back) | Serah terima pengurus OSIS |

### Form Validation: `AssignAdminEkskulRequest`
```php
[
    'user_id'      => 'required|uuid|exists:users,id',
    'ekskul_ta_id' => 'required|uuid|exists:ekskul_tahun_ajaran,id',
]
```

---

## 6. Kesiswaan Routes — Administrasi Sekolah

**Middleware:** `auth`, `role:kesiswaan`

### 6.1 Tahun Ajaran

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/admin/tahun-ajaran` | `Admin\TahunAjaranController@index` | `Admin/TahunAjaran/Index` | List tahun ajaran |
| POST | `/admin/tahun-ajaran` | `Admin\TahunAjaranController@store` | — (redirect back) | Buat tahun ajaran baru |
| PUT | `/admin/tahun-ajaran/{id}/activate` | `Admin\TahunAjaranController@activate` | — (redirect back) | Aktifkan tahun ajaran |
| PUT | `/admin/tahun-ajaran/{id}/archive` | `Admin\TahunAjaranController@archive` | — (redirect back) | Arsipkan (read-only) |

### 6.2 Manajemen Ekskul (Master Data)

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/admin/ekskul` | `Admin\EkskulMasterController@index` | `Admin/Ekskul/Index` | Kelola 27 ekskul |
| POST | `/admin/ekskul` | `Admin\EkskulMasterController@store` | — (redirect back) | Tambah ekskul |
| PUT | `/admin/ekskul/{id}` | `Admin\EkskulMasterController@update` | — (redirect back) | Update ekskul |
| POST | `/admin/ekskul/activate-tahun` | `Admin\EkskulMasterController@activateTahun` | — (redirect back) | Aktifkan ekskul di tahun ajaran |

### 6.3 Import Data Siswa

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/admin/siswa` | `Admin\SiswaController@index` | `Admin/Siswa/Index` | List data siswa |
| GET | `/admin/siswa/import` | `Admin\ImportController@create` | `Admin/Siswa/Import` | Halaman upload |
| POST | `/admin/siswa/import` | `Admin\ImportController@store` | — (redirect back) | Submit file Excel/PDF (async queue) |
| PUT | `/admin/siswa/{id}/status` | `Admin\SiswaController@updateStatus` | — (redirect back) | Ubah status siswa |

### Form Validation: `ImportSiswaRequest`
```php
[
    'file' => 'required|file|mimes:xlsx,pdf|max:10240', // 10 MB
]
```

### 6.4 Periode Pendaftaran

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/admin/periode-pendaftaran` | `Admin\PeriodeController@index` | `Admin/Periode/Index` | Kelola periode |
| POST | `/admin/periode-pendaftaran` | `Admin\PeriodeController@store` | — (redirect back) | Buat periode baru |
| PUT | `/admin/periode-pendaftaran/{id}` | `Admin\PeriodeController@update` | — (redirect back) | Update tanggal buka/tutup |

### 6.5 Laporan & Export

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/admin/laporan` | `Admin\LaporanController@index` | `Admin/Laporan/Index` | Pilih jenis & filter laporan |
| GET | `/admin/laporan/anggota/export` | `Admin\LaporanController@exportAnggota` | — (file download) | Download Excel/PDF anggota |
| GET | `/admin/laporan/absensi/export` | `Admin\LaporanController@exportAbsensi` | — (file download) | Download Excel/PDF absensi |
| GET | `/admin/laporan/penilaian/export` | `Admin\LaporanController@exportPenilaian` | — (file download) | Download Excel/PDF penilaian |

### 6.6 Audit Log

| Method | URI | Controller | Inertia Page | Deskripsi |
|---|---|---|---|---|
| GET | `/admin/audit-log` | `Admin\AuditLogController@index` | `Admin/AuditLog/Index` | Browse audit log (read-only) |

> **TIDAK ADA** route PUT/DELETE untuk audit log. Immutable by design.

### Props: `Admin/AuditLog/Index`
```ts
{
  logs: {
    id, log_name, description,
    causer: { nama, email },
    subject_type, subject_id,
    properties: { old: object, attributes: object },
    created_at
  }[],
  filters: { causer_id?, subject_type?, date_from?, date_to? }
}
```

---

## 7. Notifikasi WhatsApp (Non-Route)

Notifikasi WhatsApp **bukan route API** melainkan helper yang generate URL di frontend:

```ts
// utils/whatsapp.ts
function generateWaLink(noHp: string, pesan: string): string {
  const nomorBersih = noHp.replace(/[^0-9]/g, '');
  const nomor62 = nomorBersih.startsWith('0') 
    ? '62' + nomorBersih.slice(1) 
    : nomorBersih;
  return `https://wa.me/${nomor62}?text=${encodeURIComponent(pesan)}`;
}
```

Tombol "Kirim Notifikasi WA" di halaman seleksi (`Manage/Seleksi/Index`) menggunakan helper ini untuk membuka tab baru per siswa.

---

## 8. Ringkasan Jumlah Route

| Grup | GET | POST | PUT | DELETE | Total |
|---|---|---|---|---|---|
| Public | 5 | 1 | 0 | 0 | **6** |
| Shared (All Roles) | 7 | 1 | 2 | 0 | **10** |
| Siswa (Pendaftaran) | 3 | 2 | 1 | 2 | **8** |
| Admin Ekskul (Manage) | 13 | 10 | 8 | 7 | **38** |
| Pengurus OSIS | 1 | 2 | 0 | 1 | **4** |
| Kesiswaan (Admin) | 8 | 5 | 4 | 0 | **17** |
| **Total** | **37** | **21** | **15** | **10** | **83** |
