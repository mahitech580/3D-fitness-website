import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

type Equipment = 'barbell' | 'dumbbell' | 'kettlebell';
type Finish = 'kinetik' | 'carbon' | 'steel';
type LightingPreset = 'studio' | 'contrast' | 'neon';
type CameraPreset = 'hero' | 'front' | 'side';
type StoryBeat = 0 | 1 | 2;
type KineticObjectProps = { equipment: Equipment; autoRotate: boolean; resetToken: number; finish: Finish; lighting: LightingPreset; cameraPreset: CameraPreset; storyBeat: StoryBeat };

const finishAccent: Record<Finish, string> = { kinetik: '#c8ff62', carbon: '#9da991', steel: '#e6eee0' };
const finishBody: Record<Finish, string> = { kinetik: '#343d30', carbon: '#141916', steel: '#8b9890' };

const plateTones = ['#353d32', '#242b23', '#4b5547'];

function BarbellModel({ finish }: { finish: Finish }) {
  const accent = finishAccent[finish];
  const plates = finish === 'steel' ? ['#d8e0d9', '#aab5ad', '#eef3ef'] : finish === 'carbon' ? ['#242a25', '#101411', '#414a41'] : plateTones;
  return (
    <group rotation={[0.16, 0.18, -0.08]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 2.2, 40]} />
        <meshStandardMaterial color={finish === 'steel' ? '#f0f4f0' : finish === 'carbon' ? '#59635a' : '#cbd3c4'} metalness={0.96} roughness={0.2} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.105, 0.105, 0.42, 32]} />
        <meshStandardMaterial color={finish === 'steel' ? '#d4ddd6' : finish === 'carbon' ? '#343c35' : '#737e6d'} metalness={0.82} roughness={0.28} />
      </mesh>
      {/* Fine grip ridges give the centre shaft a more believable machined finish. */}
      {Array.from({ length: 15 }, (_, index) => (
        <mesh key={'shaft-knurl-' + index} position={[(index - 7) * 0.064, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.075, 0.0035, 6, 24]} />
          <meshStandardMaterial color={finish === 'steel' ? '#dce5dd' : '#8e9988'} metalness={0.9} roughness={0.32} />
        </mesh>
      ))}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.95, 0, 0]}>
          {[0, 1, 2].map((layer) => (
            <mesh key={layer} position={[side * layer * 0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.44 - layer * 0.02, 0.44 - layer * 0.02, 0.13, 56]} />
              <meshStandardMaterial color={plates[layer]} metalness={0.82} roughness={0.26} />
            </mesh>
          ))}
          {/* Fine concentric grooves catch the studio lights on each outer plate. */}
          <mesh position={[side * 0.345, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.305, 0.008, 6, 48]} />
            <meshStandardMaterial color={finish === 'steel' ? '#eef3ef' : '#778373'} metalness={0.76} roughness={0.28} />
          </mesh>
          <mesh position={[side * 0.345, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.235, 0.005, 6, 48]} />
            <meshStandardMaterial color={accent} metalness={0.55} roughness={0.25} emissive={finish === 'steel' ? '#73877a' : '#496b12'} emissiveIntensity={0.18} />
          </mesh>
          <mesh position={[side * 0.43, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 36]} />
            <meshStandardMaterial color={accent} metalness={0.48} roughness={0.22} emissive={finish === 'steel' ? '#73877a' : '#496b12'} emissiveIntensity={0.36} />
          </mesh>
          <mesh position={[side * 0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 24]} />
            <meshStandardMaterial color={finish === 'steel' ? '#f0f4f0' : '#bac5b2'} metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0.78, 0.2, 0.42]}>
        <torusGeometry args={[1.55, 0.012, 8, 140]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh rotation={[1.1, -0.4, -0.72]}>
        <torusGeometry args={[1.76, 0.007, 8, 140]} />
        <meshBasicMaterial color="#9da991" transparent opacity={0.62} />
      </mesh>
      <mesh position={[1.49, 0.74, 0.12]}>
        <icosahedronGeometry args={[0.075, 1]} />
        <meshStandardMaterial color={accent} emissive={finish === 'steel' ? '#73877a' : '#9fcc40'} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.55, -0.55, -0.2]}>
        <icosahedronGeometry args={[0.045, 1]} />
        <meshStandardMaterial color={accent} emissive={finish === 'steel' ? '#73877a' : '#9fcc40'} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function DumbbellModel({ finish }: { finish: Finish }) {
  const accent = finishAccent[finish];
  const body = finishBody[finish];
  return (
    <group rotation={[0.12, 0.2, -0.1]} scale={0.92}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.085, 0.085, 1.65, 36]} />
        <meshStandardMaterial color={finish === 'steel' ? '#f0f4f0' : finish === 'carbon' ? '#3b453c' : '#aeb8a7'} metalness={0.94} roughness={0.22} />
      </mesh>
      {/* Knurled handle rings remain visible across each material finish. */}
      {Array.from({ length: 11 }, (_, index) => (
        <mesh key={'dumbbell-grip-' + index} position={[(index - 5) * 0.061, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.085, 0.003, 6, 24]} />
          <meshStandardMaterial color={finish === 'steel' ? '#dce5dd' : '#7e8978'} metalness={0.92} roughness={0.3} />
        </mesh>
      ))}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.73, 0, 0]}>
          {[0, 1].map((layer) => (
            <mesh key={layer} position={[side * layer * 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34 - layer * 0.035, 0.34 - layer * 0.035, 0.16, 48]} />
              <meshStandardMaterial color={layer === 0 ? body : finish === 'steel' ? '#b9c4bb' : '#485243'} metalness={0.84} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[side * 0.265, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.235, 0.007, 6, 42]} />
            <meshStandardMaterial color={finish === 'steel' ? '#edf3ed' : '#768271'} metalness={0.78} roughness={0.28} />
          </mesh>
          <mesh position={[side * 0.37, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.06, 32]} />
            <meshStandardMaterial color={accent} metalness={0.48} roughness={0.22} emissive={finish === 'steel' ? '#73877a' : '#496b12'} emissiveIntensity={0.32} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0.7, 0.2, 0.4]}>
        <torusGeometry args={[1.35, 0.012, 8, 120]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function KettlebellModel({ finish }: { finish: Finish }) {
  const accent = finishAccent[finish];
  const body = finishBody[finish];
  return (
    <group rotation={[0.08, 0.22, -0.04]}>
      <mesh position={[0, -0.19, 0]} scale={[0.69, 0.72, 0.58]}>
        <sphereGeometry args={[0.72, 48, 40]} />
        <meshStandardMaterial color={body} metalness={0.78} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.01, 0]} scale={[0.44, 0.34, 0.4]}>
        <sphereGeometry args={[0.48, 32, 24]} />
        <meshStandardMaterial color={finish === 'steel' ? '#65726a' : body} metalness={0.84} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <torusGeometry args={[0.3, 0.085, 18, 56]} />
        <meshStandardMaterial color="#aebba2" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.41, 0]}>
        <torusGeometry args={[0.28, 0.085, 18, 56]} />
        <meshStandardMaterial color="#bbc8ae" metalness={0.94} roughness={0.19} />
      </mesh>
      <mesh position={[0, -0.25, 0.56]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.16, 40]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh rotation={[0.82, 0.3, -0.25]}>
        <torusGeometry args={[1.18, 0.012, 8, 120]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh rotation={[1.2, -0.45, 0.6]}>
        <torusGeometry args={[1.42, 0.007, 8, 120]} />
        <meshBasicMaterial color="#9da991" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function SceneControls({ equipment, autoRotate, resetToken, reducedMotion, cameraPreset, storyBeat }: { equipment: Equipment; autoRotate: boolean; resetToken: number; reducedMotion: boolean | null; cameraPreset: CameraPreset; storyBeat: StoryBeat }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    const distance = equipment === 'kettlebell' ? 4.35 : equipment === 'dumbbell' ? 4.7 : 5.1;
    const storyDistance = storyBeat === 1 ? distance * 0.92 : storyBeat === 2 ? distance * 0.78 : distance;
    if (cameraPreset === 'side') camera.position.set(storyDistance * 0.72, 0.12, storyDistance * 0.72);
    else if (cameraPreset === 'front') camera.position.set(0, 0.02, storyDistance);
    else camera.position.set(0.18, storyBeat === 2 ? 0.12 : 0.38, storyDistance);
    camera.lookAt(0, 0, 0);
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
  }, [camera, cameraPreset, equipment, resetToken, storyBeat]);

  return <OrbitControls ref={controls} enablePan={false} enableZoom enableDamping dampingFactor={0.08} minDistance={3.1} maxDistance={7.2} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI * 3 / 4} autoRotate={autoRotate && !reducedMotion} autoRotateSpeed={0.8} />;
}

