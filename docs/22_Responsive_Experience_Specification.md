# PawGuard Responsive Experience Specification

## Complete specification for every breakpoint.

---

## BREAKPOINT OVERVIEW

| Name | Width | Devices | Layout |
|------|-------|---------|--------|
| Mobile S | 320px | Small phones | Single column |
| Mobile M | 375px | iPhone SE, Android mid-range | Single column |
| Mobile L | 390px | iPhone 14/15 standard | Single column |
| Mobile XL | 414px | iPhone Plus, large Android | Single column |
| Tablet | 768px | iPad mini, iPad | 2-column |
| Desktop S | 1024px | iPad Pro, small laptop | Full grid |
| Desktop M | 1280px | Standard laptop | Max-width container |
| Desktop L | 1440px | Large monitor | Max-width centered |
| Desktop XL | 1920px | Wide monitor | Max-width centered |

---

## RESPONSIVE PRINCIPLES

1. **Mobile-first.** Every layout begins at 375px and scales up. The 375px experience is not a "mobile version" — it is the primary design.
2. **No horizontal scroll.** At any breakpoint, content must fit within the viewport width.
3. **Touch targets minimum 44×44px.** On mobile, increase to 48×48px for emergency CTAs.
4. **Typography scales with viewport.** Use responsive classes: `text-4xl lg:text-5xl`, `text-2xl lg:text-3xl`.
5. **Content reflows, not hides.** No content that is critical to understanding the page should be hidden at any breakpoint. Exception: decorative elements.

---

## LAYOUT BEHAVIOR PER BREAKPOINT

### 320px (Mobile S)

| Element | Behavior |
|---------|----------|
| **Page padding** | `px-4` (16px) |
| **Grid** | Single column, full width |
| **Max-width** | No max-width constraint (content fills) |
| **Navigation** | Hamburger menu. Emergency CTA in mobile menu + fixed bottom bar |
| **Hero** | Stacked: text above image. Image height: 200px. Heading: `text-3xl` (40px) |
| **CTAs** | Stacked vertically, full width, minimum 48px height |
| **Cards** | 1 column, full width, image height: 180px |
| **Forms** | Single column, all fields full width |
| **Typography** | h1: 32px, h2: 24px, body: 14px |
| **Images** | `h-[200px]` hero, `h-[180px]` card images |
| **Footer** | 1 column, stacked sections |

### 375px (Mobile M) — PRIMARY MOBILE DESIGN

| Element | Behavior |
|---------|----------|
| **Page padding** | `px-6` (24px) |
| **Grid** | Single column, full width |
| **Navigation** | Hamburger menu, CTAs in menu + bottom bar |
| **Hero** | Stacked: text above image. Image height: 240px |
| **CTAs** | Stacked, full width |
| **Cards** | 1 column |
| **Forms** | Single column |
| **Typography** | h1: `text-3xl` (40px), body: `text-base` (16px) |
| **Emergency form** | 4 fields full width, severity toggle full width buttons |
| **Sticky elements** | Navbar fixed, scroll-to-top FAB bottom-right |

### 390px (Mobile L)

| Element | Behavior |
|---------|----------|
| **Same as 375px** | Design identically. Verify no overflow, no clipped content, all CTAs visible. |

### 414px (Mobile XL)

| Element | Behavior |
|---------|----------|
| **Same as 375px** | Design identically. Verify text does not wrap awkwardly on larger screen. |

### 768px (Tablet)

| Element | Behavior |
|---------|----------|
| **Page padding** | `px-8` (32px) |
| **Grid** | 2-column grid available |
| **Navigation** | Expanded nav links visible. CTAs in header row. |
| **Hero** | 2-column: text left (50%), image right (50%). |
| **CTAs** | Side-by-side, inline width |
| **Cards** | 2-column grid |
| **Forms** | Single column still recommended (fields too narrow in 2-col at this size) |
| **Typography** | h1: `text-4xl` (52px), body: `text-base` (16px) |
| **Sidebar** | Content + sidebar layouts become viable at this size |
| **Emergency form** | Form + sidebar in 2-column layout |

### 1024px (Desktop S)

| Element | Behavior |
|---------|----------|
| **Page padding** | `px-8` (32px) |
| **Grid** | 12-column grid |
| **Navigation** | Full nav with all links + CTAs |
| **Hero** | 2-column with wider image |
| **CTAs** | Default widths (not full-width) |
| **Cards** | 3-4 column grids |
| **Forms** | Multi-column for related fields (name split, address) |
| **Typography** | Full scale |
| **Section layout** | 12-column grid, 8+4 or 6+6 splits |

