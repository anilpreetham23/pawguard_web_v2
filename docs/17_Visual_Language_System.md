# PawGuard Visual Language System

## Complete visual specification governing every pixel.

---

## Whitespace Philosophy

PawGuard uses generous whitespace to communicate **calm competence**. In a context where users may be panicked, crowded interfaces increase anxiety. Space communicates: "We are in control. There is no rush."

**Rules:**
- Section padding: `py-20 lg:py-28` on desktop (`80px` / `112px`), `py-16 lg:py-20` on compact sections
- Card padding: `p-7` (`28px`) for primary cards, `p-6` (`24px`) for secondary cards
- Between elements within a section: `gap-6` (`24px`) for grid items, `gap-4` (`16px`) for stacked items
- Between sections: one section border (`border-b border-border`) plus padding
- Text line length: max `540px` for body text, max `720px` for centered content

**Good example:** Emergency page form section has generous whitespace around the form, with the sidebar clearly separated.

**Bad example:** Homepage currently has 12 sections — too many. Sections need breathing room.

---

## Composition Rules

**Grid:**
- 12-column grid on desktop (1280px max-width)
- 4-column grid on mobile
- Section content stays within max-width, backgrounds can bleed full-width
- Asymmetric splits preferred: `lg:grid-cols-[1fr_1.2fr]` or `lg:grid-cols-[7fr_5fr]`

**Section alternation:**
- Every other section should alternate background: `bg-background` → `bg-card` or dark section
- No two consecutive sections share the exact same layout
- No section on a page should have the same layout as another section on that page

**Reading order:**
- Top-to-bottom, left-to-right
- Primary content left (higher visual weight), secondary content right
- On mobile, order collapses to top-to-bottom only

---

## Layout Rhythm

**Standard section flow (general):**
```
SectionHeading (eyebrow + heading + optional description)
↓ 24px gap
Content grid or list
```

**Section types:**
| Type | Grid | Width |
|------|------|-------|
| Full-width hero | 2-column split (image right) | 1280px |
| Text + image | 2-column (1fr 1fr) | 1280px |
| Card grid | 2/3/4 column | 1280px |
| Centered content | Single column | 720px max |
| Data section | Structured rows | 1280px |
| Split CTA | 2-column (1fr 1fr) | Full-width |

---

## Visual Hierarchy

**Priority order per screen:**
1. Primary heading (largest serif, bold, high contrast)
2. Primary CTA (colored button, high contrast)
3. Hero/featured image (if present)
4. Supporting text (medium contrast, readable size)
5. Secondary CTAs (outline or ghost buttons)
6. Eyebrow/section labels (small, uppercase, colored)
7. Trust signals (metrics, badges, verification)

**Reading path** follows F-pattern: user scans left-to-right, top-to-bottom, returning to left margin for each row.

---

## Typography Rhythm

**Scale:**
| Token | Size | Line Height | Weight | Used For |
|-------|------|-------------|--------|----------|
| `text-xs` | 12px | 1.4 | 400/600/700 | Badges, labels, legal text |
| `text-sm` | 14px | 1.5 | 400/500/600 | Descriptions, meta, buttons (mobile) |
| `text-base` | 16px | 1.6 | 400 | Body text |
| `text-lg` | 18px | 1.6 | 400 | Large body text, lead paragraphs |
| `text-xl` | 24px | 1.3 | 700 | Subsection headings |
| `text-2xl` | 32px | 1.2 | 700 | Section headings (serif) |
| `text-3xl` | 40px | 1.15 | 700/800 | Major section headings (serif) |
| `text-4xl` | 52px | 1.08 | 800/900 | Page H1 (serif) |
| `text-5xl` | 64px | 1.05 | 900 | Hero headline (serif) — rare, homepage only |

**Font pairing:**
- **Playfair Display**: Headings (h1-h4). Editorial authority. Used for emotional content.
- **Inter**: Body text, UI labels, buttons. Readability and reliability.
- **JetBrains Mono**: Data, statistics, timestamps. Precision.

**Vertical rhythm:**
- Section heading → content: `gap-12` (48px)
- Within card/layout: `gap-3` (12px) between heading and description
- Paragraphs: `gap-5` (20px) between paragraphs
- List items: `gap-2` (8px) between items

**Responsive typography:**
- All headings scale down on mobile: `text-4xl lg:text-5xl` (hero), `text-2xl lg:text-3xl` (sections)
- Body text remains `text-base` at all sizes
- Card text remains `text-sm` at all sizes

---

## Photography Rules

**Types of photography used:**
1. Rescue photography: Animals in care, rescue workers in action, real environments
2. Adoption photography: Animals in positive settings, looking healthy, connecting with humans
3. Team photography: Real staff and volunteers, candid not posed
4. Story photography: Context images that support the rescue narrative

