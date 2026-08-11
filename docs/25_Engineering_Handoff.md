# PawGuard Engineering Handoff — Naming Convention & Folder Structure

## Version 1.0 — Single Source of Truth

---

## FILE & FOLDER NAMING CONVENTION

| Rule | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `Button.tsx`, `EmergencyForm.tsx` |
| Hooks | camelCase with `use` prefix | `useGeolocation.ts`, `useDraftSave.ts` |
| Utilities | camelCase | `formatCurrency.ts`, `validateEmail.ts` |
| Constants | UPPER_SNAKE_CASE | `PRESET_AMOUNTS`, `NAV_LINKS` |
| Types/Interfaces | PascalCase with `Props` suffix | `ButtonProps`, `CardProps` |
| CSS files | kebab-case | `globals.css`, `theme.css` |
| Docs | Numbered prefix + snake_case | `01_Product_Vision.md` |
| Test files | Component name + `.test.tsx` | `Button.test.tsx` |

---

## FOLDER STRUCTURE

```
src/
├── app/                          # Application layer
│   ├── App.tsx                   # Root component with routes
│   ├── main.tsx                  # Entry point
│   │
│   ├── pages/                    # Page-level components
│   │   ├── HomePage.tsx
│   │   ├── EmergencyPage.tsx
│   │   ├── AdoptionPage.tsx
│   │   ├── DonatePage.tsx
│   │   ├── VolunteerPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── SuccessStoriesPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/               # Shared components
│   │   ├── ui/                   # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Accordion.tsx
│   │   │   └── Skeleton.tsx
│   │   │
│   │   ├── layout/               # Layout primitives
│   │   │   ├── PageShell.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── navigation/           # Navigation
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Breadcrumb.tsx
│   │   │
│   │   ├── patterns/             # Recurring patterns
│   │   │   ├── EmergencyActionPanel.tsx
│   │   │   ├── ImpactMetric.tsx
│   │   │   ├── RescueTimeline.tsx
│   │   │   ├── AdoptionCard.tsx
│   │   │   ├── StoryCard.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   ├── TransparencyBar.tsx
│   │   │   ├── TrustBadges.tsx
│   │   │   ├── ImpactBreakdown.tsx
│   │   │   └── LiveRescueFeed.tsx
│   │   │
│   │   └── feedback/             # Feedback components
│   │       ├── ScrollToTop.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── OfflineBanner.tsx
│   │       └── PageTransition.tsx
│   │
│   └── hooks/                    # Custom hooks
│       ├── useGeolocation.ts
│       ├── useDraftSave.ts
│       ├── useScrollReveal.ts
│       ├── useOnlineStatus.ts
│       └── useFormValidation.ts
│
├── styles/                       # Global styles
│   ├── index.css                 # Entry point (imports below)
│   ├── fonts.css                 # Google Fonts imports
│   ├── tailwind.css              # Tailwind imports
│   ├── theme.css                 # CSS custom properties (design tokens)
│   └── globals.css               # Base styles, resets
│
├── imports/                      # Static assets
│   ├── video/                    # Video files
│   │   ├── hero-poster.webp
│   │   └── hero-video.webm
│   │
│   ├── images/                   # Image assets
│   │   ├── logo.svg
│   │   ├── favicon.svg
│   │   ├── og-image.jpg
│   │   └── fallback-animal.svg
│   │
│   └── icons/                    # Custom SVG icons
│       ├── paw-guard-icon.svg
│       ├── rescue-shield.svg
│       └── emergency-siren.svg
│
└── lib/                          # Utilities & constants
    ├── constants/                # Application constants
    │   ├── navigation.ts
    │   ├── animals.ts
    │   ├── roles.ts
    │   ├── services.ts
    │   ├── faqs.ts
    │   ├── stories.ts
    │   └── team.ts
    │
    ├── utils/                    # Utility functions
    │   ├── formatCurrency.ts
    │   ├── validateForm.ts
    │   ├── formatPhone.ts
    │   └── cn.ts                 # classnames utility
    │
    ├── api/                      # API layer
    │   ├── client.ts             # Base API client
    │   ├── emergency.ts          # Emergency report endpoints
    │   ├── adoption.ts           # Adoption endpoints
    │   ├── donations.ts          # Donation endpoints
    │   └── volunteer.ts          # Volunteer endpoints
    │
    └── types/                    # TypeScript types
        ├── animal.ts
        ├── report.ts
        ├── donation.ts
        ├── volunteer.ts
        └── api.ts
```

