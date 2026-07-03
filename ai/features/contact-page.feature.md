# Feature Specification — Contact Page

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/contact-page.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the Contact page — a form (name, email, message) that validates on the client, submits
to the Supabase `messages` table, and gives the user clear success/failure feedback. This is the first
feature that actually *uses* the Supabase plumbing created in Setup & Deploy.

**In scope:**
- A contact form with **name**, **email**, and **message** fields (labels/placeholders).
- Client-side validation (all required; valid email format; visible errors; blocked submit on invalid).
- Submission: an `INSERT` into the Supabase `messages` table via `src/lib/supabaseClient.js`.
- Success/failure feedback (visually distinct; fields reset on success; message auto-dismisses).

**Out of scope (handled elsewhere):**
- The `messages` table, RLS policies, and the Supabase client → Setup & Deploy feature (created there;
  used here).
- Reading/deleting messages → Back Office feature.
- Header, footer, nav, theme, language → Layout feature.

---

## 2. Requirements Breakdown

### A. Form fields
- A text input for the sender's **name**.
- An email input for the sender's **email** (`type="email"`).
- A **textarea** for the **message**.
- All fields have visible **labels** (placeholders alone are not sufficient for accessibility).

### B. Client-side validation
- All three fields are **required**; the form cannot submit with any empty.
- The email field validates for a **proper email format**.
- Validation **errors are displayed** to the user (e.g. "Please fill in all fields", "Enter a valid
  email").
- On invalid input, the submit is **rejected / the button disabled** so nothing is sent.

### C. Submission to Supabase
- On a valid submission, an **`INSERT`** is made into the `messages` table.
- The payload includes **`name`, `email`, `message`** (matching the schema; `created_at` defaults in
  the DB).
- The submission uses the Supabase client from **`src/lib/supabaseClient.js`** (never a new client).
- Respects the RLS policy from Setup & Deploy: public `INSERT` is allowed; no public read.

### D. Success / failure feedback
- On success: a distinct **success message** (e.g. green + check icon, "Message sent!").
- On failure: a distinct **failure message** (e.g. red + X icon, "Something went wrong").
- Form fields are **cleared/reset** after a successful submission.
- The success message **auto-dismisses** after a few seconds or on the next interaction.
- While submitting, the button shows a pending state (e.g. disabled + "Sending…") to prevent double
  submits.

### E. Layout & consistency
- Consistent with the site: warm-brown surfaces, sage as the focal/interactive color (submit button,
  focus rings), terracotta accents; no white surfaces (per `ai-spec §6`).
- Optional intro line inviting contact; reuse `Reveal` for entrance motion; honor
  `prefers-reduced-motion`.

---

## 3. User Flow

```
Navigate to Contact (view switches; URL stays at root)
   → user fills name, email, message
   → invalid (empty / bad email) → inline errors shown; submit blocked
   → valid → button → "Sending…" → INSERT into Supabase messages
        → success: green "Message sent!", fields reset, message auto-dismisses
        → failure: red "Something went wrong", fields kept so they can retry
   → header/footer persist
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/pages/Contact.jsx` | Composes the page + form. |
| `src/components/ContactForm.jsx` | Fields, validation, submit, feedback state. |
| `src/components/FormField.jsx` *(optional)* | Reusable labeled input + error slot. |
| `src/lib/supabaseClient.js` | The single client used for the `INSERT`. |
| `src/i18n/en.json`, `fr.json` | Labels, placeholders, error + feedback messages. |

- Table used: **`messages`** (`name`, `email`, `message`, `created_at`).
- No React `<form>` submit-to-URL; use an `onClick`/`onSubmit` handler that prevents default and calls
  Supabase (per the artifact/React conventions and to keep it a controlled SPA action).

---

## 5. Data, Validation & Expected Behavior

- **Controlled inputs:** `name`, `email`, `message` in component state.
- **Validation rules:** non-empty for all three; email matches a standard format check. Validate on
  submit (and optionally on blur); show per-field or summary errors.
- **Submit handler:**
  1. Validate; if invalid, show errors and stop.
  2. Set a submitting state (disable button).
  3. `await supabase.from('messages').insert({ name, email, message })`.
  4. On no error → success state, reset fields, start auto-dismiss timer.
  5. On error → failure state, keep field values.
- **Fallback:** if the Supabase client is unconfigured (env vars missing — see Setup & Deploy), show a
  friendly disabled/error state instead of throwing.
- **All user-facing text** (labels, placeholders, errors, feedback) resolves through i18n keys in
  **both** `en.json` and `fr.json`.
- **Colors** via tokens only. **Accessibility:** labels tied to inputs (`htmlFor`/`id`); errors linked
  via `aria-describedby`; feedback in an `aria-live` region so it's announced.
- **Responsive:** form is single-column and comfortable on mobile; nothing overflows (`ai-spec §7`).

---

## 6. Acceptance Criteria (how to verify it works)

**Fields**
- [ ] Name (text), email (`type="email"`), and message (textarea) are present.
- [ ] All fields have visible labels.

**Validation**
- [ ] Empty fields block submission.
- [ ] Invalid email format is rejected.
- [ ] Validation errors are visibly displayed.
- [ ] Submit is disabled/rejected while invalid.

**Submission**
- [ ] A valid submit INSERTs into the `messages` table with `name`, `email`, `message`.
- [ ] It uses the client from `src/lib/supabaseClient.js`.

**Feedback**
- [ ] Success message is shown and visually distinct (e.g. green/check).
- [ ] Failure message is shown and visually distinct (e.g. red/X).
- [ ] Fields reset after success.
- [ ] Success message auto-dismisses after a few seconds or on next interaction.

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All text present in both `en.json` and `fr.json`.
- [ ] Keyboard-accessible; labels + `aria-live` feedback; no console errors.

---

## 7. Notes for the Spec-Driven Loop

- This is the first feature to exercise Supabase end-to-end — after building, verify a real row lands
  in the `messages` table (Supabase dashboard) and that public read is blocked by RLS.
- Success/failure states are a graded item: make them obviously distinct (color + icon), not just a
  text swap.
- Keep the submit button in the sage focal color; the pending state prevents double-inserts.
- Test the unconfigured-Supabase fallback so a missing env var degrades gracefully rather than crashing
  the page.