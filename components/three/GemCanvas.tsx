'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer } from '@react-three/drei';

function Gem({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.6;
      ref.current.rotation.x += delta * 0.15;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.05}
          metalness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.4}
          envMapIntensity={1.6}
          flatShading
        />
      </mesh>
    </Float>
  );
}

/** 段落標題旁的小型 3D 寶石點綴 */
export default function GemCanvas({ color = '#d9a8a0' }: { color?: string }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} color="#fff1e8" />
      <Gem color={color} />
      <Environment resolution={64} frames={1}>
        <Lightformer
          form="rect"
          intensity={2}
          color="#ffe9e3"
          position={[0, 3, -3]}
          scale={[8, 5, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2}
          color="#fdeed7"
          position={[2, 0, 4]}
          scale={[3, 3, 1]}
        />
      </Environment>
    </Canvas>
  );
}
