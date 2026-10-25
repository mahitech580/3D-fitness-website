import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import type { Group } from 'three';

function BoxingBag({ reducedMotion }: { reducedMotion: boolean }) {
  const bag = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!bag.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    bag.current.rotation.y = Math.sin(time * 0.36) * 0.14;
    bag.current.rotation.z = Math.sin(time * 0.72) * 0.025;
  });

  return (
    <group ref={bag} position={[0, -0.02, 0]}>
      {/* Suspension hardware */}
      <mesh position={[0, 1.42, -0.02]}>
        <cylinderGeometry args={[0.29, 0.34, 0.1, 32]} />
        <meshStandardMaterial color="#6a7565" metalness={0.9} roughness={0.24} />
      </mesh>
      {[-0.23, 0.23].flatMap((x) =>
        [-0.17, 0.17].map((z) => (
          <mesh key={x + ":" + z} position={[x, 1.08, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.62, 8]} />
            <meshStandardMaterial color="#a6b69b" metalness={0.88} roughness={0.28} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.76, 0]}>
        <torusGeometry args={[0.47, 0.045, 10, 56]} />
        <meshStandardMaterial color="#9aa793" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Heavy bag: sculpted cylinders and stitched accent bands, all real geometry */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.53, 0.48, 1.68, 56, 12]} />
        <meshStandardMaterial color="#172019" metalness={0.62} roughness={0.3} emissive="#172817" emissiveIntensity={0.24} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.51, 0.51, 0.08, 56]} />
        <meshStandardMaterial color="#687361" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[0.47, 0.47, 0.08, 56]} />
        <meshStandardMaterial color="#101611" metalness={0.62} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.505, 0.025, 8, 64]} />
        <meshStandardMaterial color="#c8ff62" metalness={0.52} roughness={0.25} emissive="#8fcf3b" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.485, 0.018, 8, 64]} />
        <meshStandardMaterial color="#9fce68" metalness={0.45} roughness={0.28} emissive="#8fcf3b" emissiveIntensity={0.38} />
      </mesh>
      <mesh position={[0, 0.05, 0.51]}>
        <boxGeometry args={[0.58, 0.21, 0.035]} />
        <meshStandardMaterial color="#0a110b" metalness={0.3} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.05, 0.535]}>
        <torusGeometry args={[0.075, 0.012, 8, 32]} />
        <meshStandardMaterial color="#c8ff62" metalness={0.4} roughness={0.25} emissive="#c8ff62" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 0.545]}>
        <circleGeometry args={[0.022, 24]} />
        <meshStandardMaterial color="#c8ff62" emissive="#c8ff62" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function OrbitRings({ reducedMotion }: { reducedMotion: boolean }) {
  const rings = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!rings.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    rings.current.rotation.y = time * 0.12;
    rings.current.rotation.z = Math.sin(time * 0.16) * 0.08;
  });

  return (
    <group ref={rings} rotation={[0.42, 0.05, -0.2]}>
      <mesh>
        <torusGeometry args={[1.28, 0.013, 8, 100]} />
        <meshStandardMaterial color="#c8ff62" metalness={0.25} roughness={0.28} emissive="#8fcf3b" emissiveIntensity={0.75} />
      </mesh>
      <mesh rotation={[0.6, 0.8, 0.3]}>
        <torusGeometry args={[1.48, 0.008, 8, 100]} />
        <meshStandardMaterial color="#e4f4da" metalness={0.55} roughness={0.25} transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      setVisible(entries.some((entry) => entry.isIntersecting));
    }, { rootMargin: '180px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="hero-three-scene" aria-hidden="true">
      {visible ? (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={prefersReducedMotion ? 'demand' : 'always'}
          camera={{ position: [0, 0, 5.7], fov: 37 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        >
          <ambientLight intensity={1.25} />
          <directionalLight position={[3.2, 4, 5]} color="#eef9e7" intensity={3.4} />
          <pointLight position={[-2.1, 0.2, 1.4]} color="#c8ff62" intensity={17} distance={6} />
          <pointLight position={[2.2, -0.8, -1.8]} color="#f49b55" intensity={7} distance={5} />
          <OrbitRings reducedMotion={prefersReducedMotion} />
          <BoxingBag reducedMotion={prefersReducedMotion} />
          <Sparkles count={30} scale={[3.4, 3.3, 2.1]} size={1.8} speed={prefersReducedMotion ? 0 : 0.18} opacity={0.56} color="#c8ff62" />
        </Canvas>
      ) : (
        <div className="hero-three-fallback">
          <span className="hero-three-fallback-ring" />
          <span className="hero-three-fallback-core" />
        </div>
      )}
    </div>
  );
}
