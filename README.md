# KINETIK — Fitness, built around you

An original fitness experience combining a procedural 3D equipment centerpiece, rule-based workout planning, a searchable movement starter library, an interactive gym layout concept, and a transparent first-session enquiry flow.

## Features
- **3D equipment hero:** procedural barbell and plates, pointer/touch rotation, graceful fallback, reduced-motion behavior.
- **Workout builder:** choose goal, training level, available gear, session count and duration; generate an explainable browser-side weekly plan.
- **Movement library:** search and filter authored starter entries by focus and equipment.
- **Gym layout planner:** place, rotate, select, and remove equipment within a measured 12 m × 8 m grid.
- **First-session enquiry:** a validated local-only prototype that does not claim to submit a real booking.
- **Responsive accessibility:** mobile navigation, keyboard focus, reduced-motion support, and high-contrast consideration.
- **Build guardrails:** production-output smoke verification alongside TypeScript and Vite build.

## Run locally
1. Install with \`npm install\`.
2. Start Vite with \`npm run dev\`.
3. Check TypeScript with \`npm run typecheck\`.
4. Build and verify with \`npm run check\`.
5. Preview the built site with \`npm run preview\`.

## Documentation
- \`docs/REFERENCE-RESEARCH.md\` records observations and design decisions for the provided fitness and immersive-web references.
- \`docs/IMPLEMENTATION.md\` describes the product architecture and current limitations.
- \`docs/ASSET-CREDITS.md\` records the project's authored assets and third-party asset policy.
- \`CLAUDE.md\` contains the permanent product, accessibility, and engineering rules.

## Product honesty
This is a front-end demo. The workout builder uses local rules, not a hosted AI model. The planner is a 2D concept sketch, not a construction plan. The enquiry form does not send or store a booking. No customer count, gym availability, membership price, or outcome is claimed.

GitHub Pages deploys from \`main\` at https://mahitech580.github.io/3D-fitness-website/.
