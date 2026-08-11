# PawGuard Wireframe — Adoption Page

## Design Agent Step 7 — Structural Layout

---

## Grid Architecture (Desktop)

```
┌──────────────────────────────┐ ─── Header (80px)
│        HEADER (Global)       │
└──────────────────────────────┘
┌──────────────────────────────┐ ─── Hero (section 1)
│  HERO                        │
│  Title + description         │
│  + "How adoption works" link │
└──────────────────────────────┘
┌──────┬───────────────────────┐ ─── Main: 12-col grid
│      │                       │
│ FILTER│  ANIMAL GRID         │
│ SIDE │                       │
│ BAR  │  ┌───┐ ┌───┐ ┌───┐  │
│ 3cols│  │ C │ │ C │ │ C │  │
│      │  │ A │ │ A │ │ A │  │
│ ┌──┐ │  │ R │ │ R │ │ R │  │
│ │Sp│ │  │ D │ │ D │ │ D │  │
│ │ec│ │  └───┘ └───┘ └───┘  │
│ │Ag│ │  ┌───┐ ┌───┐ ┌───┐  │
│ │e │ │  │ C │ │ C │ │ C │  │
│ │Si│ │  │ A │ │ A │ │ A │  │
│ │ze│ │  │ R │ │ R │ │ R │  │
│ │  │ │  │ D │ │ D │ │ D │  │
│ └──┘ │  └───┘ └───┘ └───┘  │
│      │                       │
│ Clear│  Pagination (bottom)  │
│ All  │  "X animals available"│
└──────┴───────────────────────┘
┌──────────────────────────────┐ ─── Process section
│  HOW ADOPTION WORKS          │
│  4-step timeline             │
└──────────────────────────────┘
┌──────────────────────────────┐ ─── CTA
│  FINAL CTA                   │
└──────────────────────────────┘
┌──────────────────────────────┐ ─── Footer
│        FOOTER (Global)       │
└──────────────────────────────┘
```

---

## Layout Stack (Mobile)

```
Header (64px)
Hero (compact)
Filter dropdown (collapsible, "Filter" button opens drawer)
Animal cards (1-column, scroll)
Pagination / "Load More"
How Adoption Works (vertical step list)
Final CTA
Footer
```

---

## Section Details

### 1. Hero
| Property | Value |
|----------|-------|
| Heading | "Find Your New Best Friend" |
| Description | "Every animal deserves a loving home. Browse our available animals and start your adoption journey." |
| Layout | Centered text, max-w-2xl, bg-background |
| Secondary | Anchor link: "Learn how adoption works →" (scrolls to process section) |
| Counter | "X animals waiting for you" — live count |

### 2. Main Content — 12-col Grid
| Zone | Columns | Content |
|------|---------|---------|
| Filter Sidebar | 3 cols | Species, Age, Size checkboxes. Sort dropdown above grid. |
| Animal Grid | 9 cols | 3-column card grid (desktop). 2-column (tablet). 1-column (mobile). |

### 3. Filter Sidebar
| Property | Value |
|----------|-------|
| Background | bg-card, rounded-card |
| Sticky | Sticky top (below header) on desktop |
| Groups | Species (Dog, Cat, Other — checkboxes), Age (Baby, Young, Adult, Senior), Size (Small, Medium, Large) |
| Actions | "Clear All" button (appears only when filters active). Count of active filters. |
| Mobile | Collapsed by default. "Filter" button opens bottom drawer or slide-in panel. |

### 4. Animal Card (Grid Item)
```
┌────────────────────┐
│                    │
│  PHOTO (4:3)       │
│  ┌──────────────┐  │
│  │ Urgent Badge │  │
│  └──────────────┘  │
│                    │
│  Name — Age        │
│  Breed             │
│  Gender · Size     │
│                    │
│  [Meet Name]       │
└────────────────────┘
```

