# Feature Specification — Home Page

> **Use together with `./ai/ai-spec.md`.** This file is the task; the spec is the global context.
> File location: `./ai/features/home-page.feature.md`

---

## 1. Feature Goal & Scope

**Goal:** Build the landing page — the default view at the root URL — that introduces Raina with a
fast, credential-forward hero, tells the human-services-to-developer story as testimony, and presents
her technical skills and team skills in clear, visually distinct sections. Subtle motion (a breathing
sage glow and scroll-reveal) gives the page life without noise.

**In scope:**
- Root-path landing: Home is the default active view.
- Introduction (hero): name, role/tagline, a short credential-forward overview, primary CTAs, AI
  portrait.
- "Why I Build": a testimony/about section (the human-services throughline).
- Technical skills section: at least 3 skills, each with an icon and supporting text, in an organized
  grid/cards.
- "What I bring to a team": at least 3 team skills/talents, same icon + supporting-text treatment.
- At least three distinct, visually separated sections.
- At least two AI-generated images, with alt text and the tool documented.
- Subtle motion: dynamic sage glow + scroll-reveal, both honoring `prefers-reduced-motion`.

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
- A **role / tagline** is visible (e.g. the eyebrow "FRONT-END FIRST · EMPATHY-LED" and the italic
  tagline "Empathy is my framework.").
- A short, **credential-forward overview paragraph** beside the hero image. Use exactly:
  > "Full-stack developer, front-end focused. I came up through human services before tech, and I
  > bring that same discipline to delivery — shipping projects on time, scoped to what the client
  > actually needs, not what's easy to build. React on the front, Spring Boot and Node behind it,
  > AI-native from spec to ship."
  *(This is the résumé-in-three-breaths; it must NOT duplicate the "Why I Build" testimony below.)*
- Primary CTAs ("View my work →" → Portfolio, "Get in touch" → Contact) that switch the active view
  via the app-level view state (no URL change).
- The hero portrait is an AI image (counts toward the two-image requirement) and carries the glow +
  optional "lift" treatment (see §2.H). It is a **single** photo file, **graded per theme** via CSS
  only: untouched in dark, and cooled/softened in light so it doesn't read too warm against the tan
  background (see §2.H).
- *Optional, from the mockup:* small stat chips. Content is Raina's choice; lives in i18n.

### C. "Why I Build" (testimony / about)
- A distinct section telling the human-services-to-developer throughline **as testimony, not a
  restatement of the hero.** Use exactly:
  > "Before I wrote code, I spent years in human services — walking with people through recovery,
  > crisis, and starting over. I learned to hear what someone needs before they can say it, and to
  > build the conditions for them to feel safe. I do the same work now with different tools: I shape
  > an interface the way I once arranged a room — so the person on the other side feels seen, and a
  > little less stuck. That instinct is the throughline from who I was to what I build."
- **Do not use the word "empathy"** in this section (see §2.I on phrase frequency).

### D. Technical skills section
- At least **3** technical skills listed or described.
- **Each** skill has an **icon** and **supporting text** (a sentence, not a single word).
- Visually organized as cards / a grid / an icon list.
- Content from Raina's real stack — e.g. React & React Native, Spring Boot & Node, SQL & MongoDB,
  JavaScript, AI-native spec-driven workflow, Git/CI-CD. Choose at least 3.

### E. "What I bring to a team" (team skills / talents)
- At least **3** skills/talents, each with an **icon** and **supporting text** (a sentence). These are
  soft/professional skills and satisfy the rubric's soft-skills requirement.
- Final card set (four cards):
  - **Resilience** — retained exactly as currently implemented (do not change copy or icon).
  - **Communication** — speech/chat icon.
    > "Years of sitting with people in hard conversations taught me to be clear, calm, and honest —
    > to raise a blocker early and explain a tradeoff without the jargon."
  - **Accountability** — shield-check / verified icon.
    > "I work AI-native, but I own every line. I read what I generate, make sure I understand it, and
    > take responsibility for what ships. The tool accelerates me; it doesn't excuse me."
  - **Self-direction** — compass / rocket icon.
    > "I don't wait to be handed a problem. I built a crypto risk dashboard and a route-aware grocery
    > tool on my own — because I saw a need and started."

