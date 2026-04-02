"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import EnergyOrb from "./EnergyOrb";
import ParticleField from "./ParticleField";
import type { MousePosition } from "@/hooks/useMousePosition";

/* ─── Camera rig — follows mouse smoothly ──────────────────────── */
function CameraRig({ mouse }: { mouse: React.RefObject<MousePosition> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    if (!mouse.current) return;
    target.current.x = mouse.current.x * 0.8;
    target.current.y = mouse.current.y * 0.4;
    target.current.z = 5;

    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Ambient lighting with animated color shift ────────────────── */
function SceneLights() {
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
      <pointLight ref={light1} color="#ff6b00" intensity={2} distance={8} />
      <pointLight ref={light2} color="#ff2d2d" intensity={1.5} distance={10} />
      <pointLight position={[0, 0, 4]} color="#00aaff" intensity={0.3} distance={6} />
    </>
  );
}

interface HeroSceneProps {
  mouse: React.RefObject<MousePosition>;
  scrollProgress: number;
}

export default function HeroScene({ mouse, scrollProgress }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      style={{ background: "transparent" }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <CameraRig mouse={mouse} />
      <SceneLights />

      <Suspense fallback={null}>
        <EnergyOrb
          mouseX={mouse.current?.x ?? 0}
          mouseY={mouse.current?.y ?? 0}
          scrollProgress={scrollProgress}
        />
        <ParticleField
          count={600}
          color="#ff6b00"
          spread={7}
          scrollProgress={scrollProgress}
        />
        {/* Secondary cooler particles */}
        <ParticleField
          count={200}
          color="#00aaff"
          spread={9}
          scrollProgress={scrollProgress}
        />
      </Suspense>
    </Canvas>
  );
}
