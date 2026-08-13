"use client";

import { useCallback, useEffect, useState } from "react";

export interface FavoriteDog {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  emoji?: string;
  tone?: string;
  savedAt: number;
}

const STORAGE_KEY = "pawguard.favorite-dogs";

function readFavorites(): FavoriteDog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteDog[];
    return Array.isArray(parsed) ? parsed.filter((d) => d && typeof d.id === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(list: FavoriteDog[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode / quota) — favorites are best-effort */
  }
}

/**
 * Client-side "saved dogs" store persisted in `localStorage`. The backend has
 * no favorites endpoint, so this is intentionally browser-local; the payload is
 * a display snapshot (`name`, `breed`, `age`, `gender`, placeholder art) that
 * keeps the saved-dogs view meaningful even after a dog's availability changes.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteDog[]>(() => readFavorites());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorited = useCallback(
    (id: string) => favorites.some((d) => d.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((dog: Omit<FavoriteDog, "savedAt">) => {
    setFavorites((prev) => {
      const next = prev.some((d) => d.id === dog.id)
        ? prev.filter((d) => d.id !== dog.id)
        : [...prev, { ...dog, savedAt: Date.now() }];
      writeFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((d) => d.id !== id);
      writeFavorites(next);
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    writeFavorites([]);
  }, []);

  return { favorites, isFavorited, toggleFavorite, removeFavorite, clearFavorites };
}