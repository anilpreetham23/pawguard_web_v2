# PawGuard — Advanced Enterprise UI/UX Redesign (Phase 3)

## Context

The site is functional with 8 pages and consistent tokens, but every section uses the same repeated 4-column card grid, making the experience visually monotonous. Emoji icons appear in Services. Typography is flat (no display type, no serif contrast). There are no scroll animations, no form validation/loading states, and no new pages (Animal Detail, Dashboard Preview, 404). This phase transforms it into a premium enterprise digital product: unique layout compositions per section, editorial typography with Playfair Display, scroll-driven animations, form validation, and two new pages.

---

## Step 1 — `src/styles/fonts.css`

Replace the single `@import` with one that adds Playfair Display (ital, 700/900) alongside existing Inter + JetBrains Mono:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
```

---

## Step 2 — `src/styles/theme.css`

Remove the first (duplicate) `--radius: 0.25rem` declaration at line 28. Keep only line 34's `0.625rem`.

---

## Step 3 — `src/app/hooks/useInView.ts` (new file)

Shared scroll-detection hook used by StatisticsSection and DonatePage:

```ts
import { useEffect, useRef, useState } from "react";
export function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}
```

---

## Step 4 — `src/app/components/Navbar.tsx`

- Height `h-[68px]` → `h-[80px]`
- Add skip-to-main `<a href="#main-content" className="sr-only focus:not-sr-only ...">` before `<header>`
- Active nav link: add `<span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00236f] rounded-full" />` when `location.pathname === to`
- Mobile menu: import `AnimatePresence, motion` from `motion/react`; wrap in `<AnimatePresence>`, replace bare `div` with `motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.18 }}`

---

## Step 5 — `src/app/components/Footer.tsx`

- `© 2024` → `© {new Date().getFullYear()}`
- Social buttons: give each a specific `aria-label` (Twitter/Instagram/Facebook) instead of the same generic string

---

## Step 6 — `src/app/pages/HomePage.tsx` (largest change)

New imports: `Siren, Home, Stethoscope, PawPrint, CheckCircle2, Loader2` from lucide-react; `useInView` from `../hooks/useInView`. Add `id="main-content"` to `<main>`.

### HeroSection
- `bg-[#1a1b21] min-h-screen relative overflow-hidden grid grid-cols-1 md:grid-cols-[55fr_45fr]`
- Left col: `px-8 md:px-16 py-24 md:py-32 flex flex-col gap-8`
- H1: `font-[Playfair_Display] italic font-black text-white text-[56px] md:text-[80px] leading-[1.05] tracking-[-0.03em]` → "Every Animal Deserves a Second Chance."
- Subtext: `text-[#9ca3af] text-[18px] max-w-[400px]`
- Buttons: solid white `bg-white text-[#00236f] rounded-[10px]` + ghost `border border-white/50 text-white rounded-[10px] hover:bg-white/10`
- Stats ticker: `useEffect` cycling ("4,200+ Rescued" / "1,850+ Adopted" / "800+ Volunteers") every 2.5s
- Right col: `hidden md:block relative` — `<img className="absolute inset-0 w-full h-full object-cover">` (no rounded corners, bleeds to edge)

### EmergencyCtaSection
- Remove `max-w` — full-bleed centered row
- Phone icon: `motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:1.2, repeat:Infinity }}`
- Number: `font-[JetBrains_Mono] text-[36px] font-bold text-white`

### StatisticsSection
- `flex flex-col md:flex-row items-center justify-between max-w-[1280px] mx-auto`
- Numbers: `font-[JetBrains_Mono] text-[80px] font-bold text-white leading-none`
- Dividers: `w-px h-[80px] bg-white/10` between stats
- Animate 0→final using `useInView` + `requestAnimationFrame` counter over 1.5s

### MissionSection
- Two-column `grid grid-cols-1 md:grid-cols-2 gap-16`
- H2: `font-[Playfair_Display] text-[52px] leading-[1.1] font-bold`
- Pull quote: `border-l-4 border-[#00236f] pl-6 my-6 font-[Playfair_Display] italic text-[24px]`
- Right col: editorial photo collage — large image `h-[340px]` + small portrait `absolute bottom-0 right-[-24px] w-[200px] h-[260px] rounded-[24px] shadow-xl border-4 border-white`

### VideoSection
- Section bg → `bg-[#0d0d0f]`; text → white/`#9ca3af`
- Add `absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#0d0d0f] to-transparent pointer-events-none` inside video container

