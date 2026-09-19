# Guidelines for coding agents

BetterLiliw is the community portal for the Municipality of Liliw, Laguna: a
Vite + React + TypeScript app on Tailwind v4, deployed to Cloudflare Pages
with Functions and D1. Read `ARCHITECTURE.md` for the map and `PHASES.md` for
what is done and what is still the template's data.

## Tsinelas, the design system

Every screen uses **Tsinelas** (`src/styles/tsinelas.css`): IBM Carbon's
architecture on the BetterLiliw brand. Reference pages run at
`/dev/design-system` and `/dev/components`; check them before inventing.

- **Tokens, not raw values.** Colors are `*-tsinelas-<role>` (`text-primary`,
  `text-secondary`, `layer-01`, `border-subtle-00`, `link-primary`, …), never
  Tailwind palette colors or hex. Spacing between components and sections is
  the layout scale (`py-tsinelas-layout-03`), inside components the spacing
  scale (`p-tsinelas-05`, `gap-tsinelas-03`), control heights the container
  scale (`h-tsinelas-container-03` = 40px).
- **Type via the type classes.** Page title `tsinelas-heading-xl` (32px),
  section `tsinelas-heading-lg` (24px), card `tsinelas-heading-md` (18px),
  body `tsinelas-body-01`/`-02`, all-caps micro labels only via
  `tsinelas-eyebrow`. Sentence case everywhere; no `uppercase tracking-widest`,
  no `font-black`/`font-extrabold`, no emoji in UI copy.
- **Flat and square.** Radius and shadow tokens are zeroed. Do not add
  `rounded-*` (except `rounded-full` on tags, toggles and avatars) or
  `shadow-*` (except the overlay shadow that floating menus already use).
  Regions are separated by 1px `border-subtle` rules and layer tints.
- **Dark surfaces use the inverse tokens.** On navy (`background-brand`):
  `text-inverse`, `text-inverse-subtle`, `link-inverse`,
  `support-*-inverse`, and a `focus-inverse` ring. The default navy focus ring
  and `text-secondary` are invisible there.
- **The page container owns the margin.** `container` already centers, caps
  and pads (12px on phones, 16px from `sm`). Never add `px-*` or `mx-auto`
  beside it, and don't nest padded wrappers.
- **Focus is visible.** Interactive elements get `tsinelas-focus` (or the
  inverse ring on dark surfaces). Icon-only controls carry `aria-label`.

## Controls come from `src/components/ui`

Use the shared components; do not restyle raw elements.

| Need                             | Use                                                   |
| -------------------------------- | ----------------------------------------------------- |
| Action                           | `Button` (`primary`, `secondary`, `tertiary`, `ghost`, `accent` once per screen, `iconOnly`) |
| Single-line text                 | `Input` + `Label`                                     |
| Multi-line text                  | `Textarea`                                            |
| **Pick one option**              | **`Dropdown`** — never a native `<select>`            |
| Pick several / filter a long list| `SelectPicker`                                        |
| Menu of actions                  | `@radix-ui/react-dropdown-menu` styled like the navbar's language menu |
| Status message                   | `Banner`                                              |
| Tag                              | `Badge`                                               |
| Content tile                     | `Card` and its parts                                  |
| Empty / loading                  | `EmptyState`, `Skeletons`                             |

Native `<select>` renders differently on every phone and cannot take the
field styling, focus ring or menu anatomy — that is why `Dropdown` exists.
If a control is missing, add it to `src/components/ui` on the Input/menu
recipes and document it on `/dev/components` before using it in a page.

## Layout

Pages compose the shared shells: `PageHeader` / `SectionBlock`
(`UnifiedLayouts.tsx`), `ModuleHeader` / `DetailSection` (`PageLayouts.tsx`),
`SidebarLayout` for module hubs. Give them the content; don't re-implement
their spacing on the page.

## Working here

- `npm run lint` (zero warnings), `npx tsc --noEmit -p .` and `npx vitest run`
  must pass. Prettier runs in CI; on Windows ignore the CRLF warnings.
- Functions live in `functions/api`; validate input, rate-limit public
  endpoints (`utils/rate-limit.ts`), never leak upstream error bodies, and
  read secrets from `env` (document new ones in `.dev.vars.example`).
- The user-facing side must work for residents without a GitHub account:
  forms post to our own API, with an email fallback.
- Commit messages: conventional prefix (`feat(scope):`, `fix:`, `refactor:`),
  body explains why. **No AI attribution trailers** (`Co-Authored-By:
  Claude…`, `Generated with…`) on commits or PRs.
- Keep `PHASES.md` current when you finish or discover work.
