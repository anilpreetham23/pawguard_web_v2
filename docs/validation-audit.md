# Validation Audit & Usability Testing Plan

## Project: PawGuard — Animal Rescue & Adoption Network
## Phase 6: Validation
## Date: July 2026

---

## 1. Automated WCAG 2.2 AA Audit

### Structural Checks (HTML)

| Check | Status | Notes |
|-------|--------|-------|
| `lang` attribute on `<html>` | ✅ Pass | `lang="en"` |
| Viewport meta tag | ✅ Pass | `width=device-width, initial-scale=1.0` |
| Skip-to-content link | ✅ Pass | Navbar has `#main-content` skip link |
| Page title | ✅ Pass | Descriptive, action-oriented title |
| Heading hierarchy | ⚠️ Review | h1 exists on all pages. Some pages jump h1→h3 without h2. |
| Landmarks (main, nav) | ✅ Pass | All pages use `<main>` and `<nav>` |
| Form labels | ✅ Pass | All form inputs have explicit labels |
| ARIA roles | ⚠️ Review | Custom components use `role="status"` on success states. Confirm `aria-live` regions. |
| Image alt text | ⚠️ Review | Unsplash placeholder images have alt text. Real photos will need descriptive alt. |
| Focus indicators | ✅ Pass | `focus-visible` styles defined in theme.css with high-contrast ring |
| Color contrast | ⚠️ Needs verification | `#faf6ef` (warm cream) on `#00236f` (navy) passes. Check `#faf6ef` on `#1a1b1e`. |
| Reduced motion | ✅ Pass | `prefers-reduced-motion: reduce` query in theme.css strips all animations |

### Issues Found

1. **Heading hierarchy gaps** — Some pages use `h1` → `h3` with missing `h2`. Fix: ensure proper nesting.
2. **Color contrast** — Warm cream (`#faf6ef`) on dark foreground (`#1a1b1e`) = ratio ~15.6:1 ✅. Emergency red (`#c41a1a`) on white = ratio ~5.1:1 ✅ (AA for normal text). Emergency red on warm cream = ratio ~4.8:1 ⚠️ (AA for large text only).
3. **Video** — The 9.7 MB hero video has no captions or transcript. Add `<track>` element or provide text alternative.

---

## 2. Core Web Vitals Assessment

### Current Build Metrics

| Metric | Value | Rating |
|--------|-------|--------|
| **Total JS** | 322 kB (gzip: 106 kB) | ⚠️ Moderate |
| **Total CSS** | 139 kB (gzip: 24 kB) | ✅ Acceptable |
| **Hero Video** | 9.7 MB | ❌ Critical — will severely impact LCP on 4G |
| **Fonts** | 3 Google Fonts (Inter, DM Serif Display, Barlow Condensed + JetBrains Mono) | ⚠️ 4 font loads |
| **Render-blocking** | None (Vite code-splits efficiently) | ✅ |
| **Code-splitting** | Per-page chunks (20-42 kB each) | ✅ |

### Critical Issues

1. **9.7 MB hero video** — This is the single largest performance problem. The video loads on every page visit, even mobile.
   - **Fix:** Compress to < 2 MB with H.265/HEVC. Use WebM as fallback. Use `loading="lazy"` on the video in the VideoSection. Consider replacing hero video with a compressed poster image + shorter clip.
   - **Impact:** Loading this video on 4G takes ~26 seconds at 3 Mbps.

2. **Four font families** — Inter + DM Serif Display + Barlow Condensed + JetBrains Mono = 4 Google Font loads.
   - **Impact:** Font swap may cause layout shift (CLS).
   - **Fix:** Preload `font-display: swap` is already set. Consider subsetting or removing JetBrains Mono (only used in a few places).

3. **No critical CSS inlining** — The page relies on the full Tailwind-generated CSS file.
   - **Fix:** Consider extracting critical CSS for above-the-fold content.

### Recommendations

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| P0 | Compress hero video to < 2 MB | Low | High (LCP) |
| P0 | Add `loading="lazy"` to video element | Low | High (LCP) |
| P1 | Preconnect to Google Fonts origin | Low | Medium |
| P1 | Remove unused font weights from Google Fonts URL | Low | Medium |
| P2 | Add `<link rel="preload">` for hero image/video poster | Low | Medium |
| P2 | Implement responsive video (different file per viewport) | Medium | Medium |

---

## 3. Usability Testing Plan

### Test Flows

#### Flow A: Emergency Report (Critical Path)

**Scenario:** "You are walking your dog and see an injured cat on the side of the road. It is bleeding and can't move."

| Step | User Action | Expected Behavior | Success Criteria |
|------|-------------|-------------------|-----------------|
| 1 | Navigate to Emergency page | Emergency form loads, hotline visible | < 2 seconds page load |
| 2 | Select "Critical" situation type | Visual confirmation, dispatch badge appears | Immediate feedback |
| 3 | Enter location | Field accepts text, prefix icon visible | No errors |
| 4 | Describe the animal | Textarea accepts multi-line input | No character limit issues |
| 5 | Upload photo (optional) | File picker opens, preview shown | Works on mobile |
| 6 | Enter contact number | Phone keyboard on mobile | Correct input mode |
| 7 | Review and submit | Summary page shows all entered data | Data is accurate |
| 8 | View confirmation | Report number, countdown timer, checklist visible | Timer starts immediately |

