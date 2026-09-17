# BetterLB Architecture

High-level architecture overview for developers working on BetterLB.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                     │
│  React 19 SPA + Tailwind CSS v4 + @bettergov/kapwa        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                         │
│  Static frontend + Serverless API functions                 │
└─────────────────────────────────────────────────────────────┘
              │                              │
              ▼                              ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   Cloudflare D1          │    │   External Services      │
│   (SQLite Database)      │    │   • Meilisearch          │
│   • Legislative docs     │    │   • PAGASA Weather       │
│   • Persons, Sessions    │    │   • BSP Forex Rates      │
│   • Review Queue         │    │   • Google OAuth         │
└──────────────────────────┘    └──────────────────────────┘
```

**Architecture Type:** JAMstack (Static Frontend + Serverless Backend)

---

## Frontend Structure

### Component Hierarchy
```
App.tsx
├── Layout Providers (SidebarLayout, UnifiedLayouts)
│   └── Page Components (Home, Services, etc.)
│       ├── Feature Components (ServiceCard, DocumentTable)
│       │   └── Shared UI Components (Card, Badge, Button)
│       └── Data Providers (API calls, static imports)
```

### Key Directories
| Directory | Purpose |
|-----------|---------|
| `src/components/ui/` | Local UI components (Card, Badge, Dialog, etc.) |
| `src/components/layout/` | Page structure (PageHeader, DetailPageLayout) |
| `src/pages/` | Route-level pages |
| `src/data/` | Static JSON data (services, departments) |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Utilities and helpers |

---

## Design System

### Tsinelas Design Tokens
Tsinelas is BetterLiliw's design system, defined in `src/styles/tsinelas.css`
and built over `@bettergov/kapwa` (which stays installed as the engine). It
implements the BetterLiliw Brand Guidelines (`public/BetterLiliw_Brand_Guidelines.pdf`):

- **Type**: Poppins 600/700 for display and headings (`tsinelas-heading-*`,
  `tsinelas-eyebrow`), Source Sans 3 400/600 for body and interface
  (`tsinelas-body-*`, `tsinelas-label-*`). Sentence case for headings; all caps
  only for small labels. Body never below 16px on mobile.
- **Color**: Deep Navy `#1C3A5B` (brand), Sunrise Gold `#D28A22` (accent — a
  shape color, never text on white; use `text-tsinelas-text-warning` = `#9A6210`
  when gold text is unavoidable), Lake Teal `#306F8E` (links, tourism), Field
  Green `#305E51` (barangay, government, success), Sky Tint `#CEE2EE` (bands,
  callouts), plus four working neutrals.
- **Rules**: one gold CTA per screen, gold buttons take navy labels, never white.

**Never use raw colors in components.** Always use semantic tokens:

```tsx
// ✅ Correct
<div className="bg-tsinelas-bg-surface text-tsinelas-text-strong">

// ❌ Wrong
<div className="bg-blue-500 text-white">
```

### Import Patterns
```tsx
// Base components from Kapwa (@bettergov/kapwa), recolored by Tsinelas
import { Button } from '@bettergov/kapwa/button';
import { Input } from '@bettergov/kapwa/input';

// Local UI components
import { Card, Badge } from '@/components/ui';
```

---

## Data Layer

### Static Data (Version Controlled)
Located in `src/data/`:
- **Services:** Citizens Charter data
- **Directory:** Government departments, barangays
- **Statistics:** Budget, population data

### Dynamic Data (Cloudflare D1)
- Legislative documents (ordinances, resolutions, executive orders)
- Persons (councilors, mayors, officials)
- Sessions and attendance
- Review queue for data verification

### External APIs
| Service | Purpose |
|---------|---------|
| Meilisearch | Fuzzy search for services and documents |
| PAGASA | Weather data (cached in KV) |
| BSP | Forex exchange rates |

---

## Backend (Cloudflare Pages Functions)

### API Structure
```
functions/api/
├── auth/           # Authentication endpoints
├── legislation/    # Legislative data queries
├── search/         # Meilisearch proxy
├── weather/        # Weather data caching
└── admin/          # Admin operations (with auth)
```

### Security
- All admin endpoints use `withAuth()` middleware chain
- Session-based authentication with secure cookies
- D1 database queries use prepared statements

---

## Data Pipeline

Legislative documents are processed through Python scripts:

```bash
pipeline/
├── 1_scrape.py         # Download PDFs
├── 1.5_normalize.py    # Standardize filenames
├── 3_parse.py          # Extract text/metadata
└── 4_generate.py       # Create JSON for D1 import
```

See `pipeline/README.md` for details.

---

## State Management

### Client State
- **Component state:** `useState`, `useReducer`
- **URL state:** `nuqs` for search params
- **Global state:** `useContext` for auth, theme

### Server State
- Static data: Direct imports
- Dynamic data: API endpoints (fetch on demand)

---

## Testing

### E2E Tests (Playwright)
Located in `e2e/`:
- Page accessibility checks
- Search functionality
- Service directory navigation
- Admin dashboard operations
- Semantic token validation (via `e2e/utils/tsinelas.ts`)

**Shared Testing Utilities:**
- `e2e/utils/tsinelas.ts` - Validates Tsinelas design token usage and prevents raw Tailwind colors

### Unit Tests (Vitest)
Component testing for complex UI components.

---

## Deployment

### Production (BetterLB)
- **Platform:** Cloudflare Pages
- **Database:** D1 `betterlb_openlgu`
- **Search:** Self-hosted Meilisearch
- **Domain:** betterlb.org
- **Wrangler:** 4.70.0 (pinned for compatibility)

### For Other LGUs
1. Connect GitHub repo to Cloudflare Pages
2. Configure D1 database binding
3. Set custom domain
4. Run database migrations
5. Deploy own Meilisearch or use alternative

**Note:** The deployment workflow pins Wrangler to version 4.70.0 to avoid compatibility issues with newer versions. Update both `.github/workflows/deploy.yml` and `package.json` if upgrading.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `config/lgu.config.json` | All LGU settings |
| `src/App.tsx` | Root component with routing |
| `src/i18n/` | Internationalization config |
| `functions/` | Backend API endpoints |
| `.env.example` | Environment variables template |

---

For detailed implementation guides, see `.local/docs/plans/` or create an issue.
