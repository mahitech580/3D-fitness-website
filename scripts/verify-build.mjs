import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const failures = [];
const check = async (relativePath) => {
  try { await access(path.join(root, relativePath)); }
  catch { failures.push('Missing required Pages artifact: dist/' + relativePath); }
};

const html = await readFile(path.join(root, 'index.html'), 'utf8').catch(() => '');
if (!html) failures.push('Production index.html is missing or empty.');
if (!/<title>KINETIK — Train with intent<\/title>/.test(html)) failures.push('Production page title is missing or outdated.');
if (!/<meta\s+name="description"/.test(html)) failures.push('Search description is missing.');
if (!/name="theme-color"/.test(html)) failures.push('Browser theme color is missing.');
if (!/id="root"/.test(html)) failures.push('React mount target is missing.');
if (!/type="module"[^>]+src="[^"]+\.js"/.test(html)) failures.push('Built JavaScript module is not referenced from index.html.');

const assetDir = path.join(root, 'assets');
const assets = await readdir(assetDir).catch(() => []);
if (!assets.some((name) => /\.js$/.test(name))) failures.push('No JavaScript asset was emitted.');
if (!assets.some((name) => /\.css$/.test(name))) failures.push('No CSS asset was emitted.');
const scripts = await Promise.all(assets.filter((name) => /\.js$/.test(name)).map((name) => readFile(path.join(assetDir, name), 'utf8')));
const bundleText = scripts.join('\n');
for (const featureText of ['BUILD MY WEEK', 'MARK SESSION DONE', 'ROTATE 90°', 'PREPARE MY REQUEST', 'VIEW CONCEPT DETAILS', 'SAVE TEMPLATE', 'WEEKLY SESSION HISTORY', 'FOCUS SELECTED', 'FLOOR FINISH', 'COMMON MISTAKES', 'RELATED MOVEMENTS', 'GYM CONCEPTS']) {
  if (!bundleText.includes(featureText)) failures.push('Expected interactive feature text was not found in the production JS: ' + featureText);
}
for (const asset of ['favicon.svg', 'site.webmanifest', 'robots.txt', 'sitemap.xml', '404.html']) await check(asset);

// Guard the app's keyboard-accessible command palette against stale section anchors.
const sourcePaths = [
  'src/App.tsx',
  'src/components/WorkoutBuilder.tsx',
  'src/components/ExerciseLibrary.tsx',
  'src/components/GymDiscovery.tsx',
  'src/components/GymPlanner.tsx',
  'src/components/TrialBooking.tsx',
  'src/components/CommandPalette.tsx',
];
const sourceContents = await Promise.all(sourcePaths.map((relativePath) =>
  readFile(path.resolve(relativePath), 'utf8').catch(() => {
    failures.push('Could not read source needed for navigation verification: ' + relativePath);
    return '';
  }),
));
const sectionIds = new Set();
for (const source of sourceContents.slice(0, -1)) {
  for (const match of source.matchAll(/<section\\b[^>]*\\bid=["']([^"']+)["']/gs)) sectionIds.add(match[1]);
}
const paletteSource = sourceContents[sourceContents.length - 1];
const commandTargetIds = [...paletteSource.matchAll(/\\{\\s*id:\\s*'([^']+)'/g)].map((match) => match[1]);
for (const targetId of commandTargetIds) {
  if (!sectionIds.has(targetId)) failures.push('Command palette target does not match a section anchor: #' + targetId);
}
if (!commandTargetIds.includes('gyms')) failures.push('Command palette is missing the gym discovery section.');

const manifest = await readFile(path.join(root, 'site.webmanifest'), 'utf8').catch(() => '');
if (manifest) {
  try {
    const data = JSON.parse(manifest);
    if (data.name !== 'KINETIK — Train with intent') failures.push('Web manifest name does not match the site.');
    if (data.start_url !== './') failures.push('Web manifest start URL must stay relative for project Pages.');
  } catch { failures.push('Web manifest is not valid JSON.'); }
}
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8').catch(() => '');
if (sitemap && !sitemap.includes('https://mahitech580.github.io/3D-fitness-website/')) failures.push('Sitemap is missing the deployed canonical URL.');

if (failures.length) {
  console.error('Production build verification failed:');
  for (const failure of failures) console.error(' - ' + failure);
  process.exitCode = 1;
} else {
  console.log('Production build verified: ' + assets.filter((name) => /\.(js|css)$/.test(name)).length + ' JS/CSS assets and required Pages metadata are present.');
}
