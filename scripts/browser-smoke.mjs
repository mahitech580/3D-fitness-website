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
  assert.match(await page.title(), /KINETIK.*Train With Intent/i);
  assert.equal(await page.locator('#programs').count(), 1);
  assert.equal(await page.locator('#kinetic-lab').count(), 1);
  assert.equal(await page.locator('#training-path').count(), 1);
  assert.equal(await page.locator('#start').count(), 1);
  assert.equal(await page.locator('#tracker').count(), 1);
  assert.equal(await page.locator('#session-guide').count(), 1);
  assert.equal(await page.locator('.session-step').count(), 4);
  assert.equal(await page.locator('#movement-library').count(), 1);
  assert.equal(await page.locator('.movement-card').count(), 12);
  await page.locator('#movement-library').getByRole('button', { name: 'Conditioning' }).click();
  assert.equal(await page.locator('.movement-card').count(), 3, 'Conditioning filter should narrow the movement library.');
  await page.locator('#movement-library').getByRole('button', { name: 'All moves' }).click();
  await page.getByRole('searchbox', { name: 'Search movement library' }).fill('dumbbell');
  assert.equal(await page.locator('.movement-card').count(), 3, 'Search should match movement names and equipment.');
  await page.getByRole('searchbox', { name: 'Search movement library' }).fill('not-a-real-move');
  assert.equal(await page.locator('.movement-empty').count(), 1, 'No-results state should appear for an unmatched search.');
  await page.locator('#movement-library').getByRole('button', { name: 'Reset movement search' }).click();
  assert.equal(await page.locator('.movement-card').count(), 12, 'Reset should restore the movement library.');
  assert.equal(await page.locator('.program-card').count(), 3);
  assert.equal(await page.locator('.week-row').count(), 7);
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/kinetik-desktop.png', fullPage: false });

  await page.locator('#kinetic-lab').scrollIntoViewIfNeeded();
  const canvas = page.locator('#kinetic-lab canvas');
  await canvas.waitFor({ timeout: 15000 });
  const canvasHandle = await canvas.elementHandle();
  assert.ok(canvasHandle, 'The real-time WebGL canvas should exist after the lab approaches the viewport.');
  const bounds = await canvas.boundingBox();
  assert.ok(bounds && bounds.width > 100 && bounds.height > 100, 'The 3D canvas should have a visible render area.');
  await page.screenshot({ path: 'artifacts/kinetik-3d-lab.png', fullPage: false });

  const dumbbell = page.locator('.kinetic-equipment-choice').filter({ hasText: 'Dumbbell' });
  await dumbbell.click();
  assert.equal(await dumbbell.getAttribute('aria-pressed'), 'true', 'The dumbbell selector should become active.');
  assert.match(await page.locator('.kinetic-object-host').getAttribute('aria-label'), /dumbbell/i);
  assert.match(await page.locator('.kinetic-lab-object-info').innerText(), /One side at a time/i);
  const carbonFinish = page.getByRole('button', { name: /Carbon/ });
  await carbonFinish.click();
  assert.equal(await carbonFinish.getAttribute('aria-pressed'), 'true', 'The carbon material finish should become active.');
  assert.equal(await page.locator('#kinetic-lab canvas').count(), 1, 'Changing finishes should preserve the WebGL canvas.');
  const steelFinish = page.getByRole('button', { name: /Steel/ });
  await steelFinish.click();
  assert.equal(await steelFinish.getAttribute('aria-pressed'), 'true', 'The steel material finish should become active.');
  const signatureFinish = page.getByRole('button', { name: /Kinetik lime/ });
  await signatureFinish.click();
  assert.equal(await signatureFinish.getAttribute('aria-pressed'), 'true', 'The signature finish should be restorable.');
  const lightingStudio = page.getByRole('button', { name: /Studio/ });
  const lightingContrast = page.getByRole('button', { name: /Contrast/ });
  const lightingNeon = page.getByRole('button', { name: /Neon/ });
  await lightingContrast.click();
  assert.equal(await lightingContrast.getAttribute('aria-pressed'), 'true', 'Contrast lighting should become active.');
  assert.equal(await canvasHandle.evaluate((element) => element.isConnected), true, 'Lighting changes should preserve the live canvas.');
  await lightingNeon.click();
  assert.equal(await lightingNeon.getAttribute('aria-pressed'), 'true', 'Neon lighting should become active.');
  await lightingStudio.click();
  assert.equal(await lightingStudio.getAttribute('aria-pressed'), 'true', 'Studio lighting should be restorable.');
  const frontView = page.getByRole('button', { name: 'Front', exact: true });
  const sideView = page.getByRole('button', { name: 'Side profile' });
  const heroView = page.getByRole('button', { name: 'Hero angle' });
  await frontView.click();
  assert.equal(await frontView.getAttribute('aria-pressed'), 'true', 'Front camera preset should become active.');
  await sideView.click();
  assert.equal(await sideView.getAttribute('aria-pressed'), 'true', 'Side camera preset should become active.');
  await heroView.click();
  assert.equal(await heroView.getAttribute('aria-pressed'), 'true', 'Hero camera preset should be restorable.');
  assert.equal(await canvasHandle.evaluate((element) => element.isConnected), true, 'Camera changes should preserve the live canvas.');
  const story = page.locator('.kinetic-story');
  assert.equal(await story.count(), 1, 'The guided 3D story should render once.');
  const storyFinish = story.getByRole('button', { name: /02/ });
  await storyFinish.click();
  assert.equal(await storyFinish.getAttribute('aria-pressed'), 'true', 'The finish story beat should become active.');
  assert.match(await page.locator('#kinetic-story-title').innerText(), /different/i);
  await story.getByRole('button', { name: 'Next detail' }).click();
  assert.match(await page.locator('#kinetic-story-title').innerText(), /angle/i, 'Next should advance the guided story.');
  await story.getByRole('button', { name: '← Previous' }).click();
  assert.match(await page.locator('#kinetic-story-title').innerText(), /different/i, 'Previous should reverse the guided story.');
  assert.equal(await canvasHandle.evaluate((element) => element.isConnected), true, 'Story navigation should preserve the live canvas.');
  assert.equal(await canvasHandle.evaluate((element) => element.isConnected), true, 'Switching the model should not recreate the WebGL canvas.');

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
  assert.equal(await canvasHandle.evaluate((element) => element.isConnected), true, 'Resetting the camera should keep the WebGL canvas mounted.');
  await page.screenshot({ path: 'artifacts/kinetik-3d-kettlebell.png', fullPage: false });

  await page.locator('#training-path').scrollIntoViewIfNeeded();
  const strengthTab = page.getByRole('tab', { name: /Strength/i });
  await strengthTab.focus();
  await page.keyboard.press('ArrowRight');
  const conditioningTab = page.getByRole('tab', { name: /Conditioning/i });
  assert.equal(await conditioningTab.getAttribute('aria-selected'), 'true', 'Arrow-key navigation should switch training tabs.');
  await conditioningTab.click();
  await page.getByRole('button', { name: /Build from this path/i }).click();
  await page.locator('#start').waitFor();
  assert.equal(await page.getByRole('radio', { name: /Build my engine/i }).isChecked(), true, 'The selected training path should flow into the plan builder.');
  await page.getByRole('button', { name: /Build my starter plan/i }).click();
  const generatedPlan = page.locator('.generated-plan');
  await generatedPlan.waitFor();
  assert.match(await generatedPlan.innerText(), /Conditioning base/i);
  assert.match(await generatedPlan.innerText(), /Bike or brisk-walk intervals/i);
  await page.getByRole('radio', { name: /Move with ease/i }).check();
  assert.equal(await generatedPlan.count(), 0, 'Changing the builder inputs should clear the stale generated result.');

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

  await page.goto(baseUrl + '?equipment=dumbbell&finish=steel&lighting=neon&view=side&story=2', { waitUntil: 'domcontentloaded' });
  await page.locator('#kinetic-lab').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.kinetic-equipment-choice').filter({ hasText: 'Dumbbell' }).getAttribute('aria-pressed'), 'true', 'Shared URL should restore the equipment.');
  assert.equal(await page.locator('.kinetic-finish-choice--steel').getAttribute('aria-pressed'), 'true', 'Shared URL should restore the material.');
  assert.equal(await page.locator('.kinetic-lighting-choice--neon').getAttribute('aria-pressed'), 'true', 'Shared URL should restore the lighting.');
  assert.equal(await page.locator('.kinetic-view-choice--active').innerText(), 'Side profile', 'Shared URL should restore the camera view.');
  assert.match(await page.locator('#kinetic-story-title').innerText(), /angle/i, 'Shared URL should restore the story beat.');
  assert.equal(await page.getByRole('button', { name: /Copy setup link/i }).count(), 1, 'The setup can be shared again from the restored state.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#hero-title').waitFor();
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  assert.ok(dimensions.documentWidth <= dimensions.viewportWidth + 2, 'The mobile page should not have horizontal overflow: ' + JSON.stringify(dimensions));
  await page.screenshot({ path: 'artifacts/kinetik-mobile.png', fullPage: false });
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).getAttribute('class'), 'main-nav main-nav--open');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Training paths' }).click();
  assert.match(page.url(), /#programs$/);

  assert.deepEqual(pageErrors, [], 'No uncaught browser errors should be recorded.');
  console.log('Browser smoke passed: page sections, 3D model selection, stable WebGL canvas, rotation/reset controls, keyboard-accessible path tabs, current plan builder, local check-ins, FAQ, and mobile navigation.');
} finally {
  await browser.close();
}
