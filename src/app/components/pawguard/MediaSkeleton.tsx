"use client";

import { useState, useCallback, type ImgHTMLAttributes } from "react";
import { Image, Video, FileQuestion } from "lucide-react";
import { cn } from "../ui/utils";
import { Skeleton } from "./Skeleton";
import { InteractiveImage, type ImageVariant } from "../../../motion/components/InteractiveImage";

type MediaType = "image" | "video" | "unknown";

interface MediaSkeletonProps {
  aspectRatio?: string;
  mediaType?: MediaType;
  className?: string;
}

export function MediaSkeleton({
  aspectRatio = "4/3",
  mediaType = "image",
  className,
}: MediaSkeletonProps) {
  const Icon =
    mediaType === "video"
      ? Video
      : mediaType === "unknown"
        ? FileQuestion
        : Image;

  return (
    <div
      className={cn("relative bg-card overflow-hidden", className)}
      style={{ aspectRatio }}
      aria-hidden="true"
    >
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon size={28} className="text-muted-foreground/40" strokeWidth={1} />
      </div>
    </div>
  );
}

interface ProgressiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: string;
  wrapperClassName?: string;
  /** Pass-through to InteractiveImage */
  variant?: ImageVariant;
  noParallax?: boolean;
  noSweep?: boolean;
  noGlow?: boolean;
  noFloat?: boolean;
}

export function ProgressiveImage({
  src,
  alt = "",
  aspectRatio,
  className,
  wrapperClassName,
  variant = "card",
  noParallax,
  noSweep,
  noGlow,
  noFloat,
  ...props
}: ProgressiveImageProps) {
  if (!src) {
    return (
      <div
        className={cn("relative overflow-hidden bg-card", wrapperClassName)}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image size={24} className="text-muted-foreground/40" strokeWidth={1} />
        </div>
      </div>
    );
  }

  return (
    <InteractiveImage
      src={src}
      alt={alt}
      variant={variant}
      className={wrapperClassName}
      imgClassName={className}
      aspectRatio={aspectRatio}
      noParallax={noParallax}
      noSweep={noSweep}
      noGlow={noGlow}
      noFloat={noFloat}
      {...(props as any)}
    />
  );
}
