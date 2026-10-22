# Reference research — fitness experience

Research date: 2026-10-21.

The observations below are grounded in the public pages' accessible page content. Several experiences are client-rendered and the browsing surface does not expose every visual state or pointer interaction; those interactions are marked as unverified rather than inferred.

## Fitness/product references

### 1. WTF Gyms
URL: https://www.wtfgyms.com/

**Observed:** The home page leads with a fitness-transformation message, a first-visit offer, a multi-field trial form, gym/membership onboarding, body-composition tracking, group-class access, expert support, AI workout/diet positioning, and a progress-tracking/app story. The accessible page currently presents a ₹1 one-day pass; that offer belongs to WTF Gyms and is not reused in this project.

**Useful pattern:** Give visitors a clear first step, show what they can do next, and make the trial journey easy to understand.

**Implementation decision:** Add a structured first-session enquiry form, explain what happens on submit, and keep membership details honest. It is a local prototype, not a real booking/payment integration.

**Do not copy:** WTF name, logo, artwork, offer copy, unverified metrics, or claims about gyms this project does not operate.

### 2. Freeletics
URL: https://www.freeletics.com/en/

**Observed:** The homepage presents a digital training app with multiple modalities, training goals, coaching, and exercise/program guides. Its help content says setup includes goals/training journey, available equipment, selected training days and preferences; performance feedback can influence a coaching plan.

**Useful pattern:** Make workout planning reflect the user's actual constraints rather than show the same routine to everyone.

**Implementation decision:** Add a client-side workout builder with goal, training level, available gear, session count, and session duration options. Explain that the current plan is rule-based in the browser, not a remote AI coach.

**Do not copy:** Freeletics name, coach UX, illustrations, subscription claims, or its customer statistics.

### 3. Fitness.com
URL: https://www.fitness.com/en

**Observed:** The accessible homepage includes health/wellness editorial content, training guides, exercise video listings, nutrition recipes, a searchable exercise catalogue, and a fitness AI coach area.

**Useful pattern:** A fitness destination should remain useful after the hero: people need to browse exercises and find information, not only click a large CTA.

**Implementation decision:** Keep a typed movement catalogue and detailed guidance records connected by exercise ID. Search covers exercise names and guidance, and filters include category, primary muscle, equipment, difficulty and movement pattern; users can sort results and expand step-by-step technique, common mistakes, secondary muscles and alternatives. This is authored starter content, not a claim that a complete exercise/video database exists.

**Do not copy:** Article text, media assets, exercise database data, or claims of an operational AI assistant.

### 4. Thor Fitness Builder
URL: https://builder.thor.fitness/

**Observed:** The publicly accessible page describes drawing a room and walls, adding equipment in 3D, measuring distances, working across floors/doors/windows/mirrors, saving/restoring plans, and exporting images/video. The interface text shows a palette of equipment types and planning controls; full interactive browser behavior was not fully verified from page text alone.

**Useful pattern:** Let visitors manipulate a space and see simple metrics change immediately.

**Implementation decision:** Build a shared room-layout model displayed in a 1 m-grid 2D editor and an interactive procedural 3D room. The user can select, drag, rotate, duplicate, numerically position and remove fifteen equipment types; collision/bounds validation, room measurements and finishes, camera presets, undo/redo, local save/load, JSON import/export and 2D/3D PNG export use that layout state. This remains a concept planner, not a professional CAD model or code-compliant fit-out.

**Do not copy:** Thor branding, equipment product images, proprietary model assets, or an implication that the local grid equals Thor's full 3D tool.

## 3D and interaction references

### 5. Lusion
URL: https://lusion.co/

**Observed:** The accessible page describes a studio focused on 3D visual storytelling and interactive web experiences, with a featured-work presentation and a clear relationship between creative direction, design, motion, and development.

**Useful pattern:** A central 3D object should have a clear art direction and a reason to exist, rather than function as background decoration alone.

