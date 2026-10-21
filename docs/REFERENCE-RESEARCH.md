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

**Implementation decision:** Add an indexed set of sample movements, search, category filters, and short cues. This is authored starter content, not a claim that a complete exercise video database exists.

**Do not copy:** Article text, media assets, exercise database data, or claims of an operational AI assistant.

### 4. Thor Fitness Builder
URL: https://builder.thor.fitness/

**Observed:** The publicly accessible page describes drawing a room and walls, adding equipment in 3D, measuring distances, working across floors/doors/windows/mirrors, saving/restoring plans, and exporting images/video. The interface text shows a palette of equipment types and planning controls; full interactive browser behavior was not fully verified from page text alone.

**Useful pattern:** Let visitors manipulate a space and see simple metrics change immediately.

**Implementation decision:** Add a lightweight 2D gym-planning grid with a room measurement, equipment placement, selection, rotation, removal, and occupancy summary. Label it explicitly as a concept planner; it does not provide a true CAD drawing, code-compliant fit-out, or exported 3D model.

**Do not copy:** Thor branding, equipment product images, proprietary model assets, or an implication that the local grid equals Thor's full 3D tool.

## 3D and interaction references

### 5. Lusion
URL: https://lusion.co/

**Observed:** The accessible page describes a studio focused on 3D visual storytelling and interactive web experiences, with a featured-work presentation and a clear relationship between creative direction, design, motion, and development.

**Useful pattern:** A central 3D object should have a clear art direction and a reason to exist, rather than function as background decoration alone.

**Implementation decision:** Use a purpose-built procedural barbell illustration, lit as an object study and integrated into the fitness headline and product story.

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

## Synthesis

- Lead with an assertive athletic identity and one signature 3D object.
- Make the next action concrete: build a week, explore movements, plan a training space, or enquire about a first session.
- Treat workout generation as an explainable local algorithm until a real coaching service is built.
- Treat the planner as a small interactive concept tool, not a construction-grade 3D system.
- Keep a non-WebGL route, reduced motion, keyboard navigation, and truthful product language.
- References and claims above reflect accessible page content, not a full cross-device usability or performance audit.
