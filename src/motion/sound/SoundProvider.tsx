import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { readStored, SoundEngine, type SoundName } from "./sound-engine";

const STORAGE_KEY = "pawguard:sound";

interface SoundContextValue {
  soundOn: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

/**
 * Owns the singleton SoundEngine and the persisted user preference.
 * Sound stays off by default; if the user previously enabled it, we wait
 * for the first real gesture (pointer/keyboard) before starting the
 * ambience, because browsers require a gesture to create AudioContext.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState<boolean>(readStored);

  const unlock = useCallback(() => {
    try {
      SoundEngine.instance.unlock();
    } catch {
      /* audio stays off */
    }
  }, []);

  const toggle = useCallback(() => {
    unlock();
    const next = SoundEngine.instance.toggle();
    setSoundOn(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      /* private mode */
    }
  }, [unlock]);

  const play = useCallback((name: SoundName) => {
    SoundEngine.instance.play(name);
  }, []);

  // If saved on: start the ambience after the first real gesture.
  useEffect(() => {
    if (!soundOn) return;
    const start = () => {
      unlock();
      SoundEngine.instance.start();
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [soundOn, unlock]);

  // Never leak the ambience when the app unmounts (e.g. a full reload).
  useEffect(
    () => () => {
      SoundEngine.instance.stop();
    },
    [],
  );

  return <SoundContext.Provider value={{ soundOn, toggle, play }}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within a <SoundProvider>");
  return ctx;
}
