"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MERCH_ITEMS = [
  {
    name: "NGSSP Hoodie",
    tagline: "Never Gonna StaaaaHP Premium Fleece",
    price: "$65",
    tag: "Most Popular",
  },
  {
    name: "Energy Tee",
    tagline: "For the ones who don't know how to quit",
    price: "$35",
    tag: "New Drop",
  },
  {
    name: "WM Cap",
    tagline: "Logo-forward. Brim-down. Business up.",
    price: "$30",
    tag: null,
  },
];

export default function Merch() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ctaBannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      const cards = cardsRef.current?.querySelectorAll(".merch-card");
      if (cards) {
        gsap.fromTo(
          Array.from(cards),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      gsap.fromTo(
        ctaBannerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaBannerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="merch"
      className="relative w-full overflow-hidden"
      aria-labelledby="merch-heading"
      style={{
        paddingTop: "clamp(6rem, 18vh, 14rem)",
        paddingBottom: "clamp(6rem, 18vh, 14rem)",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #050508 0%, #090907 50%, #050508 100%)",
      }}
    >
      {/* Full-width entry divider — warm orange/gold for merch */}
      <div className="absolute top-0 left-0 right-0" aria-hidden="true">
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(255,170,0,0.5) 30%, rgba(255,107,0,0.5) 70%, transparent 100%)" }} />
        <div style={{ height: "80px", background: "linear-gradient(180deg, rgba(255,170,0,0.03) 0%, transparent 100%)" }} />
      </div>

      {/* Section number badge */}
      <div className="section-badge" aria-hidden="true">04</div>

      <div className="w-full mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={headingRef} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="line-accent" aria-hidden="true" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff6b00]">
                The Store
              </p>
            </div>
            <h2
              id="merch-heading"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "0.02em",
                color: "#fff",
              }}
            >
              Wear The
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6b00, #ffaa00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Energy
              </span>
            </h2>
          </div>
          <p className="text-[#666680] max-w-xs text-sm leading-relaxed md:text-right">
            Limited drops. No restocks. The brand you wear on your back when
            stopping is simply not an option.
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {MERCH_ITEMS.map((item) => (
            <div
              key={item.name}
              className="merch-card group relative border-glow p-8 cursor-pointer transition-all duration-300 hover:border-[rgba(255,107,0,0.4)]"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {/* Placeholder art area */}
              <div
                className="relative w-full aspect-square mb-8 overflow-hidden flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(255,107,0,0.08), transparent 70%)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {/* Geometric placeholder art */}
                <div className="relative w-24 h-24">
                  <div
                    className="absolute inset-0 border border-[#ff6b00]/30 rotate-45 animate-spin-slow"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-4 border border-[#ff2d2d]/20 rotate-12"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-bebas), sans-serif",
                        fontSize: "2rem",
                        letterSpacing: "0.05em",
                        background: "linear-gradient(135deg, #ff2d2d, #ff6b00)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      WM
                    </span>
                  </div>
                </div>

                {item.tag && (
                  <div
                    className="absolute top-3 right-3 text-[9px] tracking-[0.2em] uppercase px-3 py-1"
                    style={{
                      background: "rgba(255,107,0,0.15)",
                      border: "1px solid rgba(255,107,0,0.3)",
                      color: "#ff6b00",
                    }}
                  >
                    {item.tag}
                  </div>
                )}
              </div>

              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase text-[#666680] mb-2">
                  {item.tagline}
                </p>
                <h3
                  className="text-white mb-4"
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "var(--font-bebas), sans-serif",
                      fontSize: "1.3rem",
                      color: "#ff6b00",
                    }}
                  >
                    {item.price}
                  </span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#666680] group-hover:text-[#ff6b00] transition-colors">
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          ref={ctaBannerRef}
          className="relative overflow-hidden p-10 md:p-16 border-glow flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: "rgba(255,107,0,0.04)" }}
        >
          {/* Background big text */}
          <div
            className="absolute inset-0 overflow-hidden flex items-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "12rem",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,107,0,0.06)",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}
            >
              SHOP NOW
            </span>
          </div>

          <a
            href="https://williamfmontgomery.com/merch"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary relative z-10 flex-shrink-0"
          >
            Visit the Store
          </a>
        </div>
      </div>
    </section>
  );
}
