import { ease } from "../../../motion";

export const panelVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: ease.gentle,
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: ease.standard } },
};

export function fadeUp(delay: number, duration = 0.3) {
  return {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration, ease: ease.gentle },
    },
  };
}

export const timelineFill = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { delay: 0.38, duration: 0.45, ease: ease.gentle },
  },
};

export const timelineDot = {
  hidden: { left: "0%" },
  visible: {
    left: ["0%", "25%", "50%", "75%", "100%"],
    transition: {
      delay: 0.38,
      duration: 0.55,
      times: [0, 0.25, 0.5, 0.75, 1],
      ease: "easeInOut",
    },
  },
};
