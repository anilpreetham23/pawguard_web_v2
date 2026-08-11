# PawGuard Component Philosophy

## Complete design specification for every component.

NOT implementation. Specification that eliminates engineering ambiguity.

For each component: Purpose | Communication Role | Psychological Role | Interaction Philosophy | Accessibility | Motion | Content Rules | Responsive | Trust Contribution | Originality Requirements | Failure Cases

---

## BUTTON

**Purpose:** Initiate actions, navigate to pages, confirm decisions.

**Communication role:** Signals what will happen when activated. The most important interactive element on any screen.

**Psychological role:** Reduces anxiety by making the next action obvious. A clear CTA answers "What should I do now?" without the user having to decide.

**Interaction philosophy:**
- 5 states: resting, hover, pressed, focus, loading, disabled, success
- Primary actions use solid navy fill (most important action per page)
- Secondary actions use outline or ghost styles
- Emergency actions use crimson fill
- Loading state uses animated spinner + descriptive text (not just spinner)
- Success state shows brief checkmark animation

**Accessibility:**
- Minimum touch target: 44×44px (48px preferred for emergency CTAs)
- Focus ring: 2px navy outline with 2px offset
- disabled state: opacity 0.5, cursor not-allowed
- aria-label required when icon-only

**Motion:**
- Resting → hover: bg darkens 15%, shadow increases (150ms)
- Hover → pressed: scale 0.98, bg darkens further (100ms)
- Pressed → resting: scale returns (100ms)
- Resting → loading: icon transitions to spinner, text changes (200ms)
- Loading → success: spinner to checkmark (300ms)

**Content rules:**
- Always action-oriented: "Send Rescue Request," not "Submit"
- Always specific: "Meet Bella," not "Learn More"
- Loading text describes what's happening: "Contacting Nearest Unit..."
- Success text confirms completion: "✓ Rescue Team Dispatched"

**Responsive behavior:**
- Desktop: full-width or inline (based on context)
- Mobile: minimum 44px height, full-width preferred for primary CTAs
- Text size: `text-xs` (12px) uppercase on desktop, `text-sm` (14px) on mobile if needed

**Trust contribution:** Predictable button behavior builds trust. Users should never wonder "will this work?"

**Originality requirements:** 
- No standard Bootstrap "btn btn-primary" proportions. PawGuard buttons are taller (`py-4` = 16px vertical padding) with wider corner radius (10px).
- Loading state must include descriptive text, not just a spinner.

**Failure cases:**
- Button that appears clickable but does nothing (missing handler)
- Button that stays in loading state indefinitely (no error timeout)
- Button text that disappears during loading (keeps layout stable)

---

## INPUT

**Purpose:** Capture user-provided information.

**Communication role:** Signals what information is needed, whether it's valid, and how to fix it if not.

**Psychological role:** Reduces anxiety about getting information wrong. Clear labels, visible validation, and helpful error messages reassure users.

**Interaction philosophy:**
- 6 states: resting, focus, filled, valid, invalid, disabled
- Labels always visible (not placeholder-only)
- Validation timing depends on mode (URGENCY: on submit, others: on blur)
- Error messages specific and actionable

**Accessibility:**
- Visible `<label>` associated via `htmlFor`
- Error messages use `aria-describedby` and `role="alert"`
- Placeholder text is supplementary, not a replacement for labels
- Autocomplete attributes on name, email, tel, address fields

**Motion:**
- Focus: border shifts to navy, subtle ring glow (200ms)
- Invalid: border shifts to crimson, error message slides down (200ms)
- Valid: subtle green checkmark (optional, not color-dependent indicator)

**Content rules:**
- Label: "Your Name," not "Full Name" or "Name"
- Placeholder: "e.g. Jane Smith" or specific example
- Error: "We need the animal's location to send help" not "Location required"
- Helper text: "Attach a photo if safe to do so" — guidance, not instruction

**Responsive behavior:**
- Full-width at all sizes
- Height: `py-3.5` (14px vertical) at all sizes
- Multi-column input groups: 2-column on desktop, 1-column below 768px

**Trust contribution:** Visible labels and clear validation make users feel the organization pays attention to detail.

**Originality requirements:**
- PawGuard inputs have 12px corner radius (rounder than standard)
- Focus ring uses `ring-primary/20` (subtle, not harsh)
- Error states include both border color change AND text guidance (never color-only)

**Failure cases:**
- Input that accepts invalid data without feedback
- Input that shows error before user has had a chance to type (too aggressive)
- Error message that says what's wrong but not how to fix it

