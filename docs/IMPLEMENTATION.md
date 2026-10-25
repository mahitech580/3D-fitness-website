# Implementation and verification notes

## Application structure

- \`src/App.tsx\` composes the hero, mobile navigation, fitness content, equipment selector, keyboard-accessible training tabs, weekly filters, browser-local tracker, plan builder, and FAQ.
- \`src/components/KineticObject.tsx\` builds barbell, dumbbell, and kettlebell models from Three.js geometry and materials. The React Three Fiber canvas is mounted near the viewport and released offscreen.
- \`src/styles.css\` owns the responsive visual system, image overlays, form states, equipment-console layout, motion treatment, and reduced-motion fallbacks.
- \`src/main.tsx\` mounts React; \`src/vite-env.d.ts\` supplies Vite's client types.
- \`index.html\` carries SEO and social metadata plus a visible no-JavaScript fallback; \`public/\` contains the favicon, PWA manifest, robots/sitemap files, and a Pages-compatible 404 page.
- \`scripts/verify-build.mjs\` checks production artifacts, metadata, required sections, styles, and the active 3D models.
- \`scripts/browser-smoke.mjs\` exercises browser interactions and saves desktop/mobile/3D screenshots as a CI artifact.

## Page sections

1. Editorial hero and navigation
2. Moving brand strip
3. Interactive 3D equipment lab
4. Training principles
5. Strength, conditioning, and mobility cards
6. Consistency feature and interactive goal explorer
7. Photo moodboard
8. Nutrition and recovery
9. Filterable example weekly plan
10. Browser-local consistency tracker
11. Browser-local starter-plan builder
12. FAQ, closing CTA, and disclaimer footer

## Interaction model

- Navigation uses in-page anchors. The mobile menu closes on Escape and when a navigation link is chosen.
- Equipment tabs change the model without recreating the WebGL canvas. The lab supports pointer/touch orbit, wheel/pinch zoom, automatic rotation, and camera reset.
- Training-path tabs support click, Arrow keys, Home, and End. Selecting a path can prefill the plan builder.
- Weekly schedule filters are client-side; they do not claim to be a real timetable.
- Tracker check-ins are deduplicated, validated against the seven weekday keys, and stored under the current local week.
- Plan results are validated when read from local storage; changing the goal, starting level, or duration clears a stale generated result.

## Performance and accessibility

- The hero photo is prioritized; content photos are lazy-loaded.
- The 3D code is split from the initial page render and only imports when the lab approaches the viewport.
- Device pixel ratio is capped at 1.5, WebGL uses a low-power preference, and the canvas is unmounted while offscreen.
- Automatic object/camera movement respects reduced-motion preferences. CSS fallback orbit animations also stop for reduced motion.
- Native links, buttons, radio controls, select menus, section headings, visible focus, a skip link, tab roles, and live plan output cover the main interaction needs.
- CI builds, verifies artifacts, and runs a Playwright smoke suite. Pages deployment starts only after CI succeeds on main.

## Limits

This is a frontend concept, not an operating gym. The weekly schedule is illustrative, the plan builder uses fixed templates rather than AI, and no booking, payment, membership, server, account, camera-based body tracking, or medical advice is connected.
