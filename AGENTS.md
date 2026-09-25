# AGENTS.md

Full architecture detail in `CLAUDE.md` — read it first.

## Runtime

No build step. No package manager. Open HTML files directly in browser or serve with any static server:
```
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

## Key facts agents miss

- **`store.js` loads relative**: pages in `admin/` and `petugas/` use `src="../store.js"`. `index.html` and `register.html` use `src="store.js"`. Never flatten paths.
- **Tailwind config is per-page inline**: each HTML file has its own `<script>tailwind.config = {...}</script>`. Do not extract to a shared file — CDN Tailwind reads it per-page.
- **`lucide.createIcons()` must be called after any dynamic DOM insert** that adds Lucide icon elements, or icons stay blank.
- **`getLoans()` mutates on read**: status silently flips to `'overdue'` if `targetReturnDate` is past. Do not treat loan objects as immutable after fetch.
- **No password check**: `login()` validates username + role only. Password field is decorative.
- **`sim_makmal_current_user`** key not in `STORAGE_KEYS` map — it is set directly. Do not add it there.
- **Activity log cap**: `addActivity()` trims to 30 entries. Inserts at index 0.
- **`returnLoan()` signature**: requires `returnItemsCondition: [{itemId, goodQty, damagedQty, damageNote}]` — missing this splits return incorrectly.
- **Cross-tab sync**: after any mutation dispatch `window.dispatchEvent(new Event('sim_makmal_sync'))`. Pages rely on this to re-render without page reload.

## Demo reset

```js
MakmalStore.resetDemo() // wipes all sim_makmal_*_v2 keys back to DEFAULT_* constants
```

## Default credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | any |
| Petugas | `syahrul` / `halimah` / `meiling` | any |
| Siswa | NIS `2024001`–`2024006` or name | any |

## ID schemes

- Inventory: `INV-{CAT}-{NNN}` (e.g. `INV-BIO-001`)
- Officers: `ADM-{NNN}` / `PTG-{NNN}`
- Loans: `TRX-{YYYYMM}-{NNN}`

## Brand colors (Tailwind arbitrary values)

`#103227` dark, `#1B4D3E` primary, `#4EAE85` mint accent — used as arbitrary values e.g. `bg-[#1B4D3E]`.