### 1280px (Desktop M) — PRIMARY DESKTOP DESIGN

| Element | Behavior |
|---------|----------|
| **Page padding** | `px-8` (32px) |
| **Grid** | 12-column within `max-w-[1280px]` container, centered |
| **Navigation** | Full nav |
| **Hero** | 2-column with wider image and optional stat badge |
| **CTAs** | Default widths |
| **Cards** | 4-column max (adoption, roles), 3-column (stories) |
| **Content width** | Max `540px` for body text, `720px` for centered content |
| **Section width** | Full background bleed, content constrained to 1280px |

### 1440px (Desktop L)

| Element | Behavior |
|---------|----------|
| **Same as 1280px** | Content remains within 1280px max-width, centered. Extra space is margins. |

### 1920px (Desktop XL)

| Element | Behavior |
|---------|----------|
| **Same as 1280px** | Content remains within 1280px max-width, centered. Very wide margins on each side. |

---

## COMPONENT RESPONSIVE BEHAVIOR

### Navigation

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Hamburger menu. Donate + Emergency in mobile menu. Fixed bottom emergency bar (optional). |
| ≥ 768px | Expanded links. Donate and Emergency CTAs in header. |

### Hero

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Stacked: text above image. Image height: 200-240px. CTAs stacked. |
| ≥ 768px | 2-column: text left, image right. Image height: 420-480px. CTAs inline. |
| Stat badge | Hidden on mobile. Visible at ≥ 1024px (not 768px — not enough space at tablet). |

### Cards

| Breakpoint | Columns |
|------------|---------|
| < 640px | 1 column |
| 640-1023px | 2 columns |
| 1024-1279px | 3 columns |
| ≥ 1280px | 4 columns (adoption), 3 columns (stories) |

### Forms

| Breakpoint | Layout |
|------------|--------|
| < 768px | Single column. All fields full width. |
| ≥ 768px | Multi-column for related fields. Submit button full width. |
| Sidebar | Moves below form on mobile. Side-by-side on tablet+. |

### Footer

| Breakpoint | Columns |
|------------|---------|
| < 640px | 1 column |
| 640-1023px | 2 columns |
| ≥ 1024px | 4 columns |

### Accordion

| Breakpoint | Behavior |
|------------|----------|
| All | Same layout. Padding adjusts from `p-6` (mobile) to `p-8` (desktop). |

### Tables

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Horizontal scroll wrapper OR reflow to card layout |
| ≥ 768px | Standard table |

### Images

| Breakpoint | Sizing |
|------------|--------|
| < 768px | `width: 100%`, `height: auto` with aspect-ratio container |
| ≥ 768px | Fixed dimensions within grid. `object-cover` for consistency. |

---

## CONTENT PRIORITIES PER BREAKPOINT

### Mobile (< 768px)
**Show:** Primary heading, main CTA, essential content, trust signals, emergency hotline
**Hide:** Decorative elements, secondary content, stat badges, optional imagery
**Prioritize:** Emergency CTA, form fields, primary conversion path

### Tablet (768-1023px)
**Show:** Everything from mobile + expanded navigation, sidebar content, stat badges
**Hide:** Decorative elements that crowd the layout
**Prioritize:** Efficiency — show more content per viewport

### Desktop (≥ 1024px)
**Show:** All content, full navigation, stat badges, sidebars, decorative elements
**Prioritize:** Readability, information density, multitasking

---

## RESPONSIVE TESTING CHECKLIST

```
[ ] 320px: No horizontal scroll. Content fills width.
[ ] 375px: All CTAs visible. Touch targets ≥44px. Form fills width.
[ ] 390px: Same as 375px. No overflow.
[ ] 414px: Same as 375px. Text doesn't wrap awkwardly.
[ ] 768px: Navigation expanded. 2-column layouts work. Sidebar visible.
[ ] 1024px: Full nav. 3-column card grids. Hero at full width.
[ ] 1280px: Max-width container centered. All content visible.
[ ] 1440px: Same as 1280px. Centered with margins.
[ ] 1920px: Same as 1280px. Centered with wide margins.
[ ] Zoom 200%: No content clipped. No horizontal scroll.
[ ] Landscape mobile: Full-width content visible. No obstructions.
```