### ServicesSection (bento grid)
- Replace `SERVICES` emoji data with `{ icon: Siren | Home | Stethoscope | PawPrint, ... }`
- Two nested grid rows:
  - Row 1: `grid grid-cols-1 lg:grid-cols-4 gap-4` — Emergency `lg:col-span-2` + Adoption `lg:col-span-1` + Vet `lg:col-span-1`
  - Row 2: `grid grid-cols-1 lg:grid-cols-4 gap-4` — Foster `lg:col-span-1` + navy callout `lg:col-span-2` + Transport `lg:col-span-1`
- Cards: `relative overflow-hidden bg-white group rounded-[16px] p-7 flex flex-col gap-4 hover:shadow-lg transition-all duration-300`
- Left-accent: `<div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00236f] rounded-r-sm" />` (red for emergency)

### HowItWorksSection (horizontal timeline)
- Desktop: `relative flex flex-row gap-0 max-w-[1280px] mx-auto`, each step `flex-1 flex flex-col gap-4 px-6`
- Number: `font-[JetBrains_Mono] text-[48px] font-bold text-[#00236f]`
- Connecting line: `absolute top-[24px] left-[12.5%] right-[12.5%] h-px bg-[#E5E7EB]`
- Mobile: `flex flex-col gap-8 border-l-2 border-[#E5E7EB] pl-6`

### DashboardPreviewSection (NEW — after HowItWorksSection)
`bg-[#00236f] py-24 px-8`. `grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1280px] mx-auto`.
- Left: eyebrow `text-[#90a8ff]`, H2 `font-[Playfair_Display] text-white text-[48px]` "Operational Clarity at Every Level.", feature list with `CheckCircle2` icons, CTA link `/dashboard-preview`
- Right: browser-chrome mockup `div` — `bg-[#0a1628] rounded-[16px] overflow-hidden shadow-2xl border border-white/10`; URL bar with colored dots; fake nav tabs; 4–5 fake table rows with status badges

### FeaturedAnimalsSection (masonry)
- `ANIMALS` data: add `urgent?: boolean`, `newArrival?: boolean` flags
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- First animal: `md:col-span-2 lg:col-span-1 lg:row-span-2`, image `h-[300px]`, includes full excerpt
- Other cards: image `h-[180px]`
- Badges: `absolute top-3 left-3`; Urgent `bg-[#ba1a1a]`, New `bg-[#00236f]`; both `text-white text-[11px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-[6px]`
- "Learn More" → `<Link to={`/animals/${a.name.toLowerCase()}`}>`

### TestimonialsSection (NEW — after FeaturedAnimalsSection)
`bg-[#fffbf5] py-24 px-8`. Centered `max-w-[800px] mx-auto text-center`. Large decorative `"` `text-[#00236f]/8 text-[240px] font-serif`. Pull quote: `font-[Playfair_Display] italic text-[32px] md:text-[40px] font-bold`. Avatar circle + adopter name.

### VolunteerDonateSection (split-screen)
- Full-bleed `grid grid-cols-1 md:grid-cols-2 h-auto md:h-[600px]`
- Left `bg-[#1a1b21] px-8 md:px-16 py-16`: stat `font-[JetBrains_Mono] text-[80px] font-bold text-white`
- Right `bg-[#fffbf5] px-8 md:px-16 py-16`: stat `text-[#00236f]`

### FaqSection
- Questions: `text-[22px] font-semibold`
- Answers: `text-[16px]`
- Add CTA `<Link to="/contact">` at bottom

---

## Step 7 — `src/app/pages/AboutPage.tsx`

- Replace all 5 `style={{ fontFamily: "Georgia..." }}` with `className="font-[Playfair_Display]"`
- Hero: `bg-[#1a1b21] py-32 px-8 relative overflow-hidden` + background image `absolute inset-0 opacity-30 object-cover` + white Playfair Display H1
- Mission/Vision: tab toggle (`useState<'mission'|'vision'>`) + `motion.div key={tab}` animated swap
- Impact metrics: 2×2 asymmetric offset grid, JetBrains Mono numbers, alternating large/small
- Values: editorial list rows `border-b border-[#E5E7EB] py-8 flex gap-12` replacing card grid
- Team: first card `col-span-2 row-span-2 h-[400px]`, others `h-[220px]`

---

## Step 8 — `src/app/pages/EmergencyPage.tsx`

