# Feature Specification — Portfolio Page

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/portfolio-page.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the portfolio/résumé page — education, work experience, and a curated set of projects,
plus a downloadable résumé PDF. The on-page education + work sections *are* the résumé content; the
PDF is a downloadable mirror of it. Reuses the card, reveal, and glow patterns from the Home page.

**In scope:**
- Education section (reverse chronological).
- Work experience section (reverse chronological) — human services as **one combined entry**, plus the
  current CodeBoxx coordinator role.
- Projects section — **4–5** curated projects, each with name, tech, description, and image; visuals a
  **mix of real screenshots and AI-generated thematic images**.
- A **downloadable résumé PDF** (prominent button), mirroring the on-page education + work content.
- At least 3 distinct, visually separated sections.
- At least two AI-generated images, with alt text and the tool documented.
- Motion consistent with Home (scroll-reveal; optional sage glow).

**Out of scope (handled elsewhere):**
- Header, footer, nav, theme toggle, language switcher → Layout feature.
- Home hero / skills content → Home page feature.
- Contact form → Contact page feature.

---

## 2. Requirements Breakdown

### A. Education section
- At least one educational institution listed; **reverse chronological** (most recent first).
- Each entry includes: **institution name, degree/program, and dates**.
- Content:
  - **CodeBoxx Academy** — Full-Stack Development Program — *March 2026-july 2026*.
  - Add any prior education if desired - diploma 2016, certified recovery peer specialist 2025.

### B. Work experience section
- At least one experience; **reverse chronological**.
- Each entry includes: **title/role, organization, dates, and a description** that mentions
  responsibilities or achievements.
- Content (two entries, per your choice to combine human services):
  - **Student Success Coordinator — CodeBoxx Academy** — *(current; dates)* — supporting students
    through the program; describe responsibilities/impact.
  - **Human Services** *(combined entry)* — Salvation Army (progressing to **Resident Manager**) and
    Volunteers of America (**Peer Support Specialist**) — *(january 2023-jan 2026)* — one entry framing the
    human-services career; description of responsibilities and achievements (leadership, peer support,
    creating community structures for vulnerable populations).

### C. Projects section
- **4–5** projects; each entry includes: **project name, tech, description, and image**.
- Description explains **what the project is** and **its purpose**.
- Visuals: a **mix** of real screenshots and AI-generated thematic images (the AI ones count toward
  §2.E).
- Candidate set (finalize 4–5):
  - **Crypto Analytics Dashboard** — React, Recharts, CoinGecko + Alternative.me APIs — a logarithmic-
    regression DCA risk model (0–1 score) turning noisy market data into a readable signal. *(real
    screenshot)*
  - **Route-Aware Grocery Tool** — *(tech)* — generates a grocery list and sequences it to match the
    real path through the store. *(screenshot or AI thematic)*
  - **Rocket Food Delivery (Mobile)** — React Native / Expo consuming a Spring Boot backend — auth,
    restaurant list, menu, navigation. *(real screenshot)*
  - **This Portfolio** — React + Vite, Supabase, GitHub Actions — AI-native, spec-driven build. *(real
    screenshot — a nice meta touch)*
  - *Optional 5th for range:* a back-end piece (e.g. the Spring Boot back-office) or another personal
    project. *(AI thematic image)*

### D. Downloadable résumé (PDF)
- A **prominent, clearly labeled** download button (e.g. "Download résumé (PDF)").
- Links to a static PDF at `public/resume.pdf`; clicking downloads/opens it.
- The on-page education + work sections are the résumé content; the **PDF mirrors them** — keep them in
  sync.
- *(Note: the coach specifically called out a missing CV-download button as a common miss — make this
  obvious, not buried.)*

### E. AI-generated images
- At least **2** AI-generated images integrated into the page, complementing the résumé content
  (e.g. section headers, decorative elements, an avatar, or the AI thematic project images).
- Each has appropriate **`alt`** text.
- The **AI tool used is documented** (comment or `Research.md`).

### F. Layout & section separation
- At least **3 distinct sections** (Education + Work + Projects satisfies this).
- Sections visually separated via spacing, alternating surfaces (`--surface` / `--surface-alt`), or
  dividers (`--border`). No white surfaces (per `ai-spec §6`).

