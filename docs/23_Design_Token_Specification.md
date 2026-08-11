# PawGuard Design Token Specification

## Complete token system specification for engineering implementation.

NOT implementation. Specification of every token value, name, and usage rule.

---

## SPACING SCALE

| Token | Value | Used For |
|-------|-------|----------|
| `--space-1` | 4px | Tight spacing within components (icon to text) |
| `--space-2` | 8px | Between related elements (badge clusters, inline items) |
| `--space-3` | 12px | Between heading and description within a component |
| `--space-4` | 16px | Standard gap between stacked elements (form fields, list items) |
| `--space-5` | 20px | Between paragraphs, between section heading and content |
| `--space-6` | 24px | Grid gap, card content padding |
| `--space-7` | 28px | Card padding (primary cards) |
| `--space-8` | 32px | Page padding (mobile L+), large section gaps |
| `--space-10` | 40px | Between major sections within a page |
| `--space-12` | 48px | Section heading to content gap |
| `--space-16` | 64px | Section padding (compact), `py-16` |
| `--space-20` | 80px | Section padding (standard), `py-20` |
| `--space-24` | 96px | Large page sections |
| `--space-28` | 112px | Section padding (expanded), `py-28` |

**Gap rules:**
- Within cards: `gap-3` (12px) between heading and description, `gap-5` (20px) between main content and footer
- Between form fields: `gap-5` (20px) vertical, `gap-4` (16px) horizontal in multi-column
- Between grid items: `gap-6` (24px)
- Between sections: `gap-0` (sections are separated by border + padding, not gap)

---

## TYPOGRAPHY SCALE

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | 'Inter', ui-sans-serif, system-ui, sans-serif | Body text, UI labels, buttons |
| `--font-serif` | 'Playfair Display', Georgia, 'Times New Roman', serif | Headings (h1-h4), narrative text |
| `--font-mono` | 'JetBrains Mono', ui-monospace, monospace | Data, statistics, timestamps |

### Font Sizes

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-2xs` | 10px | 1.3 | 600/700 | Badge text, tiny labels |
| `--text-xs` | 12px | 1.4 | 400/600/700 | Labels, metadata, legal text |
| `--text-sm` | 14px | 1.5 | 400/500/600 | Descriptions, card body, button text |
| `--text-base` | 16px | 1.6 | 400 | Primary body text |
| `--text-lg` | 18px | 1.6 | 400 | Lead paragraphs, large description |
| `--text-xl` | 24px | 1.3 | 700 | Subsection headings |
| `--text-2xl` | 32px | 1.2 | 700 | Section headings (serif) |
| `--text-3xl` | 40px | 1.15 | 700/800 | Major section headings (serif) |
| `--text-4xl` | 52px | 1.08 | 800/900 | Page H1 (serif) |
| `--text-5xl` | 64px | 1.05 | 900 | Hero headline (serif) — homepage only |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.02em | Headings (serif) |
| `--tracking-normal` | 0em | Body text |
| `--tracking-wide` | 0.05em | Labels |
| `--tracking-wider` | 0.1em | Eyebrow text, uppercase labels |
| `--tracking-widest` | 0.15em | Small uppercase labels (rare) |

---

## RADIUS SCALE

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-btn` | 10px | All buttons (primary, secondary, outline, ghost) |
| `--radius-input` | 12px | Form inputs, select elements |
| `--radius-card` | 16px | Cards, sidebar panels, containers |
| `--radius-2xl` | 24px | Hero images, featured media, large containers |
| `--radius-modal` | 20px | Modals, success states, overlay containers |

**Rule:** No radius value other than these 5 may be used in the product.

---

## ELEVATION SCALE

| Level | Token | Value | Usage |
|-------|-------|-------|-------|
| 0 | None | — | Page surfaces, sections |
| 1 | `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.06)` | Resting cards, sidebar elements |
| 2 | `--shadow-md` | `0 4px 12px -2px rgb(0 0 0 / 0.08)` | Hovered cards, dropdowns |
| 3 | `--shadow-lg` | `0 8px 24px -4px rgb(0 0 0 / 0.1)` | Modals, mobile menu |
| 4 | `--shadow-xl` | `0 12px 40px -8px rgb(0 0 0 / 0.12)` | Hero overlays, notifications |

**Shadow color:** Using `rgb(0 0 0 / opacity)` to ensure consistent shadow color regardless of background.

---

## COLOR SYSTEM

### Brand Colors

