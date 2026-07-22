const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
const imports = [];
files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach(l => {
    const match = l.match(/import.*from\s+['"](.*)['"]/);
    if (match) {
      imports.push({ file: f, path: match[1] });
    }
  });
});

let foundIssue = false;

imports.filter(i => i.path.startsWith('.') || i.path.startsWith('@/')).forEach(i => {
  let targetPath = i.path;
  if (targetPath.startsWith('@/')) {
    targetPath = targetPath.replace('@/', './src/');
  } else {
    targetPath = path.resolve(path.dirname(i.file), targetPath);
  }
  
  let exists = false;
  const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '.css'];
  let actualMatch = '';
  
  // Case sensitive check
  const dirName = path.dirname(targetPath);
  const baseName = path.basename(targetPath);
  
  if (fs.existsSync(targetPath)) {
      exists = true;
  } else {
      for (const ext of exts) {
        if (fs.existsSync(targetPath + ext)) {
          exists = true;
          // check case sensitivity
          const resolvedDir = path.dirname(targetPath + ext);
          const resolvedBase = path.basename(targetPath + ext);
          if (fs.existsSync(resolvedDir)) {
             const filesInDir = fs.readdirSync(resolvedDir);
             if (!filesInDir.includes(resolvedBase)) {
                 console.log('CASE SENSITIVITY MISMATCH:', i.file, 'imports', i.path, 'but actual file is different case.');
                 foundIssue = true;
             }
          }
          break;
        }
      }
  }
  if (!exists) {
    console.log('Potential missing issue:', i.file, i.path);
  }
});
if (!foundIssue) console.log("No case sensitivity issues found.");
