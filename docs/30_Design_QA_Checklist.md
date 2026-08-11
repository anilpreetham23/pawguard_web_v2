# PawGuard Design QA Checklist

## Every page must pass all checks before being considered complete.

---

## VISUAL QA

```
PAGE: [name]
DATE: [date]
REVIEWER: [name]

LAYOUT
[ ] All sections visible at 1280px width
[ ] Content centered within max-width container
[ ] Section backgrounds alternate correctly (light → card → dark)
[ ] No two consecutive sections share the same layout
[ ] Grid alignment correct (12-col desktop, 4-col mobile)
[ ] Whitespace consistent with spacing scale

TYPOGRAPHY
[ ] Headings use Playfair Display
[ ] Body text uses Inter
[ ] Data/monospace uses JetBrains Mono
[ ] Font sizes match typography scale
[ ] Line heights match typography scale
[ ] Letter spacing correct (tight for headings, wider for labels)
[ ] No orphaned words in headings

COLOR
[ ] Navy used for primary actions and trust elements only
[ ] Crimson used for emergency/urgent elements only
[ ] Background/card colors alternate correctly
[ ] Text contrast ≥ 4.5:1 for body text
[ ] Text contrast ≥ 3:1 for large text (≥ 18px bold or ≥ 24px)
[ ] No color-only indicators (icons or text accompany color)

ELEVATION
[ ] Card shadow: shadow-sm (resting)
[ ] Card shadow: shadow-md (hover)
[ ] Modal shadow: shadow-lg
[ ] Navbar shadow: shadow-sm
[ ] No elements have missing or incorrect shadows

BORDERS
[ ] Section borders: border-b border-border
[ ] Card borders: border border-border
[ ] Input borders: border border-border
[ ] Active/toggle borders: 2px width
[ ] Left accent borders: 4px width
[ ] Dashed borders: 2px dashed

RADIUS
[ ] Buttons: rounded-btn (10px)
[ ] Inputs: rounded-input (12px)
[ ] Cards: rounded-card (16px)
[ ] Hero images: rounded-2xl (24px)
[ ] Modals: rounded-modal (20px)
[ ] No other radius values used

IMAGES
[ ] All images have width and height attributes
[ ] All images have descriptive alt text
[ ] Images use object-cover in containers
[ ] No broken images (test all)
[ ] Image fallback for failure states
```

---

## UX QA

```
INFORMATION ARCHITECTURE
[ ] Page purpose clear within 3 seconds
[ ] Primary CTA visible without scrolling
[ ] Reading path follows F-pattern
[ ] All sections answer one user question
[ ] Navigation includes current page indicator
[ ] Breadcrumbs present (if deep navigation exists)

COGNITIVE LOAD
[ ] No more than 5-7 items in any list/menu
[ ] Forms have minimum required fields (emergency: 4 max)
[ ] Labels are clear, not placeholder-only
[ ] Error messages guide recovery, not just state problem
[ ] Success messages include specific impact

DECISION FATIGUE
[ ] Default selections present (severity: critical, amount: $50)
[ ] No more than 5 preset options per choice
[ ] CTAs are clearly primary vs secondary
[ ] Emergency flow has no confirmation dialogs

TASK COMPLETION
[ ] Emergency report: < 90 seconds, 4 fields max
[ ] Find adoptable animal: < 30 seconds
[ ] Complete donation: < 2 minutes
[ ] Volunteer application: < 5 minutes
[ ] Contact form: < 2 minutes

TRUST SIGNALS
[ ] Stats are specific (4,200+), not generic (thousands)
[ ] Trust badges visible before commitment (donate, volunteer)
[ ] "What happens next" visible before submission
[ ] Financial breakdown shown (78% to programs)
[ ] Third-party verification present (or placeholders)
```

---

## ACCESSIBILITY QA

```
WCAG AA AUDIT
[ ] Skip-to-main first focusable element
[ ] All images have alt text (descriptive, not generic)
[ ] All form inputs have <label> with htmlFor
[ ] Error messages use aria-describedby + role="alert"
[ ] Success messages use aria-live="assertive"
[ ] Color contrast: body text ≥ 4.5:1, large text ≥ 3:1
[ ] Touch targets minimum 44×44px (48px for emergency CTAs)
[ ] Focus order follows visual reading order
[ ] Focus visible on all interactive elements (navy ring)
[ ] Keyboard navigation works for all interactions
[ ] No keyboard traps
[ ] prefers-reduced-motion respected
[ ] All animations have reduced motion alternatives
[ ] Page zoom to 200%: no horizontal scroll, no content clipping
[ ] Screen reader test: all content announced correctly
[ ] aria-expanded on accordion buttons
[ ] aria-current="page" on active nav link
[ ] No auto-playing media without controls

WCAG AAA (target for emergency content only)
[ ] Emergency page text contrast ≥ 7:1
```

---

## RESPONSIVE QA

