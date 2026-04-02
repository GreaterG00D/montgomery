"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScrollPrompt() {
  const ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance
    gsap.fromTo(ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, delay: 2.5, ease: "power2.out" });

    // Bouncing dot
    gsap.to(dotRef.current, {
      y: 12,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Fade out on scroll
    const handler = () => {
      if (window.scrollY > 80) {
        gsap.to(ref.current, { opacity: 0, duration: 0.3 });
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
      aria-hidden="true"
    >
      <span className="text-[9px] tracking-[0.3em] uppercase text-[#666680]">
        Scroll
      </span>
      {/* Mouse icon */}
      <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
        {/* Accent changes per section feel */}
        <div ref={dotRef} className="w-1 h-1 rounded-full bg-[#00aaff]" />
      </div>
    </div>
  );
}
