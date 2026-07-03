# Video 2 — Technical Demo & Code Overview (word-for-word script)

> Read aloud on camera. Target: ~8–10 minutes. Voice: warm, plain, confident. **[screen: …]** lines
> are stage directions. For every requirement there's a **UI** move (what I click) and a **CODE** move
> (what file + line I open and what I say).
>
> ⚠️ Line numbers are a snapshot as of this writing — if I edit code before recording, re-verify.
> A few requirements can't be shown in the running app; I call those out explicitly instead of skipping
> them.

---

## Opening line

Hi, I'm Raina DeJute. This is a technical walkthrough of my Module 16 capstone — my portfolio, built in
React and Vite with Supabase as the only backend, deployed to GitHub Pages, live at rdejute dot github
dot io. I'm going to go feature by feature and, for each requirement, show it working on screen and
then show you the code that makes it work.

---

## 1. Setup & Deploy

**Repo, branches, collaborators.**
- **UI:** [screen: GitHub repo page] The repo is public and named `rdejute.github.io`, coaches are
  added as collaborators, and the branch list shows `main`, `dev`, and feature branches. [screen:
  commit/network graph] You can see the feature-into-dev-into-main flow; nothing is committed straight
  to main.
- **CODE / note:** This one lives on GitHub, not in the app — I'm showing it in the GitHub UI, which is
  where it's meant to be verified.

**Vite scaffold + base path.**
- **UI:** [screen: the site loading at the root URL] It loads at the domain root, no subpath.
- **CODE:** [screen: `vite.config.js`] Line 7 sets `base: '/'` — that's what makes a root-repo
  GitHub Pages deploy resolve its assets correctly.

**CI/CD workflow.**
- **UI:** [screen: GitHub → Actions tab] Every push to main runs this workflow and deploys. Pages is set
  to serve from GitHub Actions [screen: Settings → Pages].
- **CODE:** [screen: `.github/workflows/deploy.yml`] Line 6 — it triggers on push to `main`. Line 34
  runs `npm ci`, line 37 runs `npm run build`, line 47 uploads the `dist` folder, and line 60 deploys
  it to Pages.

**Environment variables / secrets.**
- **UI:** [screen: GitHub → Settings → Secrets] The Supabase URL and key are stored as Actions secrets,
  not in the repo.
- **CODE:** [screen: `deploy.yml` lines 40–44] They're injected into the build here as `VITE_` vars.
  [screen: `.gitignore`] `.env` is gitignored — it's never committed. And I only ever use the public
  anon key; the secret service-role key appears nowhere in the code.

**Supabase client, single instance + graceful fallback.**
- **CODE:** [screen: `src/lib/supabaseClient.js`] The client is created exactly once, here at line 24,
  and imported everywhere else — never `new`'d inside a component. And lines 12–21 are the fallback: if
  the env vars are missing, it doesn't crash — it sets `isSupabaseConfigured` to false and logs a
  warning, so the contact form and login can show a disabled state.

**Database + RLS.**
- **UI:** [screen: Supabase dashboard → Table editor → `messages`, then Auth → Policies] Here's the
  table with `name`, `email`, `message`, `created_at`, and the three RLS policies.
- **CODE:** [screen: `supabase/schema.sql`] The table's at line 5, RLS is enabled at line 13, and the
  policies: public can only INSERT at line 16, only authenticated can SELECT at line 22, only
  authenticated can DELETE at line 28.
- **Note (shown in dashboard, not the app):** email/password auth is enabled and the admin user is
  created manually in the Supabase dashboard — there's no sign-up page in the app by design. And to
  prove RLS actually blocks public reads, [screen: dashboard SQL or console] a read as the anon role
  returns nothing.

---

## 2. Layout — header, footer, logo, responsive nav

**Main layout + semantic structure.**
- **UI:** [screen: any page] Header on top, content, footer on the bottom — consistent on every page.
- **CODE:** [screen: `src/layouts/Main.jsx`] `Main` wraps a `<header>`, a `<main>`, and a `<footer>`;
  the mobile bottom nav is also rendered here.

**Sticky header + nav to the four public pages + active state.**
- **UI:** [screen: scroll down — header stays; click between pages; the active item is highlighted]
- **CODE:** [screen: `src/components/Header.css` line 2] `position: sticky`. [screen:
  `src/components/navItems.js` lines 5–10] The four public items live in one array — note Login and
  Back Office are deliberately not here. [screen: `src/components/Nav.jsx`] Both the desktop and mobile
  nav render from that same array; line 19 adds the active class and line 20 sets
  `aria-current="page"`.

