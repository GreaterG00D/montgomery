"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Same basis as Ring Shop Now CTA — `em` in border scales with this on the card root. */
const CARD_OUTLINE_FONT = "clamp(2.25rem, 5.5vw, 3.75rem)";

const SOCIAL_LINKS = [
  {
    id: "cameo",
    label: "Cameo",
    sub: "cameo.com",
    href: "https://www.cameo.com/wfmontgomery",
    gradFrom: "#ff8200",
    gradTo: "#c45a00",
    glow: "#ff8200",
  },
  {
    id: "merch",
    label: "Merch",
    sub: "store",
    href: "#merch",
    gradFrom: "#ffd24a",
    gradTo: "#ff8200",
    glow: "#ffd24a",
  },
  {
    id: "youtube",
    label: "YouTube",
    sub: "@WilliamMontgomery",
    href: "https://www.youtube.com/@WilliamMontgomery",
    gradFrom: "#b4232a",
    gradTo: "#ff8200",
    glow: "#ff8200",
  },
  {
    id: "instagram",
    label: "Instagram",
    sub: "@williamfmontgomery",
    href: "https://www.instagram.com/williamfmontgomery",
    gradFrom: "#cc44ff",
    gradTo: "#ff8200",
    glow: "#cc44ff",
  },
] as const;

export default function Socials() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".social-card");
      if (cards) {
        gsap.fromTo(
          Array.from(cards),
          { y: 40, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="socials"
      style={{
        position: "relative",
        zIndex: 2,
        marginTop: "-1px",
        width: "100%",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.25rem, 4vw, 2rem)",
      }}
    >
      <style>{`
        .socials-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 900px) {
          .socials-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
      <div
        id="socials-orb-anchor"
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(960px, 94vw)",
          background: "rgba(10,10,10,0.82)",
          boxShadow: "0 0 100px 52px rgba(10,10,10,0.9)",
          borderRadius: "clamp(12px, 2vw, 20px)",
          padding: "clamp(1rem, 3vw, 1.5rem)",
        }}
      >
        <div
          ref={gridRef}
          className="socials-grid"
          style={{
            display: "grid",
            gap: "clamp(0.65rem, 2vw, 1rem)",
          }}
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="social-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                textDecoration: "none",
                minHeight: "clamp(7.5rem, 22vw, 10.5rem)",
                padding: "clamp(1rem, 3vw, 1.35rem) clamp(0.75rem, 2vw, 1rem)",
                borderRadius: "999px",
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: CARD_OUTLINE_FONT,
                lineHeight: 1,
                textTransform: "uppercase",
                boxSizing: "border-box",
                background: `linear-gradient(135deg, ${link.gradFrom}, ${link.gradTo})`,
                border: "clamp(4px, 0.04em, 18px) solid #0a0a0a",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: `0 0 0 color-mix(in srgb, ${link.glow} 0%, transparent)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.05)";
                el.style.boxShadow = `0 0 32px color-mix(in srgb, ${link.glow} 55%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1)";
                el.style.boxShadow = `0 0 0 color-mix(in srgb, ${link.glow} 0%, transparent)`;
              }}
              onFocus={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1.05)";
                el.style.boxShadow = `0 0 32px color-mix(in srgb, ${link.glow} 55%, transparent)`;
              }}
              onBlur={(e) => {
                const el = e.currentTarget;
                el.style.transform = "scale(1)";
                el.style.boxShadow = `0 0 0 color-mix(in srgb, ${link.glow} 0%, transparent)`;
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.35rem, 4.2vw, 2.35rem)",
                  letterSpacing: "0.06em",
                  color: "#fff",
                  lineHeight: 1.05,
                }}
              >
                {link.label}
              </span>
              <span
                style={{
                  fontSize: "clamp(0.65rem, 1.8vw, 0.8rem)",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.82)",
                  marginTop: "0.35rem",
                  textTransform: "uppercase",
                }}
              >
                {link.sub}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
