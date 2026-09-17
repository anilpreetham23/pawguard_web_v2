"use client";

import { LEFT_COLUMN, RIGHT_COLUMN } from "./rescue-gallery";
import { JourneyColumn } from "./JourneyColumn";

/**
 * Two-column CSS marquee of rescue-journey cards. Tracks translate on the
 * GPU (translate3d via transform) and pause when the section leaves the
 * viewport or is hovered.
 */
export function RescueJourneyGallery() {
  return (
    <div className="rj-gallery">
      <JourneyColumn items={LEFT_COLUMN} speed={70} />
      <JourneyColumn items={RIGHT_COLUMN} reverse speed={85} />
    </div>
  );
}
