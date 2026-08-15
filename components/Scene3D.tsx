"use client";

import { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, useGLTF, ContactShadows } from "@react-three/drei";
import type { Group, Mesh } from "three";

const MODELS = {
  "system-map": { path: "/3d/system-map.glb", orientation: [0, 0, 0], spinAxis: "y" },
  "strategy": { path: "/3d/strategy.glb", orientation: [0, 0, 0], spinAxis: "y" },
  "blueprint": { path: "/3d/blueprint.glb", orientation: [0, 0, 0], spinAxis: "y" },
} as const;

export type ModelType = keyof typeof MODELS;

// Preload all models
Object.values(MODELS).forEach((m) => useGLTF.preload(m.path));

function RotatingModel({ model, rotate }: { model: ModelType; rotate: boolean }) {
  const spinRef = useRef<Group>(null);
  const config = MODELS[model];
  const { scene } = useGLTF(config.path);

  // Clone scene and enable shadows on all meshes
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (rotate && spinRef.current && config.spinAxis !== "none") {
      spinRef.current.rotation[config.spinAxis as "x" | "y" | "z"] += delta * 0.14;
    }
  });

  return (
    <group
      rotation={[
        config.orientation[0],
        config.orientation[1],
        config.orientation[2],
      ]}
    >
      <group ref={spinRef}>
        <Center>
          <primitive object={clonedScene} />
        </Center>
      </group>
    </group>
  );
}

interface Scene3DProps {
  model?: ModelType;
}

export default function Scene3D({ model = "system-map" }: Scene3DProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        {/* Ambient for base visibility */}
        <ambientLight intensity={0.3} />

        {/* Key light - main dramatic light from top-right */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Fill light - softer from left to reduce harsh shadows */}
        <directionalLight position={[-4, 2, -2]} intensity={0.4} />

        {/* Rim light - back light for edge definition */}
        <directionalLight position={[0, 2, -6]} intensity={0.6} />

        <Suspense fallback={null}>
          <Bounds key={model} fit observe margin={1.0} maxDuration={0}>
            <RotatingModel model={model} rotate={!reducedMotion} />
          </Bounds>

          {/* Contact shadow beneath the model */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={8}
            blur={2}
            far={4}
          />
        </Suspense>

      </Canvas>
    </div>
  );
}
