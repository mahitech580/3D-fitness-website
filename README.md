# KINETIK — Train With Intent

KINETIK is a responsive, photo-led fitness website concept. This phase focuses on the full website experience, a distinctive forest-green and lime visual identity, interactive training paths, and usable mobile layouts. The 3D equipment study is intentionally not loaded by the active page; it is reserved for a later phase.

## Experience map

- Editorial hero: oversized typography, layered fitness photography, and clear calls to explore training.
- Sticky navigation, an accessible mobile menu, and smooth in-page navigation.
- Training philosophy: intent, repeatable effort, and recovery.
- Three photo-led program cards: strength, conditioning, and mobility.
- Consistency feature and an interactive training-path explorer with selectable goal tabs.
- Fitness photo moodboard/gallery with responsive crops and subtle image hover states.
- Nutrition and recovery section.
- Filterable example weekly plan: all days, strength, conditioning, or recovery.
- Local consistency tracker; completed days stay in the current browser.
- Starter-plan builder with goal, level, and time inputs.
- Accessible FAQ accordion, visible keyboard focus, skip link, and reduced-motion support.
- Responsive layouts for desktop, tablet, and phone screens.

## Visual direction

The visual research combines the confident identity and focused calls to action found on Barry's, the lifestyle/editorial sectioning of Equinox, the structured training categories of Rogue, the photo-led green strength-gym reference from Relentless Strength, and current gym UX guidance from Gymdesk and Zarla. KINETIK's page, copy, and code are original; those references informed the broad design direction rather than being copied.

## Stack

React, TypeScript, Vite, Framer Motion, HTML, and CSS. GitHub Pages deploys the production build from main.

## Run locally

Use Node.js 20 or newer.

1. Install dependencies with npm install.
2. Start the dev server with npm run dev.
3. Run type, production-build, and artifact checks with npm run check.
4. Preview the production build with npm run preview.

The GitHub Actions workflow is configured to run the production checks before deployment.

## Data and limitations

This is a website concept, not a real gym or coaching service. There is no backend, user account, real gym directory, booking system, membership checkout, hosted AI coach, or cloud synchronization. The weekly tracker and generated example plan use browser-local storage when available. Example routines are educational starting points, not individualized coaching or medical advice. The site intentionally uses no fabricated member counts, reviews, real prices, or real class bookings.

Fitness photographs load remotely from Unsplash and require an internet connection. Review the current Unsplash terms and attribution guidance before using the assets in a commercial service. See docs/ASSET-CREDITS.md for the image inventory and docs/REFERENCE-RESEARCH.md for the design references.

## Next stage

Reintroduce the Three.js equipment experience after the core responsive layout, photos, interactions, and content have been reviewed. The existing scene component is retained but is not imported or rendered by the current homepage.
