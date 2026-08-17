const fs = require('fs');
const path = require('path');

const dir = __dirname;
const oldFontStr = 'family=DM+Sans:wght@400;500;700&family=Source+Sans+Pro:wght@400;600;700&family=Noto+Serif+Bengali:wght@100..900&display=swap';
const newFontStr = 'family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.html')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(dir, function(err, results) {
  if (err) throw err;
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(oldFontStr)) {
      content = content.replace(oldFontStr, newFontStr);
      fs.writeFileSync(file, content);
      console.log('Updated ' + file);
    }
  });
});