- Add `errors: Record<string,string>` state; validate required fields on submit; render `<p className="text-[#ba1a1a] text-[13px] mt-1">` error messages; clear per-field on `onChange`
- Add `isLoading` state; `setTimeout` 1500ms before `setSubmitted(true)`; button shows `<Loader2 className="animate-spin" />`
- File input: `useRef<HTMLInputElement>` + hidden `<input type="file">` triggered on upload zone click; display selected filename
- Success state: show `estimatedTime` ("8–12 minutes" if critical, "2–4 hours" if non-critical)

---

## Step 9 — `src/app/pages/AdoptionPage.tsx`

- Add `sortBy` state + sort `<select>` (Default / Name A–Z / Age Youngest First)
- Count badges: compute per-option count from `ALL_ANIMALS`, render `text-[11px] text-[#9ca3af]` beside each label
- Urgent/New flags on animal data + absolute badge rendering on cards
- Empty state: add `<button onClick={clearAll}>Clear Filters</button>` inline
- Card button → `<Link to={`/animals/${a.name.toLowerCase()}`}>`

---

## Step 10 — `src/app/pages/VolunteerPage.tsx`

- Hero: `bg-[#1a1b21] py-32 px-8` full-bleed, Playfair Display white H1 `text-[64px]`
- Form: add `errors` state + `isLoading` + 1500ms delay (same pattern as Emergency)

---

## Step 11 — `src/app/pages/SuccessStoriesPage.tsx`

- Featured story: full-bleed magazine layout — `relative h-[560px]` image + `absolute bottom-0` gradient overlay + white Playfair Display title
- Story grid: alternate image heights (odd index `h-[260px]`, even `h-[200px]`)
- Type filter: `useState("All")` toggle buttons (All / Dog / Cat)

---

## Step 12 — `src/app/pages/ContactPage.tsx`

- Replace 3 `style={{ fontFamily: "Georgia..." }}` with `className="font-[Playfair_Display]"`
- Direct contacts: `grid grid-cols-2 gap-4` horizontal strip
- Form: add `isLoading` + 1500ms delay

---

## Step 13 — `src/app/pages/DonatePage.tsx`

- Replace card number/expiry/CVV fields with mock placeholder: `border-2 border-dashed border-[#E5E7EB] rounded-[16px] p-8 text-center` with `Lock` icon + "Demo mode — no real payment processed"
- Impact sidebar: proportional bar chart per donation tier, animate on scroll with `useInView`

---

## Step 14 — `src/app/pages/AnimalDetailPage.tsx` (new file)

`useParams<{id:string}>` from `react-router`. Look up animal by `name.toLowerCase()` from shared constant; fall back to "not found" message. Layout: full-width hero image `h-[480px]` + `grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12`. Main: Radix Tabs (Overview / Health / Adoption Process). Sidebar: sticky navy `bg-[#00236f] rounded-[24px] p-8` CTA card. Related animals grid at bottom.

---

## Step 15 — `src/app/pages/DashboardPreviewPage.tsx` (new file)

Marketing page. Hero `bg-[#00236f]` + Playfair Display H1 "The Platform Behind Every Rescue." Feature bento grid. Detailed browser-chrome mock with fake sidebar nav + rescue record table. Three-column pricing cards (Starter / Pro / Enterprise).

---

## Step 16 — `src/app/App.tsx`

Add routes:
```tsx
<Route path="/animals/:id" element={<AnimalDetailPage />} />
<Route path="/dashboard-preview" element={<DashboardPreviewPage />} />
<Route path="*" element={<NotFoundPage />} />
```

Inline `NotFoundPage`: `font-[JetBrains_Mono] text-[80px]` "404" + Playfair Display h1 + Link home.

---

## Implementation Order

1. fonts.css → theme.css → useInView hook
2. Navbar.tsx → Footer.tsx
3. HomePage.tsx (all sections)
4. AboutPage.tsx → EmergencyPage.tsx → AdoptionPage.tsx
5. VolunteerPage.tsx → SuccessStoriesPage.tsx → ContactPage.tsx → DonatePage.tsx
6. AnimalDetailPage.tsx → DashboardPreviewPage.tsx → App.tsx

---

## Verification

