"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    function onOnline() { setOffline(false); }
    function onOffline() { setOffline(true); }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[var(--z-toast)] bg-destructive text-white px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium">
      <WifiOff size={14} className="shrink-0" />
      <span>You are offline. Some features may be unavailable.</span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 underline underline-offset-2 hover:no-underline font-semibold flex items-center gap-1"
      >
        <Wifi size={14} /> Retry
      </button>
    </div>
  );
}
