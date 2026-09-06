"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, LocateFixed, Search, Check, RefreshCw, AlertCircle } from "lucide-react";
import { Button, Input, Card, Badge } from "./pawguard";
import type { LostFoundKind } from "@/types";

interface LocationMapPickerProps {
  kind: LostFoundKind;
  locationAddress: string;
  latitude: string;
  longitude: string;
  onChange: (vals: { locationAddress: string; latitude: string; longitude: string }) => void;
}

// Default fallback center coordinates (Bengaluru, India)
const DEFAULT_LAT = 12.9716;
const DEFAULT_LNG = 77.5946;

function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject("Window undefined");
  if ((window as any).L) return Promise.resolve((window as any).L);

  return new Promise((resolve, reject) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById("leaflet-js") as HTMLScriptElement;
    if (existingScript) {
      if ((window as any).L) {
        resolve((window as any).L);
      } else {
        existingScript.addEventListener("load", () => resolve((window as any).L));
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve((window as any).L);
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

export function LocationMapPicker({
  kind,
  locationAddress,
  latitude,
  longitude,
  onChange,
}: LocationMapPickerProps) {
  const isLost = kind === "lost";
  const locationLabel = isLost ? "Last Seen Location" : "Found Location";

  const [mode, setMode] = useState<"none" | "gps" | "map">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  // Parse current coordinates or use default
  const currentLat = latitude ? parseFloat(latitude) : DEFAULT_LAT;
  const currentLng = longitude ? parseFloat(longitude) : DEFAULT_LNG;

  // Reverse-geocode coordinates to human-readable address
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsGeocoding(true);
      setMapError(null);
      const latStr = lat.toFixed(6);
      const lngStr = lng.toFixed(6);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { headers: { "User-Agent": "PawGuard-PublicWeb/1.0" } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(", ");
            const shortAddr = parts.slice(0, Math.min(4, parts.length)).join(", ");
            onChange({
              locationAddress: shortAddr,
              latitude: latStr,
              longitude: lngStr,
            });
            return;
          }
        }
      } catch (err) {
        console.warn("Reverse geocode error:", err);
      } finally {
        setIsGeocoding(false);
      }

      // Fallback if reverse geocode fails
      onChange({
        locationAddress: locationAddress || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        latitude: latStr,
        longitude: lngStr,
      });
    },
    [locationAddress, onChange]
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (mode !== "map") return;
    let isMounted = true;

    loadLeaflet()
      .then((L) => {
        if (!isMounted || !mapContainerRef.current) return;

        // Clean up previous map if container was re-rendered
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          markerInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [currentLat, currentLng],
          zoom: 15,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Custom SVG Marker Icon
        const customMarkerIcon = L.divIcon({
          className: "custom-pawguard-marker",
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: none;">
              <div style="background-color: ${isLost ? '#ef4444' : '#0284c7'}; color: white; border-radius: 9999px; padding: 4px 10px; font-size: 11px; font-weight: bold; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${locationLabel}</span>
              </div>
              <div style="width: 2px; height: 10px; background-color: ${isLost ? '#ef4444' : '#0284c7'};"></div>
              <div style="width: 10px; height: 4px; background-color: rgba(0,0,0,0.25); border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([currentLat, currentLng], { icon: customMarkerIcon }).addTo(map);

        // Handle map click
        map.on("click", (e: any) => {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          marker.setLatLng([lat, lng]);
          reverseGeocode(lat, lng);
        });

        mapInstanceRef.current = map;
        markerInstanceRef.current = marker;

        // Force recalculation of tile layout
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);
      })
      .catch((err) => {
        console.error("Leaflet load error:", err);
        setMapError("Failed to load map engine. Please check network connection.");
      });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, [mode]);

  // Update marker position if latitude/longitude change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerInstanceRef.current && latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstanceRef.current.setView([lat, lng], 15);
        markerInstanceRef.current.setLatLng([lat, lng]);
      }
    }
  }, [latitude, longitude]);

  // Handle Nominatim location search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setMapError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=1`,
        { headers: { "User-Agent": "PawGuard-PublicWeb/1.0" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          const latStr = lat.toFixed(6);
          const lngStr = lng.toFixed(6);

          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 15);
            markerInstanceRef.current.setLatLng([lat, lng]);
          }

          const parts = (result.display_name || "").split(", ");
          const shortAddr = parts.slice(0, Math.min(4, parts.length)).join(", ");

          onChange({
            locationAddress: shortAddr || result.display_name,
            latitude: latStr,
            longitude: lngStr,
          });
          setSearchQuery("");
        } else {
          setMapError("No location found for that search query. Try another landmark or city.");
        }
      } else {
        setMapError("Location search service unavailable. Click directly on the map to place the pin.");
      }
    } catch (err) {
      setMapError("Location search failed. Click directly on the map to place the pin.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle GPS Current Location
  const handleUseGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setMapError("Geolocation is not supported by your browser.");
      return;
    }

    setIsGpsLoading(true);
    setMapError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMode("map");

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerInstanceRef.current.setLatLng([lat, lng]);
        }

        reverseGeocode(lat, lng);
      },
      (err) => {
        setIsGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setMapError("Location permission denied. Please enable location access or click on the map.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setMapError("Location information unavailable. Please select your location on the map.");
        } else if (err.code === err.TIMEOUT) {
          setMapError("Location request timed out. Please try again or select on the map.");
        } else {
          setMapError("Could not retrieve current location. Please select on the map.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const hasSelectedLocation = Boolean(latitude && longitude);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <label className="text-foreground text-xs font-bold tracking-wider uppercase font-condensed flex items-center gap-1.5">
          <MapPin size={15} className="text-primary" />
          {isLost ? "LAST SEEN LOCATION" : "FOUND LOCATION"} <span className="text-destructive">*</span>
        </label>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {isLost
            ? "Specify where the pet was last seen so community members and volunteers can search the correct area."
            : "Specify the exact location where you found the animal so the owner can recognize their pet's location."}
        </p>
      </div>

      {/* Selected Location Banner Card */}
      {hasSelectedLocation && (
        <Card variant="elevated" className="p-4 bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-foreground font-bold text-sm leading-snug">
                  {locationLabel}
                </span>
                <Badge variant="success" className="gap-1 text-[10px] px-2 py-0.5">
                  <Check size={10} /> Location Pinned
                </Badge>
              </div>
              <p className="text-foreground/90 font-medium text-xs mt-0.5 line-clamp-2">
                {locationAddress || "Coordinates selected on map"}
              </p>
              <p className="text-muted-foreground text-[11px] font-mono mt-0.5">
                Lat: {parseFloat(latitude).toFixed(6)}, Lng: {parseFloat(longitude).toFixed(6)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === "map" ? "none" : "map")}
            className="shrink-0 self-start sm:self-center"
          >
            <RefreshCw size={13} />
            Change Location
          </Button>
        </Card>
      )}

      {/* Location Source Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <Button
          type="button"
          variant={mode === "gps" ? "primary" : "outline"}
          size="md"
          onClick={handleUseGps}
          disabled={isGpsLoading}
          className="w-full justify-center h-11 text-xs"
        >
          <LocateFixed size={16} />
          {isGpsLoading ? "Locating Current Position…" : "Use Current Location"}
        </Button>

        <Button
          type="button"
          variant={mode === "map" ? "primary" : "outline"}
          size="md"
          onClick={() => setMode("map")}
          className="w-full justify-center h-11 text-xs"
        >
          <MapPin size={16} />
          {isLost ? "Select Last Seen Location on Map" : "Select Found Location on Map"}
        </Button>
      </div>

      {mapError && (
        <p className="text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-btn p-3 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          {mapError}
        </p>
      )}

      {/* Interactive Map Section */}
      {mode === "map" && (
        <div className="flex flex-col gap-3 p-4 bg-card border border-border rounded-card shadow-sm animate-fade-in w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed">
              Interactive Map ({locationLabel})
            </span>
            <span className="text-muted-foreground text-xs">
              Click anywhere on the map or search to pin location.
            </span>
          </div>

          {/* Map Search Form Control */}
          <div className="flex gap-2 relative w-full">
            <Input
              type="text"
              placeholder="Search area, landmark, or city (e.g. Indiranagar, Bengaluru)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch();
                }
              }}
              className="h-10 text-xs flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isSearching}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSearch();
              }}
              className="shrink-0 px-4 h-10"
            >
              <Search size={14} />
              Search
            </Button>
          </div>

          {/* Interactive Leaflet Map Container */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[280px] sm:min-h-[320px] rounded-lg overflow-hidden border border-border z-0 shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full min-h-[280px] sm:min-h-[320px] z-0" />
            {isGeocoding && (
              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur border border-border rounded-btn px-3 py-1.5 text-[11px] font-medium text-foreground shadow-sm pointer-events-none z-10 flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin text-primary" />
                Resolving address…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
