/**
 * Question Intent Classification
 * 
 * Deterministically classifies questions by intent.
 * Phase 4B: Separates science, narrative, mixed, and general queries.
 */

export type QuestionIntent = "science" | "narrative" | "mixed" | "general";

/**
 * Strong narrative indicators (should trigger narrative classification)
 */
const STRONG_NARRATIVE_KEYWORDS = [
  "katha", "kahani", "story", "tale", "myth", "purana", "puranic",
  "mythology", "legend", "belief", "tradition", "ancient story",
];

/**
 * Science keywords (physical causation and mechanisms)
 */
const SCIENCE_KEYWORDS = [
  "why", "how", "explain", "reason", "cause", "work", "happen",
  "eclipse", "orbit", "rotation", "phases", "telescope", "seasons",
  "satellite", "physics", "gravity", "mechanism", "black hole",
  // Hindi/Hinglish - physical questions
  "kyon hota hai", "kaise kaam", "kaise hota", "kyon badalti",
  "kyon hote", "kyon badalte", "kaise rehta", "kya hota hai",
];

/**
 * Narrative entities (characters and concepts from traditions)
 */
const NARRATIVE_ENTITIES = [
  "rahu", "ketu", "nakshatra", "devta", "asur", "samudra manthan",
];

/**
 * Mixed keywords (comparing or relating both domains)
 */
const MIXED_KEYWORDS = [
  "relation", "connection", "difference", "compare", "antar",
  "aur", "versus", "vs", "both", "sambandh", "rishta",
  "farq", "tulna",
];

/**
 * Classify question intent
 */
export function classifyIntent(question: string): QuestionIntent {
  const lower = question.toLowerCase();
  
  // Check for strong narrative indicators first
  const hasStrongNarrative = STRONG_NARRATIVE_KEYWORDS.some(kw => lower.includes(kw));
  
  // Check for narrative entities
  const hasNarrativeEntities = NARRATIVE_ENTITIES.some(kw => lower.includes(kw));
  
  // Check for mixed/comparison keywords (but "aur" alone doesn't mean mixed)
  // "Din aur raat" is just listing two things, not comparing domains
  const hasMixedKeywords = MIXED_KEYWORDS.filter(kw => kw !== "aur").some(kw => lower.includes(kw));
  
  // Check for science mechanism keywords
  const hasScienceKeywords = SCIENCE_KEYWORDS.some(kw => lower.includes(kw));
  
  // Strong narrative classification
  // "Rahu Ketu ki katha kya hai" -> narrative (has "katha")
  if (hasStrongNarrative && !hasMixedKeywords) {
    return "narrative";
  }
  
  // Mixed classification
  // "Rahu Ketu aur eclipse ka relation kya hai" -> mixed (has relation + both domains)
  // "Nakshatra aur constellation me kya antar hai" -> mixed (has antar/difference)
  if (hasMixedKeywords && (hasNarrativeEntities || hasStrongNarrative || hasScienceKeywords)) {
    return "mixed";
  }
  
  // Narrative entities with mixed keywords
  if (hasNarrativeEntities && hasMixedKeywords) {
    return "mixed";
  }
  
  // Pure science - physical mechanism questions
  // "Chand ki kala kyon badalti hai" -> science (physical change, no narrative terms)
  // "Din aur raat kyon hote hain" -> science (physical phenomenon)
  // "Grahan kyon hota hai" -> science (physical event)
  if (hasScienceKeywords && !hasStrongNarrative && !hasNarrativeEntities) {
    return "science";
  }
  
  // Narrative entities without science mechanism questions
  if (hasNarrativeEntities && !hasScienceKeywords && !hasMixedKeywords) {
    return "narrative";
  }
  
  // Default to general
  return "general";
}

/**
 * Get domain priorities based on intent
 */
export function getDomainPriorities(intent: QuestionIntent): {
  science: number;
  narrative: number;
  boundary: number;
  glossary: number;
} {
  switch (intent) {
    case "science":
      return { science: 1.0, narrative: 0.3, boundary: 0.5, glossary: 0.8 };
    case "narrative":
      return { science: 0.3, narrative: 1.0, boundary: 0.5, glossary: 0.6 };
    case "mixed":
      return { science: 1.0, narrative: 1.0, boundary: 0.7, glossary: 0.8 };
    case "general":
      return { science: 0.8, narrative: 0.8, boundary: 0.6, glossary: 1.0 };
  }
}