**Implementation decision:** Keep the equipment-only 3D motion lab and the separately controllable gym designer as different tools. The motion stage uses procedural weights and abstract geometry rather than a human model.

**Do not copy:** Lusion's projects, branding, scene layouts, or creative assets.

### 6. Bruno Simon
URL: https://bruno-simon.com/

**Observed:** The accessible page exposes a navigable 3D world with explicit keyboard, touch, and gamepad controls, including camera movement, jump/interact, pause/reset, and performance-quality settings. Full playthrough testing was not performed here.

**Useful pattern:** Spatial interaction needs visible instructions, recovery controls, and a usable route for non-mouse devices.

**Implementation decision:** Keep scene interaction bounded; use accessible DOM for actions and retain ordinary document scrolling. The main site does not require a game controller or force world navigation.

**Do not copy:** The driving-game metaphor, vehicle, game world, or hidden secrets/rewards.

### 7. Immersive Garden — Rainforest
URL: https://immersive-g.com/projects/rain-forest-food

**Observed:** The project description identifies a horizontal sliding experience using WebGL, photo montages, sound, dynamic camera movement, image distortion and parallax; it also describes click-to-reveal details.

**Useful pattern:** Reveal information in layers and use motion to connect scenes.

**Implementation decision:** Use restrained section reveals and direct transitions between training tools; do not hijack the page's default vertical scrolling for a horizontal tour.

**Do not copy:** Rainforest brand assets, project photography, scene content, or sound.

### 8. Wild Interactive — Creative Technology
URL: https://www.wildinteractive.co.nz/creative-technology

**Observed:** The accessible page describes an immersive WebGL site featuring a cursor-following torch, morphing live illustration, x-ray mode, and spatial sound. These features are described by the studio; this research pass did not measure their runtime performance.

**Useful pattern:** Environmental response can reinforce a theme and help the visitor explore.

**Implementation decision:** Keep pointer response subtle and optional, use the equipment scene to support the story, and make motion respectful of reduced-motion settings.

**Do not copy:** Its exact illustrations, effects, proprietary source code, or visual identity.

### 9. Active Theory — Creative Digital Experiences
URL: https://activetheory.net/

**Observed:** The requested domain returned a page titled “Active Theory · Creative Digital Experiences” but the readable browser response only displayed “Please enable JavaScript.” The interactive portfolio and individual case studies could not be inspected from the available browser output.

**Useful pattern:** No specific interaction pattern is claimed from this inaccessible session.

**Implementation decision:** Continue with a restrained, product-oriented 3D scene and functional fitness tools; do not attribute any unverified interaction to this reference. Revisit this site when a full browser session is available.

**Do not copy:** No proprietary layout, art, animation, or code was inspected or adopted.

### 10. Awwwards — 3D websites and WebGL websites
URLs: https://www.awwwards.com/websites/3d/ and https://www.awwwards.com/websites/webgl/

**Observed:** Both category pages timed out during this research pass. Their individual example sites and interactions were therefore not inspected.

**Useful pattern:** None is credited to a specific Awwwards entry because the category pages were inaccessible in this session.

**Implementation decision:** Do not fabricate a list of examples or imply that individual awarded experiences were audited. Keep the existing original procedural equipment art, section-based navigation, and interactive 2D/3D gym editor as the concrete implementation.

**Do not copy:** No specific award-winning site or asset was identified or copied from these category pages.

## User-supplied reference audit

The following repository sources and live pages were inspected for layout structure, section sequencing and animation technique. They are design references only; the implementation uses its own text, layout and geometry.

### 11. Deri Kurniawan — 3D Portfolio
URLs: https://3d-portfolio.derikn.com/ and https://github.com/Deri-Kurniawan/3d-portfolio

**Observed in source:** the hero layers several isolated decorative illustrations and animates their entrance with Framer Motion. The page then continues through a stack, projects, a connection section and a quote instead of stopping after the hero.

