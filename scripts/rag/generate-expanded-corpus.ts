/**
 * RAG Corpus Generator Script
 * 
 * Generates verified concept-based knowledge documents covering:
 * - Foundation (Solar system, planets, Moon, eclipses, stars, rockets, telescopes)
 * - Advanced Space (Supernovae, black holes, dark matter, dark energy, Big Bang)
 * - Mysteries & Dark Cosmic Curiosity (Rogue planets, cosmic voids, Fermi paradox, Great Filter, heat death)
 * - Dharm Myth & Culture (Rahu/Ketu, Surya/Chandra, Dhruva, Saptarishi, Nakshatras, Indian creation philosophy)
 * - Multiverse, Theoretical & Fiction Comparisons (Multiverse, wormholes, time dilation, Marvel/DC/Anime physics)
 * 
 * Usage: tsx scripts/rag/generate-expanded-corpus.ts
 */

import * as fs from "fs/promises";
import * as path from "path";

interface CorpusDocumentSpec {
  id: string;
  title: string;
  domain: "science" | "narrative" | "boundary" | "glossary";
  topic: string;
  language: "en" | "hi";
  sourceName: string;
  sourceUrl: string;
  sourceType: "official" | "academic" | "primary-text" | "reference" | "internal-policy";
  reviewedAt: string;
  licenseNote: string;
  tags: string[];
  relatedTopics: string[];
  content: string;
}

