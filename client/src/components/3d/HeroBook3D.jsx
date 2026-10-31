import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';

// 3D Procedural Futuristic Open Book Mesh
const OpenBookModel = () => {
  const groupRef = useRef();
  const leftPageRef = useRef();
  const rightPageRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating and subtle breathing rotation
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2 + (state.pointer.x * 0.3);
      groupRef.current.rotation.x = 0.25 + Math.cos(t * 0.4) * 0.05 - (state.pointer.y * 0.2);
    }
    if (leftPageRef.current && rightPageRef.current) {
      // Gentle page fluttering effect
      leftPageRef.current.rotation.z = -0.35 + Math.sin(t * 1.5) * 0.03;
      rightPageRef.current.rotation.z = 0.35 - Math.sin(t * 1.5 + 0.5) * 0.03;
    }
  });

  // Futuristic Materials
  const coverMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0f172a'),
    roughness: 0.2,
    metalness: 0.8,
  }), []);

  const pageMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f8fafc'),
    roughness: 0.4,
    metalness: 0.1,
  }), []);

  const glowEdgeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#22d3ee'),
    transparent: true,
    opacity: 0.8,
  }), []);

  const hologramMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#818cf8'),
    transparent: true,
    opacity: 0.6,
    wireframe: true,
  }), []);

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Central Spine */}
      <mesh position={[0, 0, 0]} material={coverMaterial}>
        <cylinderGeometry args={[0.22, 0.22, 3.2, 16]} />
      </mesh>

      {/* Book Cover Left Backing */}
      <mesh position={[-1.25, 0, -0.05]} rotation={[0, -0.25, 0]} material={coverMaterial}>
        <boxGeometry args={[2.4, 3.2, 0.08]} />
      </mesh>

      {/* Book Cover Right Backing */}
      <mesh position={[1.25, 0, -0.05]} rotation={[0, 0.25, 0]} material={coverMaterial}>
        <boxGeometry args={[2.4, 3.2, 0.08]} />
      </mesh>

      {/* Left Page Block */}
      <group position={[-1.2, 0, 0.05]} rotation={[0, -0.22, 0]}>
        <mesh material={pageMaterial}>
          <boxGeometry args={[2.3, 3.0, 0.2]} />
        </mesh>
        {/* Holographic Glowing Line on Left Page */}
        <mesh position={[0, 0.5, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.8, 0.04]} />
        </mesh>
        <mesh position={[0, 0.1, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.6, 0.04]} />
        </mesh>
        <mesh position={[0, -0.3, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.9, 0.04]} />
        </mesh>
        <mesh position={[0, -0.7, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.4, 0.04]} />
        </mesh>
      </group>

      {/* Right Page Block */}
      <group position={[1.2, 0, 0.05]} rotation={[0, 0.22, 0]}>
        <mesh material={pageMaterial}>
          <boxGeometry args={[2.3, 3.0, 0.2]} />
        </mesh>
        {/* Holographic Glowing Lines on Right Page */}
        <mesh position={[0, 0.5, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.8, 0.04]} />
        </mesh>
        <mesh position={[0, 0.1, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.5, 0.04]} />
        </mesh>
        <mesh position={[0, -0.3, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.7, 0.04]} />
        </mesh>
        <mesh position={[0, -0.7, 0.11]} material={glowEdgeMaterial}>
          <planeGeometry args={[1.2, 0.04]} />
        </mesh>
      </group>

      {/* Fluttering Left Active Page */}
      <group ref={leftPageRef} position={[-0.1, 0, 0.15]}>
        <mesh position={[-1.1, 0, 0]} material={pageMaterial}>
          <boxGeometry args={[2.2, 2.95, 0.02]} />
        </mesh>
      </group>

      {/* Fluttering Right Active Page */}
      <group ref={rightPageRef} position={[0.1, 0, 0.15]}>
        <mesh position={[1.1, 0, 0]} material={pageMaterial}>
          <boxGeometry args={[2.2, 2.95, 0.02]} />
        </mesh>
      </group>

      {/* Floating Holographic Ring above Book */}
      <mesh position={[0, 0.2, 0.8]} rotation={[Math.PI / 2.5, 0, 0]} material={hologramMaterial}>
        <torusGeometry args={[1.8, 0.02, 16, 64]} />
      </mesh>
      <mesh position={[0, 0.2, 1.2]} rotation={[Math.PI / 2.3, 0.3, 0]} material={hologramMaterial}>
        <torusGeometry args={[1.4, 0.015, 16, 64]} />
      </mesh>
    </group>
  );
};

export const HeroBook3D = () => {
  return (
    <div className="w-full h-[450px] md:h-[550px] relative">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#38bdf8" />
        <pointLight position={[-5, -3, 3]} intensity={2.0} color="#a855f7" />
        <spotLight position={[0, 8, 3]} intensity={3} angle={0.6} penumbra={1} color="#67e8f9" />

        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          <Center>
            <OpenBookModel />
          </Center>
        </Float>

        <Sparkles count={45} scale={6} size={2.5} speed={0.4} color="#67e8f9" />
        <Sparkles count={30} scale={5} size={2.0} speed={0.3} color="#c084fc" />
      </Canvas>
    </div>
  );
};

export default HeroBook3D;
