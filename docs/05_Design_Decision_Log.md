# PawGuard Design Decision Log

| # | Decision | Rationale | Alternatives | Expected Benefit |
|---|----------|-----------|--------------|------------------|
| 1 | **Playfair Display for headings** | Editorial authority and warmth that a sans-serif alone cannot convey. Differentiates from generic NGO sites. | Inter only, Georgia fallback | Stronger brand identity, less template-like |
| 2 | **Navy + Crimson color system** | Navy = trust/professionalism. Crimson = urgency/action. Distinct from generic blue/teal SaaS palettes. | Green/earthy NGO palette, Blue-only | Clear emotional signaling per context |
| 3 | **Bento grid for services (first card spans 2 cols)** | Breaks the monotony of equal-card grids. Highlights Emergency as most important service. | 4-column equal grid, List layout | Visual hierarchy, originality |
| 4 | **Scroll-triggered fade-in** | Reduces cognitive load on page load. Rewards scrolling with progressive reveal. | No animation, slide-in from sides | Better reading flow, reduced initial load |
| 5 | **Stat counter animation (IntersectionObserver)** | Draws attention to impact metrics. Communicates growth/progress visually. | Static numbers, Auto-increment on mount | Engagement with data, trust-building |
| 6 | **EmergencyActionPanel: three variants** | Same component adapts to context: full banner on homepage, inline in content, compact in navbar. | Single variant used everywhere | Consistency without repetition |
| 7 | **Dark footer** | Visual termination of page. Separates navigation from content. Contrast with light pages. | Light footer matching background | Clear page boundaries, premium feel |
| 8 | **Demo mode payment (Donate page)** | Avoids fake credit card fields that erode trust. Clear communication: "no real payment processed." | Real payment fields with small-print disclaimer | Honesty, trust preservation |
| 9 | **Form validation on submit with inline errors** | Standard UX pattern, but essential for emergency forms where errors cause delays. | Validate on blur only, Validate on change | Clear error recovery, reduced submission friction |
| 10 | **Loading spinners on all form submissions** | Visual feedback prevents double-submission. Communicates system status per Principle #3. | No loading state, Button text change only | Trust, usability |
| 11 | **RescueTimeline: horizontal + vertical variants** | Horizontal for homepage (space-efficient), vertical for content pages (narrative depth). | Single variant everywhere | Context-appropriate layout |
| 12 | **SectionHeading component** | Standardizes the eyebrow + heading + description pattern across all pages. Ensures visual consistency. | Ad-hoc heading styles per page | Consistency, rapid development |
| 13 | **`prefers-reduced-motion` support** | WCAG compliance. Users with vestibular disorders are not disrupted by animations. | No reduced-motion support | Accessibility |
| 14 | **Skip-to-main navigation** | WCAG compliance. Keyboard users can bypass repetitive navigation. | No skip link | Accessibility |
| 15 | **Scroll-to-top FAB** | Long pages need quick return without manual scrolling | No FAB | Improves usability on content-heavy pages |
| 16 | **FAQ `aria-expanded` on homepage** | WCAG compliance — screen readers must know toggle state | No aria attributes | Accessibility |
| 17 | **Hover shadow on Emergency sidebar** | Consistency with card hover patterns across site | No hover state | Uniform interaction language |
