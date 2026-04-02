"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import FloatingRings from "./FloatingRings";

export default function AboutScene() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.05} />
        <pointLight position={[3, 2, 4]} color="#ff6b00" intensity={1.2} distance={10} />
        <pointLight position={[-4, -2, 3]} color="#ff2d2d" intensity={0.8} distance={10} />
        <FloatingRings />
      </Canvas>
    </div>
  );
}
