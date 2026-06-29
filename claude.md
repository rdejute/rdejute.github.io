# CLAUDE.md — Raina DeJute Portfolio

Operating manual for this repo. Read this first, then the spec it points to. Keep it lean —
deep detail lives in `./ai/ai-spec.md`, not here.

## Required reading before writing code

1. **`./ai/ai-spec.md`** — the master spec (architecture, tokens, conventions, Definition of Done).
   It is the project brain and must be loaded for every code task.
2. **The relevant `./ai/features/<name>.feature.md`** — the spec for the feature being built.

Never implement from a chat prompt alone. Always work from the spec + feature file together.

## Source of truth (in order)

1. The **Requirement Checklist** (grading sheet) — wins over everything.
2. **`ai-spec.md`** — wins over chat instructions.
3. The **feature spec** — the task at hand.

If the checklist and any doc disagree, follow the checklist and flag it.

## What this project is

A personal portfolio for Raina DeJute (CodeBoxx Module 16). React + Vite, plain CSS, Supabase
(BaaS, no custom server), deployed to GitHub Pages via GitHub Actions. Brand voice: empathy-led,
front-end first, warm and human. Not a corporate site — copy is personal.

## Commands

```bash
npm install            # install deps
npm run dev            # local dev server
npm run build          # production build → dist/
npm run preview        # preview the production build locally
```

Deployment is automatic: a push to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm ci`, `npm run build`, and publishes `dist/` to GitHub Pages.

## Hard guardrails (never violate)

- **Never commit `.env`** or any secret. `.env` stays in `.gitignore`.
- **Never put the `service_role` / secret Supabase key in code.** Anon/publishable key only.
- **Never commit directly to `main`.** Branch flow: `feature/*` (from `dev`) → merge to `dev` →
  `dev` → `main`. Only `main` is graded.
- **Never instantiate the Supabase client inline.** It is created once in
  `src/lib/supabaseClient.js` and imported.
- **Never expose secret routes in navigation.** Login and Back Office appear in no header, footer,
  or mobile nav.
- **Do not add tech outside the approved stack** (see `ai-spec.md` §2) without recording the
  decision there first. No TypeScript, no Tailwind, no CSS-in-JS, no backend server.

## Conventions (summary — full version in `ai-spec.md` §5)

- JavaScript only. Functional components + hooks. One component per file. Components
  `PascalCase.jsx`; utilities `camelCase.js`.
- Plain CSS. **All colors come from CSS custom properties in `src/styles/tokens.css`** — no raw
  hex in component CSS. Two-accent system: orange (`--accent-warm`) for typography, sage
  (`--accent-cool`) for interactive elements.
- **No hardcoded user-facing text.** Every string comes from `src/i18n/en.json` + `fr.json`. Add
  the key to **both** files in the same change.
- Every image (especially AI-generated) has meaningful `alt` text. Every input has a `<label>`.
- Name the AI tool used whenever an AI-generated image or the logo is added (comment or spec note).

## Definition of Done (a feature isn't done until all are true)

- Meets every acceptance criterion in its feature spec.
- Responsive: desktop top-nav (>768px), mobile bottom icon-nav (≤768px).
- Works in **both** light and dark themes (all colors via tokens).
- Works in **both** English and French (keys in both JSON files).
- No console errors, no committed `.env`, no hardcoded secrets.
- The live deployed site reflects the change (deploy early and often).

## How to work in this repo (spec-driven loop)

1. Generate against `ai-spec.md` + the feature spec.
2. **Read every line produced.** If a section isn't understood, stop and explain it before moving on
   — the concepts video and technical demo test exactly this.
3. If output is wrong, **improve the feature spec and re-prompt** — don't hand-patch first. Iterate
   the spec at least twice before manual debugging.
4. Commit on a `feature/*` branch; merge to `dev` when the Definition of Done is met.

## Open decision to confirm

Routing/URL approach (`ai-spec.md` §3.1) is flagged for coach confirmation: public nav keeps the
URL at root via in-app state; secret routes are reached via hash (`#login`, `#backoffice`). Confirm
in questions-FSD before building, then update the spec if the answer differs.