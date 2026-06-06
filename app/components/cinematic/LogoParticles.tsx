"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { particleVertex, particleFragment } from "./shaders";
import {
  sampleImageToPoints,
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
    Promise.all([
      sampleImageToPoints("/logo-mark.png", count, 5),
      // Cérebro: imagem real (referência) amostrada — span ~um pouco maior que a logo
      sampleImageToPoints("/brain.png", count, 4.2, { bbox: true, depth: 0.2, size: 420 }),
    ]).then(([logo, brain]) => {
      if (!alive) return;
      const rand = new Float32Array(count * 3);
      for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
      setTargets({
        logo: logo.positions,
        color: logo.colors,
        flows: flowLines(count),
        grid: dashboardGrid(count),
        neural: brain.positions,
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
    const mat = matRef.current;
    if (mat) {
      const u = mat.uniforms;
      // suaviza levemente o progresso vindo do scroll
      u.uProgress.value += (progress.current.value - u.uProgress.value) * 0.12;
      u.uTime.value = state.clock.elapsedTime;
      u.uPixelRatio.value = gl.getPixelRatio();
    }
    const pts = pointsRef.current;
    if (pts) {
      const p = progress.current.value;
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
