import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import type { Group } from 'three';

function WeightedObject() {
  const group = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.16;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.28) * 0.12;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    }
  });

  return (
    <group ref={group} rotation={[0.18, 0.25, -0.08]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 2.05, 32]} />
        <meshStandardMaterial color="#c9d0c3" metalness={0.96} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.55, 24]} />
        <meshStandardMaterial color="#6d7667" metalness={0.82} roughness={0.34} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.88, 0, 0]}>
          {[0, 1, 2].map((layer) => (
            <mesh key={layer} position={[side * layer * 0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.43 - layer * 0.018, 0.43 - layer * 0.018, 0.12, 48]} />
              <meshStandardMaterial color={layer === 1 ? '#242922' : '#424a3e'} metalness={0.84} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[side * 0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
            <meshStandardMaterial color="#c8ff52" metalness={0.48} roughness={0.22} emissive="#496b12" emissiveIntensity={0.35} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0.78, 0.2, 0.42]}>
        <torusGeometry args={[1.55, 0.012, 8, 140]} />
        <meshBasicMaterial color="#c8ff52" />
      </mesh>
      <mesh rotation={[1.1, -0.4, -0.72]}>
        <torusGeometry args={[1.76, 0.007, 8, 140]} />
        <meshBasicMaterial color="#8d9789" transparent opacity={0.62} />
      </mesh>
      <mesh position={[1.49, 0.74, 0.12]}>
        <icosahedronGeometry args={[0.075, 1]} />
        <meshStandardMaterial color="#d9ff91" emissive="#9fcc40" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.55, -0.55, -0.2]}>
        <icosahedronGeometry args={[0.045, 1]} />
        <meshStandardMaterial color="#d9ff91" emissive="#9fcc40" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function SceneFallback({ unavailable = false }: { unavailable?: boolean }) {
  return (
    <div className="scene-fallback" role="img" aria-label={unavailable ? 'Stylized barbell preview; WebGL is unavailable' : 'Stylized barbell preview while the interactive scene loads'}>
      <span className="scene-ring scene-ring--one" />
      <span className="scene-ring scene-ring--two" />
      <span className="scene-dumbbell"><i /><b /><i /></span>
      <span className="scene-fallback-label">{unavailable ? 'WEBGL NOT AVAILABLE' : 'INTERACTIVE SCENE'}</span>
    </div>
  );
}

export default function KineticObject() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      setVisible(entries.some((entry) => entry.isIntersecting));
    }, { rootMargin: '160px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="kinetic-object-host" role="group" aria-label="Interactive 3D dumbbell sculpture; drag to rotate the view">
      {visible ? (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5.1], fov: 43 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          fallback={<SceneFallback unavailable />}
          onCreated={({ gl }) => { gl.setClearColor('#0a0c0a', 0); }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[3.5, 4, 3]} intensity={2.2} color="#efffe2" />
          <pointLight position={[-3, -1.8, 1.2]} intensity={11} color="#bfff4b" />
          <pointLight position={[0, 2, -2]} intensity={5} color="#7293a4" />
          <WeightedObject />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI * 2 / 3} />
        </Canvas>
      ) : (
        <SceneFallback />
      )}
    </div>
  );
}
