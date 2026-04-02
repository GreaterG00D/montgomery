"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Wipe loader off screen
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          // Flip app visibility as the wipe starts, not after it ends.
          // This prevents seeing the rings alone before the hero mounts in.
          onStart: onComplete,
        });
      },
    });

    // Animate progress bar from 0→100
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: function () {
          const v = Math.round(this.targets()[0].val);
          setPercent(v);
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${v / 100})`;
          }
        },
      }
    );

    // Brief hold at 100
    tl.to({}, { duration: 0.3 });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#050508" }}
    >
      {/* Logo / name */}
      <div className="mb-12 text-center">
        <h1
          className="font-display text-white"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            letterSpacing: "0.08em",
          }}
        >
          William
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #ff2d2d, #ff6b00, #ffaa00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Montgomery
          </span>
        </h1>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <div
          ref={barRef}
          className="loader-bar absolute inset-0 h-full"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Percent counter */}
      <span
        ref={countRef}
        className="mt-4 text-[10px] tabular-nums tracking-[0.2em] text-[#666680]"
      >
        {String(percent).padStart(3, "0")}
      </span>

      {/* Tagline */}
      <p
        className="absolute bottom-8 text-[9px] tracking-[0.25em] uppercase text-[#333340]"
      >
        I Ain&apos;t Never Gonna Stop
      </p>
    </div>
  );
}
