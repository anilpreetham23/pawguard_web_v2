# PawGuard Interaction Language

## Core Principles

Every interaction must answer:
- What just happened? (system status)
- What can I do next? (affordance)
- What will happen if I do? (prediction)

## Button Interaction Design

### States
```
[Resting] → [Hover] → [Pressed] → [Resting]
[Resting] → [Hover] → [Focus (keyboard)] → [Resting]
[Resting] → [Loading] → [Success] → [Resting]
[Resting] → [Disabled]
```

### Visual Feedback

| State | Primary Button | Secondary Button | Outline Button | Destructive Button |
|-------|---------------|-----------------|----------------|-------------------|
| Resting | Navy bg, white text | Near-black bg, white text | Border, navy text, no bg | Crimson bg, white text |
| Hover | Darker navy, shadow+1 | Navy bg, shadow+1 | Border navy, bg navy/5 | Darker crimson, shadow+1 |
| Pressed | Scale 0.98, darker bg | Scale 0.98, darker bg | Scale 0.98, border shift | Scale 0.98, darker bg |
| Focus | Ring 2px navy/50 | Ring 2px navy/50 | Ring 2px navy/50 | Ring 2px crimson/50 |
| Loading | Spinner + text | Spinner + text | Spinner + text | Spinner + text |
| Disabled | Opacity 0.5, no shadow | Opacity 0.5, no shadow | Opacity 0.5 | Opacity 0.5 |
| Success | Brief checkmark flash | Brief checkmark flash | Brief checkmark flash | Brief checkmark flash |

### Microcopy Matches Button State

```
Resting:  "Send Rescue Request"
Loading:  "Contacting Nearest Unit..."
Success:  "✓ Rescue Team Dispatched"
Error:    "Failed to Send — Tap to Retry"
Disabled: [condition: location missing]
```

## Form Interaction Design

### Field Validation

| Interaction | Input State | Message |
|------------|-------------|---------|
| User focuses field | Border navy highlight | — |
| User types | Live character count (optional) | — |
| User blurs with invalid data | Border crimson, alert icon | Specific guidance |
| User corrects | Border returns to default, error removed | — |
| User submits with missing fields | All invalid fields highlighted | First error receives focus |

### Validation Timing

| Mode | Validation Type | Rationale |
|------|----------------|-----------|
| URGENCY | On submit only | Panicked users should not be interrupted mid-field |
| CONNECTION | On blur | Browsing users benefit from gentle correction |
| EVIDENCE | On blur then submit | Accuracy matters. Validate early and at submission. |
| COMMUNITY | On blur | Low-stakes form, gentle validation |
| NARRATIVE | On submit (if any) | Narrative pages rarely have forms |

### Form Submission Patterns

**Standard (all modes except URGENCY):**
```
[Submit] → Button loading → API call → Success state → Reset option
```

**Urgency submission (URGENCY mode only):**
```
[Send Rescue Request] → Immediate loading → Optimistic success → Background sync if offline
```

## Card Interaction Design

### States
```
[Resting] → [Hover] → [Resting]
[Resting] → [Focus (keyboard)] → [Resting]
```

### Visual Feedback

| State | Card | Image |
|-------|------|-------|
| Resting | Default shadow | Default scale |
| Hover | Shadow+1, border subtle shift | Image scale 1.03 |
| Focus | Ring 2px navy/50 | Same as hover |

### AdoptionCard Specific
- Hover: Image zooms, CTA border fills with primary color
- Click: Navigates to /adopt/:id (detail page)

### StoryCard Specific
- Hover: Image zooms, shadow deepens
- Featured variant: No hover state (it anchors the page)

## Navigation Interaction Design

### Navbar
| Element | Hover | Active | Focus |
|---------|-------|--------|-------|
| Logo | Shadow on icon | — | Ring |
| Nav links | Color shift → navy | Underline indicator | Ring |
| Donate button | Darker navy + shadow | Scale 0.98 | Ring |
| Emergency button | Fill crimson | Scale 0.98 | Ring |
| Hamburger (mobile) | Background shift | — | Ring |

### Mobile Menu
| State | Behavior |
|-------|----------|
| Open | Slide down 200ms, fade in |
| Close | Slide up 150ms, fade out |
| Link tap | Close menu, navigate |
| Escape key | Close menu, focus hamburger |
| Outside tap | Close menu |

## Scroll-to-Top FAB
| State | Behavior |
|-------|----------|
| Hidden (above 600px scroll) | Opacity 0, pointer-events none |
| Visible (below 600px scroll) | Opacity 100, pointer-events auto, spring entrance |
| Hover | Shadow+1, subtle scale |
| Click | Smooth scroll to top, 400ms ease-out |

## Touch Interaction (Mobile)

| Interaction | Target | Gesture |
|-------------|--------|---------|
| Tap | Buttons, links, cards | Touch start → brief highlight → action |
| Long press | Images on adoption cards | Quick peek → future: detail preview |
| Swipe | Carousel (future) | Horizontal swipe |
| Pull to refresh (future) | Adoption listings | Vertical pull |
| Double tap (future) | Image zoom | Pinch or double tap |
