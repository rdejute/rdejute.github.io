# Feature Specification — Back Office (Secret, Auth-Gated)

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/back-office.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the admin Back Office — an auth-gated page that lists the contact `messages`, lets the
admin view a full message in a modal, delete messages, and log out. Reachable only with a valid
session; never in navigation.

**In scope:**
- An auth-gated `#backoffice` route (redirects to login when unauthenticated).
- Fetch + display all `messages` in a table (Name, Email, Date, Actions), newest first.
- View-message modal (full details) with close behavior.
- Delete a message (instant removal from the table).
- Logout.

**Out of scope (handled elsewhere):**
- Login + auth entry + Konami Code → Login feature.
- The `messages` table, RLS, admin user → Setup & Deploy feature.
- Contact form (writes the rows) → Contact page feature.

---

## 2. Requirements Breakdown

### A. Auth-gated route
- Navigating to `#backoffice` **while authenticated** renders the Back Office.
- Navigating there **while not authenticated** redirects to the login page.
- The page verifies the session **before** rendering content.
- The route is in **no** public navigation (header, footer, mobile nav).

### B. Messages table
- Fetch **all** rows from `messages` and display them.
- If the fetch fails → show an **error** message.
- If the table is empty → show an empty state (e.g. "No messages yet").
- Render a table with columns: **Name, Email, Date, Actions**.
- One row per message; ordered by **`created_at` descending** (newest first).
- Each row has a **delete** control (trash icon or "Delete").
- After deleting, the row **disappears from the table instantly**.

### C. View-message modal
- Clicking a row or a "View" button opens a **modal** with the full message:
  - sender **name** and **email**,
  - **date and time**,
  - the full **message text**.
- The modal has a **close** control (X or "Close").
- Clicking outside the modal or pressing **Escape** closes it.

### D. Logout
- A **logout** button is visible on the page.
- Clicking it calls **`supabase.auth.signOut()`** and fully clears the session.
- After logout, the user is redirected to the **Home** or **Login** page.

---

## 3. User Flow

```
Go to #backoffice
   → no valid session → redirect to Login
   → valid session → verify, then render
        → fetch messages (order by created_at desc)
             → empty → "No messages yet"
             → error → error message
             → rows → table: Name | Email | Date | Actions
        → click row / "View" → modal (name, email, date+time, full text)
             → X / click-outside / Esc → close
        → click Delete → row removed instantly (delete from Supabase)
        → click Logout → signOut() → redirect Home/Login
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/pages/BackOffice.jsx` | Guards session, fetches + renders the table. |
| `src/components/MessagesTable.jsx` | Table rows: Name, Email, Date, Actions. |
| `src/components/MessageModal.jsx` | Full-message modal + close behaviors. |
| `src/components/RequireAuth.jsx` *(or guard logic)* | Session check → render or redirect. |
| `src/lib/supabaseClient.js` | `select`, `delete`, `auth.signOut`, session checks. |
| `src/i18n/en.json`, `fr.json` | Column headers, empty/error text, buttons, modal labels. |

- Table used: **`messages`**. Reads/deletes require an **authenticated** session (RLS from Setup &
  Deploy allows `SELECT`/`DELETE` for `authenticated` only).

---

## 5. Data, Validation & Expected Behavior

- **Guard:** on mount, check `supabase.auth.getSession()`; if none → redirect to login; also subscribe
  to `onAuthStateChange` so a logout elsewhere updates state.
- **Fetch:** `supabase.from('messages').select('*').order('created_at', { ascending: false })`. Handle
  loading, empty, and error states explicitly.
- **Delete:** `supabase.from('messages').delete().eq('id', id)`; on success, remove the row from local
  state so it disappears instantly (optimistic or post-confirm — either, but the table must update
  without a manual refresh).
- **Modal:** holds the selected message; closes on X, backdrop click, and `Escape` (keydown listener).
- **Logout:** `supabase.auth.signOut()` → clear state → redirect.
- **Date formatting:** render `created_at` in a readable local format (date in the table; date + time
  in the modal).
- **All user-facing text** via i18n keys in **both** `en.json` and `fr.json`.
- **Colors** via tokens only (sage focal for actions/buttons; a clear destructive cue for delete).
  **Accessibility:** the modal traps focus, has a labelled dialog role, returns focus on close;
  table is semantic; buttons have accessible names.
- **Responsive:** the table stays usable on mobile (horizontal scroll or a stacked/card layout); the
  modal fits small screens (`ai-spec §7`).

---

## 6. Acceptance Criteria (how to verify it works)

**Auth gate**
- [ ] `#backoffice` while authenticated renders the page.
- [ ] `#backoffice` while unauthenticated redirects to login.
- [ ] The session is verified before content renders.
- [ ] The route is in no public navigation.

**Table**
- [ ] All messages are fetched and displayed with columns Name, Email, Date, Actions.
- [ ] Rows are ordered by `created_at` descending.
- [ ] A failed fetch shows an error; an empty table shows an empty-state message.
- [ ] Each row has a delete control; deleting removes the row instantly.

**Modal**
- [ ] Clicking a row / "View" opens a modal with name, email, date+time, and full text.
- [ ] The modal closes via X, outside click, and Escape.

**Logout**
- [ ] A logout button calls `supabase.auth.signOut()` and clears the session.
- [ ] After logout, the user is redirected to Home or Login.

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All text present in both `en.json` and `fr.json`.
- [ ] Modal is keyboard-accessible (focus trap, Escape, focus return); no console errors.

---

## 7. Notes for the Spec-Driven Loop

- This closes the Supabase loop: the Contact form writes rows, the Back Office reads and deletes them.
  After building, test the full path — submit a contact message, then see it appear here, view it, and
  delete it.
- Confirm RLS actually enforces auth: an unauthenticated read of `messages` should return nothing.
- Reuse the auth/session logic from the Login feature — implement it once, share it.
- The delete should update the UI without a manual refresh; that "disappears instantly" behavior is an
  explicit rubric item.