**Footer contact, socials, copyright year.**
- **UI:** [screen: footer] Email, LinkedIn, GitHub, and a copyright with the current year.
- **CODE:** [screen: `src/components/Footer.jsx`] Email and socials at lines 5–10; the year is computed
  at line 14; the copyright line is 52–54.

**AI logo, click → Home, alt text.**
- **UI:** [screen: click the logo from another page → returns Home]
- **CODE:** [screen: `src/components/Logo.jsx`] It's a button with an `aria-label` at line 11 and an
  `onClick` that navigates home; the tool that generated it is documented in `docs/Research.md`.

**URL stays at root; secret routes not in nav.**
- **UI:** [screen: click nav items — address bar never changes]
- **CODE:** [screen: `src/App.jsx` line 37] `navigate` switches state and clears the hash for public
  views, so the URL stays at root; the secret routes simply aren't in `navItems.js`.

**Responsive: desktop top-nav, mobile bottom-nav.**
- **UI:** [screen: resize to mobile — nav becomes a bottom icon bar; header keeps logo + controls]
- **CODE:** [screen: `src/components/Nav.css` line 57] The `@media (max-width: 768px)` block hides the
  top nav and turns the bottom nav into a fixed icon bar at line 65.

**Theme + language control slots on every page.**
- **CODE:** [screen: `Header.jsx` lines 15–18] The theme toggle and language switcher are mounted in
  the header, so they're reachable everywhere.

---

## 3. Home page

**Default view at root.**
- **UI:** [screen: fresh load → Home]
- **CODE:** [screen: `App.jsx` line 31] `viewFromHash` defaults to `home`.

**Hero: name, tagline, credential paragraph, CTAs, AI portrait.**
- **UI:** [screen: hero] Name, role, the italic tagline, the credential paragraph, two CTA buttons, and
  the portrait.
- **CODE:** [screen: `src/components/Hero.jsx`] Name at line 15, role and tagline 16–17, the
  credential paragraph at line 18. The CTAs at 21–26 call `onNavigate` to switch to Portfolio and
  Contact — no URL change. The AI portrait is at lines 39–45 with real `alt` text.

**"Why I Build" testimony, and it avoids the word "empathy."**
- **UI:** [screen: scroll to Why I Build]
- **CODE:** [screen: `src/components/WhyIBuild.jsx` lines 22–23] The heading and body come from i18n;
  the copy is the testimony, and "empathy" is intentionally not in it.

**Technical skills — at least 3, icon + sentence.**
- **UI:** [screen: the four technical cards]
- **CODE:** [screen: `src/data/skills.js` lines 3–8] Four skills, each with an icon id and i18n
  title/description keys; `SkillGrid` and `SkillCard` render them.

**"What I bring to a team" — at least 3.**
- **UI:** [screen: the four team cards]
- **CODE:** [screen: `src/data/skills.js` lines 11–16] Resilience, Communication, Accountability,
  Self-direction.

**At least 3 separated sections, no white; 2+ AI images.**
- **UI:** [screen: scroll the whole page] Hero, Why I Build, and the two skill sections, on alternating
  warm surfaces — no white anywhere.
- **CODE / note:** The portrait and the Why-I-Build graphic are the two AI images; both are logged in
  `docs/Research.md`. Colors come from tokens in `tokens.css`.

**Motion: breathing glow, scroll-reveal, reduced-motion.**
- **UI:** [screen: scroll — cards fade and rise; the glow breathes; then toggle OS "reduce motion" and
  reload — everything is instantly visible and still]
- **CODE:** [screen: `src/styles/effects.css`] The glow is at line 10, the scroll-reveal at line 50,
  and both are wrapped so they stop under reduced motion. [screen: `src/hooks/useReveal.js`] Line 18 is
  the single `IntersectionObserver`, line 23 unobserves after the first reveal so it only runs once, and
  line 16 bails out entirely if the user prefers reduced motion.

---

## 4. Portfolio page

**Education, reverse-chronological.**
- **UI:** [screen: Education section]
- **CODE:** [screen: `src/pages/Portfolio.jsx` lines 27–38] renders the `EDUCATION` array through
  `Timeline`/`TimelineEntry`.

**Work — combined human-services entry + CodeBoxx coordinator.**
- **UI:** [screen: Work section — the two entries]
- **CODE:** [screen: `Portfolio.jsx` lines 40–57] the `WORK` array; human services is one combined
  entry, plus the coordinator role, with descriptions.

