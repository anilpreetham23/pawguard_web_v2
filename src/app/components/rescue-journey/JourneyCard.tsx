"use client";

import Image from "next/image";
import type { JourneyCardData } from "./rescue-gallery";

interface JourneyCardProps {
  item: JourneyCardData;
  /** First visible card in a column — eager + high fetch priority. */
  eager?: boolean;
}

export function JourneyCard({ item, eager = false }: JourneyCardProps) {
  return (
    <article className="rj-card">
      <div className="rj-card__media">
        <Image
          src={item.img}
          alt={item.alt}
          priority={eager}
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
