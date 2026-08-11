# PAWGUARD LAYOUT CONSTITUTION v1.0

**Enterprise Design Standard — Mandatory for All Pages**

---

## Chapter 1 — Global Grid System

### Breakpoint Definitions

| Tier | Min Width | Label | Columns | Gutter | Margin |
|------|-----------|-------|---------|--------|--------|
| Mobile | 320px | `sm` | 4 | 16px | 16px |
| Tablet | 768px | `md` | 8 | 20px | 24px |
| Laptop | 1024px | `lg` | 12 | 24px | 32px |
| Desktop | 1280px+ | `xl` | 12 | 24px | auto (centered) |

### Container Rules

- **Outer container**: `max-w-[1280px] mx-auto`
- **Narrow container** (editorial/content): `max-w-[720px] mx-auto`
- **Full-bleed**: no container, `px-6 lg:px-8` as safe area
- **Reading width**: never exceed 720px for continuous prose
- **Image width**: may span full container (1280px) or grid column
- **Safe area**: minimum 16px on mobile, 32px on desktop from viewport edge

### Baseline Grid

- Base unit: `4px` (Tailwind spacing scale)
- Vertical rhythm: increments of `8px` (multiples of 2 base units)
- Line height scale: `1.3` (headings), `1.5` (body), `1.6` (prose)

### Column Gaps

| Context | Gap |
|---------|-----|
| Card grids | `gap-6` (24px) |
| Section 2-col layouts | `gap-12 lg:gap-16` (48px→64px) |
| Form fields | `gap-4` (16px) |
| Navigation | `gap-8` (32px) |
| Icon + text pairs | `gap-3` (12px) |

---

## Chapter 2 — Section System

### Official Section Categories

| Category | Min Height | Max Height | Padding Y | Default Bg | Purpose |
|----------|------------|------------|-----------|------------|---------|
| **Hero** | 100vh | none | `pt-24 pb-16` | `bg-background` or dark | First impression, primary value prop |
| **Narrative** | none | none | `py-20 lg:py-28` | `bg-card` | Storytelling, mission, values |
| **Evidence** | none | none | `py-12 lg:py-16` | `bg-background` | Stats, data, trust signals |
| **Emergency** | none | none | `py-24 lg:py-32` | `bg-destructive` | Urgent CTA, high-emotion |
| **Editorial** | none | none | `py-24 lg:py-32` | `bg-background` | Magazine-style content |
| **Gallery** | none | none | `py-20 lg:py-28` | `bg-card` | Animal cards, story cards |
| **Conversion** | none | none | `py-24 lg:py-36` | `bg-foreground` (dark) | Final CTA, donation, volunteer |
| **Footer** | auto | none | `pt-16 pb-8` | custom dark | Links, newsletter, legal |

### Section Transition Rules

- No section shall have `border-b` as a separator
- Section changes signaled by: `background color` + `spacing` + `content shape`
- Maximum 5 background color changes per page
- At least 2 consecutive sections must share a background before switching

### Spacing Before/After

| Adjacent Pair | Gap Between |
|---------------|-------------|
| Hero → Narrative | `0` (shared bg transition) |
| Narrative → Evidence | `0` (bg change is separator) |
| Evidence → Gallery | `0` |
| Any → Emergency | `0` (full-bleed crimson) |
| Any → Conversion | `0` (full-bleed dark) |

---

## Chapter 3 — Overlay Rules

### When Overlays Are Permitted

| Element | Allowed | Max Overlap | Clearance | Z-index |
|---------|---------|-------------|-----------|---------|
| Floating stats card | Yes, in Hero video | 24px below container | 16px from next section | `z-10` |
| Image badges (dispatch, live) | Yes, on images | None (inside container) | 8px from edge | `z-10` |
| Floating quote card | Yes, in editorial | 16px below image | 16px from edge | `z-10` |
| Sticky navbar | Always | Full viewport width | Top 0 | `z-50` |
| Trust bar | Never overlaid | — | — | — |
| Emergency banner | Never overlaid | — | — | — |

