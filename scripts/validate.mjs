import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const required = [
  'index.html',
  'backend.js',
  'config.js',
  'exercise-visuals-v11.js',
  'cardio-visuals-v12.js',
  'sw.js',
  'manifest.webmanifest',
  'vercel.json'
];

let failed = false;
const fail = (message) => { console.error(`✗ ${message}`); failed = true; };
const ok = (message) => console.log(`✓ ${message}`);

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) fail(`Fehlende Datei: ${file}`);
}
if (!failed) ok('Alle Pflichtdateien vorhanden');

const htmlPath = path.join(root, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]);
for (const ref of refs) {
  if (/^(https?:|data:|mailto:|tel:)/.test(ref) || ref.includes('${')) continue;
  const clean = ref.split('?')[0];
  if (!fs.existsSync(path.join(root, clean))) fail(`index.html referenziert fehlende Datei: ${clean}`);
}
ok('Lokale HTML-Referenzen geprüft');

for (const file of ['backend.js', 'config.js', 'exercise-visuals-v11.js', 'cardio-visuals-v12.js', 'sw.js']) {
  try {
    new vm.Script(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
    ok(`Syntax: ${file}`);
  } catch (error) {
    fail(`JavaScript-Syntaxfehler in ${file}: ${error.message}`);
  }
}

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1].trim())
  .filter(Boolean);
inlineScripts.forEach((code, i) => {
  try {
    new vm.Script(code, { filename: `index.html:inline-${i + 1}` });
    ok(`Syntax: index.html Inline-Script ${i + 1}`);
  } catch (error) {
    fail(`JavaScript-Syntaxfehler in index.html Inline-Script ${i + 1}: ${error.message}`);
  }
});

const textFiles = fs.readdirSync(root).filter(f => /\.(js|html|json|md)$/i.test(f));
const secretPatterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*['\"][^'\"]+['\"]?/i,
  /service_role\s*[:=]\s*['\"][A-Za-z0-9._-]{20,}/i
];
for (const file of textFiles) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) fail(`Möglicher privater Schlüssel in ${file}`);
  }
}
ok('Secret-Check ausgeführt');

try {
  JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
  JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  ok('JSON-Dateien valide');
} catch (error) {
  fail(`Ungültiges JSON: ${error.message}`);
}

if (failed) process.exit(1);
console.log('\nARC-Validierung erfolgreich.');
