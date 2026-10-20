# Kairo Studio — Project Rules

## Visual direction

Treat the supplied Kairo Studio reference video as the primary art direction. Preserve the ivory paper palette, watercolor cobalt washes, oversized italic editorial serif title, white-and-blue porcelain dragon, blue botanical corners, small tracked navigation, and calm cinematic movement. Do not introduce cyberpunk neon, generic SaaS sections, gold-heavy luxury styling, or unrelated fitness-dashboard UI.

## Architecture

Keep page composition in App and section components, site navigation in SiteHeader, ambient paper/watercolor treatments in WatercolorBackground, vector framing in BotanicalOrnaments, and all WebGL work in DragonScene and PorcelainDragon. Keep decorative assets lightweight and local.

## 3D and memory safety

Prefer React Three Fiber lifecycle ownership for declarative geometries, materials, textures, and meshes. Reuse instanced geometry for repeating scales. Avoid React state updates every frame, per-frame allocations, or uncontrolled render loops. Clamp pixel ratio, handle context failures, and preserve a CSS-only fallback. Dispose only resources this code explicitly owns; never dispose shared cached resources blindly.

## Accessibility and responsiveness

Use semantic landmarks, visible keyboard focus, functional anchors, readable mobile type, no horizontal overflow, and a reduced-motion path. Hover is never the sole interaction mechanism. Keep the header available without a floating card treatment.

## Product honesty

The current dragon is an original procedural mesh study rather than a licensed production GLB. Do not describe it as a scanned or photorealistically sculpted external asset. Enquiry submission is local-only until an approved delivery endpoint is configured; never suggest that a message was emailed or stored by a server.

## Verification

Run `npm run typecheck` and `npm run build` after modifying code. Test desktop and narrow mobile layouts plus reduced motion when browser automation is available. Fix runtime and console errors rather than merely documenting them.
