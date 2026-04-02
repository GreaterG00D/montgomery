---
name: William Montgomery Website Redesign
description: Full-stack Next.js 16 personal website with cinematic 3D/WebGL hero, GSAP scroll animations, and Lenis smooth scrolling
type: project
---

Complete redesign of williamfmontgomery.com as a cinematic, immersive web experience.

**Why:** User wanted Lando Norris-style premium/futuristic aesthetic while preserving the high-energy "I ain't NEVER GONNA STAAAAAHP" personal brand.

**Stack:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, React Three Fiber, Three.js, GSAP + ScrollTrigger, Lenis smooth scroll, Framer Motion available.

**Key design decisions:**
- Dark theme (#050508 bg) with fire gradient accents (red/orange/yellow) and ice blue secondary
- Bebas Neue display font for all headlines
- Custom GLSL shaders for EnergyOrb (icosahedron with Perlin noise displacement + fresnel rim)
- Particle field with additive blending for energy atmosphere
- Floating torus rings around the orb
- Lenis synced to GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
- Loader wipes upward with GSAP after 1.6s progress bar animation
- All GSAP ScrollTrigger animations use `toggleActions: "play none none reverse"`

**How to apply:** When modifying this site, maintain the fire/ice color palette, keep display font as Bebas Neue via CSS var `--font-bebas`, and use GSAP for all scroll-driven animations (not CSS transitions for performance).
