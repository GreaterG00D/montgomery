"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import EnergyOrb from "./EnergyOrb";
import { useMousePosition } from "@/hooks/useMousePosition";
import type { MousePosition } from "@/hooks/useMousePosition";
import { useSectionTheme } from "@/components/layout/SectionThemeProvider";
import type { SectionId, SectionPalette } from "@/theme/sectionThemes";

const RING_ORB_PAIR_SCALE = 0.58;
const RING_SPLIT_X_MAX = 1.18;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function arrivalScrollYFor(anchor: HTMLElement): number {
  const r = anchor.getBoundingClientRect();
  const centerDocY = r.top + window.scrollY + r.height / 2;
  return Math.max(0, centerDocY - window.innerHeight / 2);
}

function CameraRig({
  mouse,
  lockedRef,
}: {
  mouse: RefObject<MousePosition | null>;
  lockedRef: RefObject<boolean>;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    if (lockedRef.current) {
      target.current.set(0, 0, 5);
      camera.position.lerp(target.current, 0.08);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (!mouse.current) return;
    target.current.x = mouse.current.x * 0.8;
    target.current.y = mouse.current.y * 0.4;
    target.current.z = 5;
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Always mounted: primary orb + twin. Twin scale 0 until split — avoids React cut between sections.
 * Primary uses section palette; twin picks up accent split colors when visible.
 */
function OrbCluster({
  splitRef,
  journeyRef,
  lockedRef,
  mouseRef,
  palette,
}: {
  splitRef: RefObject<number>;
  journeyRef: RefObject<number>;
  lockedRef: RefObject<boolean>;
  mouseRef: RefObject<MousePosition | null>;
  palette: SectionPalette;
}) {
  const gL = useRef<THREE.Group>(null);
  const gR = useRef<THREE.Group>(null);
  const sepSmoothed = useRef(0);
  const leftMulRef = useRef(1);
  const rightMulRef = useRef(0);

  useFrame(() => {
    const t = easeOutCubic(Math.min(1, Math.max(0, splitRef.current ?? 0)));
    leftMulRef.current = THREE.MathUtils.lerp(1, RING_ORB_PAIR_SCALE, t);
    rightMulRef.current = THREE.MathUtils.lerp(0, RING_ORB_PAIR_SCALE, t);
    const targetSep = THREE.MathUtils.lerp(0, RING_SPLIT_X_MAX, t);
    sepSmoothed.current += (targetSep - sepSmoothed.current) * 0.06;
    const s = sepSmoothed.current;
    if (gL.current) gL.current.position.x = -s;
    if (gR.current) gR.current.position.x = s;
  });

  return (
    <>
      <group ref={gL}>
        <EnergyOrb
          mouseRef={mouseRef}
          scrollProgress={0}
          lockedRef={lockedRef}
          journeyRef={journeyRef}
          themeA={palette.warmA}
          themeB={palette.warmB}
          themeC={palette.warmC}
          scaleMultiplier={1}
          scaleMulRef={leftMulRef}
        />
      </group>
      <group ref={gR}>
        <EnergyOrb
          mouseRef={mouseRef}
          scrollProgress={0}
          lockedRef={lockedRef}
          journeyRef={journeyRef}
          themeA={palette.cool}
          themeB={palette.warmB}
          themeC={palette.warmA}
          scaleMultiplier={1}
          scaleMulRef={rightMulRef}
        />
      </group>
    </>
  );
}

function SceneLights({ palette }: { palette: SectionPalette }) {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) {
      light1.current.position.x = Math.sin(t * 0.4) * 3;
      light1.current.position.y = Math.cos(t * 0.3) * 2;
      light1.current.intensity = 2 + Math.sin(t * 0.7) * 0.5;
    }
    if (light2.current) {
      light2.current.position.x = -Math.sin(t * 0.3 + 1) * 4;
      light2.current.position.y = Math.sin(t * 0.5) * 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight ref={light1} color={palette.warmB} intensity={2} distance={8} />
      <pointLight ref={light2} color={palette.warmA} intensity={1.5} distance={10} />
      <pointLight position={[0, 0, 4]} color={palette.cool} intensity={0.3} distance={6} />
    </>
  );
}

interface FloatingOrbProps {
  siteVisible: boolean;
}

export default function FloatingOrb({ siteVisible }: FloatingOrbProps) {
  const { palette, sectionId } = useSectionTheme();
  const sectionIdRef = useRef<SectionId>(sectionId);
  sectionIdRef.current = sectionId;

  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const lockedRef = useRef(false);
  const journeyRef = useRef(0);
  /** 0 = one orb, 1 = twin split (scroll-driven after bridge to ring) */
  const ringSplitRef = useRef(0);

  const applyPosition = (cx: number, cy: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    el.style.left = `${cx - w / 2}px`;
    el.style.top = `${cy - h / 2}px`;
  };

  /** Shared hero → socials → bridge → ring position + split (no section-based swap cut). */
  const syncOrbLayout = () => {
    const hero = document.getElementById("hero");
    const anchor = document.getElementById("socials-orb-anchor");
    if (!hero || !anchor) return;

    const ringSec = document.getElementById("ring-section");
    const ringTarget = document.getElementById("ring-orb-target");
    const vh = window.innerHeight;

    const ay = arrivalScrollYFor(anchor);
    const scrollY = window.scrollY;
    const lockedSocials = ay <= 1 ? true : scrollY >= ay - 0.5;

    const hr = hero.getBoundingClientRect();
    const sr = anchor.getBoundingClientRect();
    const sx = sr.left + sr.width / 2;
    const sy = sr.top + sr.height / 2;
    const hx = hr.left + hr.width / 2;
    const hy = hr.top + hr.height / 2;

    let cx = hx;
    let cy = hy;
    let journey = 0;
    let lockedCam = false;
    let split = 0;

    if (!lockedSocials) {
      const t = ay <= 1 ? 1 : Math.min(1, scrollY / ay);
      const e = easeOutCubic(t);
      journey = e;
      cx = hx + (sx - hx) * e;
      cy = hy + (sy - hy) * e;
      lockedCam = false;
    } else {
      journey = 1;
      lockedCam = true;
      cx = sx;
      cy = sy;

      if (ringSec && ringTarget && sectionIdRef.current !== "links") {
        const rr = ringSec.getBoundingClientRect();
        const tr = ringTarget.getBoundingClientRect();
        const rx = tr.left + tr.width / 2;
        const ry = tr.top + tr.height / 2;

        const bridgeStart = vh * 0.9;
        const bridgeEnd = vh * 0.36;
        let bridge = (bridgeStart - rr.top) / (bridgeStart - bridgeEnd);
        bridge = Math.min(1, Math.max(0, bridge));
        const eb = easeOutCubic(bridge);
        cx = sx + (rx - sx) * eb;
        cy = sy + (ry - sy) * eb;

        if (bridge > 0.1) {
          split = easeOutCubic(Math.min(1, (bridge - 0.1) / 0.72));
        }
      }

      if (sectionIdRef.current === "links") {
        split = 0;
        cx = sx;
        cy = sy;
      }
    }

    lockedRef.current = lockedCam;
    journeyRef.current = journey;
    ringSplitRef.current = split;
    applyPosition(cx, cy);
  };

  const syncOrbLayoutRef = useRef(syncOrbLayout);
  syncOrbLayoutRef.current = syncOrbLayout;

  useLayoutEffect(() => {
    if (!siteVisible) return;
    syncOrbLayoutRef.current();
  }, [siteVisible]);

  useEffect(() => {
    if (!siteVisible) return;

    let raf = 0;
    const tick = () => {
      syncOrbLayoutRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [siteVisible]);

  if (!siteVisible) return null;

  return (
    <div
      ref={wrapRef}
      className="floating-energy-orb"
      aria-hidden
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
        left: 0,
        top: 0,
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <CameraRig mouse={mouse} lockedRef={lockedRef} />
        <SceneLights palette={palette} />

        <Suspense fallback={null}>
          <OrbCluster
            splitRef={ringSplitRef}
            journeyRef={journeyRef}
            lockedRef={lockedRef}
            mouseRef={mouse}
            palette={palette}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
