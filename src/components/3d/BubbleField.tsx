"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Constants ─────────────────────────────────────────────────── */
const GOLDEN = 1.6180339887;
const LERP    = 0.05;
const PER_STRAND = 15;          // 15 per strand × 4 strands = 60 total
const TOTAL      = PER_STRAND * 4;

type BubState = "FLOAT" | "HELIX" | "RING";

/* ─── Deterministic pseudo-random ───────────────────────────────── */
function fract(x: number) { return x - Math.floor(x); }
function sv(i: number, s: number) {
  return fract(Math.abs(Math.sin(i * GOLDEN + s) * 43758.5453));
}

/* ─── Static per-bubble data ────────────────────────────────────────
 *  Index layout:
 *   0..14  → left helix, orange strand A
 *  15..29  → left helix, blue   strand B
 *  30..44  → right helix, orange strand A
 *  45..59  → right helix, blue   strand B
 * ─────────────────────────────────────────────────────────────────*/
const DATA = Array.from({ length: TOTAL }, (_, i) => {
  const isBlue = (i >= 15 && i < 30) || i >= 45;
  return {
    floatX:    (sv(i, 0.1) * 2 - 1) * 4.5,
    floatY:    (sv(i, 0.2) * 2 - 1) * 3.5,
    floatZ:    (sv(i, 0.3) * 2 - 1) * 1.0,
    driftFreqX: 0.25 + sv(i, 0.4) * 0.35,
    driftFreqY: 0.20 + sv(i, 0.5) * 0.30,
    driftAmpX:  0.10 + sv(i, 0.7) * 0.15,
    driftAmpY:  0.08 + sv(i, 0.8) * 0.12,
    phaseX: sv(i, 1.0) * Math.PI * 2,
    phaseY: sv(i, 1.1) * Math.PI * 2,
    phaseZ: sv(i, 1.2) * Math.PI * 2,
    baseRadius:  0.05 + sv(i, 1.3) * 0.07,
    breatheFreq: 0.40 + sv(i, 1.4) * 0.60,
    breatheAmp:  0.05 + sv(i, 1.5) * 0.08,
    opacity: 0.50 + sv(i, 1.6) * 0.35,
    jitter:  (sv(i, 1.7) * 2 - 1) * 0.03,
    isBlue,
  };
});

/* ─── Target positions ──────────────────────────────────────────── */

/** Two double helixes — one on each side of the viewport.
 *  Each helix is 100 px wide, 30 px inset from the viewport edge. */
function helixTarget(
  i: number,
  vpW: number,
  vpH: number,
  wPx: number
): [number, number, number] {
  const isRight   = i >= 30;
  const localI    = i % 30;         // 0..29 within the helix pair
  const isBStrand = localI >= 15;
  const strandI   = localI % 15;    // 0..14 within strand

  const p2w     = vpW / wPx;        // Three.js units per pixel
  // helix axis: 30 px from edge + 50 px to centre of 100 px band = 80 px from edge
  const axisX   = isRight
    ?  vpW / 2 - 80 * p2w
    : -vpW / 2 + 80 * p2w;
  const helixR  = 50 * p2w;         // 50 px radius → 100 px diameter

  const t      = (strandI / (PER_STRAND - 1)) * Math.PI * 5; // 2.5 full turns
  const y      = (strandI / (PER_STRAND - 1)) * vpH * 0.82 - vpH * 0.41;
  const offset = isBStrand ? Math.PI : 0;

  return [
    axisX + Math.cos(t + offset) * helixR,
    y,
    Math.sin(t + offset) * 0.25,
  ];
}