### Shadow Rules for Overlays

| Element | Shadow | Hover Shadow |
|---------|--------|-------------|
| Floating stats card | `shadow-md` | — |
| Image badge | `shadow-lg` | — |
| Floating quote | `shadow-md` | — |
| Sticky navbar | `shadow-sm` → `shadow-md` (scrolled) | — |

### Prohibited Overlaps

- No element may overlap the TrustBar
- No element may overlap section boundaries unintentionally (defined by `py-*`)
- No floating card may extend beyond the section it belongs to

---

## Chapter 4 — Visual Rhythm

### Adjacent Section Diversity Rule

No two adjacent sections may share more than 2 of these 5 properties:

1. Layout pattern (grid / flex / centered / split)
2. Vertical spacing (`py-*` value)
3. Background color
4. Content density (cards per row)
5. Interaction type (static / hover / click)

### Rhythm Arc (Homepage Example)

```
Hero (full-height, dark or light, video, floating stats)
↓ background change
Emergency (crimson, full-width, pulse animation, tall spacing)
↓ background change
Mission (card bg, 2-col, narrative, pull quote)
HowItWorks (card bg, horizontal timeline, numbered)
↓ background change
Video (dark, cinematic, immersive)
↓ background change
Services (default bg, 2x2 grid, hover cards)
FeaturedAnimals (default bg, card grid, hover zoom)
↓ background change
VolunteerDonate (split-screen, high contrast)
↓ background change
Stories (card bg, editorial layout)
↓ background change
FAQ (default bg, accordion)
↓ background change
FinalCTA (dark, centered, minimal)
```

### Rule

- Every background change is a deliberate narrative act
- The first section after a bg change must feel visually different from the one before
- Maximum 2 sections per background "scene" before a change or reset

---

## Chapter 5 — White Space System

### Spacing Scale

| Level | Name | Value | Usage |
|-------|------|-------|-------|
| Micro | `gap-1` | 4px | Icon to text, dot indicators |
| Tiny | `gap-2` | 8px | Badge padding, inline elements |
| Small | `gap-3` | 12px | Icon + text pairs, tag groups |
| Base | `gap-4` | 16px | Form fields, stacked elements |
| Medium | `gap-6` | 24px | Card grids, component clusters |
| Large | `gap-8` | 32px | In-section groupings |
| XL | `gap-10` | 40px | Section heading to content |
| XXL | `gap-12` | 48px | Major 2-col layouts |
| Section Y | `py-20` | 80px | Standard section top/bottom |
| Section Y+ | `py-24` | 96px | Generous section spacing |
| Section Y++ | `py-32` | 128px | Expansive (conversion, hero) |

### Why Each Exists

- **Micro/Tiny**: precision alignment, prevents visual crowding
- **Small/Base**: comfortable reading rhythm for related content
- **Medium**: separates distinct components within a section
- **Large/XL**: creates clear content groups within a section
- **Section Y values**: controls the breathing room between major page acts

### Quiet Zones

- No content zone: minimum 24px on all sides of any primary heading
- Footer: bottom 48px minimum before viewport edge on scroll
- Conversion CTA: 16px minimum padding inside CTA container

---

## Chapter 6 — Visual Hierarchy

### Section Focus Matrix

| Section | Primary (1) | Secondary (2) | Supporting (3) | Decorative (4) | Max Attention Points |
|---------|-------------|---------------|----------------|----------------|---------------------|
| Hero | Headline | CTA buttons | Stats/metrics | Video/image | 3 |
| Emergency | "Report Emergency" button | Response time card | Phone number | Background pattern | 3 |
| Mission | Pull quote | Section heading | Body text | Photo | 2 |
| Video | Video content | Section heading | Description | — | 2 |
| Evidence | Numbers (stats) | Labels | — | — | 2 |
| Services | Card titles | Card descriptions | Icons | Hover effects | 4 (one per card) |
| Gallery | Animal images | Names/breeds | CTAs | — | 2 |
| VolunteerDonate | Headlines | Stats | CTA buttons | — | 2 per column |
| Conversion | Headline | CTA buttons | Subtext | — | 2 |

