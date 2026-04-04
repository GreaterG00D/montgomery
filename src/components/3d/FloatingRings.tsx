"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";

interface RingProps {
  radius: number;
  tube: number;
  color: string;
  rotation: [number, number, number];
  speed: number;
  phase?: number;
}

function Ring({ radius, tube, color, rotation, speed, phase = 0 }: RingProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = rotation[0] + state.clock.elapsedTime * speed * 0.5;
    ref.current.rotation.y = rotation[1] + state.clock.elapsedTime * speed;
    ref.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 0.3 + phase) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 3, 80]} />
      {/* Slightly stronger opacity so the rings read through solid/near-solid section backgrounds */}
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function FloatingRings() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Ring radius={2.2} tube={0.008} color="#ff8200" rotation={[0.3, 0, 0]} speed={0.3} phase={0} />
      <Ring radius={2.8} tube={0.006} color="#b4232a" rotation={[0.9, 0.5, 0.2]} speed={-0.2} phase={1} />
      <Ring radius={3.5} tube={0.005} color="#6a9fb8" rotation={[1.5, 0.3, 0.8]} speed={0.15} phase={2} />
      <Ring radius={1.8} tube={0.01} color="#ffd24a" rotation={[0.6, 1.2, 0]} speed={-0.35} phase={0.5} />
    </group>
  );
}
