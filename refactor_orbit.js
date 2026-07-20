const fs = require('fs');
let file = fs.readFileSync('src/components/visual/OrbitHeroVisual.tsx', 'utf8');

// Replace \`rotate( ${idle * X}deg )\` with \`rotate(calc(var(--idle) * X))\`
file = file.replace(/\$\{idle\s*\*\s*([\-\d\.]+)\}deg/g, 'calc(var(--idle) * $1)');
file = file.replace(/\$\{\-idle\s*\*\s*([\-\d\.]+)\}deg/g, 'calc(var(--idle) * -$1)');

// Also handle naked idle: \${idle}deg
file = file.replace(/\$\{idle\}deg/g, 'var(--idle)');
file = file.replace(/\$\{\-idle\}deg/g, 'calc(var(--idle) * -1)');

fs.writeFileSync('src/components/visual/OrbitHeroVisual.tsx', file);
