# Motion Architecture — PawGuard Homepage

## Ownership Rules

| Library | Ownership |
| ------- | --------- |
| GSAP + ScrollTrigger | Storytelling, timelines, scrub animations |
| Framer Motion | UI interactions (reveals, cards, modals) |
| CSS keyframes | Ambient loops, decorative motion |
| Lenis | Smooth scrolling |
| Zustand | State sharing only, never drives animation |
| HTML5 Video | Hero background |

No animation may violate these ownership rules.

---

## Animation Inventory

### Hero Section (always visible on load)

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Hero Video | HTML5 Video | Always | Yes | Yes | Yes | Low | Hero |
| Hero Camera Drift | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Medium | Hero |
| Hero Sun Glow | CSS @keyframes + mix-blend-screen | Always | Yes | Yes (data-ambient) | Yes | Medium | Hero |
| Hero Bloom | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Vignette | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Atmosphere | CSS @keyframes + mix-blend-overlay | Always | Yes | Yes (data-ambient) | Yes | Medium | Hero |
| Hero God Rays | CSS @keyframes + mix-blend-soft-light | Always | Yes | Yes (data-ambient) | Yes | Medium | Hero |
| Hero Live Dot | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Heartbeat | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Scroll Dot | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Caret Blink | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Ticker Dot | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Headline Accent Draw | CSS @keyframes | Load | No | N/A | Yes | Low | Hero |
| Hero Glass Shimmer | CSS @keyframes | Load | No | N/A | Yes | Low | Hero |
| Hero Decoration Drift | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Float Gentle | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Hero |
| Hero Text Reveal | Framer Motion | Load | No | N/A | Yes | Low | Hero |
| Hero CTA Entrance | Framer Motion | Load | No | N/A | Yes | Low | Hero |
| Preloader Lottie | Framer Motion | Load | No | N/A | Yes | Medium | Global |
| Cursor Follower | GSAP ticker | Mouse | Yes | Yes | CPU | Medium | Global |
| Magnetic Wrapper | GSAP | Mouse hover | No | N/A | CPU | Low | Global |

### Navigation

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Navbar Entrance | Framer Motion | Load | No | N/A | Yes | Low | Navigation |
| Navbar Hide/Show | Framer Motion | Scroll | Yes | Yes | Yes | Low | Navigation |
| Navbar Blur | CSS backdrop-filter | Scroll | Yes | Yes | GPU | High | Navigation |
| Navbar Emergency Glow | CSS | Scroll (IntersectionObserver) | Yes | Yes | Yes | Low | Navigation |
| Nav Link Hover | CSS transition | Hover | No | N/A | Yes | Low | Navigation |

### Scroll Progress

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Scroll Progress Bar | MotionValue (direct DOM) | Scroll | Yes | Yes | Yes | Low | Motion |
| Puppy Indicator | MotionValue (direct DOM) | Scroll | Yes | Yes | Yes | Low | Motion |

### Emergency Story Section

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Rescue Timeline Scrub | GSAP + ScrollTrigger | Scroll | Yes | Yes | CPU | High | Story |
| Rescue Node Pulse | CSS @keyframes | Scroll (active state) | Yes | Yes | Yes | Low | Story |
| Rescue Node Complete | GSAP | Scroll | No | N/A | Yes | Low | Story |
| Emergency Header Reveal | Framer Motion | Enter viewport | No | N/A | Yes | Low | Story |
| Emergency Story Step Reveal | GSAP | Scroll | No | N/A | CPU | Medium | Story |

### Services Section

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Services Hub Breathe | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Services |
| Services Sector Drift | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Services |
| Services Ring Energy | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Services |
| Service Card Hover | Framer Motion | Hover | No | N/A | Yes | Low | Services |
| Service Timeline | GSAP | Scroll | Yes | Yes | CPU | High | Services |
| Story Content Timeline | GSAP | Scroll | Yes | Yes | CPU | High | Services |

### Trust Bar

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Trust Bar Shimmer | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | TrustBar |

### Impact Section

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Stat Shimmer | CSS @keyframes | Load | No | N/A | Yes | Low | ImpactMetric |
| Impact Number Count | GSAP | Enter viewport | No | N/A | CPU | Low | ImpactMetric |