/** All 60 bubbles evenly distributed on a circle. */
function ringTarget(
  i: number,
  vpW: number,
  vpH: number
): [number, number, number] {
  const angle = (i / TOTAL) * Math.PI * 2;
  const r     = Math.min(vpW, vpH) * 0.30; // ~30 % of the smaller dimension
  return [Math.cos(angle) * r, Math.sin(angle) * r, 0];
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function BubbleField() {
  const posRef   = useRef(new Float32Array(TOTAL * 3));
  const scaleRef = useRef(new Float32Array(TOTAL));
  const meshRefs = useRef<(THREE.Mesh | null)[]>(
    Array.from({ length: TOTAL }, () => null)
  );
  // Cache DOM element refs so we're not querying every frame
  const socialsElRef  = useRef<HTMLElement | null>(null);
  const ringElRef     = useRef<HTMLElement | null>(null);

  /* Init positions to float homes */
  useMemo(() => {
    DATA.forEach((d, i) => {
      posRef.current[i * 3]     = d.floatX;
      posRef.current[i * 3 + 1] = d.floatY;
      posRef.current[i * 3 + 2] = d.floatZ;
      scaleRef.current[i]        = d.baseRadius;
    });
  }, []);

  const geom = useMemo(() => new THREE.SphereGeometry(1, 10, 10), []);
  const mats = useMemo(
    () =>
      DATA.map(
        (d) =>
          new THREE.MeshBasicMaterial({
            color:      new THREE.Color(d.isBlue ? "#6a9fb8" : "#ff8200"),
            transparent: true,
            opacity:     d.opacity,
            blending:    THREE.AdditiveBlending,
            depthWrite:  false,
          })
      ),
    []
  );

  /* Cache section element refs after mount */
  useEffect(() => {
    socialsElRef.current = document.getElementById("socials") as HTMLElement | null;
    ringElRef.current    = document.getElementById("ring-section") as HTMLElement | null;
  }, []);

  useFrame((state) => {
    const t   = state.clock.elapsedTime;
    const vpW = state.viewport.width;
    const vpH = state.viewport.height;
    const wPx = typeof window !== "undefined" ? window.innerWidth : 1440;

    /* Determine state using bounding rects — compatible with Lenis */
    let bubState: BubState = "FLOAT";
    if (typeof window !== "undefined") {
      const vh         = window.innerHeight;
      const ringRect   = ringElRef.current?.getBoundingClientRect();
      const socialRect = socialsElRef.current?.getBoundingClientRect();

      if (ringRect   && ringRect.top   < vh * 0.50) bubState = "RING";
      else if (socialRect && socialRect.top < vh * 0.65) bubState = "HELIX";
    }


    DATA.forEach((d, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      let tx: number, ty: number, tz: number;

      if (bubState === "FLOAT") {
        tx = d.floatX + Math.sin(t * d.driftFreqX + d.phaseX) * d.driftAmpX;
        ty = d.floatY + Math.cos(t * d.driftFreqY + d.phaseY) * d.driftAmpY;
        tz = d.floatZ;
      } else if (bubState === "HELIX") {
        const [hx, hy, hz] = helixTarget(i, vpW, vpH, wPx);
        /* Subtle organic sway so helixes never look completely static */
        tx = hx + Math.sin(t * d.driftFreqX * 0.35 + d.phaseX) * 0.04 + d.jitter;
        ty = hy + Math.cos(t * d.driftFreqY * 0.35 + d.phaseY) * 0.025;
        tz = hz;
      } else {
        /* RING */
        const [rx, ry, rz] = ringTarget(i, vpW, vpH);
        const pulse = Math.sin(t * d.breatheFreq + d.phaseX) * 0.025;
        tx = rx * (1 + pulse);
        ty = ry * (1 + pulse);
        tz = rz + d.jitter;
      }

      /* Lerp position */
      const px = posRef.current[i * 3];
      const py = posRef.current[i * 3 + 1];
      const pz = posRef.current[i * 3 + 2];
      const nx = px + (tx - px) * LERP;
      const ny = py + (ty - py) * LERP;
      const nz = pz + (tz - pz) * LERP;
      posRef.current[i * 3]     = nx;
      posRef.current[i * 3 + 1] = ny;
      posRef.current[i * 3 + 2] = nz;
      mesh.position.set(nx, ny, nz);

      /* Breathe scale */
      const ts = d.baseRadius * (1 + Math.sin(t * d.breatheFreq + d.phaseY) * d.breatheAmp);
      const cs = scaleRef.current[i];
      const ns = cs + (ts - cs) * LERP;
      scaleRef.current[i] = ns;
      mesh.scale.setScalar(ns);
    });
  });

  return (
    <group>
      {DATA.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          geometry={geom}
          material={mats[i]}
          position={[d.floatX, d.floatY, d.floatZ]}
          scale={d.baseRadius}
        />
      ))}
    </group>
  );
}
