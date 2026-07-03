# Feature Specification — Login Page (Secret Route)

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/login-page.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the hidden admin login — a route that never appears in navigation, reachable by typing
the URL **or** by entering the **Konami Code**. It authenticates the single admin against Supabase Auth
and, on success, sends the user to the Back Office.

**In scope:**
- A secret login route, excluded from all navigation.
- Two sanctioned entry paths: typed URL (`#login`) **and** the Konami Code keystroke sequence.
- Email + password login form.
- Supabase `signInWithPassword` authentication.
- Success → Back Office; failure → visible error. Persistent session.

**Out of scope (handled elsewhere):**
- The admin user, Supabase Auth config, and client → Setup & Deploy feature.
- The Back Office page itself (table, view, delete, logout) → Back Office feature.
- Header/footer/nav → Layout feature (which must exclude these secret routes).

---

## 2. Requirements Breakdown

### A. Secret route
- The login route is **not** in the header, footer, or mobile bottom nav.
- It is reachable two ways:
  1. **Typed URL** — visiting `#login` (per `ai-spec §3.1`) renders the login view.
  2. **Konami Code** — the sequence `↑ ↑ ↓ ↓ ← → ← → B A` entered on the keyboard opens the login
     view from anywhere on the site.
- *(Baseline typed-URL access guarantees rubric compliance; the Konami Code is the "secret keyboard
  keydown" the rubric also allows.)*

### B. Konami Code listener
- A global keydown listener tracks the sequence and, on completion, switches the active view to login.
- Implemented as a small reusable hook (e.g. `useKonamiCode(onUnlock)`); the sequence is a single
  config constant so it can be changed easily.
- The listener resets on a wrong key and ignores the sequence while typing in an input/textarea.
- *(Optional, recommended):* a friendly `console.log` breadcrumb hinting the easter egg exists, so an
  evaluator poking in dev tools discovers it.

### C. Login form
- An **email** input (`type="email"`).
- A **password** input (`type="password"`).
- A **submit / login** button.

### D. Supabase authentication
- On submit, call **`supabase.auth.signInWithPassword({ email, password })`** using the client from
  `src/lib/supabaseClient.js`.
- The admin account is pre-created in the Supabase dashboard (Setup & Deploy) — there is **no**
  registration page.

### E. Success / failure
- On success: the session is established and the user is navigated to the **Back Office** (`#backoffice`).
- The session **persists** — refreshing the page does not log the user out; a valid existing session
  redirects to the Back Office.
- On failure (wrong credentials): a **visible, distinct error** message (e.g. red "Invalid login
  credentials").

---

## 3. User Flow

```
From anywhere:
   type #login  ──┐
   or enter ↑↑↓↓←→←→ B A ──┐
                            ▼
                    Login view renders (not in any nav)
   → enter email + password → submit
        → supabase.auth.signInWithPassword()
             → success: session set → go to Back Office (#backoffice)
             → failure: red "Invalid login credentials", stay on login
   → if a valid session already exists on load → redirect straight to Back Office
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/pages/Login.jsx` | The login form + submit + error state. |
| `src/hooks/useKonamiCode.js` | Global keydown sequence listener → unlock callback. |
| `src/lib/supabaseClient.js` | `auth.signInWithPassword`, session checks. |
| `src/context/` *(or App)* | Holds/derives auth session; guards the Back Office. |
| `src/i18n/en.json`, `fr.json` | Labels, button, error text. |

- The active-view state (from Layout/`App`) switches to `login` / `backoffice`; neither is in any nav.

---

## 5. Data, Validation & Expected Behavior

- **Controlled inputs:** `email`, `password` in state.
- **Submit handler:** call `signInWithPassword`; on `{ data.session }` success → set view to
  `backoffice`; on `{ error }` → show the error message.
- **Session persistence:** Supabase persists the session (default local storage). On app load, check
  `supabase.auth.getSession()`; if a session exists and the user lands on `#login` or `#backoffice`,
  route them to the Back Office.
- **Konami constant:** `['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']`
  in one config location; compare case-insensitively for the letters.
- **All user-facing text** resolves through i18n keys in **both** `en.json` and `fr.json`.
- **Colors** via tokens only (sage focal button/focus; distinct red for the error). **Accessibility:**
  labeled inputs; error in an `aria-live` region.
- **Responsive:** single-column, comfortable on mobile (`ai-spec §7`).

---

## 6. Acceptance Criteria (how to verify it works)

**Secret route**
- [ ] Login is absent from header, footer, and mobile nav.
- [ ] Visiting `#login` renders the login view.
- [ ] Entering `↑ ↑ ↓ ↓ ← → ← → B A` opens the login view from anywhere.
- [ ] The Konami listener ignores input while typing in a field and resets on a wrong key.

**Form**
- [ ] Email (`type="email"`), password (`type="password"`), and a submit button are present.

**Authentication**
- [ ] Submit calls `supabase.auth.signInWithPassword()` with the entered credentials.
- [ ] The client from `src/lib/supabaseClient.js` is used.

**Success / failure**
- [ ] Successful login navigates to the Back Office and establishes a session.
- [ ] Refreshing does not log the user out; an existing session redirects to the Back Office.
- [ ] Wrong credentials show a visible, distinct error.

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All text present in both `en.json` and `fr.json`.
- [ ] Keyboard-accessible; `aria-live` error; no console errors (aside from the intentional easter-egg
      hint, if used).

---

## 7. Notes for the Spec-Driven Loop

- Keep the typed URL working as the reliable baseline — the Konami Code is a bonus, not a replacement.
- Keep the sequence in one constant so it's trivial to change or disable.
- The console breadcrumb is optional but recommended: it makes sure your cleverness actually gets seen
  during grading.
- Auth/session state is shared with the Back Office (§ next spec) — implement it once and reuse.