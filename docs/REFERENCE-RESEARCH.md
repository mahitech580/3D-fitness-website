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
