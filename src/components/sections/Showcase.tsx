"use client";

import { useEffect, useRef, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ShowcaseScene = lazy(() => import("@/components/3d/ShowcaseScene"));

const MILESTONES = [
  { year: "2018", label: "Channel Launch", desc: "Started from zero. Literally." },
  { year: "2020", label: "First Viral Hit", desc: "The internet found me. I found the internet." },
  { year: "2022", label: "10K Subscribers", desc: "The momentum became undeniable." },
  { year: "2023", label: "Merch Drop 1.0", desc: "Turned the brand into something you can wear." },
  { year: "2024", label: "100K Strong", desc: "Still here. Still not stopping." },
  { year: "2025+", label: "Next Chapter", desc: "You think I'm done? You haven't been paying attention." },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Timeline items stagger
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      if (items) {
        gsap.fromTo(
          Array.from(items),
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3D scene entrance
      gsap.fromTo(
        sceneContainerRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sceneContainerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Slow 3D parallax
      gsap.to(sceneContainerRef.current, {
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative w-full overflow-hidden"
      aria-labelledby="showcase-heading"
      style={{
        paddingTop: "clamp(6rem, 18vh, 14rem)",
        paddingBottom: "clamp(6rem, 18vh, 14rem)",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a0a 0%, #0a1016 40%, #0c1420 65%, #0a0a0a 100%)",
      }}
    >
      {/* Full-width entry divider — blue accent for the 3D showcase */}
      <div className="absolute top-0 left-0 right-0" aria-hidden="true">
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(106,159,184,0.45) 30%, rgba(106,159,184,0.45) 70%, transparent 100%)" }} />
        <div style={{ height: "80px", background: "linear-gradient(180deg, rgba(106,159,184,0.04) 0%, transparent 100%)" }} />
      </div>

      {/* Section number badge */}
      <div className="section-badge" aria-hidden="true">03</div>

      <div className="w-full mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={headingRef} className="mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="line-accent" aria-hidden="true" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff8200]">
              The Journey
            </p>
            <span className="line-accent rotate-180" aria-hidden="true" />
          </div>

          <h2
            id="showcase-heading"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 7rem)",
              lineHeight: 0.95,
              letterSpacing: "0.02em",
              color: "#fff",
            }}
          >
            The{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #b4232a, #ff8200, #ffd24a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Momentum
            </span>
          </h2>
          <p className="mt-4 text-[#666680] max-w-md mx-auto text-sm leading-relaxed">
            Every milestone. Every milestone ignored because there were always
            more ahead.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Timeline */}
          <div ref={timelineRef} className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                className="timeline-item relative flex gap-6 pb-8"
              >
                {/* Vertical line */}
                {i < MILESTONES.length - 1 && (
                  <div
                    className="absolute left-[11px] top-6 bottom-0 w-px"
                    style={{ background: "linear-gradient(180deg, rgba(255,130,0,0.3), transparent)" }}
                    aria-hidden="true"
                  />
                )}

                {/* Dot */}
                <div className="flex-shrink-0 mt-1.5">
                  <div
                    className="w-6 h-6 rounded-full border flex items-center justify-center"
                    style={{
                      borderColor: i === MILESTONES.length - 1 ? "#ff8200" : "rgba(255,130,0,0.3)",
                      background: i === MILESTONES.length - 1 ? "rgba(255,130,0,0.15)" : "transparent",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: i === MILESTONES.length - 1 ? "#ff8200" : "rgba(255,130,0,0.4)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div
                    className="text-[10px] tracking-[0.25em] mb-1"
                    style={{ color: "#ff8200" }}
                  >
                    {m.year}
                  </div>
                  <h3
                    className="text-white mb-1"
                    style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.03em" }}
                  >
                    {m.label}
                  </h3>
                  <p className="text-[#666680] text-sm">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 3D showcase */}
          <div
            ref={sceneContainerRef}
            className="relative h-[400px] md:h-[560px] border-glow"
            aria-label="Interactive 3D showcase"
          >
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border border-[#ff8200]/30 rounded-full animate-spin" />
              </div>
            }>
              <ShowcaseScene />
            </Suspense>

            {/* Corner accents */}
            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos} w-6 h-6 border-[#ff8200]/40 pointer-events-none`}
                style={{
                  borderTop: pos.includes("top") ? "1px solid rgba(255,130,0,0.4)" : "none",
                  borderBottom: pos.includes("bottom") ? "1px solid rgba(255,130,0,0.4)" : "none",
                  borderLeft: pos.includes("left") ? "1px solid rgba(255,130,0,0.4)" : "none",
                  borderRight: pos.includes("right") ? "1px solid rgba(255,130,0,0.4)" : "none",
                }}
                aria-hidden="true"
              />
            ))}

            <div
              className="absolute bottom-4 left-0 right-0 text-center text-[9px] tracking-[0.25em] uppercase text-[#333340]"
              aria-hidden="true"
            >
              The trajectory in 3D
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
