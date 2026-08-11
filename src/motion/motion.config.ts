import type {
  EasingPreset,
  SpringPreset,
  DurationPreset,
  StaggerPreset,
  DelayPreset,
  RevealVariant,
  SectionTransition,
  RouteTransitionCollection,
  ButtonPhysicsPreset,
  CardHoverPhysicsPreset,
  ModalPhysicsPreset,
  RoutePolicyMap,
} from "./motion.types";

export const ease: EasingPreset = {
  fast: [0.25, 0.1, 0.25, 1],
  standard: [0.4, 0, 0.2, 1],
  gentle: [0, 0, 0.2, 1],
  narrative: [0.16, 1, 0.3, 1],
  emerge: [0.22, 1, 0.36, 1],
  snap: [0.5, 0, 0.5, 1],
  springy: [0.34, 1.56, 0.64, 1],
};

export const spring: SpringPreset = {
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  responsive: { type: "spring", stiffness: 200, damping: 20 },
  gentle: { type: "spring", stiffness: 120, damping: 15 },
  bouncy: { type: "spring", stiffness: 250, damping: 10 },
  urgent: { type: "spring", stiffness: 400, damping: 50 },
};

export const duration: DurationPreset = {
  instant: 100,
  fast: 150,
  standard: 200,
  ui: 220,
  gentle: 300,
  scroll: 350,
  reveal: 450,
  narrative: 500,
  slow: 700,
  deliberate: 1000,
};

export const stagger: StaggerPreset = {
  fast: 0.03,
  standard: 0.06,
  slow: 0.1,
  narrative: 0.15,
};

export const delay: DelayPreset = {
  none: 0,
  micro: 50,
  short: 100,
  medium: 200,
  long: 400,
  narrative: 700,
};

function buildReveal(direction: string): RevealVariant {
  const maps: Record<string, RevealVariant> = {
    up: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: duration.reveal / 1000, ease: ease.narrative } },
    },
    down: {
      hidden: { opacity: 0, y: -24 },
      visible: { opacity: 1, y: 0, transition: { duration: duration.reveal / 1000, ease: ease.narrative } },
    },
    left: {
      hidden: { opacity: 0, x: -24 },
      visible: { opacity: 1, x: 0, transition: { duration: duration.gentle / 1000, ease: ease.gentle } },
    },
    right: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0, transition: { duration: duration.gentle / 1000, ease: ease.emerge } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.97 },
      visible: { opacity: 1, scale: 1, transition: { duration: duration.standard / 1000, ease: ease.standard } },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: duration.gentle / 1000, ease: ease.standard } },
    },
  };
  return maps[direction] ?? maps.up;
}

export const sectionReveal: SectionTransition = {
  up: buildReveal("up"),
  down: buildReveal("down"),
  left: buildReveal("left"),
  right: buildReveal("right"),
  scale: buildReveal("scale"),
  fade: buildReveal("fade"),
  section: {
    hidden: { opacity: 0, y: 24, scale: 0.995 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: duration.reveal / 1000, ease: ease.narrative },
    },
  },
  hero: {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: duration.narrative / 1000, ease: ease.narrative },
    },
  },
  card: {
    hidden: { opacity: 0, y: 18, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: duration.gentle / 1000, ease: ease.gentle },
    },
  },
  timeline: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.gentle / 1000, ease: ease.gentle },
    },
  },
  panel: {
    hidden: { opacity: 0, y: 20, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: duration.gentle / 1000, ease: ease.gentle },
    },
  },
};

export const routeTransition: RouteTransitionCollection = {
  default: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: duration.standard / 1000, ease: ease.standard },
  },
  emergency: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: duration.fast / 1000, ease: ease.snap },
  },
  warm: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { duration: duration.gentle / 1000, ease: ease.emerge },
  },
  minimal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.fast / 1000 },
  },
};

export const buttonPhysics: ButtonPhysicsPreset = {
  hover: { scale: 1.02, transition: { duration: duration.fast / 1000 } },
  tap: { scale: 0.97, transition: { duration: 0.08 } },
};

export const cardHover: CardHoverPhysicsPreset = {
  rest: { y: 0, boxShadow: "var(--shadow-sm)" },
  hover: {
    y: -4,
    boxShadow: "var(--shadow-hover-card)",
    transition: { duration: duration.gentle / 1000, ease: ease.gentle },
  },
};

export const modalPhysics: ModalPhysicsPreset = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: duration.fast / 1000 } },
};

export const drawerPhysics: ModalPhysicsPreset = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 35 },
  },
  exit: { x: "100%", transition: { duration: duration.standard / 1000, ease: ease.standard } },
};

export const routePolicy: RoutePolicyMap = {
  homepage: {
    smoothScroll: "full",
    motionTier: "full",
    parallax: true,
    textSplit: true,
    scrollParams: { lerp: 0.08, duration: 1.2, wheelMultiplier: 1, touchMultiplier: 1 },
  },
  marketing: {
    smoothScroll: "full",
    motionTier: "full",
    parallax: true,
    textSplit: true,
    scrollParams: { lerp: 0.08, duration: 1.2, wheelMultiplier: 1, touchMultiplier: 1 },
  },
  emergency: {
    smoothScroll: "full",
    motionTier: "full",
    parallax: false,
    textSplit: false,
    scrollParams: { lerp: 0.1, duration: 0.7, wheelMultiplier: 0.9, touchMultiplier: 1 },
  },
  form: {
    smoothScroll: "full",
    motionTier: "full",
    parallax: false,
    textSplit: false,
    scrollParams: { lerp: 0.1, duration: 0.6, wheelMultiplier: 0.9, touchMultiplier: 1 },
  },
  auth: {
    smoothScroll: "full",
    motionTier: "full",
    parallax: false,
    textSplit: false,
    scrollParams: { lerp: 0.1, duration: 0.6, wheelMultiplier: 0.9, touchMultiplier: 1 },
  },
};
