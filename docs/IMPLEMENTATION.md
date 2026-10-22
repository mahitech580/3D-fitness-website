# Implementation notes

## Product and stack

KINETIK is an original, local-first fitness experience built with React, TypeScript, Vite, Three.js, React Three Fiber, Drei and Framer Motion. It is an independent concept; it is not the official product of any gym chain and is not an operating gym or medical service.

## Main application

- **Application shell:** responsive section navigation, light/dark theme preference, a Ctrl/Command+K command palette wired to valid section IDs, share action, keyboard skip link, reduced-motion configuration and a semantic document structure.
- **3D motion lab (primary training experience):** a custom procedural articulated athlete is assembled from Three.js meshes and animated in six movement cycles (squat, curl, overhead press, jumping jack, reverse lunge and hip hinge/RDL). The gym scene has studio lighting, a rack, floor grid, contact shadows, orbit controls and front/side/three-quarter views. The user can pick movements, adjust tempo, start/pause the timer, and follow form guidance in HTML.
- **Rep tracking modes:** manual training mode accepts explicit rep logging from the user and pauses at the selected movement's rep target; follow-along mode instead counts completed animation cycles. The interface labels these separately because the site does not use a camera or motion tracking to observe a user's body.
- **Session history:** completing the third set saves the exercise, tracking mode, counted reps/cycles, elapsed time, and tempo to browser-local storage. Only the five most recent session records are retained and displayed.
- **Workout planner:** transparent, browser-side rule-based programming using goal, level, equipment, location, intensity, time, days available and avoided-movement preferences.
- **Workout templates:** up to eight named preference sets can be saved, loaded and deleted in browser-local storage. A loaded template regenerates its sessions from the current exercise catalogue and rules; it does not store a custom reordered routine.
- **Workout execution:** start/pause, previous/next movement, rest timer, substitution where available, finish/cancel and completed session recording.
- **Exercise library:** authored starter data can be searched across names, focus, equipment and guidance; filtered by category, primary muscle, equipment, difficulty and movement pattern; and sorted by name or session length. Expanded details include technique steps, common mistakes, secondary muscles and related movement alternatives. It is still a curated starter library without filmed demonstrations.
- **Progress dashboard:** displays values computed from the recent locally saved completion records, including session count, movement count, assigned plan minutes and a five-week activity chart. The history is capped at twelve records; planned minutes are not measured time.
- **Gym discovery:** a searchable directory of six explicitly labeled KINETIK sample venue concepts in Hyderabad, Bengaluru and Chennai, filterable by city and training focus. No live business, address, hours, price, map, or availability feed is connected.
- **Gym designer:** one shared layout state powers a 1 m-snapped 2D floor plan and procedural 3D room scene. Fifteen equipment types have authored procedural shapes. Users can select, drag in 3D, precisely reposition, rotate, duplicate and delete items; overlapping or out-of-bounds placements are blocked. Room width, length and height, selectable rubber/concrete/wood floor finishes, chalk/sage/graphite wall tones, reset/top/front/side/focus camera presets, basic spacing summaries, undo/redo, local autosave, explicit local save/load, JSON import/export, 2D PNG export, and 3D preview PNG export are provided.
- **First-session enquiry:** a validated local-only form can include a selected sample gym concept and prepare a copyable request. It does not submit to a service, send email, accept payment, or make a reservation.

## Data and privacy behavior

Training templates, plan completion markers, 3D session history, theme preference and gym layouts use browser-local storage. They are not synchronized across devices or users. The enquiry request only exists in page state until the user copies it. There is no configured account system, server database, booking API, map provider, hosted AI model, or gym inventory integration.

## Asset policy

The articulated trainer, room, rack, dumbbells, and gym-planner equipment are generated from project-authored geometry and materials; no third-party GLB/GLTF model or captured character animation is bundled. See [ASSET-CREDITS.md](./ASSET-CREDITS.md) for the asset policy and attributions.

## Local development

- Node.js 20 or newer.
- Install packages with `npm install`.
- Start the development server with `npm run dev`.
- Type-check with `npm run typecheck`.
- Produce a production build and run the artifact smoke check with `npm run check`.
- Preview built output with `npm run preview`.

The GitHub Actions workflow on `main` runs the build/smoke-check workflow and publishes the static site to GitHub Pages.

## Known limitations

- All venue entries are sample concepts and must not be interpreted as real gyms.
- Training recommendations are deterministic rules, not an AI coach or individualized medical advice.
- The 3D athlete is procedural animation designed for illustrative demonstration; it is not a motion-capture model, exercise biomechanics simulator, medical tool, or automated form-tracking system. Rep counts measure completed animation cycles, not a person's physical repetitions.
- Exercise coverage is curated starter content; there are no licensed demonstration videos, clinical claims, meal logging, or nutrition database.
- Gym dimensions and equipment footprints are visual planning estimates, not architectural, building-code, accessibility, fire-safety, manufacturer-clearance or professional fit-out certification.
- Saved layouts (including room finish settings), templates and session history live in the current browser only.
- Enquiries do not reach a business. No booking, payment, or membership purchase is completed.
- A successful build does not substitute for browser testing on physical devices. Browser automation/screenshot inspection must be run in an environment where those tools are available.

## Engineering notes

- Keep all active development on `main` for this repository workflow.
- Do not add a `CLAUDE.md` file or require one for setup.
- Preserve the shared typed data models and keep WebGL-specific UI optional rather than making it the only way to access core content.
