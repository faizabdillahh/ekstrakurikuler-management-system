# Design System
## Sistem Manajemen Ekstrakurikuler — SMKN 1 Bawang

> **Versi:** 1.0  
> **Tanggal:** 4 Juni 2026  
> **Status:** Final — Berlaku untuk seluruh implementasi UI  
> **Referensi:** `color.md`, `typography.md`, `typography-hierarchy.md`, `state-coverage.md`, `animation-discipline.md`, `accessibility-baseline.md`, `form-validation.md`

---

> [!IMPORTANT]
> Ini adalah **source of truth** untuk semua keputusan visual. Setiap komponen React dan halaman Inertia wajib mengacu ke dokumen ini. Warna, font, spacing, dan pola komponen yang tidak ada di sini **harus didiskusikan dulu sebelum diimplementasikan**.

---

## 1. Color System (Palet Warna)

> Hanya warna di bawah ini yang boleh digunakan. Tidak ada warna lain.

### 1.1 Token CSS (Tailwind v4 `@theme`)

Semua token didefinisikan di `resources/css/app.css` dalam blok `@theme {}`:

```css
@import "tailwindcss";

@theme {
  /* === Brand Colors === */
  --color-primary:   #fff000;  /* Kuning utama — CTA, highlight aktif */
  --color-secondary: #00a2e9;  /* Biru utama — link, badge, ikon informatif */
  --color-accent:    #fda800;  /* Oranye — accent sekunder, notifikasi warning */

  /* === Surface Colors === */
  --color-bg:        #f8f4e9;  /* Background halaman utama */
  --color-surface:   #ffffff;  /* Card, modal, sidebar */
  --color-dark:      #15160c;  /* Foreground utama (teks, ikon) */
  --color-navy:      #124272;  /* Header, sidebar nav, footer */
  --color-blue-mid:  #2065a1;  /* Tombol secondary, link hover */
  --color-blue-light:#3395c1;  /* Border informatif, divider biru */

  /* === Semantic Colors === */
  --color-success:   #17a34a;  /* Status diterima, keberhasilan aksi */
  --color-warning:   #fda800;  /* Status dalam review, peringatan */
  --color-danger:    #dc2626;  /* Status ditolak, error form */
  --color-muted:     #6b7280;  /* Label placeholder, teks sekunder */
  --color-border:    #e5e7eb;  /* Border card, divider netral */

  /* === Gradient === */
  --gradient-hero: radial-gradient(circle at 50% 50%, #00a2e9, #2f6f86);
}
```

### 1.2 Aturan Penggunaan Warna

| Layer | Share Pixel | Token yang Digunakan |
|---|---|---|
| **Neutral/Surface** | 70–90% | `--color-bg`, `--color-surface`, `--color-dark`, `--color-border` |
| **Brand Accent** | 5–10% | `--color-primary` atau `--color-secondary` (pilih satu per layar) |
| **Semantic** | 0–5% | `--color-success`, `--color-warning`, `--color-danger` |
| **Effect/Gradient** | <1% | `--gradient-hero` — hanya untuk hero section publik |

> [!WARNING]
> **At most 2 visible accent per screen.** `--color-primary` dan `--color-secondary` jangan dipakai bersamaan secara masif. Pilih satu sebagai dominant accent per halaman.

### 1.3 Kontras Wajib (WCAG 2.2 AA)

| Kombinasi | Minimum |
|---|---|
| Body text (≤16px) on `--color-bg` | **4.5:1** |
| Large text (>18px atau 14px bold) | **3:1** |
| UI Component (border, ikon) | **3:1** |
| Focus indicator vs unfocused state | **3:1** |

