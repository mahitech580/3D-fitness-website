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
  await page.waitForTimeout(700);
  assert.match(await page.title(), /KINETIK.*Train With Intent/i);
  assert.equal(await page.locator('#programs').count(), 1);
  assert.equal(await page.locator('#kinetic-lab').count(), 1);
  assert.equal(await page.locator('#start').count(), 1);
  assert.equal(await page.locator('#tracker').count(), 1);
  assert.equal(await page.locator('.program-card').count(), 3);
  assert.equal(await page.locator('.week-row').count(), 7);
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/kinetik-desktop.png', fullPage: false });

  const lab = page.locator('#kinetic-lab');
  await lab.scrollIntoViewIfNeeded();
  await page.locator('#kinetic-lab canvas').waitFor({ timeout: 15000 });
  await page.waitForTimeout(600);
  assert.equal(await page.locator('#kinetic-lab canvas').count(), 1, 'The real-time 3D scene should load near the viewport.');
  await page.screenshot({ path: 'artifacts/kinetik-3d-lab.png', fullPage: false });

  const dumbbell = page.locator('.kinetic-equipment-choice').filter({ hasText: 'Dumbbell' });
  await dumbbell.click();
  assert.equal(await dumbbell.getAttribute('aria-pressed'), 'true', 'The dumbbell selector should become active.');
  await page.locator('.kinetic-object-host').waitFor();
  assert.match(await page.locator('.kinetic-object-host').getAttribute('aria-label'), /dumbbell/i);
  assert.match(await page.locator('.kinetic-lab-object-info').innerText(), /One side at a time/i);

  const kettlebell = page.locator('.kinetic-equipment-choice').filter({ hasText: 'Kettlebell' });
  await kettlebell.click();
  assert.equal(await kettlebell.getAttribute('aria-pressed'), 'true', 'The kettlebell selector should become active.');
  assert.match(await page.locator('.kinetic-object-host').getAttribute('aria-label'), /kettlebell/i);
  const rotationButton = page.getByRole('button', { name: /Auto rotate/i });
  await rotationButton.click();
  assert.equal(await rotationButton.getAttribute('aria-pressed'), 'false', 'Auto-rotation can be disabled.');
  await rotationButton.click();
  assert.equal(await rotationButton.getAttribute('aria-pressed'), 'true', 'Auto-rotation can be enabled again.');
  await page.getByRole('button', { name: /Reset view/i }).click();
  await page.screenshot({ path: 'artifacts/kinetik-3d-kettlebell.png', fullPage: false });

  await page.locator('#training-path').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: /Conditioning/i }).click();
  await page.getByRole('button', { name: /Build from this path/i }).click();
  await page.locator('#start').waitFor();
  assert.equal(await page.getByRole('radio', { name: /Build my engine/i }).isChecked(), true, 'The selected training path should flow into the plan builder.');
  await page.getByRole('button', { name: /Build my starter plan/i }).click();
  await page.locator('.generated-plan').waitFor();
  assert.match(await page.locator('.generated-plan').innerText(), /Conditioning base/i);
  assert.match(await page.locator('.generated-plan').innerText(), /Bike or brisk-walk intervals/i);

  await page.locator('#tracker').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Log Monday session' }).click();
  assert.equal((await page.locator('.tracker-counter strong').innerText()).replace(/\s+/g, ' ').trim(), '1 / 7');
  await page.locator('#faq').scrollIntoViewIfNeeded();
  const conceptFaq = page.getByRole('button', { name: /Is KINETIK a real gym or membership service/i });
  assert.equal(await conceptFaq.getAttribute('aria-expanded'), 'true', 'The first FAQ should start open.');
  await conceptFaq.click();
  assert.equal(await conceptFaq.getAttribute('aria-expanded'), 'false', 'The FAQ should collapse on click.');
  await conceptFaq.click();
  const reopenedAnswer = page.locator('.faq-item--open .faq-answer');
  await reopenedAnswer.waitFor();
  assert.match(await reopenedAnswer.innerText(), /KINETIK is a fitness website concept/i, 'The FAQ answer should reopen on click.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#hero-title').waitFor();
  await page.evaluate(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  const dimensions = await page.evaluate(() => ({ documentWidth: document.documentElement.scrollWidth, viewportWidth: document.documentElement.clientWidth }));
  assert.ok(dimensions.documentWidth <= dimensions.viewportWidth + 2, 'The mobile page should not have horizontal overflow: ' + JSON.stringify(dimensions));
  const heroImage = page.locator('.hero-photo-main img');
  assert.equal(await heroImage.count(), 1, 'The hero gym image should be present.');
  assert.ok((await heroImage.getAttribute('src'))?.includes('images.unsplash.com'), 'The hero should use its gym photo asset.');
  await page.screenshot({ path: 'artifacts/kinetik-mobile.png', fullPage: false });
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).getAttribute('class'), 'main-nav main-nav--open');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Training paths' }).click();
  assert.match(page.url(), /#programs$/);

  assert.deepEqual(pageErrors, [], 'No uncaught browser errors should be recorded.');
  console.log('Browser smoke passed: current homepage, responsive layout, 3D model selection, zoom/rotation/reset controls, plan builder, local check-ins, FAQ, and mobile navigation.');
} finally {
  await browser.close();
}
