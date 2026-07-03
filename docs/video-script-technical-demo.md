# Video 2 — Technical Demo & Code Overview (word-for-word script)

> Read aloud on camera. Target: **~12 minutes** — this version is paced to give each requirement room
> to breathe and to actually explain the internals, not rush them. Voice: warm, plain, confident.
> **[screen: …]** lines are stage directions. For every requirement there's a **UI** move (what I click)
> and a **CODE** move (what file + line I open and what I say about how it works).
>
> ⚠️ Line numbers are a snapshot as of this writing — if I edit code before recording, re-verify.
> A few requirements can't be shown in the running app; I call those out explicitly instead of skipping
> them.

---

## Opening line

Hi, I'm Raina DeJute. This is a technical walkthrough of my Module 16 capstone — my portfolio. It's a
React and Vite single-page app, it uses Supabase as its only backend — no server of my own — and it
deploys to GitHub Pages. It's live at rdejute dot github dot io.

I'm going to go feature by feature. For each requirement I'll show it working on screen first, and then
I'll open the code and explain not just *where* it lives but *how* it actually works underneath — the
state, the navigation, the Supabase calls, the auth, the row-level security, the theme tokens, all of
it. Let's start at the foundation and work up.

---

## 1. Setup & Deploy

**Vite scaffold + base path.**
- **UI:** [screen: the site loading at the root URL] It's a Vite React app, and it loads at the domain
  root — no subpath, no slash-anything.
- **CODE:** [screen: `vite.config.js`] The one thing that matters here is line 7, `base: '/'`. When you
  deploy to a `username.github.io` repo, the site is served from the domain root, so the base has to be
  a single slash — otherwise every script and image would try to load from the wrong path and the page
  would come up blank. This one line is the difference between a working deploy and a white screen.

