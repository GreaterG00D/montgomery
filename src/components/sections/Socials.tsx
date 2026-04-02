"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SOCIAL_LINKS = [
  { id: "cameo",     label: "Cameo",     href: "https://www.cameo.com/wfmontgomery",           accent: "#ff6b00" },
  { id: "merch",     label: "Merch",     href: "#merch",                                        accent: "#ffaa00" },
  { id: "youtube",   label: "YouTube",   href: "https://www.youtube.com/@WilliamMontgomery",   accent: "#ff2d2d" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/williamfmontgomery", accent: "#cc44ff" },
] as const;

export default function Socials() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = listRef.current?.querySelectorAll(".social-row");
      if (rows) {
        gsap.fromTo(Array.from(rows),
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: listRef.current, start: "top 78%", toggleActions: "play none none reverse" },
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
        width: "100%",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Feathered dark backdrop */}
      <div style={{
        position: "relative",
        background: "rgba(5,5,8,0.85)",
        boxShadow: "0 0 120px 60px rgba(5,5,8,0.9)",
        width: "min(640px, 90vw)",
      }}>

        {/* Top rule */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), transparent)" }} />

        <div ref={listRef}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="social-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "clamp(1.1rem, 2.5vh, 1.8rem) clamp(1.5rem, 4vw, 2.5rem)",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transition: "background 0.3s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = `rgba(255,107,0,0.06)`;
                const name  = el.querySelector(".soc-name")  as HTMLElement;
                const arrow = el.querySelector(".soc-arrow") as HTMLElement;
                const sweep = el.querySelector(".soc-sweep") as HTMLElement;
                if (name)  { name.style.backgroundImage = `linear-gradient(135deg, ${link.accent}, #ffaa00)`; name.style.webkitBackgroundClip = "text"; name.style.webkitTextFillColor = "transparent"; }
                if (arrow) { arrow.style.color = link.accent; arrow.style.transform = "translateX(5px)"; }
                if (sweep) sweep.style.transform = "scaleX(1)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = "transparent";
                const name  = el.querySelector(".soc-name")  as HTMLElement;
                const arrow = el.querySelector(".soc-arrow") as HTMLElement;
                const sweep = el.querySelector(".soc-sweep") as HTMLElement;
                if (name)  { name.style.backgroundImage = "none"; name.style.webkitTextFillColor = "#fff"; }
                if (arrow) { arrow.style.color = "rgba(255,255,255,0.2)"; arrow.style.transform = "translateX(0)"; }
                if (sweep) sweep.style.transform = "scaleX(0)";
              }}
            >
              {/* Sweep */}
              <div className="soc-sweep" aria-hidden="true" style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
                background: `linear-gradient(90deg, transparent, ${link.accent}, transparent)`,
                transform: "scaleX(0)", transformOrigin: "left", transition: "transform 0.4s ease",
              }} />

              <span className="soc-name" style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
                letterSpacing: "0.03em",
                color: "#fff",
                lineHeight: 1,
                transition: "color 0.25s",
              }}>
                {link.label}
              </span>

              <span className="soc-arrow" aria-hidden="true" style={{
                fontSize: "clamp(1rem, 2vw, 1.5rem)",
                color: "rgba(255,255,255,0.2)",
                transition: "color 0.25s, transform 0.25s",
              }}>
                →
              </span>
            </a>
          ))}
        </div>

        {/* Bottom rule */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), transparent)" }} />
      </div>
    </section>
  );
}
