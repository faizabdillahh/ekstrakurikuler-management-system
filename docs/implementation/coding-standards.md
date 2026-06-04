# Coding Standards
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Versi:** 1.0  
> **Tanggal:** 4 Juni 2026  
> **Stack:** Laravel 13 (PHP 8.5) + React 19 (TypeScript) + Inertia.js v3 + Tailwind CSS v4 + MySQL 8.4 LTS / 9.x

---

## 1. Prinsip Umum

1. **Readability over cleverness** — Kode harus mudah dibaca oleh guru RPL dan siswa SMK. Hindari one-liner kompleks.
2. **Explicit over implicit** — Tulis type hints, return types, dan nama variabel yang deskriptif.
3. **Consistency** — Ikuti konvensi yang sudah ditetapkan di dokumen ini tanpa pengecualian.
4. **Single Responsibility** — Setiap class, function, dan komponen hanya punya satu tanggung jawab.

---

## 2. PHP / Laravel

### 2.1 Style Guide

Mengikuti **PSR-12** + **Laravel conventions**:

```php
// ✅ BENAR
namespace App\Services;

class PendaftaranService
{
    public function __construct(
        private readonly PendaftaranRepository $repository,
    ) {}

    public function store(User $user, EkskulTahunAjaran $ekskulTa): Pendaftaran
    {
        // ...
    }
}
```

| Aspek | Aturan |
|---|---|
| **Indentasi** | 4 spasi (bukan tab) |
| **Line length** | Maks 120 karakter |
| **Brace style** | Allman style untuk class/method, K&R untuk control flow |
| **String** | Single quotes `'...'` untuk string tanpa interpolasi. Double quotes `"..."` untuk interpolasi |
| **Array** | Trailing comma pada array multi-line |
| **Strict types** | `declare(strict_types=1);` di setiap file PHP |

### 2.2 Naming Conventions

| Elemen | Format | Contoh |
|---|---|---|
| **Class** | PascalCase | `PendaftaranController`, `ImportSiswaJob` |
| **Method** | camelCase | `getAnggotaAktif()`, `markAsRead()` |
| **Variable** | camelCase | `$ekskulTaId`, `$tahunAjaran` |
| **Property** | camelCase | `$this->pendaftaranService` |
| **Constant** | UPPER_SNAKE_CASE | `self::MAX_FILE_SIZE` |
| **Config key** | kebab-case | `config('ekskul.max-upload-size')` |
| **Route name** | dot-notation | `ekskul.pendaftaran.store` |
| **Migration** | snake_case verb | `create_pendaftaran_table` |
| **Tabel DB** | snake_case plural | `pendaftaran`, `sesi_absensi` |
| **Kolom DB** | snake_case | `ekskul_ta_id`, `is_seleksi_final` |
| **Enum values** | snake_case | `dalam_review`, `pindah_sekolah` |

### 2.3 Controller — Thin Controller Pattern

Controller hanya bertanggung jawab untuk: (1) menerima request, (2) memanggil service, (3) mengembalikan response Inertia.

```php
// ✅ BENAR — Controller tipis
class SeleksiController extends Controller
{
    public function __construct(
        private readonly SeleksiService $service,
    ) {}

    public function update(UpdateSeleksiRequest $request, Pendaftaran $pendaftaran): RedirectResponse
    {
        $this->service->putuskanSeleksi($pendaftaran, $request->validated());

        return redirect()->back()->with('success', 'Status seleksi berhasil diperbarui.');
    }
}

// ❌ SALAH — Logika bisnis di controller
class SeleksiController extends Controller
{
    public function update(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->status = $request->status;
        $pendaftaran->diputuskan_oleh = auth()->id();
        $pendaftaran->diputuskan_pada = now();
        $pendaftaran->save();
        // ... ini harusnya di Service
    }
}
```

### 2.4 Service Layer

Semua logika bisnis ada di Service. Service menerima data yang sudah divalidasi dan memanipulasi model.

```php
// app/Services/SeleksiService.php
class SeleksiService
{
    public function putuskanSeleksi(Pendaftaran $pendaftaran, array $data): void
    {
        DB::transaction(function () use ($pendaftaran, $data) {
            $pendaftaran->update([
                'status' => $data['status'],
                'diputuskan_oleh' => auth()->id(),
                'diputuskan_pada' => now(),
            ]);

            if ($data['status'] === 'diterima') {
                $this->buatAnggotaDariPendaftaran($pendaftaran);
            }
        });
    }
}
```

