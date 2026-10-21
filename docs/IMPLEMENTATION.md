# Implementation notes

## Product
KINETIK is an original fitness discovery and planning interface informed by the public fitness references in REFERENCE-RESEARCH.md. It is a front-end prototype, not an operating gym, subscription service, medical product, or remote AI coach.

## Main experience
- Responsive navigation links to training, movement library, gym planner, and first-session enquiry.
- Procedural React Three Fiber equipment centerpiece with reduced-motion and fallback behavior.
- Rule-based weekly workout builder with selectable goal, training level, available equipment, number of sessions and duration.
- Searchable and filterable starter movement catalogue with short cues.
- Interactive 12 m × 8 m 2D layout concept grid with equipment placement, selection, rotation and removal.
- Local-only first-session enquiry form. Submitting produces an on-page acknowledgement only; it does not submit a booking, send email, or save data remotely.
- Accessible page sections, keyboard focus, mobile navigation, and browser-local theme preference where storage is available.

## Limitations
- Workout builder is deterministic demo logic; it does not learn from user performance and is not medical advice.
- Movement entries are a small curated starter library, not a comprehensive exercise database and do not include filmed demonstrations.
- Planner is a 2D concept sketch, not a CAD/3D model, building plan, or safety-compliance tool.
- The enquiry form is not connected to a gym or booking/payment service.
- Live browser screenshot testing must be run in an available browser environment; a successful CI build alone does not prove visual correctness.

## Local development
- Node.js 20 or newer
- Install with npm install
- Start with npm run dev
- Type-check with npm run typecheck
- Verify production output with npm run check
