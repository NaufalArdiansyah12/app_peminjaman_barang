# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SIM Makmal** — Sistem Inventori & Peminjaman Makmal (School Lab Equipment Loan System). Pure frontend: HTML + Tailwind CSS (CDN) + Vanilla JS. No build step, no backend, no package manager. Open HTML files directly in browser.

## Architecture

### State Layer: `store.js`
Single global object `window.MakmalStore` — all pages load this via `<script src="../store.js">`. It handles:
- **Persistence**: `localStorage` with versioned keys (`sim_makmal_*_v2`). No server.
- **Auth session**: `localStorage('sim_makmal_current_user')` — role-based (`Admin` / `Petugas` / `Siswa`).
- **Cross-tab sync**: mutations dispatch `window.dispatchEvent(new Event('sim_makmal_sync'))`. Pages listen to re-render.
- **Overdue auto-detection**: `getLoans()` mutates status to `'overdue'` on read if past `targetReturnDate`.

### Role-Based Directory Structure
```
index.html          ← entry point, role selector
register.html       ← Siswa self-registration
admin/              ← Admin only (dashboard, master-barang, petugas, peminjaman, pengembalian, laporan)
petugas/            ← Petugas only (dashboard, peminjaman, pengembalian)
siswa/              ← Siswa only (dashboard)
```

Each page calls `MakmalStore.requireAuth(['Admin'])` or `requireAuth(['Petugas'])` at load. Admin bypasses all role checks. Login redirects to role-specific dashboard.

### Data Models

**Inventory item**: `{ id, name, category, location, totalQty, availableQty, borrowedQty, damagedQty, unit, specs }`

**Loan/transaction**: `{ id: 'TRX-YYYYMM-NNN', nis, studentName, studentClass, items: [{itemId, name, qty}], status: 'active'|'overdue'|'returned', borrowDate, targetReturnDate, actualReturnDate, officer }`

**Loan status flow**: `active` → `overdue` (auto on read) → `returned` (via `returnLoan()`)

`returnLoan()` accepts `returnItemsCondition: [{itemId, goodQty, damagedQty, damageNote}]` — splits return qty into good vs damaged, updates inventory accordingly.

### UI Stack
- Tailwind CSS via CDN — config extended inline in each `<script>` block per page.
- Lucide icons via CDN (`window.lucide.createIcons()` called after dynamic DOM inserts).
- Brand colors: `#103227` (dark), `#1B4D3E` (primary), `#4EAE85` (mint accent).
- Font: Plus Jakarta Sans (body), JetBrains Mono (mono).
- Toast notifications: `MakmalStore.showToast(message, 'success'|'error'|'warning')`.

## Key Patterns

**Auth guard** — first script in `<body>`:
```js
if (!MakmalStore.requireAuth(['Admin'])) { /* stops execution */ }
MakmalStore.renderCurrentUserUI();
```

**Stock constraint**: `createLoan()` validates `availableQty >= requested qty` and throws Malay error strings. Catch and pass to `showToast(..., 'error')`.

**ID schemes**: inventory `INV-{CAT}-{NNN}`, officers `ADM-{NNN}` / `PTG-{NNN}`, loans `TRX-{YYYYMM}-{NNN}`.

**Demo reset**: `MakmalStore.resetDemo()` wipes all localStorage back to DEFAULT_* constants.

**Activities log**: capped at 30 entries. Auto-prepended by `addInventoryItem`, `createLoan`, `returnLoan`, etc.

## Default Credentials (demo data)

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | *(any — no password check)* |
| Petugas | `syahrul` / `halimah` / `meiling` | *(any)* |
| Siswa | NIS `2024001`–`2024006` or name search | *(any)* |

> Password field is UI-only — `login()` only checks username + role match, not password.
