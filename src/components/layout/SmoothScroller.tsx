"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SNAP_DEBOUNCE_MS = 90;
const SNAP_EASE = (t: number) => 1 - Math.pow(1 - t, 4); // ease-out quart
const SNAP_DURATION = 1.0;
// Only snap if the section top is within this many px of the viewport top
const SNAP_THRESHOLD_PX = window !== undefined ? window.innerHeight * 0.55 : 500;

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ── Scroll snap ────────────────────────────────────────────────
    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;

    const getSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("section[id]"));

    const snapToNearest = () => {
      if (isSnapping) return;
      const sections = getSections();
      if (!sections.length) return;

      let nearest: HTMLElement | null = null;
      let nearestDist = Infinity;

      for (const section of sections) {
        const dist = Math.abs(section.getBoundingClientRect().top);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = section;
        }
      }

      // Only snap if we're meaningfully off-centre — avoids no-op snaps
      if (!nearest || nearestDist < 6) return;
      // Don't snap if the user scrolled far past the threshold (fast scroll)
      if (nearestDist > SNAP_THRESHOLD_PX) return;

      isSnapping = true;
      lenis.scrollTo(nearest, {
        offset: 0,
        duration: SNAP_DURATION,
        easing: SNAP_EASE,
        onComplete: () => {
          isSnapping = false;
        },
      });
    };

    const onScroll = () => {
      if (isSnapping) return;
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToNearest, SNAP_DEBOUNCE_MS);
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, []);

  return <>{children}</>;
}
