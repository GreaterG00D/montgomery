"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import {
  PALETTES,
  applyPaletteToDocument,
  resolveSectionAtViewport,
  type SectionId,
  type SectionPalette,
} from "@/theme/sectionThemes";

type Ctx = {
  sectionId: SectionId;
  palette: SectionPalette;
};

const SectionThemeContext = createContext<Ctx | null>(null);

export function useSectionTheme(): Ctx {
  const v = useContext(SectionThemeContext);
  if (!v) {
    return { sectionId: "hero", palette: PALETTES.hero };
  }
  return v;
}

export function SectionThemeProvider({ children }: { children: ReactNode }) {
  const [sectionId, setSectionId] = useState<SectionId>("hero");
  const lastRef = useRef<SectionId>("hero");

  useEffect(() => {
    const tick = () => {
      const next = resolveSectionAtViewport();
      if (next !== lastRef.current) {
        lastRef.current = next;
        setSectionId(next);
      }
    };
    tick();
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const palette = PALETTES[sectionId];

  useEffect(() => {
    applyPaletteToDocument(palette);
  }, [palette]);

  const value = useMemo(() => ({ sectionId, palette }), [sectionId, palette]);

  return (
    <SectionThemeContext.Provider value={value}>{children}</SectionThemeContext.Provider>
  );
}