1. Playfair Display visible in browser Network tab
2. `theme.css`: single `--radius` declaration
3. Footer: `{new Date().getFullYear()}` = 2026
4. Navbar: active page underline; mobile menu animates in/out
5. Homepage: 12+ sections — no two share the same layout
6. Stats: numbers animate 0→final on scroll
7. No emoji remain (`grep 🚨🏠🩺🐾`)
8. DashboardPreviewSection + TestimonialsSection visible on homepage
9. `/animals/bella` and `/dashboard-preview` render without error
10. `/unknown-path` shows 404 page
11. All forms: inline errors on empty submit; spinner 1.5s; then success
12. Mobile 375px: all sections stack, no horizontal overflow

---

# PawGuard Multi-Page App — Refinement Plan (Phase 2)

---

## Context

The initial 8-page site is built and routing works. This phase applies a unified enterprise design system across the entire codebase: a consistent corner-radius hierarchy, softened borders (`#E5E7EB`), card shadows with hover elevation, 200ms transitions, increased section breathing room, and a homepage demo-video section. All existing content, navigation, workflows, and information architecture are preserved.

## Design Token Changes (`src/styles/theme.css`)

Update `--border` from `#c5c5d3` to `#E5E7EB`. Keep everything else. No new token names (preserve `@theme inline` contract).

## Corner-Radius System (applied uniformly across all files)

| Element | Tailwind class |
|---------|---------------|
| Buttons | `rounded-[10px]` |
| Inputs / textareas | `rounded-[12px]` |
| Cards (bordered containers) | `rounded-[16px]` |
| Image containers | `rounded-[16px]` |
| Hero media wrapper | `rounded-[24px]` |
| Confirmation modals (success states) | `rounded-[20px]` |
| Upload zone | `rounded-[16px]` |
| Severity toggle buttons | `rounded-[10px]` |

All existing `rounded-[4px]`, `rounded-[2px]`, and zero-radius corners on the above element types are replaced with the system values above.

## Global Visual Changes (applied to every file)

1. **Borders**: `border-[#c5c5d3]` → `border-[#E5E7EB]` everywhere.
2. **Card shadows**: All card `div`s get `shadow-sm hover:shadow-md transition-all duration-200`. Remove bare `border` as the only visual indicator where shadow is added.
3. **Button transitions**: All buttons and `<Link>` elements used as buttons get `transition-all duration-200`.
4. **Section spacing**: `py-20` → `py-24` for major page sections.
5. **Input focus ring**: `focus:ring-2 focus:ring-[#00236f]/20` added alongside existing `focus:border-[#00236f]`.

---

## File-by-File Changes

### `src/styles/theme.css`
- Change `--border: #c5c5d3` → `--border: #E5E7EB`

### `src/app/components/Navbar.tsx`
- Add `shadow-sm` to `<header>` element.
- Apply `rounded-[10px]` to Donate and Emergency `<Link>` buttons (desktop and mobile).
- Add `duration-200` to all hover transition classes.

### `src/app/components/Footer.tsx`
- Expand from single-row to multi-column layout (4 cols desktop, 2 cols tablet, 1 col mobile):
  - Col 1: Logo + tagline + social icons (no external links, just icon placeholders using lucide-react: `Twitter`, `Instagram`, `Facebook`)
  - Col 2: Services links (Emergency, Adopt, Volunteer, Donate)
  - Col 3: Company links (About, Stories, Contact, Privacy, Terms)
  - Col 4: Newsletter signup input + button (controlled state, no backend)
- Keep `bg-[#eeedf4]`, `border-t border-[#E5E7EB]`.
- Apply `rounded-[10px]` to subscribe button, `rounded-[12px]` to email input.

### `src/app/pages/HomePage.tsx`

**All sections:**
- Section spacing: `py-20` → `py-24`.
- Card radius: all bordered card divs get `rounded-[16px] shadow-sm hover:shadow-md transition-all duration-200`.
- Image containers: `rounded-[24px]` for hero, `rounded-[16px]` for animal cards.
- Buttons: `rounded-[10px]`.
- Border color: `#c5c5d3` → `#E5E7EB`.

**New `VideoSection` component** inserted in `<main>` immediately after `<MissionSection />` and before `<ServicesSection />`:
```
<VideoSection />
```

`VideoSection` layout:
- Background: `bg-[#faf8ff]`, `py-24 px-8`, `border-b border-[#E5E7EB]`
- Content width: `max-w-[1280px] mx-auto flex flex-col gap-8`
- Header block (centered):
  - Eyebrow: `"In the Field"` — same style as other section eyebrows
  - Heading: `"See PawGuard in Action"` — `text-[32px] font-bold text-[#1a1b21]`
  - Description: `"Watch our teams respond, rescue, and reunite animals with loving families."` — `text-[18px] text-[#444651]`
