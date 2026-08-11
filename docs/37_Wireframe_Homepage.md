# PawGuard Wireframe — Homepage

## Design Agent Step 7 — Structural Layout

---

## Section Stack (Desktop)

| # | Section | Layout | Background | Height |
|---|---------|--------|------------|--------|
| 1 | **Header** | Full-width, logo + nav + Emergency CTA | bg-background | 80px |
| 2 | **Hero / Mission** | 2-col split: text left (6 cols) + image right (6 cols) | bg-background | ~600px |
| 3 | **Emergency Action Panel** | Full-width crimson banner + 2-col (text + CTA) | Crimson | ~200px |
| 4 | **How PawGuard Works** | 3-step horizontal timeline (icon + heading + desc) | bg-card | ~400px |
| 5 | **Impact Metrics** | 4 stat blocks in a row (large numbers, small labels) | bg-background | ~200px |
| 6 | **Services** | 4 card grid (Emergency, Adoption, Vet, Foster) | bg-card | ~450px |
| 7 | **Featured Animals** | 3 animal cards (photo, name, breed, badge, CTA) | bg-background | ~500px |
| 8 | **Volunteer / Donate CTA** | 2-col split CTA (Volunteer left, Donate right) | Dark navy section | ~350px |
| 9 | **Success Stories** | Feature story (1 large card) + 2 smaller story cards | bg-card | ~550px |
| 10 | **FAQ** | Accordion list (6-8 questions), centered layout | bg-background | ~450px |
| 11 | **Final CTA** | Centered content: heading + description + 2 CTAs | Dark navy section | ~300px |
| 12 | **Footer** | 4-col links + bottom bar with legal/social | Near-black | ~400px |

---

## Layout Stack (Mobile)

```
Header (64px)
Hero (stacked: text then image)
Emergency Action Panel (full-width, stacked)
How It Works (vertical 3 steps)
Impact Metrics (2x2 grid)
Services (single column cards)
Featured Animals (horizontal scroll or 1-card)
Volunteer / Donate (stacked: Volunteer then Donate)
Success Stories (single story, then horizontal scroll)
FAQ (single column accordions)
Final CTA (stacked buttons)
Footer (stacked columns)
```

---

## Section Details

### 2. Hero — Mission Statement
```
┌──────────────────┬──────────────────┐
│  TEXT (6 cols)   │  IMAGE (6 cols)  │
│                   │                  │
│  Eyebrow: "      │  Photo: Rescue   │
│  PawGuard"       │  team with       │
│                   │  animal          │
│  H1: "Giving     │                  │
│  animals a       │  ┌──────────┐    │
│  second chance   │  │ Badge:   │    │
│  at life."       │  │ 501(c)(3)│    │
│                   │  └──────────┘    │
│  Lead: "We       │                  │
│  rescue, heal,   │                  │
│  and find homes  │                  │
│  for animals."   │                  │
│                   │                  │
│  [Primary CTA]   │                  │
│  [Secondary CTA] │                  │
│                   │                  │
└──────────────────┴──────────────────┘
```

| Element | Spec |
|---------|------|
| Eyebrow | `text-xs`, uppercase, tracking-wide, accent color |
| H1 | Playfair Display, `text-5xl`, weight 900, `max-w-2xl` |
| Lead | Inter, `text-lg`, `max-w-xl`, `text-muted` |
| CTAs | Primary (Navy, "Find a Pet"), Secondary (Outline, "Help Now") |

