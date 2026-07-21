/**
 * Topic Aliases for Multilingual Retrieval & Normalization
 * 
 * Maps English, Hindi Devanagari, Hinglish terms, and common variations/typos
 * to canonical topics for boosted local retrieval scoring.
 * 
 * Phase 4B / Gate 3
 */

export const TOPIC_ALIASES: Record<string, string[]> = {
  "eclipse": [
    "grahan", "eclipse", "surya grahan", "chandra grahan",
    "solar eclipse", "lunar eclipse", "sun eclipse", "moon eclipse",
    "grah", "eclipses", "सूर्य ग्रहण", "चंद्र ग्रहण", "ग्रहण",
    "grahan kyon hota hai", "solareclipse", "lunareclipse"
  ],
  "moon-phases": [
    "chand", "chandra", "moon", "kala", "phase", "phases",
    "moon phase", "lunar phase", "chand ki kala", "purnima", "amavasya",
    "पूर्णिमा", "अमावस्या", "चंद्रमा", "चाँद", "chandrama"
  ],
  "day-night": [
    "din", "raat", "day", "night", "rotation", "ghoomna",
    "earth rotation", "din raat", "day night cycle", "दिन रात", "घूर्णन"
  ],
  "seasons": [
    "ritu", "mausam", "season", "seasons", "bahar", "garmi", "sardi",
    "summer", "winter", "spring", "autumn", "axial tilt", "ऋतु", "मौसम"
  ],
  "telescope": [
    "doorbeen", "durbin", "telescope", "magnify", "observe",
    "lens", "mirror", "optical", "दूरबीन", "jwst", "hubble"
  ],
  "satellite": [
    "upagrah", "satellite", "orbit", "kaksha", "artificial satellite",
    "space station", "orbital", "उपग्रह", "कक्षा", "isro", "nasa"
  ],
  "black-hole": [
    "black hole", "krishna vivar", "kala chhidra", "blackhole",
    "singularity", "event horizon", "कृष्ण विवर", "काला छिद्र",
    "m87", "sagittarius a", "gravitational collapse"
  ],
  "rahu-ketu": [
    "rahu", "ketu", "lunar nodes", "nodes", "ascending node",
    "descending node", "dragon head", "dragon tail", "राहु", "केतु",
    "samudra manthan", "swarbhanu"
  ],
  "nakshatra": [
    "nakshatra", "nakshatras", "lunar mansion", "star pattern",
    "constellation", "asterism", "नक्षत्र", "rohini", "ashwini"
  ],
  "planetary-motion": [
    "planet", "grah", "orbit", "kaksha", "planetary motion",
    "kepler", "elliptical", "revolution", "ग्रह", "बुध", "शुक्र", "मंगल", "बृहस्पति", "शनि"
  ],
  "constellations": [
    "constellation", "constellations", "tara mandal", "star pattern",
    "zodiac", "rashi", "तारामंडल", "राशि"
  ],
  "multiverse": [
    "multiverse", "parallel universe", "parallel world", "multiple universes",
    "multi-verse", "many worlds", "बहु-ब्रह्मांड", "समांतर ब्रह्मांड", "alternate reality"
  ],
  "dark-matter": [
    "dark matter", "dark energy", "invisible matter", "adrishya padarth",
    "अदृश्य पदार्थ", "डार्क मैटर", "डार्क एनर्जी", "cosmic expansion"
  ],
  "big-bang": [
    "big bang", "cosmic expansion", "origin of universe", "creation of universe",
    "brahmand utpatti", "ब्रह्मांड की उत्पत्ति", "बिग बैंग", "cmb", "cosmic microwave"
  ],
  "rogue-planets": [
    "rogue planet", "wandering planet", "free floating planet", "nomad planet",
    "avara graha", "आवारा ग्रह", "free-floating planet", "dark planet"
  ],
  "fermi-paradox": [
    "fermi paradox", "great filter", "are we alone", "alien life",
    "kya hum akele hain", "क्या हम अकेले हैं", "extraterrestrial life", "seti"
  ],
  "dhruva": [
    "dhruva", "polaris", "north star", "saptarishi", "big dipper",
    "ध्रुव तारा", "सप्तर्षि", "dhruva tara", "ursa major"
  ],
  "wormhole": [
    "wormhole", "einstein rosen bridge", "space portal", "samay yatra",
    "समय यात्रा", "वॉर्महोल", "time travel", "time dilation"
  ],
  "marvel-dc": [
    "marvel", "dc", "speed force", "flash", "krypton", "dragon ball",
    "anime space", "speedforce", "mcu multiverse"
  ],
  "heat-death": [
    "heat death", "big rip", "end of universe", "future of universe",
    "brahmand ka ant", "ब्रह्मांड का अंत", "big freeze", "entropy"
  ]
};

/**
 * Get topic boost score for query-document matching
 */
export function getTopicBoost(query: string, documentTitle: string, documentTopic: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = documentTitle.toLowerCase();
  const topicLower = documentTopic.toLowerCase();
  
  let score = 0;
  
  for (const [, aliases] of Object.entries(TOPIC_ALIASES)) {
    for (const alias of aliases) {
      const aliasLower = alias.toLowerCase();
      if (queryLower.includes(aliasLower)) {
        if (titleLower.includes(aliasLower) || topicLower.includes(aliasLower)) {
          score += 2.0;
        }
        
        for (const relatedAlias of aliases) {
          const relatedLower = relatedAlias.toLowerCase();
          if (relatedLower !== aliasLower && (titleLower.includes(relatedLower) || topicLower.includes(relatedLower))) {
            score += 0.5;
          }
        }
      }
    }
  }
  
  return Math.min(score, 3.0);
}
