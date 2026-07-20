
const fs = require('fs');
let file = fs.readFileSync('src/components/visual/InteractiveSpaceModel.tsx', 'utf8');

const names = [
  'CosmicGate', 'PlanetOrbit', 'EclipseAlignment', 'MoonPhase', 
  'StarMap', 'KnowledgeLibrary', 'QuestionOrb', 'EvidenceGrid', 
  'TelescopeView', 'ConstellationPath', 'MysteryOrb', 'CelestialCycle', 
  'SatelliteOrbit', 'StoryOrbit', 'ScienceLens', 'TruthBridge'
];

let i = 0;
file = file.replace(/function CosmicGate\(\) \{/g, (match) => {
  if (i < names.length) {
    return 'function ' + names[i++] + '() {';
  }
  return match;
});

fs.writeFileSync('src/components/visual/InteractiveSpaceModel.tsx', file);

