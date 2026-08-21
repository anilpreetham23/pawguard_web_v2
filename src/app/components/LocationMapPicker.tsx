"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, LocateFixed, Search, Check, RefreshCw, X, AlertCircle } from "lucide-react";
import { Button, Input, Card, Badge } from "./pawguard";
import { useGeolocation } from "../hooks/useGeolocation";
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

export function LocationMapPicker({
  kind,
  locationAddress,
  latitude,
  longitude,
  onChange,
}: LocationMapPickerProps) {
  const isLost = kind === "lost";
  const locationLabel = isLost ? "Last Seen Location" : "Found Location";

  const [mode, setMode] = useState<"none" | "gps" | "map">(
    latitude && longitude ? "map" : "none"
  );

  const [mapLat, setMapLat] = useState<number>(
    latitude ? parseFloat(latitude) : DEFAULT_LAT
  );
  const [mapLng, setMapLng] = useState<number>(
    longitude ? parseFloat(longitude) : DEFAULT_LNG
  );
  const [zoom, setZoom] = useState<number>(14);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const { status: gpsStatus, coords: gpsCoords, requestLocation: requestGpsLocation } = useGeolocation();

  // Reverse-geocode coordinates to human-readable address
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsGeocoding(true);
      setMapError(null);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { headers: { "User-Agent": "PawGuardWeb/1.0" } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            // Extract clean short address (street, suburb, city, state)
            const parts = data.display_name.split(", ");
            const shortAddr = parts.slice(0, Math.min(4, parts.length)).join(", ");
            onChange({
              locationAddress: shortAddr,
              latitude: lat.toFixed(6),
              longitude: lng.toFixed(6),
            });
            return;
          }
        }
      } catch (err) {
        console.warn("Reverse geocode error:", err);
      } finally {
        setIsGeocoding(false);
      }

      // Fallback if reverse geocode fails or returns empty
      onChange({
        locationAddress: locationAddress || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      });
    },
    [locationAddress, onChange]
  );

  // Sync GPS results when requested
  useEffect(() => {
    if (gpsStatus === "granted" && gpsCoords) {
      setMapLat(gpsCoords.latitude);
      setMapLng(gpsCoords.longitude);
      setMode("gps");
      reverseGeocode(gpsCoords.latitude, gpsCoords.longitude);
    }
  }, [gpsStatus, gpsCoords, reverseGeocode]);

  // Handle map search query
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setMapError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=4`,
        { headers: { "User-Agent": "PawGuardWeb/1.0" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSearchResults(data);
        } else {
          setMapError("No locations found for that search. Try another query or click the map directly.");
          setSearchResults([]);
        }
      }
    } catch (err) {
      setMapError("Location search unavailable. You can click anywhere on the map to set the pin.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setMapLat(lat);
    setMapLng(lng);
    setSearchResults([]);
    setSearchQuery("");
    const parts = item.display_name.split(", ");
    const shortAddr = parts.slice(0, Math.min(4, parts.length)).join(", ");
    onChange({
      locationAddress: shortAddr,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    });
  };

  // Convert lat/lng coordinates to OpenStreetMap static tile parameters
  const tileX = Math.floor(((mapLng + 180) / 360) * Math.pow(2, zoom));
  const tileY = Math.floor(
    ((1 -
      Math.log(
        Math.tan((mapLat * Math.PI) / 180) + 1 / Math.cos((mapLat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Approximate lat/lng delta based on click offset from map center
    const deltaLng = ((clickX - width / 2) / width) * (360 / Math.pow(2, zoom));
    const deltaLat = -((clickY - height / 2) / height) * (180 / Math.pow(2, zoom));

    const newLat = Math.max(-85, Math.min(85, mapLat + deltaLat));
    const newLng = Math.max(-180, Math.min(180, mapLng + deltaLng));

    setMapLat(newLat);
    setMapLng(newLng);
    reverseGeocode(newLat, newLng);
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
                Lat: {parseFloat(latitude).toFixed(4)}, Lng: {parseFloat(longitude).toFixed(4)}
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
          onClick={() => {
            setMode("gps");
            requestGpsLocation();
          }}
          disabled={gpsStatus === "loading"}
          className="w-full justify-center h-11 text-xs"
        >
          <LocateFixed size={16} />
          {gpsStatus === "loading" ? "Locating Current Position…" : "Use Current Location"}
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

      {gpsStatus === "denied" && mode === "gps" && (
        <p className="text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-btn p-3 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          Location permission was denied. Please select the location on the map below or type the address manually.
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
              Click anywhere on the map to pin the {isLost ? "last seen" : "found"} location.
            </span>
          </div>

          {/* Map Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 relative w-full">
            <Input
              type="text"
              placeholder="Search area, landmark, or city (e.g. Indiranagar, Bengaluru)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 text-xs flex-1"
            />
            <Button type="submit" variant="outline" size="sm" isLoading={isSearching} className="shrink-0 px-4 h-10">
              <Search size={14} />
              Search
            </Button>
          </form>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-card border border-border rounded-btn shadow-lg overflow-hidden flex flex-col divide-y divide-border z-10">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSearchResult(item)}
                  className="p-3 text-left hover:bg-muted text-xs text-foreground transition-colors flex items-start gap-2"
                >
                  <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {mapError && (
            <p className="text-destructive text-xs bg-destructive/10 p-2.5 rounded-btn">{mapError}</p>
          )}

          {/* Canvas Tile Interactive Map Viewport */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[260px] bg-slate-900 rounded-lg overflow-hidden border border-border cursor-crosshair select-none group">
            {/* OpenStreetMap Tile Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300 opacity-90 group-hover:opacity-100"
              style={{
                backgroundImage: `url('https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png')`,
                backgroundSize: "cover",
              }}
              onClick={handleMapClick}
            />

            {/* Grid Overlay for Visual Polish */}
            <div className="absolute inset-0 bg-slate-950/20 backdrop-brightness-95 pointer-events-none" />

            {/* Map Controls (Zoom In / Out) */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(18, z + 1))}
                className="w-8 h-8 rounded-btn bg-background/90 backdrop-blur border border-border text-foreground font-bold flex items-center justify-center shadow-sm hover:bg-card transition-colors text-sm"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(3, z - 1))}
                className="w-8 h-8 rounded-btn bg-background/90 backdrop-blur border border-border text-foreground font-bold flex items-center justify-center shadow-sm hover:bg-card transition-colors text-sm"
                aria-label="Zoom out"
              >
                -
              </button>
            </div>

            {/* Interactive Pin Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20 animate-bounce-short">
              <div className="bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <MapPin size={12} />
                {locationLabel}
              </div>
              <div className="w-0.5 h-3 bg-primary shadow-md" />
              <div className="w-3 h-1.5 bg-primary/40 rounded-full blur-[1px]" />
            </div>

            {/* Map Instruction Prompt */}
            <div className="absolute top-3 left-3 bg-background/90 backdrop-blur border border-border rounded-btn px-3 py-1.5 text-[11px] font-medium text-foreground shadow-sm pointer-events-none">
              {isGeocoding ? "Resolving location address…" : "Click anywhere on map to update pin"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
