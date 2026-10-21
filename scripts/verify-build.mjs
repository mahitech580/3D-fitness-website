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