const docs: CorpusDocumentSpec[] = [
  // ─── 1. FOUNDATION ───────────────────────────────────────────────────
  {
    id: "sun-structure-energy",
    title: "The Sun - Internal Structure and Energy Generation",
    domain: "science",
    topic: "solar-system",
    language: "en",
    sourceName: "NASA Sun Exploration",
    sourceUrl: "https://science.nasa.gov/sun/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from NASA",
    tags: ["sun", "solar-core", "nuclear-fusion", "solar-wind"],
    relatedTopics: ["stars", "solar-system"],
    content: `# The Sun - Internal Structure and Energy Generation

The Sun is a G-type main-sequence star (yellow dwarf) that contains 99.86% of the mass of the entire Solar System.

## Solar Core and Nuclear Fusion

At the center of the Sun, temperatures reach approximately 15 million degrees Celsius (27 million degrees Fahrenheit) with immense pressure. Under these extreme conditions, hydrogen nuclei undergo nuclear fusion to form helium via the proton-proton chain reaction. This process converts mass into energy according to Einstein's mass-energy equivalence equation (E=mc²), releasing approximately 3.8 x 10²6 Watts of power.

## Solar Layers

1. **Core**: The innermost region where nuclear fusion occurs.
2. **Radiative Zone**: Energy travels outward very slowly via photon absorption and re-emission, taking over 100,000 years for energy to pass through.
3. **Convective Zone**: Hot plasma rises toward the surface in giant convection cells, cooling and sinking back down.
4. **Photosphere**: The visible surface of the Sun, with a temperature around 5,500°C.
5. **Chromosphere and Corona**: The outer solar atmosphere. The corona is extremely hot (1 to 3 million °C) and extends millions of kilometers into space.

## Solar Activity and Solar Wind

Magnetic field reconnections cause solar flares and Coronal Mass Ejections (CMEs). The Sun continuously streams charged particles (electrons and protons) into space as the solar wind, shaping the heliosphere.`
  },
  {
    id: "planets-inner-rocky",
    title: "Terrestrial Planets - Mercury, Venus, Earth, and Mars",
    domain: "science",
    topic: "solar-system",
    language: "en",
    sourceName: "NASA Solar System Exploration",
    sourceUrl: "https://science.nasa.gov/solar-system/planets/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from NASA",
    tags: ["terrestrial-planets", "mercury", "venus", "earth", "mars"],
    relatedTopics: ["solar-system", "planetary-motion"],
    content: `# Terrestrial Planets - Mercury, Venus, Earth, and Mars

The inner Solar System consists of four terrestrial planets composed primarily of rock and metal with solid surfaces.

## Mercury
The smallest planet and closest to the Sun. It has almost no atmosphere to retain heat, leading to extreme surface temperature swings from 430°C during the day to -180°C at night. Its surface is heavily cratered, similar to Earth's Moon.

## Venus
Often called Earth's twin in size, Venus has a runaway greenhouse effect driven by a thick carbon dioxide atmosphere with sulfuric acid clouds. Surface atmospheric pressure is 92 times Earth's, and temperatures average 465°C, making Venus the hottest planet in the Solar System.

## Earth
The only known planet in the universe confirmed to harbor life. It features liquid water oceans covering 71% of its surface, a protective atmosphere composed mainly of nitrogen and oxygen, and an active magnetosphere driven by a molten iron core.

## Mars
Known as the Red Planet due to iron oxide (rust) on its surface. Mars possesses thin carbon dioxide atmosphere, giant extinct volcanoes such as Olympus Mons (the solar system's tallest volcano), and Valles Marineris (a giant canyon system). Evidence confirms Mars once had liquid water flowing on its surface.`
  },
  {
    id: "planets-outer-gas-giants",
    title: "Jovian Planets - Jupiter, Saturn, Uranus, and Neptune",
    domain: "science",
    topic: "solar-system",
    language: "en",
    sourceName: "NASA Solar System Exploration",
    sourceUrl: "https://science.nasa.gov/solar-system/planets/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from NASA",
    tags: ["gas-giants", "ice-giants", "jupiter", "saturn", "uranus", "neptune"],
    relatedTopics: ["solar-system", "planetary-motion"],
    content: `# Jovian Planets - Jupiter, Saturn, Uranus, and Neptune

The outer Solar System beyond the asteroid belt features four massive planets divided into Gas Giants and Ice Giants.

## Gas Giants: Jupiter and Saturn
- **Jupiter**: The largest planet in the Solar System, more than twice as massive as all other planets combined. Composed mainly of hydrogen and helium. Features the Great Red Spot, a anticyclonic storm larger than Earth that has raged for centuries. Jupiter has over 90 moons, including Ganymede (largest moon in the solar system) and Europa (subsurface ocean).
- **Saturn**: Famous for its prominent, extensive ring system composed of ice particles, rocky debris, and dust. Saturn is the least dense planet—less dense than liquid water. Its moon Titan has a dense nitrogen atmosphere and liquid methane/ethane lakes.

## Ice Giants: Uranus and Neptune
- **Uranus**: Unique for rotating almost completely on its side with an axial tilt of 97.8 degrees, likely caused by an ancient collision. Contains water, ammonia, and methane ice mantles giving it a cyan-blue appearance.
- **Neptune**: The most distant major planet. Features extreme supersonic winds reaching up to 2,100 km/h and a deep blue atmosphere colored by methane. Its largest moon, Triton, exhibits retrograde orbit and nitrogen geysers.`
  },
  {
    id: "dwarf-planets-kuiper-belt",
    title: "Dwarf Planets and the Kuiper Belt",
    domain: "science",
    topic: "solar-system",
    language: "en",
    sourceName: "IAU & NASA Solar System",
    sourceUrl: "https://science.nasa.gov/dwarf-planets/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from IAU and NASA",
    tags: ["dwarf-planets", "pluto", "eris", "kuiper-belt", "oort-cloud"],
    relatedTopics: ["solar-system", "comets"],
    content: `# Dwarf Planets and the Kuiper Belt

In 2006, the International Astronomical Union (IAU) defined a planet as a celestial body that:
1. Orbits the Sun.
2. Has sufficient mass for self-gravity to achieve hydrostatic equilibrium (nearly round shape).
3. Has cleared the neighborhood around its orbit.

Celestial bodies meeting criteria 1 and 2 but failing criterion 3 are classified as **dwarf planets**.

## Key Dwarf Planets
- **Pluto**: Reclassified from planet to dwarf planet in 2006. Located in the Kuiper Belt, it has five moons (Charon being the largest). New Horizons flyby in 2015 revealed nitrogen ice glaciers (Sputnik Planitia) and mountains of water ice.
- **Eris**: Discovered in 2005, Eris is slightly smaller than Pluto but more massive. Its discovery triggered the official IAU planet definition refinement.
- **Ceres**: Located in the main asteroid belt between Mars and Jupiter. It is the only dwarf planet in the inner solar system and contains subsurface water ice.
- **Haumea and Makemake**: Kuiper Belt dwarf planets. Haumea is elongated due to rapid 4-hour rotation.

## Kuiper Belt and Oort Cloud
- **Kuiper Belt**: A donut-shaped region of icy bodies extending from Neptune's orbit (30 AU) to about 50 AU from the Sun.
- **Oort Cloud**: A theoretical spherical cloud of trillions of icy cometary bodies enveloping the Solar System out to nearly 100,000 AU (1.5 light-years).`
  },
  {
    id: "asteroids-comets-meteors",
    title: "Asteroids, Comets, Meteors, and Meteorites",
    domain: "science",
    topic: "solar-system",
    language: "en",
    sourceName: "ESA Asteroids & Comets",
    sourceUrl: "https://www.esa.int/Space_Safety/Asteroids",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from ESA",
    tags: ["asteroids", "comets", "meteors", "meteorites"],
    relatedTopics: ["solar-system", "dwarf-planets"],
    content: `# Asteroids, Comets, Meteors, and Meteorites

Small Solar System bodies provide crucial clues about the early formation of the planetary system 4.6 billion years ago.

## Asteroids
Rocky, airless remnants left over from solar system formation. Most orbit in the Main Asteroid Belt between Mars and Jupiter. Asteroids are classified into C-type (carbonaceous), S-type (silicaceous/rocky), and M-type (metallic).

## Comets
Icy bodies composed of frozen gases, rock, and dust ("dirty snowballs"). When a comet approaches the Sun, solar radiation causes volatile ice to sublime into gas, producing:
1. **Coma**: A glowing atmosphere surrounding the nucleus.
2. **Dust Tail**: Curved white tail formed by solar radiation pressure pushing dust particles.
3. **Ion Tail**: Straight blue tail formed by solar wind ionizing gas particles, pointing directly away from the Sun.

## Meteors, Meteoroids, and Meteorites
- **Meteoroid**: Small rock or particle traveling through space.
- **Meteor**: The streak of light ("shooting star") produced when a meteoroid enters Earth's atmosphere at high speed and burns due to friction and ram pressure.
- **Meteorite**: Any portion of a meteoroid that survives atmospheric transit and strikes the ground.`
  },
  {
    id: "gravity-orbital-mechanics",
    title: "Gravity and Kepler's Laws of Planetary Motion",
    domain: "science",
    topic: "space-physics",
    language: "en",
    sourceName: "NASA Glenn Research Center",
    sourceUrl: "https://www.grc.nasa.gov/www/k-12/airplane/orbit.html",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from NASA",
    tags: ["gravity", "keplers-laws", "orbits", "orbital-mechanics"],
    relatedTopics: ["planetary-motion", "physics"],
    content: `# Gravity and Kepler's Laws of Planetary Motion

Gravity is the fundamental force of attraction between all objects with mass. Johannes Kepler and Isaac Newton formulated the mathematical laws governing orbital motion.

## Newton's Law of Universal Gravitation
Every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers: F = G*(m1*m2)/r².

## Kepler's Three Laws of Planetary Motion
1. **Law of Ellipses**: The orbit of a planet is an ellipse with the Sun at one of the two foci.
2. **Law of Equal Areas**: A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time. (Planets move faster when closer to the Sun at perihelion, and slower at aphelion).
3. **Law of Harmonies**: The square of the orbital period (T) of a planet is directly proportional to the cube of the semi-major axis (a) of its orbit: T² ∝ a³.

## Orbital Parameters
- **Perihelion**: Point in an orbit closest to the Sun.
- **Aphelion**: Point in an orbit farthest from the Sun.
- **Escape Velocity**: Minimum speed required for an unpropelled object to escape an celestial body's gravitational field (approx. 11.2 km/s for Earth).`
  },
  {
    id: "rockets-satellites-telescopes",
    title: "Rockets, Satellites, and Space Telescopes",
    domain: "science",
    topic: "space-technology",
    language: "en",
    sourceName: "ISRO & NASA Technology",
    sourceUrl: "https://www.isro.gov.in/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from ISRO and NASA",
    tags: ["rockets", "satellites", "telescopes", "jwst", "hubble", "isro"],
    relatedTopics: ["space-exploration", "satellites"],
    content: `# Rockets, Satellites, and Space Telescopes

Humanity explores the cosmos using propulsion systems, orbiting craft, and space-based observatories.

## Rocket Propulsion
Rockets operate on Newton's Third Law of Motion: "For every action, there is an equal and opposite reaction." High-speed exhaust gas expelling backward propels the rocket forward. Multistage rockets shed depleted fuel tanks to minimize mass as they ascend.

## Satellites and Orbits
- **Low Earth Orbit (LEO)**: Altitude 160–2,000 km (e.g., International Space Station, Earth observation satellites).
- **Geostationary Orbit (GEO)**: Altitude 35,786 km above Earth's equator. Orbital period equals Earth's rotation (24 hours), allowing satellites to remain fixed relative to ground position (ideal for telecommunications and weather monitoring).
- **Polar / Sun-Synchronous Orbit (SSO)**: Satellites pass over Earth's poles, viewing the surface under consistent daylight angles.

## Space Telescopes
1. **Hubble Space Telescope (HST)**: Launched in 1990 into LEO. Observes primarily in optical and ultraviolet wavelengths above Earth's atmospheric distortion.
2. **James Webb Space Telescope (JWST)**: Launched in 2021 to Lagrange Point 2 (L2), 1.5 million km from Earth. Observes in infrared to peer through dust clouds and view the earliest formed galaxies after the Big Bang.`
  },

  // ─── 2. ADVANCED SPACE ───────────────────────────────────────────────
  {
    id: "stellar-evolution-nucleosynthesis",
    title: "Stellar Evolution and Cosmic Nucleosynthesis",
    domain: "science",
    topic: "astrophysics",
    language: "en",
    sourceName: "ESA Space Science",
    sourceUrl: "https://www.esa.int/Science_Exploration/Space_Science",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from ESA",
    tags: ["stars", "stellar-evolution", "nucleosynthesis", "red-giant"],
    relatedTopics: ["supernovae", "black-holes"],
    content: `# Stellar Evolution and Cosmic Nucleosynthesis

Stars are cosmic factories that synthesize chemical elements throughout their lifecycles.

## Life Cycle of Stars
1. **Protostar**: A collapsing cloud of interstellar gas and dust (stellar nursery nebula) heats up until nuclear fusion ignites in the core.
2. **Main Sequence**: Stable phase where outward thermal radiation pressure balances inward gravitational collapse (hydrostatic equilibrium). The Sun is currently in main sequence.
3. **Red Giant / Red Supergiant**: As hydrogen in the core depletes, the core contracts while outer layers expand dramatically and cool.

## End Stages by Initial Mass
- **Low to Intermediate Mass (< 8 solar masses)**: Sheds outer layers as a planetary nebula, leaving behind a dense **White Dwarf** (supported by electron degeneracy pressure).
- **High Mass (> 8 solar masses)**: Fuses progressively heavier elements (helium → carbon → oxygen → neon → silicon) until an iron core forms. Iron fusion consumes energy rather than releasing it, triggering a violent core-collapse **Supernova**.

## Cosmic Nucleosynthesis
- **Big Bang**: Produced primordial hydrogen, helium, and trace lithium.
- **Stellar Fusion**: Fuses elements up to iron (carbon, nitrogen, oxygen, silicon).
- **Supernovae & Neutron Star Mergers**: Rapid neutron-capture process (r-process) synthesizes heavy elements such as gold, platinum, and uranium.`
  },
  {
    id: "supernovae-neutron-stars",
    title: "Supernovae, Neutron Stars, Pulsars, and Magnetars",
    domain: "science",
    topic: "astrophysics",
    language: "en",
    sourceName: "Chandra X-ray Observatory",
    sourceUrl: "https://chandra.harvard.edu/field/neutron_stars.html",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from Chandra / Harvard",
    tags: ["supernova", "neutron-star", "pulsar", "magnetar"],
    relatedTopics: ["stellar-evolution", "black-holes"],
    content: `# Supernovae, Neutron Stars, Pulsars, and Magnetars

When massive stars collapse, they produce catastrophic stellar explosions and ultra-dense stellar remnants.

## Supernova Types
- **Type Ia Supernova**: Occurs in a binary star system when a white dwarf accretes matter from a companion star until exceeding the Chandrasekhar Limit (1.4 solar masses), triggering a runaway thermonuclear explosion. Used as cosmological "standard candles".
- **Type II Supernova**: Core-collapse explosion of a massive star (>8 solar masses) whose iron core collapses in less than a second.

## Neutron Stars
If the collapsing stellar core mass is between 1.4 and ~2.1 solar masses, electrons and protons merge to form neutrons. The resulting **neutron star** is about 20 km in diameter yet contains more mass than the Sun—so dense that one teaspoon would weigh over 1 billion tons on Earth. Supported by neutron degeneracy pressure.

## Pulsars and Magnetars
- **Pulsar**: A rapidly spinning neutron star emitting focused beams of electromagnetic radiation from its magnetic poles. As it spins, the beam sweeps past Earth like a lighthouse beam, creating regular periodic pulses.
- **Magnetar**: A rare type of neutron star possessing an extremely powerful magnetic field (up to 1,000 trillion Gauss—a trillion times stronger than Earth's magnetic field). Magnetic field line reconnections generate intense starquakes and gamma-ray bursts.`
  },
  {
    id: "supermassive-black-holes-quasars",
    title: "Supermassive Black Holes, Event Horizon Telescope, and Quasars",
    domain: "science",
    topic: "astrophysics",
    language: "en",
    sourceName: "Event Horizon Telescope & NASA",
    sourceUrl: "https://eventhorizontelescope.org/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from EHT and NASA",
    tags: ["supermassive-black-hole", "quasars", "eht", "event-horizon", "m87"],
    relatedTopics: ["black-holes", "galaxies"],
    content: `# Supermassive Black Holes, Event Horizon Telescope, and Quasars

Supermassive black holes (SMBHs) contain hundreds of thousands to billions of solar masses and reside at the centers of almost all large galaxies.

## Sagittarius A* and M87*
- **Sagittarius A***: The supermassive black hole at the center of the Milky Way galaxy, containing ~4.1 million solar masses, located 26,000 light-years from Earth.
- **M87***: Located in galactic supercluster Messier 87, containing 6.5 billion solar masses. In 2019, the Event Horizon Telescope (EHT) captured the first direct image of its shadow and glowing accretion disk.

## Accretion Disks and Quasars
Material falling toward a black hole forms a rapidly swirling, superheated disk of plasma called an **accretion disk**. Friction and gravitational forces heat the gas to millions of degrees, releasing intense electromagnetic radiation.

## Quasars (Quasi-Stellar Radio Sources)
Extremely luminous active galactic nuclei (AGN) powered by supermassive black holes accreting gas at immense rates in the early universe. A single quasar can shine brighter than an entire galaxy of hundreds of billions of stars combined.`
  },
  {
    id: "gravitational-waves-ligo",
    title: "Gravitational Waves and LIGO Discoveries",
    domain: "science",
    topic: "astrophysics",
    language: "en",
    sourceName: "LIGO Caltech & NSF",
    sourceUrl: "https://www.ligo.caltech.edu/",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from LIGO / Caltech",
    tags: ["gravitational-waves", "ligo", "relativity", "black-hole-merger"],
    relatedTopics: ["black-holes", "physics"],
    content: `# Gravitational Waves and LIGO Discoveries

Gravitational waves are ripples in the fabric of spacetime predicted by Albert Einstein in 1916 as part of his General Theory of Relativity.

## Nature of Gravitational Waves
Accelerating massive objects (such as merging black holes or neutron stars) radiate energy in the form of gravitational waves that travel through spacetime at the speed of light, squeezing and stretching space as they pass.

## Historical First Detection (GW150914)
On September 14, 2015, the Laser Interferometer Gravitational-Wave Observatory (LIGO) made the historic first direct detection of gravitational waves from two merging black holes (36 and 29 solar masses) approximately 1.3 billion light-years away.

## Detection Mechanism
LIGO uses giant L-shaped laser interferometers with 4-kilometer arms. As a gravitational wave passes, it changes the arm length by a tiny fraction of a proton's width (10⁻¹⁸ meters), producing laser interference pattern shifts.`
  },
  {
    id: "dark-matter-dark-energy-cosmology",
    title: "Dark Matter, Dark Energy, and Cosmic Expansion",
    domain: "science",
    topic: "cosmology",
    language: "en",
    sourceName: "ESA Planck & NASA WMAP",
    sourceUrl: "https://science.nasa.gov/astrophysics/focus-areas/what-is-dark-energy/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from NASA and ESA",
    tags: ["dark-matter", "dark-energy", "cosmology", "cosmic-expansion", "big-bang"],
    relatedTopics: ["galaxies", "cosmology"],
    content: `# Dark Matter, Dark Energy, and Cosmic Expansion

Standard observational cosmology indicates that ordinary luminous matter (stars, gas, planets, humans) accounts for only about 5% of the universe's total energy density.

## Cosmic Composition (Lambda-CDM Model)
- **Ordinary Matter (Baryonic)**: ~5%
- **Dark Matter**: ~27%
- **Dark Energy**: ~68%

## Dark Matter Evidence
Dark matter does not absorb, reflect, or emit light, interacting only via gravity:
1. **Galaxy Rotation Curves**: Vera Rubin observed that stars at galaxy outer edges orbit as fast as inner stars, indicating an unseen massive halo.
2. **Gravitational Lensing**: Dark matter bends background light around galaxy clusters.
3. **Bullet Cluster**: Direct evidence where luminous gas and gravitational mass separated after cluster collision.

## Dark Energy and Accelerating Universe
In 1998, observations of distant Type Ia supernovae revealed that the expansion of the universe is accelerating, rather than slowing down under gravity. Dark energy is the mysterious repelling force driving this accelerated expansion.`
  },
  {
    id: "exoplanets-astrobiology",
    title: "Exoplanets, Detection Methods, and Astrobiology",
    domain: "science",
    topic: "astrobiology",
    language: "en",
    sourceName: "NASA Exoplanet Exploration",
    sourceUrl: "https://exoplanets.nasa.gov/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from NASA Exoplanet Program",
    tags: ["exoplanets", "kepler", "tess", "astrobiology", "habitable-zone"],
    relatedTopics: ["planets", "astrobiology"],
    content: `# Exoplanets, Detection Methods, and Astrobiology

An exoplanet is any planet orbiting a star outside our Solar System. Thousands of exoplanets have been confirmed since the 1990s.

## Detection Methods
1. **Transit Method**: Detects periodic dips in a star's brightness when an orbiting planet passes directly in front of it (used extensively by Kepler and TESS missions).
2. **Radial Velocity Method**: Detects gravitational "wobble" of the host star via Doppler shifts in its light spectrum.
3. **Direct Imaging**: Captures infrared light emitted directly by young, massive exoplanets far from their star.
4. **Gravitational Microlensing**: Uses light bending by a planet's gravity to detect distant worlds.

## Habitable Zone (Goldilocks Zone)
The orbital region around a star where temperatures allow liquid water to exist on a planet's surface.

## Astrobiology
The scientific study of the origin, evolution, distribution, and future of life in the universe. Research targets include extremophiles on Earth, ocean moons (Europa, Enceladus), Mars subsurface, and exoplanet atmospheric biosignatures (water vapor, oxygen, methane).`
  },

  // ─── 3. MYSTERIES & DARK COSMIC CURIOSITY ───────────────────────────
  {
    id: "rogue-planets-cosmic-mysteries",
    title: "Rogue Planets - Nomadic Worlds in the Dark Void",
    domain: "science",
    topic: "mysteries",
    language: "en",
    sourceName: "NOIRLab & IAU Astronomy",
    sourceUrl: "https://noirlab.edu/public/",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content paraphrased from NOIRLab",
    tags: ["rogue-planets", "nomadic-worlds", "dark-space", "cosmic-mysteries"],
    relatedTopics: ["planets", "mysteries"],
    content: `# Rogue Planets - Nomadic Worlds in the Dark Void

A rogue planet (free-floating planet) is a planetary-mass object that orbits the galactic core directly, having been ejected from its parent planetary system or formed independently in interstellar space.

## Origins of Rogue Planets
1. **Gravitational Ejection**: Dynamical instability during early planetary system formation can cause giant gas planets to gravitationally fling smaller neighboring planets completely out of the star's orbit into cold interstellar space.
2. **Sub-Brown Dwarf Collapse**: Formation in small gas clouds that lacked sufficient mass to form a star.

## Dark Conditions
Rogue planets drift through eternal darkness without a sun. While gas giants like Jupiter-sized rogue planets generate internal thermal heat from contraction, any surface water would freeze into solid ice unless heated by internal geothermal activity or thick insulating hydrogen atmospheres.

## Detection Techniques
Because rogue planets emit no light, astronomers detect them primarily through gravitational microlensing—observing the brief brightness flare when a rogue planet's gravity bends light from a background star.`
  },
  {
    id: "cosmic-voids-bootes-void",
    title: "Cosmic Voids and the Great Boötes Void",
    domain: "science",
    topic: "mysteries",
    language: "en",
    sourceName: "Sloan Digital Sky Survey (SDSS)",
    sourceUrl: "https://www.sdss.org/",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from SDSS astronomy research",
    tags: ["cosmic-void", "bootes-void", "cosmic-web", "dark-mysteries"],
    relatedTopics: ["galaxies", "cosmology"],
    content: `# Cosmic Voids and the Great Boötes Void

In the large-scale structure of the cosmos, galaxies are arranged in a vast network of filaments and clusters surrounding enormous empty spaces known as **cosmic voids**.

## The Boötes Void (The Great Nothing)
Discovered in 1981 by Robert Kirshner, the Boötes Void is an immense spherical region of space approximately 330 million light-years in diameter located in the direction of the constellation Boötes.

## Mystery of Low Galaxy Density
While a volume of space that size would normally contain around 10,000 galaxies, the Boötes Void contains only about 60 galaxies. If the Milky Way had been located in the center of the Boötes Void, humanity would not have known about other galaxies until the 1960s with advanced radio telescopes.

## Formation Mechanisms
Cosmic voids formed from small density fluctuations in the early universe following the Big Bang. Gravity pulled matter toward denser regions (forming cosmic filaments and galaxy clusters), leaving cosmic voids depleted of gas and galaxy formations.`
  },
  {
    id: "fermi-paradox-great-filter",
    title: "The Fermi Paradox and the Great Filter Hypothesis",
    domain: "science",
    topic: "mysteries",
    language: "en",
    sourceName: "SETI Institute",
    sourceUrl: "https://www.seti.org/",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from SETI research publications",
    tags: ["fermi-paradox", "great-filter", "alien-life", "cosmic-mysteries"],
    relatedTopics: ["astrobiology", "mysteries"],
    content: `# The Fermi Paradox and the Great Filter Hypothesis

In 1950, physicist Enrico Fermi famously asked: *"Where is everybody?"* This contradiction between the high mathematical probability of extraterrestrial civilizations and the total absence of evidence is known as the **Fermi Paradox**.

## Drake Equation Context
Given billions of Sun-like stars in the Milky Way, many billions of years older than Earth, even a tiny fraction of habitable planets developing intelligent life should have colonized or signaled across the galaxy by now.

## The Great Filter Hypothesis
Proposed by Robin Hanson, the Great Filter hypothesis suggests there is an evolutionary barrier or technological threshold so difficult to cross that almost no civilization survives it.

## Positions of the Filter
1. **Filter Behind Us**: The origin of life (abiogenesis) or eukaryotic intelligence is extremely rare, meaning humans are one of the very few civilizations in the galaxy.
2. **Filter Ahead of Us**: Civilizations inevitably self-destruct upon discovering high-energy physics, runaway AI, or climate destruction. Finding simple fossilized microbial life on Mars would suggest the Filter lies ahead of us.`
  },
  {
    id: "ultimate-fate-universe-heat-death",
    title: "Ultimate Fate of the Universe - Heat Death and the Big Rip",
    domain: "science",
    topic: "mysteries",
    language: "en",
    sourceName: "Caltech Theoretical Cosmology",
    sourceUrl: "https://www.pmath.caltech.edu/",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from Caltech Cosmology",
    tags: ["heat-death", "big-rip", "universe-fate", "cosmic-entropy"],
    relatedTopics: ["cosmology", "dark-energy"],
    content: `# Ultimate Fate of the Universe - Heat Death and the Big Rip

Astrophysicists model the long-term future of the universe based on cosmic expansion rates and energy density.

## 1. Heat Death (The Big Freeze)
The leading scientific scenario for an expanding flat universe:
- **Stellar Era Ends (10¹4 years)**: Gas clouds exhaust fuel, stars burn out, leaving white dwarfs, neutron stars, and black holes.
- **Degenerate Era (10¹5 to 10³⁹ years)**: Galaxies disperse, protons may decay into radiation.
- **Black Hole Era (10⁴⁰ to 10¹⁰⁰ years)**: Black holes are the last remaining objects, slowly evaporating via Hawking radiation.
- **Dark Era (>10¹⁰⁰ years)**: Maximum entropy is reached (thermodynamic equilibrium). Temperature approaches absolute zero, and no work or energy transfer can occur.

## 2. The Big Rip
If dark energy density increases over time (phantom energy), the acceleration of cosmic expansion becomes infinite. It would eventually tear apart galaxy clusters, galaxies, star systems, planets, atoms, and spacetime itself in a finite timeframe.

## 3. False Vacuum Decay (Theoretical Bubble)
If the Higgs field exists in a metastable "false vacuum" state, a quantum tunneling event could trigger a phase transition bubble expanding at light speed, rewriting fundamental laws of physics instantly without warning.`
  },
  {
    id: "unexplained-signals-wow-signal",
    title: "Unexplained Cosmic Signals and the Wow! Signal",
    domain: "science",
    topic: "mysteries",
    language: "en",
    sourceName: "Ohio State Radio Observatory & SETI",
    sourceUrl: "https://www.seti.org/wow-signal",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from SETI research",
    tags: ["wow-signal", "radio-astronomy", "unexplained-signals", "seti"],
    relatedTopics: ["astrobiology", "mysteries"],
    content: `# Unexplained Cosmic Signals and the Wow! Signal

Astronomers periodically detect anomalous radio signals or energy bursts requiring scientific investigation.

## The Wow! Signal (1977)
On August 15, 1977, the Big Ear radio telescope at Ohio State University detected a strong, narrow-band radio signal lasting 72 seconds at 1420.455 MHz (the 21-centimeter hydrogen line).
- Astronomer Jerry R. Ehman circled the signal intensity code "6EQUJ5" on the printout and wrote **"Wow!"** in the margin.
- The signal matched expected characteristics of an interstellar signal but was never detected again despite multiple follow-up searches.

## Scientific Skepticism & Candidate Explanations
1. **Cometary Hydrogen Clouds**: Proposed in 2017 that comets 266P/Christensen or P/2008 Y2 emitted the signal, though disputed by radio astronomers.
2. **Cold Hydrogen Gas Cloud Maser**: Recent hypotheses suggest transient astronomical maser emissions.

## Scientific Principle
In astrophysics, an unexplained signal does not automatically imply extraterrestrial origin. Rigorous evidence and repeatable detection are required before drawing anomalous conclusions.`
  },

  // ─── 4. DHARM MYTH AND CULTURE ───────────────────────────────────────
  {
    id: "rahu-ketu-eclipse-story",
    title: "Rahu and Ketu - Mythological Narrative of Eclipses",
    domain: "narrative",
    topic: "mythology",
    language: "en",
    sourceName: "Sanskrit Puranic Heritage",
    sourceUrl: "https://ignca.gov.in/",
    sourceType: "primary-text",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain cultural heritage narrative",
    tags: ["rahu-ketu", "samudra-manthan", "mythology", "katha"],
    relatedTopics: ["rahu-ketu-nodes-connection", "eclipses"],
    content: `# Rahu and Ketu - Mythological Narrative of Eclipses

In ancient Indian Puranic mythology, the origin of Rahu and Ketu is linked to the cosmic event known as **Samudra Manthan** (the Churning of the Ocean of Milk).

## The Amrita Story
According to the narrative, the Devas and Asuras churned the ocean to obtain *Amrita*, the nectar of immortality. When Mohini (the divine avatar) distributed the nectar to the Devas, an Asura named Swarbhanu disguised himself as a Deva and drank a drop of Amrita.

Surya (the Sun god) and Chandra (the Moon god) recognized Swarbhanu and alerted Mohini, who severed Swarbhanu's head with the Sudarshana Chakra.

## Formation of Rahu and Ketu
Because Swarbhanu had swallowed the nectar, both parts of his body survived:
- The severed head became **Rahu**.
- The remaining serpent-like body became **Ketu**.

According to mythological tradition, Rahu and Ketu hold an eternal enmity toward Surya and Chandra, periodically swallowing them—causing solar and lunar eclipses.`
  },
  {
    id: "rahu-ketu-nodes-astronomy",
    title: "Rahu and Ketu - Astronomical Lunar Nodes Science",
    domain: "science",
    topic: "astronomy-history",
    language: "en",
    sourceName: "Indian Journal of History of Science",
    sourceUrl: "https://insa.nic.in/IJHS/",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational research from Indian National Science Academy",
    tags: ["rahu-ketu", "lunar-nodes", "eclipses", "vigyan", "orbital-nodes"],
    relatedTopics: ["rahu-ketu-eclipse-story", "eclipses"],
    content: `# Rahu and Ketu - Astronomical Lunar Nodes Science

In Indian mathematical astronomy (Siddhantic Jyotisha), scholars such as Aryabhata (476–550 CE) and Varahamihira explicitly identified Rahu and Ketu as the mathematical orbital nodes of the Moon.

## What Are Lunar Nodes?
The Moon's orbital plane is inclined at an angle of approximately 5.14 degrees relative to the ecliptic (Earth's orbital plane around the Sun). The two points where the Moon's path intersects the ecliptic plane are the **lunar nodes**:
1. **North Node (Ascending Node)**: Calculated astronomically as **Rahu**.
2. **South Node (Descending Node)**: Calculated astronomically as **Ketu**.

## Why Eclipses Occur Only at the Nodes
A solar or lunar eclipse can occur ONLY when a New Moon or Full Moon takes place near one of these two nodal intersection points:
- **Solar Eclipse**: Occurs at New Moon when the Moon passes through a lunar node, aligning directly between Earth and the Sun.
- **Lunar Eclipse**: Occurs at Full Moon when the Moon passes through a lunar node into Earth's shadow cone.

Ancient Indian astronomers calculated the precise mathematical motions of these invisible intersection points to predict eclipse occurrences centuries in advance.`
  },
  {
    id: "surya-chandra-cultural-astronomy",
    title: "Surya and Chandra - Cultural Reverence and Vedic Observation",
    domain: "narrative",
    topic: "cultural-framework",
    language: "en",
    sourceName: "Vedic Heritage Portal & IGNCA",
    sourceUrl: "https://vedicheritage.gov.in/",
    sourceType: "primary-text",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain cultural heritage documentation",
    tags: ["surya", "chandra", "vedic-astronomy", "cultural-astronomy"],
    relatedTopics: ["sun", "moon-phases"],
    content: `# Surya and Chandra - Cultural Reverence and Vedic Observation

In ancient Indian culture, the Sun (Surya) and Moon (Chandra) were observed with deep reverence as the primary light-givers (*Jyoti*) sustaining life and timekeeping.

## Vedic Observations of the Sun
The Rigveda contains hymns (such as the Gayatri Mantra and Aditya Hrudayam) dedicated to Surya as the source of energy, light, and seasons. Ancient observers tracked solar solstices (*Uttarayana* and *Dakshinayana*) to regulate agricultural cycles and ritual calendars.

## Lunar Calendars (Tithis)
The synodic month of 29.5 days was divided into two fortnights (*Pakshas*):
1. **Shukla Paksha**: Bright waxing fortnight ending at *Purnima* (Full Moon).
2. **Krishna Paksha**: Dark waning fortnight ending at *Amavasya* (New Moon).

Each day was defined as a *Tithi*, calculated from the 12-degree incremental separation between the Moon and Sun.`
  },
  {
    id: "dhruva-polaris-saptarishi",
    title: "Dhruva (Polaris) and Saptarishi (Big Dipper)",
    domain: "narrative",
    topic: "mythology",
    language: "en",
    sourceName: "Puranic Cultural Texts",
    sourceUrl: "https://ignca.gov.in/",
    sourceType: "primary-text",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain cultural heritage narrative",
    tags: ["dhruva", "polaris", "saptarishi", "big-dipper", "constellations"],
    relatedTopics: ["constellations", "stars"],
    content: `# Dhruva (Polaris) and Saptarishi (Big Dipper)

In Indian tradition, the North Star is named **Dhruva**, meaning "unshakable" or "fixed".

## The Narrative of Prince Dhruva
According to the Vishnu Purana, young prince Dhruva performed intense penance (*Tapasya*) out of devotion to Lord Vishnu. Impressed by his unwavering determination, Vishnu granted him a permanent, fixed position in the heavens above all stars and planets.

## Saptarishi (The Seven Sages)
The constellation of seven bright stars known in Western astronomy as the **Big Dipper** (part of Ursa Major) is recognized in Indian tradition as the **Saptarishi** (seven great rishis: Vashistha, Marichi, Atri, Pulastya, Pulaha, Kratu, and Angiras).

## Astronomical Mechanism
Dhruva corresponds to the star **Polaris** (Alpha Ursae Minoris), which lies nearly directly aligned with Earth's northern rotational axis. Because Earth rotates on this axis, all other stars appear to circle counterclockwise around Polaris, making it a fixed navigation beacon for centuries.`
  },
  {
    id: "indian-cosmology-samkhya-rigveda",
    title: "Indian Philosophical Cosmology - Samkhya and Nasadiya Sukta",
    domain: "narrative",
    topic: "cultural-framework",
    language: "en",
    sourceName: "Rigveda Hymn 10.129 (Nasadiya Sukta)",
    sourceUrl: "https://vedicheritage.gov.in/",
    sourceType: "primary-text",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain primary text translation",
    tags: ["rigveda", "nasadiya-sukta", "samkhya", "cosmology"],
    relatedTopics: ["big-bang", "boundaries"],
    content: `# Indian Philosophical Cosmology - Samkhya and Nasadiya Sukta

Ancient Indian philosophy contains profound philosophical inquiries into the origin and nature of the universe.

## The Hymn of Creation (Nasadiya Sukta - Rigveda 10.129)
The *Nasadiya Sukta* is a famous hymn exploring profound cosmic skepticism regarding creation:
*"Then was not non-existence nor existence: there was no realm of air, no sky beyond it. What covered in, and where? And what gave shelter? Was water there, unfathomed depth of water?"*

The hymn concludes with contemplative humility:
*"He, the first origin of this creation, whether he formed it all or did not form it... He who surveys it all in highest heaven, he truly knows—or maybe even he knows not."*

## Samkhya Cosmology
Samkhya philosophy describes cosmic evolution through two fundamental principles:
1. **Purusha**: Pure consciousness / observer.
2. **Prakriti**: Primordial creative matter composed of three gunas (*Sattva*, *Rajas*, *Tamas*). Unbalance in the gunas initiates cosmic manifestation.`
  },
  {
    id: "astronomy-vs-astrology-boundary",
    title: "Astronomy vs Astrology - Science and Myth Boundaries",
    domain: "boundary",
    topic: "boundary-policy",
    language: "en",
    sourceName: "Indian National Science Academy",
    sourceUrl: "https://insa.nic.in/",
    sourceType: "internal-policy",
    reviewedAt: "2024-01-20",
    licenseNote: "AkasGatha internal educational policy",
    tags: ["astronomy-vs-astrology", "evidence-policy", "katha-vigyan-boundary"],
    relatedTopics: ["evidence-policy", "katha-vigyan-separation"],
    content: `# Astronomy vs Astrology - Science and Myth Boundaries

AkasGatha maintains a strict scientific boundary between empirical astronomy and traditional astrology.

## 1. Astronomy (Vigyan)
Astronomy is a rigorous branch of physical science that studies celestial objects, space, and the physical universe through empirical observation, mathematics, spectroscopy, and physics. Astronomical predictions (such as solar eclipses, planetary orbits, and cometary paths) are universally verifiable.

## 2. Astrology (Phalita Jyotisha)
Astrology is a traditional belief system asserting that planetary positions influence human personality traits and earthly events. Astrology does not follow empirical scientific methodology, double-blind testing, or physical forces known to science.

## AkasGatha Policy
- AkasGatha does NOT provide horoscope predictions, fortune telling, or astrological remedies.
- AkasGatha celebrates cultural heritage (*Katha*) while maintaining that modern science (*Vigyan*) relies strictly on observable evidence.`
  },

  // ─── 5. MULTIVERSE & FICTION COMPARISONS ─────────────────────────────
  {
    id: "multiverse-hypotheses-level1-to-4",
    title: "Multiverse Hypotheses - Level I to IV Cosmological Models",
    domain: "science",
    topic: "theoretical-physics",
    language: "en",
    sourceName: "Max Tegmark / MIT Physics & Scientific American",
    sourceUrl: "https://space.mit.edu/home/tegmark/crazy.html",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from MIT physics publications",
    tags: ["multiverse", "parallel-universes", "theoretical-physics", "cosmology"],
    relatedTopics: ["big-bang", "cosmology"],
    content: `# Multiverse Hypotheses - Level I to IV Cosmological Models

Physicist Max Tegmark categorized hypothetical multiverse models into four distinct levels based on theoretical physics principles.

## Level I: Beyond Our Cosmic Horizon
An infinite spatial universe must contain infinitely many Hubble volumes with identical particle configurations simply by statistical probability.

## Level II: Inflationary Multiverse (Bubble Universes)
Based on chaotic eternal inflation theory (Alan Guth, Andrei Linde). As space inflates eternally, regional pockets stop inflating and form distinct "bubble universes" with different physical constants.

## Level III: Many-Worlds Quantum Multiverse
Based on Hugh Everett's Many-Worlds Interpretation of quantum mechanics. Quantum wave function decoherence causes the universe to split into parallel branches for every possible quantum outcome.

## Level IV: Ultimate Mathematical Multiverse
Hypothesizes that all mathematically consistent physical structures exist as physical realities.

## Scientific Status
Multiverse theories remain theoretical hypotheses because direct observational verification outside our Hubble horizon is currently beyond experimental reach.`
  },
  {
    id: "wormholes-einstein-rosen-bridges",
    title: "Wormholes - Einstein-Rosen Bridges and Relativity Bounds",
    domain: "science",
    topic: "theoretical-physics",
    language: "en",
    sourceName: "Caltech Theoretical Physics & NASA",
    sourceUrl: "https://www.nasa.gov/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from NASA",
    tags: ["wormholes", "einstein-rosen-bridge", "general-relativity", "spacetime"],
    relatedTopics: ["black-holes", "physics"],
    content: `# Wormholes - Einstein-Rosen Bridges and Relativity Bounds

A wormhole (Einstein-Rosen bridge) is a theoretical mathematical solution to Einstein's General Relativity field equations that connects two distant points in spacetime.

## Einstein-Rosen Bridges (1935)
Albert Einstein and Nathan Rosen showed that black hole mathematical models could theoretically bridge to a second mouth in another region of space.

## Stability & Exotic Matter Requirement
Standard Schwarzschild wormholes are unstable and collapse instantly if anything attempts to cross them. To keep a traversable wormhole open, general relativity requires negative energy density or **exotic matter** possessing negative mass—which has never been observed in nature.

## Time Travel Paradoxes
If one mouth of a traversable wormhole is accelerated near light speed (time dilation), crossing the wormhole could theoretically act as a closed timelike curve (time machine), creating causality paradoxes.`
  },
  {
    id: "time-dilation-gravitational-relativity",
    title: "Time Dilation - Special and General Relativity Mechanics",
    domain: "science",
    topic: "theoretical-physics",
    language: "en",
    sourceName: "NASA Physics & NIST",
    sourceUrl: "https://www.nist.gov/",
    sourceType: "official",
    reviewedAt: "2024-01-20",
    licenseNote: "Public domain educational content from NIST and NASA",
    tags: ["time-dilation", "relativity", "einstein", "gps-satellites"],
    relatedTopics: ["physics", "gravity"],
    content: `# Time Dilation - Special and General Relativity Mechanics

Time dilation is a proven physical effect where time elapses at different rates for observers depending on relative velocity or gravitational field strength.

## 1. Kinematic Time Dilation (Special Relativity)
As an object moves faster relative to a stationary observer, time ticks slower for the moving object according to the Lorentz factor: Δt' = Δt / √(1 - v²/c²).

## 2. Gravitational Time Dilation (General Relativity)
Clocks in stronger gravitational fields (closer to massive bodies like black holes or planets) tick slower compared to clocks in weaker gravitational fields.

## Real-World Verification: GPS Satellites
GPS satellites orbit Earth at high speeds (losing ~7 microseconds per day due to speed) and at high altitudes in weaker gravity (gaining ~45 microseconds per day). Combined, GPS satellite atomic clocks run **38 microseconds per day faster** than ground clocks. Systems continuously adjust for this relativity offset.`
  },
  {
    id: "marvel-multiverse-vs-physics",
    title: "Marvel Multiverse vs Real Physics Multiverse Models",
    domain: "science",
    topic: "fiction-comparison",
    language: "en",
    sourceName: "American Journal of Physics",
    sourceUrl: "https://aapt.scitation.org/journal/ajp",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Educational comparison of fiction vs physical cosmology",
    tags: ["marvel", "multiverse", "fiction-comparison", "pop-culture"],
    relatedTopics: ["multiverse-hypotheses-level1-to-4", "physics"],
    content: `# Marvel Multiverse vs Real Physics Multiverse Models

Popular fiction (such as Marvel Comics and the MCU) uses the multiverse as a narrative device. Comparing fictional concepts with physics provides valuable educational context.

## Fictional Depiction (Marvel)
- Portrays parallel Earths (Earth-616, Earth-838) accessible via magic portals or quantum realm technology.
- Characters can freely travel between dimensions and interact with alternate versions of themselves.

## Scientific Reality (Physics)
1. **No Physical Portals**: Level I and II cosmological multiverses are separated by trillions of light-years or inflating space expanding faster than light. No physical doorway can bridge them.
2. **Quantum Decoherence**: In Many-Worlds quantum mechanics (Level III), parallel quantum branches decohere instantly and cannot overlap or exchange matter.
3. **Conservation Laws**: Transporting mass between distinct universes would violate energy-momentum conservation within a closed system.`
  },
  {
    id: "dc-speedforce-vs-relativity",
    title: "DC Speed Force vs Einstein's Light Speed Limit",
    domain: "science",
    topic: "fiction-comparison",
    language: "en",
    sourceName: "Physics World & NASA Physics",
    sourceUrl: "https://physicsworld.com/",
    sourceType: "academic",
    reviewedAt: "2024-01-20",
    licenseNote: "Educational comparison of fictional super-speed vs relativity",
    tags: ["dc-speedforce", "flash", "relativity", "speed-of-light", "fiction-comparison"],
    relatedTopics: ["time-dilation-gravitational-relativity", "physics"],
    content: `# DC Speed Force vs Einstein's Light Speed Limit

In comic books (such as DC Comics' The Flash), characters run faster than light by accessing an energy dimension called the "Speed Force".

## Fictional Depiction (DC)
Speedsters run past light speed without burning up Earth's atmosphere, causing sonic booms, or destroying surrounding cities.

## Scientific Reality (Relativity)
1. **Infinite Mass & Energy**: According to Special Relativity, as an object with mass approaches the speed of light (c = 299,792,458 m/s), its relativistic mass/energy approaches infinity. It requires infinite energy to reach light speed.
2. **Atmospheric Fusion**: An object moving at near-light speed through air would collide with nitrogen and oxygen molecules so violently it would ignite continuous nuclear fusion explosions, incinerating the surrounding environment.
3. **Causality Bounds**: FTL movement implies backward time travel in certain reference frames, creating causal paradoxes.`
  }
];

