# Feature Specification — Links Page

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/link-page.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the Links page — a curated set of link cards (Raina's profiles plus a few sites she
values), each with an image, title, short description, and a URL that opens in a new tab. Reuses the
card, reveal, and glow patterns from Home/Portfolio.

**In scope:**
- At least **3** link cards, each with image + title + 1–3 sentence description + new-tab URL.
- Confirmed profiles (LinkedIn, GitHub) plus at least one "site I value" for curation.
- At least **one** AI-generated image on the page, with alt text and the tool documented.
- At least one clearly separated section; consistent motion.

**Out of scope (handled elsewhere):**
- Header, footer, nav, theme toggle, language switcher → Layout feature. *(The footer's social icons
  are separate from these curated cards.)*
- Contact form → Contact page feature.

---

## 2. Requirements Breakdown

### A. Link cards
- Each link is a **card / structured item** containing:
  - an **image** (thumbnail, preview, logo, or AI thematic image),
  - a **title / name**,
  - a **short description** (1–3 sentences),
  - a **clickable URL that opens in a new tab**.
- At least **3** links are displayed.

### B. Content (confirmed + candidates)
Confirmed (use these exact URLs):
- **LinkedIn** — `https://www.linkedin.com/in/rainadejute` — e.g. "Connect with me professionally —
  my background, roles, and the human-services-to-developer story in full."
- **GitHub** — `https://github.com/rdejute` — e.g. "Browse the code behind my projects, including this
  portfolio."

Add at least one curated "site I value" so the page is a genuine recommendation hub (matches the
brief's "websites you like"). Candidates tied to your interests — pick 1–2:
- **CodeBoxx** — the program that shaped this chapter.
- **Into The Cryptoverse** (Benjamin Cowen) — the analytical work that inspired your crypto dashboard.
- A dev resource you actually use (e.g. MDN, React docs, freeCodeCamp).
- A faith or writing resource that matters to you (your call on how personal the page gets).

### C. AI-generated image
- At least **1** image on the page is generated with an AI tool.
- Images complement the page (card thumbnail, section header, or decorative element).
- Each image has appropriate **`alt`** text; the **AI tool used is documented** (comment / `Research.md`).
- *(The grading sheet lists a minimum of one AI image for this page.)*

### D. Layout & separation
- The page is a clean, organized section of cards (grid or list).
- Visually consistent with the rest of the site: warm-brown surfaces, sage focal accents, no white
  surfaces (per `ai-spec §6`).

### E. Motion (consistent with Home/Portfolio)
- Reuse the shared scroll-reveal (`Reveal` / `useReveal`); cards fade-and-rise into view.
- Optional sage glow + hover lift on cards, matching the other pages; honor `prefers-reduced-motion`.

---

## 3. User Flow

```
Navigate to Links (view switches; URL stays at root)
   → grid/list of link cards (image, title, description)
   → click a card / its link → opens the destination in a NEW TAB (site stays open behind it)
   → cards reveal on scroll; header/footer persist
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/pages/Links.jsx` | Composes the link grid. |
| `src/components/LinkCard.jsx` | One link: image, title, description, new-tab link (reuses card pattern). |
| `src/components/Reveal.jsx` / `useReveal` | Shared scroll-reveal (reused). |
| `public/images/` | Link thumbnails / previews / AI images. |
| `src/i18n/en.json`, `fr.json` | Titles and descriptions. |

- No Supabase interaction in this feature.
- Reuse the `ProjectCard`/`SkillCard` styling family so cards feel native to the site.

---

## 5. Data, Validation & Expected Behavior

- **Link data** as an array: `{ key, title, url, descKey, image, imageAlt, isAIImage }`. Minimum 3
  entries.
- **New-tab behavior:** links use `target="_blank"` **with `rel="noopener noreferrer"`** (security — a
  `_blank` link without `noopener` exposes `window.opener`). This is required, not optional.
- **Titles/descriptions** resolve through i18n keys present in **both** `en.json` and `fr.json`.
  Descriptions are 1–3 sentences.
- **Images** from `public/images/`; each has meaningful `alt`. At least one is AI-generated; tool
  documented.
- **Colors** via tokens only (sage focal, terracotta accent, warm-brown surfaces). No raw hex.
- **Accessibility:** each card's link is keyboard-focusable with a clear accessible name (the title, or
  an `aria-label`); an external-link cue (icon or "opens in new tab") is good practice.
- **Responsive:** grid collapses columns on mobile; images scale and never overflow (`ai-spec §7`).

---

## 6. Acceptance Criteria (how to verify it works)

**Link cards**
- [ ] At least 3 links are displayed, each as a card/structured item.
- [ ] Each card has an image, a title, and a 1–3 sentence description.
- [ ] Each URL opens in a new tab and uses `rel="noopener noreferrer"`.
- [ ] LinkedIn (`/in/rainadejute`) and GitHub (`/rdejute`) are present with correct URLs.

**AI image**
- [ ] At least 1 AI-generated image is on the page with appropriate `alt`; tool documented.

**Layout**
- [ ] Cards are organized and visually consistent with the site; no white surfaces.

**Motion**
- [ ] Cards reveal on scroll via the shared observer; reduced-motion renders everything visible.

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All titles/descriptions present in both `en.json` and `fr.json`.
- [ ] Links are keyboard-accessible; images have alt text; no console errors.

---

## 7. Notes for the Spec-Driven Loop

- Don't just mirror the footer — add at least one genuine recommendation so the page reads as curated,
  not redundant. It's a small chance to show personality (what you read, who influenced your work).
- `rel="noopener noreferrer"` on every external `_blank` link is a real security detail a coach may
  check — don't skip it.
- Reuse `LinkCard` from the same card family as projects/skills so the site stays cohesive.
- Log the AI image tool in `Research.md` alongside the others.