### F. Layout & section separation
- At least **3 distinct sections** (Hero + Why I Build + Technical Skills + What I Bring to a Team
  exceeds this).
- Sections are **visually separated** using spacing, alternating surfaces (`--surface` /
  `--surface-alt`), or dividers (`--border`). No white surfaces (per `ai-spec §6`).

### G. AI-generated images
- At least **2** images generated with an AI tool, relevant to the content/theme.
- Each image has appropriate **`alt`** text (decorative layers use `alt=""`).
- The **AI tool used is documented** (code comment or `Research.md`).

### H. Motion & interaction
- **Dynamic glow:** a soft, breathing **sage** (`--accent-cool`) radial bloom behind the hero portrait
  and each skill/section card — a soft bloom, never a hard ring. Slow breathe (~6s). Cards get a gentle
  hover lift (translateY ≈ -3px) and a slight glow-intensity increase on hover.
- **Scroll-reveal:** sections and cards fade-and-rise into view on entering the viewport, via
  `IntersectionObserver` (no external library). Start `opacity:0; translateY(16px)`; on intersect add
  `.is-visible` → transition to `opacity:1; translateY(0)` over ~500ms ease-out; unobserve after first
  reveal. Stagger cards in a row by ~60–90ms each.
- **Reduced motion:** all of the above is wrapped in `@media (prefers-reduced-motion: no-preference)`.
  Under `reduce`, glows are static and all content renders visible immediately with no transform.
- **Per-theme portrait grade (CSS-filter only, one photo file):** the dark theme uses the original
  image untouched (`filter: none`). In **light** theme the hero `<img>` gets a CSS `filter` that
  cools and softens it (reduce saturation/warmth, slightly lower contrast) so it sits naturally on
  the tan background — tuned so skin tones stay natural (no grey/green shift). A ~200ms `filter`
  transition smooths the change when toggling themes. This owns only the `filter` property; the glow,
  breathing animation, `alt`, and reduced-motion behavior are unchanged.
- *Optional phase-2 (not required):* an iOS-style "lift the subject" treatment on the portrait
  (transparent-PNG cutout layered over a dimmed background with a sage silhouette edge-glow).

### I. "Empathy is my framework" frequency
- The phrase "Empathy is my framework" appears **at most twice** on the Home page (the hero and the
  footer). It must not appear in the "Why I Build" section or the cards.

---

## 3. User Flow

```
Site loads → Home is the default view (URL at root)
   → hero: name, tagline, quick credential overview; AI portrait with soft glow
   → "View my work →" → Portfolio   |   "Get in touch" → Contact (view switches, URL unchanged)
   → scroll: "Why I Build" testimony, Technical Skills, "What I bring to a team"
   → sections + cards fade-and-rise as they enter view; glows breathe gently
   → header/footer persist (Layout feature)
```

---

## 4. Interfaces Involved