### How It Works / Rescue Timeline

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Timeline Reveal | Framer Motion | Enter viewport | No | N/A | Yes | Low | Motion |
| Timeline Nodes | GSAP + ScrollTrigger | Scroll | Yes | Yes | CPU | Medium | Timeline |
| Timeline Connector | GSAP | Scroll | Yes | Yes | Yes | Medium | Timeline |

### Adoption Section

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Adoption Card Hover | CSS transition | Hover | No | N/A | Yes | Low | AdoptionCard |
| Adoption Card Stagger | Framer Motion | Enter viewport | No | N/A | Yes | Low | Motion |

### Volunteer / Donate Section

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Section Entrance | Framer Motion | Enter viewport | No | N/A | Yes | Low | Motion |

### Footer

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Footer Network Fade | CSS @keyframes | Always | Yes | Yes (data-ambient) | Yes | Low | Footer |

### Global

| Component | Library | Trigger | Continuous | Offscreen Pause | GPU | CPU | Owner |
| --------- | ------- | ------- | ---------- | --------------- | --- | --- | ----- |
| Lenis Smooth Scroll | Lenis | Always | Yes | N/A | N/A | Medium | Motion |
| Scroll State Updates | Zustand | Scroll | Yes | N/A | N/A | Low | Motion |
| ScrollTrigger Sync | GSAP ScrollTrigger | Scroll | Yes | N/A | CPU | High | Motion |
| Page Transitions | Framer Motion | Route change | No | N/A | Yes | Medium | Motion |

---

## Pause Strategy

| Condition | Action |
| --------- | ------ |
| Hero offscreen | Pause all hero ambient loops (CSS animation-play-state: paused) |
| User actively scrolling hero | Pause compositor-heavy hero loops (camera drift, sun, vignette, atmosphere) |
| Reduced motion enabled | Disable all continuous animations, keep static positions |
| Section offscreen | Pause section-specific animations |
| Menu open | Pause Lenis, pause ambient loops |
| Page idle (no scroll for 3s) | Puppy indicator enters idle state |

---

## Performance Budget Per Section

| Section | Max Continuous Systems | Max CPU per Frame | Max GPU Layers |
| ------- | --------------------- | ----------------- | -------------- |
| Hero | 3 | <3ms | 8 |
| Trust Bar | 1 | <1ms | 2 |
| Emergency | 2 | <2ms | 4 |
| Timeline | 2 | <2ms | 3 |
| Services | 1 | <1ms | 2 |
| Adoption | 1 | <1ms | 2 |
| Volunteer/Donate | 1 | <1ms | 2 |
| Footer | 0 | <0.5ms | 1 |
| Offscreen | 0 | 0 | 0 |

---

## Reduced Motion Strategy

| Tier | Behavior |
| ---- | -------- |
| `full` | All animations enabled |
| `reduced` | Continuous animations disabled, scroll-driven animations use native browser, transitions use `transition: none` |
| `none` | All animations disabled, instant visibility, no motion |

---

## Known Issues

1. Lenis rAF loop runs continuously even when not scrolling — FIXED: added idle detection (2s threshold), rAF loop pauses when idle and resumes on scroll
2. ScrollTrigger.update() called on every Lenis scroll event — mitigated by Lenis decoupled rAF loop
3. Navbar backdrop-filter changes on every scroll frame — FIXED: now static blur(12px)
4. ScrollProgress reads getBoundingClientRect/offsetWidth inside RAF — FIXED: uses ResizeObserver-cached measurements
5. Cursor GSAP ticker runs on every frame even when mouse hasn't moved — FIXED: skips frames when mouse hasn't moved (0.5px threshold)
6. Multiple GSAP timelines active simultaneously on the same page — mitigated by gsap.context() cleanup per component
7. Hero video is 9.7MB (should be <2MB per performance budget) — asset issue, needs re-encoding
8. CSS has 40+ @keyframes animations, many running continuously — mitigated by data-ambient off-screen pause rules and comprehensive [data-ambient="off"] [class*="animate-"] CSS rule