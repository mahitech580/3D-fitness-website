import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Athlete } from './WorkoutArena';

export function FitnessScene({ paused = false }: { paused?: boolean }) {
  const reducedMotion = Boolean(useReducedMotion());
  const sceneRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const node = sceneRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => setInView(Boolean(entries[0]?.isIntersecting)), { threshold: 0.02 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const staticScene = paused || reducedMotion || !inView;

  return (
    <div ref={sceneRef} className="fitness-scene" role="img" aria-label="Interactive three-dimensional athlete demonstrating a controlled squat inside a training space. Drag to orbit the view.">
      <Canvas
        dpr={[1, 1.15]}
        frameloop={staticScene ? 'demand' : 'always'}
        camera={{ position: [3.2, 2.85, 5.7], fov: 38, near: 0.1, far: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.95} color="#dfe9e0" />
        <hemisphereLight args={['#e9f0eb', '#28342d', 0.8]} />
        <directionalLight position={[-3.5, 4.5, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[3, 2.5, -2]} intensity={2.1} color="#d7ff58" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1a211d" roughness={0.92} />
        </mesh>
        <gridHelper args={[8, 16, '#46534a', '#28342d']} position={[0, -0.105, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]}>
          <ringGeometry args={[1.05, 1.07, 64]} />
          <meshBasicMaterial color="#d7ff58" transparent opacity={0.5} />
        </mesh>
        <Athlete move="squat" running={!staticScene} tempo={38} onRep={() => undefined} />
        <OrbitControls makeDefault enablePan={false} enableZoom={false} enableDamping dampingFactor={0.08} autoRotate={false} target={[0, 1.05, 0]} />
      </Canvas>
      <span className="scene-orbit-note"><span aria-hidden="true">↔</span> DRAG TO ROTATE</span>
      <span className="scene-index">LIVE ATHLETE / FORM 001</span>
    </div>
  );
}
