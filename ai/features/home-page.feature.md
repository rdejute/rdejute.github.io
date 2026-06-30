# Feature Specification — Home Page

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/home-page.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the landing page — the default view at the root URL — that introduces Raina, then
presents her technical skills and her soft skills/talents in clear, visually distinct sections. It is
the first impression and sets the warm, empathy-led tone for the whole site.

**In scope:**
- Root-path landing: Home is the default active view.
- Introduction (hero): name, role/tagline, short intro paragraph, primary calls-to-action.
- Technical skills section: at least 3 skills, each with an icon and supporting text, in an organized
  grid/cards.
- Soft skills / talents section: at least 3, same icon + supporting-text treatment.
- At least three distinct, visually separated sections.
- At least two AI-generated images, with alt text and the tool documented.

**Out of scope (handled elsewhere):**
- The header, footer, nav, theme toggle, language switcher → Layout feature.
- Where the CTAs *lead* (Portfolio, Contact pages) → those pages' specs. This feature only wires the
  CTA buttons to switch the active view.
- Education / work / projects content → Portfolio page feature.

---

## 2. Requirements Breakdown

### A. Root path
- The Home page is accessible at the root URL (`/`) and is the **default** landing view.
- Per `ai-spec.md §3.1`, "Home" is the default active view; the URL stays at the root.

### B. Introduction (hero)
- The **name** ("Raina DeJute") is prominently displayed (display font, largest type on the page).
- A **role, title, or short tagline** is visible (e.g. "AI-native full-stack developer with a
  front-end heart" and/or the italic tagline "Empathy is my framework.").
- A **brief introductory paragraph** describes who she is.
- Primary CTAs (e.g. "View my work →" and "Get in touch") that switch the active view to Portfolio
  and Contact respectively, using the app-level view state from the Layout feature.
- *Optional, from the mockup:* small stat chips (e.g. a focus area, a personal stat). Content is
  Raina's choice and lives in i18n; the layout just supports them.

### C. Technical skills section
- At least **3** technical skills listed or described.
- **Each** skill has an **icon** and **supporting text** (a sentence, not a single word).
- Visually organized as cards / a grid / an icon list.
- Source content from Raina's real stack — e.g. React & React Native, Spring Boot & Node, SQL &
  MongoDB, JavaScript, AI-native spec-driven workflow, Git/CI-CD. Choose at least 3.

### D. Soft skills / talents section
- At least **3** soft skills or talents listed or described.
- **Each** has an **icon** and **supporting text** (a sentence, not a single word).
- Visually organized the same way as technical skills.
- Source content from her values — e.g. empathy / deep listening, anticipating needs before they're
  voiced, resilience / starting over, human connection, adaptability. Choose at least 3.

### E. Layout & section separation
- At least **3 distinct sections** (Introduction + Technical Skills + Soft Skills satisfies this).
- Sections are **visually separated** using spacing, alternating surfaces (`--surface` /
  `--surface-alt`), or dividers (`--border`). No white surfaces (per `ai-spec §6`).

### F. AI-generated images
- At least **2** images on the page were generated with an AI tool.
- Images are **relevant** to the content/theme (e.g. an AI portrait in the hero; a thematic or
  decorative image for a section).
- Each image has appropriate **`alt`** text.
- The **AI tool used is documented** (a code comment, `Research.md`, or this spec).

---

## 3. User Flow

```
Site loads → Home is the default view (URL at root)
   → visitor reads the intro (who she is, the tagline)
   → clicks "View my work →"  → active view switches to Portfolio
   → or "Get in touch"        → active view switches to Contact
   → scrolls: Technical Skills section, then Soft Skills section
   → header/footer persist (Layout feature)
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/pages/Home.jsx` | Composes the hero + the two skills sections. |
| `src/components/Hero.jsx` | Name, tagline, intro paragraph, CTAs, hero image, optional stat chips. |
| `src/components/SkillGrid.jsx` | Reusable grid; renders a list of skills as cards. |
| `src/components/SkillCard.jsx` | One skill: icon + title + supporting sentence. |
| `public/images/` | The AI-generated image assets used on the page. |
| `src/i18n/en.json`, `fr.json` | All Home copy and skill text. |

- CTAs call the active-view setter provided by the Layout/`App` (no URL change).
- Icons come from the project's icon approach (an icon library or inline SVGs); every skill has one.
- No Supabase interaction in this feature.

---

## 5. Data, Validation & Expected Behavior

- **Skill data** as arrays so the grid renders from a single source, e.g.:
  `{ key, icon, titleKey, descKey }` — one array for technical, one for soft. `titleKey`/`descKey`
  resolve through i18n (no hardcoded copy). Minimum length 3 each.
- **Hero copy** (name, tagline, intro paragraph, CTA labels, optional chips) all resolve through i18n
  keys present in both `en.json` and `fr.json`.
- **Images:** referenced from `public/images/`; each `<img>` has meaningful `alt`. The generating tool
  is recorded (comment or `Research.md`).
- **Colors** via tokens only (`--accent-cool` sage as the focal/interactive color; `--accent-warm`
  terracotta for the tagline/eyebrow; warm-brown surfaces for section bands). No raw hex.
- **Responsive:** sections stack vertically on mobile; skill grids collapse to fewer columns; the hero
  image scales and never overflows (`ai-spec §7`).

---

## 6. Acceptance Criteria (how to verify it works)

**Root path**
- [ ] Home renders by default at the root URL and is the landing view.

**Introduction**
- [ ] The name is prominently displayed.
- [ ] A role/title/tagline is visible.
- [ ] A brief intro paragraph describes who she is.
- [ ] CTAs switch the active view to Portfolio and Contact without changing the URL.

**Technical skills**
- [ ] At least 3 technical skills are present.
- [ ] Each has an icon and a supporting sentence (not a single word).
- [ ] The section is visually organized (cards/grid/list).

**Soft skills / talents**
- [ ] At least 3 soft skills/talents are present.
- [ ] Each has an icon and a supporting sentence.
- [ ] The section is visually organized.

**Layout**
- [ ] At least 3 distinct sections exist.
- [ ] Sections are visually separated (spacing, surfaces, or dividers); no white surfaces.

**AI images**
- [ ] At least 2 AI-generated images are on the page, relevant to the content.
- [ ] Each image has meaningful `alt` text.
- [ ] The AI tool used is documented.

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All copy and skill text present in both `en.json` and `fr.json`.
- [ ] Keyboard-accessible CTAs; images have alt text; no console errors.

---

## 7. Notes for the Spec-Driven Loop

- Your mockup is the design reference for the hero — name, eyebrow ("FRONT-END FIRST · EMPATHY-LED"),
  tagline, intro paragraph, CTAs, and the AI portrait. Reuse that content rather than reinventing it.
- The two AI images are also a rubric item *here* — the hero portrait can be one; pick a second that
  genuinely supports the page (a thematic section image or decorative element), and log the tool used
  in `Research.md`.
- Build `SkillCard` / `SkillGrid` reusably — the Portfolio page can reuse the same card pattern for
  its project entries.
- Keep skill descriptions in *your* voice (warm, specific) — generic skill blurbs are the fastest way
  to make a portfolio read as templated.