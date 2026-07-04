# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A React (CRA) single-page app for building and viewing configurable BI dashboards: users upload data files, map/validate columns, and the backend generates chart widgets that are rendered client-side. Styling is Tailwind CSS. There is no backend code in this repo — it talks to a separate API service.

## Commands

- `npm start` — run the dev server (CRA, port 3000)
- `npm run build` — production build to `build/`
- `npm test` — CRA/Jest test runner in watch mode (`react-scripts test`). To run a single test file non-interactively: `npm test -- --watchAll=false src/path/to/File.test.js`
- No lint script is defined beyond the CRA-bundled `eslintConfig` (`react-app`, `react-app/jest`) that runs as part of `react-scripts start`/`build`.

## Architecture

### API layer
All backend calls go through the single axios instance in `src/api/apiConfig.js`, which sets `baseURL` (currently a hosted Render URL — the `PORT=5000` in `.env` is unused by the CRA client) and attaches `Authorization: Bearer <token>` from `sessionStorage` via a request interceptor. Never call `axios` directly from components — always import `api` from `apiConfig` (or add a function to `src/services/*`) so auth headers stay consistent.

Feature logic is grouped into `src/services/*Service.js` files (auth, upload, report, create-dashboard, edit-data-schema), each a thin wrapper of `api.get/post/put/delete` calls. Add new backend calls here rather than inlining `api.*` in page components (existing pages are inconsistent about this — new code should follow the service pattern).

### Auth & routing
- `src/context/AuthContext.jsx` holds the logged-in `user` and a `loading` flag, backed by a `token` in `sessionStorage` (not localStorage — session-only persistence is intentional, see recent commit history around login persistence). On mount it validates the token by calling `getProfile()`.
- `src/components/ProtectedRoute.jsx` wraps routes, redirecting to `/` if unauthenticated or to `/unauthorized` if the user's `role` isn't in the route's `allowedRoles`.
- Roles in use: `ADMIN`, `SUPER_ADMIN`, `ANALYST`, `MANAGER`, `SUBUSER`. Route-to-role mapping lives entirely in `src/routes/AppRoutes.jsx` — check there before adding a page to see which roles should see it.
- Note: a few routes (`/edit-profile`, `/change-password`, `/reports/:id`) pass `allowedRoles` as a prop directly on `<Route>` instead of wrapping in `ProtectedRoute` — this has no effect (React Router ignores unknown props), so those routes are effectively unprotected. Be aware of this when touching those routes rather than assuming the prop does something.

### Dashboard data flow
1. **Upload** (`UploadData.jsx` → `uploadService.js`) — upload a file, get a `fileId`.
2. **Column mapping** (`ColumnMapping.jsx` → `getMappingData`/`postManualMapping`) — map uploaded file columns to dashboard schema columns.
3. **Validation** (`DataValidation.jsx` → `getValidationSummary`/`getValidationResults`/`processFile`) — validate and commit the mapped data.
4. **Chart/widget management** (`src/pages/admin/DashboardCharts.jsx`, `src/components/VisualizationModal.jsx`) — admins create/edit/delete chart widgets per dashboard via `/api/dashboards/:id/widgets`. Each widget has a `type` (e.g. `BAR`, `LINE`, `PIE`, `KPI`, `FUNNEL`, `TABLE`, `SCATTER`, `HEATMAP`, `RADAR`, `GAUGE`, `WATERFALL`, …) and a `config` object whose shape varies by type (`xAxis`/`yAxis`/`metrics`/`groupBy` for most chart types, `metrics` for `KPI`, `steps` for `FUNNEL`, `columns` for `TABLE`).
5. **Rendering** (`src/pages/MainDashboard.jsx` + `src/components/ChartRenderer.jsx`) — `MainDashboard.jsx` lays out widgets in a `react-grid-layout` grid and supports PDF/image export (`html2canvas` + `jspdf`). `ChartRenderer.jsx` is a single large component that switches on `type` and maps the generic `config` shape (`xAxis`/`yAxis`/`metrics`/`groupBy`, falling back to `displayX`/`value`/etc.) into the props recharts needs for each chart type — when adding a new chart type, add a branch here plus a corresponding icon in `DashboardCharts.jsx`'s type-to-icon lists (there are two separate switch-like blocks there — chart name icon and chart type icon — that must both be updated together).

### Admin vs. end-user surfaces
- `src/pages/admin/*` + `src/components/AdminSidebar.jsx` — admin-facing management (dashboard/user/schema management), gated to `ADMIN`/`SUPER_ADMIN`.
- `src/pages/*` (top-level, e.g. `MainDashboard.jsx`, `UploadData.jsx`) + `src/components/Sidebar.jsx` — analyst/subuser-facing dashboard consumption and data upload flow.
- `dashboard-charts/:dashboardId/:dashboardName` is the one route left unprotected (no `ProtectedRoute` wrapper) — likely intentional for shareable/public dashboard views, but confirm before assuming it should stay that way when editing.

### State persistence
Auth token, role, and some UI state (e.g. `lastDashboardId`, cached report summaries) are stored in `sessionStorage`, not `localStorage` or Redux/Context — there's no global app state library. Check `sessionStorage` keys before adding new persisted UI state.
