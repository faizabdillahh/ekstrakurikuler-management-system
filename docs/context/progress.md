# Progress — Sistem Manajemen Ekstrakurikuler SMKN 1 Bawang

> Status terkini proyek. Update setiap kali ada perubahan signifikan.

**Terakhir diperbarui:** 4 Juni 2026

---

## Fase Saat Ini: Perencanaan & Arsitektur ✅

### ✅ Selesai
| # | Deliverable | File | Tanggal |
|---|-------------|------|---------|
| 1 | FAQ Klien (Source of Truth) | `docs/planning/FAQ-dengan-client.md` | Existing |
| 2 | Product Requirements Document (PRD) | `docs/planning/prd.md` | 3 Jun 2026 |
| 3 | Software Requirements Specification (SRS) | `docs/planning/srs.md` | 4 Jun 2026 |
| 4 | Tech Stack Definition | `docs/architecture/tech-stack.md` | 4 Jun 2026 |
| 5 | Architecture Document | `docs/architecture/architecture.md` | 4 Jun 2026 |
| 6 | Database Schema (ERD detail) | `docs/architecture/database-schema.md` | 4 Jun 2026 |
| 7 | API / Route Design | `docs/architecture/api-design.md` | 4 Jun 2026 |
| 8 | Design System & Craft Rules | `docs/design/design-system.md` (dan sekitarnya) | 4 Jun 2026 |
| 9 | Full-Stack Security Policy | `docs/security/full-stack-security.md` | 4 Jun 2026 |
| 10 | Implementation Plan | `docs/implementation/implementation-plan.md` | 4 Jun 2026 |
| 11 | Decision Log | `docs/context/decision-log.md` | 4 Jun 2026 |
| 12 | Context Documentation | `docs/context/*` | 4 Jun 2026 |

| 13 | Folder Structure | `docs/architecture/folder-structure.md` | Selesai |
| 14 | Project Setup (Scaffolding) | Root project | Selesai |
| 15 | Implementasi Fase 1 — Foundation (P0) | — | Migrasi & Seeding Selesai (Auth Google/Middleware berikutnya) |
| 16 | Implementasi Fase 2 — Core Flow | — | Belum dimulai |
| 17 | Implementasi Fase 3 — Operational | — | Belum dimulai |
| 18 | Implementasi Fase 4 — Enrichment | — | Belum dimulai |
| 19 | Implementasi Fase 5 — Enhancement | — | Belum dimulai |

---

## Catatan Teknis Penting
- **PHP 8.5** wajib digunakan (bukan 8.3) karena `spatie/laravel-activitylog v5` requires PHP ≥ 8.4.
- **Inertia.js v3** breaking changes: Axios dihapus, requires React 19, plugin Vite baru.
- **Tailwind CSS v4** konfigurasi via CSS `@theme {}`, bukan `tailwind.config.js`.
- **Laravel Excel v4** belum stable — gunakan v3.1.