"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Points, ShaderMaterial } from "three";

const PARTICLE_TIME_SCALE = 0.5;

const particleVertex = /* glsl */ `
  attribute float aScale;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uSpread;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Spiral drift upward
    float angle = uTime * aSpeed * 0.3;
    pos.y += mod(uTime * aSpeed * 0.15 + position.y + 5.0, 10.0) - 5.0;
    pos.x += sin(angle + pos.y) * 0.08;
    pos.z += cos(angle + pos.y) * 0.08;

    // Scroll-driven spread — outward when scrolling down, inward when up
    float spread = uScrollProgress * 5.0;
    pos.xz *= 1.0 + spread;
    pos.y  *= 1.0 + spread * 0.4;

    // Radial fade — particles dissolve before reaching canvas edge
    float dist = length(pos.xz);
    float radialFade = 1.0 - smoothstep(uSpread * 0.55, uSpread * 1.05, dist);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aScale * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Depth fade + radial fade combined
    vAlpha = smoothstep(0.0, 3.0, -mvPosition.z) * 0.7 * radialFade;
  }
`;

const particleFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - 0.5);
    float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
    gl_FragColor = vec4(uColor, alpha * vAlpha);
  }
`;

interface ParticleFieldProps {
  count?: number;
  color?: string;
  spread?: number;
  scrollProgress?: number;
}

export default function ParticleField({
  count = 800,
  color = "#ff8200",
  spread = 8,
  scrollProgress = 0,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);
  const matRef = useRef<ShaderMaterial>(null);

  const { positions, scales, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spherical distribution with bias toward equator
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = (Math.random() * 0.5 + 0.5) * spread;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      scales[i] = Math.random() * 1.5 + 0.3;
      speeds[i] = Math.random() * 1.5 + 0.5;
    }

    return { positions, scales, speeds };
  }, [count, spread]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uSpread: { value: spread },
      uColor: { value: new THREE.Color(color) },
    }),
    [color, spread]
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += delta * PARTICLE_TIME_SCALE;
    matRef.current.uniforms.uScrollProgress.value +=
      (scrollProgress - matRef.current.uniforms.uScrollProgress.value) * 0.06;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03 * PARTICLE_TIME_SCALE;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          args={[speeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
