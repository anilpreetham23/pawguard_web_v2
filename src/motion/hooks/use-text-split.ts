import { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import { getMotionTier } from "../motion.utils";
import { useMotionStore } from "../motion-store";

interface SplitResult {
  words: HTMLElement[] | null;
  chars: HTMLElement[] | null;
  lines: HTMLElement[] | null;
}

export function useTextSplit(target: React.RefObject<HTMLElement | null>, types: ("lines" | "words" | "chars")[] = ["words"]) {
  const instanceRef = useRef<SplitType | null>(null);
  const tier = useMotionStore((s) => s.motionTier);
  const [result, setResult] = useState<SplitResult>({ words: null, chars: null, lines: null });

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const effectiveTier = getMotionTier(tier);
    if (effectiveTier === "none") return;

    const instance = new SplitType(el, { types });
    instanceRef.current = instance;

    setResult({
      words: instance.words ?? null,
      chars: instance.chars ?? null,
      lines: instance.lines ?? null,
    });

    return () => {
      instance.revert();
      instanceRef.current = null;
    };
  }, [target, types.join(","), tier]);

  return result;
}
