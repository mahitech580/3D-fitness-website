# KINETIK — Interactive 3D workout and fitness lab

An original 3D-first workout experience. Open directly into a Three.js training floor with an articulated athlete, six selectable animated movement patterns, manual rep logging or clearly labeled follow-along demo cycles, target-driven sets, and local session history. Workout programming, movement education, gym concepts and the 2D/3D gym designer support that main experience.

## Features

- **3D motion lab (primary experience):** an articulated procedural athlete animates six movement patterns in a Three.js / React Three Fiber gym. Orbit the camera or switch views, select movements, change tempo, and follow technique cues.
- **Real rep logging:** manual training mode counts reps only when you log a rep you physically completed. Optional follow-along mode counts avatar animation cycles separately; it never claims to track your body or camera.
- **Set completion and saved sessions:** complete three sets to store a record in this browser. The history labels manual reps versus demo cycles and stores session duration.
- **Workout builder:** configure goal, level, equipment, location, preferred intensity, session duration, available weekdays, and movements to avoid. The browser-side rule engine builds a repeatable week; it is not a hosted AI coach.
- **Reusable workout templates:** save, reload, and remove up to eight named preference templates in this browser. Templates regenerate sessions from the current movement catalog.
- **Guided session execution:** start, pause/resume, previous/next movement, change to an alternative movement, start/skip a rest timer, and finish a session.
- **Training history and progress:** completed sessions and weekly checkmarks are stored locally and summarized in a small progress view. Clearing site storage can remove this data.
- **Movement library:** searchable authored starter content, filters for category, equipment, primary muscle, difficulty and movement pattern, plus sorting, coaching instructions, common mistakes, and suggested alternatives.
- **Gym concept explorer:** six illustrative venue concepts can be filtered by city and training focus. They are fictional product concepts, not real businesses or verified venues.
- **2D/3D gym planner:** shared room/equipment state across a 1 m floor grid and a procedural 3D room; edit room dimensions, add/select/move/rotate/duplicate/remove objects, use numeric position controls, and check basic bounds/overlap.
- **Planner persistence and export:** undo/redo, auto-save, explicit browser-local save/load, validated JSON import/export, 2D floor-plan PNG export, and 3D preview PNG export. Browser-local data is not cloud-synced.
- **First-session enquiry prototype:** prefill the concept of interest, validate an enquiry, then review/copy the prepared request. It does not contact a gym or create a booking.
- **Accessibility and layout:** responsive navigation, keyboard-focus indicators, reduced-motion handling, semantic section headings, status announcements, and responsive planner/training controls. The 3D motion lab offers keyboard-operable HTML controls alongside pointer/touch camera navigation.

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
