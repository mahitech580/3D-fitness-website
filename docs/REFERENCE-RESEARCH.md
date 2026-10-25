# Gym website reference research and design decisions

Research reviewed on 25 October 2026. The goal was to study real fitness websites and current gym UX guidance, then apply the strongest general patterns to an original KINETIK concept. This research informed design choices; no source site's copy, exact composition, or source code was copied.

## Main website references

### [Barry's](https://www.barrys.com/)

The site makes the core workout format easy to understand through distinct RUN and LIFT sections, a prominent first-class action, beginner guidance, and secondary lifestyle/amenity content.

**Applied to KINETIK:** separate training paths into strength, conditioning, and mobility; place visible action links near the top; give every path a clear next step; include recovery and nutrition as part of the overall routine. KINETIK does not copy Barry's brand, booking links, claims, testimonials, or commercial offers.

### [Equinox](https://www.equinox.com/)

Equinox organizes its brand around a broader high-performance lifestyle, with clean navigation across clubs, membership, classes, personal training, and recovery/wellness experiences. Its homepage uses confident headline statements and large photography to create a premium editorial feel.

**Applied to KINETIK:** use a lifestyle-oriented narrative, distinct photo/text compositions, and editorial pacing between sections. No club count, membership offer, or premium amenities are claimed for KINETIK.

### [Rogue Fitness](https://www.roguefitness.com/)

Rogue's site is highly structured around training categories, strength equipment, conditioning, mobility, recovery, and sports/athlete content.

**Applied to KINETIK:** organize the experience around recognizable training goals and clear categories rather than one generic list of gym features.

### [Relentless Strength](https://werelentless.com/)

The gym interior imagery provides a useful green-accent reference: black equipment, long perspective lines, and crisp overhead lighting produce a serious strength-training atmosphere.

**Applied to KINETIK:** forest-green and near-black surfaces, restrained lime accents, and gym photography with strong framing.

### [Gymdesk — gym website examples and UX guidance](https://gymdesk.com/blog/9-gym-website-ideas-what-makes-a-good-gym-website)

This May 2026 guide emphasizes a clear above-the-fold action, real photos of a venue and members, mobile-first interaction, easy schedule/pricing discovery, and avoiding friction in the next step.

**Applied to KINETIK:** the hero has a direct action; navigation stays visible on desktop and becomes a mobile menu; the weekly schedule is built into the page and filterable; images are assigned alt text. Because KINETIK is only a concept, it does not invent a booking flow, price list, venue, customer reviews, or member totals.

### [Zarla — gym website examples, updated September 2026](https://www.zarla.com/inspiration/gym)

The review notes repeated patterns across real gym pages: lead with an aspirational promise, make the first action obvious, show photography, and communicate a clear training identity rather than a generic feature list.

**Applied to KINETIK:** strong headline positioning (“Built by the work”), photo-led program cards, clear training categories, and a coherent green visual identity.

### [UI Discovery — gym and fitness website pattern library](https://uidiscovery.com/websites/gym-fitness)

The library aggregates sections from fitness brands and products such as Gymshark, Peloton, Equinox, Barry's, and others. Its overview shows recurring use of hero, feature, statement, and call-to-action sections.

**Applied to KINETIK:** varied page rhythm—hero, principles, program cards, full-width image statement, interactive path explorer, photo collage, weekly plan, local tracker, and plan builder—rather than repeating the same card grid throughout.

## Photography references reviewed