function TrainingObject({ equipment, finish }: { equipment: Equipment; finish: Finish }) {
  if (equipment === 'dumbbell') return <DumbbellModel finish={finish} />;
  if (equipment === 'kettlebell') return <KettlebellModel finish={finish} />;
  return <BarbellModel finish={finish} />;
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

export default function KineticObject({ equipment, autoRotate, resetToken, finish, lighting, cameraPreset, storyBeat }: KineticObjectProps) {
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
          <ambientLight intensity={lighting === 'contrast' ? 0.55 : lighting === 'neon' ? 0.8 : 1.05} />
          <directionalLight position={[3.5, 4, 3]} intensity={lighting === 'contrast' ? 3.1 : lighting === 'neon' ? 1.4 : 2.2} color={lighting === 'contrast' ? '#ffffff' : lighting === 'neon' ? '#bfff4b' : '#efffe2'} />
          <directionalLight position={[-3, 1, -2]} intensity={lighting === 'contrast' ? 2.4 : lighting === 'neon' ? 3.0 : 0.8} color={lighting === 'contrast' ? '#9da991' : lighting === 'neon' ? '#5d82ff' : '#7293a4'} />
          <pointLight position={[-3, -1.8, 1.2]} intensity={lighting === 'contrast' ? 5 : lighting === 'neon' ? 14 : 11} color={lighting === 'contrast' ? '#e4ebdf' : '#bfff4b'} />
          <pointLight position={[0, 2, -2]} intensity={lighting === 'neon' ? 8 : lighting === 'contrast' ? 2 : 5} color={lighting === 'neon' ? '#5d82ff' : '#7293a4'} />
          <group rotation={[0, storyBeat === 0 ? -0.12 : storyBeat === 1 ? 0.18 : 0.48, 0]} position={[0, storyBeat === 1 ? 0.08 : storyBeat === 2 ? -0.04 : 0, 0]} scale={storyBeat === 1 ? 1.06 : storyBeat === 2 ? 0.96 : 1}>
            <TrainingObject key={equipment + '-' + finish} equipment={equipment} finish={finish} />
          </group>
          <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.25, 64]} />
            <meshBasicMaterial color="#bfff4b" transparent opacity={0.055} />
          </mesh>
          <SceneControls equipment={equipment} autoRotate={autoRotate} resetToken={resetToken} reducedMotion={reducedMotion} cameraPreset={cameraPreset} storyBeat={storyBeat} />
        </Canvas>
      ) : (
        <SceneFallback equipment={equipment} />
      )}
    </div>
  );
}
