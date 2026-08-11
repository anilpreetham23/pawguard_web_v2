# PawGuard Complete Visual Design System — Component Specifications

## Every primitive with all states defined.

---

## BUTTON

### Variants

| Variant | Resting | Hover | Pressed | Focus | Disabled | Loading | Success |
|---------|---------|-------|---------|-------|----------|---------|---------|
| **Primary** | Navy bg, white text, shadow-sm | Navy-800 bg, shadow-md | Scale 0.98, bg navy-900 | Ring 2px navy/50 | Opacity 0.5, no shadow | Spinner + "Processing..." | Checkmark + confirmation text |
| **Secondary** | Near-black bg, white text, shadow-sm | Navy bg, shadow-md | Scale 0.98 | Ring 2px navy/50 | Opacity 0.5, no shadow | Spinner + "Processing..." | Checkmark + confirmation text |
| **Outline** | Transparent bg, navy border, navy text | Navy/5 bg, border navy | Scale 0.98, bg navy/10 | Ring 2px navy/50 | Opacity 0.5 | Spinner + "Processing..." | Checkmark + confirmation text |
| **Ghost** | Transparent bg, navy text | Navy/5 bg | Scale 0.98, bg navy/10 | Ring 2px navy/50 | Opacity 0.3 | Spinner + "Processing..." | Checkmark + confirmation text |
| **Destructive** | Crimson bg, white text, shadow-sm | Crimson-700 bg, shadow-md | Scale 0.98, bg crimson-800 | Ring 2px crimson/50 | Opacity 0.5, no shadow | Spinner + "Contacting..." | Checkmark + "Dispatched" |

### Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| **sm** | 36px | `px-4 py-2` | 11px | 14px |
| **md** | 48px | `px-6 py-3` | 12px | 16px |
| **lg** | 56px | `px-8 py-4` | 13px | 18px |

### Loading States (text per context)

| Context | Resting | Loading | Success |
|---------|---------|---------|---------|
| Emergency | Send Rescue Request | Contacting Nearest Unit... | ✓ Rescue Team Dispatched |
| Adoption (detail) | Meet Bella | Sending Request... | ✓ Request Sent |
| Adoption (apply) | Submit Application | Submitting... | ✓ Application Received |
| Donate | Give $50/month | Processing Payment... | ✓ Donation Complete |
| Volunteer | Submit Application | Submitting... | ✓ Welcome to PawGuard |
| Contact | Send Message | Sending... | ✓ Message Sent |
| Newsletter | Subscribe | Subscribing... | ✓ Subscribed |

---

## INPUT

### Variants

| Variant | Default | Focus | Filled | Error | Disabled | Success |
|---------|---------|-------|--------|-------|----------|---------|
| **Text** | White bg, border-border, rounded-input, 48px h | Navy ring 2px/20, border navy | Same as default | Crimson border, error msg below | Opacity 0.5, gray bg | Green border (optional) |
| **Textarea** | Same as text, `resize-none`, 120px min-h | Same ring | Same as default | Crimson border, error msg below | Opacity 0.5 | Green border (optional) |
| **Select** | Same as text, native dropdown arrow | Same ring | Same as default | Crimson border, error msg below | Opacity 0.5 | Green border (optional) |

### Dimensions

| Property | Value |
|----------|-------|
| Height | 48px (`py-3.5` vertical padding) |
| Width | 100% (full-width always) |
| Corner radius | `rounded-input` (12px) |
| Border | 1px `border-border` |
| Font size | `text-base` (16px) |
| Padding horizontal | `px-4` (16px) |

### States (visual)

```
Default:  [white bg] [1px border #E5E7EB] [border-radius 12px]
Focus:    [white bg] [2px ring navy/20] [border navy]
Error:    [white bg] [1px border crimson] [ring crimson/20]
Disabled: [gray bg] [opacity 0.5] [cursor not-allowed]
```

### Label Pattern

```
<label className="text-xs font-semibold tracking-wider uppercase text-foreground">
  Your Name
</label>

<input 
  type="text" 
  placeholder="e.g. Jane Smith"
  className="..."
/>

{error && (
  <p id="name-error" className="text-xs text-destructive" role="alert">
    We need your name so we can reach you
  </p>
)}
```

