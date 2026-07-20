import type { SpaceModelVariant } from "@/components/visual/InteractiveSpaceModel";

export type FeatureItem = {
  /** i18n key prefix: feat0…feat7 */
  key: `feat${number}`;
  title: string;
  variant: SpaceModelVariant;
  atmosphere: "gold" | "void" | "cyan" | "violet" | "default";
};

export const featureItems: FeatureItem[] = [
  {
    key: "feat0",
    title: "Katha Mandal",
    variant: "story_orbit",
    atmosphere: "gold",
  },
  {
    key: "feat1",
    title: "Rahasya Chakra",
    variant: "mystery_orb",
    atmosphere: "void",
  },
  {
    key: "feat2",
    title: "Vigyan Drishti",
    variant: "telescope_view",
    atmosphere: "cyan",
  },
  {
    key: "feat3",
    title: "Satya Setu",
    variant: "truth_bridge",
    atmosphere: "default",
  },
  {
    key: "feat4",
    title: "Pramaan Matrix",
    variant: "evidence_grid",
    atmosphere: "cyan",
  },
  {
    key: "feat5",
    title: "Drishya Yantra",
    variant: "planet_orbit",
    atmosphere: "default",
  },
  {
    key: "feat6",
    title: "Jigyasa Agni",
    variant: "question_orb",
    atmosphere: "violet",
  },
  {
    key: "feat7",
    title: "Smriti Quest",
    variant: "constellation_path",
    atmosphere: "void",
  },
];
