"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

function DNA() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 60;

  const positions = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 6;
      const y = (i / count) * 8 - 4;
      data.push({
        x1: Math.cos(t) * 1.2,
        x2: Math.cos(t + Math.PI) * 1.2,
        z1: Math.sin(t) * 1.2,
        z2: Math.sin(t + Math.PI) * 1.2,
        y,
        t,
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => {
        const hue = (i / count) * 60 + 10; // 10→70 deg: red to orange
        const color = new THREE.Color().setHSL(hue / 360, 1, 0.6);
        return (
          <group key={i}>
            {/* Strand A sphere */}
            <mesh position={[p.x1, p.y, p.z1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={color} />
            </mesh>
            {/* Strand B sphere */}
            <mesh position={[p.x2, p.y, p.z2]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#6a9fb8" />
            </mesh>
            {/* Cross rung every 4 */}
            {i % 4 === 0 && (
              <mesh
                position={[(p.x1 + p.x2) / 2, p.y, (p.z1 + p.z2) / 2]}
                rotation={[0, p.t, 0]}
              >
                <cylinderGeometry args={[0.01, 0.01, 2.4, 4]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function ShowcaseScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 55 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} color="#ff8200" intensity={2} />
      <pointLight position={[-3, -3, 3]} color="#6a9fb8" intensity={1} />
      <DNA />
    </Canvas>
  );
}
