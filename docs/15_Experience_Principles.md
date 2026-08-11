# PawGuard Experience Principles

## Immutable rules that govern every design decision.

Each principle includes: Purpose | Psychological Reasoning | Examples | Anti-patterns | Implementation Implications

---

## Principle 1: Reduce Uncertainty

**Purpose:** Every screen must answer: "What just happened? What do I do next? What will happen?"

**Psychological reasoning:** Uncertainty triggers the amygdala's threat response. When users don't understand system state, cortisol rises and cognitive function drops. In emergency contexts, this can cause freezing — the user stops acting entirely.

**Examples:**
- Form submission shows immediate loading state with descriptive text ("Contacting nearest rescue unit...")
- Report confirmation displays: "Report received. A team has been dispatched. ETA: 12 minutes."
- Navigation between pages has a brief transition that signals "something is loading"

**Anti-patterns:**
- Silent form submission with no feedback
- Navigation that feels instant but leaves the user disoriented
- Buttons that appear to do nothing when clicked

**Implementation implications:**
- Every async operation must have at least 3 states: loading, success, error
- Page transitions must include a brief loading indicator (200ms minimum)
- Form submissions must disable the button and show progress

---

## Principle 2: Increase Confidence

**Purpose:** Users should feel that PawGuard is competent, reliable, and in control.

**Psychological reasoning:** Confidence is the opposite of anxiety. When users trust that the system will work, they complete actions. When they doubt, they abandon. Confidence is built through consistency, predictability, and visible competence.

**Examples:**
- Emergency page shows a numbered "What happens next" sidebar before the user submits
- Donation page shows fund allocation breakdown and third-party verification badges
- Every link and button behaves predictably — same color, same hover, same interaction

**Anti-patterns:**
- Unusual interactions that surprise users
- Inconsistent button styles that make the user question "is this clickable?"
- Hidden costs or unexpected steps in forms

**Implementation implications:**
- All interactive elements must have consistent hover, focus, and active states
- Multi-step processes must show progress indicators
- Trust signals must be visible before the user commits (not after)

---

## Principle 3: Never Interrupt Emergency Flow

**Purpose:** When a user is reporting an emergency, nothing may slow them down.

**Psychological reasoning:** In high-stress situations, cognitive bandwidth is severely limited. The brain prioritizes survival over detail. Any unnecessary question, field, or step can cause abandonment. Emergency reporters should not be asked to make decisions about non-essential information.

**Examples:**
- Emergency form has exactly 4 fields (location, animal type, severity, contact) with more available after submission
- Geolocation is requested on page load and prefilled
- "Non-critical" severity requires an explicit opt-out (default is "critical")

**Anti-patterns:**
- Asking for non-essential information during emergency ("How did you hear about us?")
- Auto-playing video or animations that distract from the form
- Confirmation dialogs that add steps ("Are you sure you want to submit?")

**Implementation implications:**
- Emergency page must never have more than 4 visible form fields
- Geolocation API must fire on mount, not on field focus
- Submit must work with partial data (optimistic submission)
- No confirmation dialog — submission is immediate

---

## Principle 4: Always Communicate System Status

**Purpose:** Users must never wonder "did it work?" or "is something happening?"

**Psychological reasoning:** The most common cause of form abandonment is uncertainty about whether the submission succeeded. Users refresh, resubmit, or leave. System status visibility (Nielsen's first heuristic) is the single highest-impact UX improvement.

**Examples:**
- Button text changes from "Send Rescue Request" to "Contacting Nearest Unit..." to "✓ Rescue Team Dispatched"
- Page transitions show a top-of-page loading bar
- Network loss shows an inline banner: "You're offline. Your report will be sent when connection returns."

**Anti-patterns:**
- Button that stays in loading state for more than 5 seconds with no additional feedback
- Success toast that disappears before the user can read it
- Error states that say "something went wrong" without guidance

**Implementation implications:**
- Loading states must have associated text, not just a spinner
- Success states must persist until the user dismisses them or takes the next action
- Error states must provide a recovery path, not just an apology

---

## Principle 5: Preserve User Progress

**Purpose:** Users should never lose their work due to navigation, timeout, or error.

**Psychological reasoning:** Loss aversion is 2x more powerful than gain satisfaction. Losing form data feels like a violation of trust. Users who lose progress once are unlikely to restart.

**Examples:**
- Emergency form data is saved to sessionStorage on every field change
- Returning to the adoption page preserves filter state
- Donation amount selection persists through page navigation

**Anti-patterns:**
- Form data lost on browser back button
- Session timeout that clears form fields without warning
- Page refresh that resets all progress

**Implementation implications:**
- sessionStorage sync on every form field change
- adoption page filter state in URL search params (shareable, back-button safe)
- Donation page amount in localStorage

---

## Principle 6: Build Trust Before Asking for Commitment

**Purpose:** Donors, adopters, and volunteers should see evidence before being asked to act.

**Psychological reasoning:** The persuasion sequence must follow Cialdini's principles: show social proof and authority before asking for commitment. Users need to believe the organization is legitimate before they will invest time or money.

**Examples:**
- Donate page shows fund allocation chart above the payment form
- Volunteer page shows current volunteer count and testimonials above the application
- Adoption page shows the adoption process before the user applies

**Anti-patterns:**
- Donation form at the top of the page (before trust signals)
- Volunteer application as the first thing users see (before community evidence)
- Adoption application required before seeing animal details

**Implementation implications:**
- Trust signals must be visible above the fold on commitment pages
- The CTA must be below the trust signals, not above them
- Every page with a financial or commitment ask must have a "Why Trust Us" section

---

## Principle 7: Reward Action

**Purpose:** Every completed action should feel meaningful.

**Psychological reasoning:** Dopamine is released when goals are achieved. Celebrating completion (even briefly) creates positive reinforcement and increases the likelihood of future action. Without celebration, actions feel transactional.

**Examples:**
- Donation success shows a specific impact statement: "Your $50 will fund a complete veterinary assessment"
- Emergency submission shows: "Your report has reached our rescue team. A unit is being dispatched."
- Volunteer application shows: "Welcome to PawGuard. We'll contact you within 5 business days."

**Anti-patterns:**
- Generic "Thank you" with no specific impact
- Success state that disappears before the user can read it
- No distinction between a $5 donation and a $500 donation in the success message

**Implementation implications:**
- Success states must include the user's specific action (amount donated, animal selected, role chosen)
- Success states must persist until the user takes the next action
- Success states should include what happens next

---

## Principle 8: Design for the Worst Conditions First

**Purpose:** PawGuard must work when users need it most — on slow networks, old devices, in bright sunlight, under stress.

**Psychological reasoning:** The peak-end rule means users judge an experience by its most intense moment and its end. The most intense moment for PawGuard users is the emergency report. If that moment fails (slow load, broken form, confusing interface), the entire product is judged as unreliable.

**Examples:**
- Hero media loads with a lightweight poster image before the video
- Form fields use native HTML5 inputs (not custom) for maximum compatibility
- All images have explicit width/height to prevent layout shift

**Anti-patterns:**
- Heavy JavaScript that blocks rendering
- Custom form controls that break on old browsers
- Large images without dimensions (causing cumulative layout shift)

**Implementation implications:**
- First load must be usable on 3G within 5 seconds
- All forms must work without JavaScript (graceful degradation)
- No custom controls that replace native browser functionality
- Critical CSS inlined, non-critical deferred
