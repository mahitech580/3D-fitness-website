# KINETIK — Find Your Strong

KINETIK is a responsive, photo-led fitness website concept. This stage focuses on the core user experience, clear information architecture, green-forward visual design, and smooth motion. The 3D experience is intentionally paused and can be added in a later stage.

## What is included

- Cinematic gym-photography hero, bold display type, and lime/forest-green palette.
- Sticky navigation with an accessible mobile menu.
- Training approach and three photo-led program cards: strength, conditioning, and mobility.
- Consistency feature, three-step training loop, and nutrition/recovery section.
- Example weekly training rhythm (clearly labelled as a sample, not a live schedule).
- Weekly habit tracker stored locally in the current browser.
- Starter plan builder based on goal, experience level, and available time.
- Accessible FAQ accordion, focus states, skip link, and reduced-motion support.
- Responsive layouts for desktop, tablet, and mobile screens.
- Scroll reveal animations and smooth in-page navigation.
- Online photography loaded from the Unsplash image CDN.

## Stack

React, TypeScript, Vite, Framer Motion, HTML, and CSS. GitHub Pages deploys the production build from the main branch.

## Run locally

Use Node.js 20 or newer.

1. Install dependencies with npm install.
2. Start the dev server with npm run dev.
3. Run the production/type checks with npm run check.
4. Preview the production build with npm run preview.

The GitHub Actions workflow runs production checks before deployment.

## Data and limitations

This is a website concept, not a real gym service. There is no backend, user account, real gym directory, booking system, membership checkout, hosted AI coach, or cloud synchronization. The weekly tracker and generated sample plan are stored in browser-local storage when available. Example routines are educational starting points, not individualized coaching or medical advice.

Images are remote Unsplash CDN assets and require an internet connection. Check the current terms and attribution guidance at Unsplash before adapting assets for a commercial deployment. See docs/ASSET-CREDITS.md for the image inventory and docs/REFERENCE-RESEARCH.md for the visual direction.

## Next stage

The Three.js equipment study is kept in the repository for potential future use, but it is not loaded or displayed in the current experience. The current priority is the responsive website and its content structure.
