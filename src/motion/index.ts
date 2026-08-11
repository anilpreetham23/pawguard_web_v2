export { ease, spring, duration, stagger, delay, sectionReveal, routeTransition, buttonPhysics, cardHover, modalPhysics, drawerPhysics, routePolicy } from "./motion.config";
export { ANIMATION_NAMES, MOTION_TIERS, SMOOTH_SCROLL, ROUTE_TYPES } from "./motion.constants";
export { prefersReducedMotion, getMotionTier, getEffectiveDuration, getEffectiveEasing, clampDuration, getRoutePolicy, onReducedMotionChange } from "./motion.utils";
export { registerGsapPlugins } from "./gsap-register";
export { useMotionStore } from "./motion-store";
export { LenisProvider } from "./lenis-provider";
export { MotionProvider } from "./motion-provider";
export { MotionHeading } from "./components/motion-heading";
export { GlobalLoader } from "./components/GlobalLoader";
export { MagneticWrapper } from "./components/magnetic-wrapper";
export { Atmosphere } from "./components/Atmosphere";
export { Parallax } from "./components/Parallax";
export { useTextSplit } from "./hooks/use-text-split";
export { useCountUp } from "./hooks/use-count-up";
export { scrollTo, scrollToTop, scrollToBottom, scrollToSelector, cancelScroll, resumeScroll, getScrollPosition, getScrollProgress, refreshScroll } from "./scroll";
export type {
  EasingArray,
  SpringPreset,
  DurationPreset,
  StaggerPreset,
  DelayPreset,
  RevealVariant,
  SectionTransition,
  RouteTransitionPreset,
  RouteTransitionCollection,
  ButtonPhysicsPreset,
  CardHoverPhysicsPreset,
  ModalPhysicsPreset,
  MotionTier,
  RouteType,
  RoutePolicy,
  RoutePolicyMap,
} from "./motion.types";
