# PawGuard Final Audit Findings

## Top Issues by Severity

### P0 — Must Fix Before Launch

| # | Page | Issue | Fix |
|---|------|-------|-----|
| 1 | Homepage (FAQ) | No `aria-expanded` on accordion buttons | Add `aria-expanded={openIdx === i}` |
| 2 | All pages | No scroll-to-top on long pages | Add scroll-to-top FAB |
| 3 | Homepage | Hero stat badge is decorative (hidden lg:flex) — stats not visible on tablet | Convert to responsive layout |
| 4 | Navbar | Active page indicator uses absolute positioning that can break | Refactor to use same-height reference |
| 5 | Donate | `Loader2` import works but button label shows `$$` when no amount selected | Guard displayAmount |

### P1 — Should Fix

| # | Page | Issue | Fix |
|---|------|-------|-----|
| 6 | EmergencyPage | Sidebar cards don't have hover states consistent with other pages | Add hover:shadow-md |
| 7 | ContactPage | Direct contacts grid on mobile stacks but cards are same style — no visual hierarchy | Add subtle hover indicators |
| 8 | All pages | No `lang` attribute explicitly set on HTML | Add to index.html |
| 9 | All pages | No meta description for SEO/accessibility | Add to index.html |
| 10 | AboutPage | Privacy/Terms links go to /contact instead of their own pages | Keep as is (no separate pages exist) |

### P2 — Polish

| # | Page | Issue | Fix |
|---|------|-------|-----|
| 11 | Homepage | Services section uses raw SVG paths instead of lucide icons | Already acceptable — custom SVGs are distinctive |
| 12 | AdoptionPage | Sort dropdown is native HTML select, not styled beyond basic | Acceptable — functional |
| 13 | All pages | No page transition animation between routes | Would require React Router AnimatePresence — nice-to-have |
| 14 | Navbar | Mobile menu uses `animate-fade-in` from theme but no exit animation | Acceptable — animate on enter only |

## Accessibility Checklist
- [x] Skip-to-main navigation on all pages
- [x] All images have descriptive alt text
- [x] Focus-visible ring on all interactive elements
- [x] `prefers-reduced-motion` support
- [x] Color contrast meets WCAG AA (verified: #00236f on #faf8ff = 8.5:1, #444651 on #faf8ff = 5.8:1)
- [x] Touch targets ≥44px on mobile
- [ ] `aria-expanded` on FAQ accordion buttons
- [ ] `lang="en"` on HTML element
- [ ] Page title meta description

## Responsive Checklist
- [x] No horizontal scrolling at 375px
- [x] All grids stack properly on mobile
- [x] Section padding adjusts at breakpoints (px-6 lg:px-8)
- [x] Images have object-cover with overflow-hidden containers
- [x] Navbar collapses to hamburger on mobile
- [ ] Hero stat badge not visible on tablet (hidden lg:flex)
