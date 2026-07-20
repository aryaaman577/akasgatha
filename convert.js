const fs = require('fs');

let html = fs.readFileSync('C:/Users/amang/Desktop/akashgatha_designs/core dwar/index.html', 'utf8');

const bodyStart = html.indexOf('<main class="akas-dwar-section"');
const bodyEnd = html.indexOf('</main>') + 7;
let jsx = html.substring(bodyStart, bodyEnd);

// class -> className
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');

// SVG attributes camelCase
const svgAttrs = [
  'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-linecap', 
  'stroke-linejoin', 'transform-origin', 'color-interpolation-filters', 
  'stop-color', 'stop-opacity', 'pointer-events', 'preserveAspectRatio', 'viewBox'
];
svgAttrs.forEach(attr => {
  const camel = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
  jsx = jsx.replace(new RegExp(attr + '=', 'gi'), camel + '=');
});

// Fix style attributes
jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
  const styles = p1.split(';').filter(s => s.trim());
  const obj = {};
  styles.forEach(s => {
    let [key, val] = s.split(':');
    if(key && val) {
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      if (key.startsWith('--')) {
         key = `'${key.trim()}'`;
      }
      obj[key] = val.trim();
    }
  });
  return 'style={{ ' + Object.entries(obj).map(([k, v]) => `${k}: "${v}"`).join(', ') + ' }}';
});

// Self-close tags
jsx = jsx.replace(/<(stop|circle|path|ellipse|rect|feGaussianBlur|feMergeNode)([^>]*?)(?<!\/)>/g, '<$1$2 />');
// Some <path> might be <path d="..."></path>, let's just make sure there are no </path> etc for self closed ones.
jsx = jsx.replace(/<\/(stop|circle|path|ellipse|rect|feGaussianBlur|feMergeNode)>/g, '');

fs.writeFileSync('C:/Users/amang/Desktop/akashgatha/src/components/landing/FeatureGridJSX.txt', jsx);
console.log('Done');
