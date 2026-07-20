
const fs = require('fs');
let file = fs.readFileSync('src/components/visual/InteractiveSpaceModel.tsx', 'utf8');
file = file.replace(/function \(\) \{/g, 'function CosmicGate() {');
fs.writeFileSync('src/components/visual/InteractiveSpaceModel.tsx', file);

