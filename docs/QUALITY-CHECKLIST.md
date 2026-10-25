# Quality and regression checklist

Use this checklist when changing the KINETIK experience. It complements the automated production and Playwright checks; it does not replace them.

## Before opening a change

- [ ] Run `npm run check` and confirm TypeScript, Vite output, metadata, and required assets pass.
- [ ] Install Playwright Chromium once, then run `npm run test:browser` against the Vite production preview.
- [ ] Check the browser console for uncaught errors and inspect the generated screenshots in `artifacts/`.
- [ ] Verify the Pages base path remains `/3D-fitness-website/`; do not use root-relative asset URLs.
- [ ] Keep the interactive 3D scene lazy-loaded and preserve its CSS fallback for browsers without WebGL.
- [ ] Ensure new in-page links point to real IDs, and every image has meaningful alternative text or an explicit empty `alt=""` when decorative.
- [ ] Test keyboard focus, visible focus styles, Escape behavior for dismissible UI, and reduced-motion preferences.
- [ ] Check narrow layouts at 390px and a desktop layout at 1440px; avoid horizontal overflow.
- [ ] Validate any data loaded from localStorage as untrusted input and keep the experience usable when storage is blocked.
- [ ] Update the README if visible behavior, limits, commands, or data handling changes.

## Release sequence

1. Commit a coherent change to `main`.
2. Wait for the CI workflow to complete, including the production build and browser interaction tests.
3. Confirm the Pages deployment workflow ran for the same verified commit.
4. Open the deployed URL and smoke-test navigation, the 3D lab, the starter-plan builder, and the weekly tracker.
5. Report failures accurately; a green build alone is not proof that the live deployment updated.

## Scope and user trust

KINETIK is a front-end fitness concept. Keep copy clear that routines are examples, not medical advice or individualized coaching. Do not imply accounts, cloud synchronization, bookings, payments, AI coaching, or camera tracking exist unless those capabilities are implemented and verified.
