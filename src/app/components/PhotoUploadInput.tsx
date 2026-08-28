"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Check, Image as ImageIcon, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button, Card, Badge } from "./pawguard";

interface PhotoUploadInputProps {
  label?: string;
  required?: boolean;
  value?: string;
  isUploading?: boolean;
  isUploaded?: boolean;
  onChange: (file: File | null, dataUrl: string) => void;
  error?: string;
}

export function PhotoUploadInput({
  label = "Photo of Animal",
  required = true,
  value = "",
  isUploading = false,
  isUploaded = false,
  onChange,
  error,
}: PhotoUploadInputProps) {
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(value || "");
    setImageFailed(false);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError(null);
    if (!file) return;

    // Validate supported image formats (JPG, JPEG, PNG, WEBP)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setValidationError("Invalid image format. Please upload a JPG, PNG, or WEBP photo.");
      return;
    }

    // Limit max file size (50MB as per backend specification)
    if (file.size > 50 * 1024 * 1024) {
      setValidationError("Image file size must be under 50MB.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = (event.target?.result as string) || "";
      setPreviewUrl(dataUrl);
      onChange(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setFileName("");
    setPreviewUrl("");
    setValidationError(null);
    onChange(null, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between gap-2">
        <label className="text-foreground text-xs font-bold tracking-wider uppercase font-condensed flex items-center gap-1.5">
          <ImageIcon size={15} className="text-primary" />
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        <span className="text-muted-foreground text-xs">
          Upload photo from device (JPG, PNG, WEBP — Max 50MB).
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Dropzone / Button */}
      {!previewUrl ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="bg-card border-2 border-dashed border-border min-h-[130px] flex flex-col items-center justify-center gap-2.5 p-5 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all rounded-card group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Upload size={20} />
          </div>
          <div className="flex flex-col items-center text-center gap-0.5">
            <span className="text-foreground font-semibold text-xs tracking-wider uppercase font-condensed group-hover:text-primary transition-colors">
              Click to Upload Photo
            </span>
            <span className="text-muted-foreground text-xs">
              Supports JPG, JPEG, PNG, WEBP (Max 50MB)
            </span>
          </div>
        </div>
      ) : (
        /* Image Preview Thumbnail Card */
        <Card variant="elevated" className="p-4 bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-16 h-16 rounded-lg bg-card border border-border overflow-hidden shrink-0 relative shadow-sm flex items-center justify-center">
              {!imageFailed && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <ImageIcon size={24} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-foreground font-bold text-sm truncate">
                {fileName || "Photo Selected"}
              </span>
              {isUploading ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mt-1">
                  <Loader2 size={13} className="animate-spin" /> Uploading photo to storage…
                </span>
              ) : isUploaded ? (
                <Badge variant="success" className="gap-1 text-[10px] px-2 py-0.5 self-start mt-1">
                  <Check size={10} /> Uploaded &amp; Secured
                </Badge>
              ) : (
                <Badge variant="neutral" className="gap-1 text-[10px] px-2 py-0.5 self-start mt-1">
                  <Check size={10} /> Photo Selected
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs"
            >
              <RefreshCw size={13} />
              Change Photo
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
              className="text-destructive hover:bg-destructive/10 text-xs"
            >
              <X size={14} />
              Remove
            </Button>
          </div>
        </Card>
      )}

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
