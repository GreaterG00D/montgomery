"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import FloatingRings from "./FloatingRings";
import PersistentParticleField from "./PersistentParticleField";

export default function PersistentRings() {
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
        /* Keep transparent so section overlays can "reveal" the rings. */
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.05} />
        <pointLight position={[3, 2, 4]} color="#ff6b00" intensity={1.2} distance={10} />
        <pointLight position={[-4, -2, 3]} color="#ff2d2d" intensity={0.8} distance={10} />
        {/* <FloatingRings /> */}
        <PersistentParticleField count={600} color="#ff6b00" spread={7} clearRadius={1.5} />
        <PersistentParticleField count={200} color="#00aaff" spread={9} clearRadius={1.8} />
      </Canvas>
    </div>
  );
}
