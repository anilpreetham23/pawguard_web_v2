export const ANIMATION_NAMES = {
  HERO_REVEAL: "hero-reveal",
  SECTION_REVEAL: "section-reveal",
  STAGGER_CONTAINER: "stagger-container",
  STAGGER_ITEM: "stagger-item",
  MODAL_OPEN: "modal-open",
  MODAL_CLOSE: "modal-close",
  DRAWER_OPEN: "drawer-open",
  DRAWER_CLOSE: "drawer-close",
  PAGE_ENTER: "page-enter",
  PAGE_EXIT: "page-exit",
  COUNT_UP: "count-up",
  TEXT_SPLIT: "text-split",
  PARALLAX: "parallax",
  MAGNETIC_HOVER: "magnetic-hover",
  SCROLL_PROGRESS: "scroll-progress",
} as const;

export const MOTION_TIERS = {
  FULL: "full",
  REDUCED: "reduced",
  NONE: "none",
} as const;

export const SMOOTH_SCROLL = {
  FULL: "full",
  REDUCED: "reduced",
  NATIVE: "native",
} as const;

export const ROUTE_TYPES = {
  HOMEPAGE: "homepage",
  MARKETING: "marketing",
  EMERGENCY: "emergency",
  FORM: "form",
  AUTH: "auth",
} as const;
