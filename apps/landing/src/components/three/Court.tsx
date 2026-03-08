"use client";

import { useRef } from "react";
import { Mesh } from "three";

function CourtLine({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}

export function Court() {
  const courtRef = useRef<Mesh>(null);

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0f1a2e" />
      </mesh>

      {/* Court surface */}
      <mesh ref={courtRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8.5, 6.1]} />
        <meshStandardMaterial color="#2563a8" roughness={0.8} />
      </mesh>

      {/* Kitchen zones (non-volley zone) - slightly different shade */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.125, 0.001, 0]}>
        <planeGeometry args={[3.5, 6.05]} />
        <meshStandardMaterial color="#1d5490" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.125, 0.001, 0]}>
        <planeGeometry args={[3.5, 6.05]} />
        <meshStandardMaterial color="#1d5490" roughness={0.8} />
      </mesh>

      {/* Court lines */}
      {/* Outer boundary */}
      <CourtLine position={[0, 0.005, 3.05]} size={[8.5, 0.01, 0.05]} />
      <CourtLine position={[0, 0.005, -3.05]} size={[8.5, 0.01, 0.05]} />
      <CourtLine position={[4.25, 0.005, 0]} size={[0.05, 0.01, 6.1]} />
      <CourtLine position={[-4.25, 0.005, 0]} size={[0.05, 0.01, 6.1]} />

      {/* Center line (baseline to kitchen) */}
      <CourtLine position={[2.85, 0.005, 0]} size={[2.8, 0.01, 0.04]} />
      <CourtLine position={[-2.85, 0.005, 0]} size={[2.8, 0.01, 0.04]} />

      {/* Kitchen line */}
      <CourtLine position={[-0.875, 0.005, 0]} size={[0.05, 0.01, 6.1]} />
      <CourtLine position={[0.875, 0.005, 0]} size={[0.05, 0.01, 6.1]} />

      {/* Center service lines */}
      <CourtLine position={[2.55, 0.005, 0]} size={[0.04, 0.01, 6.1]} />
      <CourtLine position={[-2.55, 0.005, 0]} size={[0.04, 0.01, 6.1]} />

      {/* Net */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.04, 0.9, 6.2]} />
        <meshStandardMaterial color="#333333" transparent opacity={0.6} />
      </mesh>
      {/* Net post left */}
      <mesh position={[0, 0.5, 3.2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.8} />
      </mesh>
      {/* Net post right */}
      <mesh position={[0, 0.5, -3.2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.8} />
      </mesh>
    </group>
  );
}