### 3. Emergency Action Panel
```
┌──────────────────────────────────────────────┐
│  CRIMSON BACKGROUND (full-width)              │
│                                               │
│  ┌──────────────────────┬──────────────────┐  │
│  │  TEXT (7 cols)       │  CTA (5 cols)    │  │
│  │                       │                   │  │
│  │  "See an animal in   │  [EMERGENCY       │  │
│  │  danger right now?"   │   ACTION BUTTON   │  │
│  │                       │   - Destructive   │  │
│  │  "Don't wait. Our    │   - "Report an    │  │
│  │  rescue team is      │   Emergency"]     │  │
│  │  ready 24/7."        │                   │  │
│  │                       │  Hotline:         │  │
│  │                       │  1-800-PAW-GUARD  │  │
│  └──────────────────────┴──────────────────┘  │
└──────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Heading | `text-2xl`, white, bold |
| Description | `text-base`, white/80 |
| Button | Destructive variant, lg, "Report an Emergency" |
| Hotline | `text-sm`, white, phone icon, "24/7" badge |

### 4. How PawGuard Works
```
┌──────────────────────────────────────────────┐
│  SectionHeading (centered)                    │
│  "How PawGuard Works"                        │
│                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │    │     │  │    │     │  │    │     │  │
│  │ Icon 1   │  │ Icon 2   │  │ Icon 3   │  │
│  │ Rescue   │→│  Medical  │→│  Adoption │  │
│  │          │  │          │  │          │  │
│  │ Desc 1   │  │ Desc 2   │  │ Desc 3   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                               │
│  Connector lines between steps (desktop only)  │
└──────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Grid | 3 cols (desktop), single column (mobile) |
| Icons | Custom illustrations, 64x64 circle or rounded |
| Direction | Left-to-right (desktop), Top-to-bottom (mobile) |

### 5. Impact Metrics
```
┌──────────────────────────────────────────────┐
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │ 2,847  │ │ 1,243  │ │ 892    │ │ 800+   ││
│  │Animals │ │Medical │ │Success │ │Active  ││
│  │Rescued │ │Treats. │ │Adoptns │ │Vols    ││
│  └────────┘ └────────┘ └────────┘ └────────┘│
└──────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Grid | 4 cols (desktop), 2x2 (mobile) |
| Number | `text-4xl`, Playfair, bold, accent or navy |
| Label | `text-sm`, muted |
| Animation | Count-up on scroll into view (once, no loop) |

### 6. Services
```
┌──────────────────────────────────────────────┐
│  SectionHeading: "Our Services"              │
│                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────┐│
│  │Emergency│ │Adoption │ │Vet Care │ │Fost││
│  │ Card    │ │ Card    │ │ Card    │ │Card││
│  │ Icon    │ │ Icon    │ │ Icon    │ │Icon││
│  │ Title   │ │ Title   │ │ Title   │ │Titl││
│  │ Desc    │ │ Desc    │ │ Desc    │ │Desc││
│  │[CTA]    │ │[CTA]    │ │[CTA]    │ │CTA ││
│  └─────────┘ └─────────┘ └─────────┘ └────┘│
└──────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Grid | 4 cols (desktop), 2x2 (tablet), single (mobile) |
| Cards | bg-background, rounded-card, shadow-sm, hover:shadow-md |
| CTAs | Ghost button each, labeled per service |