**CI/CD workflow — build and deploy on every push to main.**
- **UI:** [screen: GitHub → Actions tab, showing a green run; then Settings → Pages showing "GitHub
  Actions" as the source] I don't deploy by hand. Every time I push to main, this workflow runs and
  publishes the site, and Pages is set to serve from that Actions deployment.
- **CODE:** [screen: `.github/workflows/deploy.yml`] Line 6 is the trigger — a push to `main`. Then it's
  a clean, boring pipeline, which is what you want: line 34 runs `npm ci` for a reproducible install,
  line 37 runs `npm run build` to produce the static `dist` folder, line 47 uploads that folder as the
  Pages artifact, and line 60 deploys it. So the flow is: push to main, build, publish — no manual step
  where I could forget something on submission day.

**Environment variables and secrets.**
- **UI:** [screen: GitHub → Settings → Secrets and variables → Actions] My Supabase URL and key live
  here as encrypted Actions secrets — not in the repo.
- **CODE:** [screen: `deploy.yml` lines 40–44] At build time the workflow injects them as `VITE_`
  variables. The `VITE_` prefix is important: Vite only exposes variables with that prefix to the
  browser bundle, so it's deliberate about what's public. [screen: `.gitignore`] My local `.env` is
  gitignored, so it's never committed. And I want to be explicit: the only key I ever use client-side is
  the public anon key. The secret service-role key appears **nowhere** in this codebase — and in a
  second I'll show you why the anon key being public is completely fine by design.

**The Supabase client — created once, with a graceful fallback.**
- **CODE:** [screen: `src/lib/supabaseClient.js`] The client is created exactly one time, right here at
  line 24, and imported everywhere else in the app. I never call `createClient` inside a component —
  that would spin up duplicate connections and make auth state inconsistent. And lines 12 through 21 are
  the safety net: if the environment variables are missing, the app doesn't throw and die. It sets a
  flag, `isSupabaseConfigured`, to false and logs a clear warning, so the contact form and the login
  screen can quietly show a disabled state instead of crashing the whole page. Graceful degradation
  instead of a stack trace.

**The database and Row-Level Security.**
- **UI:** [screen: Supabase dashboard → Table editor → `messages`; then Authentication → Policies] Here's
  the one table, `messages`, with name, email, message, and a created-at timestamp. And here are the
  three security policies on it.
- **CODE:** [screen: `supabase/schema.sql`] The table is defined at line 5. Line 13 turns on Row-Level
  Security — and this is the heart of the whole security model. Line 16: the public, the "anon" role,
  may only **insert**. That's the contact form. Line 22: only an **authenticated** user may **select** —
  read — messages. Line 28: only an authenticated user may **delete**. So a random visitor can drop a
  message into my inbox, but they can never read it back or delete anything. That's why the public anon
  key is safe to ship in the browser: the key can't do anything these policies don't allow. The security
  isn't hidden in my JavaScript — it's enforced by Postgres itself.
- **Note (shown in the dashboard, not the app):** email-and-password auth is enabled in Supabase, and
  the single admin user is created by hand in the dashboard — there's intentionally no sign-up page. And
  to actually prove the read is blocked, [screen: dashboard SQL editor running a select as anon] a
  public read of `messages` comes back empty.

---

## 2. Layout — header, footer, logo, responsive nav

**The Main layout and semantic structure.**
- **UI:** [screen: any page] Header on top, content in the middle, footer at the bottom — identical frame
  on every page.
- **CODE:** [screen: `src/layouts/Main.jsx`] `Main` is the shell that wraps every page. It renders a
  real `<header>`, a `<main>` for the page content, and a `<footer>`, plus the fixed bottom nav for
  mobile. Using the semantic tags — not just a pile of divs — is what makes it navigable for screen
  readers.

**Sticky header, links to the four public pages, and an active indicator.**
- **UI:** [screen: scroll down — the header stays pinned; click between pages; the current page's nav
  item is highlighted]
- **CODE:** [screen: `src/components/Header.css` line 2] `position: sticky` keeps it visible as you
  scroll. [screen: `src/components/navItems.js` lines 5–10] Here's a detail I care about: the four
  public nav items live in **one** array. Home, Portfolio, Links, Contact — and notice Login and Back
  Office are deliberately not in this list, which is exactly why the secret routes never leak into any
  menu. [screen: `src/components/Nav.jsx`] Both the desktop top nav and the mobile bottom nav render
  from that same array, so they can never drift out of sync. Line 19 adds the active-highlight class,
  and line 20 sets `aria-current="page"` so assistive tech announces which page you're on.

**Footer: contact, socials, current-year copyright.**
- **UI:** [screen: the footer] Email, LinkedIn, GitHub, and a copyright with this year in it.
- **CODE:** [screen: `src/components/Footer.jsx`] The email and social links are constants at lines 5
  through 10, and the year isn't hard-coded — line 14 computes it with `new Date().getFullYear()`, so it
  updates itself. The copyright line is 52 to 54.

**The AI logo — click returns Home, and it has alt text.**
- **UI:** [screen: from Portfolio, click the logo → back to Home]
- **CODE:** [screen: `src/components/Logo.jsx`] It's a real button with an `aria-label` at line 11 and an
  `onClick` that navigates home, so it works with a keyboard and a screen reader, not just a mouse. The
  tool that generated the logo is documented in `docs/Research.md`.

**Navigation keeps the URL at the root; secret routes are in no nav.**
- **UI:** [screen: click through the public nav — the address bar never changes]
- **CODE:** [screen: `src/App.jsx` line 37] This is the `navigate` function. For a public page it just
  switches a piece of React state and clears any hash with `replaceState`, so the URL stays at the clean
  root. There's no router library here at all — navigation is state, which is what satisfies the
  "URL must stay at root" requirement.

**Responsive: desktop top-nav becomes a mobile bottom bar.**
- **UI:** [screen: resize the window down to phone width — the nav drops to a fixed row of icons along
  the bottom, and the header keeps the logo and the controls]
- **CODE:** [screen: `src/components/Nav.css` line 57] The `@media (max-width: 768px)` block hides the
  top nav and, at line 65, turns the bottom nav into a fixed icon bar. Same component, same data — just
  restyled by breakpoint.

**Theme and language controls, reachable everywhere.**
- **CODE:** [screen: `Header.jsx` lines 15–18] The theme toggle and the language switcher are mounted in
  the header, so no matter what page you're on, they're one click away.

---

## 3. Home page

**Home is the default view at the root.**
- **UI:** [screen: fresh load lands on Home]
- **CODE:** [screen: `App.jsx` line 31] `viewFromHash` defaults to `home`, so an empty URL renders Home.

**Hero: name, tagline, credential paragraph, CTAs, and the AI portrait.**
- **UI:** [screen: the hero] The name is the biggest type on the page, then the role, the italic
  tagline, a short credential paragraph, two call-to-action buttons, and the portrait.
- **CODE:** [screen: `src/components/Hero.jsx`] Name at line 15, role and tagline at 16 and 17, and the
  credential paragraph — the "who I am in three breaths" line — at line 18. The two CTAs at lines 21 to
  26 call `onNavigate` to switch to Portfolio and Contact; again, that's a state switch, so the URL
  doesn't move. The AI portrait is at lines 39 to 45 with real, descriptive `alt` text.

**"Why I Build" — the testimony, and it avoids the word "empathy."**
- **UI:** [screen: scroll to Why I Build]
- **CODE:** [screen: `src/components/WhyIBuild.jsx` lines 22–23] The heading and body come through the
  translation function, and the copy is deliberately the human-services-to-developer story — the spec
  says the word "empathy" shouldn't appear in this particular section, and it doesn't.

**Technical skills — at least three, each an icon plus a full sentence.**
- **UI:** [screen: the four technical cards]
- **CODE:** [screen: `src/data/skills.js` lines 3–8] The skills are data, not markup — four entries, each
  with an icon id and translation keys for the title and description. The grid renders whatever's in this
  array, so adding a skill is a one-line change.

**"What I bring to a team" — at least three.**
- **UI:** [screen: the four team cards — Resilience, Communication, Accountability, Self-direction]
- **CODE:** [screen: `src/data/skills.js` lines 11–16] Same pattern, second array.

**Three-plus separated sections, no white surfaces, and two AI images.**
- **UI:** [screen: scroll the whole page] Hero, Why I Build, and the two skill sections, on alternating
  warm surfaces — there's no white anywhere in the light theme, that's a deliberate brand rule.
- **CODE / note:** The two AI images are the portrait and the Why-I-Build graphic; both are logged in
  `docs/Research.md`, and every color comes from the design tokens I'll show at the end.

**Motion: a breathing glow, scroll-reveal, and full respect for reduced motion.**
- **UI:** [screen: scroll — cards fade in and rise; the glow behind the portrait breathes. Then turn on
  the operating system's "reduce motion" setting and reload — now everything is immediately visible and
  perfectly still.]
- **CODE:** [screen: `src/styles/effects.css`] The breathing glow is at line 10 and the scroll-reveal at
  line 50, and both are wrapped so they simply switch off under reduced motion. [screen:
  `src/hooks/useReveal.js`] The reveal is one shared `IntersectionObserver`, built at line 18 and reused
  across the whole site. Line 23 stops observing an element after its first reveal, so it animates once
  and never re-fires. And line 16 bails out entirely for anyone who prefers reduced motion — the
  accessibility path isn't an afterthought, it's the first check.

---

## 4. Portfolio page

**Education, reverse-chronological.**
- **UI:** [screen: the Education section, newest first]
- **CODE:** [screen: `src/pages/Portfolio.jsx` lines 27–38] It maps the `EDUCATION` array through a
  `Timeline` and `TimelineEntry`, each entry carrying institution, program, and dates.

**Work — human services as one combined entry, plus the CodeBoxx coordinator role.**
- **UI:** [screen: the Work section — two entries]
- **CODE:** [screen: `Portfolio.jsx` lines 40–57] The `WORK` array. I combined the human-services roles
  into a single entry with a real description of responsibilities, and added the current coordinator role
  on top.

**Projects — four to five, each with name, tech, description, and image.**
- **UI:** [screen: the project grid — four cards, each explaining what it is and why it exists]
- **CODE:** [screen: `Portfolio.jsx` line 64] `ProjectGrid` renders the `PROJECTS` array. Each card has a
  name, a row of tech tags, a description covering what it does and its purpose, and an image — a mix of
  real screenshots and AI thematic images.

**The résumé PDF download.**
- **UI:** [screen: click "Download résumé" — the PDF downloads] This was flagged as a commonly-missed
  item, so I made it obvious, right next to the page heading.
- **CODE:** [screen: `src/components/ResumeDownload.jsx` lines 22–31] It's a real anchor pointing at
  `/resume.pdf` with the `download` attribute, so the browser downloads it rather than navigating away.

**AI images and reveal motion.**
- **UI / note:** [screen: scroll — the entries reveal] The AI thematic project images are logged in
  `Research.md`, and the motion reuses the exact same `Reveal` component from Home — one pattern, whole
  site.

---

## 5. Links page

**At least three cards — image, title, description, and a new-tab URL.**
- **UI:** [screen: the Links grid; click a card — it opens in a new tab and my site stays open behind it]
- **CODE:** [screen: `src/data/links.js`] Five curated links. [screen: `src/components/LinkCard.jsx` lines
  19–24] Each card is an anchor that opens in a new tab, and — this is a real security detail — line 23
  sets `rel="noopener noreferrer"`. Without `noopener`, a page you open with `target="_blank"` can reach
  back into your window through `window.opener`; this closes that hole.

**LinkedIn and GitHub with the correct URLs.**
- **CODE:** [screen: `src/data/links.js` line 15] LinkedIn is slash-in-slash-rainadejute; [line 31]
  GitHub is slash-rdejute.

**At least one AI image.**
- **Note:** The card banners are AI-generated and logged in `Research.md`.

---

## 6. Contact page — the first feature that really exercises Supabase

**Fields with visible labels: name, email typed as email, and a message textarea.**
- **UI:** [screen: the form]
- **CODE:** [screen: `src/components/ContactForm.jsx` lines 65–92] Three form fields. [screen:
  `src/components/FormField.jsx` line 46] Every field has a real `<label>` tied to its input with
  `htmlFor` and `id` — placeholders alone aren't accessible, so this matters.

**Validation — all required, a real email check, visible errors, and a blocked submit.**
- **UI:** [screen: hit submit empty — inline errors appear on every field; type a broken email — the
  email error shows; nothing gets sent]
- **CODE:** [screen: `ContactForm.jsx` lines 27–33] The `validate` function checks all three fields are
  filled and that the email matches the pattern at line 7. Then line 42 is the gate: if there are any
  errors, it returns early and never touches Supabase. And each error is linked back to its input with
  `aria-describedby` [screen: `FormField.jsx` line 41], so a screen reader reads the error with the
  field.

**Submission — an insert into `messages` through the shared client.**
- **UI:** [screen: fill it in correctly and submit — the send button sweeps, then a success message rises]
- **CODE:** [screen: `ContactForm.jsx` lines 46–50] This is the actual write:
  `supabase.from('messages').insert` with the name, email, and message. It uses the single shared client,
  and it only works because of that public-insert RLS policy from earlier — this is that policy in action.

**Feedback — distinct success and failure, field reset, auto-dismiss, a pending state, and an aria-live
region.**
- **UI:** [screen: the success state; the fields have cleared; it fades out after a few seconds. If I can
  force a failure, the distinct red error appears and keeps my text so I can retry.]
- **CODE:** [screen: `ContactForm.jsx`] On success, line 56 flips to the success state, line 57 clears the
  fields, and lines 58 and 59 start the auto-dismiss timer. The red failure banner is lines 97 to 104 —
  and notice on failure I *keep* the field values so the person doesn't lose what they typed. The button
  shows a disabled "Sending…" state at lines 107 to 113 to prevent a double-submit. And the whole
  feedback area sits inside an `aria-live` region at line 96, so the result is announced, not just shown.
- **CODE (the fallback):** line 38 — if Supabase isn't configured, the submit is a safe no-op, and line
  94 shows a friendly note instead of throwing.
- **End-to-end proof:** [screen: Supabase dashboard — the new row I just submitted is sitting in the
  `messages` table].

---

## 7. Login — the secret route

**It's in no navigation, and it's reachable two sanctioned ways: a typed hash and the Konami Code.**
- **UI:** [screen: point out it's absent from the header, footer, and mobile nav. Type `#login` in the
  address bar — the login view appears. Then from anywhere, press up up down down left right left right B
  A — and it appears again.]
- **CODE:** [screen: `App.jsx` line 28] A small lookup table maps the hash `#login` to the login view — so
  it's typeable and deep-linkable even on a static host. [screen: `src/hooks/useKonamiCode.js`] The
  Konami sequence is a single array at line 4 so it's easy to change. The listener at line 26 walks the
  sequence key by key. Two details I'm proud of: line 29 ignores keystrokes while you're typing in a form
  — so typing an "a" in a message box can't trip it — and line 40 resets on a wrong key, but it's smart
  enough to let that key *start* a fresh sequence. There's even a friendly console hint at line 51 so an
  evaluator poking in dev tools discovers the easter egg.

**Email, password, and a submit that calls `signInWithPassword`.**
- **UI:** [screen: type the admin email and password, submit — and I land in the Back Office]
- **CODE:** [screen: `src/pages/Login.jsx`] The fields are at lines 43 to 61 and the submit button at 74.
  [screen: `src/context/AuthContext.jsx` line 34] The submit calls
  `supabase.auth.signInWithPassword` — there's no registration path anywhere; the admin account is
  pre-created in Supabase.

**Distinct failure, success routes to Back Office, and the session persists.**
- **UI:** [screen: type a wrong password — a distinct red error and a gentle shake. Then log in for real,
  land on the Back Office, and hit browser refresh — I'm still logged in and still on the Back Office.]
- **CODE:** [screen: `Login.jsx` lines 26–33] A failure sets the error; a success navigates to backoffice.
  [screen: `AuthContext.jsx` line 16] On load, `getSession` reads the session Supabase already persisted
  in local storage, which is why a refresh doesn't log me out — and combined with the redirect logic, an
  existing session drops me straight into the Back Office.

---

## 8. Back Office — auth-gated admin

**The auth gate runs before any content renders.**
- **UI:** [screen: log out, then type `#backoffice` directly — I'm bounced to the login screen]
- **CODE:** [screen: `src/App.jsx` lines 72–73] This is the guard: if the requested view is backoffice
  and there's no session, it renders login instead. And while the session is still being checked, it
  shows a neutral loading view — that avoids flashing the login screen for a frame before the session
  resolves, because remember, the session starts out unknown and has to be fetched asynchronously.

**Fetch every message, newest first, with real loading, empty, and error states.**
- **UI:** [screen: the table; mention the warm skeleton while it loads, and that there are distinct empty
  and error states]
- **CODE:** [screen: `src/pages/BackOffice.jsx` lines 23–26] The query is
  `select('*').order('created_at', ascending false)` — all rows, newest first. The loading, error, and
  empty branches are all handled explicitly at lines 76 through 107, so it's never a blank screen.

**Table columns: Name, Email, Date, Actions.**
- **CODE:** [screen: `src/components/MessagesTable.jsx` lines 12–17] The four column headers, and the date
  is rendered in a readable local format with `toLocaleDateString` at line 28.

**Delete removes the row instantly.**
- **UI:** [screen: click the trash icon on a row — it's gone, no page refresh]
- **CODE:** [screen: `BackOffice.jsx` lines 40–53] It deletes in Supabase at line 42, and then removes
  that row from local state, so the table updates immediately without a reload. That instant update is an
  explicit requirement.

**The view modal: full details, and it closes three ways.**
- **UI:** [screen: click View — a modal opens with the sender's name, email, the date and time, and the
  full message. Press Escape — it closes. Reopen, click outside — closes. Reopen, click the X — closes.]
- **CODE:** [screen: `src/components/MessageModal.jsx`] Escape closes at line 21, a click on the backdrop
  closes at line 50, and lines 25 to 37 trap focus inside the dialog so tabbing can't wander out behind
  it — and when it closes, line 43 returns focus to the button that opened it. That focus handling is
  what makes a modal actually accessible rather than just visually on top.

**Logout.**
- **UI:** [screen: click Log out — I'm returned Home and the session is cleared; typing `#backoffice`
  again now bounces me to login]
- **CODE:** [screen: `BackOffice.jsx` lines 55–58] It calls `signOut` and then navigates home.

---

## 9. Extra mile — Light / Dark theme

**Token-driven, both themes, with an animated toggle.**
- **UI:** [screen: click the theme toggle — the new palette wipes across the screen in a circle from the
  button, and every color on the page changes at once]
- **CODE:** [screen: `src/styles/tokens.css`] Here's the engine. The light theme is defined at line 5, the
  dark theme at line 56 — the exact same variable names, different values. My components never write a
  raw color; they reference these tokens. So flipping one attribute, `data-theme` on the html element,
  re-skins the entire site. [screen: `src/context/ThemeContext.jsx` line 15] That flip happens here. And
  lines 36 to 45 are the animation — it uses the browser's View Transitions API to grow a circle of the
  new theme out from exactly where I clicked. The tricky part is line 37's `flushSync`: React normally
  applies state changes asynchronously, but the View Transitions API needs the DOM already updated inside
  its callback so it can capture the "after" snapshot, so `flushSync` forces the theme change to happen
  synchronously right then. And line 23 is the graceful fallback — if the browser doesn't support the API,
  or you prefer reduced motion, it just swaps instantly with no animation.
- **⚠️ Honest callout:** the theme **defaults to dark — that's the look I want — but it still does not read
  your operating-system preference, and it does not persist a change across reloads.** [screen:
  `ThemeContext.jsx` line 13] The default is set to dark here, and `index.html` sets `data-theme="dark"`
  too so the very first paint is dark with no flash. What's *not* built is reading your OS setting or
  saving a switch you make — so if you toggle to light and reload, it comes back dark. The toggle fully
  works; remembering your choice is on my to-do list.

---

## 10. Extra mile — Languages (English / French)

**A switcher, both JSON dictionaries, and no hard-coded strings.**
- **UI:** [screen: click the EN/FR switcher — the entire site, every label and paragraph, switches
  language]
- **CODE:** [screen: `src/components/LanguageSwitcher.jsx` lines 6–22] The switcher just flips the active
  language. [screen: `src/context/LanguageContext.jsx` lines 15–16] This is the translation function,
  `t` — you give it a dotted key like `nav.home` and it walks the active dictionary to find the string.
  [screen: `src/i18n/en.json` and `fr.json`] Every user-facing string lives in both files — nothing is
  hard-coded in a component, which is exactly what makes a second language possible at all.
- **⚠️ Honest callout:** like the theme, the language choice **does not persist across a reload** —
  [screen: `LanguageContext.jsx` line 11] it always starts in English. The live switching works; saving
  the preference is a to-do.

---

## Cross-cutting — Definition of Done

- **UI:** [screen: on a couple of pages, quickly toggle theme and language together] Everything works in
  both themes and both languages. [screen: tab through the nav and a form] Keyboard focus is visible on
  every interactive element. Images have alt text, and the console is clean apart from the intentional
  Konami hint.

---

## Things I'm calling out rather than pretending

- **Auth enabled, the admin user, and "the public cannot read messages"** — those are verified in the
  Supabase dashboard, and the RLS policies in `schema.sql` are the proof.
- **Theme** — it works, it animates, and it defaults to dark, but it does **not** read your OS preference
  or persist a change across reloads. (`ThemeContext.jsx:13`)
- **Language** — it switches live, but does **not** yet persist across reloads. (`LanguageContext.jsx:11`)
- **AI-tool documentation** — `docs/Research.md` names the tool for most images, but a few Links banners
  and project graphics still say "confirm," and the comments in `Hero.jsx` and `Logo.jsx` still have a
  "document the tool" placeholder. That's a graded item and I need to finish it.

---

## Closing line

That's the full walkthrough — every requirement, shown on screen and then in the code that makes it work,
plus an honest note on the few things still on my list. The site is live at rdejute dot github dot io.
Thanks for watching.
