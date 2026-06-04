# Folder Structure & 3-Layer Architecture
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Versi:** 1.0  
> **Tanggal:** 4 Juni 2026  
> **Status:** Final — Approved  
> **Referensi:** `docs/architecture/architecture.md`, `docs/implementation/implementation-plan.md`

---

## 1. Arsitektur 3-Layer (Desain Logis)

Sistem ini menerapkan pola arsitektur **3-Layer** yang memisahkan tanggung jawab logic ke dalam lapisan yang jelas (Separation of Concerns).

```
┌─────────────────────────────────────────────────────────────┐
│                       Inertia Page                          │
│               (React 19 + Tailwind v4 UI)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP Request / useForm
┌──────────────────────────────▼──────────────────────────────┐
│                    HTTP Controller Layer                    │
│      - Menerima request Inertia                             │
│      - Melakukan otentikasi & pengecekan middleware         │
│      - Memanggil Service Layer                              │
│      - Mengembalikan Inertia::render() atau redirect()      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Method Call (Data transfer via Array)
┌──────────────────────────────▼──────────────────────────────┐
│                        Service Layer                        │
│      - Pusat logika bisnis (Business Rules)                 │
│      - Mengatur transaksi database                          │
│      - Melakukan integrasi eksternal (notifikasi, file)     │
│      - Memanggil Repository Layer                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Query Builder / Eloquent Calls
┌──────────────────────────────▼──────────────────────────────┐
│                      Repository Layer                       │
│      - Mengakses database menggunakan Eloquent               │
│      - Menyembunyikan query SQL / Eloquent kompleks         │
│      - Mengembalikan Model atau Collection                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Struktur Direktori Utama

Berikut adalah struktur folder utama dari proyek Sistem Manajemen Ekstrakurikuler:

```
smkn1bawang-ekskul/
├── app/
│   ├── Console/                 # Kernel scheduler (Daily cleanup sertifikat)
│   ├── Http/
│   │   ├── Controllers/         # HTTP Controllers (Inertia Response)
│   │   ├── Middleware/          # Custom Middleware (EnsureTahunAjaranAktif, EnsureEkskulAccess)
│   │   └── Requests/            # Form Request Validation
│   ├── Models/                  # Eloquent Models (UUID v7 PK)
│   ├── Providers/               # Service Providers
│   ├── Repositories/            # Repository Layer (Data Access)
│   │   ├── BaseRepository.php
│   │   └── BaseRepositoryInterface.php
│   ├── Services/                # Service Layer (Business Logic)
│   │   └── BaseService.php
│   └── Traits/                  # Shared Traits
│       └── HasUuidV7.php
├── bootstrap/                   # App bootloader & cache
├── config/                      # PHP Configuration Files (Spatie, DomPDF, app, db, etc.)
├── database/
│   ├── factories/               # Model factories
│   ├── migrations/              # Database Migrations (27 Tabel)
│   └── seeders/                 # Database Seeders (Master data & roles)
├── docs/                        # Dokumentasi Perencanaan, Desain, Keamanan & Arsitektur
├── public/                      # Entry point publik (index.php, static assets)
├── resources/
│   ├── css/                     # Tailwind CSS v4 source (@theme)
│   └── js/                      # Inertia React 19 source code
│       ├── Components/          # Shared components (Buttons, Inputs, Modals)
│       ├── Layouts/             # Shared page layouts
│       ├── Pages/               # Inertia Page views (Login, Dashboard, Ekskul, dll.)
│       └── Types/               # TypeScript interface & type definitions
├── routes/                      # Web & CLI routes
├── storage/                     # File uploads & logs
├── tests/                       # Unit & Feature tests
├── composer.json                # PHP dependency manager config
├── package.json                 # Node package manager config
└── vite.config.js               # Vite build bundler configuration
```

---

## 3. Konvensi Naming Class & File

Untuk menjaga keteraturan codebase, setiap kelas baru wajib mematuhi konvensi penamaan berikut:

| Lapisan / Komponen | Lokasi Folder | Konvensi Nama File | Contoh Nama Class |
|---|---|---|---|
| **Trait** | `app/Traits/` | `{TraitName}.php` | `HasUuidV7` |
| **Model** | `app/Models/` | `{ModelName}.php` | `EkskulTahunAjaran` |
| **Repository Interface** | `app/Repositories/` | `{ModelName}RepositoryInterface.php` | `EkskulRepositoryInterface` |
| **Repository Class** | `app/Repositories/` | `{ModelName}Repository.php` | `EkskulRepository` |
| **Service Class** | `app/Services/` | `{ModelName}Service.php` | `EkskulService` |
| **Controller Class** | `app/Http/Controllers/` | `{Context}Controller.php` | `PendaftaranController` |
| **Middleware** | `app/Http/Middleware/` | `{MiddlewareName}.php` | `EnsureEkskulAccess` |
| **Inertia Page (React)** | `resources/js/Pages/` | `{Context}/{ViewName}.tsx` | `Manage/Seleksi/Index.tsx` |

---

## 4. Cara Penggunaan Base Classes

### 4.1. HasUuidV7 Trait
Pasang trait pada model untuk otomatisasi UUID v7:
```php
namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;

class Ekskul extends Model
{
    use HasUuidV7;
}
```

### 4.2. Repository Pattern
Definisikan Interface khusus untuk operasi database spesifik, mewarisi `BaseRepositoryInterface`:
```php
namespace App\Repositories;

interface EkskulRepositoryInterface extends BaseRepositoryInterface
{
    public function getActiveEkskul(string $tahunAjaranId);
}
```

Implementasikan interface pada class Repository konkret dengan mewarisi `BaseRepository`:
```php
namespace App\Repositories;

use App\Models\Ekskul;
use Illuminate\Database\Eloquent\Collection;

class EkskulRepository extends BaseRepository implements EkskulRepositoryInterface
{
    public function __construct(Ekskul $model)
    {
        parent::__construct($model);
    }

    public function getActiveEkskul(string $tahunAjaranId): Collection
    {
        return $this->model->where('tahun_ajaran_id', $tahunAjaranId)->get();
    }
}
```

### 4.3. Service Pattern
Mewarisi `BaseService` untuk logika bisnis:
```php
namespace App\Services;

use App\Repositories\EkskulRepositoryInterface;

class EkskulService extends BaseService
{
    public function __construct(EkskulRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    // Tulis logika bisnis tambahan di sini
}
```