---

## CARD

**Purpose:** Group related content into a scannable, interactive container.

**Communication role:** Signals that content within is a unified item — an animal, a role, a story, a metric.

**Psychological role:** Cards reduce cognitive load by chunking information into digestible units. Gestalt principle of proximity: items in a card are perceived as related.

**Interaction philosophy:**
- 3 variants: default (display-only), interactive (hover/focus), featured (hero-style, less interactive)
- Interactive cards have hover state with shadow increase and optional image zoom
- Cards link to detail pages or trigger actions

**Accessibility:**
- Interactive cards are `<a>` or `<button>` elements (not `<div>` with onClick)
- Focus state visible on card border
- All text within card is accessible

**Motion:**
- Hover: shadow `sm→md` (200ms), image `scale 1→1.03` (400ms)
- Focus: navy ring appears (150ms)
- Click: subtle scale 0.98 (100ms)

**Content rules:**
- Card title: `font-bold text-lg` or `text-xl` (inter varies by context)
- Card description: `text-muted-foreground text-sm`
- Card metadata: `text-xs tracking-widest uppercase` with `text-muted-foreground`
- Badges use `text-[10px]` with uppercase tracking

**Responsive behavior:**
- 4-column grid on desktop → 2-column on tablet → 1-column on mobile
- Card height: fluid (content determines height, no fixed height)
- Image height: 200px (desktop), 180px (mobile)

**Trust contribution:** Cards with health badges (Vaccinated, Spayed, Microchipped) provide at-a-glance verification.

**Originality requirements:**
- Cards use 16px corner radius (distinct from Bootstrap's 8px or shadcn's 12px)
- Interactive cards have a subtle border color shift on hover (not just shadow)
- Featured cards span 2 columns in grid (asymmetric layout)

**Failure cases:**
- Empty card with no content
- Card with broken image (must show fallback)
- Card that links to a broken page

---

## SECTION

**Purpose:** Group related content blocks into a coherent page region.

**Communication role:** Signals a change in topic or emphasis. Section transitions tell the user "we're moving to a new part of the story."

**Psychological role:** Sections chunk the page into digestible parts. Each section answers one user question.

**Interaction philosophy:**
- Passive container (no interactive states)
- Alternating backgrounds provide visual rhythm
- Every section has a clear purpose: one section = one user question answered

**Accessibility:**
- Semantic HTML: `<section>` with heading
- Skip-to-main navigates past all sections

**Motion:**
- Entrance: fade-in + translate-up (500ms, scroll-triggered)
- Between sections: border separator + background change

**Content rules:**
- Section heading uses `SectionHeading` component
- Section description (if present) answers "why should I care?"

**Responsive behavior:**
- Padding: `py-20 lg:py-28` (standard), `py-16 lg:py-20` (compact)
- Content within max-width container: `max-w-[1280px] mx-auto px-6 lg:px-8`
- Background bleeds full-width

**Trust contribution:** Consistent section rhythm signals professionalism.

**Originality requirements:**
- No two consecutive sections share the same layout
- Every section has a unique purpose (no repeated content across sections)

**Failure cases:**
- Section with no clear purpose
- Section that duplicates content from another section on the same page
- Section with no heading (user doesn't know what they're reading)

---

## HERO

**Purpose:** Communicate page purpose and primary CTA within 3 seconds.

**Communication role:** The most important section on any page. Must answer: "What is this page for?" and "What should I do?"

**Psychological role:** First impression determines whether the user stays or leaves. The hero must reduce uncertainty immediately.

**Interaction philosophy:**
- Two-column split: text left, image right
- Text column has: eyebrow, heading, description, CTAs (1-2)
- Image column has: featured photograph with overlay stat (optional)
- Emergency CTA always visible when on non-emergency pages

**Accessibility:**
- Heading is `h1` on all pages
- Image has descriptive alt text
- All CTAs are keyboard navigable

**Motion:**
- Content fades in (400ms entrance)
- Image fades in separately (500ms, slight delay)

**Content rules:**
- Eyebrow: page category label
- Heading: unique per page, specific to PawGuard
- Description: one paragraph answering "why should I care"
- Primary CTA: most important action
- Secondary CTA: alternative action (or skip)

**Responsive behavior:**
- Desktop: 2-column split (text left, image right)
- Tablet: same but narrower
- Mobile: stacked (text above image), image shorter (240px)
- CTAs: side-by-side on desktop, stacked on mobile

