"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useScrollProgress } from "@/hooks/useScrollProgress";

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

  // Text blurs + lifts away as you scroll — cinematic rack focus
  const textStyle: React.CSSProperties = {
    opacity: Math.max(0, 1 - progress * 2.8),
    transform: `translateY(${progress * -50}px)`,
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative z-[2] mb-[-1px] w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Soft edge vignette — peripheral only ───────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, rgba(10,10,10,0.28) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 82%, rgba(0,0,0,0.35) 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 82%, rgba(0,0,0,0.35) 92%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Scroll darkening overlay — fade out at bottom so no hard seam vs Socials ─ */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[2] pointer-events-none bg-[#0a0a0a] opacity-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.45) 88%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.45) 88%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Headline + anchor for WMLogo (centered, below type) ── */}
      <div
        className="relative z-10 flex w-full flex-col items-center px-6 md:px-12"
        style={textStyle}
      >
        <div ref={headlineRef} className="w-full text-center">
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
                background:
                  "linear-gradient(135deg, var(--accent-red) 0%, var(--accent-orange) 50%, var(--accent-amber) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                WebkitTextStroke: "clamp(4px, 0.04em, 18px) #0a0a0a",
                paintOrder: "stroke fill",
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
        <div
          id="hero-logo-anchor"
          className="pointer-events-none mt-10 h-px w-full max-w-3xl shrink-0 opacity-0"
          aria-hidden
        />
      </div>
    </section>
  );
}
