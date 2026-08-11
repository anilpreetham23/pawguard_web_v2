# PawGuard Originality Principles

## Core Mission

PawGuard must not resemble any other product. If a user cannot identify the page as PawGuard within 3 seconds (even with the logo hidden), the design is not original enough.

## Rejection Criteria

Before approving any component or layout, answer:

| Question | If Yes | Action |
|----------|--------|--------|
| Does this match a Tailwind UI example? | Reject | Redesign with distinct spacing, color, or layout ratio |
| Does this match a shadcn example? | Reject | Redesign — shadcn is a starting point, not a destination |
| Does this match a Bootstrap pattern? | Reject | Bootstrap is 10+ years old. Design for today. |
| Does this match a Flowbite component? | Reject | Flowbite is template-oriented. PawGuard is not. |
| Does this match a Dribbble concept? | Reject | Dribbble concepts are visual, not functional. Adapt for real use. |
| Could another NGO use this unchanged? | Reject | Add PawGuard-specific context, naming, or interaction |
| Does this feel "AI generated"? | Reject | Add asymmetry, intentional imperfection, human detail |
| Does this feel like a template? | Reject | Every section must have a unique layout on its page |

## How to Be Original

### Layout Originality
1. No two consecutive sections on the same page may share the same layout.
2. Avoid equal-column grids without a specific content reason.
3. Asymmetric layouts are preferred over symmetric.
4. If a section has 4 items, consider 1-2-1 or 3-1 layout instead of 2-2.
5. Cards should not all be identical sizes on any page. Use featured cards, compact cards, and detail cards.

### Component Originality
1. Every component must carry PawGuard-specific semantics.
2. Naming reflects purpose: `AdoptionCard`, not `Card`.
3. Components should compose PawGuard workflows, not generic layout functions.
4. If a component could be extracted into a standalone UI library, it is too generic.

### Typography Originality
1. Playfair Display is the signature typeface. Use it at sizes and weights that stand out.
2. Do not use standard Tailwind typography scale without adjustment.
3. Leading, tracking, and scale should feel intentional, not default.

### Color Originality
1. Navy + warm-off-white + crimson is the signature palette.
2. No gradient backgrounds unless they serve a specific narrative purpose.
3. Color should be used sparingly — let whitespace do the work.

### Motion Originality
1. No standard CSS `fadeIn` or `slideUp` without character.
2. Motion should feel bespoke to PawGuard — not copied from an animation library demo.
3. Motion timing should match the mode (fast for urgency, gentle for connection).

## Originality Validation Process

Every section of every page must pass this review before acceptance:

```
SECTION: [name]
PAGE: [page]

Template check:
  - [ ] Does not match Tailwind/Flowbite/Bootstrap/shadcn layouts
  - [ ] Does not match Dribbble concepts
  - [ ] Could not be used by another NGO unchanged
  
Mode alignment:
  - [ ] Layout matches the page's primary mode (URGENCY/CONNECTION/etc.)
  - [ ] Layout differs from previous section on page

Brand check:
  - [ ] Uses PawGuard signature typography distinctively
  - [ ] Uses PawGuard signature palette distinctively
  - [ ] Feels specific to animal rescue (not SaaS, not e-commerce)

Final: APPROVED / REVISE
```

## Anti-Patterns to Eliminate

| Pattern | Instead |
|---------|---------|
| Two-column hero with image right | See Hero design (varies by page mode) |
| Three-column feature grid | Use varied layout (1-2-1, featured + secondary) |
| Centered CTA in a dark section | Contextual CTA placement based on emotional arc |
| Avatar circles for team | Photo cards with full-bleed images |
| "Read More" links | Specific action: "Meet Bella," "Read Bruno's Story" |
| Generic footer columns | Purpose-grouped links relevant to rescue workflow |
| Standard form layout with stacked fields | Layout varies by mode (urgent forms compact, community forms spacious) |