- Video element:
  - Container: `w-full aspect-video rounded-[24px] overflow-hidden bg-[#eeedf4] shadow-md`
  - `<video>` tag with: `autoPlay muted loop playsInline` — NO `controls` attribute
  - `src="https://assets.mixkit.co/videos/preview/mixkit-dog-and-its-owner-playing-in-the-park-2138-large.mp4"`
  - `poster` = Unsplash image (same rescue hero photo already used)
  - `className="w-full h-full object-cover"`

### `src/app/pages/EmergencyPage.tsx`
- Inputs/textareas: add `rounded-[12px]`.
- Severity toggle buttons: `rounded-[10px]`.
- Upload zone: `rounded-[16px]`.
- Submit button: `rounded-[10px]`.
- Info cards (aside): `rounded-[16px] shadow-sm`.
- Success state div: `rounded-[20px]`.
- Border color: `#c5c5d3` → `#E5E7EB`.
- Section padding: `py-16` → `py-20`.

### `src/app/pages/AboutPage.tsx`
- All card divs (values grid, transparency cards, team placeholders): `rounded-[16px] shadow-sm hover:shadow-md transition-all duration-200`.
- Image containers (hero, team cards): `rounded-[16px]`.
- CTA buttons: `rounded-[10px]`.
- Border color: `#c5c5d3` → `#E5E7EB`.
- Section padding: `py-20` → `py-24`.

