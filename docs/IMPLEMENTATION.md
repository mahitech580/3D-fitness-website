# Implementation notes

## Product boundary

KINETIK is an original fitness discovery, training and space-planning prototype informed by the public reference observations in `REFERENCE-RESEARCH.md`. It is a frontend-only app: there is no API server, user account, remote AI model, payment service, booking integration, or database.

## Main experience

- Responsive site navigation, theme preference, command palette and share affordance.
- Procedural React Three Fiber hero scene with a barbell and plates, pause control, reduced-motion support, and rendering fallback.
- Rule-based weekly workout builder with goal, experience, equipment, location, intensity, session duration, selected weekdays, and avoided-movement preferences.
- Browser-local workout preference templates (up to eight), weekly completion marks, guided session execution, rest timer, movement substitutions, recent history, and a progress summary.
- Curated starter movement library with search, category/equipment/muscle/difficulty/movement filters, sorting, primary and secondary muscle metadata, technique steps, common mistakes and alternatives.
- Six illustrative gym concepts filterable by city and training focus. These are fictional sample records, not real businesses.
- Gym layout editor with adjustable room width/length/height; 15 procedural equipment types; shared state across the 2D plan and 3D room preview; 1 m grid snapping; numeric placement and nudge controls; 3D drag placement; rotation, duplication and removal; basic bounds/overlap checks; undo/redo; local autosave and explicit save/load; JSON import/export; 2D PNG plan export and 3D preview PNG export.
- First-session enquiry form can prefill the selected concept and prepare/copy a request in page state. It transmits nothing and does not book a visit.

## Data and persistence

Browser `localStorage` holds theme preference, workout checkmarks, up to eight workout templates, up to twelve recent workout-history entries, and gym planner auto-saved/saved snapshots when storage is available. These records are on the current browser/device only. There is no authentication or cross-device sync; removing browser/site storage can erase them. JSON export is the portable way to keep a gym layout separately.

The planner validates imported layouts for supported schema, dimension ranges, unique IDs, room bounds and equipment footprint overlap before applying them. Exports provide a versioned JSON layout object. PNG exports create a conceptual top-down plan or capture the rendered 3D canvas. Equipment models are procedural and simplified; they are not verified manufacturer models.

## Safety and truthfulness

- Workout recommendations are deterministic rules over a compact authored catalogue, not AI-generated coaching, medical advice or performance prediction.
- Movement instructions are general informational cues, not a substitute for instruction from a qualified professional.
- Planner collision/bounds checks are coarse geometric checks only. They do not evaluate weight/load bearing, circulation, accessibility, emergency egress, legal clearances or manufacturer requirements.
- Gym concepts are fictional samples, not real businesses. No addresses, opening hours, prices, membership terms or reservation availability are asserted.
- A prepared first-session request remains in current page state. The prototype does not send email, persist the request or contact a gym.
- Build success alone does not establish UI correctness. Actual screenshot/browser testing at desktop and mobile sizes, touch-device testing, WebGL context-loss behavior, and export-download checks remain necessary before claiming production readiness.

## Local development

- Node.js 20 or newer.
- Install with `npm install`.
- Run `npm run dev` to start Vite.
- Run `npm run typecheck` to type-check the source.
- Run `npm run check` for the production build and artifact smoke checks.
