const fs = require('fs');

const cssFile = 'c:/Users/bird/Documents/imranvai/assets/css/style.css';
let content = fs.readFileSync(cssFile, 'utf8');

// 1. Stat badges: change number color from red to navy
content = content.replace(/\.stat strong \{\s*font-family:[^;]+;\s*font-size:[^;]+;\s*color:\s*var\(--color-accent\);/g, 
  (match) => match.replace('var(--color-accent)', 'var(--color-navy)'));

content = content.replace(/\.about-teaser-badge-stat \.teaser-badge-number \{\s*font-size:[^;]+;\s*color:\s*var\(--color-accent\);/g,
  (match) => match.replace('var(--color-accent)', 'var(--color-navy)'));

content = content.replace(/\.about-float-badge-stat \.about-badge-number \{\s*font-family:[^;]+;\s*font-size:[^;]+;\s*color:\s*var\(--color-accent\);/g,
  (match) => match.replace('var(--color-accent)', 'var(--color-navy)'));

content = content.replace(/\.about-stats-row \.stat strong \{\s*font-family:[^;]+;\s*font-size:[^;]+;\s*color:\s*var\(--color-accent\);/g,
  (match) => match.replace('var(--color-accent)', 'var(--color-navy)'));

content = content.replace(/\.about-stats \.stat strong \{\s*font-family:[^;]+;\s*font-size:[^;]+;\s*color:\s*var\(--color-accent\);/g,
  (match) => match.replace('var(--color-accent)', 'var(--color-navy)'));

// 2. Buttons: 
// The user mentions hero-btn-primary and others. I'll replace color-accent with color-navy in hero-btn-primary and hero-btn-secondary.
content = content.replace(/\.hero-btn-primary \{\s*background:\s*var\(--color-accent\);/g,
  (match) => match.replace('var(--color-accent)', 'var(--color-navy)'));

content = content.replace(/\.hero-btn-primary:hover \{\s*background:\s*var\(--color-accent-dark\);/g,
  (match) => match.replace('var(--color-accent-dark)', 'var(--color-navy-2)'));

content = content.replace(/\.hero-btn-secondary \{\s*background:\s*transparent;\s*color:\s*var\(--color-accent\);\s*border-color:\s*var\(--color-accent\);/g,
  (match) => match.replace(/var\(--color-accent\)/g, 'var(--color-navy)'));

content = content.replace(/\.hero-btn-secondary:hover \{\s*background:\s*var\(--color-accent-soft\);\s*color:\s*var\(--color-accent-dark\);/g,
  (match) => '.hero-btn-secondary:hover {\n  background: var(--color-navy);\n  color: var(--color-bg);');

// Generic btn-primary and btn-ghost
// I already updated these but maybe I should ensure it's correct.
// The user said: primary CTA solid navy background cream text.
content = content.replace(/\.btn-primary \{\s*background:\s*var\(--color-navy\);\s*color:\s*var\(--color-bg\);\s*\}/g,
  '.btn-primary {\n  background: var(--color-navy);\n  color: var(--color-bg);\n}');

// 3. Fix the About section's background (olive green behind portrait)
// We already replaced OLIVEs in HTML and CSS with --color-ink-muted in the previous script!
// Let me verify if there's any #556B2F left or if it was an rgb/hsl value or an image.
// "Check the "About" section's olive/dark-green background behind the portrait — replace it with a color from the new token system (navy or a muted neutral) so it doesn't clash."
// What if it's an SVG? In `about-teaser-visual` or `hero-portrait`?
content = content.replace(/background:\s*linear-gradient\(135deg,\s*var\(--color-accent\),\s*var\(--color-accent-dark\)\);/g,
  'background: linear-gradient(135deg, var(--color-navy), var(--color-navy-2));');

content = content.replace(/background:\s*linear-gradient\(90deg,\s*var\(--color-accent\),\s*var\(--color-accent-dark\)\);/g,
  'background: linear-gradient(90deg, var(--color-navy), var(--color-navy-2));');

content = content.replace(/background:\s*linear-gradient\(135deg,\s*var\(--color-accent-soft\),\s*var\(--color-bg-alt\)\);/g,
  'background: linear-gradient(135deg, var(--color-bg-alt), var(--color-bg));');


// Write it back
fs.writeFileSync(cssFile, content);
console.log('Updated CSS badges and buttons');
