# PawGuard Motion Language

## Motion Philosophy

Every animation in PawGuard must answer one of these questions:
- "Where did this come from?"
- "Where did it go?"
- "Why did it move?"
- "What changed?"

If an animation cannot answer one of these, delete it.

## Motion by Mode

| Mode | Duration | Easing | Character |
|------|----------|--------|-----------|
| URGENCY | 150-200ms | `ease-out` | Fast, direct, no decoration |
| CONNECTION | 300-400ms | `ease-out` | Gentle, warm, organic |
| EVIDENCE | 300ms | `ease` | Stable, predictable, no bounce |
| COMMUNITY | 300-400ms | `ease-out` | Inviting, human-scale |
| NARRATIVE | 500-700ms | `ease-out` | Story-driven, cinematic |

## Easing Tokens

| Token | Value | Used For |
|-------|-------|----------|
| `--ease-fast` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | URGENCY mode interactions |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most UI transitions |
| `--ease-gentle` | `cubic-bezier(0, 0, 0.2, 1)` | CONNECTION and COMMUNITY mode |
| `--ease-narrative` | `cubic-bezier(0.16, 1, 0.3, 1)` | NARRATIVE mode scroll reveals |
| `--ease-spring` | Spring-based (physics) | Microinteractions (scale on press) |

## Animation Types

### Entrance Animations
| Element | Animation | Timing | Details |
|---------|-----------|--------|---------|
| Page (route change) | Fade up + slight scale | 300ms | Content fades in, background stays |
| Section (scroll reveal) | Fade up + translate | 500ms | Single observer for all sections |
| Card grid | Staggered fade up | 400ms offset | Each card delayed 80ms |
| Hero image | Fade in | 400ms | No movement — just reveal |
| Stats counter | Animate numbers | 800ms | Count up on scroll into view |
| Success state | Scale in | 200ms | Form submission confirmation |
| Mobile menu | Slide down | 200ms | Panel slides, overlay fades |

### Exit Animations
| Element | Animation | Timing |
|---------|-----------|--------|
| Page (navigate away) | Quick fade | 150ms |
| Mobile menu | Slide up | 150ms |
| Toast notification | Slide out right | 250ms |
| Error message | Fade out | 200ms |

### Hover Animations
| Element | Property | Duration | Transform |
|---------|----------|----------|-----------|
| Button | Shadow, bg | 150ms | Scale 0.98 on press |
| Card | Shadow | 200ms | — |
| Card image | Scale | 400ms | Scale 1.03 |
| Nav link | Color | 150ms | — |
| Logo icon | Shadow | 150ms | — |

### State Transition Animations
| Transition | Animation | Duration |
|------------|-----------|----------|
| Button idle → loading | Fade icon → spinner | 200ms |
| Button loading → success | Spinner → checkmark | 300ms |
| Form idle → error | Red border slide | 200ms |
| Accordion open | Content slide down | 200ms |
| Accordion close | Content slide up | 150ms |

### Microinteractions
| Moment | Animation | Feeling |
|--------|-----------|---------|
| Emergency report sent | Pulsing dot + "Unit Dispatched" | Relief, confidence |
| Donation complete | Checkmark + brief scale celebration | Satisfaction, trust |
| Volunteer application | Gentle confetti (optional) | Welcome, belonging |
| Adoption match (future) | Heart animation | Connection, joy |
| Image load | Skeleton → gentle fade in | Patience, smoothness |
| Network loss | Banner slides down | Awareness, not panic |
| Network recovery | Banner slides up | Relief |

## Reduced Motion

When `prefers-reduced-motion: reduce` is detected:
- All entrance/exit animations are skipped (instant appear)
- All hover transforms are skipped (instant state change)
- All scroll-triggered animations are skipped (content visible immediately)
- Essential motion remains active:
  - Loading spinners (communicate system status)
  - Progress bars (communicate system status)
  - Button loading state changes (communicate system status)
  - Accordion open/close (reduce cognitive load without motion)

## Implementation Rules

1. `transition-all` is forbidden. Always specify the property being transitioned.
2. Use CSS custom properties for durations and easings.
3. Prefer CSS animations over JS animations for standard UI interactions.
4. Use Framer Motion (or similar) only for choreographed page transitions.
5. Every animation must be tested with `prefers-reduced-motion: reduce`.