### Golden Rule

- Never present the user with more than **3 competing attention points** in any single viewport
- The primary element must occupy at least **40% of the section's visual weight**
- Secondary elements must be visually subordinate (smaller, lower contrast, or muted color)

---

## Chapter 7 — Section Transitions

### Transition Types

| Type | Mechanism | Example |
|------|-----------|---------|
| **Editorial** | Background change + spacing | Narrative section → Evidence |
| **Immersive** | Full-bleed + content shift | Standard → Video (dark bg) |
| **Urgent** | Abrupt color change + large spacing | Any → Emergency (crimson) |
| **Story** | Visual continuity + layout shift | Services → FeaturedAnimals |
| **Evidence** | Compact spacing + data focus | Mission → Stats row |
| **Conversion** | Relaxed pacing + centered focus | FAQ → FinalCTA |

### Handoff Rules

- **Editorial**: next section heading aligns to same grid line as previous content
- **Immersive**: no visual divider — content type change is the transition
- **Urgent**: the crimson background acts as a "wall" — no gentle fade
- **Story**: last element of previous section leads eye to first element of next
- **Evidence**: reduce spacing to signal "this is related, keep scanning"
- **Conversion**: increase spacing to signal "this is important, pause here"

### Prohibited

- Random `border-b` dividers between sections
- Abrupt spacing jumps (e.g., `py-20` to `py-8` without content reason)
- Background switching without narrative justification

---

## Chapter 8 — Card System

### Card Types

| Type | Max Width | Min Height | Border | Shadow | Hover | Use |
|------|-----------|------------|--------|--------|-------|-----|
| **Featured** | 2 cols (640px) | 320px | Yes | `shadow-sm` | `shadow-hover-card` | First/hero card in a grid |
| **Secondary** | 1 col (300px) | 280px | Yes | `shadow-sm` | `shadow-hover-card` | Standard content cards |
| **Editorial** | 2 cols | 400px | Yes | `shadow-md` | `shadow-hover-card` | Story cards, pull quotes |
| **Emergency** | auto | 180px | No (bg color) | `shadow-glow-destructive` | — | Urgent CTAs |
| **Adoption** | 1 col | 380px | Yes | `shadow-sm` | `shadow-hover-card` | Animal profiles |
| **Dashboard** | 1 col | 200px | Yes (glass) | `shadow-lg` | — | Metric preview cards |

### Orphan Rule

**No card grid may contain an orphan.**

Definition: An orphan is any card that sits alone in a grid row when there are empty column slots available.

Solutions:
- Adjust grid spans so every row is complete
- Add a filler/CTA card to complete the row
- Collapse to fewer columns

### Grid Completion

| Card Count | Desktop (4 cols) | Tablet (2 cols) | Mobile (1 col) |
|------------|------------------|-----------------|----------------|
| 3 | 2+1 (featured+split) | 2+1 | 1+1+1 |
| 4 | 2+2 or 4 | 2+2 | 1×4 |
| 5 | 3+2 or 2+2+1 (with filler) | 2+2+1 | 1×5 |
| 6 | 3+3 or 2+2+2 | 2+2+2 | 1×6 |

---

## Chapter 9 — Image Composition

### Aspect Ratios

