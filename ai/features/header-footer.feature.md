# Feature Specification — Project Layout (Header & Footer)

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/header-footer.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the persistent shell that wraps every page — a `Main` layout with a sticky header
(logo + navigation + theme/language controls) and a footer (contact + copyright) — and establish the
state-driven navigation that keeps the URL at the root. After this feature, every page renders inside
a consistent, responsive frame.

**In scope:**
- A `Main` layout component that wraps all page content between header and footer.
- A `Header` component: sticky/fixed, with the AI-generated logo and navigation to all public pages.
- A `Footer` component: contact info, social links, copyright — on every page.
- State-driven navigation for the four public pages (URL stays at root, per `ai-spec.md §3.1`).
- Responsive behavior: horizontal top nav on desktop (>768px); bottom icon nav on mobile (≤768px).
- **Mount points** for the theme toggle and language switcher in the header (so they're reachable on
  every page).

**Out of scope (handled by other feature specs — this feature only reserves the slots):**
- The theme toggle's *behavior* (persistence, OS default, transitions) → `light-dark-mode.feature.md`.
- The language switcher's *behavior* (translation loading, persistence) → `languages.feature.md`.
- The content of each page → that page's own feature spec.
- Secret-route access (Login, Back Office) → those features. They appear in **no** navigation here.

---

## 2. Requirements Breakdown

### A. Layout structure
- A `Main` layout component wraps all page content between the header and footer.
- A `Header` (or `Navbar`) component renders at the top of every page.
- A `Footer` component renders at the bottom of every page.
- Semantic HTML: `<header>`, `<main>`, `<footer>`, `<nav>`.

### B. Header
- A `<header>` element is visible at the top of the viewport.
- It is **sticky or fixed** so it remains visible while scrolling.
- It contains navigation links to all **main public** pages: Home, Portfolio, Links, Contact.
- It has a **consistent background and styling on every page** (uses theme tokens from `ai-spec §6`).
- The active page is visually indicated (e.g. the sage active-pill from the design direction).

### C. Footer
- A `<footer>` element is visible at the bottom of the page content, on **every** page.
- Includes contact information (email and social links — e.g. LinkedIn, GitHub).
- Includes a copyright notice (with the current year).

### D. Personal Logo (AI-generated)
- A logo image is visible in the header.
- It is **generated using an AI tool** (document the tool used in a comment / `Research.md`).
- Clicking the logo navigates to the **Home** page (resets the active view to Home).
- It has appropriate `alt` text (e.g. `alt="Raina DeJute — home"`).
- Brand direction: the "rd" monogram from the design mockup; scales without overflowing.

### E. Navigation behavior (per `ai-spec.md §3.1`)
- The active public view is held in **app-level state** (in `App.jsx`) and passed to the layout.
- Selecting a nav item updates that state; **the URL does not change** — it stays at
  `https://username.github.io`.
- Login and Back Office are **not** present in the header, footer, or mobile bottom nav.

### F. Responsive behavior
- **Desktop (>768px):** navigation links display **horizontally** at the top, inside the header.
- **Mobile (≤768px):** navigation links become **icons displayed along the bottom** of the screen
  (a fixed bottom bar). The header stays at the top, carrying the logo and the theme/language
  controls.
- The logo scales appropriately and never overflows.
- No content overflows the viewport; no horizontal scrolling; text stays readable.
- (Full global responsive rules: `ai-spec.md §7`.)

### G. Extra-mile control slots
- The header renders a **theme toggle** and a **language switcher**, reachable on every page.
- This feature only mounts them and styles their placement; their logic lives in their own specs.

---

## 3. User Flow

```
Any page → header is visible at top (logo, nav, theme + language controls)
   • Desktop: click a horizontal nav link → active view switches, URL stays at root
   • Mobile:  tap a bottom icon → active view switches, URL stays at root
   • Click the logo (any page) → returns to Home
   • Footer is visible at the bottom of every page (contact, socials, copyright)
   • Secret routes never appear in any of these navigations
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/layouts/Main.jsx` | Wraps `<header>` + `<main>{children}</main>` + `<footer>`. |
| `src/components/Header.jsx` | Sticky header: logo, primary nav, theme + language slots. |
| `src/components/Footer.jsx` | Contact info, social links, copyright. |
| `src/components/Logo.jsx` | AI-generated logo; click → Home; has `alt`. |
| `src/components/Nav.jsx` *(or inside Header)* | Renders nav items; desktop top / mobile bottom. |
| `src/App.jsx` | Holds the active-view state; passes current view + setter to the layout. |
| `src/styles/` | `Header`, `Footer`, and nav styles — colors via tokens only. |

No backend or Supabase interaction in this feature.

---

## 5. Data, Validation & Expected Behavior

- **Active view state:** a single value (e.g. `'home' | 'portfolio' | 'links' | 'contact'`) in
  `App.jsx`. Selecting a nav item sets it; the rendered page reads from it. Default is `home`.
- **Nav item config:** an array of `{ key, labelKey, icon }` for the four public pages, so desktop
  and mobile render from the same source. `labelKey` resolves through i18n (no hardcoded labels).
- **Footer data:** email and social URLs as constants; copyright year computed
  (`new Date().getFullYear()`); visible text resolves through i18n.
- **Active indication:** the current nav item carries an active style **and** `aria-current="page"`.
- **All user-facing text** (nav labels, footer copy) comes from `en.json` / `fr.json` — keys added to
  both files.
- **All colors** come from CSS custom properties (`ai-spec §6`) — no raw hex in component CSS.

---

## 6. Acceptance Criteria (how to verify it works)

**Layout**
- [ ] A `Main` layout wraps every page's content between header and footer.
- [ ] Header renders at the top of every page; footer renders at the bottom of every page.
- [ ] Semantic `<header>`, `<main>`, `<footer>`, `<nav>` are used.

**Header**
- [ ] The header is sticky/fixed and stays visible while scrolling.
- [ ] It links to Home, Portfolio, Links, and Contact.
- [ ] Its background/styling is consistent across all pages.
- [ ] The active page is visually indicated and carries `aria-current="page"`.

**Footer**
- [ ] Footer appears on every page with contact info, social links, and a copyright notice.
- [ ] The copyright year is current.

**Logo**
- [ ] An AI-generated logo is visible in the header; the tool used is documented.
- [ ] Clicking the logo returns to Home.
- [ ] The logo has meaningful `alt` text and never overflows.

**Navigation & routing**
- [ ] Selecting any public nav item switches the view **without changing the URL** (stays at root).
- [ ] Login and Back Office appear in no navigation (header, footer, or mobile bottom bar).

**Responsive**
- [ ] Desktop (>768px): nav links are horizontal in the header.
- [ ] Mobile (≤768px): nav becomes a bottom icon bar; header keeps logo + theme/language controls.
- [ ] No horizontal scroll; nothing overflows; text stays readable; logo scales.

**Extra-mile slots**
- [ ] A theme toggle and a language switcher are present in the header and reachable on every page.

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All labels/copy present in both `en.json` and `fr.json`.
- [ ] Keyboard-accessible (nav, logo, controls); visible focus states; no console errors.

---

## 7. Notes for the Spec-Driven Loop

- This feature establishes the navigation pattern the whole app uses — build it before any page so
  pages can drop straight into the `Main` layout.
- Confirm the routing interpretation (`ai-spec §3.1`) with a coach **before** building this, since it
  determines how nav switching and the secret routes work.
- Mobile bottom-nav icons each need an accessible label (visible text or `aria-label`); icons alone
  are not accessible.
- Reuse the nav-item config for both desktop and mobile so the two never drift out of sync.