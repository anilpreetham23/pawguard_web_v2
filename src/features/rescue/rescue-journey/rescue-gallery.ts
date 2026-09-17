export interface JourneyCardData {
  id: string;
  dogName: string;
  stage: string;
  note: string;
  img: string;
  alt: string;
}

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?w=500&h=380&fit=crop&auto=format`;

/**
 * Two marquee columns tracking a rescue from first report to forever home.
 * Column A: the crisis side (report → triage). Column B: the recovery side
 * (treatment → adoption). Each column is duplicated inside the marquee track
 * for a seamless loop.
 */
export const LEFT_COLUMN: JourneyCardData[] = [
  {
    id: "j1",
    dogName: "Bruno",
    stage: "Report Received",
    note: "Call logged, GPS lock acquired.",
    img: photo("photo-1552053831-71594a27632d"),
    alt: "German Shepherd rescue dog waiting at the scene",
  },
  {
    id: "j2",
    dogName: "Bella",
    stage: "Dispatch",
    note: "Nearest unit rolling in four minutes.",
    img: photo("photo-1548199973-03cce0bbc87b"),
    alt: "Two dogs running freely together in a field",
  },
  {
    id: "j3",
    dogName: "Rocky",
    stage: "On Scene",
    note: "Team arrives, scene secured.",
    img: photo("photo-1587300003388-59208cc962cb"),
    alt: "Labrador mix rescue dog at the scene",
  },
  {
    id: "j4",
    dogName: "Max",
    stage: "Rescue",
    note: "Safely lifted from the culvert.",
    img: photo("photo-1543466835-00a7907e9de1"),
    alt: "Siberian Husky being cared for after rescue",
  },
  {
    id: "j5",
    dogName: "Luna",
    stage: "Emergency Triage",
    note: "Vitals stable, en route to the vet.",
    img: photo("photo-1517849845537-4d257902454a"),
    alt: "Rescue dog resting during emergency triage",
  },
];

export const RIGHT_COLUMN: JourneyCardData[] = [
  {
    id: "j6",
    dogName: "Coco",
    stage: "Vet Treatment",
    note: "Surgery completed successfully.",
    img: photo("photo-1583337130417-3346a1be7dee"),
    alt: "Dog recovering after veterinary treatment",
  },
  {
    id: "j7",
    dogName: "Daisy",
    stage: "Foster Care",
    note: "Healing in a quiet home.",
    img: photo("photo-1530281700549-e82e7bf110d6"),
    alt: "Dog curled up comfortably in foster care",
  },
  {
    id: "j8",
    dogName: "Simba",
    stage: "Training & Socializing",
    note: "Learning to trust again.",
    img: photo("photo-1537151608828-ea2b11777ee8"),
    alt: "Beagle during a training and socializing session",
  },
  {
    id: "j9",
    dogName: "Milo",
    stage: "Matching",
    note: "Family profile matched.",
    img: photo("photo-1601758228041-f3b2795255f1"),
    alt: "Dog being matched with an adoptive family",
  },
  {
    id: "j10",
    dogName: "Tiger",
    stage: "Adoption Day",
    note: "Going home for good.",
    img: photo("photo-1544568100-847a948585b9"),
    alt: "Happy adopted dog with its new family",
  },
];
