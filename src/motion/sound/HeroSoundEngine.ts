import { useEffect, useRef, useCallback, useMemo } from "react";
import { useMotionStore } from "../motion-store";

/**
 * HeroSoundEngine — sound architecture readiness for the Hero section.
 *
 * Sound events mapped to hero interactions:
 *   - click:button:primary   → "rescue_dispatch" (crisp, urgent)
 *   - click:button:secondary → "warm_paw" (soft, hopeful)
 *   - click:button:tertiary  → "gentle_heart" (subtle, inviting)
 *   - hover:cta              → "subtle_woof" (barely audible)
 *   - enter:hero             → "ambient_wind" (slow fade in)
 *   - scroll:reveal          → "paper_rustle" (per section)
 *   - typewriter:tick        → "typewriter_key" (per character)
 *   - rescue:dispatched      → "success_chime" (on emergency CTA success)
 *   - adoption:complete      → "celebration_chime" (on adopt success)
 *   - volunteer:joined       → "warm_chime" (on volunteer success)
 *
 * Architecture:
 *   - Web Audio API for low-latency playback
 *   - AudioContext resumed on first user interaction
 *   - Master volume controlled by user preference
 *   - Reduced motion = reduced sound
 *   - Mobile: audio context suspended until interaction
 *   - All sounds are synthetic (Web Audio oscillators) — no network requests
 */

export type HeroSoundEvent =
  | "click:button:primary"
  | "click:button:secondary"
  | "click:button:tertiary"
  | "hover:cta"
  | "enter:hero"
  | "scroll:reveal"
  | "typewriter:tick"
  | "rescue:dispatched"
  | "adoption:complete"
  | "volunteer:joined";

interface SoundPreset {
  type: OscillatorType;
  frequency: number | number[];
  duration: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  gain: number;
  filter?: { type: BiquadFilterType; frequency: number; Q: number };
}

const SOUND_PRESETS: Record<HeroSoundEvent, SoundPreset> = {
  "click:button:primary": {
    type: "square",
    frequency: [440, 330, 220],
    duration: 0.35,
    attack: 0.005,
    decay: 0.1,
    sustain: 0.2,
    release: 0.15,
    gain: 0.15,
    filter: { type: "lowpass", frequency: 2000, Q: 2 },
  },
  "click:button:secondary": {
    type: "sine",
    frequency: [523, 659, 784],
    duration: 0.4,
    attack: 0.01,
    decay: 0.15,
    sustain: 0.3,
    release: 0.2,
    gain: 0.12,
    filter: { type: "lowpass", frequency: 3000, Q: 1.5 },
  },
  "click:button:tertiary": {
    type: "triangle",
    frequency: [392, 494],
    duration: 0.3,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.25,
    release: 0.2,
    gain: 0.08,
    filter: { type: "lowpass", frequency: 2500, Q: 1 },
  },
  "hover:cta": {
    type: "sine",
    frequency: 660,
    duration: 0.08,
    attack: 0.002,
    decay: 0.05,
    sustain: 0,
    release: 0.03,
    gain: 0.04,
    filter: { type: "highpass", frequency: 1000, Q: 0.5 },
  },
  "enter:hero": {
    type: "sawtooth",
    frequency: [110, 165, 220],
    duration: 2.0,
    attack: 0.5,
    decay: 0.8,
    sustain: 0.15,
    release: 0.7,
    gain: 0.06,
    filter: { type: "lowpass", frequency: 400, Q: 1 },
  },
  "scroll:reveal": {
    type: "triangle",
    frequency: 880,
    duration: 0.25,
    attack: 0.01,
    decay: 0.1,
    sustain: 0,
    release: 0.15,
    gain: 0.05,
    filter: { type: "bandpass", frequency: 1500, Q: 2 },
  },
  "typewriter:tick": {
    type: "square",
    frequency: 1200,
    duration: 0.04,
    attack: 0.001,
    decay: 0.02,
    sustain: 0,
    release: 0.015,
    gain: 0.03,
    filter: { type: "highpass", frequency: 2000, Q: 3 },
  },
  "rescue:dispatched": {
    type: "sine",
    frequency: [523, 659, 784, 1047],
    duration: 0.8,
    attack: 0.02,
    decay: 0.2,
    sustain: 0.3,
    release: 0.4,
    gain: 0.18,
    filter: { type: "lowpass", frequency: 4000, Q: 2 },
  },
  "adoption:complete": {
    type: "triangle",
    frequency: [523, 659, 784, 1047, 1319],
    duration: 1.0,
    attack: 0.02,
    decay: 0.15,
    sustain: 0.4,
    release: 0.5,
    gain: 0.15,
    filter: { type: "lowpass", frequency: 5000, Q: 1.5 },
  },
  "volunteer:joined": {
    type: "sine",
    frequency: [392, 494, 659],
    duration: 0.6,
    attack: 0.02,
    decay: 0.15,
    sustain: 0.25,
    release: 0.3,
    gain: 0.12,
    filter: { type: "lowpass", frequency: 3500, Q: 1.5 },
  },
};