### 2.5 Form Request Validation

Validasi selalu dilakukan di **Form Request class**, bukan di controller.

```php
// app/Http/Requests/StorePendaftaranRequest.php
class StorePendaftaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('siswa');
    }

    public function rules(): array
    {
        return [
            'ekskul_ta_id' => ['required', 'uuid', 'exists:ekskul_tahun_ajaran,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'ekskul_ta_id.required' => 'Ekskul harus dipilih.',
            'ekskul_ta_id.exists' => 'Ekskul tidak ditemukan.',
        ];
    }
}
```

### 2.6 Eloquent Model

```php
// app/Models/Pendaftaran.php
class Pendaftaran extends Model
{
    use HasUuids, LogsActivity;

    protected $table = 'pendaftaran';

    protected $fillable = [
        'user_id',
        'ekskul_ta_id',
        'status',
        'catatan_internal',
        'diputuskan_oleh',
        'diputuskan_pada',
    ];

    protected $casts = [
        'diputuskan_pada' => 'datetime',
    ];

    // ── Relationships ──────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }

    public function sertifikat(): HasMany
    {
        return $this->hasMany(Sertifikat::class);
    }

    // ── Scopes ─────────────────────────────────

    public function scopeDalamReview(Builder $query): void
    {
        $query->where('status', 'dalam_review');
    }

    // ── Activity Log ───────────────────────────

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }
}
```

**Aturan Model:**
- Selalu gunakan `HasUuids` trait untuk UUID v7
- Selalu gunakan `$fillable` (bukan `$guarded = []`)
- Selalu definisikan `$casts` untuk kolom date/boolean/json
- Relationship methods: return type eksplisit (`BelongsTo`, `HasMany`, dll)
- Scope methods: prefix `scope` + PascalCase
- Gunakan `LogsActivity` trait pada model kritis (pendaftaran, anggota, penilaian, seleksi)

### 2.7 Inertia Response

```php
// ✅ BENAR — GET response
return Inertia::render('Manage/Seleksi/Index', [
    'ekskulTa' => $ekskulTa->only('id', 'kuota_anggota', 'is_seleksi_final'),
    'pendaftar' => PendaftaranResource::collection($pendaftar),
    'statistik' => $this->service->hitungStatistik($ekskulTa),
]);

// ✅ BENAR — POST/PUT/DELETE response
return redirect()->back()->with('success', 'Data berhasil disimpan.');

// ❌ SALAH — Jangan return JSON
return response()->json(['status' => 'ok']);
```

### 2.8 API Resource / Data Transfer

Gunakan **Laravel API Resource** untuk transformasi data ke props Inertia:

```php
// app/Http/Resources/PendaftaranResource.php
class PendaftaranResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'user' => [
                'nama' => $this->user->nama,
                'nis' => $this->user->nis,
                'kelas' => $this->user->kelas,
            ],
            'sertifikat' => SertifikatResource::collection($this->whenLoaded('sertifikat')),
            'created_at' => $this->created_at->format('d M Y H:i'),
        ];
    }
}
```

---

## 3. TypeScript / React

### 3.1 Style Guide

| Aspek | Aturan |
|---|---|
| **Indentasi** | 2 spasi |
| **Semicolons** | Wajib |
| **Quotes** | Single quotes `'...'` |
| **Trailing comma** | Wajib di multi-line |
| **Line length** | Maks 100 karakter |
| **File extension** | `.tsx` untuk komponen, `.ts` untuk non-JSX |

### 3.2 Naming Conventions

| Elemen | Format | Contoh |
|---|---|---|
| **Component** | PascalCase | `SeleksiIndex.tsx`, `EkskulCard.tsx` |
| **Hook** | camelCase prefix `use` | `useEkskulColor.ts` |
| **Utility function** | camelCase | `generateWaLink()`, `formatTanggal()` |
| **Type / Interface** | PascalCase | `PendaftaranProps`, `User` |
| **Constant** | UPPER_SNAKE_CASE | `MAX_FILE_SIZE_MB` |
| **Props type** | `{ComponentName}Props` | `SeleksiIndexProps` |
| **File name (page)** | PascalCase `Index/Show/Create/Edit` | `Pages/Pendaftaran/Index.tsx` |
| **File name (component)** | PascalCase | `Components/EkskulCard.tsx` |

