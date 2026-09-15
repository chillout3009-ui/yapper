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

try {
  const catalogMatch = html.match(/const EX=\[([\s\S]*?)\]\.map\(x=>\(\{id:x\[0\]/);
  if (!catalogMatch) {
    fail('Übungskatalog konnte nicht für den Visual-/Typ-Audit gelesen werden');
  } else {
    const catalog = [...catalogMatch[1].matchAll(/\['([a-z0-9_]+)','([^']*)','([^']*)','([^']*)','([^']*)'\]/g)]
      .map(m => ({ id: m[1], catDe: m[4], catEn: m[5] }));
    const strengthRows = ['row_cable', 'row_machine', 'row_bar', 'row_db'];
    for (const id of strengthRows) {
      const ex = catalog.find(x => x.id === id);
      if (!ex) fail(`Fehlende Kraft-Ruderübung im Katalog: ${id}`);
      if (/^(Rudern|Rowing)\s*·/.test(ex?.catDe || '') || /^(Rudern|Rowing)\s*·/.test(ex?.catEn || '')) {
        fail(`Kraft-Ruderübung fälschlich als Ausdauer kategorisiert: ${id}`);
      }
    }
    const buildBlockCode = html.match(/function buildBlock\(id,opts=\{\}\)\{[^\n]+\}/)?.[0] || '';
    if (!buildBlockCode.includes('isEnduranceExercise(id)')) fail('buildBlock nutzt nicht die explizite Ausdauer-Klassifikation');
    if (!html.includes("const ROW_STRENGTH_IDS=new Set(['row_cable','row_machine','row_bar','row_db'])")) fail('Schutzliste für Kraft-Ruderübungen fehlt');
    if (!html.includes('repairExerciseBlockKinds')) fail('Migration für bereits falsch gespeicherte Ruderblöcke fehlt');

    const visualText = fs.readFileSync(path.join(root, 'exercise-visuals-v11.js'), 'utf8');
    const handlerMatch = visualText.match(/const handlers=\{([\s\S]*?)\n\s*\};/);
    const handlerIds = new Set();
    if (handlerMatch) {
      for (const m of handlerMatch[1].matchAll(/(?:^|[,\n]\s*)(?:'([^']+)'|([A-Za-z0-9_]+))\s*:/g)) handlerIds.add(m[1] || m[2]);
    }
    const enduranceCategory = /^(Laufen|Running|Schwimmen|Swimming|Fahrrad|Cycling|Skaten|Skating|Rudern|Rowing|Wandern|Hiking)\s*·/;
    const compoundVisualIds = new Set(['chest_press', 'skater_hop', 'landmine_rot', 'cable_woodchop']);
    const missingVisuals = catalog
      .filter(x => !enduranceCategory.test(x.catDe) && !enduranceCategory.test(x.catEn))
      .map(x => x.id)
      .filter(id => !handlerIds.has(id) && !compoundVisualIds.has(id) && !id.startsWith('emom_'));
    if (missingVisuals.length) fail(`Übungen ohne spezifische Darstellung: ${missingVisuals.join(', ')}`);
    else ok(`Visual-Coverage: ${catalog.length} Katalogeinträge geprüft`);

    const cardioText = fs.readFileSync(path.join(root, 'cardio-visuals-v12.js'), 'utf8');
    if (!cardioText.includes("const sport=cardioSport(id)")) fail('Cardio-Visuals nutzen nicht die explizite Sportzuordnung');
    if (cardioText.includes("startsWith('row_') &&")) fail('Legacy-Ruder-Prefix-Logik in Cardio-Visuals gefunden');
    ok('Ruder-Klassifikation und Visual-Routing geprüft');
  }
} catch (error) {
  fail(`Visual-/Typ-Audit fehlgeschlagen: ${error.message}`);
}



// ARC v13.1 workout UX regression checks
const requiredV131 = [
  'startFreeWorkout',
  'openWorkoutExercisePicker',
  'addWorkoutSet',
  'removeWorkoutSet',
  'requestFinishWorkout',
  'saveFinishedWorkout',
  'openSessionHistory'
];
for (const name of requiredV131) {
  if (!html.includes(name)) fail(`ARC v13.1 Funktion fehlt: ${name}`);
}
if (!html.includes('ARC v13.2 — Adaptive Training')) fail('ARC v13.2 Seitentitel fehlt');
if (!html.includes('Session-RPE kommt erst beim Abschluss')) fail('ARC v13.1 reduzierte Workout-Eingabe fehlt');
if (!html.includes('Einmaliger Check-in')) fail('ARC v13.1 Abschluss-Check-in fehlt');
const v131Script = html.split('<script id="arc-v13-1-js">')[1]?.split('</script>')[0] || '';
if (/id="woWell"|id="woPain"|id="woRpe"/.test(v131Script)) fail('Wohlbefinden/Schmerz/Session-RPE dürfen nicht im ARC v13.1 Workout-Overlay stehen');
else ok('ARC v13.1: Abschlusswerte nur beim Trainingsende');
if (!html.includes('+ Freies Training')) fail('Freies Training fehlt auf der Trainingsseite');
else ok('ARC v13.1: Live-Workout-Bearbeitung vorhanden');



// ARC v13.2 modality/distance/overview regression checks
const requiredV132 = [
  'arcDistanceSpecForExercise',
  'arcWorkoutSections',
  'openWorkoutOverview',
  'openActiveWorkoutOverview',
  'renderArc132BlockPicker',
  'updateManualDistanceVisibility'
];
for (const name of requiredV132) {
  if (!html.includes(name)) fail(`ARC v13.2 Funktion fehlt: ${name}`);
}
const v132Script = html.split('<script id="arc-v13-2-js">')[1]?.split('</script>')[0] || '';
if (!v132Script.includes("DISTANCE_SPORTS=new Set(['running','swimming','cycling','skating','rowing','hiking'])")) fail('ARC v13.2 Distanz-Sportliste fehlt');
if (!v132Script.includes("sport==='swimming'||sport==='rowing")) fail('ARC v13.2 Meter-Einheiten für Schwimmen/Rudern fehlen');
if (!v132Script.includes("Gym → Laufen → EMOM")) fail('ARC v13.2 Multi-Block-Planeditor fehlt');
if (!v132Script.includes('openActiveWorkoutOverview()')) fail('ARC v13.2 Workout-Listenbutton fehlt');
if (/renderWorkoutInterval=function\(b,bi\)\{return `[^`]*Distanz km/.test(v132Script)) fail('ARC v13.2 darf Distanz nicht pauschal als km rendern');
else ok('ARC v13.2: Distanz nur kontextuell für Ausdauer');
if (!v132Script.includes('openWorkoutOverview(w.pi,w.di)')) fail('ARC v13.2 Trainingskarten öffnen keine Übersicht');
else ok('ARC v13.2: Listenübersicht vor und während des Trainings');
if (!v132Script.includes('workoutSections(activeWorkout.blocks)')) fail('ARC v13.2 Live-Workout gruppiert keine Modalitätsblöcke');
else ok('ARC v13.2: getrennte Modalitätsblöcke aktiv');

if (failed) process.exit(1);
console.log('\nARC-Validierung erfolgreich.');
