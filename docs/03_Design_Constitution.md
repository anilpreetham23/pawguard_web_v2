# PawGuard Design Constitution

## Purpose
This document is the rulebook for every screen in PawGuard. Any design decision that contradicts this constitution must be escalated before implementation.

## Core Principles
- Every screen serves a single primary question
- No two consecutive sections share the same layout
- Every component exists because a PawGuard workflow requires it
- No generic UI patterns without PawGuard-specific purpose

## Visual Philosophy
- **Typography**: Playfair Display for headings (editorial authority), Inter for body (readability), JetBrains Mono for data (precision)
- **Color**: Navy #00236f represents trust and professionalism. Crimson #ba1a1a represents urgency and action. Warm off-white #faf8ff provides approachability.
- **Space**: Generous whitespace communicates calm competence. Never crowd elements.
- **Grid**: Asymmetric layouts preferred over symmetric. 12-column grid in desktop, 4-column in mobile.

## Interaction Philosophy
- Hover states reveal interactivity (scale, shadow, color shift)
- Focus states are always visible (2px ring with offset)
- Loading states show progress (spinners, skeleton placeholders)
- Error states explain the problem AND how to fix it
- Success states celebrate briefly (checkmark animation, scale-in)

## Accessibility Rules
- All form inputs have associated labels
- Error messages are programmatically associated with inputs (aria-describedby)
- Color is never the only indicator of state
- Touch targets minimum 44x44px
- All animations respect prefers-reduced-motion

## Motion Philosophy
- Motion must explain, never decorate
- Emergency flows use fast motion (150-200ms)
- Medical/care sections use gentle motion (300-400ms)
- Adoption/hope sections use optimistic motion (scale, spring)
- Finance/transparency uses stable motion (fade, no bounce)

## Content Philosophy
- Write at 8th-grade reading level for emergency content
- Use active voice: "We rescued" not "Rescue was performed"
- Avoid jargon: "Get Help" not "Initiate Assistance Protocol"
- Numbers should be specific: "4,200 rescues" not "thousands"

## Originality Rules
- No section may use the same layout as another section on the same page
- Cards must serve a PawGuard purpose (AdoptionCard, ImpactMetric, RescueTimeline)
- Avoid any pattern that could be confused with Bootstrap, Tailwind UI, or shadcn examples
- If a component could be used unchanged by a different NGO, it needs PawGuard-specific design

## Review Standards
Every screen is scored on: Originality, Hierarchy, Usability, Accessibility, Consistency, Motion, Brand
Minimum score: 8/10 per category. If below, revise before client presentation.
