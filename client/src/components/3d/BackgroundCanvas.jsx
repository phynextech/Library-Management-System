import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const FloatingMiniBook = ({ position, rotationSpeed, color }) => {
  const meshRef = useRef();
  const initialY = position[1];
  const offset = useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + offset;
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(t * 0.8) * 0.4;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      meshRef.current.rotation.y += rotationSpeed * 0.01;
      meshRef.current.rotation.z = Math.cos(t * 0.4) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.7, 1.0, 0.15]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* Book Spine Highlight */}
      <mesh position={[-0.35, 0, 0]}>
        <boxGeometry args={[0.04, 0.98, 0.16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export const BackgroundCanvas = () => {
  const books = useMemo(() => [
    { pos: [-6, 3, -4], speed: 0.6, color: '#1e1b4b' },
    { pos: [7, 2, -5], speed: -0.7, color: '#0f172a' },
    { pos: [-8, -3, -6], speed: 0.5, color: '#172554' },
    { pos: [6, -4, -4], speed: -0.5, color: '#1e293b' },
    { pos: [-4, 6, -7], speed: 0.4, color: '#2e1065' },
    { pos: [5, 5, -6], speed: -0.4, color: '#042f2e' },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#a855f7" />

        {books.map((b, idx) => (
          <FloatingMiniBook
            key={idx}
            position={b.pos}
            rotationSpeed={b.speed}
            color={b.color}
          />
        ))}

        <Sparkles count={60} scale={18} size={2.2} speed={0.2} color="#38bdf8" />
        <Sparkles count={40} scale={15} size={1.8} speed={0.15} color="#c084fc" />
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;
