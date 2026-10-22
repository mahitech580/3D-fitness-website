# Kinetik — Fitness Experience Engineering Rules

## Product direction
This repository is an original fitness brand experience and training workspace. Design references reviewed include Deri Kurniawan's 3D portfolio, PR Fitness, Gym@freaks, Fitlife, Futras, Gym Trainer, WTF Gyms, Freeletics, Fitness.com, and Thor Fitness Builder. Use these for patterns, not branding, text, or copied assets. The active direction is image-led athletic editorial: charcoal, chalk, acid-lime accents, oversized typography, full-bleed gym photography, richer multi-section storytelling, and functional training tools. Use equipment-only 3D animation—barbells, dumbbells, plates and abstract geometry—with no 3D human/avatar model.

## Visual direction
- Put strong, licensed gym photography into hero and section backgrounds; use overlays and contrast for legible text.
- Build distinct programs, editorial/gallery, studio, and closing CTA sections; do not stop after a single hero or pile every control above the fold.
- 3D models are equipment and decorative geometry only. Never add a 3D human/athlete/avatar.
- Scroll can subtly affect equipment motion, but obey reduced-motion settings and keep mobile layouts responsive.

## Interaction requirements
- Make each UI control do the action it advertises.
- Keep workout planning deterministic and transparent; do not claim AI personalization.
- Keep gym layout planning in the browser and describe it as a concept sketch, not a construction-ready or safety-approved plan.
- Trial and contact forms must clearly say they are demos until connected to a trusted backend.
- Do not invent gym locations, membership prices, customer results, testimonials, or partnerships.

## Architecture
- App owns page shell, navigation, theme, and cross-section actions.
- FitnessScene owns only the decorative/interactive Three.js equipment illustration.
- WorkoutBuilder owns client-side training plan options and generated sessions.
- ExerciseLibrary owns search, movement category filters, and exercise details.
- GymPlanner owns a simple measured floor-grid layout and the equipment palette.
- TrialBooking owns local-only trial interest feedback.
- Keep the exercise and planner data typed, local, and easy to edit.

## 3D and performance
- Use existing React Three Fiber and Drei dependencies; do not add a 3D framework for routine features.
- Cap device pixel ratio, use low-power renderer hints, and respect reduced motion.
- Keep 3D object transforms bounded and interruptible; don't route every frame through React state.
- Declarative React Three Fiber resources stay under R3F lifecycle management. Dispose only manually-owned resources.
- If WebGL fails or JavaScript cannot start, preserve a useful HTML-first page.

## Accessibility and responsiveness
- Keep semantic landmarks, visible focus, real section anchors, labels on all form controls, and touch-friendly hit areas.
- Keyboard access cannot depend on hover.
- Support reduced motion, narrow screens, zoom, and high-contrast/forced-colors preferences.
- Avoid horizontal overflow except within clearly labelled, intentionally scrollable planner surfaces.

## Validation
- Run the production typecheck/build and smoke checks before declaring success.
- Review CI and Pages deployment for the final main commit.
- If browser automation or a screenshot environment is unavailable, state that limitation and do not claim visual testing that did not happen.
- Record references, implementation decisions, and third-party asset/license status in docs.
