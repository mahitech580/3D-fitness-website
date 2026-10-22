# KINETIK — Move with intent

KINETIK is a complete visual rebuild of the fitness experience: a photo-led, editorial landing page with motion design, interactive 3D geometry, training education, and small browser-side tools. The visual focus is real fitness photography and animated 3D objects—not a rendered 3D human.

## Experience map

- **Cinematic landing:** full-bleed gym photography, high-contrast type, CSS 3D geometry, and animated orbit rings.
- **Training approach:** a practical set of principles about planning, technique, and recovery.
- **Three training lanes:** strength, conditioning, and mobility with photographic cards.
- **Interactive motion lab:** a procedural Three.js dumbbell sculpture with metallic materials, animated rings, lighting, and drag-to-orbit controls. The scene is mounted when it approaches the viewport.
- **Training loop:** animated CSS 3D illustration cards for planning, training, and recovery.
- **Fuel and recovery:** photography-led nutrition and recovery section.
- **Example weekly rhythm:** a clearly labelled sample week—not a live timetable.
- **Local consistency tracker:** toggle days completed this week; check-ins are stored in this browser only.
- **Starter plan builder:** build a simple rule-based example based on goal, level, and available time. It is not a hosted AI coach.
- **FAQ and clear product notes:** explains the experience and its limitations.
- **Responsive interaction:** mobile navigation, accessible accordions, focus styles, keyboard navigation, scroll reveals, and reduced-motion support.

## Stack

React, TypeScript, Vite, Three.js, React Three Fiber, Drei, and Framer Motion. GitHub Pages deploys the production build from the main branch.

## Run locally

1. Use Node.js 20 or newer.
2. Install packages with npm install.
3. Start the development server with npm run dev.
4. Check TypeScript and the production bundle with npm run check.
5. Preview the production build with npm run preview.

The CI workflow runs the production checks and a Playwright browser smoke test.

## Data and limitations

There is no backend, user account, real gym directory, booking service, membership checkout, hosted AI model, camera-based repetition tracking, or cloud synchronization. The progress tracker and generated starter plan use browser-local storage when available. The weekly rhythm and workouts are examples, not individual coaching or medical advice. Users should adapt exercise choices to their ability and stop if an exercise causes pain.

The photo assets are loaded from Unsplash's image CDN, so viewing imagery requires an internet connection. See docs/ASSET-CREDITS.md for the asset notes and docs/REFERENCE-RESEARCH.md for the design direction.

## Design references reviewed

The rebuild takes broad inspiration from the references supplied for the task: the 3D-themed polish and motion language of Deri Kurniawan's portfolio, the object-focused 3D direction of PR Fitness and Gym@freaks, and the section hierarchy of Fitlife, Futras, and Gym Trainer. Their source code and layouts were not copied into this project.
