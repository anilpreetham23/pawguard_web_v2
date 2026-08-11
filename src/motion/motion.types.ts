import type { Transition, Variants, SpringOptions } from "motion/react";

export type EasingArray = [number, number, number, number];

export interface EasingPreset {
  fast: EasingArray;
  standard: EasingArray;
  gentle: EasingArray;
  narrative: EasingArray;
  emerge: EasingArray;
  snap: EasingArray;
  springy: EasingArray;
}

export interface SpringPreset {
  stiff: any;
  responsive: any;
  gentle: any;
  bouncy: any;
  urgent: any;
}

export interface DurationPreset {
  instant: number;
  fast: number;
  standard: number;
  ui: number;
  gentle: number;
  scroll: number;
  reveal: number;
  narrative: number;
  slow: number;
  deliberate: number;
}

export interface StaggerPreset {
  fast: number;
  standard: number;
  slow: number;
  narrative: number;
}

export interface DelayPreset {
  none: number;
  micro: number;
  short: number;
  medium: number;
  long: number;
  narrative: number;
}

export type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade";

export interface RevealVariant {
  hidden: Record<string, unknown>;
  visible: Record<string, unknown>;
}

export interface SectionTransition {
  up: RevealVariant;
  down: RevealVariant;
  left: RevealVariant;
  right: RevealVariant;
  scale: RevealVariant;
  fade: RevealVariant;
  /** Chapter-level entry: fade -> translate -> scale -> settle. */
  section: RevealVariant;
  /** Full-viewport hero reveal. */
  hero: RevealVariant;
  /** Card / grid item entry. */
  card: RevealVariant;
  /** Step / node entry along a timeline. */
  timeline: RevealVariant;
  /** Panel / story content entry. */
  panel: RevealVariant;
}

export interface RouteTransitionPreset {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit: Record<string, unknown>;
  transition?: Transition;
}

export interface RouteTransitionCollection {
  default: RouteTransitionPreset;
  emergency: RouteTransitionPreset;
  warm: RouteTransitionPreset;
  minimal: RouteTransitionPreset;
}

export interface ButtonPhysicsPreset {
  hover: { scale: number; transition: { duration: number } };
  tap: { scale: number; transition: { duration: number } };
}

export interface CardHoverPhysicsPreset {
  rest: { y: number; boxShadow: string };
  hover: { y: number; boxShadow: string; transition: { duration: number; ease: EasingArray } };
}

export interface ModalPhysicsPreset {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit: Record<string, unknown>;
}

export type MotionTier = "full" | "reduced" | "none";

export type RouteType =
  | "homepage"
  | "marketing"
  | "emergency"
  | "form"
  | "auth";

export interface RoutePolicy {
  smoothScroll: "full" | "reduced" | "native";
  motionTier: MotionTier;
  parallax: boolean;
  textSplit: boolean;
  scrollParams?: {
    lerp?: number;
    duration?: number;
    wheelMultiplier?: number;
    touchMultiplier?: number;
  };
}

export type RoutePolicyMap = Record<RouteType, RoutePolicy>;
