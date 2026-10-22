# KINETIK — Interactive 3D workout and fitness lab

An image-led fitness brand experience paired with an interactive workout workspace. The landing page uses gym photography, training-path cards, an editorial studio section and a gallery before introducing a Three.js equipment-only motion lab. The 3D stage uses barbell, dumbbell, plate and abstract orbit animations—no 3D human or avatar model—alongside manual rep logging, clearly labeled demo cycles, target-driven sets and local session history.

## Features

- **3D motion lab:** a procedural equipment-only Three.js / React Three Fiber scene animates a barbell, adjustable dumbbells, weight plates and abstract orbit geometry. Orbit the camera or switch views, choose a movement focus, tune demo tempo, set the displayed dumbbell load, and follow movement-specific guidance. There is no 3D person/character model.
- **Rep tracking modes:** log reps you physically perform, or use an explicitly labeled follow-along mode that counts equipment animation cycles. These demo cycles are not physical reps and are not measured with a camera.
- **Configurable session:** choose 2–5 sets per movement, select the dumbbell load for weighted movements, use a tempo control and a 30–90 second rest timer, and review session history saved in this browser.
- **Set completion and saved sessions:** complete your selected set target to store a record in this browser. The history labels manual reps versus demo cycles, records session duration and the chosen dumbbell load, and distinguishes bodyweight moves.
- **Workout builder:** configure goal, level, equipment, location, preferred intensity, session duration, available weekdays, and movements to avoid. Compatible planned days include **OPEN IN 3D STUDIO**, which loads that movement into the main workout scene. The browser-side rule engine builds a repeatable week; it is not a hosted AI coach.
- **Reusable workout templates:** save, reload, and remove up to eight named preference templates in this browser. Templates regenerate sessions from the current movement catalog.
- **Guided session execution:** start, pause/resume, previous/next movement, change to an alternative movement, start/skip a rest timer, and finish a session.
- **Training history and progress:** completed sessions and weekly checkmarks are stored locally and summarized in a small progress view. Clearing site storage can remove this data.
- **Movement library:** searchable authored starter content, filters for category, equipment, primary muscle, difficulty and movement pattern, plus sorting, coaching instructions, common mistakes, and suggested alternatives.
- **Gym concept explorer:** six illustrative venue concepts can be filtered by city and training focus. They are fictional product concepts, not real businesses or verified venues.
- **2D/3D gym planner:** shared room/equipment state across a 1 m floor grid and a procedural 3D room; edit room dimensions, add/select/move/rotate/duplicate/remove objects, use numeric position controls, and check basic bounds/overlap.
- **Planner persistence and export:** undo/redo, auto-save, explicit browser-local save/load, validated JSON import/export, 2D floor-plan PNG export, and 3D preview PNG export. Browser-local data is not cloud-synced.
- **First-session enquiry prototype:** prefill the concept of interest, validate an enquiry, then review/copy the prepared request. It does not contact a gym or create a booking.
- **Visual system and accessibility:** image-led hero, photo-backed training-path cards, full-bleed studio backdrop, gallery tiles, responsive navigation, keyboard-focus indicators, reduced-motion handling, semantic section headings, status announcements, and responsive planner/training controls. The 3D motion lab offers keyboard-operable HTML controls alongside pointer/touch camera navigation.

## Run locally

1. Install dependencies with `npm install` (Node.js 20 or newer).
2. Start the development server with `npm run dev`.
3. Type-check with `npm run typecheck`.
4. Build and run production-output checks with `npm run check`.
5. Preview the production bundle with `npm run preview`.

## Documentation

- `docs/REFERENCE-RESEARCH.md` records the accessible findings and design decisions drawn from the supplied fitness and immersive-web references.
- `docs/IMPLEMENTATION.md` documents architecture, local persistence, and known limitations.
- `docs/ASSET-CREDITS.md` records authored assets and the third-party asset policy.

## Product honesty and limitations

This is a browser-side prototype, not an operating gym, paid membership product, medical service, or account-backed fitness platform. No booking, email, payment, cloud synchronization, real-world venue directory, verified gym availability, or actual membership price is connected. Workout recommendations use deterministic rules and hand-authored data; users should adapt any exercise to their own ability and stop if they feel pain. Gym planner footprints, dimensions, and estimated gaps are approximate concepts only—not CAD, building-code compliance, manufacturer clearances, or safety approval. WebGL rendering and camera behavior should be checked in a real browser and on target mobile devices before production use.

GitHub Pages deploys from `main`: https://mahitech580.github.io/3D-fitness-website/
