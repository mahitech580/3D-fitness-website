import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { Vector2, type Group } from 'three';

type Equipment = 'barbell' | 'dumbbell' | 'kettlebell';
type KineticObjectProps = { equipment: Equipment; autoRotate: boolean; resetToken: number };

const plateTones = ['#353d32', '#242b23', '#4b5547'];

function BarbellModel() {
  return (
    <group rotation={[0.16, 0.18, -0.08]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 2.2, 40]} />
        <meshStandardMaterial color="#cbd3c4" metalness={0.96} roughness={0.2} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.105, 0.105, 0.42, 32]} />
        <meshStandardMaterial color="#737e6d" metalness={0.82} roughness={0.28} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.95, 0, 0]}>
          {[0, 1, 2].map((layer) => (
            <mesh key={layer} position={[side * layer * 0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.44 - layer * 0.02, 0.44 - layer * 0.02, 0.13, 56]} />
              <meshStandardMaterial color={plateTones[layer]} metalness={0.82} roughness={0.26} />
            </mesh>
          ))}
          <mesh position={[side * 0.43, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 36]} />
            <meshStandardMaterial color="#c8ff62" metalness={0.48} roughness={0.22} emissive="#496b12" emissiveIntensity={0.36} />
          </mesh>
          <mesh position={[side * 0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 24]} />
            <meshStandardMaterial color="#bac5b2" metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0.78, 0.2, 0.42]}>
        <torusGeometry args={[1.55, 0.012, 8, 140]} />
        <meshBasicMaterial color="#c8ff62" />
      </mesh>
      <mesh rotation={[1.1, -0.4, -0.72]}>
        <torusGeometry args={[1.76, 0.007, 8, 140]} />
        <meshBasicMaterial color="#9da991" transparent opacity={0.62} />
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

function DumbbellModel() {
  return (
    <group rotation={[0.12, 0.2, -0.1]} scale={0.92}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.085, 0.085, 1.65, 36]} />
        <meshStandardMaterial color="#aeb8a7" metalness={0.94} roughness={0.22} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.73, 0, 0]}>
          {[0, 1].map((layer) => (
            <mesh key={layer} position={[side * layer * 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34 - layer * 0.035, 0.34 - layer * 0.035, 0.16, 48]} />
              <meshStandardMaterial color={layer === 0 ? '#283027' : '#485243'} metalness={0.84} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[side * 0.37, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.06, 32]} />
            <meshStandardMaterial color="#c8ff62" metalness={0.48} roughness={0.22} emissive="#496b12" emissiveIntensity={0.32} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0.7, 0.2, 0.4]}>
        <torusGeometry args={[1.35, 0.012, 8, 120]} />
        <meshBasicMaterial color="#c8ff62" />
      </mesh>
    </group>
  );
}

function KettlebellModel() {
  const handlePoints = [
    new Vector2(0.2, 0.42),
    new Vector2(0.2, 0.58),
    new Vector2(0.22, 0.72),
    new Vector2(0.3, 0.83),
    new Vector2(0.4, 0.86),
    new Vector2(0.48, 0.81),
    new Vector2(0.5, 0.72),
    new Vector2(0.49, 0.58),
    new Vector2(0.47, 0.43),
  ];
  return (
    <group rotation={[0.08, 0.22, -0.04]}>
      <mesh position={[0, -0.19, 0]} scale={[0.69, 0.72, 0.58]}>
        <sphereGeometry args={[0.72, 48, 40]} />
        <meshStandardMaterial color="#343d30" metalness={0.78} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.01, 0]} scale={[0.44, 0.34, 0.4]}>
        <sphereGeometry args={[0.48, 32, 24]} />
        <meshStandardMaterial color="#242d22" metalness={0.84} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <torusGeometry args={[0.3, 0.085, 18, 56]} />
        <meshStandardMaterial color="#aebba2" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.41, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.085, 18, 56]} />
        <meshStandardMaterial color="#bbc8ae" metalness={0.94} roughness={0.19} />
      </mesh>
      <mesh position={[0, -0.25, 0.56]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.16, 40]} />
        <meshBasicMaterial color="#c8ff62" />
      </mesh>
      <mesh rotation={[0.82, 0.3, -0.25]}>
        <torusGeometry args={[1.18, 0.012, 8, 120]} />
        <meshBasicMaterial color="#c8ff62" />
      </mesh>
      <mesh rotation={[1.2, -0.45, 0.6]}>
        <torusGeometry args={[1.42, 0.007, 8, 120]} />
        <meshBasicMaterial color="#9da991" transparent opacity={0.55} />
      </mesh>
      {handlePoints.length === 0 ? null : null}
    </group>
  );
}

function TrainingObject({ equipment }: { equipment: Equipment }) {
  if (equipment === 'dumbbell') return <DumbbellModel />;
  if (equipment === 'kettlebell') return <KettlebellModel />;
  return <BarbellModel />;
}

function SceneFallback({ equipment, unavailable = false }: { equipment: Equipment; unavailable?: boolean }) {
  return (
    <div className="scene-fallback" role="img" aria-label={unavailable ? 'Stylized equipment preview; WebGL is unavailable' : 'Stylized equipment preview while the interactive scene loads'}>
      <span className="scene-ring scene-ring--one" />
      <span className="scene-ring scene-ring--two" />
      <span className={'scene-dumbbell scene-dumbbell--' + equipment}><i /><b />{equipment !== 'kettlebell' && <i />}</span>
      <span className="scene-fallback-label">{unavailable ? 'WEBGL NOT AVAILABLE' : 'INTERACTIVE SCENE'}</span>
    </div>
  );
}

export default function KineticObject({ equipment, autoRotate, resetToken }: KineticObjectProps) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

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
    <div ref={host} className="kinetic-object-host" role="group" aria-label={'Interactive 3D ' + equipment + '; drag to rotate the view'}>
      {visible ? (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, equipment === 'kettlebell' ? 4.35 : 5.1], fov: 43 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          fallback={<SceneFallback equipment={equipment} unavailable />}
          onCreated={({ gl }) => { gl.setClearColor('#0a0c0a', 0); }}
        >
          <ambientLight intensity={1.05} />
          <directionalLight position={[3.5, 4, 3]} intensity={2.2} color="#efffe2" />
          <pointLight position={[-3, -1.8, 1.2]} intensity={11} color="#bfff4b" />
          <pointLight position={[0, 2, -2]} intensity={5} color="#7293a4" />
          <TrainingObject key={equipment + '-' + resetToken} equipment={equipment} />
          <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.25, 64]} />
            <meshBasicMaterial color="#bfff4b" transparent opacity={0.055} />
          </mesh>
          <OrbitControls key={resetToken} enablePan={false} enableZoom enableDamping dampingFactor={0.08} minDistance={3.1} maxDistance={7.2} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI * 3 / 4} autoRotate={autoRotate && !reducedMotion} autoRotateSpeed={0.8} />
        </Canvas>
      ) : (
        <SceneFallback equipment={equipment} />
      )}
    </div>
  );
}
