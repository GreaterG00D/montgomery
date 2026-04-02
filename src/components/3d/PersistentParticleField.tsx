"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Points, ShaderMaterial } from "three";

// Original ParticleField shader + one extra mode:
//   uClearCenter 0→1  pushes particles radially outward, opening a hole (Ring section)
const vertexShader = /* glsl */ `
  attribute float aScale;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uSpread;
  uniform float uClearCenter;
  uniform float uClearRadius;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Spiral drift upward
    float angle = uTime * aSpeed * 0.3;
    pos.y += mod(uTime * aSpeed * 0.15 + position.y + 5.0, 10.0) - 5.0;
    pos.x += sin(angle + pos.y) * 0.08;
    pos.z += cos(angle + pos.y) * 0.08;

    // Scroll-driven spread
    float spread = uScrollProgress * 5.0;
    pos.xz *= 1.0 + spread;
    pos.y  *= 1.0 + spread * 0.4;

    // Clear centre: push radially outward, opening a circle for the image
    float radDist = length(pos.xz);
    vec2  radDir  = radDist > 0.001 ? normalize(pos.xz) : vec2(1.0, 0.0);
    float pushed  = max(radDist, uClearRadius);
    vec2  donutXZ = radDir * pushed;
    pos.x = mix(pos.x, donutXZ.x, uClearCenter);
    pos.z = mix(pos.z, donutXZ.y, uClearCenter);

    // Radial fade
    float dist       = length(pos.xz);
    float radialFade = 1.0 - smoothstep(uSpread * 0.55, uSpread * 1.05, dist);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize    = aScale * (280.0 / -mvPosition.z);
    gl_Position     = projectionMatrix * mvPosition;

    vAlpha = smoothstep(0.0, 3.0, -mvPosition.z) * 0.7 * radialFade;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float dist  = length(gl_PointCoord - 0.5);
    float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
    gl_FragColor = vec4(uColor, alpha * vAlpha);
  }
`;

interface Props {
  count?:       number;
  color?:       string;
  spread?:      number;
  clearRadius?: number;
}

export default function PersistentParticleField({
  count       = 700,
  color       = "#ff6b00",
  spread      = 8,
  clearRadius = 1.5,
}: Props) {
  const pointsRef    = useRef<Points>(null);
  const matRef       = useRef<ShaderMaterial>(null);
  const ringElRef    = useRef<HTMLElement | null>(null);
  const clearRef     = useRef(0);

  useEffect(() => {
    ringElRef.current = document.getElementById("ring-section") as HTMLElement | null;
  }, []);

  const { positions, scales, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales    = new Float32Array(count);
    const speeds    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = (Math.random() * 0.5 + 0.5) * spread;

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      scales[i] = Math.random() * 1.5 + 0.3;
      speeds[i] = Math.random() * 1.5 + 0.5;
    }

    return { positions, scales, speeds };
  }, [count, spread]);

  const uniforms = useMemo(() => ({
    uTime:          { value: 0 },
    uScrollProgress:{ value: 0 },
    uSpread:        { value: spread },
    uColor:         { value: new THREE.Color(color) },
    uClearCenter:   { value: 0 },
    uClearRadius:   { value: clearRadius },
  }), [color, spread, clearRadius]);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;

    // Detect ring section
    let targetClear = 0;
    if (typeof window !== "undefined") {
      const ringRect = ringElRef.current?.getBoundingClientRect();
      if (ringRect && ringRect.top < window.innerHeight * 0.5) targetClear = 1;
    }

    clearRef.current += (targetClear - clearRef.current) * 0.03;
    u.uClearCenter.value = clearRef.current;

    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale"   args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