| Component | Responsibility |
|---|---|
| `src/pages/Home.jsx` | Composes hero + Why I Build + the two skills sections. |
| `src/components/Hero.jsx` | Name, tagline, credential paragraph, CTAs, glowing portrait, chips. |
| `src/components/WhyIBuild.jsx` | The testimony/about section. |
| `src/components/SkillGrid.jsx` | Reusable grid; renders a list of skills as cards. |
| `src/components/SkillCard.jsx` | One skill: icon + title + supporting sentence; glow + hover lift. |
| `src/components/Reveal.jsx` *(or `useReveal` hook)` | Shared `IntersectionObserver` scroll-reveal. |
| `public/images/` | AI-generated image assets. |
| `src/i18n/en.json`, `fr.json` | All Home copy and skill text. |

- CTAs call the active-view setter from the Layout/`App` (no URL change).
- Icons come from the project's icon approach; every skill has one.
- No Supabase interaction in this feature.

---

## 5. Data, Validation & Expected Behavior

- **Skill data** as arrays so each grid renders from a single source: `{ key, icon, titleKey, descKey }`
  — one array for technical, one for team skills. `titleKey`/`descKey` resolve through i18n. Minimum
  length 3 each (team-skills set is the four cards in §2.E).
- **Hero + Why I Build + CTA copy** resolve through i18n keys present in **both** `en.json` and
  `fr.json`. New/changed keys: hero overview paragraph, Why-I-Build paragraph, Communication,
  Accountability, Self-direction.
- **Images:** referenced from `public/images/`; each meaningful image has `alt`; decorative layers use
  `alt=""`. Generating tool recorded (comment or `Research.md`).
- **Colors** via tokens only (`--accent-cool` sage focal/glow; `--accent-warm` terracotta for
  tagline/eyebrow; warm-brown surfaces for bands). No raw hex.
- **Motion:** glow via a blurred radial-gradient pseudo-element behind the element; scroll-reveal via a
  single reused observer; both gated on `prefers-reduced-motion`.
- **Responsive:** sections stack on mobile; skill grids collapse columns; the hero image scales and
  never overflows (`ai-spec §7`).

---

## 6. Acceptance Criteria (how to verify it works)

**Root path**
- [ ] Home renders by default at the root URL and is the landing view.

**Introduction**
- [ ] The name is prominently displayed; a role/tagline is visible.
- [ ] The hero overview paragraph is the credential-forward copy (not the testimony text).
- [ ] CTAs switch the active view to Portfolio and Contact without changing the URL.

**Why I Build**
- [ ] A distinct testimony section is present with the specified paragraph.
- [ ] The word "empathy" does not appear in this section.

**Technical skills**
- [ ] At least 3 technical skills, each with an icon and a supporting sentence; organized visually.

**What I bring to a team**
- [ ] Resilience card is unchanged.
- [ ] Communication, Accountability, and Self-direction cards are present with the specified copy and
      icons; each has a supporting sentence.

**Layout**
- [ ] At least 3 distinct, visually separated sections; no white surfaces.

**AI images**
- [ ] At least 2 AI-generated images, relevant, each with appropriate `alt`; tool documented.

**Motion**
- [ ] A soft breathing sage glow sits behind the hero portrait and the cards (bloom, not a ring).
- [ ] Cards lift slightly and intensify glow on hover.
- [ ] Sections/cards fade-and-rise on scroll via IntersectionObserver; cards stagger; reveal runs once.
- [ ] Under `prefers-reduced-motion: reduce`, glows are static and content is visible with no movement.

**Phrase frequency**
- [ ] "Empathy is my framework" appears at most twice on the page (hero + footer).

**Definition of Done (per `ai-spec §10`)**
- [ ] Works in both light and dark themes (colors via tokens).
- [ ] All copy present in both `en.json` and `fr.json`.
- [ ] Keyboard-accessible CTAs; images have alt text; no console errors.

---

## 7. Notes for the Spec-Driven Loop

- The hero overview and the "Why I Build" testimony do different jobs — keep them distinct: the hero is
  a fast scan of *what she is*; the testimony is *who she is*. If they start sounding alike, the page
  has drifted.
- Build `Reveal` / `useReveal` once and reuse it everywhere; build `SkillCard` / `SkillGrid` reusably
  so the Portfolio page can reuse the same card + reveal patterns.
- Keep motion ambient. If the breathe or lift reads as busy, reduce the glow opacity, the lift
  distance, or the stagger delay before adding anything new.
- Two AI images are a rubric item here: the hero portrait is one; pick a genuinely relevant second and
  log the tool in `Research.md`.