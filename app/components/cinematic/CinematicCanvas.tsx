"use client";

/* eslint-disable react-hooks/immutability -- r3f imperativo: a câmera (objeto
 * three) é movida dentro do loop de render (useFrame) conforme o scroll. */

import { type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import LogoParticles, { type Progress } from "./LogoParticles";

/** Aproxima/afasta e inclina levemente a câmera conforme a narrativa. */
function CameraRig({ progress }: { progress: RefObject<Progress> }) {
  const { camera } = useThree();
  useFrame((state) => {
    const p = progress.current.value;
    const targetZ = 6.2 - Math.sin(Math.min(p, 1) * (Math.PI / 2)) * 1.1 + Math.sin(p * 0.7) * 0.4;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.x += (Math.sin(p * 0.6) * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (Math.cos(p * 0.4) * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    // deriva orbital muito sutil
    camera.position.x += Math.sin(state.clock.elapsedTime * 0.1) * 0.002;
  });
  return null;
}

export default function CinematicCanvas({
  progress,
  count,
  bloom,
  paused,
}: {
  progress: RefObject<Progress>;
  count: number;
  bloom: boolean;
  paused: boolean;
}) {
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 0, 6.2], fov: 50 }}
      dpr={[1, bloom ? 1.75 : 1.4]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <CameraRig progress={progress} />
      <LogoParticles progress={progress} count={count} />
      {bloom && (
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.7}
            mipmapBlur
            radius={0.65}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
