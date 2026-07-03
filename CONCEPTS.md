# CONCEPTS.md — The three hardest concepts in this project

> Raina DeJute · CodeBoxx Module 16 capstone (React + Vite + Supabase, deployed to GitHub Pages).
> These are the three most conceptually demanding things actually implemented in this repo — not the
> easy wins. Each entry: what it is, why it was hard, and exactly where it lives (file + line).
>
> ⚠️ **Line numbers are a snapshot as of this writing.** If I edit the files before recording, I need
> to re-open them and re-verify every number below.

---

## Concept 1 — State-driven routing with deep-linkable secret routes, a Konami unlock, and an auth guard

**What it is.** The whole app is a single-page app with no router library. The four public views
(Home, Portfolio, Links, Contact) switch by **React state**, so the URL never leaves the root — which
the grading checklist explicitly requires. The two secret views (Login, Back Office) are reached
through the **URL hash** (`#login`, `#backoffice`) so they stay typeable and deep-linkable on a static
host, plus a **Konami Code** keyboard shortcut opens Login from anywhere. The Back Office is wrapped in
an **auth guard** that decides, at render time, whether to show the page, bounce to login, or wait.

**Its purpose in the project.** It satisfies two requirements that look contradictory: "the public URL
must stay at `rdejute.github.io` with no `/home` or `/portfolio`," *and* "the secret routes must be
reachable by typing a URL." State nav keeps the public URL clean; the hash keeps the secret routes
reachable without a server.

**Why it was challenging.**
- Two sources of truth — React state and `window.location.hash` — have to stay in sync **in both
  directions** without an infinite loop: clicking nav updates state; typing a hash or hitting
  back/forward has to update state too.
- The auth guard runs against a session that starts out **unknown** (Supabase has to be asked
  asynchronously), so I needed a third "loading" state or the page would flash the login screen for a
  frame before the session resolved.
- The Konami listener is global and has to advance, reset on a wrong key, *and* not fire while I'm
  typing in a form.

**Where it lives.**
- Page map + hash↔view lookup tables: `src/App.jsx:19` (`PAGES`), `src/App.jsx:28-31`
  (`VIEW_BY_HASH`, `HASH_BY_VIEW`, `viewFromHash`).
- `navigate()` — sets the hash for secret views, clears it for public ones via `replaceState` so the
  URL stays at root: `src/App.jsx:37-46`.
- Keeping state in sync when the hash changes (typed URL / back-forward): `src/App.jsx:49-53`.
- Logged-in admin landing on `#login` is redirected to the Back Office: `src/App.jsx:57-61`.
- The auth guard (loading → login → backoffice): `src/App.jsx:72-73`.
- Konami hook — sequence constant, global keydown, ignore-while-typing, reset logic, console
  breadcrumb: `src/hooks/useKonamiCode.js:4-15`, `:26-48`, `:51-57`.

---

## Concept 2 — Auth session lifecycle + Row-Level Security as the real trust boundary

**What it is.** There is no backend server. The browser talks straight to Supabase (Postgres) using
the public "anon" key. Security is enforced **inside the database** with Row-Level Security policies:
the public may only **INSERT** into `messages` (the contact form); only an **authenticated** session
may **SELECT** or **DELETE** (the Back Office). On the client, an `AuthContext` tracks the session:
it asks Supabase for an existing session on load, subscribes to auth changes, and exposes
`signIn` / `signOut`.

**Its purpose in the project.** It's what makes a serverless portfolio actually safe. Anyone can read
the anon key in the shipped JavaScript — that's fine *by design*, because the anon key can't do
anything the RLS policies don't allow. The contact form can write a message but can never read the
inbox; only I, logged in, can.

**Why it was challenging.**
- The mental shift: the client-side auth guard (Concept 1) is only **UX** — it hides a page. The
  **real** protection is the RLS policy in Postgres. If I got the policies wrong, a clever visitor
  could read every message even with the page "hidden." I had to reason about `to anon` vs
  `to authenticated` as the actual line of defense.
- Session state is **asynchronous and event-driven**: `getSession()` is a promise, and the session can
  also change out from under me (token refresh, logout in another tab), so I subscribe to
  `onAuthStateChange`. I also had to avoid calling `setState` after unmount (the `active` flag).
- Session **persistence**: refreshing the page shouldn't log me out. Supabase persists the session; my
  job was to read it back on load and route correctly.

**Where it lives.**
- RLS policies (the actual security): `supabase/schema.sql:13` (enable RLS), `:16-19` (public INSERT
  only), `:22-25` (authenticated SELECT), `:28-31` (authenticated DELETE).