| Property | Value |
|----------|-------|
| Photo | 4:3 aspect ratio, object-fit: cover |
| Badge | Top-left overlay: "Urgent" (crimson), "New" (green), "Special Needs" (amber) |
| Name | `text-xl`, bold, playfair |
| Meta | `text-sm`, muted — breed, age, gender, size |
| CTA | Ghost button "Meet [Name]" — full card is clickable |
| Hover | Photo zoom (1.05), shadow elevation |
| Focus | Navy ring |

### 5. Empty State
```
┌──────────────────────────────────────┐
│  MESSAGE (centered in grid area)      │
│                                       │
│  ┌─────────────────┐                  │
│  │ Illustration:   │                  │
│  │ Empty kennel    │                  │
│  └─────────────────┘                  │
│                                       │
│  "No animals match your filters."    │
│  "Try adjusting or clearing your     │
│   search to see all available        │
│   animals."                          │
│                                       │
│  [Clear Filters] button              │
│                                       │
│  "New animals join us every week.    │
│   Want to be notified?"              │
│  [Notify Me] email input             │
└──────────────────────────────────────┘
```

### 6. Sort & Count
| Property | Value |
|----------|-------|
| Sort | Dropdown: "Newest First" (default), "Oldest First", "Name A-Z" |
| Count | "Showing X of Y animals" — between sort and grid |
| Mobile | Sort moves above grid, below filter button |

### 7. "How Adoption Works" Section
```
┌──────────────────────────────────────────────┐
│  SectionHeading: "Your Adoption Journey"      │
│                                               │
│  ┌───┐    ┌───┐    ┌───┐    ┌───┐          │
│  │   │    │   │    │   │    │   │          │
│  │ 1.│    │ 2.│    │ 3.│    │ 4.│          │
│  │Brw│    │App│    │Mee│    │Wel│          │
│  │ose│    │ly │    │t  │    │co │          │
│  │   │ →  │   │ →  │   │ →  │me │          │
│  │   │    │   │    │   │    │   │          │
│  │Des│    │Des│    │Des│    │Des│          │
│  └───┘    └───┘    └───┘    └───┘          │
│                                               │
│  "Questions? Contact our adoption team →"    │
└──────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Layout | 4 columns with connector lines (desktop), vertical (mobile) |
| Steps | Browse → Apply → Meet → Welcome Home |
| Icons | Custom illustrations per step |

---

## States Mapped

| State | Behavior |
|-------|----------|
| **Loading** | 6 skeleton cards (gray rectangle + 3 text lines). Filter sidebar skeleton. Sort disabled. |
| **Empty** | Empty state illustration + message + "Notify Me" option |
| **Filtered** | URL params update. "Clear All" visible. Count updates. Grid re-renders. |
| **Filtered → Empty** | Transition from grid to empty state. "Clear Filters" CTA. |
| **Card Error (img)** | Fallback silhouette + "Photo not available" text |
| **Card Loading** | Skeleton pulse on image, text skeleton |
| **Page Navigation** | Pagination at bottom. "Load More" button (mobile preferred over numbered pagination). |

---

## Responsive Behavior

| Breakpoint | Layout Change |
|------------|---------------|
| ≥ 1024px | 3+9 grid. Filter sidebar sticky. 3-col card grid. |
| 768-1023 | Filter sidebar becomes top filter bar. 2-col card grid. |
| < 768px | "Filter" button → bottom drawer. 1-col card grid. "Load More" instead of numbered pages. |

## Accessibility Notes

| Requirement | Implementation |
|-------------|----------------|
| Filter changes | Announce via `aria-live`: "Showing X animals" on filter change |
| Card navigation | Arrow keys navigate between cards in grid (when focus is in grid) |
| Sort | `<select>` with associated label |
| Empty state | Announce: "No animals match your filters" via live region |
| Card links | Each card is a single `<a>` tag with `aria-label="Meet [Name], [Breed], [Age]"` |
| Reduced motion | Disable hover zoom |

## Performance Spec

| Metric | Target |
|--------|--------|
| Page weight | < 300 KB (no hero image, card images lazy) |
| API calls | 1 (GET /animals with filter params) |
| Filter response | < 200ms (client-side filter or fast API) |
| Image loading | `loading="lazy"` on all cards. Blur placeholder or low-res preview |
