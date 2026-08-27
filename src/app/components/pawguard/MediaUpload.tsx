"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  X,
  Check,
  Image as ImageIcon,
  Video as VideoIcon,
  AlertCircle,
  Film,
  Plus,
  Loader2,
  Star,
} from "lucide-react";
import { Button, Card, Badge } from "./";

export interface MediaItem {
  id: string;
  file: File;
  previewUrl: string;
  type: "photo" | "video";
  name: string;
  sizeBytes: number;
  dataUrl?: string;
  uploadedUrl?: string;
  objectKey?: string;
}

export interface MediaUploadProps {
  label?: string;
  required?: boolean;
  maxPhotos?: number;
  maxVideos?: number;
  photos?: MediaItem[];
  video?: MediaItem | null;
  isUploading?: boolean;
  onChangePhotos?: (photos: MediaItem[]) => void;
  onChangeVideo?: (video: MediaItem | null) => void;
  /** Primary single photo callback for legacy/primary image API field binding */
  onPrimaryPhotoChange?: (file: File | null, dataUrl: string) => void;
  error?: string;
}

export function MediaUpload({
  label = "Evidence Photos & Video",
  required = true,
  maxPhotos = 5,
  maxVideos = 1,
  photos = [],
  video = null,
  isUploading = false,
  onChangePhotos,
  onChangeVideo,
  onPrimaryPhotoChange,
  error,
}: MediaUploadProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(p.previewUrl);
        }
      });
      if (video?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(video.previewUrl);
      }
    };
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setValidationError(null);
    if (!selectedFiles.length) return;

    if (photos.length + selectedFiles.length > maxPhotos) {
      setValidationError(`You can upload up to ${maxPhotos} photos.`);
      if (photoInputRef.current) photoInputRef.current.value = "";
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const newItems: MediaItem[] = [];

    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type.toLowerCase())) {
        setValidationError("Please select a supported image format (JPG, PNG, or WEBP).");
        if (photoInputRef.current) photoInputRef.current.value = "";
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setValidationError("Each photo must be under 50MB.");
        if (photoInputRef.current) photoInputRef.current.value = "";
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl,
        type: "photo",
        name: file.name,
        sizeBytes: file.size,
      });
    }

    const updatedPhotos = [...photos, ...newItems];
    if (onChangePhotos) {
      onChangePhotos(updatedPhotos);
    }

    // Trigger primary photo callback for legacy single photo URL binding
    if (onPrimaryPhotoChange && updatedPhotos.length > 0) {
      const primary = updatedPhotos[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = (evt.target?.result as string) || "";
        onPrimaryPhotoChange(primary.file, dataUrl);
      };
      reader.readAsDataURL(primary.file);
    }

    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setValidationError(null);
    const target = photos[index];
    if (target && target.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }

    const updated = photos.filter((_, i) => i !== index);
    if (onChangePhotos) {
      onChangePhotos(updated);
    }

    if (onPrimaryPhotoChange) {
      if (updated.length > 0) {
        const primary = updated[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = (evt.target?.result as string) || "";
          onPrimaryPhotoChange(primary.file, dataUrl);
        };
        reader.readAsDataURL(primary.file);
      } else {
        onPrimaryPhotoChange(null, "");
      }
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError(null);
    if (!file) return;

    if (video) {
      setValidationError("You can upload only 1 video.");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validVideoTypes.includes(file.type.toLowerCase())) {
      setValidationError("Please select a supported video format (MP4, WEBM, or MOV).");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setValidationError("Video file size must be under 100MB.");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const newItem: MediaItem = {
      id: `video-${Date.now()}`,
      file,
      previewUrl,
      type: "video",
      name: file.name,
      sizeBytes: file.size,
    };

    if (onChangeVideo) {
      onChangeVideo(newItem);
    }

    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleRemoveVideo = () => {
    setValidationError(null);
    if (video?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(video.previewUrl);
    }
    if (onChangeVideo) {
      onChangeVideo(null);
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Label Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-foreground text-xs font-bold tracking-wider uppercase font-condensed flex items-center gap-1.5">
          <ImageIcon size={15} className="text-primary" />
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        <span className="text-muted-foreground text-xs">
          Up to {maxPhotos} photos (JPG, PNG, WEBP — Max 50MB) + {maxVideos} video (MP4, WEBM — Max 100MB)
        </span>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={photoInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handlePhotoSelect}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideoSelect}
      />

      {/* Section 1: Photos Grid & Upload Button */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-foreground text-xs font-semibold uppercase tracking-wider font-condensed flex items-center gap-1">
            <ImageIcon size={13} className="text-primary" />
            Evidence Photos ({photos.length} / {maxPhotos})
          </span>
          {photos.length < maxPhotos && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => photoInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs"
            >
              <Plus size={14} /> Add Photos
            </Button>
          )}
        </div>

        {photos.length === 0 ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => photoInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                photoInputRef.current?.click();
              }
            }}
            className="bg-card border-2 border-dashed border-border min-h-[110px] flex flex-col items-center justify-center gap-2 p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all rounded-card group"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Upload size={18} />
            </div>
            <span className="text-foreground font-semibold text-xs tracking-wider uppercase font-condensed group-hover:text-primary transition-colors">
              Click to Upload Photos ({photos.length} / {maxPhotos})
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {photos.map((item, idx) => (
              <div
                key={item.id}
                className="relative group rounded-card border border-border bg-card overflow-hidden aspect-square shadow-sm flex flex-col justify-between"
              >
                <img
                  src={item.previewUrl}
                  alt={`Selected photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-primary/90 text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                    <Star size={9} fill="currentColor" /> Hero Photo
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  disabled={isUploading}
                  aria-label={`Remove photo ${idx + 1}`}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-destructive"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {photos.length < maxPhotos && (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Add more photos"
                className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-card flex flex-col items-center justify-center gap-1 aspect-square text-muted-foreground hover:text-primary transition-all cursor-pointer"
              >
                <Plus size={20} />
                <span className="text-[10px] font-bold uppercase font-condensed">Add Photo</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Video Upload & Preview */}
      <div className="flex flex-col gap-3 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-foreground text-xs font-semibold uppercase tracking-wider font-condensed flex items-center gap-1">
            <VideoIcon size={13} className="text-primary" />
            Evidence Video ({video ? 1 : 0} / {maxVideos})
          </span>
          {!video && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs"
            >
              <Film size={14} /> Add Video
            </Button>
          )}
        </div>

        {!video ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => videoInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                videoInputRef.current?.click();
              }
            }}
            className="bg-card border-2 border-dashed border-border min-h-[90px] flex items-center justify-center gap-3 p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all rounded-card group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
              <Film size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-semibold text-xs tracking-wider uppercase font-condensed group-hover:text-primary transition-colors">
                Add Video Clip (Optional — Max 100MB)
              </span>
              <span className="text-muted-foreground text-2xs">
                Supports MP4, WEBM, MOV video clips of animal behavior or surroundings
              </span>
            </div>
          </div>
        ) : (
          <Card variant="elevated" className="p-3 bg-card border border-border flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Film size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-foreground font-bold text-xs truncate">
                  {video.name}
                </span>
                <span className="text-muted-foreground text-2xs">
                  Video clip · {formatSize(video.sizeBytes)}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveVideo}
              disabled={isUploading}
              aria-label="Remove selected video"
              className="text-destructive hover:bg-destructive/10 text-xs shrink-0"
            >
              <X size={14} /> Remove Video
            </Button>
          </Card>
        )}
      </div>

      {/* Validation Error Display */}
      {(validationError || error) && (
        <p className="text-destructive text-xs flex items-center gap-1.5 font-medium bg-destructive/10 p-2.5 rounded-btn">
          <AlertCircle size={14} className="shrink-0" />
          {validationError || error}
        </p>
      )}
    </div>
  );
}