| Token | Value | Role | Accessibility |
|-------|-------|------|---------------|
| `--primary` | #00236f | Trust, authority, primary actions | On white: 8.5:1 contrast |
| `--primary-foreground` | #faf8ff | Text on primary backgrounds | On navy: 8.5:1 contrast |
| `--destructive` | #ba1a1a | Urgency, emergency, critical actions | On white: 5.8:1 contrast |
| `--destructive-foreground` | #ffffff | Text on destructive backgrounds | On crimson: 7:1 contrast |

### Surface Colors

| Token | Value | Role | Notes |
|-------|-------|------|-------|
| `--background` | #faf8ff | Page background | Very light warm off-white |
| `--foreground` | #1a1b21 | Primary text, headings | Near-black |
| `--card` | #f4f3fa | Card background, section alternation | Slightly darker than background |
| `--card-foreground` | #1a1b21 | Text on card backgrounds | Same as foreground |
| `--secondary` | #eeedf4 | Non-interactive surfaces, image placeholders | Light gray-lavender |
| `--secondary-foreground` | #1a1b21 | Text on secondary surfaces | Same as foreground |

### Text Colors

| Token | Value | Role | Accessibility |
|-------|-------|------|---------------|
| `--foreground` | #1a1b21 | Primary text | On background: 12:1 contrast |
| `--muted-foreground` | #444651 | Secondary text, metadata | On background: 5.8:1 contrast |
| `--primary` (as text) | #00236f | Interactive text, links | On background: 8.5:1 contrast |

### Border Colors

| Token | Value | Role |
|-------|-------|------|
| `--border` | #E5E7EB | Standard borders between elements |

---

## MOTION TOKENS

### Duration

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | URGENCY mode interactions, hover states |
| `--duration-standard` | 200ms | Focus states, state transitions |
| `--duration-gentle` | 300ms | CONNECTION, COMMUNITY, EVIDENCE interactions |
| `--duration-narrative` | 500ms | NARRATIVE mode scroll reveals, page transitions |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-fast` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | URGENCY mode |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most UI transitions |
| `--ease-gentle` | `cubic-bezier(0, 0, 0.2, 1)` | CONNECTION, COMMUNITY, EVIDENCE |
| `--ease-narrative` | `cubic-bezier(0.16, 1, 0.3, 1)` | NARRATIVE scroll reveals |

---

## BREAKPOINT TOKENS

| Token | Value | Usage |
|-------|-------|-------|
| `--bp-sm` | 640px | Mobile → large mobile |
| `--bp-md` | 768px | Mobile → tablet |
| `--bp-lg` | 1024px | Tablet → desktop |
| `--bp-xl` | 1280px | Desktop max-width |
| `--bp-2xl` | 1440px | Large desktop |

---

## CONTAINER WIDTHS

| Token | Value | Usage |
|-------|-------|-------|
| `--content-max` | 1280px | Maximum content width (sections, full pages) |
| `--content-narrow` | 720px | Centered content, FAQ, single-column layouts |
| `--content-text` | 540px | Body text max-width for readability |

---

## GRID SPECIFICATION

| Token | Value | Usage |
|-------|-------|-------|
| Desktop columns | 12 | Full grid at ≥ 1024px |
| Mobile columns | 4 | Below 768px |
| Grid gap | 24px | Between all grid items |
| Section padding (sides) | 24px | Mobile: `px-6` |
| Section padding (sides) | 32px | Desktop: `px-8` |

---

## OPACITY TOKENS

| Token | Value | Usage |
|-------|-------|-------|
| `--opacity-disabled` | 0.5 | Disabled buttons, inactive elements |
| `--opacity-muted` | 0.6 | Muted text, secondary information |
| `--opacity-subtle` | 0.15 | Hover backgrounds (subtle fills) |
| `--opacity-overlay` | 0.5 | Modal/drawer overlays |

---

## BORDER TOKENS

| Token | Value | Usage |
|-------|-------|-------|
| `--border-width-standard` | 1px | Most borders |
| `--border-width-emphasis` | 2px | Toggle buttons, active states, dashed zones |
| `--border-width-accent` | 4px | Left accent borders (emphasis sections) |

---

## ICON TOKEN

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-xs` | 12px | Inline icons within text |
| `--icon-sm` | 14px | Compact buttons, labels |
| `--icon-md` | 16px | Standard icon size (lucide default) |
| `--icon-lg` | 18px | Buttons with text, emphasis icons |
| `--icon-xl` | 22px | Standalone icons, upload zones |
| `--icon-2xl` | 28px | Success checkmarks, large indicators |
