/**
 * Per-viewport-section accent palettes → CSS variables + particles / orb.
 * Southern / Tennessee lane: Volunteer orange, bourbon & gold, porch blues;
 * ring section dials up honky-tonk neon; links stay gentleman burgundy & cream.
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
    warmA: "#c73e54",
    warmB: "#ff9340",
    warmC: "#fff4c4",
    cool: "#5eb8c9",
  },
  "ring-section": {
    warmA: "#ff2d8b",
    warmB: "#c4f000",
    warmC: "#ff9f1c",
    cool: "#00e0ff",
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