---

## CSS VARIABLE MAPPING

| Design Token | CSS Variable | Tailwind Mapping | Used In |
|-------------|-------------|-----------------|---------|
| `primary` | `--color-primary` | `bg-primary`, `text-primary` | Buttons, links, accents |
| `primary-foreground` | `--color-primary-foreground` | `text-primary-foreground` | Text on primary bg |
| `background` | `--color-background` | `bg-background` | Page surface |
| `foreground` | `--color-foreground` | `text-foreground` | Primary text |
| `card` | `--color-card` | `bg-card` | Card surfaces |
| `card-foreground` | `--color-card-foreground` | `text-card-foreground` | Text on card bg |
| `destructive` | `--color-destructive` | `bg-destructive`, `text-destructive` | Emergency elements |
| `muted-foreground` | `--color-muted-foreground` | `text-muted-foreground` | Secondary text |
| `border` | `--color-border` | `border-border` | All borders |
| `radius-btn` | `--radius-btn` | `rounded-btn` | All buttons |
| `radius-input` | `--radius-input` | `rounded-input` | Form inputs |
| `radius-card` | `--radius-card` | `rounded-card` | Cards |
| `radius-2xl` | `--radius-2xl` | `rounded-2xl` | Hero media |
| `shadow-sm` | `--shadow-sm` | `shadow-sm` | Resting cards |
| `shadow-md` | `--shadow-md` | `shadow-md` | Hovered cards |
| `shadow-lg` | `--shadow-lg` | `shadow-lg` | Modals |
| `font-sans` | `--font-sans` | `font-sans` | Body text |
| `font-serif` | `--font-serif` | `font-serif` | Headings |
| `font-mono` | `--font-mono` | `font-mono` | Data |

---

## ACCEPTANCE CRITERIA TEMPLATE

Every component implementation must pass:

```
COMPONENT: [name]
PAGE: [page]

VISUAL
[ ] Matches visual specification (radius, color, spacing, typography)
[ ] All states implemented (default, hover, focus, press, disabled, loading, error, success)
[ ] Matches responsive specification (mobile, tablet, desktop)

INTERACTION
[ ] Hover state visible (pointer cursor, shadow/bg change)
[ ] Focus state visible (navy ring 2px outline offset 2px)
[ ] Press state visible (scale 0.98, bg darken)
[ ] Loading state visible (spinner + descriptive text)
[ ] Disabled state visible (opacity 0.5, no pointer events)

ACCESSIBILITY
[ ] Keyboard navigable (Tab order correct)
[ ] Focus visible (WCAG 2.4.7)
[ ] aria-* attributes present where needed
[ ] Color contrast ≥ 4.5:1 (text) or 3:1 (large text)
[ ] Touch target ≥ 44×44px (mobile)

CONTENT
[ ] Copy matches Communication Guide (08)
[ ] Microcopy specific to action (not generic)
[ ] Loading text describes what's happening

PERFORMANCE
[ ] No unnecessary re-renders
[ ] No layout shift
[ ] Lazy loading applied where appropriate

CODE
[ ] Uses design tokens, not hardcoded values
[ ] No transition-all (specific properties only)
[ ] No inline styles (Tailwind classes only)
[ ] TypeScript types exported
[ ] Component documented (Props interface, usage examples)
```
