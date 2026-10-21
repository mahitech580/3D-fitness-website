import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';

function BarbellModel() {
  return (
    <group rotation={[0.1, -0.2, -0.18]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 4.25, 40]} />
        <meshStandardMaterial color="#c7d1d0" metalness={0.92} roughness={0.22} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} scale={[1, 0.82, 1]}>
        <cylinderGeometry args={[0.075, 0.075, 3.3, 40]} />
        <meshStandardMaterial color="#333a3a" metalness={0.84} roughness={0.31} />
      </mesh>
      {[-1.58, -1.25, 1.25, 1.58].map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[index % 2 === 0 ? 0.53 : 0.43, index % 2 === 0 ? 0.53 : 0.43, 0.18, 64]} />
            <meshPhysicalMaterial color={index % 2 === 0 ? '#202625' : '#303836'} metalness={0.55} roughness={0.25} clearcoat={0.5} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.094]} castShadow>
            <torusGeometry args={[index % 2 === 0 ? 0.39 : 0.31, 0.019, 12, 64]} />
            <meshStandardMaterial color="#d7ff58" metalness={0.3} roughness={0.34} emissive="#24310a" emissiveIntensity={0.15} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, -0.094]}>
            <torusGeometry args={[index % 2 === 0 ? 0.39 : 0.31, 0.015, 10, 64]} />
            <meshStandardMaterial color="#737e77" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {[-1.02, 1.02].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.075, 0.027, 12, 36]} />
          <meshStandardMaterial color="#d7ff58" metalness={0.55} roughness={0.24} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.074]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.067, 0.067, 0.8, 32]} />
        <meshStandardMaterial color="#171c1a" metalness={0.85} roughness={0.4} />
      </mesh>
      {Array.from({ length: 16 }, (_, index) => (
        <mesh key={index} position={[-0.38 + index * 0.05, 0, 0.079]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.071, 0.071, 0.012, 20]} />
          <meshStandardMaterial color={index % 2 === 0 ? '#88948c' : '#414b45'} metalness={0.8} roughness={0.29} />
        </mesh>
      ))}
    </group>
  );
}

export function FitnessScene({ paused = false }: { paused?: boolean }) {
  const reducedMotion = Boolean(useReducedMotion());
  const staticScene = paused || reducedMotion;

  return (
    <div className="fitness-scene" role="img" aria-label="Interactive three-dimensional barbell with dark steel plates and acid-lime detailing. Drag to rotate the view.">
      <Canvas
        dpr={[1, 1.3]}
        frameloop={staticScene ? 'demand' : 'always'}
        camera={{ position: [0, 0.15, 6.8], fov: 35, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={1.2} color="#dfe9e0" />
        <directionalLight position={[-3.5, 4.5, 5]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[4, 1.2, -3]} intensity={2} color="#d7ff58" />
        <pointLight position={[0, -2, 3]} intensity={0.8} color="#91a6a0" />
        {staticScene ? <group><BarbellModel /></group> : <Float speed={0.85} rotationIntensity={0.12} floatIntensity={0.17}><BarbellModel /></Float>}
        <OrbitControls makeDefault enablePan={false} enableZoom={false} enableDamping dampingFactor={0.08} autoRotate={!staticScene} autoRotateSpeed={0.52} />
      </Canvas>
      <span className="scene-orbit-note"><span aria-hidden="true">↔</span> DRAG TO ROTATE</span>
      <span className="scene-index">OBJECT STUDY / 001</span>
    </div>
  );
}
