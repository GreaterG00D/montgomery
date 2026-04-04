"use client";

import { useRef, useMemo, useLayoutEffect, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, ShaderMaterial } from "three";
import type { MousePosition } from "@/hooks/useMousePosition";

/** Scroll journey ends at this uniform scale (circumference vs hero start). */
const ORB_EXPAND_SCALE = 1.5;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  // Classic Perlin noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    float noise = snoise(position * 1.5 + uTime * 0.3) * 0.18;
    vec3 displaced = position + normal * noise;

    vPosition = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  void main() {
    // Fresnel for rim glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
    fresnel = pow(fresnel, 2.5);

    // Animated color mixing
    float t = sin(uTime * 0.4 + vUv.x * 3.14159) * 0.5 + 0.5;
    float t2 = cos(uTime * 0.3 + vUv.y * 3.14159) * 0.5 + 0.5;

    vec3 coreColor = mix(uColorA, uColorB, t);
    coreColor = mix(coreColor, uColorC, t2 * 0.3);

    // Rim light adds energy orange/red
    vec3 rimColor = mix(uColorB, uColorA, fresnel);
    vec3 finalColor = mix(coreColor, rimColor, fresnel * 0.8);

    // Inner glow
    float centerGlow = 1.0 - length(vUv - 0.5) * 1.8;
    centerGlow = clamp(centerGlow, 0.0, 1.0);
    finalColor += uColorC * centerGlow * 0.4;

    float alpha = mix(0.6, 1.0, fresnel) + centerGlow * 0.3;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface EnergyOrbProps {
  /** Read each frame — avoids stale props when parent does not re-render */
  mouseRef?: RefObject<MousePosition | null>;
  mouseX?: number;
  mouseY?: number;
  scrollProgress?: number;
  lockedRef?: RefObject<boolean>;
  /** 0…1 eased scroll progress toward socials — drives radius growth */
  journeyRef?: RefObject<number>;
  /** Section theme — matches CSS --accent-* */
  themeA?: string;
  themeB?: string;
  themeC?: string;
  /** Multiplies final mesh scale (e.g. 0.65 for paired orbs) */
  scaleMultiplier?: number;
  /** When set, read each frame — overrides scaleMultiplier (twin / split animation) */
  scaleMulRef?: RefObject<number>;
}

export default function EnergyOrb({
  mouseRef,
  mouseX = 0,
  mouseY = 0,
  scrollProgress = 0,
  lockedRef,
  journeyRef,
  themeA = "#b4232a",
  themeB = "#ff8200",
  themeC = "#ffd24a",
  scaleMultiplier = 1,
  scaleMulRef,
}: EnergyOrbProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(themeA) },
      uColorB: { value: new THREE.Color(themeB) },
      uColorC: { value: new THREE.Color(themeC) },
    }),
    []
  );

  useLayoutEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uColorA.value.set(themeA);
    u.uColorB.value.set(themeB);
    u.uColorC.value.set(themeC);
  }, [themeA, themeB, themeC]);

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;

    matRef.current.uniforms.uTime.value += delta;

    const locked = lockedRef?.current ?? false;
    const j = Math.min(1, Math.max(0, journeyRef?.current ?? 0));
    const sm = scaleMulRef?.current ?? scaleMultiplier;
    const orbitMul = THREE.MathUtils.lerp(1, ORB_EXPAND_SCALE, j) * sm;

    if (locked) {
      meshRef.current.rotation.x += (0 - meshRef.current.rotation.x) * 0.1;
      meshRef.current.rotation.y += (0 - meshRef.current.rotation.y) * 0.1;
      meshRef.current.rotation.z += (0 - meshRef.current.rotation.z) * 0.1;
      const s = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(s + (orbitMul - s) * 0.12);
      return;
    }

    const mx = mouseRef?.current?.x ?? mouseX;
    const my = mouseRef?.current?.y ?? mouseY;
    const targetX = my * 0.4 + scrollProgress * Math.PI;
    const targetY = mx * 0.4;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y + delta * 0.2) * 0.05;

    const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.04 + 1;
    meshRef.current.scale.setScalar(orbitMul * breathe);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.75, 6]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
