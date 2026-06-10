'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Float,
  Lightformer,
  MeshDistortMaterial,
  Sparkles,
} from '@react-three/drei';

/** 滑鼠視差攝影機 */
function CameraRig() {
  useFrame((state, delta) => {
    const t = 1 - Math.pow(0.0015, delta); // frame-rate independent damping
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.8,
      t
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.2 + state.pointer.y * 0.5,
      t
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

interface PearlProps {
  position: [number, number, number];
  scale: number;
  color: string;
  distort?: number;
  speed?: number;
  segments?: number;
}

/** 珍珠光澤的流動球體 */
function Pearl({
  position,
  scale,
  color,
  distort = 0.35,
  speed = 1.6,
  segments = 64,
}: PearlProps) {
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, segments, segments]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.08}
          metalness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.15}
          iridescence={0.9}
          iridescenceIOR={1.3}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

/** 緩慢呼吸的光暈強度 */
function BreathingLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 14 + Math.sin(clock.elapsedTime * 0.8) * 5;
    }
  });
  return <pointLight ref={ref} position={[0, 2, 3]} color="#ffd9cf" intensity={14} />;
}

export default function HeroScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const segments = isMobile ? 32 : 64;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.6} />
      <BreathingLight />
      <directionalLight position={[-4, 3, 2]} intensity={1.2} color="#fff1e8" />

      {/* 主珍珠 */}
      <Pearl
        position={[0, 0, 0]}
        scale={isMobile ? 1.25 : 1.6}
        color="#f3cfc9"
        distort={0.42}
        speed={1.8}
        segments={segments}
      />
      {/* 衛星珍珠 */}
      <Pearl
        position={isMobile ? [-1.7, 1.2, -1.5] : [-2.9, 1.1, -1.2]}
        scale={isMobile ? 0.5 : 0.7}
        color="#e8b4bc"
        distort={0.3}
        speed={1.4}
        segments={segments}
      />
      <Pearl
        position={isMobile ? [1.8, -1.2, -1.8] : [3, -1, -1.6]}
        scale={isMobile ? 0.55 : 0.85}
        color="#f7e3d0"
        distort={0.35}
        speed={1.2}
        segments={segments}
      />
      {!isMobile && (
        <Pearl
          position={[1.9, 1.6, -2.6]}
          scale={0.45}
          color="#dcb8d8"
          distort={0.28}
          speed={1.1}
          segments={48}
        />
      )}

      <Sparkles
        count={isMobile ? 40 : 90}
        scale={[10, 6, 6]}
        size={2.2}
        speed={0.35}
        opacity={0.55}
        color="#e9b8a6"
      />

      {/* 柔和粉彩漸層環境光 */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2}
          color="#ffe9e3"
          position={[0, 4, -4]}
          scale={[10, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#f6d4e0"
          position={[-5, 0, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#fdeed7"
          position={[5, -1, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[8, 5, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2.4}
          color="#fff7f0"
          position={[0, 2, 5]}
          scale={[4, 4, 1]}
        />
      </Environment>

      <CameraRig />
    </Canvas>
  );
}