### G. Motion (consistent with Home)
- Reuse the shared scroll-reveal (`Reveal` / `useReveal`) so entries fade-and-rise into view.
- Optional sage glow behind project cards, matching Home; honor `prefers-reduced-motion`.

---

## 3. User Flow

```
Navigate to Portfolio (view switches; URL stays at root)
   → Education (reverse chronological)
   → Work experience (CodeBoxx coordinator, then combined human-services entry)
   → Projects grid (4–5 cards: name, tech, description, image)
   → "Download résumé (PDF)" → downloads /resume.pdf
   → entries reveal on scroll; header/footer persist
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/pages/Portfolio.jsx` | Composes Education + Work + Projects + résumé download. |
| `src/components/TimelineEntry.jsx` | One education/work entry (title, org, dates, description). |
| `src/components/ProjectGrid.jsx` | Renders the project list. |
| `src/components/ProjectCard.jsx` | One project: image, name, tech, description (reuses card pattern). |
| `src/components/ResumeDownload.jsx` | The download button → `public/resume.pdf`. |
| `src/components/Reveal.jsx` / `useReveal` | Shared scroll-reveal (reused from Home). |
| `public/resume.pdf` | The downloadable résumé. |
| `public/images/` | Project screenshots + AI-generated images. |
| `src/i18n/en.json`, `fr.json` | All section copy, entries, project text. |

- No Supabase interaction in this feature.
- Reuse Home's `SkillCard`/grid + `Reveal` patterns rather than re-inventing.

---

## 5. Data, Validation & Expected Behavior

- **Education / work** as arrays of `{ key, titleKey, orgKey, dates, descKey }`, rendered newest-first.
  Ordering is explicit (don't rely on array order alone — sort or order intentionally).
- **Projects** as an array of `{ key, nameKey, tech, descKey, image, imageAlt, isAIImage }` — 4–5
  entries. `tech` is a short list/labels; `descKey` covers what + purpose.
- **All user-facing text** resolves through i18n keys present in **both** `en.json` and `fr.json`.
- **Résumé PDF** referenced from `public/resume.pdf`; the download control uses a real anchor with
  `download` semantics; the PDF mirrors the on-page education + work content.
- **Images:** screenshots and AI images from `public/images/`; each has meaningful `alt`. AI tool
  documented; at least two images are AI-generated.
- **Colors** via tokens only (sage focal, terracotta accent, warm-brown surfaces). No raw hex.
- **Responsive:** sections stack on mobile; project grid collapses columns; images scale and never
  overflow (`ai-spec §7`).

---

## 6. Acceptance Criteria (how to verify it works)

**Education**
- [ ] At least one institution; reverse chronological.
- [ ] Each entry has institution name, degree/program, and dates.

**Work**
- [ ] At least one experience; reverse chronological.
- [ ] Each entry has title/role, organization, dates, and a description with responsibilities/
      achievements.
- [ ] Human services appears as a single combined entry; the CodeBoxx coordinator role is present.

**Projects**
- [ ] 4–5 projects, each with name, tech, description, and image.
- [ ] Each description explains what the project is and its purpose.
- [ ] Visuals are a mix of real screenshots and AI-generated thematic images.

**Résumé**
- [ ] A prominent, clearly labeled download button downloads `public/resume.pdf`.
- [ ] On-page education + work content mirrors the PDF.

**AI images**
- [ ] At least 2 AI-generated images complement the content, each with `alt` text; tool documented.

**Layout**
- [ ] At least 3 distinct, visually separated sections; no white surfaces.

**Motion**
- [ ] Entries reveal on scroll via the shared observer; reduced-motion renders everything visible.

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All copy present in both `en.json` and `fr.json`.
- [ ] Keyboard-accessible download + links; images have alt text; no console errors.

---

## 7. Notes for the Spec-Driven Loop

- The on-page résumé and the PDF must stay in sync — when you update one, update the other. Consider
  generating the PDF from the same content so they can't drift.
- Make the download button obvious (its own clear control near the top of the page or after Work) —
  this is a commonly-missed rubric item.
- Reuse `Reveal` and the card pattern from Home so the two pages feel like one site, not two.
- Keep project descriptions in your voice and outcome-focused ("turns noisy market data into a signal
  a person can actually read") rather than feature lists — same principle that made the pitch land.
- Finalize the 4–5 project set and which get real screenshots vs. AI thematic images before building,
  and log the AI tool used in `Research.md`.