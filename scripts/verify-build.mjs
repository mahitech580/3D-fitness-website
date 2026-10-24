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
if (!html.includes('<title>KINETIK — Train With Intent</title>')) failures.push('Production page title is missing or outdated.');
if (!html.includes('name="description"')) failures.push('Search description is missing.');
if (!html.includes('name="theme-color"')) failures.push('Browser theme color is missing.');
if (!html.includes('id="root"')) failures.push('React mount target is missing.');
if (!html.includes('type="module"') || !html.includes('.js')) failures.push('Built JavaScript module is not referenced from index.html.');

const assetDir = path.join(root, 'assets');
const assets = await readdir(assetDir).catch(() => []);
const jsAssets = assets.filter((name) => name.endsWith('.js'));
const cssAssets = assets.filter((name) => name.endsWith('.css'));
if (!jsAssets.length) failures.push('No JavaScript asset was emitted.');
if (!cssAssets.length) failures.push('No CSS asset was emitted.');
const scripts = await Promise.all(jsAssets.map((name) => readFile(path.join(assetDir, name), 'utf8')));
const bundleText = scripts.join('');
for (const featureText of [
  'BUILT BY',
  'FORM MEETS',
  'REAL-TIME 3D',
  'DRAG TO ROTATE',
  'PICK YOUR PATH',
  'YOUR TRAINING.',
  'YOUR WEEK, YOUR PACE',
  'Build my starter plan',
  'STACKED UP.',
  'Is KINETIK a real gym or membership service?',
]) {
  if (!bundleText.includes(featureText)) failures.push('Expected experience text was not found in the production JS: ' + featureText);
}
for (const asset of ['favicon.svg', 'site.webmanifest', 'robots.txt', 'sitemap.xml', '404.html']) await check(asset);

const appSource = await readFile(path.resolve('src/App.tsx'), 'utf8').catch(() => '');
const sceneSource = await readFile(path.resolve('src/components/KineticObject.tsx'), 'utf8').catch(() => '');
const styles = await readFile(path.resolve('src/styles.css'), 'utf8').catch(() => '');
for (const sectionId of ['home', 'kinetic-lab', 'approach', 'programs', 'training-path', 'weekly', 'tracker', 'start', 'faq']) {
  if (!appSource.includes('id="' + sectionId + '"')) failures.push('Missing expected section anchor: #' + sectionId);
}
if (!appSource.includes('id="main-content"')) failures.push('Skip-link target is missing.');
if (!appSource.includes("import KineticObject from './components/KineticObject';") || !appSource.includes('<KineticObject />')) failures.push('The active homepage must mount the interactive 3D training object.');
if (!sceneSource.includes('<Canvas') || !sceneSource.includes('OrbitControls') || !sceneSource.includes('WeightedObject')) failures.push('The 3D training lab must render the custom barbell in a WebGL canvas with rotation controls.');
if (!styles.includes('.kinetic-lab-stage') || !styles.includes('.kinetic-object-host')) failures.push('The 3D lab presentation styles are missing.');
const lowerScene = sceneSource.toLowerCase();
if (lowerScene.includes('skinnedmesh') || lowerScene.includes('skeletonutils') || lowerScene.includes('humanoid') || lowerScene.includes('human model')) failures.push('The stored 3D scene should not contain a human character model.');
if (!styles.includes('prefers-reduced-motion')) failures.push('Reduced-motion styles are missing.');
if (!styles.includes('@media(max-width:620px)')) failures.push('Mobile layout breakpoint is missing.');
if (!styles.includes('scroll-behavior:smooth')) failures.push('Smooth scroll styling is missing.');

const manifest = await readFile(path.join(root, 'site.webmanifest'), 'utf8').catch(() => '');
if (manifest) {
  try {
    const data = JSON.parse(manifest);
    if (data.name !== 'KINETIK — Train With Intent') failures.push('Web manifest name does not match the site.');
    if (data.start_url !== './') failures.push('Web manifest start URL must stay relative for project Pages.');
    if (data.theme_color !== '#07180f') failures.push('Web manifest theme color does not match the new site palette.');
  } catch { failures.push('Web manifest is not valid JSON.'); }
}
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8').catch(() => '');
if (sitemap && !sitemap.includes('https://mahitech580.github.io/3D-fitness-website/')) failures.push('Sitemap is missing the deployed canonical URL.');

if (failures.length) {
  console.error('Production build verification failed:');
  for (const failure of failures) console.error(' - ' + failure);
  process.exitCode = 1;
} else {
  console.log('Production build verified: ' + jsAssets.length + ' JavaScript and ' + cssAssets.length + ' CSS assets, active interactive 3D canvas, rotating barbell controls, responsive lab styling, page sections, and Pages metadata are present.');
}
