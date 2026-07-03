# AI Specification — Raina DeJute Portfolio

> **Master project document. Read this first, in full, before implementing any feature.**
> Every AI prompt that generates or modifies code must include this file *plus* the relevant
> `./ai/features/*.feature.md`. This file is the global context (the "project brain"); the
> feature spec is the specific task. Neither is used alone.

---

## 1. Project Identity & Scope

**What this is:** A personal portfolio website for Raina DeJute — the Module 16 capstone of the
CodeBoxx Full-Stack Development program. There is no fictional client. Raina is the client. Every
design and content decision serves her professional brand.

**Brand voice:** Empathy-led, front-end first. The tone is warm, human, and grounded — it reflects
a developer who came from human services (peer support, recovery, guiding people through hard
transitions) and brings that same care to interfaces. Copy is personal and confident, never
corporate-generic. Signature line: *"Empathy is my framework."*

**In scope:**
- Six views: Home, Portfolio, Links, Contact, Login (secret), Back Office (secret).
- Contact form persisted to Supabase; admin-only Back Office to read/delete messages.
- Static SPA built with React + Vite, deployed to GitHub Pages via GitHub Actions.
- Two extra miles, built in from the start: light/dark theme and English/French i18n.

**Out of scope (do not build):**
- Any custom backend server. Supabase is the only backend infrastructure.
- Server-side rendering. The site is client-side only.
- Public user registration or sign-up. The single admin user is created manually in Supabase.
- Any feature not traceable to the Requirement Checklist.

> The **Requirement Checklist is the single source of truth for grading.** Where this document and
> the checklist ever disagree, the checklist wins.

---

## 2. Tech Stack & Allowed Tools

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 (functional components + hooks only) | No class components. |
| Build | Vite | `npm create vite@latest`, React + **JavaScript** variant. |
| Language | JavaScript (`.jsx` / `.js`) | No TypeScript. |
| Styling | Plain CSS files + CSS custom properties | No Tailwind, no CSS-in-JS. |
| Backend (BaaS) | Supabase | Postgres + Auth + Row Level Security. |
| Auth | Supabase Auth (`signInWithPassword`) | Single admin user, created in dashboard. |
| Hosting | GitHub Pages | Repo name **must** be `username.github.io`. |
| CI/CD | GitHub Actions | `.github/workflows/deploy.yml`. |

Nothing outside this table is "allowed tech" without a deliberate decision recorded here first.

---

## 3. Architecture & Repository Structure

```
username.github.io/
├─ .github/workflows/deploy.yml      # CI/CD → GitHub Pages
├─ ai/
│  ├─ ai-spec.md                     # THIS FILE
│  └─ features/                      # one spec per feature (see §8)
├─ docs/                             # pitch script-1.md, script-2.md, pitch-feedback.md
├─ LeetCode-Challenges/             # <challenge-name>.png screenshots
├─ public/
│  ├─ logo.svg                       # AI-generated personal logo
│  ├─ resume.pdf                     # downloadable CV
│  └─ images/                        # AI-generated images
├─ src/
│  ├─ main.jsx                       # app entry
│  ├─ App.jsx                        # view switching + theme/lang providers
│  ├─ lib/
│  │  └─ supabaseClient.js           # the ONLY place the Supabase client is created
│  ├─ layouts/
│  │  └─ Main.jsx                    # header + <main> + footer wrapper
│  ├─ components/                    # Header, Footer, Logo, ThemeToggle, LanguageSwitcher, cards…
│  ├─ pages/                         # Home, Portfolio, Links, Contact, Login, BackOffice
│  ├─ context/                       # ThemeContext.jsx, LanguageContext.jsx
│  ├─ i18n/                          # en.json, fr.json
│  └─ styles/
│     ├─ tokens.css                  # CSS custom properties — colors, type, spacing (both themes)
│     └─ global.css                  # resets + base element styling
├─ .env                              # GITIGNORED — never committed
├─ .gitignore
├─ vite.config.js                    # base: '/'
├─ CONCEPTS.md
├─ README.md
└─ index.html
```