**Trust contribution:** Professional hero communicates organizational competence.

**Originality requirements:**
- No two pages share the same hero layout
- Homepage hero includes EmergencyActionPanel (unique to PawGuard)
- Hero image uses 24px corner radius (distinctive)

**Failure cases:**
- Hero that doesn't communicate page purpose (user doesn't know where they are)
- Hero with too many CTAs (choice overload)
- Hero image that takes too long to load (optimize, use poster)

---

## NAVIGATION

**Purpose:** Enable users to move between pages and find what they need.

**Communication role:** Signals the scope of the product — "here's everything you can do."

**Psychological role:** Predictable navigation reduces anxiety. Users should never feel lost.

**Interaction philosophy:**
- Fixed top navbar on all pages
- Current page indicated by underline indicator
- Donate and Emergency CTAs always visible (desktop)
- Mobile: hamburger menu with entrance/exit animations

**Accessibility:**
- Skip-to-main as first focusable element
- All links keyboard navigable
- Mobile menu closes on Escape and outside click
- aria-label on hamburger button: "Open menu" / "Close menu"

**Motion:**
- Desktop: link hover color shift (150ms), active underline
- Mobile: menu slides down (200ms entrance, 150ms exit)
- CTA buttons: same as Button component

**Content rules:**
- Link labels consistent across all pages
- Donate = "Donate" (primary button), Emergency = "Emergency" (crimson outline)

**Responsive behavior:**
- Desktop: full nav with CTAs (72px height)
- Mobile: hamburger menu, CTAs inside menu + bottom emergency bar
- 768px breakpoint: expanded nav

**Trust contribution:** Professional, predictable navbar signals organizational competence.

**Originality requirements:**
- Not a standard Bootstrap navbar (taller, wider padding, CTAs integrated)
- Active indicator is an underline, not a background color

**Failure cases:**
- Current page not indicated
- Mobile menu that doesn't close on navigation
- CTAs that overlap on small screens

---

## FOOTER

**Purpose:** Provide secondary navigation, legal information, and newsletter signup.

**Communication role:** Signals "you've reached the end of the page" and provides resources.

**Psychological role:** The footer should feel like a solid foundation. Dark background communicates stability.

