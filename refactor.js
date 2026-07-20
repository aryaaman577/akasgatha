const fs = require('fs');
let file = fs.readFileSync('src/components/visual/InteractiveSpaceModel.tsx', 'utf8');

// Replace \`rotate( ${idle * X}deg )\` with \`rotate(calc(var(--idle) * X))\`
file = file.replace(/\$\{idle\s*\*\s*([\-\d\.]+)\}deg/g, 'calc(var(--idle) * $1)');
file = file.replace(/\$\{\-idle\s*\*\s*([\-\d\.]+)\}deg/g, 'calc(var(--idle) * -$1)');

// Also handle naked idle: \${idle}deg
file = file.replace(/\$\{idle\}deg/g, 'var(--idle)');
file = file.replace(/\$\{\-idle\}deg/g, 'calc(var(--idle) * -1)');

// Remove idle prop passing: <CosmicGate idle={idle} /> -> <CosmicGate />
file = file.replace(/idle=\{idle\}/g, '');
file = file.replace(/\{ idle \}: \{ idle: number \}/g, '()');

// There is one tricky part: `idle` might still be used outside of string templates. Let's see if the code compiles after this.
fs.writeFileSync('src/components/visual/InteractiveSpaceModel.tsx', file);