### 7. Featured Animals
```
┌──────────────────────────────────────────────┐
│  SectionHeading: "Meet Our Animals"          │
│                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │Photo 4:3 │ │Photo 4:3 │ │Photo 4:3 │    │
│  │Name/Breed│ │Name/Breed│ │Name/Breed│    │
│  │Badges    │ │Badges    │ │Badges    │    │
│  │[Meet Me] │ │[Meet Me] │ │[Meet Me] │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                               │
│  "View all animals →" link (bottom-right)     │
└──────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Grid | 3 cols (desktop), horizontal scroll (mobile) |
| Badges | "Urgent", "New", "Vaccinated", "Special Needs" |
| CTA | "Meet [Name]" ghost button |

### 8. Volunteer / Donate Split CTA
```
┌──────────────────┬──────────────────┐
│  VOLUNTEER       │  DONATE          │
│  (6 cols)        │  (6 cols)        │
│                   │                   │
│  Icon             │  Icon             │
│  "Lend a Paw"    │  "Make a Gift"   │
│  "Your time can  │  "Every dollar   │
│  save a life."   │  saves a life."  │
│                   │                   │
│  [Volunteer Btn]  │  [Donate Btn]    │
│  - Primary        │  - Primary       │
└──────────────────┴──────────────────┘
```

| Element | Spec |
|---------|------|
| Background | Dark navy (bg-navy-900), white text |
| Layout | 2-col split with subtle divider |
| Buttons | Primary (white bg, navy text) each |

### 9. Success Stories
```
┌──────────────────┬──────────────────┐
│  FEATURED STORY  │  STORY 2 + 3     │
│  (7 cols)        │  (5 cols)        │
│                   │                   │
│  ┌───────────┐   │  ┌───────┐       │
│  │ Large     │   │  │Photo  │       │
│  │ Photo     │   │  │Title  │       │
│  │           │   │  └───────┘       │
│  │ Title     │   │  ┌───────┐       │
│  │ Excerpt   │   │  │Photo  │       │
│  │ [Read]    │   │  │Title  │       │
│  └───────────┘   │  └───────┘       │
└──────────────────┴──────────────────┘
```

| Element | Spec |
|---------|------|
| Layout | Asymmetric: featured story (1.4x) + 2 smaller stories stacked |
| Mobile | All stories stack vertically |

### 10. FAQ
```
┌──────────────────────────────────────────────┐
│  SectionHeading: "Frequently Asked Questions"│
│                                               │
│  Max-width 720px, centered                    │
│                                               │
│  ┌─ Q: How do I report an emergency? ──────┐ │
│  │ > Click "Emergency" on any page or call. │ │
│  └──────────────────────────────────────────┘ │
│  ┌─ Q: How long does adoption take? ───────┐ │
│  │ > Typically 3-7 business days.          │ │
│  └──────────────────────────────────────────┘ │
│  ┌─ Q: Can I donate items? ────────────────┐ │
│  │ > Yes, check our wishlist.              │ │
│  └──────────────────────────────────────────┘ │
│                                               │
│  "Have more questions? Visit our Contact page"│
└──────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Max width | 720px |
| Items | 6-8 questions, accordion behavior |
| First item | Open by default |

### 11. Final CTA
```
┌──────────────────────────────────────────────┐
│  DARK NAVY BACKGROUND (full-width)            │
│                                               │
│  Centered content (max-w-2xl)                 │
│                                               │
│  "Every animal deserves a chance."           │
│                                               │
│  "Join PawGuard in building a community      │
│   where no animal is left behind."            │
│                                               │
│  [Donate Now]  [Volunteer]                    │
└──────────────────────────────────────────────┘
```

---

## States Mapped

| State | Behavior |
|-------|----------|
| **Loading** | Full-page skeleton: hero skeleton, section skeleton placeholders |
| **Slow network** | Progressive loading: critical content first (Hero → Emergency → Metrics), then below-fold sections |
| **Offline** | Banner: "You're offline. Some content may not load." Cached sections display from service worker |
| **Error (image)** | Fallback SVG silhouette for any broken image |
| **Error (video)** | Fallback to poster image, error message hidden |

---

## Responsive Behavior

| Breakpoint | Layout Change |
|------------|---------------|
| ≥ 1280px | Max-width container, 12-col grid, asymmetric sections |
| 1024-1279 | Slightly narrower container, same grid structure |
| 768-1023 | Tablet: 2-col becomes 1-col. Service cards 2x2. Impact metrics 2x2 |
| < 768px | Phone: all single column. Horizontal scroll on animals + stories. Emergency panel text + button stacked |

## Accessibility Notes

| Requirement | Implementation |
|-------------|----------------|
| Skip link | "Skip to main content" — visible on focus |
| Heading hierarchy | H1 (Hero) → H2 (each section heading) → H3 (card titles) |
| Section landmarks | `<nav>`, `<main>`, `<section aria-label="...">` per section |
| Link purpose | All CTAs have descriptive text (not "Learn More" without context) |
| Reduced motion | Disable count-up animation, disable parallax |
| Touch targets | ≥ 48px on all CTAs and nav links |

## Performance Spec

| Metric | Target |
|--------|--------|
| Page weight | < 500 KB (HTML + CSS + JS + hero image) |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | 0 |
| Images | 1 hero + 3 animal + 3 story + icons (lazy loaded below-fold) |
| Fonts | Preloaded Playfair Display + Inter (400, 600, 700) |
