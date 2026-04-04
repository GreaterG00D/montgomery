/**
 * Per-viewport-section accent palettes → CSS variables + particles / orb.
 * Hero: TN lane. Socials: electric purple. Ring: neon blue & green. Links: burgundy & cream.
 */

export type SectionId = "hero" | "socials" | "ring-section" | "links";

export type SectionPalette = {
  warmA: string;
  warmB: string;
  warmC: string;
  cool: string;
};

export const SECTION_ORDER: SectionId[] = ["hero", "socials", "ring-section", "links"];

export const PALETTES: Record<SectionId, SectionPalette> = {
  hero: {
    warmA: "#b4232a",
    warmB: "#ff8200",
    warmC: "#ffd24a",
    cool: "#6a9fb8",
  },
  socials: {
    warmA: "#581c87",
    warmB: "#c026d3",
    warmC: "#e879f9",
    cool: "#a78bfa",
  },
  "ring-section": {
    warmA: "#00ff88",
    warmB: "#00b8ff",
    warmC: "#b8ff00",
    cool: "#00fff2",
  },
  links: {
    warmA: "#722f37",
    warmB: "#c9862e",
    warmC: "#f4e8d0",
    cool: "#5b8fb8",
  },
};

const DOM_IDS: Record<SectionId, string> = {
  hero: "hero",
  socials: "socials",
  "ring-section": "ring-section",
  links: "links",
};

export function resolveSectionAtViewport(probeYRatio = 0.42): SectionId {
  if (typeof window === "undefined") return "hero";
  const y = window.innerHeight * probeYRatio;
  for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
    const id = SECTION_ORDER[i];
    const el = document.getElementById(DOM_IDS[id]);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top < y && r.bottom > y) return id;
  }
  return "hero";
}

export function applyPaletteToDocument(p: SectionPalette) {
  const root = document.documentElement;
  root.style.setProperty("--accent-red", p.warmA);
  root.style.setProperty("--accent-orange", p.warmB);
  root.style.setProperty("--accent-amber", p.warmC);
  root.style.setProperty("--accent-blue", p.cool);
}
