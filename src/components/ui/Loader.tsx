"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Real Tennessee outline derived from GeoJSON (43 points, ~4:1 aspect ratio)
const TN_PATH =
  "M 141.2,18.2 L 140.1,0.0 L 153.8,4.4 L 232.7,2.2 L 301.9,6.1 L 314.2,5.0 " +
  "L 360.8,8.3 L 414.3,9.4 L 415.3,7.7 L 540.0,8.8 L 537.3,32.5 L 525.6,37.4 " +
  "L 517.7,56.1 L 506.4,52.3 L 481.8,71.5 L 480.0,61.6 L 471.5,68.2 L 457.8,90.8 " +
  "L 441.7,96.3 L 426.2,111.7 L 409.1,112.2 L 393.7,127.1 L 388.9,143.6 " +
  "L 376.6,145.8 L 374.8,169.4 L 294.3,170.0 L 184.7,168.3 L 131.9,168.9 " +
  "L 115.1,168.9 L 0.0,168.9 L 6.2,166.1 L 12.3,148.5 L 11.3,124.3 " +
  "L 23.0,107.8 L 25.0,92.4 L 34.3,86.9 L 36.3,68.2 L 48.7,42.9 " +
  "L 48.3,18.2 L 51.7,18.2 L 55.9,18.2 L 63.4,17.1 L 141.2,18.2 Z";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tl = gsap.timeline();

    // Fill Tennessee outline left→right as progress runs
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: function () {
          const v = Math.round(this.targets()[0].val);
          setPercent(v);
          if (clipRectRef.current) {
            clipRectRef.current.setAttribute("width", String((v / 100) * 540));
          }
        },
      }
    );

    // Brief hold at 100
    tl.to({}, { duration: 0.3 });

    if (prefersReducedMotion) {
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.2,
        ease: "power2.inOut",
        onStart: onComplete,
      });
      return;
    }

    // 1) pull back small — cinematic anticipation
    tl.to(heroRef.current, {
      y: 24,
      scale: 0.62,
      duration: 0.42,
      ease: "power3.in",
    }, "+=0");

    // 2) slow cinematic zoom-out — like a film title reveal
    tl.to(heroRef.current, {
      y: -18,
      scale: 1.72,
      duration: 1.4,
      ease: "power4.out",
    }, "-=0.05");

    // 3) fade tagline
    tl.to(taglineRef.current, {
      y: -10,
      opacity: 0,
      duration: 0.26,
      ease: "power2.in",
    }, "-=0.22");

    // 4) wipe loader up
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
      onStart: onComplete,
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#050508" }}
    >
      {/* Title + state icon move as one unit */}
      <div ref={heroRef} className="flex flex-col items-center">
        <h1
          className="font-display text-white mb-8 text-center"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            letterSpacing: "0.08em",
            lineHeight: "0.97",
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

      {/* Tennessee state — fills left→right with gradient as it loads */}
      <div style={{ width: 280 }}>
        <svg
          viewBox="-10 10 560 168"
          width="full"
          height="full"
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            <clipPath id="tn-progress-clip">
              <rect ref={clipRectRef} x="0" y="-10" width="0" height="190" />
            </clipPath>
            <linearGradient id="tn-fill-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff2d2d" />
              <stop offset="50%" stopColor="#ff6b00" />
              <stop offset="100%" stopColor="#ffaa00" />
            </linearGradient>
          </defs>

          {/* Dim white outline — always visible */}
          <path
            d={TN_PATH}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Gradient fill clipped by progress */}
          <path
            d={TN_PATH}
            fill="url(#tn-fill-gradient)"
            clipPath="url(#tn-progress-clip)"
          />

          {/* Percent counter — placed in middle Tennessee */}
          <text
            x="270"
            y="94"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.7)"
            fontSize="28"
            fontFamily="monospace"
            letterSpacing="4"
          >
            {String(percent).padStart(3, "0")}
          </text>
        </svg>
      </div>
      </div>{/* end heroRef */}

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="absolute bottom-8 text-[9px] tracking-[0.25em] uppercase text-[#333340]"
      >
        I Ain&apos;t Never Gonna Stop
      </p>
    </div>
  );
}
