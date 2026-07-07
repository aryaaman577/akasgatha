# Skill: Content Safety and Research

> How to handle sensitive content responsibly in AkasGatha.

---

## Avoid Fake Proof Claims

### Never present mythology as scientific proof:

**❌ Bad**: "The Vedas scientifically proved that Rahu is a planet that causes eclipses."
**✅ Good**: "In Hindu mythology, Rahu is described as a shadow entity that swallows the Sun. In modern astronomy, a solar eclipse is caused by the Moon passing between Earth and the Sun."

### Never use phrases like:
- "Ancient texts predicted..."
- "Science has now confirmed what the Vedas said..."
- "This proves that mythology is real..."
- "Ancient Indians discovered [X] before modern science..."
- "Astrology is a science..."

### Unless:
You have a **specific, verifiable citation** from a peer-reviewed source. For example: "Aryabhata (476 CE) described the Earth's rotation and the cause of eclipses in the Aryabhatiya — this is a documented historical contribution to astronomy."

## Separate Story and Science

Every response must structurally separate:

1. **Cultural Story** (kathaMandal) — what the tradition says
2. **Science** (vigyanDrishti) — what modern science says
3. **Bridge** (satyaSetu) — where they align, diverge, or remain open
4. **Evidence** (pramaanMatrix) — what is proven, symbolic, or unknown

This separation must be:
- Structural (different JSON fields)
- Visual (different UI cards with different styles)
- Labeled (clear titles and badges)

## Use Careful Wording

### For cultural stories:
- "In Hindu mythology, it is said that..."
- "According to ancient Indian tradition..."
- "The Puranas describe..."
- "This cultural narrative explains..."

### For science:
- "Modern astronomy shows that..."
- "According to current scientific understanding..."
- "NASA/ISRO data confirms..."
- "Based on observational evidence..."

### For bridges:
- "The ancient observation was accurate in that..."
- "The cultural explanation differs from the scientific model in..."
- "Both traditions recognize the phenomenon, but explain it differently..."

### For unknowns:
- "This remains an open question in science..."
- "No definitive explanation exists yet..."
- "This is considered a remarkable coincidence by scientists..."

## Avoid Astrology Prediction

AkasGatha is about **astronomy** (the science of celestial objects) not **astrology** (the belief that celestial positions affect human lives).

### Never generate:
- Horoscopes or birth charts
- Career/marriage/health predictions based on planets
- "Good/bad days" based on planetary positions
- Gemstone recommendations
- Dasha or transit predictions

### If asked about astrology:
- Explain the historical connection between astronomy and astrology
- Explain that modern science does not support astrological predictions
- Redirect to the astronomical facts about the celestial body in question

## Avoid Medical/Religious Overclaims

### Never claim:
- That specific mantras have healing properties (medical claim)
- That a religious practice is scientifically proven
- That one religion is "more scientific" than another
- That ancient medical systems are superior to modern medicine

### When discussing cultural health practices:
- "Traditionally believed to..."
- "Cultural practice suggests..."
- "No clinical evidence currently supports this claim"

## Citation Practices

For the MVP, exact citations are not required in AI responses. However:

### In the internship report:
- Cite sources for any factual claims about science
- Cite sources for historical claims about specific astronomers
- Use reputable sources: NASA, ISRO, peer-reviewed papers, university courses
- Do not cite Wikipedia as a primary source (cite the sources Wikipedia cites)

### In AI responses:
- Use the evidence level field honestly
- "proven" = widely accepted in scientific community
- "symbolic" = metaphorical or cultural meaning
- "unknown" = no definitive scientific answer

## Key Content Boundaries

| Topic | Allowed | Not Allowed |
|---|---|---|
| Eclipse causes | Scientific explanation + cultural story | "Rahu actually causes eclipses" |
| Planetary influence | Gravitational effects on tides, orbits | "Mars causes anger" |
| Nakshatra significance | Cultural and astronomical context | "Born under X nakshatra means Y" |
| Ancient astronomers | Historical contributions with citations | "Ancient Indians invented everything" |
| Cosmic mysteries | Open questions in science | "Science can't explain this because of divine plan" |
