"use client";

import { useCallback, useState } from "react";

export type GeolocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported";

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export interface UseGeolocationReturn {
  status: GeolocationStatus;
  coords: GeolocationResult | null;
  errorMessage: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  "User denied Geolocation":
    "Location permission was denied. You can still continue with a manual location.",
  "Position unavailable":
    "Your location is temporarily unavailable. Please enter a location manually.",
  "Timeout expired":
    "We couldn't get your location in time. Please try again or enter it manually.",
};

/**
 * Browser GPS helper for report forms.
 *
 * Never required — callers must keep manual entry as the fallback. Handles
 * permission granted (coords populated), denied, unavailable, timeout, and
 * unsupported states without throwing.
 */
export function useGeolocation(): UseGeolocationReturn {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [coords, setCoords] = useState<GeolocationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      setErrorMessage("Geolocation isn't supported by this browser.");
      return;
    }

    setStatus("loading");
    setCoords(null);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setStatus("granted");
      },
      (error) => {
        const message = ERROR_MESSAGES[error.message] ?? error.message;
        setStatus(
          error.code === error.PERMISSION_DENIED
            ? "denied"
            : error.code === error.POSITION_UNAVAILABLE
              ? "unavailable"
              : error.code === error.TIMEOUT
                ? "timeout"
                : "unavailable"
        );
        setErrorMessage(message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setStatus("idle");
    setCoords(null);
    setErrorMessage(null);
  }, []);

  return { status, coords, errorMessage, requestLocation, clearLocation };
}