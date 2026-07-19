/**
 * Topic Aliases for Better Retrieval
 * 
 * Maps Hindi/Hinglish terms and variations to canonical topics.
 * Phase 4B: Improves retrieval relevance.
 */

export const TOPIC_ALIASES: Record<string, string[]> = {
  "eclipse": [
    "grahan", "eclipse", "surya grahan", "chandra grahan",
    "solar eclipse", "lunar eclipse", "sun eclipse", "moon eclipse",
    "grah", "eclipses",
  ],
  "moon-phases": [
    "chand", "chandra", "moon", "kala", "phase", "phases",
    "moon phase", "lunar phase", "chand ki kala", "purnima", "amavasya",
  ],
  "day-night": [
    "din", "raat", "day", "night", "rotation", "ghoomna",
    "earth rotation", "din raat", "day night cycle",
  ],
  "seasons": [
    "ritu", "mausam", "season", "seasons", "bahar", "garmi", "sardi",
    "summer", "winter", "spring", "autumn", "axial tilt",
  ],
  "telescope": [
    "doorbeen", "durbin", "telescope", "magnify", "observe",
    "lens", "mirror", "optical",
  ],
  "satellite": [
    "upagrah", "satellite", "orbit", "kaksha", "artificial satellite",
    "space station", "orbital",
  ],
  "black-hole": [
    "black hole", "krishna vivar", "kala chhidra",
    "singularity", "event horizon",
  ],
  "rahu-ketu": [
    "rahu", "ketu", "lunar nodes", "nodes", "ascending node",
    "descending node", "dragon head", "dragon tail",
  ],
  "nakshatra": [
    "nakshatra", "nakshatras", "lunar mansion", "star pattern",
    "constellation", "asterism",
  ],
  "planetary-motion": [
    "planet", "grah", "orbit", "kaksha", "planetary motion",
    "kepler", "elliptical", "revolution",
  ],
  "constellations": [
    "constellation", "constellations", "tara mandal", "star pattern",
    "zodiac", "rashi",
  ],
};

/**
 * Get topic boost score for query-document matching
 */
export function getTopicBoost(query: string, documentTitle: string, documentTopic: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = documentTitle.toLowerCase();
  const topicLower = documentTopic.toLowerCase();
  
  let score = 0;
  
  // Check each topic's aliases
  for (const [, aliases] of Object.entries(TOPIC_ALIASES)) {
    for (const alias of aliases) {
      const aliasLower = alias.toLowerCase();
      if (queryLower.includes(aliasLower)) {
        // Query mentions this topic
        if (titleLower.includes(aliasLower) || topicLower.includes(aliasLower)) {
          // Document is about this topic - strong match
          score += 2.0;
        }
        
        // Check if document is semantically related
        for (const relatedAlias of aliases) {
          const relatedLower = relatedAlias.toLowerCase();
          if (relatedLower !== aliasLower && (titleLower.includes(relatedLower) || topicLower.includes(relatedLower))) {
            score += 0.5; // Related topic
          }
        }
      }
    }
  }
  
  return Math.min(score, 3.0); // Cap at 3.0
}
