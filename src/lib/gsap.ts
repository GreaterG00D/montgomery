/**
 * GSAP singleton — import this instead of importing GSAP directly
 * so ScrollTrigger is registered exactly once, client-side only.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Animate staggered characters into view.
 */
export function animateCharsIn(
  targets: Element | Element[] | NodeListOf<Element>,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
  } = {}
) {
  const {
    delay = 0,
    duration = 0.7,
    stagger = 0.04,
    ease = "power3.out",
  } = options;

  const arr = Array.isArray(targets)
    ? targets
    : targets instanceof NodeList
    ? Array.from(targets)
    : [targets];

  return gsap.to(arr, {
    y: "0%",
    opacity: 1,
    duration,
    stagger,
    delay,
    ease,
  });
}

/**
 * Standard scroll-triggered reveal.
 */
export function scrollReveal(
  target: string | Element,
  vars: gsap.TweenVars = {}
) {
  return gsap.fromTo(
    target,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: target as Element,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      ...vars,
    }
  );
}
