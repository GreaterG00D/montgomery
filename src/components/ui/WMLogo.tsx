"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

const HEADER = { x: 20, y: 20 };
const GUTTER = 16;
const FONT_HERO_PX = 38;
const FONT_HEADER_PX = 24;
const HERO_SHELL_W_EST = 352;
/** Hero “GONNA” / Shop CTA — same em basis for stroke thickness */
const GONNA_OUTLINE_FONT = "clamp(4.5rem, min(18vw, 22vh), 11rem)";
/** Faceted orb clip — shared by fill + black rim */
const WM_ORB_CLIP =
  "polygon(4% 46%,10% 20%,26% 6%,48% 2%,72% 8%,92% 26%,98% 52%,94% 76%,78% 94%,52% 100%,26% 94%,8% 74%,2% 52%)";
/** Scroll distance (px) over which the logo travels hero → header — pully travel */
/** Lower = logo reaches the header sooner as you scroll */
const SCROLL_RANGE_FACTOR = 0.55;

function heroLayoutFromAnchor(anchor: HTMLElement, shellW: number): { x: number; y: number } {
  const r = anchor.getBoundingClientRect();
  const vw = window.innerWidth;
  let x = r.left + r.width / 2 - shellW / 2;
  x = Math.max(GUTTER, Math.min(x, vw - shellW - GUTTER));
  const y = r.top + 8;
  return { x, y };
}

function smoothstep(t: number): number {
  const s = Math.min(1, Math.max(0, t));
  return s * s * (3 - 2 * s);
}

