"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw } from "lucide-react";
import { Button, Alert } from "../pawguard";
import { cn } from "../ui/utils";

interface QrScannerProps {
  /** Called once a QR code has been successfully decoded. */
  onDetected: (token: string) => void;
}

/**
 * Robust browser QR scanner backed by `html5-qrcode`.
 * - `Html5Qrcode` is the sole owner of the camera stream (no competing pre-flight streams).
 * - Viewfinder container is mounted & bound via a stable React `containerRef`.
 * - Layout timing is synchronized with double `requestAnimationFrame` ticks so element bounds
 *   (`clientWidth` / `clientHeight`) are computed before `Html5Qrcode.start()` runs.
 * - Teardown executes `scanner.stop()` + `scanner.clear()` to prevent stream locks and memory leaks.
 */
export default function QrScanner({ onDetected }: QrScannerProps) {
  const elementIdRef = useRef<string>(
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `qr-video-${crypto.randomUUID()}`
      : `qr-video-${Math.random().toString(36).slice(2)}`
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);
  const cancelRequestedRef = useRef(false);

  const [isActive, setIsActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  const stopCamera = useCallback(async () => {
    cancelRequestedRef.current = true;
    const scanner = scannerRef.current;
    scannerRef.current = null;

    if (scanner) {
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
      } catch {
        // Stream already released or element cleared by browser
      }
    }

    isStartingRef.current = false;
    setIsActive(false);
    setIsStarting(false);
    setScanNotice(null);
  }, []);

  // Teardown camera stream on unmount to avoid background recording or memory leaks.
  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, [stopCamera]);

  const requestScan = useCallback(async () => {
    if (isStartingRef.current) return;

    // Reset state & flags
    setPermissionError(null);
    cancelRequestedRef.current = false;
    isStartingRef.current = true;

    setIsStarting(true);
    setIsActive(true); // Mount the viewfinder container DOM element
    setScanNotice("Requesting camera access…");

    // Wait 2 animation frames so React commits the container div in the DOM with valid dimensions
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    if (cancelRequestedRef.current) {
      isStartingRef.current = false;
      setIsActive(false);
      setIsStarting(false);
      setScanNotice(null);
      return;
    }

    // Verify container via stable React DOM ref
    const container = containerRef.current;
    const targetId = container?.id || elementIdRef.current;

    if (!container) {
      setPermissionError("Camera view container not ready. Please try again.");
      isStartingRef.current = false;
      setIsActive(false);
      setIsStarting(false);
      setScanNotice(null);
      return;
    }

    // Safely clear any previous scanner instance
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // Ignore previous cleanup errors
      }
      scannerRef.current = null;
    }

    const scanner = new Html5Qrcode(targetId, { verbose: false });
    scannerRef.current = scanner;

    setScanNotice("Starting camera preview…");

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const side = Math.min(
              260,
              Math.floor(viewfinderWidth * 0.8),
              Math.floor(viewfinderHeight * 0.8)
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
          // Per-frame scanning tick
        }
      );

      // Check if cancelled while start() was in flight (e.g. user clicked Stop or unmounted)
      if (cancelRequestedRef.current) {
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }
          scanner.clear();
        } catch {
          // Ignore
        }
        scannerRef.current = null;
        isStartingRef.current = false;
        setIsActive(false);
        setIsStarting(false);
        setScanNotice(null);
        return;
      }

      // Camera stream successfully acquired and rendering!
      setScanNotice(null);
      setIsStarting(false);
      isStartingRef.current = false;
    } catch (error) {
      const msg =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message ?? "")
          : String(error);

      // Clean up failed scanner instance
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
      } catch {
        // Ignore
      }
      scannerRef.current = null;

      isStartingRef.current = false;
      setIsStarting(false);
      setIsActive(false);
      setScanNotice(null);
      setPermissionError(formatCameraError(msg));
    }
  }, [stopCamera]);

  return (
    <div className="flex flex-col gap-4">
      {/* Viewfinder Container — attached via React DOM ref containerRef */}
      <div
        ref={containerRef}
        id={elementIdRef.current}
        className={cn(
          "w-full max-w-[420px] aspect-square rounded-card overflow-hidden border border-border bg-card relative min-h-[250px]",
          isActive || isStarting ? "block" : "hidden"
        )}
        aria-label="Camera QR scanner viewfinder"
      />

      {isActive || isStarting ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => void stopCamera()}
            className="inline-flex items-center gap-2 self-start text-destructive text-xs font-semibold uppercase tracking-wider font-condensed hover:opacity-80 transition-opacity"
          >
            <CameraOff size={14} />
            Stop camera
          </button>
          {isStarting && scanNotice && <Alert variant="info">{scanNotice}</Alert>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => void requestScan()}
              className="self-start"
            >
              <Camera size={16} />
              {permissionError ? "Try Camera Again" : "Scan with camera"}
            </Button>
            {permissionError && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => void requestScan()}
                className="text-xs text-primary"
              >
                <RefreshCw size={14} className="mr-1.5" />
                Retry Camera
              </Button>
            )}
          </div>
          <p className="text-2xs text-muted-foreground">
            Camera access is required to scan a Safety Tag directly from your browser.
          </p>
        </div>
      )}

      {permissionError && <Alert variant="error">{permissionError}</Alert>}
    </div>
  );
}

function formatCameraError(message: string): string {
  if (/permission|NotAllowedError|denied|PermissionDenied/i.test(message)) {
    return "Camera permission was denied. Please allow camera access in your browser settings and click 'Try Camera Again', or enter the token manually below.";
  }
  if (/NotReadableError|in use|Could not start video source/i.test(message)) {
    return "Your camera is currently in use by another application or browser tab. Close it and click 'Try Camera Again', or enter the token manually below.";
  }
  if (/NotFoundError|no camera|DevicesNotFoundError/i.test(message)) {
    return "No camera was found on this device. You can enter the safety-tag token manually below.";
  }
  return "Unable to start camera stream. Please check browser permissions and click 'Try Camera Again', or enter the token manually below.";
}