"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SOCIAL_LINKS = [
  { id: "cameo",     label: "Cameo",     description: "Book a personal video", href: "https://www.cameo.com/wfmontgomery",             accent: "#ff6b00" },
  { id: "merch",     label: "Merch",     description: "Wear the energy",       href: "#merch",                                          accent: "#ffaa00" },
  { id: "youtube",   label: "YouTube",   description: "The mothership",        href: "https://www.youtube.com/@WilliamMontgomery",      accent: "#ff2d2d" },
  { id: "instagram", label: "Instagram", description: "Behind the scenes",     href: "https://www.instagram.com/williamfmontgomery",    accent: "#cc44ff" },
] as const;

export default function Socials() {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dark container fades + scales in
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 82%", toggleActions: "play none none reverse" },
        }
      );

      // Cards stagger in
      const cards = gridRef.current?.querySelectorAll(".social-card");
      if (cards) {
        gsap.fromTo(Array.from(cards),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.09, duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 78%", toggleActions: "play none none reverse" },
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
      aria-labelledby="socials-heading"
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
      {/* Dark container — snug around content, smooth scroll-in */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          background: "rgba(5,5,8,0.92)",
          padding: "clamp(2.5rem, 5vw, 4rem) clamp(2rem, 4vw, 3.5rem)",
          /* Feathered edges so it dissolves into the particle field */
          boxShadow: "0 0 80px 40px rgba(5,5,8,0.92)",
          /* Start invisible — GSAP animates opacity in */
          opacity: 0,
        }}
      >
        {/* 2×2 grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(0.75rem, 1.5vw, 1.25rem)",
            width: "100%",
            maxWidth: "580px",
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
                justifyContent: "space-between",
                padding: "clamp(1.25rem, 2.5vw, 2rem)",
                background: "rgba(12,12,20,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                textDecoration: "none",
                minHeight: "clamp(120px, 16vh, 180px)",
                transition: "border-color 0.25s, background 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = `${link.accent}55`;
                el.style.background = "rgba(18,18,28,0.9)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.background = "rgba(12,12,20,0.8)";
              }}
            >
              <p style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#666680", marginBottom: "0.5rem" }}>
                {link.description}
              </p>
              <h3 style={{ fontFamily: "var(--font-bebas), 'Impact', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "0.04em", color: "#f0f0f0", lineHeight: 1 }}>
                {link.label}
              </h3>
              <span style={{ display: "block", marginTop: "1rem", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: link.accent }}>
                Visit →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