export class HeroSoundEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private isMuted = false;
  private masterVolume = 0.5;
  private suspended = true;
  private eventQueue: HeroSoundEvent[] = [];
  private lastPlayTime = new Map<HeroSoundEvent, number>();

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;
      this.isInitialized = true;
    } catch (e) {
      console.warn("HeroSoundEngine: Web Audio API not available", e);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) return false;
    if (this.suspended && this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
        this.suspended = false;
      } catch {
        return false;
      }
    }
    return this.audioContext.state === "running";
  }

  private playTone(preset: SoundPreset, delay = 0) {
    if (!this.audioContext || !this.masterGain || this.isMuted) return;

    const now = this.audioContext.currentTime + delay;
    const freqArray = Array.isArray(preset.frequency) ? preset.frequency : [preset.frequency];

    freqArray.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();

      osc.type = preset.type;
      osc.frequency.value = freq;

      filter.type = preset.filter?.type ?? "lowpass";
      filter.frequency.value = preset.filter?.frequency ?? 2000;
      filter.Q.value = preset.filter?.Q ?? 1;

      const nowTime = this.audioContext!.currentTime + delay + i * 0.02;
      const attack = preset.attack;
      const decay = preset.decay;
      const sustain = preset.sustain;
      const release = preset.release;
      const dur = preset.duration;
      const peakGain = preset.gain;

      gain.gain.setValueAtTime(0, nowTime);
      gain.gain.linearRampToValueAtTime(peakGain, nowTime + attack);
      gain.gain.linearRampToValueAtTime(peakGain * sustain, nowTime + attack + decay);
      gain.gain.setValueAtTime(peakGain * sustain, nowTime + dur - release);
      gain.gain.linearRampToValueAtTime(0, nowTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(nowTime);
      osc.stop(nowTime + dur + 0.05);
    });
  }

  play(event: HeroSoundEvent) {
    if (!this.isInitialized) return;
    this.ensureAudioContext().then((ready) => {
      if (ready) {
        const preset = SOUND_PRESETS[event];
        if (preset) {
          // Debounce rapid repeated events
          const now = Date.now();
          const last = this.lastPlayTime.get(event) ?? 0;
          if (now - last < 50) return;
          this.lastPlayTime.set(event, now);
          this.playTone(preset);
        }
      }
    });
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  mute() {
    this.isMuted = true;
  }

  unmute() {
    this.isMuted = false;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getVolume(): number {
    return this.masterVolume;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instance
let soundEngineInstance: HeroSoundEngine | null = null;

export function getHeroSoundEngine(): HeroSoundEngine {
  if (!soundEngineInstance) {
    soundEngineInstance = new HeroSoundEngine();
  }
  return soundEngineInstance;
}

// React hook for using sound in components
export function useHeroSound() {
  const engineRef = useRef<HeroSoundEngine | null>(null);
  const motionTier = useMotionStore((s) => s.motionTier);
  const reducedMotion = useMotionStore((s) => s.reducedMotion);

  useEffect(() => {
    engineRef.current = getHeroSoundEngine();
    return () => {
      // Engine is singleton, don't destroy
    };
  }, []);

  const play = useCallback((event: HeroSoundEvent) => {
    if (reducedMotion || motionTier !== "full") return;
    engineRef.current?.play(event);
  }, [reducedMotion, motionTier]);

  return { play, engine: engineRef.current };
}

// Auto-initialize on first user interaction
if (typeof window !== "undefined") {
  const initOnInteraction = () => {
    getHeroSoundEngine();
    window.removeEventListener("click", initOnInteraction);
    window.removeEventListener("keydown", initOnInteraction);
    window.removeEventListener("touchstart", initOnInteraction);
  };
  window.addEventListener("click", initOnInteraction, { once: true, passive: true });
  window.addEventListener("keydown", initOnInteraction, { once: true, passive: true });
  window.addEventListener("touchstart", initOnInteraction, { once: true, passive: true });
}