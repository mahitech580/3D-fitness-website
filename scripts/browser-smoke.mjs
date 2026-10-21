import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173/3D-fitness-website/';
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

await mkdir('artifacts', { recursive: true });
let desktopScreenshotTaken = false;
let mobileScreenshotTaken = false;
let failure = null;

try {
  await page.addInitScript(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch { /* Storage may be disabled. */ }
  });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.locator('#hero-title').waitFor({ state: 'visible', timeout: 30_000 });
  assert.match(await page.title(), /KINETIK/i, 'The site title should identify KINETIK.');
  await page.screenshot({ path: 'artifacts/kinetik-desktop.png' });
  desktopScreenshotTaken = true;

  const training = page.locator('#training');
  await training.getByRole('button', { name: /BUILD MY WEEK/i }).click();
  assert.ok(await training.locator('.workout-day').count() > 0, 'The builder should render a weekly plan.');

  await training.getByRole('button', { name: /START THIS SESSION/i }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible', timeout: 10_000 });
  await dialog.getByRole('button', { name: /START WORKOUT/i }).click();
  await dialog.getByRole('button', { name: /NEXT/i }).click();
  await dialog.getByRole('button', { name: /START REST/i }).click();
  await dialog.getByRole('button', { name: /SKIP REST/i }).click();
  await dialog.getByRole('button', { name: /FINISH & SAVE SESSION/i }).click();
  await training.locator('.workout-history-entry').first().waitFor({ state: 'visible', timeout: 10_000 });

  const library = page.locator('#library');
  await library.locator('.exercise-details-toggle').first().click();
  await library.getByText('TECHNIQUE', { exact: true }).first().waitFor({ state: 'visible' });
  await library.getByText('COMMON MISTAKES', { exact: true }).first().waitFor({ state: 'visible' });

  const gyms = page.locator('#gyms');
  await gyms.locator('.gym-details-button').first().click();
  await gyms.locator('.gym-facilities-panel').first().waitFor({ state: 'visible' });

  const planner = page.locator('#space');
  await planner.scrollIntoViewIfNeeded();
  const firstItem = planner.locator('.planner-item').first();
  await firstItem.click();
  await planner.getByRole('button', { name: /ROTATE 90°/i }).click();
  await planner.getByRole('button', { name: /ADD SQUAT RACK/i }).click();
  assert.ok(await planner.locator('.planner-item').count() >= 5, 'The floor plan should accept new equipment.');
  await planner.getByRole('button', { name: /SAVE LAYOUT/i }).click();
  await planner.getByRole('button', { name: /LOAD SAVED/i }).click();

  const jsonDownloadPromise = page.waitForEvent('download', { timeout: 10_000 });
  await planner.getByRole('button', { name: /EXPORT JSON/i }).click();
  const jsonDownload = await jsonDownloadPromise;
  assert.equal(jsonDownload.suggestedFilename(), 'kinetik-gym-layout.json');

  const pngDownloadPromise = page.waitForEvent('download', { timeout: 10_000 });
  await planner.getByRole('button', { name: /EXPORT 2D PNG/i }).click();
  const pngDownload = await pngDownloadPromise;
  assert.equal(pngDownload.suggestedFilename(), 'kinetik-floor-plan.png');

  const previewCanvas = planner.locator('.planner-3d-canvas canvas');
  if (await previewCanvas.count()) {
    const threeDDownloadPromise = page.waitForEvent('download', { timeout: 10_000 });
    await planner.getByRole('button', { name: /EXPORT 3D PNG/i }).click();
    const threeDDownload = await threeDDownloadPromise;
    assert.equal(threeDDownload.suggestedFilename(), 'kinetik-gym-preview.png');
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.locator('#hero-title').waitFor({ state: 'visible', timeout: 30_000 });
  await page.screenshot({ path: 'artifacts/kinetik-mobile.png' });
  mobileScreenshotTaken = true;
  const menuToggle = page.locator('.menu-toggle');
  await menuToggle.click();
  assert.equal(await menuToggle.getAttribute('aria-expanded'), 'true', 'Mobile nav should open.');
  await page.locator('#site-navigation').getByRole('link', { name: 'TRAINING' }).click();
  assert.equal(await menuToggle.getAttribute('aria-expanded'), 'false', 'Mobile nav should close after navigation.');

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  assert.equal(horizontalOverflow, false, 'The page should not introduce horizontal overflow at a 390px viewport.');
  assert.deepEqual(pageErrors, [], 'The browser should not emit uncaught page errors.');
} catch (error) {
  failure = error;
} finally {
  if (!desktopScreenshotTaken) {
    await page.screenshot({ path: 'artifacts/kinetik-desktop.png' }).catch(() => {});
  }
  if (!mobileScreenshotTaken) {
    await page.setViewportSize({ width: 390, height: 844 }).catch(() => {});
    await page.screenshot({ path: 'artifacts/kinetik-mobile.png' }).catch(() => {});
  }
  await browser.close();
}

if (failure) {
  console.error('Browser smoke verification failed:', failure);
  process.exitCode = 1;
} else {
  console.log('Browser smoke verified workout execution/history, exercise coaching details, gym concept expansion, planner edits/saving/downloads, mobile navigation, and uncaught runtime errors.');
}