**Interaction philosophy:**
- Dark background (`bg-foreground`/#1a1b21), light text
- 4-column grid: brand + services + company + newsletter
- Newsletter signup with email validation
- Social links with hover states

**Accessibility:**
- All links keyboard navigable
- Newsletter form has accessible label
- Social links have aria-label

**Motion:**
- No entrance animation (always visible)
- Newsletter submit: same as Button component

**Content rules:**
- Brand column: logo + tagline + social links
- Services column: links to main service pages
- Company column: about, stories, contact, privacy, terms
- Newsletter: "Rescue news, adoption updates, and volunteer opportunities"

**Responsive behavior:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column, stacked

**Trust contribution:** Professional footer with privacy/terms links signals legal compliance.

**Originality requirements:**
- Dark footer on light backgrounds is distinctive (most NGOs use light footers)
- "Built with compassion for every animal" tagline

**Failure cases:**
- Privacy/Terms linking to wrong pages (currently linking to /contact — must fix)
- Newsletter submission without feedback

---

## TIMELINE (RescueTimeline)

**Purpose:** Communicate a sequential process.

**Communication role:** Shows the user "here's what happens, step by step."

**Psychological role:** Sequential steps reduce uncertainty about what comes next. Numbered items feel manageable.

**Interaction philosophy:**
- 2 variants: horizontal (grid, homepage) and vertical (list, content pages)
- Numbered steps with titles and descriptions
- Connector between steps (horizontal: line, vertical: line)

**Accessibility:**
- Ordered list `<ol>` with `<li>` items
- Step numbers visible to all users

**Motion:**
- No individual step animation (entire section fades in)

**Content rules:**
- Step number: 2-digit format ("01", "02") using monospace
- Step title: bold, descriptive
- Step description: 1-2 sentences, specific

**Responsive behavior:**
- Horizontal: 4-column on desktop, 2-column on tablet, 1-column on mobile
- Vertical: single column at all sizes

**Trust contribution:** Clear process communicates transparency.

---

## METRIC (ImpactMetric)

**Purpose:** Display a key statistic with animation.

**Communication role:** "Here's proof that we're effective."

**Psychological role:** Animated counters draw attention and communicate growth. Seeing numbers increase in real time feels more engaging than static text.

**Interaction philosophy:**
- Counter starts at 0 and animates to target on scroll into view
- Numbers are specific (not rounded approximations)
- Uses IntersectionObserver with threshold 0.3

**Accessibility:**
- Final value is static (animation is decorative enhancement)
- `aria-hidden` on animation, value in visible text

**Motion:**
- Counter increments over 800ms with 25ms intervals
- Font: JetBrains Mono for data precision

**Content rules:**
- Value: "4,200+" format (number + suffix)
- Label: uppercase, e.g., "ANIMALS RESCUED"

**Responsive behavior:**
- Sizing: `text-3xl lg:text-4xl` heading, `text-xs` label

**Trust contribution:** Specific, animated metrics communicate transparency and progress.

---

## STORY (StoryCard)

**Purpose:** Share rescue and adoption stories.

**Communication role:** Emotional connection. Stories make abstract statistics feel real.

**Psychological role:** Narrative transportation — users imagine themselves in the story. Specific details (names, dates, locations) increase believability.

**Interaction philosophy:**
- 2 variants: featured (hero layout) and standard (card grid)
- Featured: 2-column image + text with adopter signature
- Standard: image-top card with type, headline, excerpt, adopter

**Accessibility:**
- Images have alt text describing the story
- All text is readable at the displayed size

**Motion:**
- Featured: none (anchors section)
- Standard: hover zoom on image (400ms)

**Content rules:**
- Animal name always included
- Specific details: date, location, adopter name
- Excerpt: 1-2 sentences covering the emotional arc

**Responsive behavior:**
- Featured: 2-column on desktop, stacked on mobile
- Standard: 3-column grid, 2-column tablet, 1-column mobile

**Trust contribution:** Real names and specific details build credibility.

---

## ACCORDION

**Purpose:** Show/hide content on demand.

**Communication role:** "Here are common questions. Tap to see answers."

**Psychological role:** Progressive disclosure — users see only what they need. Reduces cognitive load on long FAQ sections.

**Interaction philosophy:**
- Single open at a time (can be set to multiple)
- Trigger button with chevron icon that rotates on open
- Content slides down/up with animation

**Accessibility:**
- `aria-expanded` on trigger button
- `aria-controls` linking trigger to content
- Content region uses appropriate ARIA role

**Motion:**
- Open: content slides down (200ms ease-out)
- Close: content slides up (150ms ease-out)
- Chevron rotates 180° on state change

**Content rules:**
- Question: direct, conversational
- Answer: specific, informative, 1-3 sentences

**Trust contribution:** FAQ answers common concerns proactively.

---

## FORM

**Purpose:** Capture structured user data.

**Communication role:** "We need this information to help you. Here's what we need and why."

**Psychological role:** Forms are the highest-anxiety element. Every field asks the user for something. Reducing the number of fields and providing clear guidance reduces anxiety.

**Interaction philosophy:**
- Progressive layout: fields stack vertically on mobile, can be multi-column on desktop
- Labels above fields (not placeholder labels)
- Validation timing varies by mode
- Submit button prominent at bottom

**Accessibility:**
- All fields have labels with htmlFor
- Error messages linked via aria-describedby
- Required fields indicated visually and programmatically

**Motion:**
- Field focus: border highlight (200ms)
- Error: border shift + message slide (200ms)
- Submit: Button loading → success (200ms + 300ms)

**Content rules:**
- Labels: specific to the information needed
- Placeholders: examples or guidance, not labels
- Submit button: action-oriented text
- Success: specific to what was submitted

**Responsive behavior:**
- Single column on mobile, multi-column only for related fields (name split) on desktop
- Inputs full-width at all sizes

**Trust contribution:** Clear forms with helpful validation build trust.

---

## MODAL (Success State)

**Purpose:** Confirm an action was completed successfully.

**Communication role:** "It worked. Here's what happened."

**Psychological role:** Celebration of completion releases dopamine. Specific impact statements make the action feel meaningful.

**Interaction philosophy:**
- Appears after successful form submission
- Contains: icon (checkmark), heading, impact-specific message, action buttons
- Dismissable and persistent (doesn't auto-dismiss)

**Accessibility:**
- Focus moves to modal on appearance
- `aria-live` announces content
- Escape key closes (if dismissable)

**Motion:**
- Entrance: scale-in (200ms ease-out)
- Icon: subtle animation (optional)

**Content rules:**
- Heading: "Report Submitted" / "Thank You" / "Application Received"
- Message: specific to the action taken and what happens next
- CTA: next logical action

**Trust contribution:** Specific, personal success messages build confidence.
