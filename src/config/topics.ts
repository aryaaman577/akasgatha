export type SceneType = "cosmic_sky" | "eclipse" | "planet_orbit";

export const topicItems: Array<{
  title: string;
  description: string;
  learningAngle: string;
  sceneType: SceneType;
}> = [
  {
    title: "Planets and Grah",
    description: "Explore planetary stories as cultural narratives alongside orbital motion and physical science.",
    learningAngle: "Compare symbolic names and roles with what astronomy observes about planets.",
    sceneType: "planet_orbit",
  },
  {
    title: "Eclipses and Rahu-Ketu",
    description:
      "Explore eclipse stories as cultural narratives and compare them with the modern science of Sun, Earth, and Moon alignment.",
    learningAngle: "Separate the Rahu-Ketu story from the evidence-based mechanics of eclipses.",
    sceneType: "eclipse",
  },
  {
    title: "Nakshatra and Stars",
    description: "Study star patterns, sky markers, and cultural naming traditions without treating them as predictions.",
    learningAngle: "Connect pattern recognition in the night sky with modern stellar observation.",
    sceneType: "cosmic_sky",
  },
  {
    title: "Moon Phases",
    description: "Understand lunar stories and the changing appearance of the Moon through reflected sunlight.",
    learningAngle: "Learn how geometry explains waxing, full moon, waning, and new moon views.",
    sceneType: "planet_orbit",
  },
  {
    title: "Cosmic Mysteries",
    description: "Browse open questions about space while keeping evidence, uncertainty, and imagination distinct.",
    learningAngle: "Practice asking careful questions when science has partial answers.",
    sceneType: "cosmic_sky",
  },
  {
    title: "Time Cycles",
    description: "Look at calendars, seasons, and repeating sky patterns through culture and measurement.",
    learningAngle: "See how observation helped societies track time without turning symbols into proof.",
    sceneType: "cosmic_sky",
  },
  {
    title: "Space Missions",
    description: "Connect ancient curiosity about the sky with modern spacecraft, telescopes, and exploration.",
    learningAngle: "Use mission science to understand how evidence is gathered beyond Earth.",
    sceneType: "planet_orbit",
  },
];
