"use client";

import { Button, EditorialHeading, Section } from "./pawguard";

export default function CallToActionSection() {
  return (
    <Section bg="card" aria-label="Make a difference">
      <div className="flex flex-col items-center relative">
        <EditorialHeading
          eyebrow="Behind every rescue is a family whose life changed"
          align="center"
          description="Adopt, volunteer, foster, or donate. Every action puts help closer to the next dog that needs it."
        >
          Ready to make a difference?
        </EditorialHeading>

        <div className="flex flex-wrap gap-3 justify-center mt-10">
          <Button variant="primary" size="lg" asLink={{ href: "/adopt" }}>
            Adopt a Dog
          </Button>
          <Button variant="outline" size="lg" asLink={{ href: "/donate" }}>
            Donate Now
          </Button>
          <Button variant="outline" size="lg" asLink={{ href: "/volunteer" }}>
            Volunteer
          </Button>
        </div>
      </div>
    </Section>
  );
}