# Color Palette Selection Framework v1.0
**By byTHELAB* Growth Studio**

> A reusable, client-agnostic methodology for selecting and validating brand color palettes. Developed through client work and refined into a repeatable process any growth studio designer can follow.

---

## Why This Exists

Color decisions made by gut feel break down at scale. This framework turns palette selection into a structured, auditable process — from first client conversation to final token implementation. It produces palettes that are visually intentional, accessibility-compliant, and ready for design system handoff.

---

## The 8-Step Process

### Step 1 — Creative Brief & References

Collect 3–5 moodboard images from the client before any color work begins. Sources: Pinterest, Cosmos, Dribbble, saved screenshots.

**Catalyzing questions to ask the client:**
- "If your brand talked to the user, how would it introduce itself?"
- "What feeling should the user have after their first interaction?"
- "What does the competitor NOT give their users that you will?"
- "Who is your user — where are they, what device, what context?"
- "Show me one brand (any industry) whose visual energy you admire."

The goal is not to match the moodboard exactly — it's to extract the emotional intent behind it.

---

### Step 2 — Color Extraction

Extract dominant colors from the reference images. Assign each an initial role before refining.

**Initial role assignment:**
| Role | Description |
|------|-------------|
| Background | The base canvas — dominates visual space |
| Primary CTA | The action color — buttons, key links |
| Secondary | Navigation support, section accents |
| Accent | Decorative, highlight, hover states |
| Semantic | Success / Warning / Error — functional, not brand |

Use a tool like Coolors, Adobe Color, or direct eyedrop from the moodboard. Extract 6–10 candidates, then narrow to the palette architecture in Step 8.

---

### Step 3 — Interactive Preview

**Never present hex swatches to a client.** Build HTML mockups that apply the palette to real UI components. This reveals problems that a color grid hides.

**Required components in the preview:**
- Primary button (default, hover, disabled states)
- Card with title, body text, and a badge
- Notification states (success, warning, error)
- Data visualization sample (chart, progress bar, or metric card)
- Typography samples (H1, H2, body, caption, link)
- Navigation element (sidebar item or tab)

**Delivery:** A single self-contained HTML file the client can open in any browser and screenshot for team review.

---

### Step 4 — Background Exploration

The background color has the highest surface area in any UI — a 10% hue shift changes the entire emotional register of the product. Test it in isolation before committing.

**Protocol:**
- Generate 8–12 background variants: warm, cool, neutral, dark, pure white, off-white, tinted
- Apply the SAME UI components from Step 3 to each variant
- Arrange as a side-by-side grid (3–4 columns)
- Present to client and design team simultaneously for validation

**Key decision questions:**
- Does the primary CTA pop against this background?
- Does body text remain readable at small sizes?
- Does the background feel appropriate for the user's environment? (outdoor mobile vs. desktop office)

---

### Step 5 — Senior Design Audit

Run a formal audit before presenting any palette as "final." Document results so the decision is traceable.

**Audit checklist:**

| Check | Tool | Pass Criteria |
|-------|------|--------------|
| Contrast: body text on bg | WebAIM Contrast Checker | ≥ 4.5:1 |
| Contrast: large text / UI on bg | WebAIM Contrast Checker | ≥ 3.0:1 |
| Contrast: text on primary button | WebAIM Contrast Checker | ≥ 4.5:1 |
| Contrast: text on secondary/accent | WebAIM Contrast Checker | ≥ 4.5:1 |
| Error color distinct from success | Visual check | Clearly distinguishable |
| Max accent count | Manual count | ≤ 5 total (including semantic) |
| Color blind safe | Coblis or Figma plugin | Distinguishable in deuteranopia |
| Light mode legibility | Real device test | Readable in direct sunlight |
| Industry benchmark alignment | Competitive review | Coherent with vertical leaders |

**Industry reference leaders by vertical:**
- **Fintech / Crypto:** Nubank, Mercury, Wise, N26, Revolut, Cash App
- **Health / Wellness:** Calm, Headspace, Whoop, Oura
- **Productivity / SaaS:** Linear, Notion, Vercel, Loom
- **E-commerce / Consumer:** Glossier, Warby Parker, Allbirds

**Color psychology by vertical:**
- Fintech: Trust anchors (navy, forest green), action accents (electric blue, vivid teal)
- Crypto / Web3: Bold, high-energy (purple, orange, electric blue) — innovation signal
- Health: Calm and organic (sage, warm cream, muted blue-green)
- LATAM consumer: Warmth and optimism (coral, gold, warm cream) — outdoor contexts

---

### Step 6 — Dual Token System

Saturated accent colors often fail WCAG contrast when used for typography. The dual token system solves this without changing the brand identity.

**For every accent color, define two tokens:**

```
[color-name]-vivid    →  Saturated value. Use for: button backgrounds, badges, decorative elements, illustrations
[color-name]-text     →  Darkened/accessible value. Use for: body text, links, inline mentions, labels
```

