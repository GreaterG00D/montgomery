"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Same thickness as Hero "GONNA" stroke: clamp(4px, 0.04em, 18px) — em tied to headline font size. */
const GONNA_OUTLINE_FONT = "clamp(4.5rem, min(18vw, 22vh), 11rem)";

export default function RingSection() {
  const sectionRef       = useRef<HTMLElement>(null);
  const frameRef         = useRef<HTMLDivElement>(null);

  // Layer 1 — black fill, behind video
  const outerBack = useRef<HTMLDivElement>(null);
  const innerBack = useRef<HTMLDivElement>(null);

  // Layer 3 — border only, above video
  const outerFront = useRef<HTMLDivElement>(null);
  const innerFront = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(frameRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: frameRef.current, start: "top 75%", toggleActions: "play none none reverse" },
        }
      );

      // Outer pair — same rotation, both divs move in sync
      gsap.to([outerBack.current, outerFront.current], {
        rotation: 360,
        duration: 12,
        ease: "none",
        repeat: -1,
      });

      // Inner pair — counter-rotate in sync
      gsap.to([innerBack.current, innerFront.current], {
        rotation: -360,
        duration: 8,
        ease: "none",
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ring-section"
      aria-label="Highlight video"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        id="ring-orb-target"
        ref={frameRef}
        style={{ position: "relative", width: "min(480px, 88vw)", aspectRatio: "9/16" }}
      >

        {/* ── Layer 1: black-filled rectangles (behind video) ───── */}
        <div
          ref={outerBack}
          aria-hidden="true"
          style={{ position: "absolute", inset: "-14px", borderRadius: "4px", background: "#000" }}
        />
        <div
          ref={innerBack}
          aria-hidden="true"
          style={{ position: "absolute", inset: "-6px", borderRadius: "4px", background: "#000" }}
        />

        {/* ── Layer 2: video ────────────────────────────────────── */}
        <video
          src="/william-highlight.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: "2px",
          }}
        />

        {/* ── Layer 3: orange border only (above video) ─────────── */}
        <div
          ref={outerFront}
          aria-hidden="true"
          style={{ position: "absolute", inset: "-14px", borderRadius: "4px", zIndex: 2 }}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "4px",
            padding: "1.5px",
            background:
              "conic-gradient(from 0deg, var(--accent-red), var(--accent-orange), var(--accent-amber), transparent, transparent, var(--accent-red))",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }} />
        </div>

        <div
          ref={innerFront}
          aria-hidden="true"
          style={{ position: "absolute", inset: "-6px", borderRadius: "4px", zIndex: 2 }}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "4px",
            padding: "1px",
            background:
              "conic-gradient(from 180deg, transparent, transparent, var(--accent-amber), var(--accent-orange), transparent)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0.7,
          }} />
        </div>

        {/* ── Corner accents ────────────────────────────────────── */}
        {["topLeft","topRight","bottomLeft","bottomRight"].map((corner) => {
          const isRight  = corner.includes("Right");
          const isBottom = corner.includes("bottom");
          return (
            <div
              key={corner}
              aria-hidden="true"
              style={{
                position: "absolute",
                zIndex: 3,
                width: "20px",
                height: "20px",
                [isBottom ? "bottom" : "top"]: "-8px",
                [isRight  ? "right"  : "left"]: "-8px",
                borderTop:    !isBottom ? "2px solid var(--accent-orange)" : undefined,
                borderBottom:  isBottom ? "2px solid var(--accent-orange)" : undefined,
                borderLeft:   !isRight  ? "2px solid var(--accent-orange)" : undefined,
                borderRight:   isRight  ? "2px solid var(--accent-orange)" : undefined,
              }}
            />
          );
        })}

        {/* ── Orange glow behind frame ──────────────────────────── */}
        <div aria-hidden="true" style={{
          position: "absolute",
          inset: "-30px",
          borderRadius: "4px",
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--accent-orange) 12%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: -1,
        }} />
        {/* ── CTA — inside frame, pinned to bottom ──────────────── */}
        <div style={{
          position: "absolute",
          bottom: "-8px",
          left: "-55px",
          right: "-55px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          zIndex: 10,
        }}>
          {/* Headline */}
          <div
            style={{ textAlign: "center", transition: "opacity 0.25s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <p style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#fff",
              margin: 0,
            }}>
              Buy This
            </p>
            <p style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              background:
                "linear-gradient(135deg, var(--accent-red) 0%, var(--accent-orange) 50%, var(--accent-amber) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
            }}>
              Shirt
            </p>
          </div>

          <a
            href="https://www.rockinpins.com/product/william-montgomery-american-flag-tie-dye-shirt"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              padding: "1.25rem 0",
              borderRadius: "999px",
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: GONNA_OUTLINE_FONT,
              lineHeight: 1,
              textTransform: "uppercase",
              textDecoration: "none",
              background: "linear-gradient(135deg, var(--accent-red), var(--accent-orange))",
              border: "clamp(4px, 0.04em, 18px) solid #0a0a0a",
              boxSizing: "border-box",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 0 0 color-mix(in srgb, var(--accent-orange) 0%, transparent)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 0 36px color-mix(in srgb, var(--accent-orange) 60%, transparent)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 0 color-mix(in srgb, var(--accent-orange) 0%, transparent)";
            }}
          >
            <span style={{ fontSize: "2rem", letterSpacing: "0.12em", color: "#fff", lineHeight: 1 }}>
              Shop Now
            </span>
            <span style={{ fontSize: "20px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>
              rockinpins.com
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
