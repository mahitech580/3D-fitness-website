import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const failures = [];
const check = async (relativePath) => {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push('Missing required Pages artifact: dist/' + relativePath);
  }
};

const html = await readFile(path.join(root, 'index.html'), 'utf8').catch(() => '');
if (!html) failures.push('Production index.html is missing or empty.');
for (const [needle, message] of [
  ['<html lang="en">', 'Document language should be declared for assistive technology and search engines.'],
  ['name="viewport"', 'Responsive viewport metadata is missing.'],
  ['<title>KINETIK — Train With Intent</title>', 'Production page title is missing or outdated.'],
  ['name="description"', 'Search description is missing.'],
  ['property="og:image:alt"', 'Open Graph preview image needs descriptive alternative text.'],
  ['name="theme-color"', 'Browser theme color is missing.'],
  ['property="og:image"', 'Open Graph preview image is missing.'],
  ['name="twitter:image"', 'Twitter preview image is missing.'],
  ['rel="canonical"', 'Canonical page URL is missing.'],
  ['id="root"', 'React mount target is missing.'],
  ['id="fallback-details"', 'The no-JavaScript fallback section is missing.'],
]) {
  if (!html.includes(needle)) failures.push(message);
}
if (!html.includes('type="module"') || !html.includes('.js')) failures.push('Built JavaScript module is not referenced from index.html.');
if (!html.includes('/3D-fitness-website/')) failures.push('The project Pages base path is not reflected in production HTML.');

const assetDir = path.join(root, 'assets');
const assets = await readdir(assetDir).catch(() => []);
const jsAssets = assets.filter((name) => name.endsWith('.js'));
const cssAssets = assets.filter((name) => name.endsWith('.css'));
if (!jsAssets.length) failures.push('No JavaScript asset was emitted.');
if (!cssAssets.length) failures.push('No CSS asset was emitted.');
const scripts = await Promise.all(jsAssets.map((name) => readFile(path.join(assetDir, name), 'utf8')));
const cssBundles = await Promise.all(cssAssets.map((name) => readFile(path.join(assetDir, name), 'utf8')));
const bundleText = scripts.join('');
const cssText = cssBundles.join('');
for (const featureText of [
  'BUILT BY',
  'BUILT IN 3D.',
  'MADE TO MOVE.',
  'WEBGL / INTERACTIVE SCENE',
  'Auto rotate',
  'Reset view',
  'MATERIAL FINISH',
  'Kinetik lime',
  'Carbon',
  'Steel',
  'LIGHT RIG',
  'Studio',
  'Contrast',
  'Neon',
  'CAMERA / VIEW',
  'Hero angle',
  'Side profile',
  'Built for the basics.',
  'Made to feel different.',
  'Find your angle.',
  'Explore the 3D product story',
  'Copy setup link',
  'SCROLL / SELECT / INSPECT',
  'YOUR TRAINING.',
  'MAKE EVERY',
  'SESSION BLUEPRINT',
  'THE MOVEMENT INDEX',
  'No matching movement.',
  'YOUR WEEK, YOUR PACE',
  'Build my starter plan',
  'STACKED UP.',
  'Is KINETIK a real gym or membership service?',
]) {
  if (!bundleText.includes(featureText)) failures.push('Expected experience text was not found in the production JavaScript: ' + featureText);
}
for (const asset of ['favicon.svg', 'site.webmanifest', 'robots.txt', 'sitemap.xml', '404.html']) await check(asset);
if (cssText.includes('@import url(')) failures.push('CSS should not repeat the Google Fonts import already linked in index.html.');

