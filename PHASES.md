# BetterLiliw — Implementation Phases

Tracker for turning the BetterLB template into the portal for the **Municipality
of Liliw, Laguna**. Phases are ordered by dependency: later phases assume earlier
ones are done, but within a phase items can be picked up in any order.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

> **Do not deploy publicly until Phase 2 is complete.** Several data files still
> contain Los Baños's real barangay phone numbers and Facebook links. Publishing
> them under Liliw's name would put another municipality's contact details in
> front of Liliw residents.

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

- [ ] **Logos** — replace `public/logos/svg/betterlb-*.svg` and
      `public/logos/png/betterlb-*.png` with Liliw assets. Config already points at
      `liliw-*` filenames, so the navbar logo is currently a broken image. Needed
      variants: `liliw-icon-white`, `liliw-icon-colored`, `liliw-logo-primary`,
      `liliw-banner-colored`, `liliw-banner-inverted`, `liliw-blue`
- [ ] **Hero and footer copy** — `public/locales/en/common.json` still reads
      "Welcome to BetterLB" and describes Los Baños
- [ ] **Filipino translations** — same strings in `public/locales/fil/common.json`
- [ ] **Map coordinates** — `location.coordinates` in `config/lgu.config.json` is
      `{lat: 0, lng: 0}`, which puts the map in the Gulf of Guinea. Set to Liliw's
      municipal hall
- [ ] **Weather** — set `location.weather.enabled` once coordinates are real
- [ ] **Brand color** — `portal.brandColor` is the template's `#0066eb`; change if
      Liliw has its own palette
- [ ] **Favicon / OG image** — follow from the logo work; verify link previews

---

## Phase 2 — Core municipal data 🔴 highest priority

This is the portal's reason to exist, and the blocker on going public.
All files are JSON — no JavaScript needed to contribute.

- [ ] **Barangays** — `src/data/directory/barangays.json`. Currently Los Baños's
      14. Liliw has **33**. Each entry: slug, name, address, contact numbers,
      website/Facebook, officials
- [ ] **Departments** — `src/data/directory/departments.json`. Currently 33
      Los Baños offices. Replace with Liliw's municipal offices and contacts
- [ ] **Executive** — `src/data/directory/executive.json`. Mayor, Vice Mayor,
      department heads
- [ ] **Legislative** — `src/data/directory/legislative.json`. Sangguniang Bayan
      members
- [ ] **Keep the existing shape** — there is no JSON schema for the directory
      files (`src/data/schema/` only covers SEO metadata and service categories),
      so match the field names in the template's records rather than inventing
      new ones

**Sourcing:** PSA/PSGC for the barangay list, the LGU's own office for contacts,
COMELEC or the LGU for the current roster. Record where each figure came from —
the directory maintainers value citations, and residents will report errors.

---

## Phase 3 — Services and Citizens Charter

- [ ] **Service categories** — `src/data/services/categories/*.json`, ten files
      (agriculture, business, certificates, education, environment, health,
      infrastructure, public safety, social services, taxation). Each holds
      requirements, fees, and steps
- [ ] **Citizens Charter** — `src/data/citizens-charter/`. If Liliw publishes a
      Citizens Charter PDF, `scripts/merge_citizens_charter.py` ingests it
- [ ] **Service category index** — `src/data/service_categories.json`
- [ ] **Hotlines** — `src/data/philippines_hotlines.json`, add Liliw's local
      emergency numbers
- [ ] **About** — `src/data/about/history.json` and `highlights.json`
- [ ] Run `npm run merge:services` after edits (requires Python 3)

---

## Phase 4 — Transparency and statistics

- [ ] **Statistics** — `src/data/statistics/population.json`, `cmci.json`,
      `ari.json` with Liliw's PSA figures
- [ ] **Budget / SRE** — `src/data/transparency/sre.json`, `budgetData.ts`
- [ ] **Procurement** — confirm `transparency.procurement.organizationName`
      (`MUNICIPALITY OF LILIW`) matches how PhilGEPS spells it, or the feed
      returns nothing
- [ ] **Infrastructure** — confirm the DPWH search string `Liliw` returns Liliw
      projects
- [ ] Decide on the **tourism module** — currently off in `features`. Liliw's
      footwear trade is an obvious draw if you want to turn it on; the template
      ships `src/data/tourism/` to populate

---

## Phase 5 — Infrastructure

Everything here costs money or needs an account; none of it blocks local work.

- [ ] **Register a domain.** `betterliliw.org` is a placeholder in config and is
      **not registered**. Update `portal.domain`, `portal.baseUrl`, and
      `lgu.officialWebsite` once real
- [ ] **`wrangler.jsonc`** ⚠️ still carries the upstream template's values:
      project `betterlb`, D1 database `betterlb-openlgu`, and its `database_id`.
      These belong to BetterLosBanos. Replace all three before any deploy attempt
- [ ] **Cloudflare Pages** — create a project for this repo
- [ ] **D1 database** — provision, then `npm run db:migrate:remote`
- [ ] **GitHub secrets** — `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`;
      the Build and Deploy workflow fails on every push without them
- [ ] **MeiliSearch** — set `VITE_MEILISEARCH_API_KEY` in `.env` and in the Pages
      environment. Search is dead until then. See
      `docs/MEILISEARCH_INTEGRATION_GUIDE.md`
- [ ] **`lgu.officialWebsite`** — point at Liliw's actual government site if one
      exists, rather than the portal itself

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

That is expected until Phase 5. It cannot deploy anywhere without those
credentials, which is the safe outcome while `wrangler.jsonc` still names the
upstream project.

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
  render. Los Baños's 14 pass and Liliw's 33 will pass, but a partially
  populated `barangays.json` with fewer than 11 entries fails the suite
- `e2e/test-config.ts` mocks the weather API with Los Baños coordinates. It is
  a fixture, not shipped content, but worth updating for clarity
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
npm run merge:services     # rebuild merged service data (needs python3)
npm run functions:dev      # Cloudflare Pages Functions (fixes /api/* 500s locally)
```

See [README](./README.md#-current-status) for the current status table and
[CONTRIBUTING](./CONTRIBUTING.md) for conventions.
