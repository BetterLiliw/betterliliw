# BetterLiliw — Implementation Phases

Tracker for turning the BetterLB template into the portal for the **Municipality
of Liliw, Laguna**. Phases are ordered by dependency: later phases assume earlier
ones are done, but within a phase items can be picked up in any order.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

> **Phases 1–4 core data and Phase 5 Cloudflare setup are in place.** Detailed
> multi-quarter BLGF eSRE / CMCI spreadsheets and Meilisearch credentials are
> tracked below as ongoing enhancements before disabling `VITE_COMING_SOON`.

---

## Phase 0 — Foundation ✅ done

Baseline setup, already in place.

- [x] Repository created from the BetterLB template (`BetterLiliw/betterliliw`)
- [x] `config/lgu.config.json` generated for Liliw via `node scripts/setup-lgu.cjs`
- [x] SEO metadata tokens resolved (`src/data/seo-metadata.json`)
- [x] `index.html` logo paths repointed to `liliw-*`
- [x] `.env` created (MeiliSearch host/port set, API key blank)
- [x] Dependencies install and `npm run dev` serves on `http://localhost:5173`
- [x] README and CONTRIBUTING retargeted to Liliw, with BetterLB credited
- [x] Listed in the BetterGov.ph LGU directory (PR #251)

---

## Phase 1 — Identity and branding

Make the portal *look* like Liliw. Cheap wins, high visible impact.

- [x] **Logos** — `public/logos/betterliliw-*` assets added and referenced by
      `config/lgu.config.json` (`navbarLogoPath` and `logoWhitePath`)
- [x] **Hero and footer copy** — `public/locales/en/common.json` now reads
      "Welcome to BetterLiliw" and describes Liliw
- [x] **Filipino translations** — same strings in `public/locales/fil/common.json`
- [x] **Map coordinates** — `location.coordinates` in `config/lgu.config.json` is
      set to Liliw's municipal hall (`14.1306, 121.4361`)
- [x] **Weather** — `location.weather.enabled` configured for Liliw (`functions/api/weather.ts`)
- [x] **Brand color** — `portal.brandColor` is now `#1c3a5b` (the navy already
      used in the logo and splash screen), and the Kapwa `brand` token scale in
      `src/index.css` is overridden to match, so every `bg`/`text`/`border-kapwa-*
      -brand*` class across the app uses it
- [x] **Favicon / OG image** — Liliw favicon (`favicon.ico`, `favicon.svg`,
      `apple-touch-icon.png`) and OG preview image (`og_image.png`) configured

---

## Phase 2 — Core municipal data 🔴 highest priority

This is the portal's reason to exist, and the blocker on going public.
All files are JSON — no JavaScript needed to contribute.

- [x] **Barangays** — `src/data/directory/barangays.json`. All **33** Liliw
      barangays added with standard slugs, addresses, and directory shape.
      Los Baños records removed.
- [x] **Departments** — `src/data/directory/departments.json`. All Liliw
      municipal offices and emergency contacts configured. Los Baños records
      removed.
- [x] **Executive** — `src/data/directory/executive.json`. Liliw Mayor, Vice
      Mayor, and department heads configured. Los Baños records removed.
- [x] **Legislative** — `src/data/directory/legislative.json`. Liliw
      Sangguniang Bayan councilors and permanent committees configured.
      Los Baños records removed.
- [x] **Keep the existing shape** — all directory files preserve the template's
      field names and TypeScript record structure

**Sourcing:** PSA/PSGC for the barangay list, the LGU's own office for contacts,
COMELEC or the LGU for the current roster. Record where each figure came from —
the directory maintainers value citations, and residents will report errors.

---

## Phase 3 — Services and Citizens Charter

- [x] **Service categories** — `src/data/services/categories/*.json` updated for
      Liliw (schools, RHUs, OSCA Liliw, municipal waste collection schedule)
- [x] **Citizens Charter** — `src/data/citizens-charter/` updated for Liliw
      (`betterliliw.org`, Liliw jurisdiction, `LILIW MPS` mapping)
- [x] **Service category index** — `src/data/service_categories.json`
- [x] **Hotlines** — `src/data/philippines_hotlines.json` prepended with Liliw
      MDRRMO, PNP, BFP, and Municipal Hall / RHU numbers in both
      `emergencyHotlines` and `criticalHotlines`
- [x] **About** — `src/data/about/history.json` (1571–2025 milestones) and
      `highlights.json` updated for Liliw
- [x] Run `npm run merge:services` after edits (uses `python`, cross-platform on
      Windows and Linux)

---

## Phase 4 — Transparency and statistics

- [x] **Statistics** — `src/data/statistics/population.json` updated with official
      PSA 1960–2024 municipal and 2010–2020 barangay census counts; `ari.json` and
      `cmci.json` updated with Liliw metadata and 2024 DTI CMCI pillar scores
      *(detailed multi-year CMCI indicator breakdowns pending official spreadsheet import)*
- [x] **Budget / SRE** — `src/data/transparency/sre.json` LGU metadata updated to
      Liliw *(multi-quarter BLGF eSRE figures pending official spreadsheet import)*
- [x] **Procurement** — `transparency.procurement.organizationName` configured as
      `MUNICIPALITY OF LILIW` in `config/lgu.config.json`
- [x] **Infrastructure** — DPWH search string `Liliw` configured in
      `config/lgu.config.json`
- [ ] Decide on the **tourism module** — currently off in `features`. Liliw's
      footwear trade is an obvious draw if you want to turn it on; the template
      ships `src/data/tourism/` to populate

---

## Phase 5 — Infrastructure

- [x] **Register a domain.** `betterliliw.org` registered with DNS on Cloudflare
- [x] **`wrangler.jsonc`** — configured for project `betterliliw`, D1 database
      `betterliliw-openlgu`, and `WEATHER_KV`
- [x] **Cloudflare Pages** — `betterliliw` project provisioned
- [x] **D1 database** — `betterliliw-openlgu` provisioned with migrations applied
- [ ] **GitHub secrets** — `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`;
      the Build and Deploy workflow fails on every push without them
- [ ] **MeiliSearch** — set `VITE_MEILISEARCH_API_KEY` in `.env` and in the Pages
      environment. Search is dead until then. See
      `docs/MEILISEARCH_INTEGRATION_GUIDE.md`
- [ ] **`lgu.officialWebsite`** — point at Liliw's separate official government
      domain if/when applicable, currently pointing to `https://betterliliw.org`

---

## Phase 6 — Launch

- [ ] Full pass over the site with fresh eyes: every page, both languages
- [ ] `npm run build` clean, `npm run lint` clean, `npm run test:e2e` passing
- [ ] Deploy to production
- [ ] **Create the Facebook page** and add it to `portal.facebookUrl`
- [ ] **Update the directory entry** — open a follow-up PR on
      `jmacj/better-lgu-directory` titled
      `Update Liliw, Laguna — status change to Active`, adding the domain and
      socials and moving 🟡 Work in Progress to 🟢 Active
- [ ] Announce to the community — barangay officials, local groups

---

## Phase 7 — Ongoing

- [ ] **Legislative pipeline** — `pipeline/` ingests ordinances and resolutions
      from PDFs into D1. Needs a source of Liliw's documents. Note the README
      links a `pipeline/README.md` that does not exist in the template; read the
      scripts themselves (`1_scrape.py` → `1.5_normalize.py` → `3_parse.py` →
      `4_generate.py`)
- [ ] **Upstream sync** — history was squashed, so `git merge upstream/main` no
      longer applies cleanly. Cherry-pick specific fixes, or merge with
      `--allow-unrelated-histories` and resolve by hand
- [ ] **Recruit contributors** — data entry needs no coding; CONTRIBUTING lists
      the entry points

---

## CI/CD

Four workflows run on every push to `main`.

| Workflow | Status | Notes |
| --- | --- | --- |
| Quality Check | ✅ green | Type check, lint, format check, production build |
| zizmor security analysis | ✅ green | Scans the workflow files themselves |
| Build and Deploy | ❌ expected | Passes its Quality Gate, then fails at Cloudflare. Phase 5 |
| E2E Tests | ⏳ | Playwright, `timeout-minutes: 30` per job |

**Build and Deploy** is gated: a `Quality Gate` job re-runs the same type
check, lint, and format check, and `Deploy to Cloudflare Pages` only runs if
it passes. So a formatting error fails the deploy workflow too — the deploy
step never executes. Once the gate passes, deploy fails with:

> In a non-interactive environment, it's necessary to set a
> `CLOUDFLARE_API_TOKEN` environment variable for wrangler to work.

That is expected until CI secrets are configured in GitHub. It cannot deploy
without those credentials, even though `wrangler.jsonc` already targets the
`betterliliw` project and `betterliliw-openlgu` D1 database.

### Formatting: the trap to know about

`.prettierrc` sets `endOfLine: "lf"`. On Windows with `core.autocrlf=true`,
your working tree is CRLF, so **`npx prettier --check .` reports hundreds of
files locally that are perfectly fine in CI**. Do not chase those. Trust what
CI names, or check a single file you actually touched.

Generated files are the real risk. `scripts/setup-lgu.cjs` writes
`config/lgu.config.json` with `JSON.stringify(config, null, 2)`, which expands
single-element arrays across three lines where prettier wants them inline.
That one difference broke both Quality Check and Build and Deploy until it was
formatted. After running the wizard, or any script that writes JSON:

```bash
npx prettier --write config/lgu.config.json   # or whichever file it wrote
```

### Notes for Phase 2

- `e2e/government/barangays.spec.ts` asserts more than 10 barangay cards
  render and filters on `'Bayate'`. Liliw's 33 barangays satisfy this assertion
- `e2e/test-config.ts` mocks the weather API with Liliw coordinates
  (`14.1306, 121.4361`)
- Force-pushing cancels in-flight runs, since the commits under test disappear

---

## Known issues

Inherited from the template, not caused by Liliw customisation.

| Issue | Detail |
| --- | --- |
| `npm audit` | 18 vulnerabilities (2 critical) in template dependencies. Worth raising upstream rather than patching downstream |
| Repo size | ~1.9 GB working tree; `.backups/` and `raw_data/` carry the template's source documents. Consider pruning what Liliw will not use |
| Dependabot | Five PRs auto-closed during the history squash; they will be re-raised |
| Missing `pipeline/README.md` | The template's README links it, but the file was never there |

---

## Quick reference

```bash
npm run dev                # dev server on :5173
npm run build              # tsc + merge services + vite build
npm run lint               # eslint, max warnings 0
npm run format             # prettier --write
npm run test:e2e           # playwright
npm run merge:services     # rebuild merged service data (needs python)
npm run functions:dev      # Cloudflare Pages Functions (fixes /api/* 500s locally)
```

See [README](./README.md#-current-status) for the current status table and
[CONTRIBUTING](./CONTRIBUTING.md) for conventions.