const appSource = await readFile(path.resolve('src/App.tsx'), 'utf8').catch(() => '');
const sceneSource = await readFile(path.resolve('src/components/KineticObject.tsx'), 'utf8').catch(() => '');
const heroSceneSource = await readFile(path.resolve('src/components/HeroScene.tsx'), 'utf8').catch(() => '');
const sourceStyles = await readFile(path.resolve('src/styles.css'), 'utf8').catch(() => '');
for (const sectionId of ['home', 'kinetic-lab', 'approach', 'programs', 'training-path', 'movement-library', 'weekly', 'tracker', 'start', 'faq']) {
  if (!appSource.includes('id="' + sectionId + '"')) failures.push('Missing expected section anchor: #' + sectionId);
}
if (!appSource.includes('id="main-content"')) failures.push('Skip-link target is missing.');
if (!appSource.includes("lazy(() => import('./components/KineticObject'))") || !appSource.includes('<KineticSceneLoader')) failures.push('The active homepage must lazy-load the interactive 3D training scene near the viewport.');
if (!appSource.includes("lazy(() => import('./components/HeroScene'))") || !appSource.includes('<HeroScene />')) failures.push('The hero should lazy-load its custom 3D feature scene.');
if (!heroSceneSource.includes('<Canvas') || !heroSceneSource.includes('new IntersectionObserver') || !heroSceneSource.includes("rootMargin: '180px'")) failures.push('The hero 3D scene should use a viewport observer to avoid rendering when far off-screen.');
if (!heroSceneSource.includes('BoxingBag') || !heroSceneSource.includes('OrbitRings') || !heroSceneSource.includes('prefersReducedMotion')) failures.push('The hero 3D scene should include its custom model, orbital detail, and reduced-motion handling.');
for (const depthSelector of ['.hero-three-layer', '.principle-card', '.program-card', '.path-content', '.gallery-item', '.session-step', '.movement-card', '.week-row', '.tracker-panel', '.builder-card', '.faq-item']) {
  if (!sourceStyles.includes(depthSelector)) failures.push('Whole-site visual depth polish is missing for ' + depthSelector);
}
if (!appSource.includes("rootMargin: '320px'") || !appSource.includes('<Suspense fallback=')) failures.push('The deferred scene should include a viewport trigger and loading preview.');
for (const model of ['BarbellModel', 'DumbbellModel', 'KettlebellModel']) {
  if (!sceneSource.includes(model)) failures.push('The 3D equipment lab is missing model: ' + model);
}
if (!sceneSource.includes('<Canvas') || !sceneSource.includes('OrbitControls') || !sceneSource.includes('autoRotate={autoRotate && !reducedMotion}') || !sceneSource.includes('enableZoom')) failures.push('The 3D lab must include a WebGL canvas, zoom/rotation controls, and reduced-motion-aware auto-rotation.');
if (!appSource.includes('setResetToken') || !appSource.includes('setAutoRotate') || !appSource.includes('aria-pressed={equipment === choice}')) failures.push('The equipment selector, rotation toggle, or reset controls are missing.');
if (!appSource.includes('lightingOptions.map') || !appSource.includes('cameraOptions.map') || !sceneSource.includes("lighting === 'neon'") || !sceneSource.includes("cameraPreset === 'side'")) failures.push('The interactive lighting presets and camera presets must be wired into the live 3D scene.');
if (!appSource.includes('storyBeats.map') || !appSource.includes('storyBeat={storyBeat}') || !sceneSource.includes('storyDistance')) failures.push('The guided product story must be connected to live camera framing.');
if (!appSource.includes('handleTabKeyDown') || !appSource.includes('aria-controls="path-panel"')) failures.push('Training-path tabs are missing keyboard navigation or panel relationships.');
if (!appSource.includes('allowedDays.has(day)') || !appSource.includes('candidate.moves')) failures.push('Browser-local state should be validated before use.');
if (!sourceStyles.includes('.kinetic-lab-stage') || !sourceStyles.includes('.kinetic-object-host') || !sourceStyles.includes('.kinetic-equipment-choice--active')) failures.push('The responsive 3D equipment lab styles are missing.');
if (!sourceStyles.includes('prefers-reduced-motion')) failures.push('Reduced-motion styles are missing.');
if (!sourceStyles.includes('@media(max-width:620px)')) failures.push('Mobile layout breakpoint is missing.');
if (!sourceStyles.includes('scroll-behavior:smooth')) failures.push('Smooth scroll styling is missing.');

const manifest = await readFile(path.join(root, 'site.webmanifest'), 'utf8').catch(() => '');
if (manifest) {
  try {
    const data = JSON.parse(manifest);
    if (data.name !== 'KINETIK — Train With Intent') failures.push('Web manifest name does not match the site.');
    if (!String(data.description || '').includes('real-time 3D')) failures.push('Web manifest description does not reflect the active equipment lab.');
    if (data.start_url !== './') failures.push('Web manifest start URL must stay relative for project Pages.');
    if (data.theme_color !== '#07180f') failures.push('Web manifest theme color does not match the site palette.');
  } catch {
    failures.push('Web manifest is not valid JSON.');
  }
}
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8').catch(() => '');
if (sitemap && !sitemap.includes('https://mahitech580.github.io/3D-fitness-website/')) failures.push('Sitemap is missing the deployed canonical URL.');
const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8'));
if (packageJson.engines?.node !== '>=20.19.0') failures.push('Node.js engine requirements must be set to >=20.19.0.');

if (failures.length) {
  console.error('Production build verification failed:');
  for (const failure of failures) console.error(' - ' + failure);
  process.exitCode = 1;
} else {
  console.log('Production build verified: ' + jsAssets.length + ' JavaScript and ' + cssAssets.length + ' CSS assets, SEO/PWA/404 metadata, responsive page sections, validated local state, and three interactive 3D equipment models are present.');
}
