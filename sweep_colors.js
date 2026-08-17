const fs = require('fs');
const path = require('path');

const dir = __dirname;
let touchedFiles = new Set();
let replacedHexes = new Set();

const REDS = [
  '#8C1C13', '#5E130D', '#8B1E1E', '#dc2626', '#c0392b', '#d32f2f', '#dc3545',
  '#8c1c13', '#5e130d', '#8b1e1e'
];
const OLIVES = ['#556B2F', '#808000', '#6B8E23', '#556b2f', '#808000', '#6b8e23'];

function replaceInFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace hardcoded reds in HTML/CSS with var(--color-accent)
  // Or in some cases we want to use the accent color token.
  REDS.forEach(red => {
    if (content.includes(red)) {
      content = content.replaceAll(red, 'var(--color-accent)');
      replacedHexes.add(red);
      touchedFiles.add(file);
    }
  });

  // Replace olive greens
  OLIVES.forEach(olive => {
    if (content.includes(olive)) {
      content = content.replaceAll(olive, 'var(--color-ink-muted)');
      replacedHexes.add(olive);
      touchedFiles.add(file);
    }
  });

  // Since we also want to remove inline colors if they are red, let's use regex
  // Find style="color: #...;" or style="background-color: #...;"
  const regexRed = /#(8[A-C][0-9A-F]{4}|[dD][c-fC-F][0-9A-F]{4}|[cC]0[0-9A-F]{4})/g;
  let match;
  while ((match = regexRed.exec(content)) !== null) {
      if (!replacedHexes.has(match[0])) {
        // Just let regex replace them
        replacedHexes.add(match[0]);
      }
  }
  content = content.replace(regexRed, 'var(--color-accent)');
  if (originalContent !== content) {
    touchedFiles.add(file);
  }

  // Also replace any specific text classes in HTML
  if (file.endsWith('.html')) {
    // "Md. Imran Khan Lincoln" text is inside <span class="hero-name-accent">
    // Wait, hero-name-accent is defined in CSS, I will fix it in CSS.
    
    // "Customer Experience." subtitle
    // Usually <p class="hero-subtitle"> or something
    if (content.includes('hero-subtitle') && content.includes('text-primary')) {
      content = content.replace(/class="([^"]*)text-primary([^"]*)"/g, 'class="$1text-ink-muted$2"');
    }
  }

  if (originalContent !== content) {
    fs.writeFileSync(file, content);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
      walk(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  });
}

walk(dir);
console.log(JSON.stringify({touched: Array.from(touchedFiles), hexes: Array.from(replacedHexes)}));
