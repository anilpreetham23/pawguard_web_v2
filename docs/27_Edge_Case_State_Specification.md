# PawGuard Complete Edge Case & State Specification

## Every possible state for every page.

---

## PAGE STATES (all pages)

Each page must handle these states:

| State | Behavior | Example |
|-------|----------|---------|
| **Loading** | Skeleton placeholders. Page content not visible until ready. | Skeleton cards, skeleton text lines. |
| **Loaded** | Full content rendered. All images loaded. | Normal page view. |
| **Empty** | No data to display. Informational message + next action. | "No animals match your filters." |
| **Offline** | Persistent banner: "You're offline. Your data will be sent when connection returns." | Banner slides in from top. Forms still visible. |
| **Error** | Toast or inline alert explaining the problem + recovery action. | "We couldn't load animals. Tap to retry." |
| **Not Found** | 404 page with navigation back to homepage. | Standalone 404 page. |
| **Maintenance** | Full-page overlay with estimated return time. | "PawGuard is undergoing scheduled maintenance. We'll be back by 8 AM." |

---

## EMERGENCY PAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading** | Skeleton form. Geolocation permission requested. | Gray blocks where fields will be. |
| **Geolocation granted** | Location field prefilled with coordinates/address. | Field shows "123 Main St, City" |
| **Geolocation denied** | Location field empty. No error. | Empty field, user types manually. |
| **Geolocation unavailable** | Location field empty. Subtle notice: "Location unavailable. Enter manually." | Small text below field. |
| **Form idle** | All 4 fields empty. Default severity: critical. | Normal form state. |
| **Form filling** | User enters data. SessionStorage saves on every change. | Field border changes on focus. |
| **Validation error** | Error shown below relevant field. First error focused. | Crimson border, error text. |
| **Submitting** | Button: "Contacting Nearest Unit..." Spinner visible. | Button loading state. |
| **Submit success** | Success modal: "✓ Rescue Dispatched" with ETA and report ID. | Checkmark, report number, ETA. |
| **Submit failure (network)** | Inline error: "Couldn't reach our servers. Your report has been saved." | Orange warning banner. |
| **Submit failure (server)** | Inline error: "Temporary issue. Please try again or call 1-800-PAW-GUARD." | Crimson alert. |
| **Photo upload idle** | Dashed upload zone: "Tap to add photo (optional)" | Dashed border area. |
| **Photo upload processing** | Spinner overlay on upload zone. | Spinning indicator. |
| **Photo upload success** | Thumbnail preview visible. "Change" link. | Small image with "Change" text. |
| **Photo upload failure** | "Upload failed. Tap to retry." | Dashed border returns with error text. |
| **Offline submit** | Data queued in localStorage. User informed. | "We'll send your report when you're back online." |
| **Online recovery** | Queued report auto-submits. User notified. | "Your report from earlier has been sent." |
| **Draft recovery** | User returns to page. "Resume your report?" prompt. | Banner at top with "Resume" button. |

---

## ADOPTION PAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading** | Skeleton card grid (6 skeleton cards). | Gray card outlines with pulsing. |
| **Loaded (with animals)** | Card grid with animal cards. | Full grid. |
| **Loaded (filtered, results)** | Subset of cards visible. "X animals available" count. | Grid with count. |
| **Empty (no animals at all)** | "No animals are currently available. Check back soon." + email alert CTA. | Centered message. |
| **Empty (filtered, no match)** | "No animals match your filters. Try adjusting or clearing." | Message + "Clear Filters" button. |
| **Filter active** | Filter sidebar shows selected options. "Clear all" visible. | Checked boxes, clear link. |
| **Filter inactive** | Default state. All animals visible. | No checkboxes checked. |
| **Sort changed** | Cards reorder. Brief transition. | Grid animates. |
| **Image load failure** | Fallback SVG: animal silhouette. | Gray placeholder with paw icon. |
| **Card click (has slug)** | Navigate to `/adopt/:slug` detail page. | Page transition. |
| **Card click (no slug)** | Fallback: scroll to adoption process section. | Smooth scroll. |
| **Detail page loading** | Skeleton detail view. | Gray image + text blocks. |
| **Detail page loaded** | Full detail: images, personality, health, requirements, CTA. | Rich content view. |
| **Detail page error** | "Couldn't load animal details. Back to browse." | Alert + back link. |
| **Application submitted** | Success modal with next steps. | Checkmark + "We'll contact you." |

---

## DONATE PAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading** | Skeleton of amount buttons + trust sidebar. | Gray button shapes. |
| **Loaded** | Full page. Default: monthly, $50 selected. | Normal state. |
| **Amount selected (preset)** | Button highlighted navy. Custom amount cleared. | Navy fill on selected amount. |
| **Amount selected (custom)** | Custom input focused. Presets cleared. | Cursor in custom field. |
| **Frequency changed** | Monthly → one-time. Button toggle switches. | "Monthly" or "Once" highlighted. |
| **Form idle** | Name, email fields empty. | Empty fields. |
| **Form validation error** | Inline error below relevant field. | Crimson border, error text. |
| **Submitting** | Button: "Processing Payment..." Spinner. | Loading state. |
| **Submit success** | Success modal: "Your gift of $X will fund Y" + tax receipt info. | Checkmark, impact statement. |
| **Submit failure (payment)** | "Payment didn't go through. Try a different card." | Error alert. |
| **Submit failure (network)** | "Connection issue. Your donation amount is saved." | Orange warning. |
| **Demo mode (current)** | Payment section shows dashed "Demo Mode" box. | Dashed border, demo notice. |

