# Image asset inventory and usage notes

The active page uses remote Unsplash CDN images. The exact image IDs are listed below, with crop and quality parameters set in \`src/App.tsx\` to limit transfer size. These are still external resources: network access and the source CDN are required for photos to appear.

## Active images

| Use | Unsplash image ID |
|---|---|
| Hero gym interior | \`photo-1534438327276-14e5300c3a48\` |
| Strength program | \`photo-1583454110551-21f2fa2afe61\` |
| Conditioning program | \`photo-1538805060514-97d9cc17730c\` |
| Mobility and recovery | \`photo-1518611012118-696072aa579a\` |
| Nutrition and recovery | \`photo-1490645935967-10de6ba17061\` |
| Gym-floor feature | \`photo-1571902943202-507ec2618e8f\` |
| Athlete and gallery | \`photo-1517836357463-d25dfeac3438\` |
| Functional training and gallery | \`photo-1534258936925-c58bed479fcb\` |

The original asset inventory was reviewed in the context of this fitness concept. The production page's copy, brand, section layout, CSS visual system, and 3D equipment models are project code rather than copied material from a reference gym.

## Design reference sites

- [Relentless Strength](https://werelentless.com/) — dark gym interior, green accents, and strong architectural perspective.
- [HypeFit](https://www.hypefit.de/) — green-lit gym and equipment atmosphere.
- [BLK BOX training facilities](https://www.blkboxfitness.com/pages/1-3-5-series) — functional-training context.
- [GreenTheory](https://greentheory.it/pages/osmannoro) — green equipment and an open gym floor.

These links are visual references, not the source of the active page's images. Review the current [Unsplash license](https://unsplash.com/license) and terms before commercial use. Store licensed local assets in the repository if the deployment must not depend on the external image CDN.
