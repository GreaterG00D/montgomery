"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
      <div ref={frameRef} style={{ position: "relative", width: "min(480px, 88vw)", aspectRatio: "9/16" }}>

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
            objectPosition: "top",
            display: "block",
            borderRadius: "2px",
            clipPath: "inset(0 0 50px 0)",
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
            background: "conic-gradient(from 0deg, #ff2d2d, #ff6b00, #ffaa00, transparent, transparent, #ff2d2d)",
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
            background: "conic-gradient(from 180deg, transparent, transparent, #ffaa00, #ff6b00, transparent)",
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
                borderTop:    !isBottom ? "2px solid #ff6b00" : undefined,
                borderBottom:  isBottom ? "2px solid #ff6b00" : undefined,
                borderLeft:   !isRight  ? "2px solid #ff6b00" : undefined,
                borderRight:   isRight  ? "2px solid #ff6b00" : undefined,
              }}
            />
          );
        })}

        {/* ── Orange glow behind frame ──────────────────────────── */}
        <div aria-hidden="true" style={{
          position: "absolute",
          inset: "-30px",
          borderRadius: "4px",
          background: "radial-gradient(ellipse at center, rgba(255,107,0,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: -1,
        }} />
      </div>
    </section>
  );
}
