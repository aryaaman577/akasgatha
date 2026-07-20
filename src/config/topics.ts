import type { SpaceModelVariant } from "@/components/visual/InteractiveSpaceModel";

export type TopicItem = {
  /** i18n key index: topic0…topic6 */
  index: number;
  sceneType: SpaceModelVariant;
};

export const topicItems: TopicItem[] = [
  { index: 0, sceneType: "planet_orbit" },
  { index: 1, sceneType: "eclipse_alignment" },
  { index: 2, sceneType: "star_map" },
  { index: 3, sceneType: "moon_phase" },
  { index: 4, sceneType: "mystery_orb" },
  { index: 5, sceneType: "celestial_cycle" },
  { index: 6, sceneType: "satellite_orbit" },
];
