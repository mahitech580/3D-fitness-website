# Implementation notes

## Application structure

- src/App.tsx composes the new responsive experience, section data, accessible navigation, local progress check-ins, FAQ accordion, and rule-based plan builder.
- src/components/KineticObject.tsx builds an equipment-inspired object from Three.js geometry and materials. It contains no people or humanoid meshes, and uses an IntersectionObserver to delay WebGL setup until it is close to the viewport.
- src/styles.css owns the responsive visual system, image overlays, type scale, page transitions, 3D CSS motifs, cards, form states, and reduced-motion fallbacks.
- src/main.tsx is the React mount point.
- scripts/verify-build.mjs checks the production HTML, emitted assets, expected section anchors, manifest, and 3D component.
- scripts/browser-smoke.mjs exercises the plan generator, local progress control, FAQ, canvas loading, mobile navigation, page width, and captures screenshots in CI.

## Page sections

1. Hero / landing
2. Repeating brand strip
3. Training principles
4. Strength, conditioning, mobility
5. Interactive 3D motion lab
6. Plan / train / recover
7. Nutrition and recovery
8. Sample weekly rhythm
9. Browser-local consistency tracker
10. Browser-local starter plan builder
11. FAQ
12. Closing call to action and footer

## Interaction model

- Navigation is anchor-based and works without a client-side router.
- Mobile navigation closes after a link is chosen and on Escape.
- The motion lab uses orbit controls for pointer/touch rotation. The object is built with cylinders, torus rings, and small polyhedra; animation respects reduced-motion settings.
- The weekly tracker logs chosen days in local storage under the key for the current week. The reset control clears those check-ins.
- The starter plan is selected using three form inputs. A small explicit local rule map produces an example plan and stores it in local storage when possible.
- Data stays in the browser. There is no API or server-side persistence.

## Performance and accessibility

- Content images use lazy loading except for the hero image.
- The 3D canvas mounts when near the viewport and caps device pixel ratio at 1.5.
- Native links, radio buttons, select controls, buttons, semantic headings, visible keyboard focus, a skip link, and aria-live plan output support accessible interaction.
- Framer Motion section reveals and CSS animations respect reduced-motion preferences.
- CI builds the project and runs a Playwright smoke test against the production preview.

## Limits

This is a fitness concept, not an operating gym. The week is illustrative rather than a real class schedule. The starter builder follows fixed rules rather than AI inference. No booking, payment, gym inventory, hosted coach, camera-based motion tracking, medical advice, accounts, or cloud synchronization are connected.
