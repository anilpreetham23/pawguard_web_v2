# PawGuard Complete User Flows — All States Included

## Every flow mapped from entry to exit, including edge cases.

---

## FLOW 1: EMERGENCY RESCUE

```
User witnesses animal in danger
        │
        ▼
┌─────────────────────────────────────┐
│  LANDING: Any page                  │
│  → User sees EmergencyActionPanel   │
│  → CTA: crimson, pulse animation    │
│  → Hotline: 1-800-PAW-GUARD         │
└─────────────────────────────────────┘
        │
        ├── User calls hotline ──────────────────────────────┐
        │   (direct to operator, no web flow needed)        │
        │                                                    │
        └── User taps "Emergency" ───────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  EMERGENCY PAGE — LOADING           │
        │  → Skeleton form                    │
        │  → Geolocation permission requested │
        │  → Hotline banner visible           │
        └─────────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  EMERGENCY PAGE — LOADED            │
        │  → Location prefilled (if GPS ok)   │
        │  → Severity default: critical       │
        │  → "What happens next" sidebar      │
        │  → 4 fields visible                │
        │  → "Send Rescue Request" button     │
        └─────────────────────────────────────┘
                        │
                        ├── GPS denied ──────────────────────────────┐
                        │   → Location field empty                  │
                        │   → User types manually                   │
                        │   ← No error, no pressure                  │
                        │                                            │
                        └── User fills form ────────────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────────────┐
                        │  VALIDATION                         │
                        │  → On submit only (URGENCY mode)     │
                        │  → All errors shown at once          │
                        │  → First error focused               │
                        └─────────────────────────────────────┘
                                        │
                            ┌───────────┴───────────┐
                            │                       │
                            ▼                       ▼
                    ┌───────────────┐       ┌───────────────┐
                    │ HAS ERRORS    │       │ VALID PASSES  │
                    │ → Fix fields  │       │ → Submit      │
                    │ → Retry       │       │               │
                    └───────────────┘       └───────┬───────┘
                            │                       │
                            └─────── ← ────────────┘
                                                    │
                                                    ▼
                                    ┌─────────────────────────────┐
                                    │  SUBMITTING                 │
                                    │  → Button: "Contacting      │
                                    │    Nearest Unit..."         │
                                    │  → Spinner                  │
                                    │  → Button disabled          │
                                    └─────────────────────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    │                               │
                                    ▼                               ▼
                    ┌─────────────────────────┐     ┌─────────────────────────────┐
                    │  SUCCESS                │     │  NETWORK FAILURE            │
                    │  → "✓ Rescue Dispatched"│     │  → "Offline. Report saved." │
                    │  → Report ID: RPT-...   │     │  → Data queued in storage   │
                    │  → ETA: 12 minutes      │     │  → Auto-retry on reconnect  │
                    │  → What happens next    │     │                             │
                    │  → Hotline always vis.  │     │  ┌── ONLINE RESTORED ────┐  │
                    │  → "Submit another" CTA │     │  │ → Auto-submit queue  │  │
                    └─────────────────────────┘     │ → Notify user         │  │
                                                    │ → Show success state   │  │
                                                    └───────────────────────┘  │
                                                    └─────────────────────────────┘
```

**Dead-end states eliminated:**
- GPS denied: no error, just empty field
- Offline: data saved, auto-retry
- Server error: report queued, user informed
- Timeout: "Your report is saved. We'll keep trying."

---

## FLOW 2: ADOPTION

```
User wants to adopt a pet
        │
        ▼
┌─────────────────────────────────────┐
│  ADOPTION PAGE — LOADING           │
│  → 6 skeleton cards                │
│  → Filter sidebar skeleton         │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  ADOPTION PAGE — LOADED            │
│  → Card grid with animals          │
│  → Filter sidebar                  │
│  → Sort dropdown                   │
│  → "X animals available" count     │
│  → Adoption process section below  │
└─────────────────────────────────────┘
        │
        ├── User applies filters ───────────────────────┐
        │   → Species, age, size checkboxes             │
        │   → Grid updates live                        │
        │   → URL params update (shareable, back-safe)  │
        │   → "Clear all" appears if filters active     │
        │                                               │
        │   ┌── NO RESULTS ──────────────────────┐      │
        │   │ → "No animals match your filters"  │      │
        │   │ → "Try adjusting or clearing"      │      │
        │   │ → "Clear Filters" button           │      │
        │   └────────────────────────────────────┘      │
        │                                               │
        └── User browses cards ────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  CARD INTERACTION                   │
        │  → Hover: image zoom, shadow rise    │
        │  → Focus: navy ring                  │
        │  → Click: navigate to /adopt/:slug   │
        └─────────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  DETAIL PAGE — LOADING              │
        │  → Skeleton image + text            │
        └─────────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  DETAIL PAGE — LOADED               │
        │  → Photo gallery                    │
        │  → Name, breed, age, size, gender   │
        │  → Personality traits               │
        │  → Health badges                    │
        │  → Care requirements                │
        │  → Adoption process preview         │
        │  → "Meet Bella" CTA                 │
        └─────────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  APPLICATION FORM                   │
        │  → Name, email, phone, address      │
        │  → Household info                   │
        │  → Experience                       │
        │  → Reason                           │
        │  → "Submit Application"             │
        └─────────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  SUBMIT → SUCCESS                   │
        │  → "Application Received"           │
        │  → "We'll contact you within        │
        │    2 business days"                 │
        │  → Application ID                   │
        │  → Next steps listed                │
        └─────────────────────────────────────┘
```

**Dead-end states eliminated:**
- Card click without slug → fallback to process section (until detail pages exist)
- Empty results → clear filter suggestion with count of available unfiltered animals
- Image load failure → fallback silhouette
- Form submission failure → retry with saved data

