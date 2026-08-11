import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

export function isLenisActive(): boolean {
  return lenis !== null;
}
