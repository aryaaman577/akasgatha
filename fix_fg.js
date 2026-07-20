const fs = require('fs');
let content = fs.readFileSync('C:/Users/amang/Desktop/akashgatha/src/components/landing/FeatureGrid.tsx', 'utf8');

// Fix style={{ -Orbit: "Xs" }} -> style={{ "--akash-orbit": "Xs" }}
// The original CSS used "--akash-orbit", "--akash-spin", etc., but the regex stripped the leading dashes.
// Pattern: style={{ -<Word>: "<value>" }}
// The CSS custom properties in the original were like: --akash-orbit, --akash-spin, etc.
// But looking at the actual HTML they were style="--orbit:38s" etc.
// After CSS->JSX conversion: style={{ -Orbit: "38s" }}
// We need: style={{ "--orbit": "38s" }}

// Fix: any style={{ -Key: "val" }} where Key starts with capital
// Actually looking at the original more carefully: style="animation-duration: var(--dur)" etc
// Let's see what patterns exist:
content = content.replace(/style=\{\{ -([A-Z][a-zA-Z]*): "([^"]+)" \}\}/g, (match, key, val) => {
  // Convert camelCase back to kebab: -Orbit -> --orbit, -Spin -> --spin, -Dur -> --dur
  const cssKey = '--' + key.replace(/([A-Z])/g, (m) => m.toLowerCase());
  return `style={{ "${cssKey}": "${val}" }}`;
});

// Also fix any tabindex="0" that wasn't converted (HTML attribute in JSX needs camelCase)
content = content.replace(/tabindex="0"/g, 'tabIndex={0}');

fs.writeFileSync('C:/Users/amang/Desktop/akashgatha/src/components/landing/FeatureGrid.tsx', content);
console.log('Fixed FeatureGrid.tsx style props');