### 3.3 Komponen React — Functional Only

Selalu gunakan function component dengan TypeScript props:

```tsx
// ✅ BENAR
interface EkskulCardProps {
  id: string;
  nama: string;
  kategori: string;
  warnaPrimer: string;
  logoUrl: string | null;
}

export default function EkskulCard({ id, nama, kategori, warnaPrimer, logoUrl }: EkskulCardProps) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ '--color-primary': warnaPrimer } as React.CSSProperties}
    >
      <h3 className="text-lg font-semibold">{nama}</h3>
      <span className="text-sm text-gray-500">{kategori}</span>
    </div>
  );
}

// ❌ SALAH — Jangan gunakan class component atau `any`
class EkskulCard extends React.Component<any> { ... }
```

### 3.4 Halaman Inertia (Page Component)

```tsx
// resources/js/Pages/Pendaftaran/Index.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

interface PendaftaranIndexProps {
  pendaftaran: {
    id: string;
    ekskul_nama: string;
    status: 'dalam_review' | 'diterima' | 'ditolak';
    created_at: string;
  }[];
  periodePendaftaran: {
    is_buka: boolean;
    tanggal_tutup: string;
  } | null;
}

export default function PendaftaranIndex({ pendaftaran, periodePendaftaran }: PendaftaranIndexProps) {
  return (
    <AppLayout>
      <Head title="Pendaftaran Saya" />
      {/* Content */}
    </AppLayout>
  );
}
```

### 3.5 Form Submit dengan useForm