export default function WMLogo({ siteVisible = true }: { siteVisible?: boolean }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const wHeroRef = useRef(HERO_SHELL_W_EST);
  /** Viewport position under the title at scroll ≈0 — frozen while scrolling so the path stays stable */
  const heroBaseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef(0);
  const [frame, setFrame] = useState<{
    x: number;
    y: number;
    t: number;
  } | null>(null);

  const tick = useCallback(() => {
    if (!siteVisible) {
      setFrame(null);
      return;
    }

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const range = Math.max(240, vh * SCROLL_RANGE_FACTOR);
    let rawT = Math.min(1, Math.max(0, scrollY / range));
    if (reduceMotion) {
      rawT = scrollY > 2 ? 1 : 0;
    }
    const t = smoothstep(rawT);

    const anchor = document.getElementById("hero-logo-anchor");
    if (!anchor) {
      heroBaseRef.current = null;
      setFrame({ x: HEADER.x, y: HEADER.y, t: 1 });
      return;
    }

    const el = shellRef.current;
    if (t < 0.12 && el && el.offsetWidth > 8) {
      wHeroRef.current = el.offsetWidth;
    }

    if (scrollY < 12) {
      heroBaseRef.current = heroLayoutFromAnchor(anchor, wHeroRef.current);
    }
    if (!heroBaseRef.current) {
      heroBaseRef.current = heroLayoutFromAnchor(anchor, wHeroRef.current);
    }

    const hero = heroBaseRef.current;
    const x = hero.x + (HEADER.x - hero.x) * t;
    const y = hero.y + (HEADER.y - hero.y) * t;

    setFrame({ x, y, t });
  }, [siteVisible]);

  const scheduleTick = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      tick();
    });
  }, [tick]);

  useLayoutEffect(() => {
    if (!siteVisible) {
      setFrame(null);
      return;
    }

    tick();

    const onScroll = () => scheduleTick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleTick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleTick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [siteVisible, tick, scheduleTick]);

  useLayoutEffect(() => {
    if (!siteVisible || frame === null) return;
    const el = shellRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => scheduleTick());
    ro.observe(el);
    scheduleTick();
    return () => ro.disconnect();
  }, [siteVisible, frame, scheduleTick]);

  if (!frame) {
    return null;
  }

  const { x, y, t } = frame;
  const fontPx = FONT_HERO_PX + (FONT_HEADER_PX - FONT_HERO_PX) * t;
  const padY = 16 + (12.5 - 16) * t;
  const padX = 34 + (28 - 34) * t;
  /** Bold horizontal rule beside the name in hero — fades as the pill moves to the header */
  const quoteAmt = Math.max(0, 1 - t);

  return (
    <>
      <style>{`
        /* Low-poly silhouette drift — echoes the hero icosahedron orb */
        @keyframes wm-facet-drift {
          0%, 100% {
            clip-path: polygon(
              4% 46%, 10% 20%, 26% 6%, 48% 2%, 72% 8%, 92% 26%, 98% 52%,
              94% 76%, 78% 94%, 52% 100%, 26% 94%, 8% 74%, 2% 52%
            );
          }
          50% {
            clip-path: polygon(
              6% 40%, 14% 16%, 34% 4%, 56% 4%, 80% 14%, 96% 38%, 100% 58%,
              92% 82%, 70% 98%, 44% 100%, 20% 88%, 4% 66%, 0% 44%
            );
          }
        }
        @keyframes wm-orb-breathe {
          0%, 100% { transform: scale(1); opacity: 0.96; }
          50%      { transform: scale(1.03); opacity: 1; }
        }
        @keyframes wm-halo-pulse {
          0%, 100% { opacity: 0.32; transform: scale(1); }
          50%      { opacity: 0.48; transform: scale(1.06); }
        }
        .wm-logo { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .wm-logo:hover { transform: scale(1.06); }
        .wm-logo:hover .wm-orb,
        .wm-logo:hover .wm-orb-stroke {
          animation-duration: 1.35s, 1.9s;
        }
        .wm-logo:hover .wm-orb {
          filter: saturate(1.32) brightness(1.12) !important;
        }
        .wm-logo:hover .wm-halo {
          opacity: 0.42 !important;
          transition: opacity 0.3s, transform 0.4s;
        }
        /* Orb tints follow :root --accent-* (sectionThemes → scroll) */
        .wm-orb,
        .wm-halo {
          transition: background 0.55s ease, box-shadow 0.55s ease;
        }
      `}</style>

      <div
        ref={shellRef}
        className="wm-logo-shell"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          transform: `translate3d(${x}px, ${y}px, 0)`,
          willChange: "transform",
          transformOrigin: "left center",
        }}
      >
        <Link
          href="/"
          aria-label="William Montgomery — home"
          className="wm-logo"
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            /* ~Shop Now CTA vertical rhythm at hero; tightens toward header */
            padding: `${padY}px ${padX}px`,
            minHeight: t < 0.15 ? "3.85rem" : undefined,
          }}
        >
          <div
            aria-hidden="true"
            className="wm-halo"
            style={{
              position: "absolute",
              inset: "-22px",
              zIndex: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse 72% 70% at 42% 44%, color-mix(in srgb, var(--accent-amber) 50%, transparent) 0%, color-mix(in srgb, var(--accent-orange) 38%, transparent) 38%, color-mix(in srgb, var(--accent-red) 14%, transparent) 55%, transparent 72%)",
              animation: "wm-halo-pulse 3s ease-in-out infinite",
              pointerEvents: "none",
              filter: "blur(8px)",
            }}
          />
          {/* Faceted orb: black rim (GONNA stroke thickness) + fill — same clip + motion */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-7px",
              zIndex: 1,
              fontSize: GONNA_OUTLINE_FONT,
              pointerEvents: "none",
            }}
          >
            <div
              className="wm-orb-stroke"
              style={{
                position: "absolute",
                inset: 0,
                clipPath: WM_ORB_CLIP,
                background: "#0a0a0a",
                transformOrigin: "50% 50%",
                transform: "scale(calc(1 + (2 * clamp(4px, 0.04em, 18px)) / 5.5rem))",
                animation:
                  "wm-facet-drift 4s ease-in-out infinite, wm-orb-breathe 2.75s ease-in-out infinite",
              }}
            />
            <div
              className="wm-orb"
              style={{
                position: "absolute",
                inset: 0,
                clipPath: WM_ORB_CLIP,
                background: `
                radial-gradient(ellipse 62% 52% at 36% 36%, color-mix(in srgb, var(--accent-amber) 72%, transparent) 0%, color-mix(in srgb, var(--accent-orange) 42%, transparent) 42%, transparent 62%),
                radial-gradient(ellipse 58% 50% at 70% 52%, color-mix(in srgb, var(--accent-orange) 62%, transparent) 0%, color-mix(in srgb, var(--accent-red) 34%, transparent) 48%, transparent 58%),
                radial-gradient(ellipse 88% 80% at 52% 96%, color-mix(in srgb, var(--accent-red) 34%, transparent) 0%, transparent 50%),
                radial-gradient(ellipse 90% 85% at 4% 48%, color-mix(in srgb, var(--accent-blue) 22%, transparent) 0%, transparent 42%),
                linear-gradient(168deg, color-mix(in srgb, var(--accent-red) 50%, transparent) 0%, color-mix(in srgb, var(--accent-orange) 52%, transparent) 45%, color-mix(in srgb, var(--accent-amber) 38%, transparent) 100%)
              `,
                animation:
                  "wm-facet-drift 4s ease-in-out infinite, wm-orb-breathe 2.75s ease-in-out infinite",
                boxShadow: `
                inset 0 0 32px color-mix(in srgb, var(--accent-amber) 45%, transparent),
                inset 0 -14px 28px color-mix(in srgb, var(--accent-red) 28%, transparent),
                inset 0 10px 22px color-mix(in srgb, var(--accent-orange) 35%, transparent)
              `,
                filter: "saturate(1.2) brightness(1.06)",
              }}
            />
          </div>

          <span
            style={{
              position: "relative",
              zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: `${0.26 * quoteAmt}em`,
              fontFamily: "var(--font-bebas), 'Impact', sans-serif",
              fontSize: `${fontPx}px`,
              letterSpacing: "0.02em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-flex",
                alignItems: "center",
                overflow: "hidden",
                maxWidth: `${quoteAmt * 0.62}em`,
                opacity: quoteAmt,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: "0.48em",
                  height: "0.2em",
                  background: "#ffffff",
                  borderRadius: "0.05em",
                  flexShrink: 0,
                }}
              />
            </span>
            <span
              style={{
                color: "#ffffff",
                textShadow:
                  "0 0 12px color-mix(in srgb, var(--accent-orange) 35%, transparent)",
              }}
            >
              William{" "}
            </span>
            <span
              style={{
                color: "#0a0a0f",
                textShadow:
                  "0 0 10px rgba(255, 255, 255, 0.85), 0 0 18px color-mix(in srgb, var(--accent-amber) 50%, transparent), 0 1px 2px rgba(0, 0, 0, 0.35)",
              }}
            >
              Montgomery
            </span>
          </span>
        </Link>
      </div>
    </>
  );
}
