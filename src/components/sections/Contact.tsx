"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SOCIALS = [
  {
    label: "YouTube",
    handle: "@WilliamMontgomery",
    href: "https://www.youtube.com/@WilliamMontgomery",
    color: "#ff2d2d",
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
        <path d="M21.54 2.5A2.76 2.76 0 0 0 19.6.56C17.9 0 11 0 11 0S4.1 0 2.4.56A2.76 2.76 0 0 0 .46 2.5C0 4.2 0 8 0 8s0 3.8.46 5.5A2.76 2.76 0 0 0 2.4 15.44C4.1 16 11 16 11 16s6.9 0 8.6-.56a2.76 2.76 0 0 0 1.94-1.94C22 11.8 22 8 22 8s0-3.8-.46-5.5z" fill="currentColor" />
        <path d="M8.8 11.42 14.6 8 8.8 4.58v6.84z" fill="#050508" />
      </svg>
    ),
  },
  {
    label: "Cameo",
    handle: "Book a Video",
    href: "https://www.cameo.com/wfmontgomery",
    color: "#ff6b00",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7.5 7.5h5M7.5 10h3.5M7.5 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    handle: "@williamfmontgomery",
    href: "https://www.instagram.com/williamfmontgomery",
    color: "#cc44ff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    handle: "@williamfmontgomery",
    href: "https://www.tiktok.com/@williamfmontgomery",
    color: "#00aaff",
    icon: (
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
        <path d="M13 0a5.1 5.1 0 0 0 5 4.9V9a8.8 8.8 0 0 1-5-1.6V14A6 6 0 1 1 7 8.1V12a2 2 0 1 0 2 2V0h4z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const items = socialsRef.current?.querySelectorAll(".social-item");
      if (items) {
        gsap.fromTo(
          Array.from(items),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: socialsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
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
      id="contact"
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: "clamp(6rem, 18vh, 14rem)",
        background: "linear-gradient(180deg, #050508 0%, #080810 100%)",
      }}
      aria-labelledby="contact-heading"
    >
      {/* Full-width entry divider */}
      <div className="absolute top-0 left-0 right-0" aria-hidden="true">
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(255,107,0,0.4) 30%, rgba(255,45,45,0.4) 70%, transparent 100%)" }} />
        <div style={{ height: "80px", background: "linear-gradient(180deg, rgba(255,107,0,0.03) 0%, transparent 100%)" }} />
      </div>

      <div className="w-full mx-auto px-6 md:px-12">
        {/* Eyebrow + Heading */}
        <div ref={headingRef} className="mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="line-accent" aria-hidden="true" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff6b00]">
              Come Find Me
            </p>
            <span className="line-accent rotate-180" aria-hidden="true" />
          </div>

          <h2
            id="contact-heading"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(3rem, 10vw, 9rem)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: "#fff",
            }}
          >
            Let&apos;s{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff2d2d, #ff6b00, #ffaa00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Connect
            </span>
          </h2>
          <p className="mt-6 text-[#666680] max-w-sm mx-auto text-sm leading-relaxed">
            Whether you want to book me, buy merch, collaborate, or just want to
            slide into the DMs — the door&apos;s open. (The stopping one is
            not.)
          </p>
        </div>

        {/* Socials grid */}
        <div
          ref={socialsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24"
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-item group relative p-7 border-glow flex flex-col gap-5 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.02)",
                color: "inherit",
              }}
            >
              <div style={{ color: s.color }}>{s.icon}</div>

              <div>
                <p
                  className="text-white font-semibold mb-1"
                  style={{ fontSize: "0.95rem" }}
                >
                  {s.label}
                </p>
                <p className="text-[#666680] text-xs">{s.handle}</p>
              </div>

              <div
                className="text-[9px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: s.color }}
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                  Follow →
                </span>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 40px ${s.color}08`, border: `1px solid ${s.color}25` }}
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </div>

      {/* ── Full-width footer bar ─────────────────────────────── */}
      <footer
        ref={footerRef}
        className="border-t border-white/[0.04] py-8 px-6 md:px-12"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <div className="w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-white/20 text-xs tracking-[0.15em]"
            style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1rem", letterSpacing: "0.1em" }}
          >
            WM
          </span>
          <p className="text-[#333340] text-[10px] tracking-[0.15em] text-center">
            © {new Date().getFullYear()} William F. Montgomery — I Ain&apos;t Never Gonna Stop
          </p>
          <p className="text-[#333340] text-[10px] tracking-[0.1em]">
            Built different.
          </p>
        </div>
      </footer>
    </section>
  );
}
