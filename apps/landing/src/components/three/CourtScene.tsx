"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Court } from "./Court";
import { Ball } from "./Ball";
import { Suspense } from "react";

export function CourtScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [8, 6, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 15, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 8, -5]} intensity={0.3} color="#22c55e" />

          <Court />

          {/* Dink — low, soft, kitchen-to-kitchen */}
          <Ball
            startPos={[-2.5, 0.3, -1]}
            endPos={[2.5, 0.3, 1]}
            arcHeight={0.8}
            duration={2.2}
            delay={0}
          />

          {/* Drop shot — higher arc */}
          <Ball
            startPos={[3, 0.3, 2]}
            endPos={[-2, 0.3, -0.5]}
            arcHeight={2.5}
            duration={2.8}
            delay={0.8}
          />

          {/* Drive — fast, flat */}
          <Ball
            startPos={[-3.5, 0.3, 2.5]}
            endPos={[3.5, 0.3, -2.5]}
            arcHeight={0.4}
            duration={1.4}
            delay={1.6}
          />

          <Environment preset="sunset" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
