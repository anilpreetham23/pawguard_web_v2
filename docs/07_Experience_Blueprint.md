# PawGuard Experience Blueprint

## Experience Modes

PawGuard operates in 5 distinct experience modes. Every page, every component, every interaction must be designed for its specific mode. Mixing modes within a single page causes emotional confusion.

---

### MODE 1: URGENCY
**Used on:** Emergency page, EmergencyActionPanel, hotline banner

**Emotional arc:** Panic → Relief

| Layer | Expression |
|-------|------------|
| Color | Crimson accents, high contrast, white backgrounds |
| Typography | Sans-serif only (Inter). Bold, large. No serif warmth. |
| Layout | Single-column, minimal, no decorative elements |
| Motion | Fast (150ms). No entrance animations. Immediate feedback. |
| Copy | Imperative. Direct. Short sentences. Active voice. |
| Imagery | None decorative. Only functional (photo upload). |
| Interaction | Minimum steps. Geolocation prefilled. Large touch targets. |
| Trust signals | ETA display, step indicator, hotline number always visible |
| Cognitive load | Absolute minimum. 4 fields max. No optional extras. |
| Decision fatigue | Eliminated. Default severity is "critical." User must opt out. |

**Design rule for Emergency:** Every element not essential to submitting a report within 60 seconds must be removed.

**Test:** Can a user in panic submit a report in under 60 seconds with one hand on a phone while walking?

---

### MODE 2: CONNECTION
**Used on:** Adoption page, animal cards, success stories

**Emotional arc:** Hope → Confidence

| Layer | Expression |
|-------|------------|
| Color | Warm whites, navy accents, muted slate |
| Typography | Playfair Display for animal names and story headlines. Inter for details. |
| Layout | Image-led grids. Generous white space. Asymmetric layouts. |
| Motion | Gentle (300ms). Ease-out. Hover zooms on images. Entrance fades. |
| Copy | Narrative. Specific. Personal. "Meet Bella. She loves sunny spots." |
| Imagery | Hero shots of animals. Candid, not studio. Real rescue photography. |
| Interaction | Browse → Filter → Inspect → Connect. Progressive disclosure. |
| Trust signals | Health status. Personality. Care requirements. Adoption process clarity. |
| Cognitive load | Medium — browsing is exploratory. Filters reduce overwhelm. |

**Design rule for Connection:** Every animal must feel like an individual, not a product listing.

---

### MODE 3: EVIDENCE
**Used on:** Donate page, About transparency section, impact metrics

**Emotional arc:** Skepticism → Trust

| Layer | Expression |
|-------|------------|
| Color | Navy primary. Slate for data. Clean whites. |
| Typography | Monospace (JetBrains) for numbers. Inter for body. |
| Layout | Structured. Data-heavy. Left-aligned. Breakouts for key stats. |
| Motion | Stable (300ms). Fade transitions. No bounce. No decorative motion. |
| Copy | Specific. Verifiable. "78% to programs" with source. "EIN: 87-1234567" |
| Imagery | Real photographs only. No stock art representing money or impact. |
| Interaction | Scroll → Read → Verify → Commit. Links to external verification. |
| Trust signals | Third-party badges. Audited financials. Breakdown bars. Direct links. |
| Cognitive load | High — data requires attention. Clear hierarchy reduces it. |
| Decision fatigue | Default donation amount preselected. Frequency preset to monthly. |

**Design rule for Evidence:** Every claim must be backed by visible proof within one click.

---

### MODE 4: COMMUNITY
**Used on:** Volunteer page, team section, success stories

**Emotional arc:** Curiosity → Belonging

| Layer | Expression |
|-------|------------|
| Color | Warm tones. Card backgrounds. Navy for CTAs. |
| Typography | Playfair for section headings. Inter for body and role descriptions. |
| Layout | Card-based grids. People-first imagery. |
| Motion | Warm (300-400ms). Ease-out. Scale on card hover. |
| Copy | Inviting. Specific about commitment. "4 hours per week" not "some time." |
| Imagery | Real volunteers. Real people. Candid group shots. |
| Interaction | Browse roles → Read requirements → Apply → Orientation. Clear steps. |
| Trust signals | Volunteer numbers. Testimonials. Partner logos. |
| Cognitive load | Medium — role cards provide scannable comparison. |

**Design rule for Community:** Every volunteer should see themselves in the roles presented.

---

### MODE 5: NARRATIVE
**Used on:** Homepage, About story, success stories (featured)

**Emotional arc:** Neutral → Engaged → Inspired

| Layer | Expression |
|-------|------------|
| Color | Mix of all palette. Sections alternate between light and dark. |
| Typography | Playfair for narrative headlines. Inter for supporting text. |
| Layout | Alternating. Full-width images. Pull quotes. Asymmetric splits. |
| Motion | Scenic (500-700ms). Scroll-triggered reveals. Story-driven sequencing. |
| Copy | Journalistic. Specific details. Dates, names, locations. |
| Imagery | Hero-quality photography. Real rescue scenes. Emotional moments. |
| Interaction | Scroll → Read → Feel → Act. CTA at emotional peak. |
| Trust signals | Specific data woven into narrative. Real names. Real outcomes. |
| Cognitive load | Low — story carries the user. No complex decisions. |

**Design rule for Narrative:** The story is the interface. Sections should not compete for attention.

---

## Page-to-Mode Mapping

| Page | Primary Mode | Secondary Mode |
|------|-------------|----------------|
| Homepage | NARRATIVE | URGENCY (EmergencyActionPanel) |
| Emergency | URGENCY | — |
| Adoption | CONNECTION | — |
| Donate | EVIDENCE | — |
| Volunteer | COMMUNITY | — |
| Stories | NARRATIVE | CONNECTION |
| About | NARRATIVE | EVIDENCE |
| Contact | — | (neutral support page) |

---

## Mode Transition Rules

When a user moves between modes, the **experience must feel coherent** even as the emotional register changes. This is achieved through:

1. **Consistent header and footer** — Navbar and Footer remain identical across all modes
2. **Consistent interaction language** — Buttons always work the same way, regardless of mode
3. **Consistent spacing system** — Grid, padding, and rhythm are mode-independent
4. **Consistent color role** — Navy always means "trustworthy action," crimson always means "urgent action"
5. **Mode-specific texture** — Each mode has unique visual texture (urgency: crisp & minimal, connection: warm & generous, evidence: structured & dense, community: card-based & human, narrative: story-driven & cinematic)

**Anti-pattern:** A page that uses URGENCY colors with CONNECTION imagery or EVIDENCE typography with NARRATIVE spacing.