### Validation Timing by Mode

| Mode | Timing | Behavior |
|------|--------|----------|
| URGENCY | On submit | Show all errors at once. Focus first error field. |
| CONNECTION | On blur | Validate after user leaves each field. |
| EVIDENCE | On blur + submit | Validate on blur AND on submit (double check). |
| COMMUNITY | On blur | Gentle validation. |
| NARRATIVE | On submit (if form exists) | N/A — narrative pages rarely have forms. |

---

## CARDS

### Variants

| Variant | Default | Hover | Focus | Featured |
|---------|---------|-------|-------|----------|
| **Default (display)** | White bg, border, shadow-sm, rounded-card | No hover state (not interactive) | No focus state | N/A |
| **Interactive** | White bg, border, shadow-sm, rounded-card | Shadow-md, border subtle, optional image zoom 1.03 | Ring 2px navy/50 | N/A |
| **Featured** | White bg or bg-card, no border, shadow-md, rounded-2xl | None (anchors layout) | None | 2-col layout, prominent image |

### Interactive Card Image Zoom

```
// Recommended CSS (not transition-all)
.group:hover img {
  transform: scale(1.03);
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Card Layout Patterns

| Pattern | Use |
|---------|-----|
| Image top, content bottom | AdoptionCard, StoryCard (non-featured) |
| Image left, content right | StoryCard (featured) |
| Icon top, text below | Volunteer role cards, Value cards |
| Full-content | Sidebar panels, trust badges |

---

## BADGE

| Variant | Background | Text | Use |
|---------|------------|------|-----|
| **Primary** | Navy | White | "New", "Vaccinated" |
| **Destructive** | Crimson | White | "Urgent", "Critical" |
| **Success** | Emerald (OKLCH) | White | "Available", "Adopted" |
| **Ghost** | Card background | Muted foreground | "Male", "Female" |

### Dimensions

| Property | Value |
|----------|-------|
| Height | 20px |
| Padding | `px-2.5 py-1` |
| Font size | `text-2xs` (10px) |
| Font weight | Bold (700) |
| Letter spacing | `tracking-wider` (0.1em) |
| Corner radius | 3px (small radius) |
| Text transform | Uppercase |

---

## MODAL (Success State)

| Property | Value |
|----------|-------|
| Background | White, `bg-background` |
| Border | 1px `border-border` |
| Corner radius | `rounded-modal` (20px) |
| Padding | `p-8 lg:p-10` |
| Shadow | `shadow-lg` |
| Entrance | Scale-in 200ms |
| Icon | Checkmark in circle (navy bg, white icon) |
| Icon size | 28px (icon inside 56px circle) |

### Layout

```
[56px circle with checkmark]
        ↓
[Heading] — "Report Submitted"
        ↓
[Message] — specific to action, includes impact
        ↓
[CTA] — "Make Another Gift" or "Submit Another Report"
```

---

## ALERT

| Variant | Background | Border | Icon | Use |
|---------|------------|--------|------|-----|
| **Error** | Crimson/5 | Crimson | AlertTriangle | Form errors, API failures |
| **Success** | Emerald/5 | Emerald | CheckCircle2 | Success confirmations |
| **Warning** | Amber/5 | Amber | AlertTriangle | Non-critical warnings |
| **Info** | Navy/5 | Navy | Info | Helpful information |

### Layout

```
[Icon] [Heading: optional]     [Dismiss: optional]
       [Message text]
```

---

## SKELETON

| Property | Value |
|----------|-------|
| Background | `bg-secondary` |
| Animation | Pulse (opacity 1→0.6→1) |
| Duration | 1500ms |
| Corner radius | Same as replaced element |

### Skeleton Variants

| Variant | Dimensions | Replaces |
|---------|-----------|----------|
| **Image** | 200px × 100% | Card images |
| **Text line** | `h-4 w-3/4` | Heading |
| **Text block** | `h-3 w-full` × 3 | Description |
| **Card** | Full card dimensions | Entire card |