**Success metric:** User completes report in < 3 minutes without assistance.
**Error metric:** User hesitates at any step > 15 seconds.

#### Flow B: Donation (Conversion Path)

**Scenario:** "You want to donate $50 to support animal rescue operations."

| Step | User Action | Expected Behavior | Success Criteria |
|------|-------------|-------------------|-----------------|
| 1 | Click Donate in nav | Donate page loads, impact visible | < 2 seconds |
| 2 | Select $50 amount | $50 button highlights, impact visual updates | Real-time icon change |
| 3 | See impact description | "Fund Emergency Transport" shown in detail card | Matches expectation |
| 4 | Enter payment details | Form fields accept input | Smooth data entry |
| 5 | Click "Give $50 — Fund Emergency Transport" | Button shows loading state with progress bar | Visual progress |
| 6 | See success confirmation | Confetti, thank you message, impact restated | Emotional validation |

**Success metric:** User completes donation < 90 seconds.
**Trust metric:** User reads trust/accreditation badges before submitting.

#### Flow C: Adoption (Discovery Path)

**Scenario:** "You are considering adopting a dog and want to see what's available."

| Step | User Action | Expected Behavior | Success Criteria |
|------|-------------|-------------------|-----------------|
| 1 | Click Adopt in nav | Adoption page loads with process overview | Process visible first |
| 2 | Browse animals | Cards render with images and info | < 1 second render |
| 3 | Filter by species (Dog) | Grid updates smoothly | No layout jump |
| 4 | Read an animal's details | Health, temperament, vaccination status visible | All info present |
| 5 | Click "Meet {name}" | Leads to contact/inquiry | Clear next step |
| 6 | See adoption support info | Health guarantee, adjustment period, support shown | Trust signals visible |

**Success metric:** User finds an animal of interest < 60 seconds.
**Trust metric:** User sees health + temperament info before clicking CTA.

### Participant Criteria

- **5 participants per flow** (15 total)
- Mix of:
  - Pet owners (2)
  - Non-pet owners (1)
  - Previous adopters (1)
  - Older adults (65+) (1)
- Device mix: 3 desktop, 2 mobile

### Test Questions (Post-Task)

1. On a scale of 1–5, how confident were you that help was coming? (Flow A)
2. Did you trust where your money was going? (Flow B)
3. Did the animal profiles give you enough information? (Flow C)
4. What was unclear or confusing?
5. What would you change?

### Accessibility Testing (Per Flow)

| Check | Method |
|-------|--------|
| Keyboard navigation | Tab through entire flow, no mouse |
| Screen reader | NVDA or VoiceOver — all actions announced |
| Zoom to 200% | No content loss or horizontal scroll |
| Reduced motion | All animations disabled, no information loss |

---

## 4. Board Sign-Off Checklist

| Item | Status | Notes |
|------|--------|-------|
| Phase 1: Foundation | ✅ Complete | Tokens, typography, photography brief |
| Phase 2: Signature Moments | ✅ Complete | Emergency dispatch, donation impact, hero video |
| Phase 3: Trust Layer | ✅ Complete | Trust bar, transparency, partner badges |
| Phase 4: Storytelling | ✅ Complete | Editorial layout, role previews, adoption process |
| Phase 5: Interaction Language | ✅ Complete | Dispatch motion, form progress, nav overhaul |
| Phase 6: Validation | ✅ In progress | This document |
| Performance (video compression) | ⬜ Open | Must compress hero video before production |
| Color contrast verification | ⚠️ Needs tool | Run axe DevTools or WAVE on production build |
| Usability testing | ⬜ To schedule | 15 participants across 3 flows |

---

## 5. Pre-Production Checklist

- [ ] Compress hero video to < 2 MB
- [ ] Add `loading="lazy"` to video and below-fold images
- [ ] Run axe DevTools full scan
- [ ] Run Lighthouse (mobile + desktop)
- [ ] Test keyboard navigation on all pages
- [ ] Test with screen reader (NVDA + VoiceOver)
- [ ] Test at 200% zoom
- [ ] Test on 4G throttled connection
- [ ] Replace Unsplash placeholders with real documentary photography
- [ ] Compress hero video to <2MB (HandBrake: H.265 720p CRF 28, or `ffmpeg -i input.mp4 -c:v libx265 -crf 28 -vf scale=720:-2 -c:a aac output.mp4`)
- [ ] Self-host subsetted fonts to eliminate Google Fonts request (use glyphhanger or Fontsource)
- [ ] Add `<link rel="preload">` for critical above-the-fold hero video poster
- [ ] Board sign-off meeting