**Data flow:** Browser (React) → Supabase JS client → Supabase Postgres. No server in between;
access is governed entirely by Supabase Row Level Security policies.

### 3.1 Routing decision ⚠️ (confirm with a coach)

The docs conflict here. The Requirement Checklist states the URL **must stay at
`https://username.github.io` with no `/home`, `/portfolio`, etc.**, while the platform notes
suggest HashRouter. These can't both be taken literally.

**Resolved approach:** The four public views (Home, Portfolio, Links, Contact) are switched by
**in-app state**, so normal navigation never changes the URL — it stays at the root, satisfying the
checklist. The two secret views are reached without appearing in any nav:
- **Login** — on load, the app reads `window.location.hash`; `#login` renders the login view. A
  secret keyboard shortcut also opens it. (Checklist: "manually typing the URL OR secret keyboard
  keydown.")
- **Back Office** — reached at `#backoffice`; renders only when an authenticated session exists,
  otherwise redirects to login. This is the GitHub-Pages-safe equivalent of typing `/backoffice`.

This keeps the public URL clean *and* keeps the secret routes typeable/deep-linkable on a static
host. **Because the source docs conflict, confirm this interpretation in the questions-FSD channel
before building.** If a coach prefers literal HashRouter, only this section changes.

---

## 4. Environment & Secrets

- All client-readable env vars use the **`VITE_`** prefix (Vite only exposes those to the browser).
- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `.env` is listed in `.gitignore` and is **never committed**.
- For deployment, the same values are stored as GitHub repo secrets
  (Settings → Secrets and variables → Actions) and passed to the build step via `env:` in the
  workflow.
- Only the **anon/publishable** key is ever used client-side. The `service_role` / secret key must
  never appear anywhere in the codebase.
- Provide a sensible **fallback** when Supabase env vars are missing (e.g. a clear console warning
  and a disabled form state) rather than a hard crash.

---

## 5. Coding Standards & Conventions

**Components**
- Functional components with hooks only; one component per file.
- Component files: `PascalCase.jsx` (`Header.jsx`). Utilities/hooks: `camelCase.js`.
- Keep components small and single-purpose; lift shared state into context (`Theme`, `Language`).

**Supabase**
- The client is created **once**, in `src/lib/supabaseClient.js`, and imported everywhere else.
  Never instantiate it inline in a component.

**CSS (plain files + custom properties)**
- All theme-dependent colors come from CSS custom properties defined in `tokens.css`. **No raw hex
  values in component CSS** — reference the tokens (see §6).
- Class naming is consistent and readable (e.g. `card`, `card__title`, `card--featured`). Pick one
  convention and hold it.
- Mobile-first; respect the responsive rules in §7.

**Internationalization**
- **No hardcoded user-facing strings.** Every label, heading, paragraph, button, and placeholder is
  pulled from `en.json` / `fr.json` via the language context. Add the key to *both* files in the
  same change.

**Accessibility**
- Every image has meaningful `alt` text — especially the AI-generated ones.
- All form inputs have associated `<label>`s.
- Interactive elements are keyboard-reachable; the logo and nav work with keyboard and screen
  readers.

**AI-generated assets**
- Wherever an AI-generated image or the logo is used, leave a brief comment (or a line in a
  `Research.md` / the feature spec) naming the tool used. This is a graded requirement.

**General**
- No secrets, keys, or credentials committed in source.
- Prefer clarity over cleverness — this is a portfolio; the code is part of the presentation.

---

## 6. Brand & Design Tokens

The palette is warm and earthy with a **two-accent system**, where **sage** is the cool, focal accent
for interactive elements (buttons, links, active nav, focus rings, the status dot) and a **warm
accent** carries typographic moments (eyebrow text, italic taglines). The warm accent shifts per
theme: a soft **amber/orange** on the espresso dark theme, a **burnt orange** on the light theme —
same warm family, tuned for contrast on each background. **The light theme uses no white or
off-white**: it is built on **light sage** (`--bg`/`--surface`/`--surface-alt`) for a calm, colored
base, with **brown, gold, and burnt-orange** as the warm accents that carry the pop. Interactive
elements use a **deeper sage** so they read as the focal lead against the lighter sage base; in dark
mode sage reads as the cool counterpoint to the amber. Keep sage genuinely muted; never let it drift
toward a saturated green. Accents live mostly in outlines, small details, and `:hover` states; solid
fills are reserved for primary actions and hover.

These values are the contract. Define them in `tokens.css` for **both** themes and reference them
everywhere.

```css
:root {                      /* LIGHT theme (NO white): warm earthy SAGE base + brown/beige/orange accents */
  --bg:            #CAC6A0;   /* dusty, warm sage (olive-leaning, muted — not mint) */
  --surface:       #D9D5B2;   /* lighter dusty sage — header, footer, raised surfaces */
  --surface-alt:   #B8B389;   /* deeper dusty olive-sage — bands / hero strips */
  --text:          #2A1F11;
  --text-muted:    #665936;   /* warm brown */
  --border:        rgba(42, 31, 17, 0.18);

  --accent-warm:        #BE571F;   /* burnt orange — typographic accent */
  --accent-warm-soft:   #D8983B;   /* gold */
  --accent-cool:        #5E6C3A;   /* warm olive-sage — active nav, focus, icons */
  --accent-cool-soft:   #899467;
  --accent-cool-deep:   #414B27;   /* deep olive-sage text/links (readable on the sage base) */
  --accent-cool-tint:   rgba(94, 108, 58, 0.22);

  /* Earthy interactive layer (so light isn't monochrome green): brown buttons,
     terracotta hover glow, beige hover wash. Dark keeps sage for all of these. */
  --focal-accent:          #B0632C;                  /* warm ochre-brown — hover glows / borders */
  --earth-tint:            rgba(120, 82, 45, 0.16);  /* beige-brown hover wash */
  --btn-primary-bg:        #6E4A2C;                  /* earthy brown */
  --btn-primary-bg-hover:  #855D39;
  --btn-primary-fg:        #EFE8D6;                  /* warm cream (foreground only) */

  --font-display: "Space Grotesk", system-ui, sans-serif;  /* headings / name */
  --font-serif:   "Newsreader", Georgia, serif;            /* italic taglines, pull quotes */
  --font-body:    "Inter", system-ui, sans-serif;          /* body copy */
  --font-mono:    "JetBrains Mono", monospace;             /* code / labels */

  --radius-md: 8px;
  --radius-lg: 14px;
  --space:     8px;   /* base spacing unit; multiply for rhythm */
}

[data-theme="dark"] {        /* DARK theme (espresso) — Raina's signature look */
  --bg:            #211711;
  --surface:       #2E2015;
  --surface-alt:   #3A2A1C;
  --text:          #EDE6D8;
  --text-muted:    #9A8D7A;
  --border:        rgba(255, 255, 255, 0.08);

  --accent-warm:        #D98C5F;
  --accent-warm-soft:   #E0A079;
  --accent-cool:        #9DB495;   /* sage reads lighter on dark */
  --accent-cool-soft:   #C4D6BD;
  --accent-cool-deep:   #C4D6BD;   /* sage text on a sage tint (light, for dark bg) */
  --accent-cool-tint:   rgba(157, 180, 149, 0.16);
}
```

- Theme is applied via `data-theme` on the root element; default resolves from
  `prefers-color-scheme` and is then persisted in `localStorage` (details in the light/dark feature
  spec).
- Fonts above are a recommended pairing, not a hard requirement — keep the *roles* (strong display
  sans, serif italic accent, clean body, mono for labels) even if specific families change.

---

## 7. Global Responsive Rules

- **Desktop (> 768px):** primary navigation is horizontal, at the top of the header.
- **Mobile (≤ 768px):** navigation collapses to icons displayed along the **bottom** of the screen.
- Logo scales and never overflows.
- Text is readable with no horizontal scrolling; images scale down; sections stack vertically.
- No content overflows the viewport at any width.
- The header is sticky/fixed and consistent across every page; the footer appears on every page
  (contact info, social links, copyright).
- Secret routes (Login, Back Office) appear in **no** navigation — not header, not footer, not the
  mobile bottom bar.

---

## 8. Feature Map

Each feature gets its own `./ai/features/<name>.feature.md`, used together with this file.

| Feature | Spec file | Notes |
|---|---|---|
| Setup & Deploy | `setup-deploy.feature.md` | Vite, Actions, Pages, Supabase, env, RLS. |
| Project Layout | `header-footer.feature.md` | Main layout, header, footer, logo, responsive nav. |
| Home page | `home-page.feature.md` | Intro, technical skills, soft skills, AI images. |
| Portfolio page | `portfolio-page.feature.md` | Education, work, projects, CV download, AI images. |
| Links page | `link-page.feature.md` | ≥3 link cards (image + title + description + URL). |
| Contact page | `contact-page.feature.md` | Form, validation, Supabase insert, feedback. |
| Login page | `login-page.feature.md` | Secret route, Supabase auth, success/failure. |
| Back Office | `back-office.feature.md` | Auth-gated table, view modal, delete, logout. |
| Light/Dark (extra) | `light-dark-mode.feature.md` | Token-driven, OS default, persisted. |
| Languages (extra) | `languages.feature.md` | EN/FR, switcher, JSON, persisted. |

---

## 9. Database & Security (Supabase)

- Table: **`messages`** — columns include `name`, `email`, `message`, `created_at`.
  *(Use `messages`, per the checklist — not `contact_messages`.)*
- **RLS policies:** public users may **INSERT** only. Public users may **not** `SELECT`.
  Reading messages requires an authenticated session (the Back Office).
- Admin user is created manually in the Supabase dashboard (no in-app registration):
  - email: `admin@codeboxx.com`
  - password: `C0deB0xx4dm!n`
- Validate all user input before sending it to Supabase.

---

## 10. Global Definition of Done

A feature is **not done** until all of these are true:

1. It satisfies every acceptance criterion in its own feature spec.
2. It is fully responsive per §7 (correct desktop top-nav and mobile bottom-nav behavior).
3. It works in **both** light and dark themes (all colors via tokens — no hardcoded hex).
4. All user-facing text works in **both** English and French (keys present in both JSON files).
5. Images have `alt` text; inputs have labels; it is keyboard-accessible.
6. No console errors, no committed `.env`, no `service_role` key anywhere, no hardcoded secrets.
7. The live deployed site reflects the feature (deploy early and often; never discover a build
   failure on submission day).

---

## 11. Cross-Feature Workflow Rules

These govern *how* features get built and are themselves part of the program's assessment.

- **Spec-first.** Prompt the AI with this file + the feature spec. If output is wrong or incomplete,
  **improve the feature spec and re-prompt** rather than hand-patching the code. Iterate the spec at
  least twice before resorting to manual debugging.
- **Read every line the AI generates.** If you hit a section you don't understand, stop and
  understand it before moving on. You must be able to explain it — `CONCEPTS.md`, the concepts
  video, and the technical demo all test exactly this.
- **Branch discipline.** One branch per feature (`feature/*`), created from `dev`, merged back into
  `dev`. At the end, `dev → main`. Never commit directly to `main`. Only `main` is graded.
- **Communicate.** ≥2 progress updates per week, ≥1 project review before Friday, responses to
  coaches within 24 hours. Missing these can fail the module regardless of code quality.
- **The checklist is the source of truth.** Re-read it regularly; verify each requirement against it
  before calling anything done.