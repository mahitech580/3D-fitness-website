import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173/3D-fitness-website/';
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const pageErrors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
page.on('pageerror', (error) => pageErrors.push(error.message));

try {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#hero-title').waitFor();
  await page.waitForTimeout(1000);
  assert.match(await page.title(), /KINETIK.*Move with intent/i);
  assert.equal(await page.locator('#programs').count(), 1);
  assert.equal(await page.locator('#experience').count(), 1);
  assert.equal(await page.locator('#start').count(), 1);
  assert.equal(await page.locator('.program-card').count(), 3);
  assert.equal(await page.locator('.week-row').count(), 7);
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/kinetik-desktop.png', fullPage: false });

  await page.locator('#experience').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('#experience canvas').count(), 1, 'The 3D scene should load as it approaches the viewport.');

  await page.locator('#start').scrollIntoViewIfNeeded();
  await page.locator('.program-card').nth(1).getByRole('link', { name: /make this my focus/i }).click();
  assert.equal(await page.getByRole('radio', { name: /build my engine/i }).isChecked(), true, 'The conditioning card should preselect conditioning in the plan builder.');
  await page.getByRole('button', { name: /build my starter plan/i }).click();
  await page.locator('#generated-plan').waitFor();
  assert.match(await page.locator('#generated-plan').innerText(), /Conditioning base/i);
  assert.match(await page.locator('#generated-plan').innerText(), /Bike or brisk-walk intervals/i);

  await page.locator('#progress').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Log Monday session' }).click();
  assert.equal((await page.getByTestId('checkin-count').innerText()).trim(), '1 / 7');
  await page.getByRole('button', { name: 'Does the motion lab track my real repetitions?' }).click();
  assert.equal(await page.getByText(/No camera-based body tracking is used/i).count(), 1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#hero-title').waitFor();
  await page.evaluate(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  const dimensions = await page.evaluate(() => ({ documentWidth: document.documentElement.scrollWidth, viewportWidth: document.documentElement.clientWidth }));
  assert.ok(dimensions.documentWidth <= dimensions.viewportWidth + 2, 'The mobile page should not have horizontal overflow: ' + JSON.stringify(dimensions));
  const heroImageLoaded = await page.locator('.hero-photo img').evaluate((image) => image.complete && image.naturalWidth > 0);
  assert.ok(heroImageLoaded, 'The photographic gym background should load on mobile.');
  await page.screenshot({ path: 'artifacts/kinetik-mobile.png', fullPage: false });
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).getAttribute('class'), 'main-nav main-nav--open');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Programs' }).click();
  assert.match(page.url(), /#programs$/);

  assert.deepEqual(pageErrors, [], 'No uncaught browser errors should be recorded.');
  console.log('Browser smoke verified the redesigned landing, program sections, deferred 3D object, starter plan builder, local progress check-ins, FAQ, and mobile navigation.');
} finally {
  await browser.close();
}