---

## FLOW 3: DONATION

```
User wants to donate
        │
        ▼
┌─────────────────────────────────────┐
│  DONATE PAGE — LOADING              │
│  → Skeleton amount buttons          │
│  → Skeleton trust sidebar           │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  DONATE PAGE — LOADED               │
│  → Hero with 78% stat + trust       │
│  → Frequency toggle (monthly/once)  │
│  → 5 preset amounts + custom        │
│  → Impact breakdown sidebar         │
│  → Trust badges                     │
│  → Payment fields below             │
└─────────────────────────────────────┘
        │
        ├── User selects frequency ────────────────┐
        │   → Monthly (default) or One-time        │
        │   → Toggle switches, no page reload      │
        │                                          │
        ├── User selects amount ───────────────────┘
        │   → Preset: highlighted navy
        │   → Custom: clears presets, shows input
        │   → Impact sidebar updates
        │
        └── User fills payment info ───────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  SUBMIT → PROCESSING                │
        │  → "Processing Payment..."          │
        │  → Spinner                          │
        │  → Button disabled                  │
        └─────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ┌───────────────┐       ┌───────────────┐
    │ SUCCESS       │       │ PAYMENT FAILED│
    │ → "Your gift  │       │ → "Payment    │
    │   of $50 will │       │   didn't go   │
    │   fund..."    │       │   through"    │
    │ → Receipt info│       │ → Try again   │
    │ → Share CTA   │       │   or use      │
    │ → "Another"   │       │   different   │
    └───────────────┘       │   card"       │
                            └───────────────┘
```

---

## FLOW 4: VOLUNTEER

```
User wants to volunteer
        │
        ▼
┌─────────────────────────────────────┐
│  VOLUNTEER PAGE — LOADING           │
│  → Skeleton role cards              │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  VOLUNTEER PAGE — LOADED            │
│  → Hero + stats bar                 │
│  → "Apply to Volunteer" CTA         │
│  → "View Roles" anchor link        │
│  → 4 role cards                     │
│  → Requirements section             │
│  → Process section                  │
│  → Application form                 │
└─────────────────────────────────────┘
        │
        ├── User browses roles ───────────────────┐
        │   → Reads commitment, requirements      │
        │   → Clicks "Apply" anchor               │
        │   → Scrolls to form                     │
        │                                          │
        └── User fills application ────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  SUBMIT → SUCCESS                   │
        │  → "Welcome to PawGuard"            │
        │  → "We'll contact you within        │
        │    5 business days"                 │
        │  → Orientation info                 │
        └─────────────────────────────────────┘
```

---

## FLOW 5: BROWSE STORIES

```
User wants to read success stories
        │
        ▼
┌─────────────────────────────────────┐
│  STORIES PAGE — LOADING             │
│  → Skeleton featured story          │
│  → 6 skeleton cards                 │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  STORIES PAGE — LOADED              │
│  → Featured story (image + detail)  │
│  → Story card grid (6 stories)      │
│  → "Share Your Story" CTA           │
│  → "Browse Animals" CTA             │
└─────────────────────────────────────┘
        │
        ├── User reads featured story ────────────┐
        │   → Scans excerpt                       │
        │   → Sees adopter name, type, date       │
        │                                          │
        ├── User browses more stories ────────────┘
        │   → Hovers cards (image zoom)
        │   → Reads headlines and excerpts
        │
        └── User clicks "Browse Animals" ─────────┘
                        │
                        ▼
                → Navigate to /adopt
```

---

## FLOW 6: GET IN CONTACT

```
User needs help
        │
        ▼
┌─────────────────────────────────────┐
│  CONTACT PAGE — LOADED              │
│  → Emergency redirect banner        │
│  → FAQ accordion (7 questions)      │
│  → Contact form                     │
│  → Direct contacts                  │
└─────────────────────────────────────┘
        │
        ├── User browses FAQ ────────────────────┐
        │   → Opens accordion items              │
        │   → Finds answer → done                │
        │   → Doesn't find → scrolls to form     │
        │                                          │
        └── User fills contact form ──────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────┐
        │  SUBMIT → SUCCESS                   │
        │  → "Message Sent"                   │
        │  → "We respond within               │
        │    1-2 business days"               │
        └─────────────────────────────────────┘
```

---

## FLOW 7: 404 / NOT FOUND

```
User lands on invalid URL
        │
        ▼
┌─────────────────────────────────────┐
│  404 PAGE — LOADED                  │
│  → "404" in monospace, large        │
│  → "Page not found"                 │
│  → "The page you're looking for     │
│    doesn't exist or has been moved."│
│  → "Back to Home" CTA              │
└─────────────────────────────────────┘
        │
        ▼
→ Navigate to /
```

---

## FLOW 8: OFFLINE

```
User loses connection mid-session
        │
        ▼
┌─────────────────────────────────────┐
│  OFFLINE BANNER APPEARS             │
│  → Slides down from top (300ms)     │
│  → "You're offline. Your data is    │
│    saved locally and will be sent   │
│    when your connection returns."   │
│  → All forms remain functional      │
│  → Data queued in localStorage      │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  CONNECTION RESTORED                │
│  → Banner: "Connection restored."   │
│  → Queued submissions auto-process  │
│  → User notified of results         │
└─────────────────────────────────────┘
```

---

## FLOW 9: MAINTENANCE

```
System under maintenance
        │
        ▼
┌─────────────────────────────────────┐
│  MAINTENANCE PAGE                   │
│  → Full-page overlay                │
│  → "PawGuard is undergoing          │
│    scheduled maintenance"           │
│  → Estimated return time            │
│  → Emergency hotline still visible  │
│  → "We'll be back by 8 AM EST"      │
└─────────────────────────────────────┘
```