### `src/app/pages/AdoptionPage.tsx`
- Animal card outer div: `rounded-[16px] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`.
- Image containers within cards: `rounded-t-[16px]` (top radius only, card handles bottom).
- Filter sidebar: no card radius needed (it's inline content).
- Buttons (Apply to Adopt): `rounded-[10px]`.
- Border color → `#E5E7EB`.
- Section spacing: `py-20` → `py-24`.

### `src/app/pages/VolunteerPage.tsx`
- Role cards: `rounded-[16px] shadow-sm hover:shadow-md transition-all duration-200`.
- Hero image container: `rounded-[24px]`.
- Form inputs/selects/textareas: `rounded-[12px]`.
- Buttons: `rounded-[10px]`.
- Success state: `rounded-[20px]`.
- Border color → `#E5E7EB`.
- Section spacing: `py-20` → `py-24`.

### `src/app/pages/SuccessStoriesPage.tsx`
- Story card image containers: `rounded-[16px] overflow-hidden`.
- Featured story image: `rounded-[24px]`.
- CTA card (Share story): `rounded-[16px]`.
- Buttons: `rounded-[10px]`.
- Border color → `#E5E7EB`.
- Section spacing: `py-20` → `py-24`.

### `src/app/pages/ContactPage.tsx`
- FAQ Accordion: no card wrapping needed (stays as bordered list).
- Contact form inputs/selects/textareas: `rounded-[12px]`.
- Submit button: `rounded-[10px]`.
- Success state: `rounded-[20px]`.
- Direct contact boxes: `rounded-[16px]`.
- Border color → `#E5E7EB`.
- Emergency redirect banner: keep full-width (no radius).
- Section spacing: `py-16` → `py-20`.

### `src/app/pages/DonatePage.tsx`
- Frequency toggle buttons: `rounded-[10px]`.
- Preset amount buttons: `rounded-[10px]`.
- Form inputs: `rounded-[12px]`.
- Donate submit button: `rounded-[10px]`.
- Impact/transparency cards (aside): `rounded-[16px] shadow-sm`.
- Success confirmation state: `rounded-[20px]`.
- Border color → `#E5E7EB`.
- Section spacing: increase `py-16` → `py-20`.

---

## Verification

1. Run dev server and navigate all 8 routes — no layout breaks.
2. Homepage: confirm video plays automatically (muted, looping, no controls visible) below Mission section.
3. Resize to mobile 375px — confirm video is `aspect-video` and scales correctly.
4. Hover over cards — confirm `shadow-md` elevation appears after 200ms.
5. Focus an input — confirm `focus:ring-2` ring is visible alongside blue border.
6. Check Navbar and Footer in all viewport sizes — CTA buttons have `rounded-[10px]`, footer shows multi-column on desktop.
7. Emergency form: toggle CRITICAL/NON-CRITICAL, both buttons remain `rounded-[10px]`.

---

# PawGuard Multi-Page App — Original Build Plan (Phase 1)

## Context

The user has imported 10 Figma wireframes for PawGuard, an animal rescue / adoption NGO platform. The task is to build a faithful, multi-page React app from those wireframes — not a re-imagination. The wireframes define the structure; the implementation must honor them while adding routing, interactivity, and real design tokens.

Pages to build:
- Homepage (desktop + mobile wireframes)
- Emergency Report (desktop + mobile wireframes)
- About
- Adoption Listing
- Volunteer
- Success Stories
- Contact / FAQ
- Donate

## Design System Extracted from Wireframes

**Colors:**
- Primary navy: `#00236f`
- Emergency red: `#ba1a1a`
- Background: `#faf8ff`
- Surface/card: `#f4f3fa`
- Muted surface: `#eeedf4`
- Dark text: `#1a1b21`
- Body text: `#444651`
- Border: `#c5c5d3`

**Fonts:**
- Inter (Bold, SemiBold, Medium, Regular) — primary across all pages
- Liberation Serif (Bold, Regular) — About, Contact/FAQ pages (serif contrast)
- Nimbus Mono PS — Homepage wireframe labels (not available on Google Fonts; substitute with JetBrains Mono for mono labels)

**Grid:** 12-column desktop, 4-column mobile, consistent spacing scale (4/8/12/16/24/32/48/64)

## Implementation Steps

### 1. Theme Tokens (`src/styles/theme.css`)
Update `:root` to match the PawGuard palette extracted above. Preserve all existing token names and the `.dark` block and `@theme inline` section.

Key changes:
- `--background: #faf8ff`
- `--foreground: #1a1b21`
- `--card: #f4f3fa`
- `--card-foreground: #1a1b21`
- `--primary: #00236f`
- `--primary-foreground: #faf8ff`
- `--secondary: #eeedf4`
- `--secondary-foreground: #1a1b21`
- `--muted: #eeedf4`
- `--muted-foreground: #444651`
- `--border: #c5c5d3`
- `--destructive: #ba1a1a`
- `--radius: 0.25rem` (4px — matches wireframe border-radius)

### 2. Fonts (`src/styles/fonts.css`)
Add Google Fonts import for Inter (weights 400, 500, 600, 700) and JetBrains Mono (400, 700).

Note: Liberation Serif is not on Google Fonts. Use `Georgia, 'Times New Roman', serif` as the fallback for serif headings on About and Contact pages — visually close enough.

### 3. Routing (`src/app/App.tsx`)
Install and use React Router v6 (already available as a pre-installed package). Set up `BrowserRouter` + `Routes` with these paths:

| Path | Component |
|------|-----------|
| `/` | `<HomePage />` |
| `/emergency` | `<EmergencyPage />` |
| `/about` | `<AboutPage />` |
| `/adopt` | `<AdoptionPage />` |
| `/volunteer` | `<VolunteerPage />` |
| `/stories` | `<SuccessStoriesPage />` |
| `/contact` | `<ContactPage />` |
| `/donate` | `<DonatePage />` |

App.tsx renders `<BrowserRouter>` wrapping the route tree. Each page is imported from `src/app/pages/`.

### 4. Shared Components (`src/app/components/`)

**`Navbar.tsx`** — Desktop + mobile nav drawn from the wireframe patterns:
- Logo: PawGuard paw icon + wordmark in `#00236f`
- Desktop links: Home, Adopt, Volunteer, About, Stories, Contact
- Emergency button: outlined, `#00236f` text, uppercase "EMERGENCY"
- Mobile: hamburger menu collapsing to the same links + bottom emergency CTA

**`Footer.tsx`** — Drawn from wireframe footer pattern:
- PawGuard wordmark
- Links: Privacy · Terms · Support
- Copyright © 2024 PawGuard Enterprise
- Background: `#eeedf4`, top border `#c5c5d3`

### 5. Page Components (`src/app/pages/`)

Each page wraps `<Navbar />` + page content + `<Footer />`. Content follows the imported wireframe structure faithfully — component hierarchy, section order, class values, color values.

**`HomePage.tsx`** — Uses `HomepageWireframeDesktop` as reference:
- HeroSection, SectionEmergencyRescueCta, SectionMissionStatement, SectionServiceGrid, SectionHowItWorksProcess, SectionFeaturedAnimalGrid, SectionVolunteerDonationCtAsSplitLayout, SectionSuccessStoryTeaser, SectionFaqList
- Mobile responsive: stacks all grid sections, uses carousel-style for animal grid, bottom nav visible on mobile (overlaps with shared Navbar)

**`EmergencyPage.tsx`** — Uses `EmergencyReportWireframeDesktop` + `EmergencyReportWireframeMobile` as reference:
- Crisis reassurance banner (left-border accent)
- Emergency toggle (CRITICAL / NON-CRITICAL) with state
- Location input, Animal Description textarea
- Camera/photo upload zone
- "What happens next?" process box
- SUBMIT REPORT button
- Form state managed with `useState`

**`AboutPage.tsx`** — Uses `AboutWireframeDesktop`:
- SectionMissionVisionStatement, SectionDetailedImpactMetricsGrid, OperationalTransparencySection, SectionTeamPlaceholderGrid
- Liberation Serif style headings → Georgia serif fallback

**`AdoptionPage.tsx`** — Uses `AdoptionListingWireframeDesktop`:
- SectionHeaderMissionSummary, AsideRobustFilterSidebar (with checkbox filter state), AnimalCardGrid (6 cards), SectionAdoptionProcessOverview

**`VolunteerPage.tsx`** — Uses `VolunteerWireframeDesktop`:
- SectionHeroWhyVolunteer, RoleDefinitionSectionBentoIshGrid, SectionRequirementChecklist, SectionMultiStepApplicationFlowTeaser

**`SuccessStoriesPage.tsx`** — Uses `SuccessStoriesWireframeDesktop`:
- SectionFeaturedHappyTailStory, SectionGridOfAdoptionUpdates, SectionShareYourStoryCta, SectionFeedBackToAdoptableAnimals

**`ContactPage.tsx`** — Uses `ContactFaqWireframeDesktop`:
- LeftColumnFaqInfo (accordion FAQ with Radix), RightColumnContactForm, form submit state

**`DonatePage.tsx`** — Uses `DonateWireframeDesktop`:
- LeftColumnGivingForm (frequency toggle, amount selection with state), RightColumnImpactRoi, TransparencyBadges

### 6. Image Handling

- Wireframes use placeholder boxes for images. Replace with Unsplash photos using `https://images.unsplash.com/photo-{id}?w=...&fit=crop&auto=format` for:
  - Hero: outdoor animal rescue scene
  - Animal cards: individual pet photos (dogs/cats)
  - Team cards: person portraits
  - Success stories: happy adoption photos
- Use `<img>` with `object-cover` and descriptive `alt` text.

### 7. Interactivity

- Emergency page: toggle state for CRITICAL/NON-CRITICAL, form field state
- Adoption page: filter sidebar checkbox state filters displayed cards
- Donate page: frequency (monthly/one-time) toggle, amount button selection
- Contact page: Radix Accordion for FAQ items, form submission state
- Navbar: mobile menu open/close state, `Link` components from react-router-dom

## Critical Files

| File | Action |
|------|--------|
| `src/styles/theme.css` | Update tokens |
| `src/styles/fonts.css` | Add Google Fonts imports |
| `src/app/App.tsx` | Replace with Router + Routes |
| `src/app/components/Navbar.tsx` | Create |
| `src/app/components/Footer.tsx` | Create |
| `src/app/pages/HomePage.tsx` | Create |
| `src/app/pages/EmergencyPage.tsx` | Create |
| `src/app/pages/AboutPage.tsx` | Create |
| `src/app/pages/AdoptionPage.tsx` | Create |
| `src/app/pages/VolunteerPage.tsx` | Create |
| `src/app/pages/SuccessStoriesPage.tsx` | Create |
| `src/app/pages/ContactPage.tsx` | Create |
| `src/app/pages/DonatePage.tsx` | Create |

Imported wireframe components in `src/imports/` are **read-only reference** — not imported directly into the app (they would require adapters). Instead, the page components are built fresh, matching the wireframe structure, with the import files open as reference.

## Verification

1. Run dev server — confirm all 8 routes load without errors
2. Navigate between pages via Navbar links
3. Emergency page: toggle CRITICAL/NON-CRITICAL, fill form, verify submit button
4. Adoption page: check/uncheck filters, verify card grid responds
5. Donate page: toggle monthly/one-time, select amounts
6. Contact page: expand FAQ accordion items
7. Resize to mobile (~375px) — verify responsive layout on Homepage and Emergency
