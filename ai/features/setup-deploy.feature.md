# Feature Specification — Setup & Deploy

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/setup-deploy.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Stand up the project's foundation so every later feature has a working, live deploy
pipeline and a configured backend to talk to. By the end of this feature, a near-empty React app is
publicly live at `https://rdejute.github.io`, auto-deploys on push to `main`, and a Supabase
backend (database + auth + admin user) is ready to receive data.

**In scope:**
- Public GitHub repo named `rdejute.github.io`, with all coaches added as collaborators.
- Branch model: `main` / `dev` / `feature/*`.
- React + Vite (JavaScript) scaffold.
- `vite.config.js` with `base: '/'`.
- GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys to GitHub Pages.
- GitHub Pages configured to serve from the Actions deployment.
- Supabase project; client configured at `src/lib/supabaseClient.js`.
- `messages` table with correct schema and RLS policies.
- Supabase Auth (email/password) enabled; admin user created manually.
- Environment variables (`VITE_*`) for local dev and deployment; `.env` gitignored; GitHub secrets;
  workflow passes `VITE_*` to the build via `env:`.
- Graceful fallback when Supabase env vars are missing.

**Out of scope (handled by other feature specs — this feature only creates the plumbing):**
- In-app routing and the "URL stays at root" behavior → `ai-spec.md §3.1` + the Layout feature.
  *(Per the checklist annotation, the routing/URL behavior is not re-specified here; this feature
  only sets `base: '/'`.)*
- The Contact form UI and the INSERT call → Contact page feature.
- The Login UI and `signInWithPassword` → Login page feature.
- The Back Office table, read, and delete → Back Office feature.

---

## 2. Requirements Breakdown

### A. Repository & Branching
- Create a **public** repo named exactly `username.github.io` (use Raina's actual GitHub username).
- Add all coaches as collaborators **immediately** on creation.
- Establish branches:
  - `main` → production-ready; the **only** branch graded.
  - `dev` → integration branch; receives completed features.
  - `feature/*` → one branch per feature, created from `dev`, merged back into `dev`.
- **No direct commits to `main`.**
- Final state at submission: all `feature/*` → `dev`, then `dev` → `main`. Commit history must show
  the `feature → dev → main` flow.

### B. Application Scaffold
- Scaffold with `npm create vite@latest rdejute.github.io`, framework **React**, variant
  **JavaScript**.
- Set `base: '/'` in `vite.config.js` (root-repo deployment).
- Confirm the app loads at `https://rdejute.github.io`.

### C. CI/CD Deployment
- Workflow file exists at `.github/workflows/deploy.yml`.
- Triggers on push to the `main` (default) branch.
- Runs `npm ci`, then `npm run build`, then deploys the `dist/` folder.
- GitHub Pages is configured to serve from the **GitHub Actions** deployment (Settings → Pages →
  Source: GitHub Actions).
- Required `VITE_*` variables are passed to the build step via `env:`.

### D. Supabase Backend
- Create a Supabase project.
- Create the `messages` table (schema in §5).
- Enable Row Level Security and add policies: public may **INSERT** only; **no public SELECT**;
  authenticated users may **SELECT** and **DELETE** (for the Back Office).
- Enable Supabase Auth with the **email/password** provider.
- Create the admin user **manually in the Supabase dashboard** (no in-app registration):
  - email: `admin@codeboxx.com`
  - password: `C0deB0xx4dm!n`
- Configure the client once at `src/lib/supabaseClient.js`; export a single instance.

### E. Environment & Secrets
- Use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon/publishable key only — never the
  `service_role` key).
- `.env` for local dev; `.env` is listed in `.gitignore` and **never committed**.
- Add the same two values as GitHub repo secrets (Settings → Secrets and variables → Actions).
- The deploy workflow injects them at build time via `env:`.
- If the env vars are missing, the client fails gracefully (see §5).

---

## 3. Developer & Runtime Flow

**Build/deploy flow**
```
work on feature/*  →  merge into dev  →  merge dev into main
        └─ push to main triggers deploy.yml
              └─ npm ci → npm run build → publish dist/ to GitHub Pages
                    └─ live at https://rdejute.github.io
```

