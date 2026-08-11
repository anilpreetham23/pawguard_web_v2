# PawGuard Microinteraction Inventory

## Complete specification of every interactive moment.

Each entry: Trigger → Purpose → Timing → Motion → Feedback → Accessibility

---

## BUTTON: Hover

| Property | Specification |
|----------|---------------|
| **Trigger** | Cursor enters button boundary |
| **Purpose** | Reveal interactivity, preview action |
| **Timing** | 150ms |
| **Motion** | Background darkens 15%, shadow increases from `shadow-sm` to `shadow-md` |
| **Feedback** | Cursor changes to pointer, visual elevation change |
| **Accessibility** | Same feedback on focus (keyboard users) |

---

## BUTTON: Press

| Property | Specification |
|----------|---------------|
| **Trigger** | mousedown / touchstart |
| **Purpose** | Confirm action was registered |
| **Timing** | 100ms |
| **Motion** | Scale 0.98, background darkens further |
| **Feedback** | Tactile sensation of press, visual compression |
| **Accessibility** | N/A (momentary, not visible to screen readers) |

---

## BUTTON: Focus (keyboard)

| Property | Specification |
|----------|---------------|
| **Trigger** | Tab key focuses element |
| **Purpose** | Show keyboard users which element is active |
| **Timing** | 150ms |
| **Motion** | 2px solid navy outline with 2px offset appears |
| **Feedback** | Visible ring ensures keyboard users can navigate |
| **Accessibility** | Required for WCAG 2.4.7 (Focus Visible) |

---

## BUTTON: Loading

| Property | Specification |
|----------|---------------|
| **Trigger** | Form submission or async action initiated |
| **Purpose** | Communicate that action is being processed |
| **Timing** | Indeterminate (until response) |
| **Motion** | Icon transitions to spinner (200ms), text changes |
| **Feedback** | Button becomes non-interactive (disabled), loading text visible |
| **Accessibility** | `aria-busy="true"` on button, `aria-live="polite"` updates text |

---

## BUTTON: Success

| Property | Specification |
|----------|---------------|
| **Trigger** | Async action completes successfully |
| **Purpose** | Celebrate completion, confirm action worked |
| **Timing** | 300ms display |
| **Motion** | Spinner transitions to checkmark icon (300ms), text changes to confirmation |
| **Feedback** | Brief celebration before moving to success state |
| **Accessibility** | `aria-live="assertive"` announces completion |

---

## BUTTON: Error

| Property | Specification |
|----------|---------------|
| **Trigger** | Async action fails |
| **Purpose** | Communicate failure, provide recovery path |
| **Timing** | 200ms |
| **Motion** | Button returns to resting state, error message appears below |
| **Feedback** | "Failed to send. Tap to retry." Action remains possible. |
| **Accessibility** | `role="alert"` on error message |

---

## BUTTON: Disabled

| Property | Specification |
|----------|---------------|
| **Trigger** | Prerequisite not met (missing fields, invalid input) |
| **Purpose** | Communicate that action cannot be taken yet |
| **Timing** | Instant |
| **Motion** | Opacity drops to 0.5, shadow removed |
| **Feedback** | Button visually recedes, cursor changes to not-allowed |
| **Accessibility** | `aria-disabled="true"`, still focusable with explanation |

---

## INPUT: Focus

| Property | Specification |
|----------|---------------|
| **Trigger** | Tab or tap into input field |
| **Purpose** | Show which field is active |
| **Timing** | 200ms |
| **Motion** | Border shifts from `border-border` to navy, 2px ring with `ring-primary/20` |
| **Feedback** | Input boundary becomes more prominent |
| **Accessibility** | Focus visible (WCAG 2.4.7) |

---

## INPUT: Validation Error

| Property | Specification |
|----------|---------------|
| **Trigger** | User blurs field with invalid data (or on submit for URGENCY mode) |
| **Purpose** | Communicate what's wrong and how to fix it |
| **Timing** | 200ms |
| **Motion** | Border shifts to crimson, error message slides down below input |
| **Feedback** | Color change + text instruction |
| **Accessibility** | `aria-describedby` links error to input, `role="alert"` on error |

---

## INPUT: Validation Success

| Property | Specification |
|----------|---------------|
| **Trigger** | User blurs field with valid data |
| **Purpose** | Confirm field is valid (optional — not color-dependent) |
| **Timing** | 200ms |
| **Motion** | Subtle green checkmark appears next to input (if using visual indicator) |
| **Feedback** | Positive reinforcement |
| **Accessibility** | Not color-dependent — always have text or structure indicator |

---

## FORM: Submit (success)

| Property | Specification |
|----------|---------------|
| **Trigger** | Form data submitted successfully |
| **Purpose** | Communicate success, show impact, provide next steps |
| **Timing** | 300ms transition to success state |
| **Motion** | Form content → loading state → success modal (scale-in 200ms) |
| **Feedback** | Checkmark icon, impact-specific message, "what happens next" |
| **Accessibility** | Focus moves to success message, `aria-live` announces content |

---

## FORM: Submit (error)

| Property | Specification |
|----------|---------------|
| **Trigger** | Form submission fails |
| **Purpose** | Communicate failure, provide recovery path |
| **Timing** | 200ms |
| **Motion** | Button returns to resting state, error alert appears at top of form |
| **Feedback** | "We couldn't submit your report. Please check your connection and try again." |
| **Accessibility** | `role="alert"` on error, focus moves to first error |

---

## CARD: Hover

