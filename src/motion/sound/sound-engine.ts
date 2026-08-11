/**
 * SoundEngine — fully synthesized ambience + UI sounds, no audio files.
 *
 * A single WebAudio graph drives everything:
 *   - a soft wind bed (looped, filtered noise with a slow gain LFO)
 *   - occasional birdsong chirps and leaf rustles, self-scheduling
 *   - one-shot blips for UI (chime, collar jingle, heartbeat, click)
 *
 * The AudioContext is created lazily inside a user gesture (autoplay rules)
 * and suspended while sound is off so it costs nothing in the background.
 */

export type SoundName = "chime" | "jingle" | "heartbeat" | "click" | "chirp" | "rustle";

const STORAGE_KEY = "pawguard:sound";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

class SoundEngine {
  private static _instance: SoundEngine;
  static get instance(): SoundEngine {
    return (this._instance ??= new SoundEngine());
  }

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private ambientTimer: number | null = null;
  private enabled = false;

  get isEnabled(): boolean {
    return this.enabled;
  }

  /** Create/resume the context. Must run inside a user gesture. */
  unlock(): void {
    try {
      this.ensure();
    } catch {
      /* audio stays off */
    }
  }

  private ensure(): AudioContext {
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      this.noise = this.makeNoise(this.ctx, 2);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private makeNoise(ctx: AudioContext, seconds: number): AudioBuffer {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** Flip the ambient bed on/off. Returns the new state. */
  toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) this.start();
    else this.stop();
    return this.enabled;
  }

  /** Turn the ambience on (also used on first user gesture when sound was saved on). */
  start(): void {
    this.enabled = true;
    try {
      const ctx = this.ensure();
      this.startWind(ctx);
      this.scheduleAmbient(ctx);
    } catch {
      this.enabled = false;
    }
  }

  /** Turn everything off and let the browser suspend the context. */
  stop(): void {
    this.enabled = false;
    this.stopWind();
    this.clearAmbient();
    if (this.ctx && this.ctx.state === "running") void this.ctx.suspend();
  }

  private startWind(ctx: AudioContext): void {
    if (this.windSource || !this.noise) return;

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 260;
    filter.Q.value = 0.4;

    const g = ctx.createGain();
    g.gain.value = 0;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.master!);

    const t0 = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 2.5);

    src.start();
    lfo.start();

    this.windSource = src;
    this.windLfo = lfo;
  }

  private stopWind(): void {
    try {
      this.windSource?.stop();
      this.windLfo?.stop();
    } catch {
      /* already stopped */
    }
    this.windSource = null;
    this.windLfo = null;
  }

  private scheduleAmbient(ctx: AudioContext): void {
    const tick = () => {
      if (!this.enabled || !this.ctx) return;
      try {
        if (Math.random() < 0.5) this.playChirp(ctx);
        else this.playRustle(ctx);
      } catch {
        /* keep the loop alive */
      }
      this.ambientTimer = window.setTimeout(tick, 4500 + Math.random() * 9000);
    };
    this.ambientTimer = window.setTimeout(tick, 3000 + Math.random() * 4500);
  }

  private clearAmbient(): void {
    if (this.ambientTimer !== null) {
      window.clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  /** One-shot sound, only if the ambience is live. */
  play(name: SoundName): void {
    if (!this.enabled || !this.ctx) return;
    try {
      switch (name) {
        case "chime":
          this.playChime(this.ctx);
          break;
        case "jingle":
          this.playJingle(this.ctx);
          break;
        case "heartbeat":
          this.playHeartbeat(this.ctx);
          break;
        case "click":
          this.playClick(this.ctx);
          break;
        case "chirp":
          this.playChirp(this.ctx);
          break;
        case "rustle":
          this.playRustle(this.ctx);
          break;
      }
    } catch {
      /* never let sound break the UI */
    }
  }

  private playChirp(ctx: AudioContext): void {
    const t0 = ctx.currentTime;
    const notes = 2 + Math.floor(Math.random() * 2);
    const base = 2400 + Math.random() * 1600;
    for (let i = 0; i < notes; i += 1) {
      const t = t0 + i * 0.09;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(base + Math.random() * 300, t);
      o.frequency.exponentialRampToValueAtTime(base - 200 + Math.random() * 400, t + 0.07);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.03, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g);
      g.connect(this.master!);
      o.start(t);
      o.stop(t + 0.1);
    }
  }

  private playRustle(ctx: AudioContext): void {
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise!;
    src.loop = false;
    src.playbackRate.value = 0.6 + Math.random() * 0.8;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 900 + Math.random() * 1200;
    f.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.03, t0 + 0.12);
    g.gain.linearRampToValueAtTime(0.0001, t0 + 0.4 + Math.random() * 0.3);
    src.connect(f);
    f.connect(g);
    g.connect(this.master!);
    src.start(t0);
    src.stop(t0 + 0.8);
  }

  private playChime(ctx: AudioContext): void {
    const t0 = ctx.currentTime;
    for (const [freq, dt] of [
      [660, 0],
      [880, 0.1],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(0.07, t0 + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.7);
      o.connect(g);
      g.connect(this.master!);
      o.start(t0 + dt);
      o.stop(t0 + dt + 0.8);
    }
  }

  private playJingle(ctx: AudioContext): void {
    const t0 = ctx.currentTime;
    for (const [freq, dt, vol] of [
      [2093, 0, 0.09],
      [2793, 0.02, 0.05],
      [1760, 0.05, 0.04],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(vol, t0 + dt + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.45);
      o.connect(g);
      g.connect(this.master!);
      o.start(t0 + dt);
      o.stop(t0 + dt + 0.5);
    }
  }

  private playHeartbeat(ctx: AudioContext): void {
    const t0 = ctx.currentTime;
    for (const [dt, vol] of [
      [0, 0.5],
      [0.35, 0.32],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(72, t0 + dt);
      o.frequency.exponentialRampToValueAtTime(42, t0 + dt + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(vol * 0.06, t0 + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.14);
      o.connect(g);
      g.connect(this.master!);
      o.start(t0 + dt);
      o.stop(t0 + dt + 0.16);
    }
  }

  private playClick(ctx: AudioContext): void {
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = 1500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.04, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
    o.connect(g);
    g.connect(this.master!);
    o.start(t0);
    o.stop(t0 + 0.07);
  }
}

export { readStored, SoundEngine };