---

## VOLUNTEER PAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading** | Skeleton role cards. | Gray card outlines. |
| **Loaded** | Full page with roles, requirements, application. | Normal state. |
| **Role card hover** | Shadow increase, border shift. | Shadow-md, subtle border. |
| **Application idle** | All fields empty. | Normal form. |
| **Application filling** | User types. Progress indicator optional. | Normal form state. |
| **Validation error** | Inline error. | Crimson border, error text. |
| **Submitting** | Button: "Submitting..." Spinner. | Loading state. |
| **Submit success** | "Welcome to PawGuard. We'll contact you within 5 days." | Success message. |
| **Submit failure** | "Couldn't submit. Tap to retry or email volunteer@pawguard.org." | Error alert. |

---

## CONTACT PAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading** | FAQ skeleton + form skeleton. | Gray blocks. |
| **Loaded** | FAQ accordion collapsed. Form empty. | Normal state. |
| **FAQ open** | Accordion content visible. Chevron rotated. | Content slides down. |
| **FAQ close** | Accordion content hidden. Chevron rotated back. | Content slides up. |
| **Form idle** | All fields empty. | Normal form. |
| **Validation error** | Inline error. | Crimson border, error text. |
| **Submitting** | Button: "Sending..." Spinner. | Loading state. |
| **Submit success** | "Message sent. We respond within 1-2 business days." | Success message. |
| **Submit failure** | "Couldn't send. Tap to retry." | Error alert. |

---

## STORIES PAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading** | Skeleton featured story + skeleton card grid. | Large gray placeholder for featured image. |
| **Loaded** | Featured story + grid of cards. | Full content. |
| **Featured story** | Large image, headline, excerpt, adopter signature. | 2-col layout. |
| **Grid story hover** | Image zoom 1.03, shadow increase. | Card hover state. |
| **Card image failure** | Fallback SVG for story image. | Gray placeholder. |
| **Empty (no stories, future)** | "Stories coming soon. Check back." | Centered message. |

---

## ABOUT PAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading** | Skeleton sections. | Gray blocks throughout. |
| **Loaded** | Full page: hero, story, values, team, transparency, CTA. | Normal state. |
| **Team image hover** | Image zoom 1.03. | Subtle zoom. |
| **Team image failure** | Initials or placeholder avatar. | Gray circle with initials. |
| **Transparency bars** | Static bars showing fund allocation. | Colored bars with labels. |

---

## HOMEPAGE STATES

| State | Behavior | Visual |
|-------|----------|--------|
| **Loading (first visit)** | Skeleton hero + skeleton sections below. | Hero placeholder. |
| **Loaded** | Full page with all sections. | Normal state. |
| **Scroll reveal** | Sections fade in as user scrolls. Single observer. | Fade-up 500ms. |
| **Video loading** | Poster image visible. Controls hidden until hover/focus. | Static poster. |
| **Video playing** | Video plays muted, loop. Controls visible on hover/focus. | Motion playing. |
| **Video failed** | Video hidden. Poster image remains. | Static poster only. |
| **Offline** | Banner at top: "You're offline." | Red/orange banner. |

---

## 404 PAGE

| State | Behavior | Visual |
|-------|----------|--------|
| **Loaded** | "404 — Page not found" + description + "Back to Home" CTA. | Centered, clean layout. |
| **CTA clicked** | Navigate to `/`. | Page transition. |

---

## OFFLINE STATE (Global)

| Property | Value |
|----------|-------|
| **Banner text** | "You're offline. Your data is saved locally and will be sent when your connection returns." |
| **Background** | Dark (foreground color) |
| **Text color** | White |
| **Icon** | Wifi-off (lucide) |
| **Appearance** | Slides down from top (300ms) |
| **Dismissal** | Auto-dismisses when connection returns |
| **Behavior** | All forms remain functional. Data stored in localStorage. |
| **On reconnect** | Queued submissions process automatically. User notified: "Your report has been sent." |

---

## LOADING STATE (Global)

| Page | Loading behavior |
|------|-----------------|
| Homepage | Skeleton hero + section placeholders |
| Emergency | Skeleton form fields |
| Adoption | 6 skeleton cards in grid |
| Donate | Skeleton amount buttons + sidebar |
| Volunteer | 4 skeleton role cards |
| Stories | Skeleton featured story + 6 skeleton cards |
| About | Skeleton sections |
| Contact | Skeleton FAQ + form |

---

## ERROR STATE (Global)

| Error type | UI Pattern | Recovery |
|------------|-----------|----------|
| **Network** | Inline alert at top of affected section | "Tap to retry" |
| **Server (500)** | Alert with apology + timeline | "Try again in a few minutes" |
| **Not found (404)** | Standalone 404 page | "Back to Home" link |
| **Validation** | Fields highlighted with error messages | Fix and resubmit |
| **Permission denied** | Inline notice (not error) | "Enable location in your browser settings" |
| **Payment failure** | Alert with specific error | "Try a different card" |

---

## TIMEOUT STATE

| Context | Behavior |
|---------|----------|
| Form submission | After 15s: "This is taking longer than expected. Your data is saved." |
| Image loading | After 10s: Show fallback placeholder. |
| API call | After 10s: Show error with retry option. |
| Geolocation | After 5s: Show manual input with "Location unavailable" notice. |