- Session lifecycle: `src/context/AuthContext.jsx:8-10` (session + lazy `loading`), `:16-20`
  (`getSession` on load), `:22-24` (`onAuthStateChange` subscription), `:32-37` (`signIn`), `:39-42`
  (`signOut`).
- Public INSERT from the contact form: `src/components/ContactForm.jsx:46-50`.
- Authenticated SELECT (newest first): `src/pages/BackOffice.jsx:23-26`; authenticated DELETE:
  `src/pages/BackOffice.jsx:42`.
- The single client, created once with the anon/publishable key: `src/lib/supabaseClient.js:5-24`.

---

## Concept 3 — A token-driven theme engine, animated with the View Transitions API

**What it is.** Every color in the app is a **CSS custom property** ("token") defined twice in
`tokens.css` — once under `:root` (light) and once under `[data-theme="dark"]`. Components never write
a hex value; they reference tokens like `var(--bg)` and `var(--accent-cool)`. Flipping one attribute —
`data-theme` on the `<html>` element — re-skins the entire site. On top of that, the toggle animates
the change: instead of an instant swap, the new palette **wipes out in a circle from the button I
clicked**, using the browser's **View Transitions API**.

**Its purpose in the project.** It's the light/dark "extra mile," done in a way that scales: because
colors are centralized, I can retune the whole brand by editing one file, and I can guarantee both
themes stay consistent. The animated wipe is the "every interaction feels intentional" moment.

**Why it was challenging.**
- Getting the architecture right so that **nothing** hardcodes color — every component and every hover
  state had to be expressed in tokens, including semantic ones I added later (`--btn-primary-bg`,
  `--focal-accent`) so the light theme could use earthy browns while dark keeps sage, from the *same*
  class names.
- The View Transitions wipe was the genuinely hard part. `document.startViewTransition(cb)` snapshots
  the page **before** and **after** the callback mutates the DOM — but React updates state
  **asynchronously**, so by default the DOM wouldn't have changed yet when the API took its "after"
  snapshot. I had to wrap the theme change in **`flushSync`** to force React to apply it synchronously
  inside the callback, then animate the `::view-transition-new(root)` pseudo-element's `clip-path`
  from a zero-radius circle to one big enough to cover the viewport.
- It all has to degrade: if the browser lacks the API or the user asked for reduced motion, it just
  swaps instantly.

**Where it lives.**
- The token contract, both themes: `src/styles/tokens.css:5` (`:root` light), `:6` (`--bg`),
  `:56` (`[data-theme="dark"]`).
- Default theme (dark): `src/context/ThemeContext.jsx:13` (plus `data-theme="dark"` on `<html>` in
  `index.html` so the first paint is dark with no flash).
- Applying the theme by attribute: `src/context/ThemeContext.jsx:15-17`.
- The toggle: reduced-motion / unsupported fallback `src/context/ThemeContext.jsx:23-26`; the radial
  wipe with `startViewTransition` + `flushSync` `:36-38`; animating the clip-path `:40-45`.
- The pseudo-element rules that make the wipe read as a clean overlay:
  `src/styles/motion.css` (the `::view-transition-old/new(root)` block).

---

## Honest self-check — what to study before recording

- **`flushSync` + View Transitions (Concept 3).** Be able to say *why* `flushSync` is there in one
  breath: "React normally batches state updates and applies them asynchronously; `startViewTransition`
  needs the DOM already changed inside its callback so it can capture the 'after' snapshot, so
  `flushSync` forces React to apply the theme change right then." If that sentence doesn't feel
  natural yet, rehearse it — a coach may ask. (`src/context/ThemeContext.jsx:36-38`)
- **Why the guard needs a "loading" state (Concept 1/2).** Practice: "the session starts unknown
  because I have to ask Supabase asynchronously; without a loading state the Back Office would flash
  the login screen for a frame before the session resolves." (`src/App.jsx:72-73`,
  `src/context/AuthContext.jsx:10`)
- **RLS vs the client guard (Concept 2).** Be ready to say plainly: "hiding the page is just UX; the
  real security is the Postgres policy — the anon key literally cannot read the inbox." Know the
  difference between `to anon` and `to authenticated`. (`supabase/schema.sql:16-31`)
- **Known gaps to NOT overclaim (see the technical-demo notes):** the theme now defaults to **dark**
  (`index.html` + `ThemeContext.jsx:13`) but is still **not** persisted or read from the OS setting; the
  language is **not** persisted across reloads. Say what's true.