**Example — Coral accent:**
```
coral-vivid:  #FF6B55   (background use only)
coral-text:   #B83B28   (text on light backgrounds — passes 4.5:1)
```

This approach lets the brand stay vibrant in visual contexts while remaining accessible in reading contexts. Document both tokens in the design system with explicit usage rules.

---

### Step 7 — Mood Presets

Clients struggle to choose individual colors. They choose experiences. Bundle the full palette into 3 complete "mood" options and present them side-by-side.

**Each mood preset includes:**
- Background color
- Primary CTA color
- Secondary / nav color
- Accent(s)
- Semantic set (success / warning / error)

**Naming convention:** Use evocative, non-technical names that reflect the emotional register.
- Good: "Sunset," "Deep Ocean," "Morning Fog," "Jungle," "Midnight"
- Avoid: "Option A," "Dark Mode," "Version 2"

**Presentation format:** Side-by-side mockup (same UI, three palettes). The client picks a complete universe — not individual swatches. This reduces decision fatigue and produces more coherent final palettes.

---

### Step 8 — 60-30-10 Implementation

Once the palette is selected, enforce the distribution rule before handoff.

**The rule:**
- **60% — Neutrals / Background** — structural, does the heavy lifting, never competes
- **30% — Secondary color** — navigation, support surfaces, section differentiation
- **10% — Primary CTA** — actions only; scarcity creates hierarchy and urgency

**Semantic colors (success / warning / error)** appear only in context — never as decoration. They carry trust and must not be diluted by overuse.

**Common mistakes to correct at this stage:**
- CTA color used on section backgrounds (kills urgency)
- More than 2 accent colors used at the same visual weight
- Semantic red appearing in illustrations or brand graphics
- Light and dark mode palettes that share no token anchor points

---

## Audit Checklist Template (Standalone)

Copy this into any project doc for sign-off.

| Check | Tool | Pass Criteria | Result |
|-------|------|--------------|--------|
| Contrast: text on bg | WebAIM calculator | ≥ 4.5:1 | |
| Contrast: large text/UI on bg | WebAIM calculator | ≥ 3.0:1 | |
| Contrast: text on buttons | WebAIM calculator | ≥ 4.5:1 | |
| Error color exists | Visual check | Distinct red/danger token | |
| Max accent colors | Count | ≤ 5 (including semantic) | |
| Color blind safe | Sim tool | Distinguishable in deuteranopia | |
| Light mode legibility | Real device | Readable in sunlight | |
| Dual tokens defined | Design system | .vivid + .text per accent | |
| 60-30-10 verified | Layout audit | CTA color ≤ 10% of surface area | |

**Signed off by:** ___________________________
**Date:** ___________________________
**Client:** ___________________________

---

## Case Study: Daima — OWS Hackathon 2026

**Client context:** AI CFO for remote workers in emerging economies. Target user: gig workers and freelancers in LATAM and Southeast Asia — mobile-first, often outdoors, financial first-timers.

**Moodboard brief:** Vibrant, bold, LATAM energy, Memphis-influenced geometry, warm and optimistic — the opposite of sterile fintech.

**Audit findings:**
- 4 of 5 initial accent colors failed WCAG AA on light backgrounds
- Original background (near-white #F5F5F5) made warm accents feel washed out
- No semantic tokens defined — error states were being handled ad hoc

**Solutions applied:**
- Dual token system implemented for Coral and Gold accents
- Background shifted to Warm Cream (#FAF8F5) — warmer base tone that harmonized with accent palette
- Full semantic set defined: success green, warning amber, error red
- 60-30-10 distribution enforced — Coral CTA removed from hero backgrounds

**Final selection: "Sunset" mood**
| Token | Name | Value | Role |
|-------|------|-------|------|
| `bg-base` | Warm Cream | #FAF8F5 | 60% background |
| `color-secondary` | Soft Sand | #E8E0D5 | 30% support surfaces |
| `cta-vivid` | Coral | #FF6B55 | 10% primary actions |
| `accent-vivid` | Gold | #FFCD38 | Decorative, badges |
| `cta-text` | Deep Coral | #B83B28 | Text links, labels |
| `accent-text` | Dark Gold | #8A6A00 | Text on light bg |
| `semantic-success` | Sage | #3D8B6E | Confirmations |
| `semantic-warning` | Amber | #D97706 | Caution states |
| `semantic-error` | Crimson | #DC2626 | Errors, alerts |

**Key insight for LATAM fintech:** Light backgrounds outperform dark for this segment. Outdoor mobile use, high ambient light, and first-time financial app users all favor warm light palettes. Dark mode as an optional toggle — not the default.

---

## Framework Metadata

| | |
|-|-|
| **Version** | 1.0 |
| **Created** | April 2026 |
| **Author** | byTHELAB* Growth Studio |
| **Status** | Active — refined from Daima project |
| **Next review** | After 3 client applications |
| **Companion tools** | WebAIM Contrast Checker, Coblis, Coolors, Figma Tokens plugin |
