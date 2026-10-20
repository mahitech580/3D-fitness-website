import { Component, useEffect, type ReactNode, type RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Canvas, useThree } from '@react-three/fiber';
import { PorcelainDragon } from './PorcelainDragon';
import { LoadingFallback } from './LoadingFallback';

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error('The porcelain scene could not be rendered:', error.message);
  }

  render() {
    return this.state.failed ? <LoadingFallback /> : this.props.children;
  }
}

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.position.z = size.width < 620 ? 12.4 : size.width < 960 ? 10.8 : 9.5;
    camera.lookAt(0, -0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

export function DragonScene({ eventSource, reducedMotion = false }: { eventSource: RefObject<HTMLElement>; reducedMotion?: boolean }) {
  const systemPrefersReducedMotion = useReducedMotion();
  const pauseAnimation = reducedMotion || Boolean(systemPrefersReducedMotion);

  return (
    <div className="dragon-scene" aria-hidden="true">
      <SceneErrorBoundary>
        <Canvas
          dpr={[1, 1.35]}
          frameloop={pauseAnimation ? 'demand' : 'always'}
          camera={{ position: [0, 0, 9.5], fov: 36, near: 0.1, far: 80 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
          eventSource={eventSource}
          eventPrefix="client"
          fallback={<LoadingFallback />}
        >
          <ResponsiveCamera />
          <ambientLight intensity={1.5} color="#f7f4eb" />
          <directionalLight position={[-3.5, 5.5, 6]} intensity={2.3} color="#ffffff" />
          <directionalLight position={[4, 1.5, -3]} intensity={1.25} color="#b5c9ed" />
          <pointLight position={[-2.5, -1.5, 4]} intensity={0.7} color="#d9e6ff" />
          <PorcelainDragon />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