**Runtime data path** (no server in between)
```
Browser (React) → supabaseClient (anon key) → Supabase Postgres
   • public visitors: INSERT into messages only
   • authenticated admin: SELECT + DELETE (Back Office)
```

---

## 4. Interfaces Involved

This feature creates **no UI**. It produces configuration and infrastructure:

| Interface | Purpose |
|---|---|
| `vite.config.js` | `base: '/'` |
| `.github/workflows/deploy.yml` | build + deploy to Pages |
| `src/lib/supabaseClient.js` | single Supabase client instance |
| `.env` (gitignored) | local `VITE_*` values |
| `.gitignore` | ensures `.env` is excluded |
| Supabase project | `messages` table, RLS policies, email/password auth, admin user |
| GitHub repo settings | Pages source = Actions; Actions secrets |

---

## 5. Data, Validation & Expected Behavior

### `messages` table schema

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | primary key, default `gen_random_uuid()` |
| `name` | `text` | not null |
| `email` | `text` | not null |
| `message` | `text` | not null |
| `created_at` | `timestamptz` | default `now()` |

Reference SQL (run in the Supabase SQL editor):

```sql
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Public visitors may submit the contact form (INSERT only)
create policy "public can insert messages"
  on public.messages for insert
  to anon
  with check (true);

-- Only authenticated admin may read messages (Back Office)
create policy "authenticated can read messages"
  on public.messages for select
  to authenticated
  using (true);

-- Only authenticated admin may delete messages (Back Office)
create policy "authenticated can delete messages"
  on public.messages for delete
  to authenticated
  using (true);
```

### `supabaseClient.js` expected behavior
- Reads `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- Creates and exports **one** client via `createClient(...)`.
- **Fallback:** if either var is missing, do not crash the app. Log a clear console warning (e.g.
  "Supabase env vars missing — contact form and admin features disabled") and export a value the
  consuming features can detect, so the Contact form and Login can show a disabled/error state
  rather than throwing.

### Expected end state
- `npm run build` completes with no errors.
- A push to `main` deploys automatically; the site loads at `https://username.github.io`.
- `.env` is absent from the repo; secrets are present in GitHub Actions settings.
- The client initializes from injected env vars in the deployed build.

---

## 6. Acceptance Criteria (how to verify it works)

**Repository & branching**
- [ ] Repo is public and named exactly `username.github.io`.
- [ ] All coaches are collaborators.
- [ ] `main`, `dev`, and at least one `feature/*` branch exist; no direct commits to `main`.

**Scaffold & base path**
- [ ] App was scaffolded with Vite (React, JavaScript).
- [ ] `vite.config.js` sets `base: '/'`.
- [ ] `https://username.github.io` loads the React app.

**Deployment**
- [ ] `.github/workflows/deploy.yml` exists and triggers on push to `main`.
- [ ] Workflow runs `npm ci`, `npm run build`, and deploys `dist/`.
- [ ] Pages is set to serve from GitHub Actions.
- [ ] `VITE_*` variables are passed to the build via `env:`.

**Supabase**
- [ ] Supabase project exists; `messages` table matches the schema in §5.
- [ ] RLS is enabled: public can INSERT, public cannot SELECT, authenticated can SELECT and DELETE.
- [ ] Email/password auth is enabled; admin user exists with the fixed credentials.
- [ ] `src/lib/supabaseClient.js` exports a single configured client.

**Environment & secrets**
- [ ] `.env` is in `.gitignore` and not committed anywhere in history.
- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist as GitHub Actions secrets.
- [ ] Only the anon key is used; no `service_role` key anywhere in the codebase.
- [ ] With env vars missing, the app loads and warns instead of crashing.

---

## 7. Notes for the Spec-Driven Loop

- Deploy on **day one**, before building real features — a working pipeline early means no
  submission-day build surprises.
- The admin credentials above are the fixed values provided by CodeBoxx for this assignment; they
  are created in the Supabase dashboard, never via the app.
- Confirm the routing approach (`ai-spec.md §3.1`) with a coach before the Layout feature, since it
  affects how secret routes are reached.