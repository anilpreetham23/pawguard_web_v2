# PawGuard Performance Budget

## Complete performance specification — non-negotiable.

---

## BUDGET TABLE

| Metric | Target | Measurement | Priority | Current Status |
|--------|--------|-------------|----------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Lighthouse | P0 | ~5.5s (video blocking) |
| **FID** (First Input Delay) | < 100ms | Lighthouse | P0 | — |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Lighthouse | P0 | ~0.15 (images without dimensions) |
| **TTI** (Time to Interactive) | < 3.5s | WebPageTest | P0 | — |
| **TBT** (Total Blocking Time) | < 200ms | Lighthouse | P1 | — |
| **SI** (Speed Index) | < 3.5s | Lighthouse | P1 | — |
| **First Load JS** | < 200 KB | Bundle analyzer | P1 | ~306 KB (includes unused shadcn) |
| **First Load CSS** | < 50 KB | Bundle analyzer | P1 | ~122 KB (includes unused styles) |
| **Page weight** | < 2 MB (excluding video) | Network tab | P0 | ~306 KB JS + 122 KB CSS + images |
| **Hero video** | < 2 MB | File system | P0 | 9.7 MB (must reduce) |
| **Image per page** | < 500 KB total | Network tab | P1 | — |
| **Lighthouse Performance** | ≥ 90 | Lighthouse | P0 | — |
| **Lighthouse Accessibility** | ≥ 90 | Lighthouse | P0 | — |
| **Lighthouse Best Practices** | ≥ 90 | Lighthouse | P0 | — |
| **Lighthouse SEO** | ≥ 90 | Lighthouse | P0 | — |
| **Time to first paint** | < 1.5s | WebPageTest | P1 | — |
| **Time to first meaningful paint** | < 2.0s | WebPageTest | P1 | — |

---

## ASSET BUDGETS

### Video

| Requirement | Specification | Rationale |
|-------------|---------------|-----------|
| Format | WebM (VP9) with MP4 (H.264) fallback | Broad browser support |
| Max size | 2 MB | 4G: ~1s load. 3G: ~3s load. |
| Resolution | 1280×720 max | No benefit above 720p for hero |
| Poster image | JPEG, < 100 KB | First paint needs visible content |
| Loading | `preload="none"`, `loading="lazy"` | Don't block initial render |
| Controls | Hidden by default, visible on hover/focus | Autoplay muted |
| Fallback | Poster image displays if video fails | Graceful degradation |

### Images

| Requirement | Specification | Rationale |
|-------------|---------------|-----------|
| Format | WebP with JPEG fallback | WebP is 25-35% smaller |
| Max dimension | 1200px width (hero), 800px (cards) | Never serve larger than needed |
| Max file size | 200 KB (hero), 100 KB (cards) | — |
| Loading | `loading="lazy"` on all below-fold | Defer off-screen images |
| Dimensions | Always include `width` and `height` | Prevent CLS |
| `fetchpriority` | `high` on LCP image, `low` on rest | Prioritize critical image |

### JavaScript

| Requirement | Specification | Rationale |
|-------------|---------------|-----------|
| Bundle splitting | Per-page chunks with React.lazy | Users only load the JS they need |
| Max chunk size | < 100 KB per page | — |
| Third-party JS | Minimal. No analytics that block rendering. | — |
| Unused code | Remove unused shadcn components | ~80 KB of dead code |

### CSS

| Requirement | Specification | Rationale |
|-------------|---------------|-----------|
| Critical CSS | Inlined in `<head>` | Render without waiting for CSS file |
| Non-critical CSS | Deferred | — |
| Max CSS size | < 50 KB after tree-shaking | Current: 122 KB |

### Fonts

| Requirement | Specification | Rationale |
|-------------|---------------|-----------|
| Loading | `font-display: swap` | Text visible immediately with fallback |
| Preconnect | `<link rel="preconnect">` to Google Fonts | Faster font load |
| Subset | Only load needed weights (400, 500, 600, 700) | Don't load unused weights |
| Total font size | < 50 KB | Inter + Playfair + JetBrains |

---

## NETWORK CONDITIONS

### Target Performance by Connection

| Connection | LCP Target | TTI Target | Page Load Target | Notes |
|------------|------------|------------|------------------|-------|
| **Fiber** (50+ Mbps) | < 1.0s | < 1.5s | < 2.0s | Best case |
| **Broadband** (25 Mbps) | < 1.5s | < 2.0s | < 3.0s | Typical home |
| **4G mobile** (15 Mbps) | < 2.0s | < 2.5s | < 4.0s | Typical mobile |
| **3G mobile** (3 Mbps) | < 3.0s | < 4.0s | < 8.0s | Slow case — emergency must still work |
| **Slow 3G** (1 Mbps) | < 5.0s | < 6.0s | < 12.0s | Worst case — forms must be functional |

### Emergency Priority (3G / Slow 3G)

On slow connections during emergency:
- All non-critical assets (video, non-essential images) are deferred
- Form fields render immediately (native HTML, no JS needed)
- Geolocation fires on mount and prefills
- Submit queues data locally if offline

---

## IMPLEMENTATION CHECKLIST

```
PERFORMANCE BUDGET CHECKLIST

[ ] Hero video: < 2 MB
[ ] Hero video: WebM + MP4 + poster
[ ] Hero video: preload="none", loading="lazy"
[ ] All images: WebP format
[ ] All images: width + height attributes
[ ] All images: loading="lazy" (below-fold)
[ ] LCP image: fetchpriority="high"
[ ] Fonts: font-display: swap
[ ] Fonts: preconnect to Google Fonts
[ ] JS: React.lazy code splitting per page
[ ] JS: Remove unused shadcn imports
[ ] CSS: Tree-shake unused styles
[ ] CSS: Critical CSS inlined
[ ] No render-blocking external resources
[ ] Lighthouse Performance ≥ 90
[ ] Lighthouse Accessibility ≥ 90
[ ] Lighthouse Best Practices ≥ 90
[ ] Lighthouse SEO ≥ 90
[ ] LCP < 2.5s (verified)
[ ] FID < 100ms (verified)
[ ] CLS < 0.1 (verified)
[ ] 3G test: Forms functional < 10s
[ ] 3G test: Emergency submission < 15s
[ ] Offline test: Forms queue and retry
```

---

## PERFORMANCE BUDGET OWNERSHIP

```
Owner: Jake Morrison — Performance Engineer

Violations:
- Critical (Lighthouse < 70): Block release
- Major (Lighthouse < 80): Fix within sprint
- Minor (Lighthouse < 90): Log, fix next sprint

The Performance Budget is part of the design specification.
No feature may ship without meeting performance targets.
```
