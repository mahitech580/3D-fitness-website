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
if (!/<title>Ritually — Kairo Studio<\/title>/.test(html)) failures.push('Production page title is missing.');
if (!/<meta\s+name="description"/.test(html)) failures.push('Search description is missing.');
if (!/name="theme-color"/.test(html)) failures.push('Browser theme color is missing.');
if (!/id="root"/.test(html)) failures.push('React mount target is missing.');
if (!/type="module"[^>]+src="[^"]+\.js"/.test(html)) failures.push('Built JavaScript module is not referenced from index.html.');

const assetDir = path.join(root, 'assets');
const assets = await readdir(assetDir).catch(() => []);
if (!assets.some((name) => /\.js$/.test(name))) failures.push('No JavaScript asset was emitted.');
if (!assets.some((name) => /\.css$/.test(name))) failures.push('No CSS asset was emitted.');

for (const asset of ['favicon.svg', 'site.webmanifest', 'robots.txt', 'sitemap.xml', 'porcelain-branch.svg', '404.html']) await check(asset);
const manifest = await readFile(path.join(root, 'site.webmanifest'), 'utf8').catch(() => '');
if (manifest) {
  try {
    const data = JSON.parse(manifest);
    if (data.name !== 'Ritually — Kairo Studio') failures.push('Web manifest name does not match the site.');
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
