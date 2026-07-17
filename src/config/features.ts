import type { SpaceModelVariant } from "@/components/visual/InteractiveSpaceModel";

export type FeatureItem = {
  title: string;
  description: string;
  variant: SpaceModelVariant;
};

export const featureItems: FeatureItem[] = [
  {
    title: "Katha Mandal",
    description: "Cultural sky stories presented as respectfully preserved narratives.",
    variant: "moon_phase",
  },
  {
    title: "Rahasya Chakra",
    description: "Curiosity-driven learning paths exploring cosmic mysteries.",
    variant: "mystery_orb",
  },
  {
    title: "Vigyan Drishti",
    description: "Modern explanations focused on observations and scientific evidence.",
    variant: "telescope_view",
  },
  {
    title: "Satya Setu",
    description: "Comparing cultural context with modern scientific understanding.",
    variant: "eclipse_alignment",
  },
  {
    title: "Pramaan Matrix",
    description: "Claims mapped by evidence: proven, symbolic, or unknown.",
    variant: "evidence_grid",
  },
  {
    title: "Drishya Yantra",
    description: "Visual templates clarifying motion and cosmic scale.",
    variant: "planet_orbit",
  },
  {
    title: "Jigyasa Agni",
    description: "Deep follow-up questions to spark ongoing curiosity.",
    variant: "question_orb",
  },
  {
    title: "Smriti Quest",
    description: "Short review moments building durable conceptual memory.",
    variant: "constellation_path",
  },
];