```tsx
import { useForm } from '@inertiajs/react';

export default function SeleksiForm({ pendaftaranId, ekskulTaId }: Props) {
  const form = useForm({
    status: '' as 'diterima' | 'ditolak',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.put(`/manage/ekskul/${ekskulTaId}/seleksi/${pendaftaranId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={form.data.status}
        onChange={(e) => form.setData('status', e.target.value as 'diterima' | 'ditolak')}
      >
        <option value="">Pilih keputusan...</option>
        <option value="diterima">Diterima</option>
        <option value="ditolak">Ditolak</option>
      </select>

      {form.errors.status && <p className="text-red-500 text-sm">{form.errors.status}</p>}

      <button type="submit" disabled={form.processing}>
        {form.processing ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
```

### 3.6 Custom Hooks

```tsx
// resources/js/Hooks/useEkskulColor.ts
export function useEkskulColor(warnaPrimer: string, warnaSekunder: string) {
  return {
    '--color-primary': warnaPrimer,
    '--color-secondary': warnaSekunder,
  } as React.CSSProperties;
}

// Penggunaan
const style = useEkskulColor(ekskul.warna_primer, ekskul.warna_sekunder);
<div style={style}>...</div>
```

---

## 4. Tailwind CSS v4

### 4.1 Design Tokens

Semua token warna dan spacing didefinisikan di `@theme {}`:

```css
/* resources/css/app.css */
@import "tailwindcss";

@theme {
  --color-primary: #fff000;
  --color-secondary: #00a2e9;
  --color-accent: #fda800;
  --color-dark: #15160c;
  --color-navy: #124272;
}
```

### 4.2 Aturan CSS

- **JANGAN** buat file `tailwind.config.js` — semua konfigurasi di CSS
- **JANGAN** gunakan inline `style={{}}` kecuali untuk CSS Variables dinamis (warna ekskul)
- **GUNAKAN** Tailwind utility classes sebisa mungkin
- **KELOMPOKKAN** class utilities dengan urutan: layout → sizing → spacing → typography → colors → effects

```tsx
// ✅ BENAR — Urutan class terstruktur
<div className="flex items-center w-full p-4 text-sm text-gray-700 bg-white rounded-lg shadow-sm">

// ❌ SALAH — Class acak
<div className="shadow-sm text-sm bg-white p-4 flex rounded-lg w-full items-center text-gray-700">
```

---

## 5. Database

### 5.1 Migration

```php
// ✅ BENAR
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignUuid('ekskul_ta_id')->constrained('ekskul_tahun_ajaran')->restrictOnDelete();
            $table->enum('status', ['dalam_review', 'diterima', 'ditolak'])->default('dalam_review');
            $table->text('catatan_internal')->nullable();
            $table->foreignUuid('diputuskan_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('diputuskan_pada')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'ekskul_ta_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
};
```

**Aturan migration:**
- Selalu sertakan `down()` method
- `uuid('id')->primary()` untuk semua tabel
- `foreignUuid()` + `constrained()` untuk foreign key
- Default `restrictOnDelete()`, gunakan `cascadeOnDelete()` hanya untuk tabel anak dependent
- Nama file: `YYYY_MM_DD_HHMMSS_create_nama_tabel_table.php`

### 5.2 Seeder

```php
// database/seeders/EkskulSeeder.php — contoh
class EkskulSeeder extends Seeder
{
    public function run(): void
    {
        $ekskuls = [
            ['nama' => 'Futsal', 'kategori' => 'Olahraga'],
            ['nama' => 'Basket', 'kategori' => 'Olahraga'],
            // ... 27 ekskul
        ];

        foreach ($ekskuls as $ekskul) {
            Ekskul::create([
                ...$ekskul,
                'warna_primer' => '#fff000',
                'warna_sekunder' => '#00a2e9',
            ]);
        }
    }
}
```

---

## 6. Testing

### 6.1 PHP (PHPUnit / Pest)

```php
// tests/Feature/PendaftaranTest.php
it('siswa dapat mendaftar ekskul saat periode aktif', function () {
    $siswa = User::factory()->create();
    $siswa->assignRole('siswa');
    $ekskulTa = EkskulTahunAjaran::factory()->create(['is_pendaftaran_dibuka' => true]);

    $response = $this->actingAs($siswa)
        ->post('/pendaftaran', ['ekskul_ta_id' => $ekskulTa->id]);

    $response->assertRedirect();
    $this->assertDatabaseHas('pendaftaran', [
        'user_id' => $siswa->id,
        'ekskul_ta_id' => $ekskulTa->id,
        'status' => 'dalam_review',
    ]);
});

it('siswa tidak dapat mendaftar ekskul yang sama dua kali', function () {
    // ...
});
```

### 6.2 Naming Test

- File: `tests/Feature/{Module}Test.php` atau `tests/Unit/{Class}Test.php`
- Method: deskriptif dalam bahasa Indonesia (karena domain bisnis bahasa Indonesia)
- Format Pest: `it('deskripsi perilaku', function () { ... })`

---

## 7. Git Conventions

### 7.1 Commit Messages

Format: `<type>(<scope>): <description>`

```
feat(pendaftaran): tambah validasi periode aktif
fix(absensi): perbaiki query bulk update status
refactor(seleksi): pindahkan logika ke SeleksiService
style(dashboard): rapikan spacing card widget
docs(api-design): tambah props Dashboard/Pembina
test(anggota): tambah test keluarkan anggota
chore(deps): update spatie/permission ke 7.4.2
```

**Types:** `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`

### 7.2 Branch Naming

```
feature/pendaftaran-form
fix/absensi-bulk-update
refactor/seleksi-service
```

---

## 8. Struktur Folder Proyek

```
app/
├── Console/Commands/         # Artisan commands (sertifikat:cleanup)
├── Events/                   # Domain events
├── Exports/                  # Laravel Excel export classes
├── Http/
│   ├── Controllers/          # Thin controllers per module
│   │   ├── Auth/
│   │   ├── Admin/
│   │   └── Manage/
│   ├── Middleware/            # Custom middleware
│   └── Requests/             # Form Request validation
├── Imports/                  # Laravel Excel import classes
├── Jobs/                     # Queue jobs
├── Listeners/                # Event listeners
├── Models/                   # Eloquent models
├── Policies/                 # Authorization policies
└── Services/                 # Business logic

resources/js/
├── Components/               # Reusable React components
├── Hooks/                    # Custom React hooks
├── Layouts/                  # Page layouts (App, Auth, Guest)
├── Pages/                    # Inertia pages (mirrors routes)
│   ├── Admin/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Ekskul/
│   ├── Manage/
│   └── Pendaftaran/
├── Types/                    # Shared TypeScript interfaces
└── Utils/                    # Helper functions (whatsapp, format)
```
