"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import WMLogo from "@/components/ui/WMLogo";
import Hero from "@/components/sections/Hero";
import LinksSection from "@/components/sections/LinksSection";
import { SectionThemeProvider } from "@/components/layout/SectionThemeProvider";

// Dynamically import heavy components
const Loader = dynamic(() => import("@/components/ui/Loader"), { ssr: false });
const SmoothScroller = dynamic(() => import("@/components/layout/SmoothScroller"), { ssr: false });
const PersistentRings = dynamic(() => import("@/components/3d/PersistentRings"), { ssr: false });
const FloatingOrb = dynamic(() => import("@/components/3d/FloatingOrb"), { ssr: false });
const Socials = dynamic(() => import("@/components/sections/Socials"), { ssr: false });
const RingSection = dynamic(() => import("@/components/sections/RingSection"), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <SectionThemeProvider>
      {/* Logo: docked to hero headline until scroll, then top-left */}
      <WMLogo siteVisible={loaded} />

      {/* Single fixed canvas — rings + bubbles, never clipped by sections */}
      <PersistentRings />
      <FloatingOrb siteVisible={loaded} />

      {/* Loader — shown on first load, then slides away */}
      {!loaded && <Loader onComplete={handleLoadComplete} />}

      {/* Main site */}
      <SmoothScroller>
        <div
          style={{
            width: "100%",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0s linear",
            pointerEvents: loaded ? "all" : "none",
          }}
        >
          <main
            id="main-content"
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              overflowX: "hidden",
            }}
          >
            <Hero />
            <Socials />
            <RingSection />
            <LinksSection />
          </main>
        </div>
      </SmoothScroller>
    </SectionThemeProvider>
  );
}
