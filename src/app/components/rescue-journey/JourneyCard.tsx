"use client";

import { useEffect, useRef } from "react";
import type { JourneyCardData } from "./rescue-gallery";

interface JourneyCardProps {
  item: JourneyCardData;
  /** First visible card in a column — eager + high fetch priority. */
  eager?: boolean;
}

export function JourneyCard({ item, eager = false }: JourneyCardProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.fetchPriority = eager ? "high" : "low";
    }
  }, [eager]);

  return (
    <article className="rj-card">
      <div className="rj-card__media">
        <img
          ref={imgRef}
          src={item.img}
          alt={item.alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          width={500}
          height={380}
        />
      </div>
      <div className="rj-card__body">
        <span className="rj-card__stage">{item.stage}</span>
        <span className="rj-card__name">{item.dogName}</span>
        <p className="rj-card__note">{item.note}</p>
      </div>
    </article>
  );
}
