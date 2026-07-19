/**
 * Question Intent Classification
 * 
 * Deterministically classifies questions by intent.
 * Phase 4B: Separates science, narrative, mixed, and general queries.
 */

export type QuestionIntent = "science" | "narrative" | "mixed" | "general";

/**
 * Science keywords
 */
const SCIENCE_KEYWORDS = [
  "why", "how", "what", "explain", "reason", "cause", "scientific",
  "eclipse", "moon", "sun", "planet", "orbit", "rotation", "seasons",
  "telescope", "astronomy", "physics", "gravity", "light", "shadow",
  "satellite", "constellation", "star", "space", "earth",
  // Hindi/Hinglish
  "kyon", "kaise", "kya", "vigyan", "vaigyanik", "grahan",
  "chand", "suraj", "grah", "kaksha", "mausam", "durbin",
];

/**
 * Narrative keywords
 */
const NARRATIVE_KEYWORDS = [
  "story", "tale", "myth", "legend", "tradition", "cultural",
  "rahu", "ketu", "nakshatra", "purana", "mythology",
  "symbolic", "belief", "ancient", "vedic",
  // Hindi/Hinglish
  "katha", "kahani", "itihas", "puran", "parampara",
  "dharmik", "sanskritik", "prachin",
];

/**
 * Mixed keywords (both science and narrative)
 */
const MIXED_KEYWORDS = [
  "relation", "connection", "difference", "compare", "similar",
  "versus", "vs", "both", "and", "also",
  // Hindi/Hinglish
  "rishta", "sambandh", "antar", "farq", "tulna", "aur",
];

/**
 * Classify question intent
 */
export function classifyIntent(question: string): QuestionIntent {
  const lower = question.toLowerCase();
  
  // Check for mixed intent first
  const hasMixedKeywords = MIXED_KEYWORDS.some(kw => lower.includes(kw));
  
  const hasScienceKeywords = SCIENCE_KEYWORDS.some(kw => lower.includes(kw));
  const hasNarrativeKeywords = NARRATIVE_KEYWORDS.some(kw => lower.includes(kw));
  
  // Both science and narrative keywords present
  if (hasScienceKeywords && hasNarrativeKeywords) {
    return "mixed";
  }
  
  // Mixed keywords with either science or narrative
  if (hasMixedKeywords && (hasScienceKeywords || hasNarrativeKeywords)) {
    return "mixed";
  }
  
  // Primarily science
  if (hasScienceKeywords) {
    return "science";
  }
  
  // Primarily narrative
  if (hasNarrativeKeywords) {
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
