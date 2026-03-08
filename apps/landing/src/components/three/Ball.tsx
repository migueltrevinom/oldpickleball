"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

interface BallProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  arcHeight: number;
  duration: number;
  delay: number;
}

export function Ball({ startPos, endPos, arcHeight, duration, delay }: BallProps) {
  const meshRef = useRef<Mesh>(null);
  const totalCycle = duration + 0.6; // animation + pause

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsed = clock.getElapsedTime();
    const cycleTime = (elapsed - delay + totalCycle * 100) % totalCycle;
    const t = Math.min(cycleTime / duration, 1);

    const x = startPos[0] + (endPos[0] - startPos[0]) * t;
    const z = startPos[2] + (endPos[2] - startPos[2]) * t;
    const y = startPos[1] + arcHeight * Math.sin(Math.PI * t);

    meshRef.current.position.set(x, y, z);

    // Scale for "bounce" at landing
    const squish = t > 0.92 ? 1 - (t - 0.92) * 3 : 1;
    meshRef.current.scale.setScalar(Math.max(0.7, squish));
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}
