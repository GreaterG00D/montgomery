"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import PersistentParticleField from "./PersistentParticleField";
import { useSectionTheme } from "@/components/layout/SectionThemeProvider";

/* ─── Camera rig: mouse pan + scroll zoom ──────────────────────── */
function CameraRig({
  mouseRef,
  scrollRef,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  scrollRef: React.RefObject<number>;
}) {
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;
    const sp = scrollRef.current ?? 0;

    // Scroll: zoom in as user scrolls down (z 6 → 4.5)
    pos.current.x = mx * 1.2;
    pos.current.y = my * 0.6;
    pos.current.z = 6 - sp * 1.5;

    camera.position.lerp(pos.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function PersistentRings() {
  const { palette } = useSectionTheme();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll",    onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll",    onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.05} />
        <pointLight position={[3, 2, 4]} color={palette.warmB} intensity={1.2} distance={10} />
        <pointLight position={[-4, -2, 3]} color={palette.warmA} intensity={0.8} distance={10} />

        <CameraRig mouseRef={mouseRef} scrollRef={scrollRef} />

        <PersistentParticleField count={600} color={palette.warmB} spread={7} clearRadius={1.5} />
        <PersistentParticleField count={200} color={palette.cool} spread={9} clearRadius={1.8} />
      </Canvas>
    </div>
  );
}
