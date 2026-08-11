# PawGuard Static Hero — Production Specification

> The final, production-ready Hero concept.
> This synthesizes the strengths of all three concepts (Hope, Rescue, Community) while eliminating their weaknesses.
> This document is the source of truth for implementation.

---

## The One-Sentence Summary

> **"A frightened animal becomes safe because someone chose to act — and you can be that someone."**

---

## Emotional Arc (5 Seconds)

```
Second 1: SEE    — A documentary photograph of a rescued animal
Second 2: FEEL   — Warmth, connection, empathy
Second 3: READ   — "Every animal deserves a second chance."
Second 4: UNDERSTAND — PawGuard coordinates rescue, care, and adoption
Second 5: ACT    — "Report an Emergency" (crimson) + "Adopt" (navy)
```

---

## Photography Specification

### The Image
**Subject:** A medium-sized dog (Labrador mix, 2-3 years old) sitting in a warm, sunlit room. A human hand rests gently on the dog's back — we see the arm, not the face. The dog is looking slightly off-camera with calm, trusting eyes.

### Technical Direction

| Property | Specification |
|----------|---------------|
| **Lighting** | Natural window light from upper-left, warm color temperature (3500K-4500K) |
| **Perspective** | Eye-level with the dog, slightly low angle |
| **Depth of field** | Shallow — dog sharp, background softly blurred |
| **Color grading** | Warm tones, desaturated slightly, no teal/orange |
| **Grain** | Natural sensor noise — no artificial grain, no AI enhancement |
| **Format** | 16:9 aspect ratio for desktop, 4:5 for mobile |
| **Resolution** | 2400px wide minimum (for retina) |

### What the Image Communicates
- **Hope:** The warm light and calm dog communicate safety
- **Competence:** The clean environment and gentle handling communicate care
- **Trust:** The dog's calm expression communicates that this organization is trustworthy
- **Authenticity:** Documentary style — this feels like a real moment, not a stock photo

### What the Image Does NOT Show
- No dramatic rescue moment (too intense for homepage)
- No sad or distressed animals (exploitative)
- No studio lighting (feels staged)
- No faces looking at camera (breaks documentary fourth wall)

---

## Composition Specification

### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌──────────────────────┐  ┌────────────────────────────────────┐  │
│  │                      │  │                                    │  │
│  │  CONTENT ZONE (45%)  │  │     PHOTOGRAPH ZONE (55%)         │  │
│  │                      │  │                                    │  │
│  │  [Emergency Badge]   │  │                                    │  │
│  │                      │  │      ┌──────────────────────┐      │  │
│  │  HEADLINE            │  │      │                      │      │  │
│  │  "Every animal       │  │      │   Rescued dog in     │      │  │
│  │   deserves a         │  │      │   warm light with    │      │  │
│  │   second chance."    │  │      │   human hand         │      │  │
│  │                      │  │      │                      │      │  │
│  │  SUPPORTING TEXT     │  │      └──────────────────────┘      │  │
│  │  "PawGuard           │  │                                    │  │
│  │   coordinates..."    │  │  ┌──────────┐  ┌──────────────┐   │  │
│  │                      │  │  │ Live HUD │  │ Trust Stats  │   │  │
│  │  TYPEWRITER          │  │  └──────────┘  └──────────────┘   │  │
│  │  "Dispatch started"  │  │                                    │  │
│  │                      │  └────────────────────────────────────┘  │
│  │  ┌────────────┐      │                                          │
│  │  │  CTA:      │      │                                          │
│  │  │  Emergency │      │                                          │
│  │  │  (crimson) │      │                                          │
│  │  └────────────┘      │                                          │
│  │                      │                                          │
│  │  ┌────────────┐      │                                          │
│  │  │  CTA:      │      │                                          │
│  │  │  Adopt     │      │                                          │
│  │  │  (navy)    │      │                                          │
│  │  └────────────┘      │                                          │
│  │                      │                                          │
│  │  ┌────────────┐      │                                          │
│  │  │  CTA:      │      │                                          │
│  │  │  Volunteer │      │                                          │
│  │  │  (outline) │      │                                          │
│  │  └────────────┘      │                                          │
│  │                      │                                          │
│  │  TRUST BADGES        │                                          │
│  │  🕐 24/7  🏥 Vet     │                                          │
│  │                      │                                          │
│  └──────────────────────┘                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Layout (Mobile)
```
┌─────────────────────────────┐
│                             │
│  [Emergency Badge]          │
│                             │
│  HEADLINE                   │
│  "Every animal deserves     │
│   a second chance."         │
│                             │
│  SUPPORTING TEXT            │
│                             │
│  TYPEWRITER                 │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │   PHOTOGRAPH        │   │
│  │   (stacked below)   │   │
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  CTA: Emergency     │   │
│  │  (full-width)       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  CTA: Adopt         │   │
│  │  (full-width)       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  CTA: Volunteer     │   │
│  │  (full-width)       │   │
│  └─────────────────────┘   │
│                             │
│  TRUST BADGES              │
│                             │
│  ┌─────────────────────┐   │
│  │  Trust Stats        │   │
│  │  (2x2 grid)         │   │
│  └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```

