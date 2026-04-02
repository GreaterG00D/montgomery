"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Tab = "on-platform" | "off-platform";

const PROJECTS: Record<Tab, Array<{
  title: string;
  category: string;
  description: string;
  href: string;
  accent: string;
}>> = {
  "on-platform": [
    {
      title: "YouTube Channel",
      category: "Video Content",
      description: "The mothership. Where the chaos lives, breathes, and occasionally gets demonetized.",
      href: "https://www.youtube.com/@WilliamMontgomery",
      accent: "#ff2d2d",
    },
    {
      title: "Cameo",
      category: "Personalized Videos",
      description: "Book me for birthdays, roasts, pep talks, or just because you need someone to scream at your ex.",
      href: "https://www.cameo.com/wfmontgomery",
      accent: "#ff6b00",
    },
    {
      title: "Instagram",
      category: "Social Media",
      description: "Behind the scenes, unhinged captions, and the rare proof that I do actually go outside.",
      href: "https://www.instagram.com/williamfmontgomery",
      accent: "#cc00ff",
    },
    {
      title: "TikTok",
      category: "Short Form",
      description: "Bite-sized chaos. The algorithm and I have a complicated relationship.",
      href: "https://www.tiktok.com/@williamfmontgomery",
      accent: "#00aaff",
    },
  ],
  "off-platform": [
    {
      title: "Merch Drop",
      category: "Clothing & Gear",
      description: "Wear the energy. Limited runs, maximum drip. 'Never Gonna Stop' isn't just a tagline.",
      href: "#merch",
      accent: "#ff6b00",
    },
    {
      title: "Collaborations",
      category: "Brand Partnerships",
      description: "Selective, intentional, and always on-brand. If you want me involved, you want it done right.",
      href: "#contact",
      accent: "#ffaa00",
    },
    {
      title: "Live Appearances",
      category: "Events & Shows",
      description: "Sometimes the content needs to happen in person. Loud, live, and absolutely unscripted.",
      href: "#contact",
      accent: "#ff2d2d",
    },
    {
      title: "Community",
      category: "The NGSSP Nation",
      description: "The people who get it. The Never Gonna StaaaaHP crew. You know who you are.",
      href: "https://discord.gg/",
      accent: "#7c3aed",
    },
  ],
};

function TiltCard({
  title,
  category,
  description,
  href,
  accent,
  index,
}: (typeof PROJECTS)["on-platform"][0] & { index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 8;
    const rotX = -((y - cy) / cy) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <a
      ref={cardRef}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group gsap-reveal block p-7 border-glow transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.02)",
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Number */}
      <div
        className="text-[10px] tracking-[0.3em] mb-6"
        style={{ color: accent }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Category */}
      <p className="text-[9px] tracking-[0.25em] uppercase text-[#666680] mb-3">
        {category}
      </p>

      {/* Title */}
      <h3
        className="text-white mb-4 leading-tight"
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#666680] text-sm leading-relaxed">{description}</p>

      {/* Arrow */}
      <div className="mt-6 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
        style={{ color: accent }}>
        <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
          Explore →
        </span>
      </div>

      {/* Hover glow border */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 40px ${accent}10`,
          border: `1px solid ${accent}30`,
        }}
        aria-hidden="true"
      />
    </a>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("on-platform");
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animate cards on tab switch
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".gsap-reveal");
    if (!cards) return;
    gsap.fromTo(
      Array.from(cards),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power3.out" }
    );
  }, [activeTab]);

  // Initial card reveal on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".gsap-reveal");
      if (!cards) return;
      gsap.fromTo(
        Array.from(cards),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: "clamp(6rem, 18vh, 14rem)",
        paddingBottom: "clamp(6rem, 18vh, 14rem)",
        minHeight: "100vh",
        background: "#050508",
      }}
      aria-labelledby="work-heading"
    >
      {/* Full-width entry divider — red accent for energy */}
      <div className="absolute top-0 left-0 right-0" aria-hidden="true">
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(255,45,45,0.5) 30%, rgba(255,107,0,0.5) 70%, transparent 100%)" }} />
        <div style={{ height: "80px", background: "linear-gradient(180deg, rgba(255,45,45,0.03) 0%, transparent 100%)" }} />
      </div>

      {/* Section number badge */}
      <div className="section-badge" aria-hidden="true">02</div>

      <div className="w-full mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={headingRef} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="line-accent" aria-hidden="true" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff6b00]">
              The Playbook
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2
              id="work-heading"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "0.02em",
                color: "#fff",
              }}
            >
              What I&apos;m
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #ff2d2d, #ff6b00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Running
              </span>
            </h2>

            {/* Tab switcher */}
            <div
              className="flex gap-0 border border-white/10 p-1"
              role="tablist"
              aria-label="Work categories"
            >
              {(["on-platform", "off-platform"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
                  style={{
                    background: activeTab === tab ? "rgba(255,107,0,0.15)" : "transparent",
                    color: activeTab === tab ? "#fff" : "#666680",
                    borderRight: tab === "on-platform" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}
                >
                  {tab === "on-platform" ? "On Platform" : "Off Platform"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="tabpanel"
        >
          {PROJECTS[activeTab].map((project, i) => (
            <TiltCard key={project.title} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
