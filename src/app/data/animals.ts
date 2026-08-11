export type AdoptionStatus = "available" | "pending" | "adopted";

export interface Animal {
  slug: string;
  name: string;
  species: string;
  age: string;
  ageGroup: "Puppy" | "Young" | "Adult" | "Senior";
  size: "Small" | "Medium" | "Large";
  gender: string;
  breed: string;
  img: string;
  desc: string;
  story: string;
  temperament: string;
  vaccinated: boolean;
  microchipped?: boolean;
  urgent?: boolean;
  newArrival?: boolean;
  location: string;
  energy: "Low" | "Medium" | "High";
  goodWith: string[];
  care: string[];
  status: AdoptionStatus;
}

export const ANIMALS: Animal[] = [
  {
    slug: "bella",
    name: "Bella",
    species: "Dog",
    age: "2 years",
    ageGroup: "Young",
    size: "Large",
    gender: "Female",
    breed: "Labrador Mix",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&auto=format",
    desc: "Gentle, playful, and great with children.",
    story:
      "Bella was found frightened and alone near a busy road. After veterinary care and time with her foster family, she has become a gentle, playful companion who loves people and long walks. She settled into home life faster than anyone expected.",
    temperament: "Playful & gentle",
    vaccinated: true,
    microchipped: true,
    urgent: true,
    location: "Dover, DE",
    energy: "High",
    goodWith: ["Children", "Other dogs", "Active families"],
    care: ["Daily exercise", "Fenced yard recommended", "Patient first introductions"],
    status: "available",
  },
  {
    slug: "max",
    name: "Max",
    species: "Dog",
    age: "3 years",
    ageGroup: "Adult",
    size: "Large",
    gender: "Male",
    breed: "German Shepherd",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop&auto=format",
    desc: "Loyal and intelligent. Ideal for active households.",
    story:
      "Max arrived as a confident, watchful boy who had spent too little time being understood. With calm training and a steady routine, his intelligence and devotion have come to the surface — he picks up commands quickly and thrives on having a clear job to do.",
    temperament: "Loyal & intelligent",
    vaccinated: true,
    microchipped: true,
    location: "Dover, DE",
    energy: "High",
    goodWith: ["Active households", "Experienced owners", "Consistent routines"],
    care: ["Daily mental stimulation", "Secure garden", "Continued obedience training"],
    status: "available",
  },
  {
    slug: "luna",
    name: "Luna",
    species: "Dog",
    age: "1 year",
    ageGroup: "Young",
    size: "Medium",
    gender: "Female",
    breed: "Siberian Husky",
    img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop&auto=format",
    desc: "Affectionate and energetic. Loves attention and long walks.",
    story:
      "Luna came to us from a roadside rescue, bright-eyed even after a rough start. She is affectionate and endlessly energetic — happiest on a long walk with someone who can keep up. With structure and attention she has blossomed into a joyful, talkative companion.",
    temperament: "Affectionate & energetic",
    vaccinated: true,
    microchipped: true,
    newArrival: true,
    location: "Dover, DE",
    energy: "High",
    goodWith: ["Active households", "Experienced owners", "Fenced spaces"],
    care: ["Regular long walks", "Escape-proof fencing", "Cool comfortable rest"],
    status: "available",
  },
  {
    slug: "charlie",
    name: "Charlie",
    species: "Dog",
    age: "4 years",
    ageGroup: "Adult",
    size: "Medium",
    gender: "Male",
    breed: "Beagle",
    img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&h=600&fit=crop&auto=format",
    desc: "Curious and energetic. Excellent with other dogs.",
    story:
      "Charlie joined us from a rural community where dogs often went without care. A born explorer with an excellent nose, he is cheerful and sociable, getting along famously with other dogs. Give him a sunny patch in the garden and he is content for hours.",
    temperament: "Curious & energetic",
    vaccinated: true,
    microchipped: true,
    location: "Dover, DE",
    energy: "Medium",
    goodWith: ["Other dogs", "Families", "Active people"],
    care: ["Scent work & enrichment", "Secure garden", "Regular exploration"],
    status: "available",
  },
  {
    slug: "oliver",
    name: "Oliver",
    species: "Dog",
    age: "6 years",
    ageGroup: "Senior",
    size: "Medium",
    gender: "Male",
    breed: "Golden Retriever",
    img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop&auto=format",
    desc: "Calm, gentle, and wonderfully loyal. Perfect company for a quiet home.",
    story:
      "Oliver is a calm and dignified senior who was surrendered by an owner who could no longer care for him. He savours unhurried mornings, warm blankets, and quiet company. He asks for very little — a soft bed, patient hands, and a home that is still and kind.",
    temperament: "Calm & loyal",
    vaccinated: true,
    microchipped: true,
    location: "Dover, DE",
    energy: "Low",
    goodWith: ["Quiet homes", "Seniors", "Apartment living"],
    care: ["Gentle daily walk", "Comfortable bedding", "Regular vet check-ups"],
    status: "available",
  },
  {
    slug: "daisy",
    name: "Daisy",
    species: "Dog",
    age: "1 year",
    ageGroup: "Puppy",
    size: "Small",
    gender: "Female",
    breed: "Chihuahua Mix",
    img: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop&auto=format",
    desc: "Tiny, spirited, and full of love. Adapts well to apartments.",
    story:
      "Daisy made it to our care after a rough start on the streets — small, spirited, and somehow still full of love. She is endlessly curious, fiercely affectionate, and adapts quickly to apartment life. She wants a lap, a routine, and someone who will spoil her every day.",
    temperament: "Spirited & loving",
    vaccinated: true,
    microchipped: true,
    newArrival: true,
    location: "Dover, DE",
    energy: "Medium",
    goodWith: ["Apartment dwellers", "New owners", "First-time adopters"],
    care: ["Cozy indoor space", "Short frequent walks", "Gentle handling"],
    status: "available",
  },
  {
    slug: "rocky",
    name: "Rocky",
    species: "Dog",
    age: "5 years",
    ageGroup: "Adult",
    size: "Large",
    gender: "Male",
    breed: "Rottweiler Mix",
    img: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=600&fit=crop&auto=format",
    desc: "Strong, calm, and deeply loyal. Experienced owner recommended.",
    story:
      "Rocky is a strong, steady boy whose intimidating look hides a remarkably calm heart. He is loyal to those he trusts and deeply enjoys a clear routine. He flourished with an experienced owner who respects his strength and gives him a job — and repays them with complete devotion.",
    temperament: "Calm & loyal",
    vaccinated: true,
    microchipped: true,
    location: "Dover, DE",
    energy: "Medium",
    goodWith: ["Experienced owners", "Calm households", "Space to move"],
    care: ["Experienced handling", "Consistent routines", "Structured introductions"],
    status: "available",
  },
  {
    slug: "milo",
    name: "Milo",
    species: "Dog",
    age: "4 years",
    ageGroup: "Adult",
    size: "Small",
    gender: "Male",
    breed: "Corgi",
    img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop&auto=format",
    desc: "Independent but affectionate. Perfect for a quiet household.",
    story:
      "Milo arrived as a quiet, watchful little fellow who prefers to make friends at his own pace. He is clever and independent, but once he trusts you, he is the most devoted companion over the whole house. He suits someone who values a calm, one-on-one bond.",
    temperament: "Independent & affectionate",
    vaccinated: true,
    microchipped: true,
    location: "Dover, DE",
    energy: "Medium",
    goodWith: ["Adults", "Quiet homes", "Patient owners"],
    care: ["Secure garden", "Structured routine", "Gentle introductions"],
    status: "available",
  },
  {
    slug: "coco",
    name: "Coco",
    species: "Dog",
    age: "1 year",
    ageGroup: "Puppy",
    size: "Small",
    gender: "Female",
    breed: "Poodle Mix",
    img: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=800&h=600&fit=crop&auto=format",
    desc: "Smart, trainable, and eager to please. Great for first-time owners.",
    story:
      "Coco is whip-smart and eager to please. She learns new cues quickly and loves being given a job to do. She is both bubbly and sensible — happy to play hard, then settle by your side. For a first-time adopter who wants a bright, affectionate companion, Coco is a fantastic match.",
    temperament: "Smart & trainable",
    vaccinated: true,
    microchipped: true,
    newArrival: true,
    location: "Dover, DE",
    energy: "Medium",
    goodWith: ["First-time owners", "Apartment living", "Training-minded people"],
    care: ["Enrichment & training", "Regular grooming", "Structured play"],
    status: "available",
  },
];

const slugToAnimal = new Map(ANIMALS.map((a) => [a.slug, a]));

export function getAnimalBySlug(slug: string | undefined): Animal | undefined {
  if (!slug) return undefined;
  return slugToAnimal.get(slug);
}