---

## Typography Specification

### Hierarchy

| Element | Font | Size | Weight | Color | Spacing |
|---------|------|------|--------|-------|---------|
| **Emergency Badge** | Inter | 12px | 600 | Crimson (#C41A1A) | Uppercase, tracking-widest |
| **Headline** | Playfair Display | 64px (desktop) / 40px (mobile) | 900 | Near-black (#1A1B1E) | Tight (-0.02em) |
| **Highlight word** | Playfair Display | 64px (desktop) / 40px (mobile) | 900 | Navy (#00236F) | Tight (-0.02em) |
| **Supporting text** | Inter | 18px | 400 | Slate (#444651) | Normal (1.6 line-height) |
| **CTA (Emergency)** | Inter | 14px | 700 | White (#FFFFFF) | Uppercase, tracking-wide |
| **CTA (Adopt)** | Inter | 14px | 600 | White (#FFFFFF) | Normal |
| **CTA (Volunteer)** | Inter | 14px | 600 | Navy (#00236F) | Normal |
| **Trust badges** | Inter | 12px | 500 | Slate (#444651) | Normal |
| **Trust stats** | JetBrains Mono | 24px | 700 | White (#FFFFFF) | Tabular nums |
| **Stat labels** | Inter | 10px | 500 | White/60% | Uppercase, tracking-wider |

### Typography Principles Applied
- **Principle 012:** Typography confirms, doesn't lead — the photograph does the work
- **Principle 013:** Simplicity equals recognition — clean, confident, memorable

---

## Color Specification

### Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Background** | Warm off-white | #FAF8F1 | Page background, content zone |
| **Foreground** | Near-black | #1A1B1E | Headlines, primary text |
| **Primary** | Navy | #00236F | Trust, CTAs, accent |
| **Destructive** | Crimson | #C41A1A | Emergency badge, emergency CTA |
| **Muted** | Slate | #444651 | Supporting text, metadata |
| **Card** | Soft gray | #F4F3FA | Card backgrounds, section alternation |
| **Border** | Light gray | #E5E7EB | Borders, dividers |

### Color Principles Applied
- **Principle 009:** Warm light creates trust — the background leans warm, not clinical
- **Principle 011:** Light reveals — the photograph's warm tones communicate hope

---

## CTA Specification

### Primary CTA: Emergency
```
┌─────────────────────────────────────┐
│  📞  REPORT AN EMERGENCY            │
│     (crimson background, white text)│
│     Pulse animation on hover        │
│     Full-width on mobile            │
└─────────────────────────────────────┘
```

### Secondary CTA: Adopt
```
┌─────────────────────────────────────┐
│  →  ADOPT A COMPANION               │
│     (navy background, white text)   │
│     Subtle shadow on hover          │
│     Full-width on mobile            │
└─────────────────────────────────────┘
```

### Tertiary CTA: Volunteer
```
┌─────────────────────────────────────┐
│  BECOME A VOLUNTEER                 │
│     (transparent, navy border/text) │
│     Border fills on hover           │
│     Full-width on mobile            │
└─────────────────────────────────────┘
```

---

## Atmospheric Elements

### Background Layer
- Warm radial gradient from upper-left (simulating window light)
- Subtle noise overlay at 3% opacity (texture, not distraction)
- No particles, no glass, no decorative effects

### Decorative Layer
- Hand-drawn paw prints at 3-5% opacity (scattered, not clustered)
- Subtle dog silhouette sketch at 4% opacity (background texture)
- No animated decorations in static version

### Lighting Layer (on photograph)
- Soft vignette (darken edges 15%)
- Warm color overlay at 5% (golden tone)
- No god rays, no bloom, no lens flare in static version

---

## Trust Signals

### Emergency Badge (top of content zone)
```
🔴 LIVE — Animal Rescue & Adoption Network
```

### Trust Badges (below CTAs)
```
🕐 24/7 Response  |  🏥 Vet-Approved  |  📍 12 Municipalities
```

### Trust Stats (overlaid on photograph, bottom)
```
┌──────────┬──────────┬──────────┬──────────┐
│  4,200+  │  1,850+  │   800+   │  <12min  │
│  Animals │  Adopted │  Active  │  Avg     │
│  Rescued │          │  Vols    │  Response│
└──────────┴──────────┴──────────┴──────────┘
```

---

## Accessibility Specification

| Requirement | Implementation |
|-------------|----------------|
| **Heading hierarchy** | H1 (headline) is the only H1 on the page |
| **Image alt text** | "A rescued Labrador mix sits calmly in warm sunlight, a volunteer's hand resting gently on its back" |
| **CTA labels** | Descriptive: "Report an Emergency" not "Click Here" |
| **Focus states** | 2px navy ring with 2px offset on all interactive elements |
| **Touch targets** | Minimum 48px height on all CTAs |
| **Reduced motion** | All animations disabled, content visible immediately |
| **Color contrast** | All text meets WCAG AA (4.5:1 minimum) |
| **Screen reader** | Emergency badge, headline, supporting text, CTAs all announced in logical order |

---

## Responsive Specification

| Breakpoint | Layout Changes |
|------------|----------------|
| **≥1280px** | Two-column split, full typography scale |
| **1024-1279px** | Two-column split, slightly narrower |
| **768-1023px** | Two-column split, compressed spacing |
| **<768px** | Single column, stacked layout, photograph below text |

---

## Decision Gate Validation

| Question | Answer |
|----------|--------|
| Can you explain the Hero in one sentence? | ✅ "A frightened animal becomes safe because someone chose to act — and you can be that someone." |
| Can you justify every visual element? | ✅ Every element serves the emotional arc: See → Feel → Read → Understand → Act |
| Does the static Hero communicate the mission in under 5 seconds? | ✅ The photograph communicates hope, the headline confirms it, the CTAs enable action |
| Would it be compelling without animation? | ✅ The photograph alone is powerful; animation enhances but doesn't define |
| Does it pass all 15 Design Principles? | ✅ See compliance matrix below |

### Design Principle Compliance

| Principle | Compliant? | Evidence |
|-----------|------------|----------|
| 001: Single Focal Point | ✅ | The dog's face, illuminated by window light |
| 002: Three-Zone Hierarchy | ✅ | Photo (55%) → Content (45%) → CTAs |
| 003: Negative Space | ✅ | Generous whitespace around all elements |
| 004: Asymmetric Balance | ✅ | Content left, photograph right |
| 005: Documentary Authenticity | ✅ | Real moment, real light, real environment |
| 006: Quiet Connection | ✅ | Gentle hand on dog, calm expression |
| 007: Individualization | ✅ | Specific dog, specific moment, specific light |
| 008: Eye-Level Perspective | ✅ | Camera at dog's level |
| 009: Warm Light | ✅ | Golden window light, warm color temperature |
| 010: Atmosphere Creates Depth | ✅ | Shallow depth of field, soft background |
| 011: Light Reveals | ✅ | Light reveals the dog's calm expression |
| 012: Typography Confirms | ✅ | Text supports the photograph |
| 013: Simplicity Equals Recognition | ✅ | Simple, confident, memorable |
| 014: Imperceptible Motion | ✅ | Slow parallax, breathing movement |
| 015: Organic Rhythm | ✅ | Natural, human-paced animation |

---

## What PawGuard Is Communicating

### In the Photograph
"We rescue animals. We care for them. They become safe."

### In the Headline
"Every animal deserves a second chance." — This is our belief.

### In the Supporting Text
"PawGuard coordinates emergency rescue, adoption, and veterinary care across 12 municipalities." — This is our capability.

### In the Emergency CTA
"When you see an animal in crisis, we respond." — This is our promise.

### In the Adopt CTA
"When you're ready to welcome a companion, we'll help you find the right one." — This is our invitation.

### In the Volunteer CTA
"When you want to make a difference, we'll give you the opportunity." — This is our community.

---

## Success Criteria

After implementation, the Hero should:

1. ✅ Communicate PawGuard's mission within 5 seconds
2. ✅ Make the viewer feel warmth, trust, and empathy
3. ✅ Present three clear paths: Emergency, Adopt, Volunteer
4. ✅ Work without animation (static screenshot is compelling)
5. ✅ Work at all screen sizes (320px to 1440px+)
6. ✅ Pass WCAG AA accessibility
7. ✅ Pass Lighthouse Performance ≥90
8. ✅ Feel like PawGuard — not a template, not a generic NGO site

---

*This document is the source of truth for implementation. The engineering build should follow this specification exactly, without redesigning during implementation.*
