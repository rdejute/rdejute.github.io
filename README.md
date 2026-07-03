# Raina DeJute — Portfolio

A personal portfolio web app for **Raina DeJute** — the Module 16 capstone of the CodeBoxx Full-Stack
Development program. It's a fast, warm, accessible single-page application with a public site (Home,
Portfolio, Links, Contact) and a hidden, authentication-gated admin area for reading and managing
contact messages.

There is **no custom backend server**. The browser talks directly to **Supabase** (Postgres + Auth),
and all data access is governed by Postgres **Row-Level Security**. The app is built with React + Vite,
styled with plain CSS custom properties, and deployed to **GitHub Pages** via GitHub Actions.

🔗 **Live site:** https://rdejute.github.io

---

## Features

- **Four public pages** — Home, Portfolio, Links, Contact — with the URL kept at the root (no router
  library; navigation is driven by application state).
- **Contact form → Supabase** — client-side validated (required fields + email format) and inserted
  into a `messages` table, with clear success/failure feedback.
- **Secret admin area** — a Login page and an auth-gated Back Office, reachable only by URL hash or an
  easter-egg keyboard shortcut (see [Secret routes](#secret-routes)). Neither appears in any nav.
- **Back Office** — lists all messages (newest first), a full-message modal, instant delete, and logout.
- **Security via RLS** — the public may only *insert* messages; only an authenticated admin may *read*
  or *delete* them. The public/anon key is safe to ship because the database enforces access.
- **Light / dark theme** — a token-driven palette (dark by default) with an animated View Transitions
  "radial wipe" on toggle.
- **English / French** — every user-facing string is translated; a header switcher toggles languages.
- **Considered motion** — scroll reveals, a breathing glow, and micro-interactions, all disabled under
  `prefers-reduced-motion`.
- **Accessible by default** — semantic landmarks, labeled inputs, keyboard support, a focus-trapped
  modal, and `alt` text on every image.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev) (functional components + hooks) |
| Build tool | [Vite 8](https://vite.dev) |
| Language | JavaScript (ES modules, `.jsx` / `.js`) — no TypeScript |
| Styling | Plain CSS + CSS custom properties (design tokens); no CSS framework |
| Backend (BaaS) | [Supabase](https://supabase.com) — Postgres, Auth, Row-Level Security (`@supabase/supabase-js`) |
| Serverless (optional) | Supabase Edge Functions (Deno, `@supabase/server`) for contact-email notifications |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Linting | ESLint 10 (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) |

---

## Project Structure

```text
rdejute.github.io/
├─ .github/workflows/deploy.yml   # CI/CD: build + deploy to GitHub Pages on push to main
├─ ai/                            # Spec-driven docs (ai-spec.md + features/*.feature.md)
├─ docs/                          # Research notes + submission video scripts
├─ public/                        # Static assets served as-is (icons.svg, favicon, resume.pdf)
├─ supabase/                      # schema.sql (table + RLS), config.toml, edge functions
├─ src/
│  ├─ main.jsx                    # App entry; imports the global stylesheets
│  ├─ App.jsx                     # State routing, hash secret routes, auth guard, Konami hook
│  ├─ assets/                     # Images (jpg/png) and audio
│  ├─ components/                 # Header, Footer, Nav, cards, forms, modal, motion primitives…
│  ├─ context/                    # ThemeContext, LanguageContext, AuthContext
│  ├─ data/                       # skills.js, portfolio.js, links.js (content as arrays)
│  ├─ hooks/                      # useKonamiCode, useReveal, useScrollFill, useMagnetic, useTilt…
│  ├─ i18n/                       # en.json, fr.json (all translated strings)
│  ├─ layouts/                    # Main.jsx (header + <main> + footer shell)
│  ├─ lib/                        # supabaseClient.js (single client), konamiAudio.js
│  ├─ pages/                      # Home, Portfolio, Links, Contact, Login, BackOffice
│  └─ styles/                     # tokens.css, global.css, effects.css, motion.css
├─ index.html                     # Sets data-theme="dark" (default theme, no flash)
├─ vite.config.js                 # base: '/'
├─ CONCEPTS.md                    # Deep-dive on the three hardest concepts
└─ package.json
```

---

## Installation / Setup

### Prerequisites

- **Node.js 18+** (CI builds on Node 20) and **npm**
- A **Supabase** project (free tier is fine) if you want the contact form, login, and Back Office to work

### 1. Clone and install

```bash
git clone https://github.com/rdejute/rdejute.github.io.git
cd rdejute.github.io
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)). `.env`
is git-ignored and must never be committed.

```bash
# .env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-OR-ANON-KEY
```

> The app fails **gracefully** if these are missing — it won't crash; the contact form and login simply
> render a disabled/warning state and a console warning is logged.

### 3. Set up the database (Supabase)

In the Supabase dashboard → **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates
the `messages` table and its Row-Level Security policies. Then:

- Enable the **Email/Password** auth provider (Authentication → Providers).
- Create the single **admin user** manually (Authentication → Users). There is no in-app sign-up.

### 4. Run

```bash
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run lint       # run ESLint
```

---

## Environment Variables

Only variables prefixed with **`VITE_`** are exposed to the browser by Vite. **Only the public
anon/publishable key is ever used client-side** — the Supabase `service_role` / secret key must never
appear in this codebase or in any `VITE_` variable.

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL (`https://<ref>.supabase.co`). |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes\* | Supabase public API key (new "publishable" key). |
| `VITE_SUPABASE_ANON_KEY` | Yes\* | Legacy name for the public key. Used as a fallback if the publishable var is absent. |

\* Provide **one** of the two keys — the client reads `VITE_SUPABASE_PUBLISHABLE_KEY` first and falls
back to `VITE_SUPABASE_ANON_KEY` (see [`src/lib/supabaseClient.js`](src/lib/supabaseClient.js)).

**For deployment**, add the same values as **GitHub Actions secrets**
(Settings → Secrets and variables → Actions); the workflow injects them into the build.

**Optional — Edge Function secrets** (only if you enable the `notify-contact` email function). These are
set with `supabase secrets set` and live **server-side only**, never in the client bundle:
`RESEND_API_KEY`, `CONTACT_NOTIFY_TO`, `CONTACT_NOTIFY_FROM`, `CONTACT_WEBHOOK_SECRET`.

---

## API Documentation

This app has no REST API of its own — it uses **Supabase** as its data and auth layer directly from the
client, secured by Row-Level Security. The single Supabase client is created once in
[`src/lib/supabaseClient.js`](src/lib/supabaseClient.js) and imported everywhere.

### Data model — `messages` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `name` | `text` | Not null |
| `email` | `text` | Not null |
| `message` | `text` | Not null |
| `created_at` | `timestamptz` | Default `now()` |

### Access control (Row-Level Security)

| Role | INSERT | SELECT | DELETE |
|---|:---:|:---:|:---:|
| `anon` (public visitor) | ✅ | ❌ | ❌ |
| `authenticated` (admin) | ✅ | ✅ | ✅ |

Policies are defined in [`supabase/schema.sql`](supabase/schema.sql). This is the real security
boundary: a visitor can submit a message but can never read the inbox, even though the anon key is
public.

### Client operations

| Operation | Supabase call | Auth | Source |
|---|---|---|---|
| Submit a contact message | `supabase.from('messages').insert({ name, email, message })` | Public | [`ContactForm.jsx`](src/components/ContactForm.jsx) |
| List all messages (newest first) | `supabase.from('messages').select('*').order('created_at', { ascending: false })` | Admin | [`BackOffice.jsx`](src/pages/BackOffice.jsx) |
| Delete a message | `supabase.from('messages').delete().eq('id', id)` | Admin | [`BackOffice.jsx`](src/pages/BackOffice.jsx) |
| Log in | `supabase.auth.signInWithPassword({ email, password })` | — | [`AuthContext.jsx`](src/context/AuthContext.jsx) |
| Log out | `supabase.auth.signOut()` | Admin | [`AuthContext.jsx`](src/context/AuthContext.jsx) |
| Read current session | `supabase.auth.getSession()` | — | [`AuthContext.jsx`](src/context/AuthContext.jsx) |
| Subscribe to auth changes | `supabase.auth.onAuthStateChange(cb)` | — | [`AuthContext.jsx`](src/context/AuthContext.jsx) |

### Optional — `notify-contact` Edge Function

[`supabase/functions/notify-contact`](supabase/functions/notify-contact) is a Deno function that can be
wired to a Supabase **Database Webhook** on `messages` INSERT. It verifies a shared secret header and
sends an email via [Resend](https://resend.com) so new contact messages land in an inbox. It's
optional — the contact form works without it.

---

## Secret routes

The public URL always stays at the root. The two secret views are reached without appearing in any
navigation:

- **Login** — visit `#login`, **or** enter the **Konami Code** anywhere: `↑ ↑ ↓ ↓ ← → ← → B A`
  (there's a themed audio surprise when you do 🎮).
- **Back Office** — `#backoffice`; renders only with a valid session, otherwise redirects to Login.

---

## Deployment

Deployment is automatic via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Push to `main`.
2. GitHub Actions runs `npm ci` → `npm run build` and publishes `dist/` to GitHub Pages.
3. In the repo settings, **Pages → Source** is set to **GitHub Actions**, and the `VITE_*` secrets are
   configured under **Actions secrets**.

`vite.config.js` sets `base: '/'` for a root-domain (`username.github.io`) deployment.

---

## Accessibility, theming & i18n

- **Theme:** all colors are CSS custom properties in [`src/styles/tokens.css`](src/styles/tokens.css),
  defined for both light and dark; flipping `data-theme` on `<html>` re-skins the entire site.
- **i18n:** strings live in [`en.json`](src/i18n/en.json) / [`fr.json`](src/i18n/fr.json) and resolve
  through a `t('dotted.key')` helper — no hardcoded copy in components.
- **Motion & a11y:** every animation is gated behind `prefers-reduced-motion`; the message modal traps
  focus and returns it on close; images have `alt` text and inputs have `<label>`s.

---

## Roadmap

- Persist the user's theme and language choice in `localStorage`, and default the theme from the OS
  `prefers-color-scheme` on first visit.
- Continue documenting AI-asset provenance in [`docs/Research.md`](docs/Research.md).

---

## Author

**Raina DeJute**

- 🌐 Portfolio: https://rdejute.github.io
- 💼 LinkedIn: https://www.linkedin.com/in/rainadejute
- 💻 GitHub: [@rdejute](https://github.com/rdejute)
- ▶️ YouTube: [@RainaDeJute](https://www.youtube.com/@RainaDeJute)
- ✉️ Email: rainadejute@gmail.com

---

## Acknowledgments

Built as the Module 16 capstone for the **[CodeBoxx](https://www.codeboxx.com) Full-Stack Development
program** — an intensive, project-driven curriculum. AI tools were used for select images and as a
spec-driven coding collaborator; asset provenance is tracked in
[`docs/Research.md`](docs/Research.md).

---

## License

This is a personal portfolio project. The code is shared for review and learning; the personal content,
copy, and images (including AI-generated likenesses) are © Raina DeJute and not licensed for reuse.