**Projects — 4–5, name/tech/description/image.**
- **UI:** [screen: the project grid — four cards]
- **CODE:** [screen: `Portfolio.jsx` line 64] `ProjectGrid` renders the `PROJECTS` array; each card has
  a name, tech tags, a what-and-why description, and an image — a mix of real screenshots and AI
  thematic images.

**Résumé PDF download.**
- **UI:** [screen: click "Download résumé" → the PDF opens/downloads]
- **CODE:** [screen: `src/components/ResumeDownload.jsx` lines 22–31] a real anchor to `/resume.pdf`
  with the `download` attribute.

**AI images + reveal motion.**
- **UI/note:** [screen: scroll — entries reveal] The AI thematic project images are logged in
  `Research.md`; motion reuses the same `Reveal` component from Home.

---

## 5. Links page

**At least 3 cards: image, title, description, new-tab URL.**
- **UI:** [screen: Links grid; click a card → opens in a new tab, site stays open behind it]
- **CODE:** [screen: `src/data/links.js`] Five links. [screen: `src/components/LinkCard.jsx` lines
  19–24] Each is an anchor with `target="_blank"` **and** `rel="noopener noreferrer"` at line 23 —
  that's the security detail so a `_blank` link can't touch `window.opener`.

**LinkedIn and GitHub with the correct URLs.**
- **CODE:** [screen: `src/data/links.js` line 15] LinkedIn is `/in/rainadejute`; [line 31] GitHub is
  `/rdejute`.

**At least 1 AI image.**
- **Note:** The card banners are AI-generated; logged in `Research.md`.

---

## 6. Contact page

**Fields with labels: name, email (`type="email"`), message (textarea).**
- **UI:** [screen: the form]
- **CODE:** [screen: `src/components/ContactForm.jsx` lines 65–92] Three `FormField`s. [screen:
  `src/components/FormField.jsx` line 46] Every field's `<label>` is tied to its input with
  `htmlFor`/`id`.

**Validation: all required, valid email, visible errors, blocked submit.**
- **UI:** [screen: submit empty → errors appear; type a bad email → email error; nothing sends]
- **CODE:** [screen: `ContactForm.jsx` lines 27–33] `validate` checks all three fields; the email regex
  is at line 7. Line 42 stops the submit if there are any errors. Errors are linked to inputs via
  `aria-describedby` [screen: `FormField.jsx` line 41].

**Insert into Supabase via the shared client.**
- **UI:** [screen: fill it in correctly, submit → the send button sweeps, then the success receipt
  rises]
- **CODE:** [screen: `ContactForm.jsx` lines 46–50] `supabase.from('messages').insert(...)` using the
  single client — respecting the public-insert RLS policy.

**Success/failure feedback, reset, auto-dismiss, pending state, aria-live.**
- **UI:** [screen: success message; fields cleared; it disappears after a few seconds. Then, if I can
  force a failure, the red error]
- **CODE:** [screen: `ContactForm.jsx`] On success, line 56 sets the success state, line 57 clears the
  fields, and lines 58–59 start the auto-dismiss timer. The failure banner is lines 97–104, the pending
  "Sending…" button is 107–113, and the whole feedback area is inside an `aria-live` region at line 96.
- **CODE (fallback):** line 38 — if Supabase isn't configured, submit is a no-op and line 94 shows a
  friendly disabled note instead of crashing.

**Verify end-to-end:** [screen: Supabase dashboard → the new row appears in `messages`].

---

## 7. Login (secret route)

**Not in any nav; reachable by typed hash and by Konami Code.**
- **UI:** [screen: point out it's not in header/footer/mobile nav; type `#login` → it appears; then from
  Home press ↑ ↑ ↓ ↓ ← → ← → B A → it appears]
- **CODE:** [screen: `App.jsx` line 28] `#login` maps to the login view. [screen:
  `src/hooks/useKonamiCode.js` line 4] the sequence; line 29 ignores keystrokes while typing; line 40
  resets on a wrong key.

**Email, password, submit → `signInWithPassword`.**
- **UI:** [screen: enter admin credentials → land on Back Office]
- **CODE:** [screen: `src/pages/Login.jsx`] fields at lines 43–61, submit at 74. [screen:
  `src/context/AuthContext.jsx` line 34] the submit calls `supabase.auth.signInWithPassword`.

**Failure error; success → Back Office; session persists.**
- **UI:** [screen: wrong password → red error and a gentle shake; then log in correctly; refresh the
  page → still logged in, still on Back Office]
- **CODE:** [screen: `Login.jsx` lines 26–33] failure sets the error, success navigates to backoffice.
  [screen: `AuthContext.jsx` line 16] on load `getSession` reads the persisted session, so a refresh
  keeps me in and routes me to the Back Office.

---