```
BREAKPOINT VERIFICATION
[ ] 320px: No horizontal scroll. Content fills width.
[ ] 375px: All CTAs visible. Touch targets ≥44px.
[ ] 390px: Same as 375px. No overflow.
[ ] 414px: Same as 375px. No awkward text wrap.
[ ] 768px: Navigation expanded. 2-column layouts work.
[ ] 1024px: Full nav. 3-column card grids. Full hero.
[ ] 1280px: Max-width container centered. All content visible.
[ ] 1440px: Same as 1280px. Centered with margins.
[ ] 1920px: Same as 1280px. Wide margins.

ORIENTATION (Mobile)
[ ] Portrait: All content readable, CTAs visible
[ ] Landscape: No obstructions, CTAs accessible

SPECIAL
[ ] Zoom 200%: No horizontal scroll
[ ] Keyboard open (mobile): Form visible, button accessible
[ ] Safe areas respected (notch, home indicator)
[ ] Touch targets: minimum 44×44px, verified on mobile
```

---

## INTERACTION QA

```
BUTTON STATES
[ ] Resting: correct colors, shadow
[ ] Hover: color darkens, shadow increases (150ms)
[ ] Press: scale 0.98 (100ms)
[ ] Focus: navy ring (150ms)
[ ] Loading: spinner + descriptive text (no layout shift)
[ ] Disabled: opacity 0.5, no shadow
[ ] Success: checkmark + confirmation text

INPUT STATES
[ ] Default: correct border, radius, padding
[ ] Focus: navy border, ring (200ms)
[ ] Error: crimson border, error message visible
[ ] Disabled: opacity 0.5, gray bg
[ ] Filled: normal state (no change needed)
[ ] Validation: error message linked via aria-describedby

CARD STATES
[ ] Resting: correct shadow
[ ] Hover: shadow-md, optional image zoom (200ms shadow, 400ms image)
[ ] Focus: navy ring (150ms)
[ ] Click: navigate to destination

NAVIGATION
[ ] Desktop links: hover color shift (150ms)
[ ] Active link: underline indicator
[ ] Mobile menu open: slide down (200ms)
[ ] Mobile menu close: slide up (150ms)
[ ] Escape key closes mobile menu
[ ] Outside click closes mobile menu
[ ] Focus returns to hamburger after close

FORM SUBMISSION
[ ] Button shows loading state
[ ] Button disabled during processing
[ ] Success shows confirmation
[ ] Error shows recovery path
[ ] Focus moves to success message (on success)
[ ] Focus moves to first error (on failure)

PAGE TRANSITION
[ ] Route change shows brief loading indicator
[ ] Content appears smoothly (300ms fade)
```

---

## CONTENT QA

```
COPY CHECK
[ ] All copy matches Communication Guide (doc 08)
[ ] No generic phrases ("Learn More", "Click Here", "Submit")
[ ] CTAs are action-oriented and specific
[ ] Error messages explain how to fix, not just what's wrong
[ ] Success messages include specific impact
[ ] Loading text describes what's happening
[ ] No placeholder text from development

CONSISTENCY
[ ] Same action uses same text everywhere
[ ] Tone matches page mode (urgent, warm, evidence, community)
[ ] No duplicate copy across pages
[ ] Brand name always capitalized: "PawGuard"
[ ] Numbers formatted consistently: "4,200+"

SPECIFICITY
[ ] All claims backed by specific numbers
[ ] All stories include real names, dates, locations
[ ] All CTAs reference specific outcomes
[ ] No vague statements ("we help animals")
```

---

## PERFORMANCE QA

```
LIGHTHOUSE (Target: 90+ all categories)
[ ] Performance ≥ 90
[ ] Accessibility ≥ 90
[ ] Best Practices ≥ 90
[ ] SEO ≥ 90

WEB VITALS (Target)
[ ] LCP < 2.5 seconds
[ ] FID < 100ms
[ ] CLS < 0.1

ASSETS
[ ] Hero video < 2 MB (WebM)
[ ] Images use WebP format
[ ] Images have width/height (no CLS)
[ ] Video has poster image
[ ] Lazy loading on all below-fold images
[ ] No render-blocking resources (except critical CSS)

CODE SPLITTING
[ ] Pages code-split with React.lazy + Suspense
[ ] No unused component imports
[ ] No transition-all (specific properties only)
```

---

## BROWSER QA

```
CROSS-BROWSER
[ ] Chrome (latest): Full pass
[ ] Firefox (latest): Full pass
[ ] Safari (latest): Full pass
[ ] Edge (latest): Full pass
[ ] Chrome Android: Full pass
[ ] Safari iOS: Full pass

DEVICE TESTING
[ ] Desktop (1920×1080): Full pass
[ ] Laptop (1440×900): Full pass
[ ] Tablet (768×1024): Full pass
[ ] Mobile (375×812): Full pass
[ ] Small mobile (320×568): Full pass
```

---

## OVERALL APPROVAL

```
[ ] Visual QA: PASS / FAIL
[ ] UX QA: PASS / FAIL
[ ] Accessibility QA: PASS / FAIL
[ ] Responsive QA: PASS / FAIL
[ ] Interaction QA: PASS / FAIL
[ ] Content QA: PASS / FAIL
[ ] Performance QA: PASS / FAIL
[ ] Browser QA: PASS / FAIL

OVERALL: PASS / FAIL

REVIEWER SIGNATURE: ____________________
DATE: __________________________________
```