**Applied:** decorative motion, layered composition and a clear multi-section rhythm. The portfolio's artwork and identity are not reused.

### 12. PR Fitness
URLs: https://prfitnessmundur.vercel.app/ and https://github.com/GYM-3D-WEBSITES/prfitness

**Observed in source:** the experience combines an atmospheric background, a 3D scene, procedural dumbbell and treadmill models, scroll progress, and separate About, Programs, Trainers, Gallery, Products and Contact sections.

**Applied:** an equipment-only Three.js scene, image-led sections, and a page structure with training paths, gallery and clear CTAs. The source code, brand and photo assets are not copied.

### 13. Gym@freaks
URLs: https://pawar-pratik.github.io/3D-Gym-Website/ and https://github.com/Pawar-Pratik/3D-Gym-Website

**Observed in source:** the hero uses repeated scrolling typography and a Canvas; its source describes a Blender-built 3D sequence controlled by scroll progress. The README explicitly warns that the original page is not responsive and several controls do not work.

**Applied:** a reduced-motion-aware motion-led visual language and animated objects, while keeping the layout responsive and the existing controls functional. No human model or original frame sequence is reused.

### 14. Fitlife and Futras
URLs: https://codewithsadee.github.io/fitlife/ and https://github.com/codewithsadee/fitlife; https://codewithsadee.github.io/futras/ and https://github.com/codewithsadee/futras

**Observed in source:** Fitlife uses a hero image, split About layout, video-banner panel, image-based class cards, service cards, a blog feed and footer. Futras uses a similarly section-based fitness/nutrition landing page with image-forward content blocks.

**Applied:** photographic backgrounds, training-path cards, editorial imagery and a clearer section sequence. Template text, logos and the repositories' photo assets are not copied.

### 15. Gym Trainer
URL: https://isax5.github.io/gym-trainer/

**Observed:** the page explains an exercise app with a clear feature-card grid, in-app screenshots, guided sessions, progress records, theme/unit controls and local-first privacy positioning.

**Applied:** concise feature explanations and honest wording about browser-local data; no unsupported member counts, trainers, venue availability, or real booking claims are added.

## Official technical documentation

### Three.js — WebGLRenderer
URL: https://threejs.org/docs/pages/WebGLRenderer

The documentation describes the WebGL renderer and provides an explicit `.dispose()` method for freeing renderer GPU resources once the renderer is no longer used. The application uses React Three Fiber's managed Canvas lifecycle and does not add a competing manual render loop. This documentation is a reminder not to dispose of renderer-owned objects while they remain in use.

### React Three Fiber — Performance pitfalls
URL: https://r3f.docs.pmnd.rs/advanced/pitfalls

The guidance recommends reusing geometries/materials where practical and avoiding React state updates in a per-frame animation loop or for every high-frequency pointer movement. The planner snaps equipment to a 1 m grid and updates its shared layout only when the snapped position changes, rather than writing state for every pixel moved.

### React Three Fiber — Scaling performance
URL: https://r3f.docs.pmnd.rs/advanced/scaling-performance

The guide explains demand-driven rendering for scenes that can become idle, and notes that imperative camera/control updates must still request renders when using that mode. The KINETIK hero has intentional movement and the planner has interactive camera controls, so any future move to on-demand rendering needs to preserve those control updates. No FPS or performance-score claim is made without measurement.

## Synthesis

- Lead with a photographic, multi-section fitness brand experience, followed by an equipment-only 3D motion lab, movement selection, manual rep logging, explicit follow-along demo cycles and local training history.
- Keep secondary tools connected to the core training task: choose a focus, build a week, study a movement, design a gym space, or prepare a local-only enquiry.
- Treat workout generation as an explainable local algorithm until a real coaching service is built.
- Treat the planner as a small interactive concept tool, not a construction-grade 3D system.
- Keep a non-WebGL route, reduced motion, keyboard navigation, and truthful product language.
- References and claims above reflect accessible page content, not a full cross-device usability or performance audit.
