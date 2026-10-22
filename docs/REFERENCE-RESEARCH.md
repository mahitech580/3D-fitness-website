# Reference research and design decisions

The reference sites were reviewed for broad design patterns. This project uses those patterns as a direction, not as a source-code or layout copy.

## 3D portfolio — Deri Kurniawan
Reference: https://3d-portfolio.derikn.com/ and https://github.com/Deri-Kurniawan/3d-portfolio

What informed the direction: confident typography, intentional motion, clear section hierarchy, and treating the 3D style as part of the whole interface rather than a separate demo. KINETIK adapts that idea to a fitness setting with a restrained lime accent, cinematic photography, and 3D geometry.

## PR Fitness
Reference: https://prfitnessmundur.vercel.app/ and https://github.com/GYM-3D-WEBSITES/prfitness

What informed the direction: 3D equipment as a visual focus, prominent navigation, and multiple dedicated content sections. KINETIK's motion lab uses its own procedural dumbbell-like sculpture; no character model is included.

## Gym@freaks / 3D Gym Website
Reference: https://pawar-pratik.github.io/3D-Gym-Website/ and https://github.com/Pawar-Pratik/3D-Gym-Website

What informed the direction: a sense of depth, scroll-led storytelling, and a clear link between movement and the page. The rebuild uses lightweight CSS motion for background details and reveals, while preserving readable content and responsive layouts rather than requiring users to wait for a long sequence of rendered frames.

## Gym Trainer
Reference: https://isax5.github.io/gym-trainer/

What informed the direction: a focused fitness identity and straightforward action paths.

## Fitlife and Futras
References: https://codewithsadee.github.io/fitlife/ and https://codewithsadee.github.io/futras/

What informed the direction: separating training formats into digestible cards, maintaining a visible route to the next action, and giving nutrition and recovery their own place in the page.

## Decisions for KINETIK

- Replace the existing app shell and section composition rather than layering more styles onto the old experience.
- Use real fitness photography for the page's visual storytelling.
- Do not use 3D human or athlete models. The only 3D canvas is a procedurally built object with non-human geometry.
- Defer the 3D canvas until it approaches the viewport, and keep the HTML controls/content available without interacting with it.
- Support mobile layouts, keyboard navigation, and reduced-motion preferences.
- Label sample workouts and sample weekly programming honestly; do not imply live bookings, real venue data, a medical service, or hosted AI functionality.
