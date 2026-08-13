"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";
import { Button, Alert } from "../pawguard";
import { cn } from "../ui/utils";

interface QrScannerProps {
  /** Called once a QR code has been successfully decoded. */
  onDetected: (token: string) => void;
}

/**
 * Lightweight browser QR scanner backed by `html5-qrcode`.
 * - Camera only starts after the user clicks "Scan with camera".
 * - Permission denial surfaces as a friendly error with guidance.
 * - Camera is stopped and resources released on unmount (no memory leaks).
 */
export default function QrScanner({ onDetected }: QrScannerProps) {
  const elementIdRef = useRef<string>(
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `qr-video-${crypto.randomUUID()}`
      : `qr-video-${Math.random().toString(36).slice(2)}`
  );
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [scanNotice, setScanNotice] = useState<string | null>(null);
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  const stopCamera = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner && scanner.isScanning) {
      try {
        await scanner.stop();
      } catch {
        // Camera already released by the browser — nothing to do.
      }
    }
    setIsActive(false);
    setIsStarting(false);
  }, []);

  // Release camera + DOM on unmount to avoid leaks / background recording.
  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, [stopCamera]);

  // Start/stop the actual scanner once the video element is mounted.
  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;

    async function run() {
      const element = document.getElementById(elementIdRef.current);
      if (!element) return;

      const scanner = new Html5Qrcode(elementIdRef.current, { verbose: false });
      scannerRef.current = scanner;

      try {
        setScanNotice("Requesting camera access…");
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const side = Math.min(
                250,
                viewfinderWidth * 0.8,
                viewfinderHeight * 0.8
              );
              return { width: side, height: side };
            },
          },
          (decodedText) => {
            setScanNotice("Code recognized — checking safety tag…");
            void stopCamera();
            onDetectedRef.current(decodedText.trim());
          },
          () => {
            // Per-frame "no code detected" — ignore.
          }
        );
        if (!cancelled) {
          setScanNotice(null);
          setIsStarting(false);
        }
      } catch (error) {
        if (cancelled) return;
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message: unknown }).message ?? "")
            : "";
        setPermissionError(formatCameraError(message));
        setScanNotice(null);
        setIsStarting(false);
        setIsActive(false);
      }
    }

    setIsStarting(true);
    setPermissionError(null);
    void run();

    return () => {
      cancelled = true;
      void stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  function requestScan() {
    setPermissionError(null);
    setScanNotice(null);
    setIsActive(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        id={elementIdRef.current}
        className={cn(
          "w-full max-w-[420px] aspect-square rounded-card overflow-hidden border border-border bg-card relative",
          isActive ? "block" : "hidden"
        )}
        aria-label="Camera QR scanner viewfinder"
      />

      {isActive ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => stopCamera()}
            className="inline-flex items-center gap-2 self-start text-destructive text-xs font-semibold uppercase tracking-wider font-condensed hover:opacity-80 transition-opacity"
          >
            <CameraOff size={14} />
            Stop camera
          </button>
          {isStarting && scanNotice && <Alert variant="info">{scanNotice}</Alert>}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={requestScan}
          className="self-start"
        >
          <Camera size={16} />
          Scan with camera
        </Button>
      )}

      {permissionError && <Alert variant="error">{permissionError}</Alert>}
    </div>
  );
}

function formatCameraError(message: string): string {
  if (/permission|NotAllowedError|denied/i.test(message)) {
    return "Camera permission was denied. You can still enter the safety-tag token manually below.";
  }
  if (/NotReadableError|in use/i.test(message)) {
    return "Your camera is already in use by another app. Close it and try again, or enter the token manually below.";
  }
  if (/NotFoundError|no camera/i.test(message)) {
    return "No camera was found on this device. You can still enter the safety-tag token manually below.";
  }
  return "We couldn't start the camera. Please check your browser supports camera scanning, or enter the token manually below.";
}