**Forbidden photography:**
- Studio-lit perfect animal shots that look like stock photography
- Images that hide context (no blurred backgrounds that could be anywhere)
- Images where the animal looks distressed or overly sad (exploitative)
- Generic nature or animal images without specific PawGuard context

**Technical specifications:**
- Images must have explicit `width` and `height` attributes
- Aspect ratios: 4:3 (cards), 16:9 (hero), 1:1 (team portraits)
- Max file size: 200 KB (compressed)
- Formats: WebP with JPEG fallback
- All images require descriptive `alt` text specific to the image content

---

## Color Application

**Color roles (immutable):**

| Color | Token | Use | Don't Use |
|-------|-------|-----|-----------|
| Navy | `bg-primary` | Primary actions, active states, key trust elements | Decoration, backgrounds, non-interactive elements |
| Crimson | `bg-destructive` | Emergency signals, urgent CTAs, destructive actions | Non-urgent contexts, decorative elements |
| Warm White | `bg-background` | Page backgrounds, card backgrounds on dark sections | Text, interactive elements |
| Card | `bg-card` | Card backgrounds, section alternation | Page backgrounds, interactive elements |
| Near Black | `text-foreground` | Primary text, headings | Backgrounds |
| Slate | `text-muted-foreground` | Secondary text, metadata, descriptions | Primary content |
| White | `text-primary-foreground` | Text on navy backgrounds | Text on white backgrounds |

**Color application rules:**
- One primary color per section. Either navy-driven or crimson-driven, not both equally.
- Navy is the dominant brand color. Crimson is reserved for urgency.
- Color backgrounds are reserved for specific emotional modes. Light backgrounds are the default.
- Dark backgrounds (foreground color) are used for narrative emphasis and section breaks.

---

## Surface Hierarchy

| Level | Background | Border | Shadow | Use |
|-------|------------|--------|--------|-----|
| Page | `bg-background` | None | None | Default surface |
| Section | `bg-card` | `border-b border-border` | None | Content section |
| Card | `bg-background` | `border border-border` | `shadow-sm` | Content container |
| Card (hover) | Same | Same | `shadow-md` | Interactive container |
| Modal | `bg-background` | `border border-border` | `shadow-lg` | Overlay container |
| Navbar | `bg-background` | `border-b border-border` | `shadow-sm` | Fixed header |

---

## Elevation & Shadows

| Level | Shadow Token | Use |
|-------|-------------|-----|
| 0 | None | Page surfaces, sections |
| 1 | `shadow-sm` | Cards, sidebar elements |
| 2 | `shadow-md` | Cards on hover, dropdowns |
| 3 | `shadow-lg` | Modals, mobile menu |
| 4 | `shadow-xl` | Hero image overlays, notification toasts |

Shadow values:
```
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.06)
--shadow-md: 0 4px 12px -2px rgb(0 0 0 / 0.08)
--shadow-lg: 0 8px 24px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 12px 40px -8px rgb(0 0 0 / 0.12)
```

---

## Border Philosophy

- Borders are used to define section boundaries and content separation
- `border-border` is the standard border color (light gray, `#E5E7EB`)
- Thickness: 1px for most borders, 2px for active/toggle states
- Left accent borders: 4px `border-l-4 border-primary` for emphasis
- Dashed borders: `border-2 border-dashed` for upload zones and demo indicators

---

## Corner Radius Philosophy

PawGuard uses generous corner radii to communicate warmth and approachability. Sharp corners feel cold and institutional.

| Radius | Token | Value | Use |
|--------|-------|-------|-----|
| Button | `rounded-btn` | 10px | All buttons |
| Input | `rounded-input` | 12px | Form inputs, selects |
| Card | `rounded-card` | 16px | Cards, sidebar panels |
| Hero media | `rounded-2xl` | 24px | Hero images, featured media |
| Modal | `rounded-modal` | 20px | Modals, success states |

**Rule:** No other radius values may be used. Every element must use one of the 5 defined radii.

---

## Responsive Composition

| Breakpoint | Layout | Cards | Navigation | Typography |
|------------|--------|-------|------------|------------|
| 320-414px (mobile) | Single column | 1 column | Hamburger + bottom emergency bar | Scaled down 2 sizes |
| 768px (tablet) | 2-column layouts | 2 columns | Expanded nav, no hamburger | Full scale |
| 1024px+ (desktop) | Full 12-column grid | 3-4 columns | Full nav with CTAs | Full scale |
| 1440px+ (wide) | Max width 1280px, centered | Same as desktop | Same as desktop | Max scale |

**Mobile-first rule:** Every layout must work at 375px before scaling up.

---

## Section Transitions

Between sections:
- Alternating background colors provide visual separation
- `border-b border-border` provides clear section boundaries
- Scroll-triggered fade-in (500ms) on content reveal
- Dark sections transition to light sections with a clean border break

**Anti-pattern:** Sections that blend into each other without clear visual separation.