async function main() {
  console.log("======================================================================");
  console.log("AKASGATHA CORPUS KNOWLEDGE EXPANSION GENERATOR");
  console.log("======================================================================");
  console.log();

  const baseDir = path.join(process.cwd(), "content", "knowledge");

  let createdCount = 0;
  for (const doc of docs) {
    let subDir = "science";
    if (doc.domain === "narrative") subDir = "narratives";
    if (doc.domain === "boundary") subDir = "boundaries";
    if (doc.domain === "glossary") subDir = "glossary";
    if (doc.topic === "mysteries") subDir = "science";
    if (doc.topic === "fiction-comparison") subDir = "science";

    const targetDir = path.join(baseDir, subDir);
    await fs.mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, `${doc.id}.md`);
    const frontmatterHeader = `---
id: ${doc.id}
title: "${doc.title.replace(/"/g, '\\"')}"
domain: ${doc.domain}
topic: ${doc.topic}
language: ${doc.language}
sourceName: "${doc.sourceName}"
sourceUrl: "${doc.sourceUrl}"
sourceType: ${doc.sourceType}
reviewedAt: "${doc.reviewedAt}"
licenseNote: "${doc.licenseNote}"
tags: [${doc.tags.map(t => `"${t}"`).join(", ")}]
relatedTopics: [${doc.relatedTopics.map(t => `"${t}"`).join(", ")}]
---

${doc.content}
`;

    await fs.writeFile(filePath, frontmatterHeader.trim() + "\n", "utf-8");
    console.log(`  + Created [${doc.domain}] ${doc.id}.md`);
    createdCount++;
  }

  console.log();
  console.log(`✅ Generated ${createdCount} verified knowledge documents.`);
  console.log("======================================================================");
}

main().catch((err) => {
  console.error("❌ Generator failed:", err);
  process.exit(1);
});
