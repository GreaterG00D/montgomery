"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SectionDivider from "@/components/ui/SectionDivider";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Showcase from "@/components/sections/Showcase";
import Merch from "@/components/sections/Merch";
import Contact from "@/components/sections/Contact";

// Dynamically import heavy components
const Loader = dynamic(() => import("@/components/ui/Loader"), { ssr: false });
const SmoothScroller = dynamic(() => import("@/components/layout/SmoothScroller"), { ssr: false });
const PersistentRings = dynamic(() => import("@/components/3d/PersistentRings"), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Single fixed rings canvas — Hero + About scroll past it */}
      <PersistentRings />

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
          <main id="main-content" style={{ width: "100%", overflowX: "hidden" }}>
            <Hero />
            <About />
            <SectionDivider />
            <Work />
            <SectionDivider />
            <Showcase />
            <SectionDivider />
            <Merch />
            <SectionDivider />
            <Contact />
          </main>
        </div>
      </SmoothScroller>
    </>
  );
}
