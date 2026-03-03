# Decent Investing - AI Context

## 1. Project Overview

An interactive educational guide helping people build a strong financial foundation through investing. The site uses interactive calculators, visualizations, and step-by-step content to make investing concepts accessible. It deliberately avoids complex strategies in favor of actionable advice.

- **Target Audience**: General public wanting to start investing safely
- **Tone**: Approachable, accessible, non-condescending. "Decent" as in "good enough for most people."
- **Legal**: Includes prominent disclaimers — this is not professional financial advice. Recommends consulting a lawyer, accountant, or registered financial advisor for specific situations.

## 2. Content Structure

Multi-page guide with 7 chapters (`src/content/guide/*.mdx`):

0. Before You Start — mindset, prerequisites
1. Cash Cushion — emergency funds, savings tiers
2. Tackle Debt — payoff strategies, comparison calculator
3. Investment Accounts — 401k, HSA, IRA, taxable brokerage (tax efficiency order)
4. Investment Choices — index funds, target date funds, fee impact
5. Staying the Course — market psychology, drawdown history
6. Next Steps — further resources

Plus reference pages: glossary, disclaimer.

Content links to external resources (Wikipedia, Vanguard, IRS) for deeper learning.

## 3. Technical Stack

- **Framework**: Astro 5 (static output)
- **UI Islands**: Svelte 5 (`client:load` / `client:visible` for interactive components)
- **Content**: MDX via `@astrojs/mdx` with Astro Content Collections (glob loader)
- **Styling**: Tailwind CSS 3 with custom sage/amber color palette, class-based dark mode
- **Visualizations**: D3 v7 (charts, market drawdowns)
- **Animation**: GSAP (scroll reveals, number animations)
- **Deploy Target**: Cloudflare Pages (static assets via `wrangler.jsonc`)

## 4. Project Structure

```
src/
├── pages/
│   ├── index.astro                    # Homepage with hero + CTA
│   ├── guide/[...slug].astro          # Dynamic route for guide chapters
│   └── reference/                     # Glossary, disclaimer
├── layouts/
│   ├── BaseLayout.astro               # Shell: head, nav, footer, dark mode
│   └── GuideLayout.astro              # Guide chrome: sidebar, progress, ToC, prev/next
├── content/
│   └── guide/*.mdx                    # 7 guide chapters (frontmatter: title, description, order)
├── components/
│   ├── interactive/                   # Svelte calculators (compound, fee, Roth, debt, portfolio, emergency)
│   ├── visualizations/                # D3-powered charts (compounding, fee erosion, allocation pie, drawdowns)
│   ├── navigation/                    # Sidebar, ProgressBar, TableOfContents (all Svelte)
│   ├── content/                       # Callout, Disclosure, ScrollReveal, Tooltip, NumberHighlight, VideoEmbed
│   ├── layout/                        # Hero, Footer (Astro)
│   └── ui/                            # CurrencyInput (Svelte)
├── lib/
│   ├── constants.ts                   # Tax limits, fund examples, guide page manifest
│   └── calculations.ts               # Shared financial math (compound interest, debt payoff, etc.)
├── styles/
│   └── global.css                     # Tailwind layers + dark mode overrides
└── content.config.ts                  # Astro content collection schema
```

Config files at root: `astro.config.mjs`, `tailwind.config.mjs`, `wrangler.jsonc`, `package.json`

## 5. Conventions

- **Colors**: Custom `sage` palette (50–950) and `amber` accents in `tailwind.config.mjs`. Intentionally "approachable, not finance bro."
- **Dark mode**: Class-based (`darkMode: 'class'`). Toggled via JS on `<html>`, persisted to `localStorage`. Init script in `<head>` prevents flash.
- **Component categories**: Interactive calculators go in `components/interactive/`, D3 charts in `components/visualizations/`, reusable content elements in `components/content/`.
- **Svelte hydration**: Use `client:load` for above-fold interactive components, `client:visible` for below-fold to reduce initial JS.
- **Content edits**: Guide chapters in `src/content/guide/*.mdx`. Frontmatter must include `title`, `description`, `order`.
- **Guide page order**: Defined in `src/lib/constants.ts` (`GUIDE_PAGES` array). Must stay in sync with MDX filenames.
- **Financial constants**: IRS contribution limits and fund examples in `src/lib/constants.ts`. Update annually.
- **Import aliases**: `@/` maps to `src/` (configured in Astro).

## 6. Development Commands

```bash
npm run dev       # Astro dev server (localhost:4321)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

## 7. Deployment

Cloudflare Pages with static assets. `wrangler.jsonc` points `assets.directory` to `dist/`. Deploy via `npx wrangler deploy` or git-connected CI.

## Linear

Linear project: **decentinvesting** (team: Joellewis)
