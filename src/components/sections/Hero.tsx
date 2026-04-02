"use client";

import React, { useEffect, useRef, lazy, Suspense } from "react";
import { gsap } from "gsap";
import ScrollPrompt from "@/components/ui/ScrollPrompt";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const HeroScene = lazy(() => import("@/components/3d/HeroScene"));

// Split text into individual chars wrapped in spans
function SplitChars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden="true"
          style={{ lineHeight: "1.1" }}
        >
          <span
            className="inline-block gsap-char-inner"
            data-char={char}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const { progress } = useScrollProgress();

  // Entrance animations after load
  useEffect(() => {
    const delay = 0.5;
    const chars = headlineRef.current?.querySelectorAll(".gsap-char-inner");

    if (chars && chars.length) {
      gsap.fromTo(
        Array.from(chars),
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.9,
          stagger: 0.025,
          delay,
          ease: "power4.out",
        }
      );
    }

    // Gentle darkening overlay — lets blur do the heavy lifting
    gsap.to(overlayRef.current, {
      opacity: 0.45,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "40% top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  // Scroll-driven depth-of-field dissolve on 3D scene
  const sceneStyle: React.CSSProperties = {
    transform: `scale(${1 + progress * 0.1})`,
    opacity: Math.max(0, 1 - progress * 1.6),
    ...(progress > 0.01 && { filter: `blur(${progress * 5}px)` }),
  };

  // Text blurs + lifts away as you scroll — cinematic rack focus
  const textStyle: React.CSSProperties = {
    opacity: Math.max(0, 1 - progress * 2.8),
    transform: `translateY(${progress * -50}px)`,
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── 3D Canvas ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={sceneStyle}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <HeroScene mouse={mouse} scrollProgress={progress} />
        </Suspense>
      </div>

      {/* ── Soft edge vignette — peripheral only ───────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            // Reduce edge darkness so rings stay visible near the scroll prompt.
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, rgba(5,5,8,0.25) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Scroll darkening overlay ───────────────────────────── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[2] pointer-events-none bg-[#050508] opacity-0"
        aria-hidden="true"
      />

      {/* ── Headline ───────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 md:px-12 w-full" style={textStyle}>
        {/* Main headline — font scales by whichever dimension is smaller */}
        <div ref={headlineRef}>
          <h1
            className="block leading-none text-white"
            style={{
              fontFamily: "var(--font-bebas), 'Impact', sans-serif",
              fontSize: "clamp(4.5rem, min(18vw, 22vh), 11rem)",
              letterSpacing: "0.02em",
            }}
          >
            <SplitChars text="I AIN'T" />
            <br />
            <SplitChars text="NEVER" className="inline-block" />
            <span
              aria-hidden="true"
              style={{
                display: "block",
                background: "linear-gradient(135deg, #ff2d2d 0%, #ff6b00 50%, #ffaa00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "var(--font-bebas), 'Impact', sans-serif",
                fontSize: "clamp(4.5rem, min(18vw, 22vh), 11rem)",
                lineHeight: 1,
              }}
            >
              GONNA
            </span>
            <SplitChars text="STAAAAAHP" />
          </h1>
        </div>

      </div>

      <ScrollPrompt />
    </section>
  );
}
