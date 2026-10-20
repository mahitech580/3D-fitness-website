import { Component, Suspense, lazy, useEffect, useState, type ReactNode, type RefObject } from 'react';
import { LoadingFallback } from './LoadingFallback';

const AsyncDragonScene = lazy(() =>
  import('./DragonScene').then((module) => ({ default: module.DragonScene })),
);

class SceneChunkBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error('The 3D scene chunk could not be loaded:', error.message);
  }

  render() {
    return this.state.failed ? <div className="dragon-scene" aria-hidden="true"><LoadingFallback /></div> : this.props.children;
  }
}

type DeferredDragonSceneProps = {
  eventSource: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
};

export function DeferredDragonScene({ eventSource, reducedMotion = false }: DeferredDragonSceneProps) {
  const [readyToLoad, setReadyToLoad] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const beginLoading = () => {
      if (!cancelled) setReadyToLoad(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(beginLoading, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(beginLoading, 140);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  const fallback = <div className="dragon-scene" aria-hidden="true"><LoadingFallback /></div>;

  return (
    <SceneChunkBoundary>
      {readyToLoad ? (
        <Suspense fallback={fallback}>
          <AsyncDragonScene eventSource={eventSource} reducedMotion={reducedMotion} />
        </Suspense>
      ) : fallback}
    </SceneChunkBoundary>
  );
}
