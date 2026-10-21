# Ritually — Kairo Studio

An editorial 3D experience shaped around warm paper, cobalt pigment, botanical linework, and an original porcelain-dragon sculpture. The repository name stays in place for URL compatibility; the site's creative identity follows the supplied Kairo Studio reference.

## Run locally

Requirements: Node.js 20 or newer.

1. Install dependencies with **npm install**.
2. Start the Vite server with **npm run dev**.
3. Run **npm run typecheck** to check the TypeScript project.
4. Run **npm run build** to produce the production site in **dist/**.
5. Run **npm run preview** to review the production build locally.
6. Run **npm run check** to build and smoke-test the production output.
7. Run **npm run verify:build** after a build to validate the required static Pages artifacts.

## Experience

- **Original procedural 3D artwork:** custom tapered body geometry, instanced relief scales, cobalt accents, articulated paws, horns, mane, and whiskers.
- **Editorial composition:** oversized Cormorant serif typography, compact mono labels, botanical SVG framing, watercolor washes, and a subtle paper-grain layer.
- **Responsive navigation:** mobile menu, close-on-selection behavior, and Escape-key dismissal.
- **Keyboard command palette:** use Ctrl/Cmd + K to search and jump to any page section.
- **Reading palette:** switch between paper and night themes; the preference is stored locally when browser storage is available.
- **Notebook explorer:** filter by theme, search entries, and open each short editorial note in a reading dialog.
- **Enquiry hand-off:** validate a local enquiry and copy its prepared text without implying that a message was sent.
- **Share action:** use the native share sheet or copy the current page URL when sharing is unsupported.
- **Accessible motion:** Framer Motion respects the system preference and the WebGL scene switches to demand rendering when reduced motion is requested.
- **Resilient 3D:** a scene error boundary and illustrated fallback keep the rest of the page usable if WebGL is unavailable.
- **Real section navigation:** Listen, Culture & Makers, Learn, and Reserve links target actual page sections.
- **Honest enquiry prototype:** the form validates in the browser and explains that it does not send or persist messages until a delivery endpoint is connected.

## Performance and deployment

The artwork is created in code rather than downloaded from an external 3D model host. React Three Fiber uses a capped device-pixel ratio and the low-power WebGL hint; production bundles separate Three.js, React Three Fiber, and Framer Motion where possible. Source maps are disabled for production output.

GitHub Pages deployment is defined in **.github/workflows/deploy.yml** and runs from **main**. The Vite base path is configured for the repository Pages URL. If Pages is not already enabled for this repository, set its publishing source to GitHub Actions in repository settings.

## Project map

- **src/components/PorcelainDragon.tsx** — procedural sculpture and motion.
- **src/components/DragonScene.tsx** — WebGL scene, responsive camera, lighting, and fallback boundary.
- **src/components/HeroSection.tsx** — title, hero framing, and canvas placement.
- **src/components/StudioSections.tsx** — searchable notebook, note reader, and local enquiry draft.
- **src/components/CommandPalette.tsx** — keyboard section search and jumping.
- **src/components/ShareSiteButton.tsx** — native share sheet and clipboard fallback.
- **scripts/verify-build.mjs** — production artifact smoke checks.
- **public/404.html** — branded not-found experience for GitHub Pages.
- **src/styles.css** — design tokens, layout, responsive rules, and accessible focus styling.
- **src/assets/porcelain-branch.svg** — original botanical line illustration.
- **.github/workflows/deploy.yml** — build and GitHub Pages deployment.

## Known limitation

The enquiry form is front-end only. It deliberately does not claim to deliver a message; connect a trusted form endpoint or backend before using it for real enquiries.
