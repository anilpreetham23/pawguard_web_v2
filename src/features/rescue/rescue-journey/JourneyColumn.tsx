"use client";

import type { CSSProperties } from "react";
import type { JourneyCardData } from "./rescue-gallery";
import { JourneyCard } from "./JourneyCard";

interface JourneyColumnProps {
  items: JourneyCardData[];
  /** Scroll the column in the opposite direction. */
  reverse?: boolean;
  /** Seconds for a full single-set pass (lower = faster). */
  speed?: number;
}

export function JourneyColumn({ items, reverse = false, speed = 70 }: JourneyColumnProps) {
  const trackClass = reverse ? "rj-track rj-track--reverse" : "rj-track";
  const style = { "--rj-duration": `${speed}s` } as CSSProperties;

  return (
    <div className="rj-column" aria-hidden={false}>
      <div className={trackClass} style={style}>
        <div className="rj-track__group" aria-hidden="false">
          {items.map((item) => (
            <JourneyCard key={item.id} item={item} eager={item.id === items[0]?.id} />
          ))}
        </div>
        <div className="rj-track__group" aria-hidden="true">
          {items.map((item) => (
            <JourneyCard key={`${item.id}-dup`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