- [Relentless Strength](https://werelentless.com/cdn/shop/files/DSC02099_1024x1024.jpg?v=1679068967)
- [HypeFit](https://www.hypefit.de/images/_Q4dW_Fvu9-1920.jpeg)
- [BLK BOX training facilities](https://www.blkboxfitness.com/pages/1-3-5-series)
- [GreenTheory facility](https://greentheory.it/pages/osmannoro)
- [Gym website design inspiration collection](https://dribbble.com/tags/gym-website)

The active site uses separate Unsplash CDN assets documented in docs/ASSET-CREDITS.md, not the reference sites' images.

## Implementation choices

- The active page includes three original real-time 3D equipment models—barbell, dumbbell, and kettlebell—built from Three.js geometry and materials through React Three Fiber. It is not a video or a 2D image; pointer/touch dragging rotates the model through Drei's orbit controls.
- Equipment tabs switch between the three models. Visitors can enable/disable automatic rotation, zoom the view, and reset the camera/object state. Reduced-motion preferences automatically disable camera rotation.
- The WebGL code is lazy-loaded when the lab approaches the viewport; the canvas is then mounted only while its own viewport observer says the lab is near the screen. This avoids continuously rendering while the visitor reads other sections.
- Rendering uses a capped device-pixel ratio and a low-power WebGL preference. A CSS barbell study is available while the canvas mounts and as the WebGL fallback.
- The scene honors the reduced-motion preference by stopping automatic object rotation. The CSS fallback also disables its orbit animation for reduced-motion users.
- The training-path tabs support Arrow keys, Home, and End, and plan-builder input changes invalidate stale generated results.
- Accent color is bright lime green against forest/near-black green; cream surfaces keep the long page readable.
- Real photography is mixed with original typography and flat CSS details; no fake performance metrics or testimonials are used.
- Motion is intentional: scroll-reveal entrances, a restrained marquee, hover image zooms, and smooth anchor navigation.
- Interactions include mobile navigation, goal tabs that update training guidance, schedule filters, local session check-ins, a plan builder, and an accessible FAQ accordion.
- KINETIK stays clearly labelled as a concept rather than pretending to be a real gym or medical service.

## Technical references for the 3D implementation

- [React Three Fiber — Canvas API](https://r3f.docs.pmnd.rs/api/canvas): used for the WebGL scene; its documented fallback and dpr options inform graceful fallback and bounded rendering resolution.
- [Three.js — Responsive design](https://threejs.org/manual/pages/responsive.html): informed sizing the canvas through the surrounding CSS layout and avoiding unbounded device-pixel rendering on high-density displays.
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion): informs the reduced-motion treatment for the scene and CSS placeholder.

## Verification priorities

Keep testing the equipment switcher on mobile and low-power devices, including WebGL-unavailable fallback behavior. Review the remote photo selection and replace any images that do not fit the finished brand direction with appropriately licensed local assets. Add new 3D interactions only when they improve the visitor's understanding of the training concept.


## Additional research pass: turning visual inspiration into useful interactions

The current pass compared the live-site patterns and 2026 design reviews below. The useful common thread is not to copy a specific brand's layout, but to pair a distinct visual identity with clear next steps and practical information.

- [UI Discovery — gym and fitness website patterns](https://uidiscovery.com/websites/gym-fitness): section-level comparison of brands such as Oura, WHOOP, Gymshark, Peloton, and Equinox. Applied as a clear hero-to-features-to-action rhythm rather than a generic block catalogue.
- [Gymdesk — gym website examples and conversion principles](https://gymdesk.com/blog/9-gym-website-ideas-what-makes-a-good-gym-website): emphasizes quick clarity, mobile usability, and obvious next actions. Applied to the existing section anchors and the new session blueprint; no invented booking, pricing, reviews, or real-gym claims were added.
- [Zarla — gym design examples](https://www.zarla.com/inspiration/gym): emphasizes identity, a specific audience, and an easy-to-understand user journey. Applied by extending KINETIK's original training-process narrative rather than imitating any brand's wording.
- [My Personal Trainer Website — gym design examples (2026)](https://mypersonaltrainerwebsite.com/blog/the-20-best-gym-website-designs): highlights premium imagery and clear program navigation. Used as a review checklist for the current photo-led direction and distinct training paths.

### New feature: session blueprint

The new Session Blueprint section adds a four-stage routine—arrive, prepare, practise, reset—with concise guidance and flexible time ranges. It is educational site content, not individualized coaching. It links into the existing starter-plan builder, has responsive two-column/one-column layouts, and disables hover movement under reduced-motion preferences. Browser smoke tests now assert the section and all four cards exist.

### Next review criteria

- Confirm the 3D models visibly render on real mobile hardware, not only that a canvas element exists.
- Prefer locally hosted, appropriately licensed photos if the site must remain reliable when third-party CDNs are unavailable.
- Keep example schedule, progress tracking, and generated plans clearly labeled as browser-only concepts.


### New feature: searchable movement index

The movement index adds a small reference library of 12 starter movements across strength, conditioning, and mobility/reset. Visitors can search by movement name, equipment, focus, or coaching cue; filter by category; and reset a no-results state. This extends the design research into a practical, low-friction interaction rather than adding decorative sections alone.

Research informing the decision:
- [Gymdesk's 2026 fitness website review](https://gymdesk.com/blog/9-gym-website-ideas-what-makes-a-good-gym-website) recommends clear navigation, mobile usability, and useful next steps.
- [Zarla's gym website examples](https://www.zarla.com/inspiration/gym) emphasizes helping visitors understand the training identity and journey quickly.
- [UI Discovery's 54-site fitness index](https://uidiscovery.com/websites/gym-fitness) shows common patterns around feature sections, hero sections, and calls to action.
- [Hostinger's fitness website examples](https://www.hostinger.com/tutorials/fitness-website-examples/) reinforces clear navigation and informative content as recurring design choices.

Implementation notes: the library is intentionally educational, not a prescription or a claim of professional coaching. It does not fabricate testimonials, reviews, pricing, membership availability, or medical outcomes. The responsive card grid and filter controls include keyboard focus styles and an explicit no-results/reset path. Browser smoke tests exercise the default list, category filtering, search, and reset interaction.


## Deep-dive: live 3D interaction references (25 October 2026)

This pass focused specifically on real-time 3D websites and configurators, rather than conventional fitness marketing pages. The objective is to borrow interaction patterns while preserving KINETIK's original visual identity and keeping the scene useful.

- [Three.js Resources showcase](https://threejsresources.com/showcase): a broad catalogue of live Three.js projects across product configurators, creative portfolios, educational projects, games, and immersive experiences. Reference lesson: choose a clear interaction for the scene instead of adding motion without purpose.
- [Mesh3D Gallery](https://mesh3d.gallery/): curated live Three.js experiences, including Igloo Inc., Shopify Editions, The Symphony of Vines, and work by specialist creative studios. Reference lesson: give the 3D scene a recognizable material and art direction.
- [Utsubo — Best Three.js Websites 2026](https://www.utsubo.com/blog/best-threejs-websites-2026): technique-focused review of real projects. Reference lesson: interaction should be paired with technical restraint and a reason for the visitor to explore.
- [WebView3D](https://webview3d.com/): web-based product configurator with rotation, zoom, object highlighting, and custom configuration. Reference lesson: expose a small set of meaningful choices and show the result immediately.
- [ASRR interactive demos](https://asrr.nl/demos): browser-based house configuration, solar system, galaxy, and physics playground examples. Reference lesson: interactive controls should directly affect the live scene.
- [Web Design Awards — Three.js sites](https://www.webdesignawards.io/technology/three-js): current nominated-site index and scoring categories. Reference lesson: visual design, usability, accessibility, performance, and multi-device support all matter alongside technical novelty.
- [Psychoactive Studios — WebGL and interactive 3D agencies](https://www.psychoactive.co.nz/content-hub/best-webgl-interactive-3d-agencies): examples of specialist studios and real-time brand experiences. Reference lesson: use cinematic motion selectively and keep the product or message legible.

### Feature added: live material finishes

The KINETIK 3D lab now lets visitors switch the currently selected barbell, dumbbell, or kettlebell between three material treatments: Kinetik lime, Carbon, and Steel. The chosen finish changes the model's material palette in the live Three.js scene; it is not a screenshot swap. The selector is keyboard accessible, exposes its selected state with `aria-pressed`, adapts to narrow screens, and keeps the existing scene mounted while changing finishes.

The production bundle checks now verify the finish control labels, and the Playwright smoke test exercises all three options and confirms that the WebGL canvas remains present. The scene continues to respect the existing reduced-motion behavior and deferred loading strategy.

### Further investigation priorities

- Test the finish picker and orbit controls on actual touch devices and low-powered GPUs.
- Consider part-level color controls or a lighting preset only if the interface remains understandable and performance stays acceptable.
- Keep the scene's first render small and defer heavy effects; do not replace the live model with a video or pre-rendered image and call it interactive.


## Deeper technical pass: interaction patterns translated into KINETIK (25 October 2026)

This pass distinguishes actual real-time 3D interaction from surface-level "3D-looking" decoration. The reference set was evaluated for the mechanism that makes the experience work, not only the visual style.

### Reference analysis

- [Utsubo — Best Three.js Websites 2026](https://www.utsubo.com/blog/best-threejs-websites-2026): identifies inertial single-object presentation in Oryzo, scroll-sequenced product reveals in Shopify Editions, and separate product alcoves in Cartier. The useful principle is to keep one object legible and make camera changes purposeful rather than stacking visual effects.
- [Three.js official examples](https://threejs.org/examples/): the canonical implementation reference for OrbitControls, physical materials, environment maps, light probes, shadows, post-processing, and performance examples. These demonstrate that rendering quality is a combination of material response, light setup, camera controls, and GPU budget.
- [Mesh3D Gallery](https://www.mesh3d.gallery/): a curated index of current interactive Three.js experiences, including Shopify Editions, Igloo Inc., The Symphony of Vines, ORYZO AI by Lusion, and Cyera AI Guardian by Active Theory. The useful principle is to establish a coherent visual system and a distinct interaction rather than borrow someone else's brand assets.
- [Undream Studio — Skybag Experience case study](https://www.undreamstudio.com/projects/skybag-experience/): describes a scroll-driven product viewer with rotating and zooming views, close-up feature reveals, blueprint-grid art direction, and performance-conscious 3D assets. The useful principle is to combine camera framing with an engineering-style interface.
- [Psychoactive Studios — WebGL / interactive 3D studios](https://www.psychoactive.co.nz/content-hub/best-webgl-interactive-3d-agencies): reinforces that high-impact WebGL needs art direction and a performance budget, not just effects.
- [Three.js post-processing manual](https://threejs.org/manual/pages/post-processing.html): explains that bloom, vignette, blur, and other post-processing require an additional render pipeline. This matters for KINETIK because post-processing is not free; first improve direct lighting and material response before adding a costly effects stack.

### New live interactions

The 3D lab now has two additional control systems:

1. **Camera presets:** Hero angle, Front, and Side profile reposition the actual Three.js camera and reset the orbit target, making it faster to inspect each model without manually dragging to a known view.
2. **Lighting presets:** Studio, Contrast, and Neon change the real scene's ambient, directional, and point-light intensity and color. They are actual light-rig changes, not background CSS filters or static screenshots.

The existing equipment selector, finish selector, orbit/zoom, auto-rotation, and reset continue to operate together. All selectors expose their selected state with `aria-pressed`; controls are keyboard focusable; reduced-motion handling for auto-rotation remains intact; and the WebGL canvas is not intentionally remounted when changing light rigs or camera angles.

### Verification added

- Production-bundle checks require the lighting and camera control labels and verify that the UI and Three.js scene wire these settings through.
- Browser smoke tests change all three lighting presets and all three camera presets, check their selected states, and confirm the original WebGL canvas stays connected.
- The CI job still needs to finish before these new checks can be reported as passing. No claim of successful deployment is made until the corresponding workflow reports success.

### Next high-value investigations

- A scroll-linked camera narrative should be added only if it improves object understanding and remains usable with reduced motion and keyboard navigation.
- Environment maps/HDR lighting may improve metallic surfaces, but the asset size and load cost must be measured before adding one.
- GPU profiling and low-end mobile testing should precede expensive shadows, bloom, SSAO, or real-time reflections.
- Do not copy source code, artwork, logos, or proprietary assets from reference websites; reuse interaction principles and implement KINETIK's own design.


## Guided product story implementation — 25 October 2026

A follow-up technical pass translated scroll-storytelling references into a deliberately accessible first implementation. The reference pattern is a continuous scene with distinct narrative beats, but the implementation avoids adding a heavy animation dependency or hijacking native page scroll.

References reviewed:
- [Marie Tech It — 24 Animated Website Examples & the Tech Behind Them (2026)](https://marietechit.com/24-animated-website-examples-the-tech-behind-them-2026/): contrasts Apple-style scroll-linked product storytelling with always-running 3D, and notes reduced-motion still-image alternatives.
- [Undream Studio — Skybag Experience](https://www.undreamstudio.com/projects/skybag-experience/): product camera changes and close-ups tied to a blueprint-like product narrative.
- [Scroll-driven Three.js example](https://github.com/AETumiApp/threejs-scroll-animation/blob/main/examples/scroll-scene.html): deterministic normalized progress, visibility-aware rendering, adaptive quality and a static reduced-motion state.
- [Eric Jokl — Real-Time City Scene](https://ericjokl.com/work/city-scene): useful caution that an immersive scene should be measured on real devices and removed or reduced when its performance cost outweighs its value.
- [Motion — Three.js scroll example](https://motion.dev/examples/js-three-scroll): a current example of scroll values driving a real Three.js visual.

### KINETIK implementation choices

- Added three explicit story beats: Form, Finish, and Detail.
- Added step buttons plus Previous/Next navigation, with selected state, keyboard-operable controls and live text updates.
- Story beats adjust the actual scene's camera distance and elevation. Users can still drag to orbit, use the existing camera presets, switch equipment, materials and light rigs.
- Kept native page scrolling intact. The story does not pin the whole page or force-scroll the user, which reduces friction on phones and with assistive technology.
- Kept the existing single canvas mounted during story navigation.
- Added browser smoke coverage for selecting beats, advancing and reversing, and retaining the same canvas; added production bundle checks for story content and camera wiring.

This is a guided, user-controlled story rather than a full scroll-scrubbed camera timeline. That is intentional for this iteration: it adds narrative to the existing code without introducing GSAP/ScrollTrigger or a second animation loop before mobile profiling. CI must pass before the feature is considered verified or deployed.

## Follow-up visual pass: interactive 3D reference direction (25 October 2026)

### [mesh3d.gallery](https://mesh3d.gallery/)
The live gallery describes itself as a curated collection of interactive, real-time Three.js experiences, with examples such as immersive product, storytelling, and studio sites. The useful pattern is not a particular page layout; it is the sense that a website can have a real-time visual element with its own lighting, material, and motion instead of relying entirely on a static hero image.

**Applied to KINETIK:** the hero includes an original Three.js heavy-bag scene with a restrained orbital rig, particle accents, a small grid overlay, and a viewport observer that stops rendering when the scene is far off-screen. The 3D equipment lab remains independently interactive and keeps its existing finish, lighting, camera, and story controls.

### [RUSTRIOT Gym](https://rustriot-gym.netlify.app/)
This was supplied as the second visual reference for a more distinctive sport/fitness mood. The target for KINETIK is a similarly assertive, equipment-focused visual rhythm, without copying its code, content, assets, or exact layout.

**Applied to KINETIK:** the typography, metallic details on equipment models, layered image framing, and dimensional hover treatments now carry more of the same energetic direction across the full page—from training principles and programs to the movement index, weekly plan, tracker, builder, and closing call to action.

### Quality constraints retained
- Existing wording, page sections, anchors, and user interactions remain unchanged.
- 3D work is built from the existing Three.js / React Three Fiber dependencies; no new runtime dependencies or external 3D model downloads are required.
- The additional hero canvas is observed against the viewport and unmounted when far off-screen.
- Reduced-motion handling remains in place, and new hover depth is restricted to pointer-capable devices where possible.
- Automated verification now checks that the hero WebGL scene is present, sized, and viewport-aware as well as checking the existing equipment configurator.

