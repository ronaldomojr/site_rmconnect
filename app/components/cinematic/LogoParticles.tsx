"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { particleVertex, particleFragment } from "./shaders";
import {
  sampleImageToPoints,
  brainShape,
  dashboardGrid,
  flowLines,
  expandedNetwork,
} from "./shapeTargets";

export type Progress = { value: number };

type Targets = {
  logo: Float32Array;
  color: Float32Array;
  flows: Float32Array;
  grid: Float32Array;
  neural: Float32Array;
  scale: Float32Array;
  rand: Float32Array;
};

export default function LogoParticles({
  progress,
  count,
  size = 4.6,
  burst = 1.6,
}: {
  progress: RefObject<Progress>;
  count: number;
  size?: number;
  burst?: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const [targets, setTargets] = useState<Targets | null>(null);
  const { gl } = useThree();

  useEffect(() => {
    let alive = true;
    sampleImageToPoints("/logo-mark.png", count, 5).then(({ positions, colors }) => {
      if (!alive) return;
      const rand = new Float32Array(count * 3);
      for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
      setTargets({
        logo: positions,
        color: colors,
        flows: flowLines(count),
        grid: dashboardGrid(count),
        neural: brainShape(count),
        scale: expandedNetwork(count),
        rand,
      });
    });
    return () => {
      alive = false;
    };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: size },
      uBurst: { value: burst },
      uPixelRatio: { value: 1 },
    }),
    [size, burst],
  );

  useFrame((state) => {
    // @ts-expect-error debug temporário
    const forced = typeof window.__forceP === "number" ? window.__forceP : null;
    const driven = forced ?? progress.current.value;
    const mat = matRef.current;
    if (mat) {
      const u = mat.uniforms;
      // suaviza levemente o progresso vindo do scroll
      u.uProgress.value += (driven - u.uProgress.value) * 0.12;
      u.uTime.value = state.clock.elapsedTime;
      u.uPixelRatio.value = gl.getPixelRatio();
      // @ts-expect-error debug temporário
      window.__prog = u.uProgress.value;
    }
    const pts = pointsRef.current;
    if (pts) {
      const p = driven;
      // Oscilação de perspectiva dirigida pelo scroll (±~28°): dá tridimensiona-
      // lidade sem virar de costas, mantendo as formas legíveis. Volta a ZERO nas
      // pontas (p=0 e p=5) → a logo inicial e a final encaram a câmera de frente.
      pts.rotation.y = Math.sin((p / 5) * Math.PI * 2) * 0.5;
      // Leve inclinação que sobe no meio e zera nas pontas (logo reta no fim).
      pts.rotation.x = Math.sin(p * (Math.PI / 5)) * 0.16;
    }
  });

  if (!targets) return null;

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[targets.logo, 3]} />
        <bufferAttribute attach="attributes-aLogo" args={[targets.logo, 3]} />
        <bufferAttribute attach="attributes-aFlows" args={[targets.flows, 3]} />
        <bufferAttribute attach="attributes-aGrid" args={[targets.grid, 3]} />
        <bufferAttribute attach="attributes-aNeural" args={[targets.neural, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[targets.scale, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[targets.color, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[targets.rand, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
