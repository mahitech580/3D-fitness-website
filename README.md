# Kairo Studio — Ritually

An editorial, interactive 3D website based on the supplied Kairo Studio reference: warm ivory paper, cobalt watercolor, oversized italic serif typography, porcelain-inspired dragon artwork, botanical ornament, and a quiet studio navigation.

## Run locally

1. Install Node.js 20 or later.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run typecheck` and `npm run build` before deploying.

## Implementation notes

- React, TypeScript, Vite, Three.js, and React Three Fiber.
- The dragon is an original procedural mesh composition with a continuous tapered body, instanced relief scales, cobalt accent clusters, articulated-looking limbs, horns, mane, whiskers, and porcelain lighting.
- The procedural character is an art-directed fallback, not a scanned or externally sourced production GLB. A detailed, properly licensed rigged asset would be the next step toward matching every detail in the reference video.
- The background and corner ornaments are lightweight CSS/SVG; reduced-motion and WebGL-failure fallbacks keep the page useful without 3D rendering.
- Navigation targets real sections. The enquiry form validates locally and clearly states that it does not send data until a delivery endpoint is configured.
- GitHub Pages deployment is configured in `.github/workflows/deploy.yml`.

## Accessibility and performance

Keyboard focus styles, semantic sections, responsive layouts, reduced-motion handling, capped device pixel ratio, lazy-loaded canvas rendering, and a CSS fallback are included. No external model or font file is bundled; editorial fonts use CSS fallbacks.

## Reference

The visual direction comes from the supplied `kairo-studio-hero.mp4` and the Kairo Studio master prompt. The repository name is retained for URL compatibility, while the experience itself follows that reference's creative-studio identity.