| Property | Specification |
|----------|---------------|
| **Trigger** | Cursor enters card boundary |
| **Purpose** | Reveal interactivity, invite click |
| **Timing** | 200ms (shadow), 400ms (image zoom) |
| **Motion** | Shadow `sm→md`, image `scale(1→1.03)` |
| **Feedback** | Card appears to lift, image subtly enlarges |
| **Accessibility** | Same states available on focus for keyboard users |

---

## CARD: Focus

| Property | Specification |
|----------|---------------|
| **Trigger** | Tab key focuses card |
| **Purpose** | Show keyboard users which card is active |
| **Timing** | 150ms |
| **Motion** | 2px navy outline appears on card border |
| **Feedback** | Card is visually identified as interactive |
| **Accessibility** | Required for WCAG 2.4.7 |

---

## NAVIGATION: Mobile Menu Open

| Property | Specification |
|----------|---------------|
| **Trigger** | Tap hamburger icon |
| **Purpose** | Show navigation options on mobile |
| **Timing** | 200ms entrance, 150ms exit |
| **Motion** | Menu panel slides down (translateY), overlay fades in |
| **Feedback** | Hamburger icon transitions to X icon |
| **Accessibility** | Focus moves to first menu item, `aria-expanded` on hamburger |

---

## NAVIGATION: Mobile Menu Close

| Property | Specification |
|----------|---------------|
| **Trigger** | Tap X, tap link, tap outside, press Escape |
| **Purpose** | Dismiss navigation |
| **Timing** | 150ms |
| **Motion** | Menu slides up (translateY), overlay fades out |
| **Feedback** | X icon transitions back to hamburger, focus returns to hamburger |
| **Accessibility** | Focus returns to trigger element |

---

## NAVIGATION: Active Link

| Property | Specification |
|----------|---------------|
| **Trigger** | User navigates to a page |
| **Purpose** | Show current location in site hierarchy |
| **Timing** | 150ms |
| **Motion** | Underline indicator slides in or fades in |
| **Feedback** | Current page link is navy, underline visible |
| **Accessibility** | Current page announced by screen readers (`aria-current="page"`) |

---

## SCROLL TO TOP: Appear

| Property | Specification |
|----------|---------------|
| **Trigger** | User scrolls past 600px |
| **Purpose** | Provide quick return to top |
| **Timing** | 300ms |
| **Motion** | Spring entrance from bottom, opacity 0→1, translateY 16px→0 |
| **Feedback** | Button becomes visible and interactive |
| **Accessibility** | Focusable button with aria-label "Scroll to top" |

---

## SCROLL TO TOP: Click

| Property | Specification |
|----------|---------------|
| **Trigger** | User clicks the button |
| **Purpose** | Return to top of page |
| **Timing** | 400ms smooth scroll |
| **Motion** | Window scrolls to top with `behavior: smooth` |
| **Feedback** | User arrives at top of page, focus moves to skip-to-main target |
| **Accessibility** | Focus management critical — user should not be left at bottom after scroll |

---

## SUCCESS: Scale In

| Property | Specification |
|----------|---------------|
| **Trigger** | Success state displays (form submission, donation, application) |
| **Purpose** | Celebrate completion |
| **Timing** | 200ms |
| **Motion** | Content scales 0.97→1, opacity 0→1 |
| **Feedback** | Content appears to zoom into view |
| **Accessibility** | `aria-live="assertive"` announces content |

---

## ACCORDION: Open

| Property | Specification |
|----------|---------------|
| **Trigger** | User clicks accordion header |
| **Purpose** | Reveal hidden content |
| **Timing** | 200ms ease-out |
| **Motion** | Content height animates from 0 to auto, chevron rotates 180° |
| **Feedback** | Content slides down smoothly |
| **Accessibility** | `aria-expanded="true"`, content has `role="region"` |

---

## ACCORDION: Close

| Property | Specification |
|----------|---------------|
| **Trigger** | User clicks open accordion header |
| **Purpose** | Hide content |
| **Timing** | 150ms ease-out |
| **Motion** | Content height animates from auto to 0, chevron rotates back |
| **Feedback** | Content slides up, section collapses |
| **Accessibility** | `aria-expanded="false"` |

---

## OFFLINE: Banner Appear

| Property | Specification |
|----------|---------------|
| **Trigger** | Network connection lost |
| **Purpose** | Communicate that device is offline, reassure that data is safe |
| **Timing** | 300ms |
| **Motion** | Banner slides down from top |
| **Feedback** | "You're offline. Your report will be sent when connection returns." |
| **Accessibility** | `role="alert"`, `aria-live="assertive"` |

---

## OFFLINE: Banner Dismiss

| Property | Specification |
|----------|---------------|
| **Trigger** | Network connection restored |
| **Purpose** | Confirm that offline data was submitted |
| **Timing** | 300ms |
| **Motion** | Banner slides up, brief success flash |
| **Feedback** | "Connection restored. Your report has been sent." |
| **Accessibility** | `role="status"`, `aria-live="polite"` |

---

## IMAGE: Load

| Property | Specification |
|----------|---------------|
| **Trigger** | Image begins loading (slow connection) |
| **Purpose** | Prevent layout shift, indicate content is coming |
| **Timing** | Until image loads |
| **Motion** | Skeleton placeholder (subtle pulse animation) → image fades in |
| **Feedback** | User sees content placeholder instead of blank space |
| **Accessibility** | Placeholder has `aria-hidden="true"` |

---

## IMAGE: Error

| Property | Specification |
|----------|---------------|
| **Trigger** | Image fails to load |
| **Purpose** | Prevent broken image icon, provide fallback |
| **Timing** | Instant |
| **Motion** | Fallback SVG or colored placeholder replaces image |
| **Feedback** | Visual placeholder with animal icon or text |
| **Accessibility** | Alt text still applies (describes what image should show) |