## 8. Back Office (auth-gated)

**Auth gate before render.**
- **UI:** [screen: log out, then type `#backoffice` → redirected to login]
- **CODE:** [screen: `App.jsx` lines 72–73] if the view is backoffice and there's no session, it
  renders login instead — and a loading view while the session is still resolving.

**Fetch all messages, newest first; loading/empty/error states.**
- **UI:** [screen: the table; mention the skeleton on load and the empty/error states]
- **CODE:** [screen: `src/pages/BackOffice.jsx` lines 23–26] `select('*').order('created_at',
  { ascending: false })`; the loading, error, and empty branches are lines 76–107.

**Table columns Name / Email / Date / Actions.**
- **CODE:** [screen: `src/components/MessagesTable.jsx` lines 12–17] the four headers; the date is
  formatted with `toLocaleDateString` at line 28.

**Delete removes the row instantly.**
- **UI:** [screen: click the trash icon → the row disappears without a refresh]
- **CODE:** [screen: `BackOffice.jsx` lines 40–53] it deletes in Supabase at line 42, then removes the
  row from local state so the table updates immediately.

**View modal: name, email, date+time, full text; close via X, outside click, Escape.**
- **UI:** [screen: click View → modal; press Escape, click outside, click X]
- **CODE:** [screen: `src/components/MessageModal.jsx`] Escape closes at line 21, the backdrop click
  closes at line 50, and lines 25–37 trap focus inside the dialog, with focus returned to the trigger
  at line 43.

**Logout.**
- **UI:** [screen: click Log out → back to Home, session cleared]
- **CODE:** [screen: `BackOffice.jsx` lines 55–58] calls `signOut` then navigates home.

---

## 9. Extra mile — Light/Dark theme

**Token-driven, both themes, animated toggle.**
- **UI:** [screen: click the toggle — the palette wipes across from the button; every color changes]
- **CODE:** [screen: `src/styles/tokens.css`] light theme at line 5, dark at line 56 — same variable
  names, so one attribute flip re-skins everything. [screen: `src/context/ThemeContext.jsx` line 13]
  applies `data-theme`; lines 34–43 are the View Transitions radial wipe, with an instant-swap fallback
  at line 21 for reduced motion.
- **⚠️ Must say honestly:** right now the theme **defaults to light and is not persisted, and it does
  not read your operating-system preference.** `ThemeContext.jsx` line 11 hard-codes the starting theme
  to light. The spec mentions OS-default and localStorage persistence, but that part is **not built
  yet** — so I won't claim it. The toggle itself fully works; remembering your choice across reloads is
  a to-do.

---

## 10. Extra mile — Languages (EN/FR)

**Switcher, both JSON files, no hardcoded strings.**
- **UI:** [screen: click the EN/FR switcher — the whole site switches language]
- **CODE:** [screen: `src/components/LanguageSwitcher.jsx` lines 6–22] toggles the language. [screen:
  `src/context/LanguageContext.jsx` lines 15–16] the `t()` function resolves a dotted key like
  `nav.home` out of the active dictionary. [screen: `src/i18n/en.json` and `fr.json`] every string
  lives in both files.
- **⚠️ Must say honestly:** like the theme, the language choice is **not persisted across reloads** —
  `LanguageContext.jsx` line 11 always starts in English. The switching works live; remembering it is a
  to-do.

---

## Cross-cutting (Definition of Done)

- **UI:** [screen: quickly toggle theme and language on a couple of pages] Everything works in both
  themes and both languages. Tab through the nav and the form to show keyboard focus rings. Images have
  alt text; the console is clean apart from the intentional Konami hint.

---

## Things I'm calling out rather than pretending

- **Repo name, public status, collaborators, branch flow, Pages source** — verified on GitHub, not in
  the running app.
- **Auth enabled, admin user, and "public cannot read messages"** — shown in the Supabase dashboard;
  the RLS policies are the proof.
- **Theme:** works and animates, but does **not** yet default from the OS or persist. (`ThemeContext.jsx:11`)
- **Language:** switches live, but does **not** yet persist across reloads. (`LanguageContext.jsx:11`)
- **AI-tool documentation:** `docs/Research.md` names the tool for most images, but a few link banners
  and project graphics still say "confirm," and the code comments in `Hero.jsx` and `Logo.jsx` still
  have a "<DOCUMENT THE TOOL>" placeholder. I need to finish that before this is truly done — it's a
  graded item.

---

## Closing line

That's the full walkthrough — every requirement, on screen and in the code, plus an honest note on the
few things still on my to-do list. Thanks for watching; the site is live at rdejute dot github dot io.
