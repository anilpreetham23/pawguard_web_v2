# PawGuard Accessibility Principles

## Standard

All pages target **WCAG AA** as minimum. Where possible, WCAG AAA for contrast in critical emergency reading text.

## Core Requirements

### Perceivable
- All non-text content has text alternatives (images, icons, video)
- Captions provided for all video content
- Content adapts without loss when zoomed to 200%
- Color is never the only means of conveying information
- Minimum contrast: 4.5:1 for normal text, 3:1 for large text
- Emergency text targets 7:1 contrast

### Operable
- All functionality available from keyboard
- Focus order follows visual reading order
- No keyboard traps
- Touch targets minimum 44×44px (48px preferred for emergency CTAs)
- Motion limited or removable (prefers-reduced-motion)
- No auto-playing video without visible controls
- 10-second timeout minimum for form submissions (emergency forms: no timeout)

### Understandable
- Page language declared in <html lang="en">
- Form inputs have visible labels associated via htmlFor
- Error messages use aria-describedby and role="alert"
- Input purpose can be programmatically determined
- Navigation consistent across all pages
- No unexpected context changes on focus or input

### Robust
- Semantic HTML used for structure
- ARIA attributes used only when HTML semantics insufficient
- Custom components have appropriate roles, states, and properties
- Works with current and future assistive technologies

## Mode-Specific Accessibility Requirements

### URGENCY Mode (Emergency Page)
- Skip-to-main must be first focusable element
- All form fields must be reachable within 4 tab stops
- Submit button receives focus after successful submission
- Error messages announced via aria-live="assertive"
- Hotline number is a tap-to-call link (<a href="tel:...">)
- No timeout. Panicked users should not lose their form data.

### CONNECTION Mode (Adoption Page)
- Animal cards must be keyboard navigable (Enter activates, links to detail)
- Filter checkboxes must have visible focus states
- Sort dropdown must have accessible label
- Image alt text must describe the animal specifically ("Bella — a golden Labrador Retriever lying on grass")
- No auto-playing adoption carousels

### EVIDENCE Mode (Donate Page)
- Financial charts must have text alternatives
- Preset amounts must be focusable and selectable via keyboard
- Custom amount input must have clear label and instructions
- Trust badges must have alt text or aria-label
- "Demo mode" notice must be accessible to screen readers

### COMMUNITY Mode (Volunteer Page)
- Role cards must be keyboard navigable
- Application form labels must match role requirements clearly
- File upload (if added) must have accessible trigger

### NARRATIVE Mode (Homepage, Stories)
- Video must have controls visible on focus
- Image alt text must convey the story, not just description
- Scroll-triggered animations must respect reduced motion
- Featured story links must have descriptive link text

## Implementation Checklist

Every page must pass:
```
[ ] Skip-to-main link present and functional
[ ] All images have alt text
[ ] All form inputs have <label> with htmlFor
[ ] Color contrast checked (minimum 4.5:1)
[ ] Touch targets ≥44px
[ ] Focus order logical
[ ] Focus visible on all interactive elements
[ ] Error messages use aria-describedby
[ ] Success messages use aria-live
[ ] Keyboard navigation complete
[ ] prefers-reduced-motion respected
[ ] No auto-playing media
[ ] Page zoom to 200% works without horizontal scroll
[ ] Screen reader test: all content announced correctly
```

## Accessibility-First Design Decisions

| Decision | Rationale |
|----------|-----------|
| All form inputs have visible labels | Placeholders disappear on focus, leaving screen reader users without context |
| Skip-to-main on every page | Consistent with WCAG 2.4.1 — users can bypass repetitive navigation |
| Focus-visible ring in theme.css | Every interactive element gets consistent focus indication |
| prefers-reduced-motion | Users with vestibular disorders are not disrupted by motion |
| Semantic heading hierarchy | Screen reader users navigate by headings (h1 → h2 → h3) |
| No auto-playing video | Users should control media playback |
| aria-expanded on accordion | Screen readers announce toggle state |
| Error messages linked to inputs | Screen reader users hear error associated with specific field |
| aria-live on dynamic content | Screen reader users are notified of status changes |