| Context | Aspect Ratio | Class | Notes |
|---------|-------------|-------|-------|
| Hero video | 3:4 mobile, 4:3 desktop | `h-[320px] lg:h-[480px]` | Fixed height preferred |
| Editorial photo | 4:3 | `h-[280px] lg:h-[380px]` | Content-focused crops |
| Animal cards | 4:3 | via AdoptionCard | Dog/cat centered |
| Story featured | 3:2 | `h-[300px] lg:h-[460px]` | Wide, cinematic |
| Portrait overlay | 3:4 | `w-[200px] h-[260px]` | Person + animal |
| Team member | 1:1 | `h-[260px]` | Face centered |

### Cropping Rules

- **People**: eyes in top 1/3, never crop at joints
- **Animals**: face in center 1/2, full body preferred
- **Rescue scenes**: human + animal interaction preferred
- **Safe zones**: keep text overlays in top/bottom 20% only

### Badge & Overlay Rules

| Element | Positioning | Max Size | Responsive |
|---------|-------------|----------|------------|
| Dispatch badge | `top-4 left-4` | `px-3 py-1.5` | Scales down on mobile |
| Live indicator | `bottom-4 right-4` | `px-3 py-1.5` | Hidden on mobile |
| Stats overlay | `bottom-0 left-0` gradient | full width, `p-4` | Full-width mobile |
| Urgent badge | `top-3 left-3` | `px-2.5 py-1` | Scales down |
| New arrival badge | `top-3 left-3` (offset) | `px-2.5 py-1` | Scales down |

### Video Rules

- Always `autoPlay muted loop playsInline`
- Always include `poster` attribute
- `object-cover` for fill, `object-contain` only if full visibility required
- Gradient overlay at bottom when text overlays appear

---

## Chapter 10 — Layout QA Checklist

### Pre-Merge Gate

Before any page can be deployed, it must pass:

```
□ [PASS/FAIL] No visual collisions between overlapping elements
□ [PASS/FAIL] No orphan cards in any grid
□ [PASS/FAIL] No broken grid layouts at any breakpoint (375px, 768px, 1024px, 1440px)
□ [PASS/FAIL] No accidental white space (unintended gaps > 48px without purpose)
□ [PASS/FAIL] No unnecessary divider lines between sections
□ [PASS/FAIL] No inconsistent spacing values (all gaps match Chapter 5 scale)
□ [PASS/FAIL] No clipped icons or SVGs (verified in browser, not just code)
□ [PASS/FAIL] No disconnected section transitions (every transition has a type from Chapter 7)
□ [PASS/FAIL] No competing focal points (max 3 attention points per viewport, Chapter 6)
□ [PASS/FAIL] Responsive at all 4 breakpoints with no horizontal overflow
□ [PASS/FAIL] Visual rhythm check: no two adjacent sections share more than 2 of 5 rhythm properties (Chapter 4)
□ [PASS/FAIL] Background changes: max 5 total per page
□ [PASS/FAIL] Floating overlays: verified clearance from adjacent sections (Chapter 3)
□ [PASS/FAIL] Image crops: verified safe zones for faces and animals (Chapter 9)
□ [PASS/FAIL] Reading width: prose blocks ≤ 720px
```

### Violation Levels

| Level | Meaning | Action |
|-------|---------|--------|
| **Critical** | Breaks layout, causes overlap, or loses content | Blocked — must fix before merge |
| **Major** | Violates spacing/grid/rhythm rules | Must fix before merge |
| **Minor** | Inconsistent with constitution but functional | Documented exception, schedule remedy |

---

## Enforcement

This constitution is effective immediately for all pages:

- `HomePage.tsx`
- `AdoptionPage.tsx`
- `VolunteerPage.tsx`
- `EmergencyPage.tsx`
- `AboutPage.tsx`
- `SuccessStoriesPage.tsx`
- `ContactPage.tsx`
- `DonatePage.tsx`
- `NotFoundPage.tsx`
- Any future page additions

All new components and pages must comply before merge. Existing pages must be refactored to comply within the current implementation phase.

---

*Document version 1.0 — Approved by Enterprise Product Design Studio*
