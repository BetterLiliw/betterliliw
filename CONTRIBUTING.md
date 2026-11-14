# Contributing to BetterLiliw

Thank you for your interest in contributing! We welcome developers, designers, writers, and anyone passionate about better government transparency.

BetterLiliw is the community-run portal for the **Municipality of Liliw, Laguna**.
It is built from the [BetterLB](https://github.com/BetterLosBanos/betterlb)
template and is still being customised, so you do not need to write code to help.

### Where help is most needed

BetterLiliw's core Liliw data is now in place — including all 33 barangays (`src/data/directory/barangays.json`), municipal departments and executive/legislative officials (`src/data/directory/`), Citizens Charter & municipal services (`src/data/services/`, `src/data/citizens-charter/`), local emergency hotlines (`src/data/philippines_hotlines.json`), Liliw history (`src/data/about/`), official PSA population census records (`src/data/statistics/population.json`), and bilingual copy/branding (`public/locales/`, `public/logos/`).

Ongoing community contributions are most valuable for:

- **Service verification** — keeping municipal Citizens Charter fees, processing times, and office hours verified (`src/data/citizens-charter/`, `src/data/services/`)
- **Barangay-level contacts & programs** — enriching barangay captain rosters, SK chairs, and health center schedules across all 33 barangays
- **Financial & CMCI datasets** — importing full multi-quarter BLGF eSRE spreadsheets (`src/data/transparency/sre.json`, `src/data/statistics/ari.json`) and historical CMCI indicator tables (`src/data/statistics/cmci.json`)
- **Ordinances & resolutions** — adding verified Sangguniang Bayan records to OpenLGU

See the Current Status table in the [README](./README.md#-current-status) for details. Data contributions do not
require any JavaScript — they are JSON files, and an issue with a source link is
just as welcome as a pull request.

---

## Quick Start

1. **Fork and Clone**
   ```bash
   git clone https://github.com/<your-username>/betterliliw
   cd betterliliw
   npm install
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow the code patterns below
   - Test your changes
   - Commit with conventional commits

4. **Submit Pull Request**
   - Target the `main` branch
   - Describe your changes clearly
   - Link related issues

---

## Code Conventions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <short description>

Types:
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Code style (no logic change)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Maintenance tasks

Examples:
feat(services): add search filter by category
fix(navbar): correct mobile menu toggle
docs: update setup instructions
```

### Code Style

- **Prettier** auto-formats on commit (via Husky)
- **ESLint** enforces rules (max warnings = 0)
- **TypeScript** strict mode enabled

### Design System (Kapwa)

**Always use semantic tokens, never raw colors:**

```tsx
// ✅ Correct
<div className="bg-kapwa-surface text-kapwa-text-strong">

// ❌ Wrong
<div className="bg-blue-500 text-white">
```

### Component Guidelines

- **Keep components under 200 lines** - split if larger
- **Extract complex logic to hooks** - keeps components clean
- **Use barrel exports** - `index.ts` in component folders
- **Document exports** - JSDoc comments on public APIs

```tsx
// src/components/example/index.ts
export { Example } from './Example';
export type { ExampleProps };
```

---

## Development Workflow

### Setup

```bash
# Use correct Node version
nvm use  # or fnm use

# Install dependencies
npm install

# Prepare data files
npm run merge:services

# Start dev server
npm run dev
```

### Testing

```bash
# Run E2E tests
npm run test:e2e

# Run specific test file
npx playwright test services.spec.ts

# Run with debug mode
npx playwright test --debug

# Check linting
npm run lint

# Format code
npm run format
```

**Note:** E2E tests use Playwright with shared utilities in `e2e/utils/` for common testing patterns like semantic token validation.

### Pre-commit Hooks

Husky runs automatically:
- **Prettier** formats code
- **ESLint** checks quality
- **Kapwa token check** prevents raw colors in component files

### Testing Utilities

The project includes shared E2E testing utilities in `e2e/utils/`:

- **`kapwa.ts`** - Semantic token validation helper that enforces Kapwa design token usage
  - `assertKapwaTokens()` - Validates no raw Tailwind colors are used
  - Automatically excludes code examples from validation

These utilities help maintain design system consistency across the application.

---

## Project Patterns

### Data Fetching

```tsx
// Static data - direct import
import services from '@/data/services.json';

// Dynamic data - API endpoint
const response = await fetch('/api/legislation/documents');
```

### Custom Hooks

```tsx
// Extract complex logic to hooks
function useServiceData(slug: string) {
  const [data, setData] = useState(null);
  // ... logic
  return { data, loading, error };
}
```

### Page Structure

```tsx
// Standard page pattern
export default function PageName() {
  // 1. Hooks first
  const { data } = useData();

  // 2. Early returns
  if (!data) return <Loading />;

  // 3. Render
  return (
    <PageLayout>
      <PageHeader>...</PageHeader>
      <Content>...</Content>
    </PageLayout>
  );
}
```

---

## Common Tasks

### Adding a New Service

1. Update service data in `src/data/citizens-charter/`
2. Run `npm run merge:services` (or `python scripts/merge_services.py`)
3. Test the service detail page

### Adding a New Page

1. Create file in `src/pages/your-page/`
2. Add route in `src/App.tsx`
3. Add navigation link if needed
4. Add E2E test in `e2e/`

### Updating LGU Config

Edit `config/lgu.config.json` - changes apply automatically. Note that
`node scripts/setup-lgu.cjs` regenerates this file from scratch, so do not re-run
the wizard to make a small change.

---

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass locally (`npm run test:e2e`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Commits follow conventional format
- [ ] PR description explains changes

### PR Description Template

```markdown
## Summary
Brief description of changes

## Changes
- Change 1
- Change 2

## Testing
- Tested on: [browsers]
- E2E tests: [pass/fail/NA]

## Related Issues
Closes #123
```

---

## Getting Help

- **Issues:** [github.com/BetterLiliw/betterliliw/issues](https://github.com/BetterLiliw/betterliliw/issues)
- **Maintainers:** [@Kiko915](https://github.com/Kiko915), [@johnchristiancoronacion](https://github.com/johnchristiancoronacion)
- **Live Site:** [betterliliw.org](https://betterliliw.org)
- **Template questions:** for issues with the underlying platform rather than Liliw's
  content, see the upstream
  [BetterLB discussions](https://github.com/BetterLosBanos/betterlb/discussions)

---

## License

By contributing, you agree that your code will be released under the [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/) license.

---

**Thank you for contributing to BetterLiliw!** 🇵🇭