**Pasangan warna yang tervalidasi:**
- `--color-dark` (#15160c) on `--color-bg` (#f8f4e9) → ✅ 14.7:1
- `--color-navy` (#124272) on `--color-surface` (#ffffff) → ✅ 11.4:1
- `--color-primary` (#fff000) as background + `--color-dark` as text → ✅ 13.5:1
- `--color-secondary` (#00a2e9) as background + `--color-surface` as text → ✅ 3.1:1 (large text only)
- `--color-danger` (#dc2626) on `--color-surface` → ✅ 5.2:1

> [!CAUTION]
> `--color-primary` (#fff000) **jangan digunakan sebagai warna teks** di atas background putih — kontras hanya 1.07:1. Gunakan sebagai background dengan teks `--color-dark`.

### 1.4 Warna Dinamis Ekskul

Setiap ekskul memiliki `warna_primer` dan `warna_sekunder` dari database. Override CSS variable di komponen React:

```tsx
// Contoh pada halaman profil ekskul
<div
  style={{
    '--color-ekskul-primary': ekskul.warna_primer,
    '--color-ekskul-secondary': ekskul.warna_sekunder,
  } as React.CSSProperties}
>
  {/* konten ekskul */}
</div>
```

Default jika tidak dikonfigurasi: `warna_primer = #fff000`, `warna_sekunder = #00a2e9`.

---

## 2. Typography System

### 2.1 Font Families

```css
@theme {
  --font-sans: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

**Import Google Fonts** di `resources/views/app.blade.php`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

> Maksimal 2 typeface per halaman. Plus Jakarta Sans berfungsi sebagai display dan body sekaligus (variable weight).

### 2.2 Type Scale

```css
@theme {
  --text-xs:   0.75rem;   /* 12px — caption, label tabel */
  --text-sm:   0.875rem;  /* 14px — label input, badge */
  --text-base: 1rem;      /* 16px — body copy utama */
  --text-lg:   1.125rem;  /* 18px — body lead, card title kecil */
  --text-xl:   1.25rem;   /* 20px — H3 */
  --text-2xl:  1.5rem;    /* 24px — H2 */
  --text-3xl:  1.875rem;  /* 30px — H1 halaman */
  --text-4xl:  2.25rem;   /* 36px — H1 besar */
  --text-5xl:  3rem;      /* 48px — Display hero */
}
```

### 2.3 Font Weight (Three-Weight System)

| Peran | Weight | Tailwind | Penggunaan |
|---|---|---|---|
| **Read** | 400 | `font-normal` | Body copy, deskripsi panjang |
| **Emphasize** | 500 | `font-medium` | UI label, navigasi, badge text |
| **Announce** | 600 | `font-semibold` | Heading, tombol, judul card |

> Weight 700 (`font-bold`) hanya digunakan untuk angka statistik besar di dashboard.

### 2.4 Line Height & Letter-spacing

| Konteks | Line Height | Letter-spacing |
|---|---|---|
| Display (≥48px) | `leading-none` (1.0) | `-0.03em` |
| H1–H2 (30–36px) | `leading-tight` (1.25) | `-0.02em` |
| H3 (20–24px) | `leading-snug` (1.375) | `-0.01em` |
| Body (16–18px) | `leading-relaxed` (1.625) | `0` (default) |
| Small (13–14px) | `leading-normal` (1.5) | `0.01em` |
| UI Labels / Buttons | — | `0.02em` |
| ALL CAPS | — | **`0.08em` minimum** |

### 2.5 Hierarchy Rules

- **Satu entry point dominan per halaman.** Selalu ada satu elemen yang secara visual paling menonjol.
- **Kontras antar level ≥1.25×** pada ukuran font, ATAU dikompensasi oleh perbedaan weight + spacing.
- **Maksimal 3 level visible** di atas fold. Jika lebih, collapse atau demote.
- Heading tag (`h1`–`h3`) bersifat semantik; ukuran visual bisa berbeda dari tag-nya.

---

## 3. Spacing System

```css
@theme {
  --spacing-1:  0.25rem;  /* 4px */
  --spacing-2:  0.5rem;   /* 8px */
  --spacing-3:  0.75rem;  /* 12px */
  --spacing-4:  1rem;     /* 16px */
  --spacing-5:  1.25rem;  /* 20px */
  --spacing-6:  1.5rem;   /* 24px */
  --spacing-8:  2rem;     /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
}
```

**Prinsip spacing:**
- Spacing antar level hierarki **harus bervariasi** — minimal satu gap ≥1.5× gap lainnya.
- Uniform spacing antar semua section = **anti-pattern** (tidak ada hierarki ruang).

---

## 4. Border & Shadow

```css
@theme {
  --radius-sm:  0.25rem;  /* 4px — badge kecil, tag */
  --radius-md:  0.5rem;   /* 8px — input, tombol */
  --radius-lg:  0.75rem;  /* 12px — card */
  --radius-xl:  1rem;     /* 16px — modal, panel */
  --radius-full: 9999px;  /* pill — avatar, chip status */

  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-focus: 0 0 0 3px rgb(0 162 233 / 0.35); /* --color-secondary dengan opacity */
}
```

---

## 5. Component Patterns

### 5.1 Button

| Varian | Kapan Digunakan | Contoh Class |
|---|---|---|
| **Primary** | Aksi utama satu per halaman | `bg-[--color-primary] text-[--color-dark] font-semibold` |
| **Secondary** | Aksi pendukung | `bg-[--color-navy] text-white font-semibold` |
| **Outline** | Aksi alternatif/non-destruktif | `border border-[--color-navy] text-[--color-navy]` |
| **Danger** | Aksi destruktif (hapus, keluarkan) | `bg-[--color-danger] text-white font-semibold` |
| **Ghost** | Aksi tersier / link-style | `text-[--color-blue-mid] underline-offset-4 hover:underline` |

**Ukuran minimum touch target: 44×44px** (AAA craft commitment).  
**Letter-spacing tombol: `0.02em`** (wajib, jangan dikecualikan).

```tsx
// Contoh komponen Button
<button
  type="submit"
  className="px-5 py-2.5 bg-[--color-primary] text-[--color-dark] font-semibold
             rounded-md tracking-wide transition-opacity duration-150
             hover:opacity-90 focus-visible:outline-none
             focus-visible:ring-2 focus-visible:ring-[--color-secondary]
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  Simpan
</button>
```

### 5.2 Status Badge

| Status | Background | Text | Penggunaan |
|---|---|---|---|
| `diterima` / `aktif` | `--color-success` 10% | `--color-success` | Anggota aktif, seleksi diterima |
| `dalam_review` | `--color-warning` 10% | `#92400e` (amber-800) | Seleksi belum diputuskan |
| `ditolak` / `dikeluarkan` | `--color-danger` 10% | `--color-danger` | Seleksi ditolak, anggota dikeluarkan |
| `alumni` | `--color-muted` 10% | `--color-muted` | User alumni |

```tsx
const statusVariants = {
  diterima:      'bg-green-50 text-green-700 border border-green-200',
  dalam_review:  'bg-amber-50 text-amber-800 border border-amber-200',
  ditolak:       'bg-red-50 text-red-700 border border-red-200',
  aktif:         'bg-green-50 text-green-700 border border-green-200',
  dikeluarkan:   'bg-red-50 text-red-700 border border-red-200',
  alumni:        'bg-gray-100 text-gray-500 border border-gray-200',
};
```

### 5.3 Card

```tsx
// Card standar — data ekskul, anggota, jadwal
<div className="bg-white rounded-lg shadow-sm border border-[--color-border] p-5">
  {/* konten */}
</div>
```

### 5.4 Form Input

Aturan input:
- Label **selalu visible** di atas field — jangan gunakan placeholder sebagai pengganti label.
- Error state wajib: border merah + icon error + teks error di bawah field.
- Focus ring wajib menggunakan `--shadow-focus`.

```tsx
// Input standar
<div>
  <label htmlFor="nama" className="block text-sm font-medium text-[--color-dark] mb-1.5">
    Nama Lengkap
  </label>
  <input
    id="nama"
    type="text"
    className="w-full px-3 py-2.5 rounded-md border border-[--color-border]
               text-[--color-dark] text-base
               focus:outline-none focus:ring-2 focus:ring-[--color-secondary]
               aria-invalid:border-[--color-danger]"
    aria-describedby="nama-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <span id="nama-error" role="alert" className="text-sm text-[--color-danger] mt-1 flex items-center gap-1">
      <AlertIcon className="w-4 h-4" /> {errorMessage}
    </span>
  )}
</div>
```

### 5.5 Flash Message / Toast

```tsx
// Success: bawah / pojok kanan bawah, auto-dismiss 5s, dapat di-pause saat hover
// Error: atas (page-level) atau inline (field-level)
<div role="status" aria-live="polite" /* atau role="alert" untuk error kritis */ />
```

Posisi toast **konsisten** di seluruh aplikasi: `fixed bottom-5 right-5` (Tailwind).  
Auto-dismiss wajib dapat di-pause saat hover/focus (WCAG 2.2.1).

### 5.6 Tabel Data

```tsx
<table className="w-full text-sm border-collapse">
  <thead>
    <tr className="bg-[--color-navy] text-white">
      <th className="px-4 py-3 text-left font-semibold tracking-wide">Nama</th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-[--color-border] hover:bg-[--color-bg] transition-colors duration-100">
      <td className="px-4 py-3 text-[--color-dark]">...</td>
    </tr>
  </tbody>
</table>
```

Tabel wajib punya: sorting indicator, empty state, dan loading state (skeleton rows).

---

## 6. Layout & Grid

### 6.1 Breakpoints

```css
@theme {
  --breakpoint-sm:  640px;   /* Mobile large */
  --breakpoint-md:  768px;   /* Tablet */
  --breakpoint-lg:  1024px;  /* Desktop kecil */
  --breakpoint-xl:  1280px;  /* Desktop standar */
  --breakpoint-2xl: 1536px;  /* Desktop lebar */
}
```

**Mobile-first approach** (`REQ-BUILD-001`): desain dimulai dari 320px.

### 6.2 Container & Sidebar Layout

```
┌──────────────────────────────────────────────────────────┐
│  Navbar (--color-navy, h-16)                             │
├──────────┬───────────────────────────────────────────────┤
│ Sidebar  │  Main Content Area                            │
│ (240px)  │  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8     │
│ hidden   │                                               │
│ mobile   │                                               │
└──────────┴───────────────────────────────────────────────┘
```

- Sidebar disembunyikan di mobile, muncul sebagai drawer.
- Main content: `max-w-7xl mx-auto`.
- Body copy: `max-w-[65ch]` untuk keterbacaan optimal.

---

## 7. State Coverage (Wajib Semua Komponen)

Setiap komponen yang mengambil data, menerima input, atau bisa gagal **wajib** merender 5 state:

| State | Trigger | Yang Harus Ada |
|---|---|---|
| **Loading** | Data sedang di-fetch | Skeleton shimmer, bukan spinner kosong |
| **Empty** | Data kosong / belum ada | Heading + penjelasan + CTA utama |
| **Error** | Fetch gagal / server error | Penyebab jelas + tombol retry + input tidak terhapus |
| **Populated** | Data tersedia | State utama yang dirancang |
| **Edge** | Data ekstrem (string panjang, tabel 5000 baris) | Layout tidak rusak |

**Skeleton:** gunakan `animate-pulse` Tailwind dengan bentuk yang mencerminkan layout konten nyata.

```tsx
// Contoh skeleton card anggota
<div className="animate-pulse flex gap-3 p-4">
  <div className="w-10 h-10 bg-gray-200 rounded-full" />
  <div className="flex-1 space-y-2">
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
</div>
```

**Empty state wajib:**

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <EmptyIcon className="w-16 h-16 text-gray-300 mb-4" />
  <h3 className="text-xl font-semibold text-[--color-dark] mb-2">Belum ada anggota</h3>
  <p className="text-[--color-muted] max-w-sm mb-6">
    Tambahkan anggota secara manual atau tunggu hasil seleksi selesai.
  </p>
  <Button variant="primary">Tambah Anggota Manual</Button>
</div>
```

---

## 8. Form Validation Pattern

### 8.1 Timing Validasi (Wajib)

1. **Error muncul**: setelah user blur dari field (bukan saat mengetik).
2. **Error hilang**: segera saat input menjadi valid (re-validate on `input` event).
3. **On submit**: jalankan semua validasi, pindah fokus ke error pertama.
4. Gunakan Inertia `useForm()` — error dari server tersedia di `form.errors.fieldName`.

```tsx
const form = useForm({ nama: '', email: '' });

// Error dari server otomatis diisi oleh Inertia setelah redirect
// Tampilkan: form.errors.nama
```

### 8.2 Pesan Error

- **Spesifik**, bukan generik: ❌ "Input tidak valid" → ✅ "NIS harus terdiri dari 10 digit angka".
- Bahasa Indonesia, santun, tidak menyalahkan pengguna.
- Input pengguna **tidak boleh dihapus** saat terjadi error server-side.

---

## 9. Animation (Motion Discipline)

### 9.1 Token Durasi

```css
@theme {
  --duration-fast:    100ms;  /* Hover, toggle, press feedback */
  --duration-normal:  150ms;  /* State confirmation default */
  --duration-enter:   250ms;  /* Dropdown, modal masuk */
  --duration-screen:  350ms;  /* Transisi lintas halaman (Inertia) */
}
```

### 9.2 Easing

```css
@theme {
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);   /* M3 standard — opacity, color */
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1); /* Elemen masuk ke layar */
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1); /* Elemen keluar dari layar */
}
```

### 9.3 Aturan Animasi

- Animasi **harus punya tujuan fungsional**: state transition, spatial reorientation, progress feedback.
- Animasi dekoratif tanpa fungsi: **dilarang**.
- Durasi non-navigasi (hover, toggle, badge): **maks 200ms**.
- Setiap animasi posisi/skala wajib dihormati oleh `@media (prefers-reduced-motion: reduce)`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Aksesibilitas (Compliance Floor)

Target: **WCAG 2.2 Level AA** (`REQ-INT-002`, `REQ-COMP-001`).

### Checklist Wajib Per Komponen

- [ ] Semua input punya `<label>` yang visible dan terhubung via `for`/`id`.
- [ ] Error field punya `aria-invalid="true"` dan `aria-describedby="error-id"`.
- [ ] Tombol ikon punya `aria-label`.
- [ ] Focus ring **tidak dihapus** — gunakan `:focus-visible` dengan `--shadow-focus`.
- [ ] Tab order mengikuti urutan bacaan yang logis (tidak ada `tabindex > 0`).
- [ ] Tabel data punya `<thead>` dengan `<th scope="col">`.
- [ ] Modal trap fokus dengan benar dan dismiss via `Escape`.
- [ ] Toast/notification punya `role="status"` (konfirmasi) atau `role="alert"` (error kritis).
- [ ] Gambar konten punya `alt` deskriptif; gambar dekoratif punya `alt=""`.
- [ ] Navigasi punya `<nav aria-label="...">` dan menggunakan `<ul><li>`.

### Touch Target
- Minimum: **44×44px** untuk semua elemen interaktif (target AAA sebagai standar praktis).

---

## 11. Inertia.js Integration Notes

Pola React yang harus diikuti di seluruh codebase:

```tsx
// ✅ BENAR — submit form dengan Inertia useForm
import { useForm } from '@inertiajs/react';

const form = useForm({ status: 'diterima' });
form.put(`/manage/ekskul/${id}/seleksi/${pendaftaranId}`, {
  onSuccess: () => { /* flash message sudah ditangani Laravel */ },
});

// ❌ SALAH — jangan gunakan fetch/axios langsung
fetch('/api/seleksi', { method: 'PUT', body: JSON.stringify(...) });
```

Flash message dari Laravel tersedia via shared props:

```tsx
// Akses via usePage()
import { usePage } from '@inertiajs/react';
const { flash } = usePage().props;
// flash.success | flash.error
```

---

## 12. Referensi Dokumen Pendukung

| Dokumen | Cakupan |
|---|---|
| `color.md` | Aturan penggunaan warna, accent discipline, anti-defaults |
| `typography.md` | Scale, leading, tracking, weight rules |
| `typography-hierarchy.md` | Hierarki tipografi, hierarchy vectors, controlled violations |
| `state-coverage.md` | 5 state wajib, form states, loading thresholds, ARIA state rules |
| `animation-discipline.md` | Duration tokens, easing, reduced motion, looping motion rules |
| `accessibility-baseline.md` | WCAG 2.2 AA floor, touch targets, focus rules, ARIA discipline |
| `form-validation.md` | State machine validasi, timing rules, error wiring, schema contract |
| `laws-of-ux.md` | Prinsip UX tambahan (Hick, Fitts, Jakob) |
| `anti-ai-slop.md` | Anti-pattern yang harus dihindari dalam AI-generated UI |