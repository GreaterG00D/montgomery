"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINKS = [
  {
    id: "kill-tony",
    label: "Kill Tony",
    logo: "/logos/kill-tony.jpg",
    href: "https://www.youtube.com/killtony",
  },
  {
    id: "deathsquad",
    label: "DeathSquad.tv",
    logo: "/logos/deathsquad.jpg",
    href: "https://www.deathsquad.tv/",
  },
  {
    id: "allyoucanget",
    label: "AllYouCanGET",
    logo: "/logos/allyoucanget.png",
    href: "https://allucanget.biz/index.html",
    invertLogo: true,
    logoPositionLeft: "left",
    logoPositionRight: "right",
  },
];

export default function LinksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = rowsRef.current?.querySelectorAll(".link-row");
      if (rows) {
        gsap.fromTo(Array.from(rows),
          { x: -40, opacity: 0 },
          {
            x: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: rowsRef.current, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="links"
      style={{
        position: "relative",
        width: "100%",
        background: "transparent",
        paddingTop: "clamp(4rem, 8vh, 7rem)",
        paddingBottom: "clamp(4rem, 8vh, 7rem)",
      }}
    >
      {/* Top rule */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-orange) 35%, transparent) 30%, color-mix(in srgb, var(--accent-orange) 35%, transparent) 70%, transparent)",
        }}
      />

      <div ref={rowsRef}>
        {LINKS.map((link, i) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(0.75rem, 2vw, 1.5rem)",
              paddingInline: "clamp(1.5rem, 4vw, 3rem)",
              paddingBlock: "clamp(1.25rem, 3vh, 2rem)",
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = "color-mix(in srgb, var(--accent-orange) 4%, transparent)";
              const name = el.querySelector(".row-name") as HTMLElement;
              const sweep = el.querySelector(".row-sweep") as HTMLElement;
              if (name) name.style.color = "var(--accent-orange)";
              if (sweep) sweep.style.transform = "scaleX(1)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = "transparent";
              const name = el.querySelector(".row-name") as HTMLElement;
              const sweep = el.querySelector(".row-sweep") as HTMLElement;
              if (name) name.style.color = "#fff";
              if (sweep) sweep.style.transform = "scaleX(0)";
            }}
          >
            {/* Sweep line at bottom */}
            <div
              className="row-sweep"
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--accent-red), var(--accent-orange), var(--accent-amber))",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.4s ease",
              }}
            />

            {/* Left logo */}
            <div style={{
              width: "clamp(52px, 8vw, 80px)",
              height: "clamp(52px, 8vw, 80px)",
              borderRadius: "4px",
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <img src={link.logo} alt="" aria-hidden="true"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: (link as any).logoPositionLeft ?? "center", filter: link.invertLogo ? "invert(1)" : undefined }} />
            </div>

            {/* Center: name */}
            <span
              className="row-name"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "clamp(2.2rem, 7vw, 6rem)",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: 1,
                textAlign: "center",
                transition: "color 0.25s",
              }}
            >
              {link.label}
            </span>

            {/* Right logo */}
            <div style={{
              width: "clamp(52px, 8vw, 80px)",
              height: "clamp(52px, 8vw, 80px)",
              borderRadius: "4px",
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <img src={link.logo} alt="" aria-hidden="true"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: (link as any).logoPositionRight ?? "center", filter: link.invertLogo ? "invert(1)" : undefined }} />
            </div>
          </a>
        ))}
      </div>

      {/* Bottom rule */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-orange) 35%, transparent) 30%, color-mix(in srgb, var(--accent-orange) 35%, transparent) 70%, transparent)",
        }}
      />
    </section>
  );
}
