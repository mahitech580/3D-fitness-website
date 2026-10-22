import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import type { Group } from 'three';
import '../styles/workout-arena.css';

export type MoveId = 'squat' | 'curl' | 'press' | 'jacks' | 'lunge' | 'hinge';
type StudioLaunchRequest = { moveId: MoveId; requestId: number };
type CameraMode = 'front' | 'side' | 'three-quarter';
type TrackingMode = 'manual' | 'follow-along';
type WorkoutHistoryEntry = {
  id: string;
  completedAt: string;
  moveId: MoveId;
  moveName: string;
  trackingMode: TrackingMode;
  setsCompleted: number;
  setsTarget?: number;
  totalReps: number;
  durationSeconds: number;
  tempo: number;
  loadKg?: number;
};

function readArenaHistory(): WorkoutHistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem('kinetik-arena-history') ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry: unknown): entry is WorkoutHistoryEntry => {
      if (!entry || typeof entry !== 'object') return false;
      const item = entry as Partial<WorkoutHistoryEntry>;
      return typeof item.id === 'string' && typeof item.completedAt === 'string'
        && typeof item.moveId === 'string' && typeof item.moveName === 'string'
        && (item.trackingMode === 'manual' || item.trackingMode === 'follow-along')
        && typeof item.setsCompleted === 'number' && typeof item.totalReps === 'number'
        && typeof item.durationSeconds === 'number' && typeof item.tempo === 'number'
        && (typeof item.loadKg === 'number' || typeof item.loadKg === 'undefined');
    }).slice(0, 5);
  } catch { return []; }
}

type MoveDefinition = {
  id: MoveId;
  name: string;
  focus: string;
  target: string;
  cue: string;
  prescription: string;
  tempo: string;
  targetReps: number;
};

const MOVES: MoveDefinition[] = [
  { id: 'squat', name: 'Bodyweight squat', focus: 'QUADS / GLUTES', target: 'LOWER BODY', cue: 'Keep the whole foot planted. Send the hips back, then stand tall without rushing.', prescription: '3 × 10–12', tempo: 'CONTROLLED DESCENT', targetReps: 10 },
  { id: 'curl', name: 'Dumbbell curl', focus: 'BICEPS / FOREARMS', target: 'ARMS', cue: 'Keep the elbows close to the ribs. Curl without swinging the torso.', prescription: '3 × 8–12', tempo: 'NO BODY SWING', targetReps: 10 },
  { id: 'press', name: 'Overhead press', focus: 'SHOULDERS / TRICEPS', target: 'UPPER BODY', cue: 'Brace the trunk and press overhead in a comfortable range. Do not force the lower back into an arch.', prescription: '3 × 8–10', tempo: 'RIBS STACKED', targetReps: 8 },
  { id: 'jacks', name: 'Jumping jack', focus: 'FULL BODY / CARDIO', target: 'CONDITIONING', cue: 'Move smoothly and land softly. Use a step-out version whenever that feels better.', prescription: '3 × 20 REPS', tempo: 'SOFT LANDING', targetReps: 20 },
  { id: 'lunge', name: 'Reverse lunge', focus: 'LEGS / BALANCE', target: 'LOWER BODY', cue: 'Step back to a stable stance and keep the front foot grounded. Use a range you can control.', prescription: '3 × 8 / SIDE', tempo: 'STABLE FOOTING', targetReps: 8 },
  { id: 'hinge', name: 'Hip hinge / RDL', focus: 'HAMSTRINGS / GLUTES', target: 'POSTERIOR CHAIN', cue: 'Push the hips back with soft knees, keep the spine long, and bring the weight close to the legs.', prescription: '3 × 8–10', tempo: 'HIPS BACK', targetReps: 10 },
];

function Dumbbell({
  position = [0, 0, 0] as [number, number, number],
  loadKg = 6,
}: {
  position?: [number, number, number];
  loadKg?: number;
}) {
  const plateScale = 0.75 + Math.min(14, Math.max(2, loadKg)) / 32;
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.25, 16]} />
        <meshStandardMaterial color="#b7c0ba" metalness={0.88} roughness={0.24} />
      </mesh>
      {[-0.13, 0.13].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.105 * plateScale, 0.105 * plateScale, 0.075 * plateScale, 24]} />
            <meshPhysicalMaterial color="#202724" metalness={0.62} roughness={0.25} clearcoat={0.45} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.04 : -0.04, 0, 0]}>
            <torusGeometry args={[0.075 * plateScale, 0.008 * plateScale, 8, 24]} />
            <meshStandardMaterial color="#d6ff3d" metalness={0.36} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Barbell({ loadKg }: { loadKg: number }) {
  const plateRadius = 0.29 + Math.min(14, Math.max(2, loadKg)) / 105;
  const plateThickness = 0.12 + Math.min(14, Math.max(2, loadKg)) / 110;
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 3.5, 24]} />
        <meshStandardMaterial color="#b9c4c0" metalness={0.92} roughness={0.18} />
      </mesh>
      {([-1.32, -1.12, 1.12, 1.32] as const).map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[plateRadius * (index % 2 ? 0.88 : 1), plateRadius * (index % 2 ? 0.88 : 1), plateThickness, 36]} />
            <meshPhysicalMaterial color={index % 2 ? "#22282a" : "#171b1d"} metalness={0.72} roughness={0.22} clearcoat={0.5} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[x < 0 ? -plateThickness * 0.52 : plateThickness * 0.52, 0, 0]}>
            <torusGeometry args={[plateRadius * 0.82, 0.012, 8, 36]} />
            <meshStandardMaterial color="#d6ff3d" metalness={0.46} roughness={0.25} emissive="#26320b" emissiveIntensity={0.35} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-1.53, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 20]} />
        <meshStandardMaterial color="#d6ff3d" metalness={0.42} roughness={0.28} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[1.53, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 20]} />
        <meshStandardMaterial color="#d6ff3d" metalness={0.42} roughness={0.28} />
      </mesh>
    </group>
  );
}

/** The 3D stage uses equipment and abstract geometry only—no character/avatar model. */
function EquipmentMotion({
  move,
  running,
  tempo,
  loadKg,
  onRep,
  reducedMotion,
}: {
  move: MoveId;
  running: boolean;
  tempo: number;
  loadKg: number;
  onRep: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<Group>(null);
  const barbell = useRef<Group>(null);
  const dumbbellLeft = useRef<Group>(null);
  const dumbbellRight = useRef<Group>(null);
  const orbitRing = useRef<Group>(null);
  const cycle = useRef(0);
  const lastRep = useRef(onRep);
  lastRep.current = onRep;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;

    if (running && !reducedMotion) {
      cycle.current += dt * (tempo / 60);
      while (cycle.current >= 1) {
        cycle.current -= 1;
        lastRep.current();
      }
    }

    const phase = cycle.current * Math.PI * 2;
    const motion = reducedMotion ? 0 : Math.sin(phase);
    const pageProgress = typeof window === 'undefined'
      ? 0
      : Math.max(0, Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
    if (root.current) {
      root.current.rotation.y = reducedMotion ? -0.16 : -0.16 + time * 0.13 + pageProgress * 0.48;
      root.current.position.x = reducedMotion ? 0 : Math.sin(pageProgress * Math.PI) * 0.18;
      root.current.position.y = 1.05 + (reducedMotion ? 0 : Math.sin(time * 0.78) * 0.045);
    }
    if (barbell.current) {
      const pressing = move === 'press' ? motion * 0.11 : 0;
      barbell.current.position.y = 0.02 + pressing + (reducedMotion ? 0 : Math.sin(time * 0.8) * 0.025);
      barbell.current.rotation.z = reducedMotion ? 0 : motion * (move === 'hinge' ? 0.045 : 0.075);
      barbell.current.rotation.x = reducedMotion ? 0 : Math.cos(time * 0.42) * 0.035;
    }
    if (dumbbellLeft.current) {
      dumbbellLeft.current.position.y = 0.58 + (reducedMotion ? 0 : Math.sin(time * 0.92 + 0.5) * 0.07 + (move === 'curl' ? motion * 0.12 : 0));
      dumbbellLeft.current.rotation.z = reducedMotion ? -0.06 : -0.06 + Math.sin(time * 0.58) * 0.08 + (move === 'curl' ? motion * 0.13 : 0);
      dumbbellLeft.current.rotation.x = reducedMotion ? 0.32 : 0.32 + time * 0.18;
    }
    if (dumbbellRight.current) {
      dumbbellRight.current.position.y = 0.58 + (reducedMotion ? 0 : Math.sin(time * 0.92 + 2.2) * 0.07 + (move === 'curl' ? -motion * 0.12 : 0));
      dumbbellRight.current.rotation.z = reducedMotion ? 0.06 : 0.06 + Math.sin(time * 0.58 + 1.6) * 0.08 - (move === 'curl' ? motion * 0.13 : 0);
      dumbbellRight.current.rotation.x = reducedMotion ? -0.32 : -0.32 - time * 0.18;
    }
    if (orbitRing.current && !reducedMotion) {
      orbitRing.current.rotation.z = time * 0.13 + pageProgress * 0.22;
      orbitRing.current.rotation.x = 0.32 + Math.sin(time * 0.22) * 0.05;
    }
  });

  return (
    <group ref={root} position={[0, 1.05, 0.15]}>
      <group ref={barbell} position={[0, 0.02, -0.35]}>
        <Barbell loadKg={loadKg} />
      </group>

      <group ref={dumbbellLeft} position={[-1.25, 0.58, 0.52]}>
        <Dumbbell loadKg={loadKg} />
      </group>
      <group ref={dumbbellRight} position={[1.25, 0.58, 0.52]} rotation={[0, Math.PI, 0]}>
        <Dumbbell loadKg={loadKg} />
      </group>

      <group ref={orbitRing} position={[0, 0.12, -0.7]}>
        <mesh>
          <torusGeometry args={[2.0, 0.012, 8, 128]} />
          <meshStandardMaterial color="#d6ff3d" emissive="#4b5c16" emissiveIntensity={0.55} metalness={0.3} roughness={0.28} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.79, 0.79, 0.79]}>
          <torusGeometry args={[1.6, 0.009, 8, 128]} />
          <meshStandardMaterial color="#7c8e80" metalness={0.62} roughness={0.3} transparent opacity={0.65} />
        </mesh>
      </group>

      <mesh position={[0, -0.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.48, 96]} />
        <meshBasicMaterial color="#d6ff3d" transparent opacity={0.64} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 2.05, -0.48, -0.35]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.27, 0.27, 0.16, 32]} />
            <meshPhysicalMaterial color="#202628" metalness={0.76} roughness={0.2} clearcoat={0.4} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[side * 0.09, 0, 0]}>
            <torusGeometry args={[0.2, 0.012, 8, 32]} />
            <meshStandardMaterial color="#d6ff3d" metalness={0.35} roughness={0.27} emissive="#24300c" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TrainingRoom({ move }: { move: MoveId }) {
  return (
    <>
      <color attach="background" args={['#111714']} />
      <fog attach="fog" args={['#111714', 8, 19]} />
      <ambientLight intensity={0.75} color="#dfe9e0" />
      <hemisphereLight args={['#e9f0eb', '#28342d', 1.05]} />
      <spotLight position={[-4, 7, 4]} intensity={70} angle={0.52} penumbra={0.72} color="#f5f7eb" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <spotLight position={[4, 4, -3]} intensity={35} angle={0.58} penumbra={0.8} color="#d7ff58" />
      <pointLight position={[0, 2.5, 4]} intensity={6} color="#91aaa0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow><planeGeometry args={[22, 22]} /><meshStandardMaterial color="#1a211d" roughness={0.9} /></mesh>
      <gridHelper args={[16, 32, '#46534a', '#28342d']} position={[0, -0.105, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]}><ringGeometry args={[1.4, 1.42, 96]} /><meshBasicMaterial color="#d7ff58" transparent opacity={0.62} /></mesh>
      <mesh position={[-1.6, 1.25, -1.7]}><boxGeometry args={[0.09, 2.5, 0.09]} /><meshStandardMaterial color="#4f5d53" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[1.6, 1.25, -1.7]}><boxGeometry args={[0.09, 2.5, 0.09]} /><meshStandardMaterial color="#4f5d53" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 2.45, -1.7]}><boxGeometry args={[3.3, 0.09, 0.09]} /><meshStandardMaterial color="#8e9b90" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 1.46, -1.7]}><boxGeometry args={[3.15, 0.055, 0.055]} /><meshStandardMaterial color="#8e9b90" metalness={0.8} roughness={0.3} /></mesh>
      {[-1.18, -0.94, 0.94, 1.18].map((x, index) => <mesh key={x} position={[x, 1.48, -1.7]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[index % 2 ? 0.29 : 0.35, index % 2 ? 0.29 : 0.35, 0.11, 32]} /><meshStandardMaterial color={index % 2 ? '#323a34' : '#242b26'} metalness={0.45} roughness={0.3} /></mesh>)}
      {move === 'curl' || move === 'press' || move === 'hinge' ? <group position={[2.05, 0.07, -0.45]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.36, 0.18, 0.34]} /><meshStandardMaterial color="#252e29" roughness={0.7} /></mesh>{[-0.2, 0.2].map((x) => <mesh key={x} position={[x, 0.2, 0]}><cylinderGeometry args={[0.06, 0.06, 0.12, 16]} /><meshStandardMaterial color="#d7ff58" metalness={0.4} /></mesh>)}</group> : null}
      <ContactShadows position={[0, -0.095, 0]} opacity={0.4} scale={9} blur={2.7} far={3.5} resolution={256} />
    </>
  );
}

function CameraDirector({ mode }: { mode: CameraMode }) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode === 'side') camera.position.set(4.8, 2.65, 0.8);
    else if (mode === 'front') camera.position.set(0, 2.5, 6.7);
    else camera.position.set(3.2, 2.85, 5.7);
    camera.lookAt(0, 1.1, 0);
    camera.updateProjectionMatrix();
  }, [camera, mode]);
  return <OrbitControls makeDefault target={[0, 1.05, 0]} enableDamping dampingFactor={0.075} minDistance={3.3} maxDistance={9.5} minPolarAngle={0.45} maxPolarAngle={1.48} />;
}

export function WorkoutArena({ launchRequest = null }: { launchRequest?: StudioLaunchRequest | null }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [moveId, setMoveId] = useState<MoveId>('squat');
  const [running, setRunning] = useState(false);
  const [tempo, setTempo] = useState(48);
  const [loadKg, setLoadKg] = useState(6);
  const [reps, setReps] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [setCount, setSetCount] = useState(3);
  const setCountRef = useRef(setCount);
  setCountRef.current = setCount;
  const [elapsed, setElapsed] = useState(0);
  const [restDuration, setRestDuration] = useState(60);
  const [restRemaining, setRestRemaining] = useState(0);
  const [resting, setResting] = useState(false);
  const [trackingMode, setTrackingMode] = useState<TrackingMode>('manual');
  const [sessionSaved, setSessionSaved] = useState(false);
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>(readArenaHistory);
  const [cameraMode, setCameraMode] = useState<CameraMode>('three-quarter');
  const [showCue, setShowCue] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const current = MOVES.find((move) => move.id === moveId) ?? MOVES[0];
  const targetRepsRef = useRef(current.targetReps);
  targetRepsRef.current = current.targetReps;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!resting) return;
    const timer = window.setInterval(() => setRestRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resting]);

  useEffect(() => {
    if (resting && restRemaining === 0) setResting(false);
  }, [resting, restRemaining]);

  useEffect(() => {
    try { window.localStorage.setItem('kinetik-arena-history', JSON.stringify(history)); }
    catch { /* Recent records remain available in memory when storage is unavailable. */ }
  }, [history]);

  useEffect(() => {
    if (setsCompleted < setCount || sessionSaved) return;
    const record: WorkoutHistoryEntry = {
      id: new Date().toISOString() + ':' + moveId,
      completedAt: new Date().toISOString(),
      moveId,
      moveName: current.name,
      trackingMode,
      setsCompleted,
      setsTarget: setCount,
      totalReps,
      durationSeconds: elapsed,
      tempo,
      loadKg: ['curl', 'press', 'hinge'].includes(moveId) ? loadKg : 0,
    };
    setHistory((records) => [record, ...records.filter((item) => item.id !== record.id)].slice(0, 5));
    setSessionSaved(true);
  }, [setsCompleted, setCount, sessionSaved, moveId, current.name, trackingMode, totalReps, elapsed, tempo, loadKg]);

  const currentRepRef = useRef(0);

  useEffect(() => {
    if (!launchRequest) return;
    setMoveId(launchRequest.moveId);
    currentRepRef.current = 0;
    setRunning(false);
    setReps(0);
    setTotalReps(0);
    setSetsCompleted(0);
    setElapsed(0);
    setResting(false);
    setRestRemaining(0);
    setSessionSaved(false);
  }, [launchRequest]);
  const registerRep = useCallback((source: TrackingMode) => {
    if (source !== trackingMode || (source === 'manual' && !running)) return;
    const next = currentRepRef.current + 1;
    currentRepRef.current = next;
    setTotalReps((value) => value + 1);
    if (next >= targetRepsRef.current) {
      setRunning(false);
      setSetsCompleted((completed) => Math.min(setCountRef.current, completed + 1));
      setReps(targetRepsRef.current);
    } else {
      setReps(next);
    }
  }, [trackingMode, running]);

  const countRep = useCallback(() => registerRep('follow-along'), [registerRep]);

  function logCompletedRep() {
    if (trackingMode !== 'manual') return;
    if (!running) return;
    registerRep('manual');
  }

  function changeTrackingMode(nextMode: TrackingMode) {
    setTrackingMode(nextMode);
    resetSession();
  }

  function selectMove(id: MoveId) {
    setMoveId(id);
    currentRepRef.current = 0;
    setReps(0);
    setTotalReps(0);
    setSetsCompleted(0);
    setRunning(false);
    setElapsed(0);
    setResting(false);
    setRestRemaining(0);
    setSessionSaved(false);
  }

  function resetSession() {
    setRunning(false);
    currentRepRef.current = 0;
    setReps(0);
    setTotalReps(0);
    setSetsCompleted(0);
    setElapsed(0);
    setResting(false);
    setRestRemaining(0);
    setSessionSaved(false);
  }

  function startNextSet() {
    if (setsCompleted >= setCount) return;
    currentRepRef.current = 0;
    setReps(0);
    setResting(false);
    setRestRemaining(0);
    setRunning(true);
  }

  function startRest() {
    setRunning(false);
    setRestRemaining(restDuration);
    setResting(restDuration > 0);
  }

  function skipRest() {
    setResting(false);
    setRestRemaining(0);
  }

  const clock = String(Math.floor(elapsed / 60)).padStart(2, '0') + ':' + String(elapsed % 60).padStart(2, '0');

  return (
    <section id="arena" className="workout-arena-section" aria-labelledby="arena-title">
      <div className="arena-section-head">
        <div><p className="arena-kicker"><span>01</span> KINETIK / MOTION LAB</p><h2 id="arena-title">Equipment.<br /><em>In motion.</em></h2></div>
        <p>Explore a cinematic equipment-only 3D scene, change camera angles, choose a movement tempo, and manage your sets and rest. The motion study uses procedurally modelled weights and geometry—no 3D people, camera tracking, or automated form assessment.</p>
      </div>
      <div className="arena-workspace">
        <div className="arena-stage">
          <div className="arena-stage-top"><span><i className={running ? 'arena-live-dot is-running' : 'arena-live-dot'} />{running ? 'MOTION RUNNING' : 'READY TO MOVE'}</span><span>3D EQUIPMENT / ORBIT VIEW</span></div>
          <div className="arena-canvas">
            <Canvas shadows dpr={[1, 1.4]} camera={{ position: [3.2, 2.85, 5.7], fov: 38, near: 0.1, far: 60 }} gl={{ antialias: true, powerPreference: 'low-power' }} onCreated={() => setSceneReady(true)} fallback={<div className="arena-webgl-fallback">3D graphics are unavailable here. The movement instructions and session controls remain available below.</div>}>
              <TrainingRoom move={moveId} />
              <EquipmentMotion key={moveId} move={moveId} running={running && !reducedMotion} tempo={tempo} loadKg={loadKg} onRep={countRep} reducedMotion={reducedMotion} />
              <CameraDirector mode={cameraMode} />
            </Canvas>
          </div>
          <div className="arena-stage-bottom"><span>{sceneReady ? 'SCENE READY' : 'LOADING SCENE'}</span><span>DRAG TO ORBIT · SCROLL TO ZOOM</span><span>OBJECT / {String(MOVES.findIndex((move) => move.id === moveId) + 1).padStart(2, '0')}</span></div>
          <div className="arena-camera-controls" role="group" aria-label="3D camera position">
            <span>CAMERA</span>
            {([{ id: 'front', label: 'FRONT' }, { id: 'three-quarter', label: '3/4 VIEW' }, { id: 'side', label: 'SIDE' }] as const).map((camera) => <button type="button" key={camera.id} className={cameraMode === camera.id ? 'is-active' : ''} aria-pressed={cameraMode === camera.id} onClick={() => setCameraMode(camera.id)}>{camera.label}</button>)}
            <button type="button" onClick={() => setShowCue((value) => !value)} aria-pressed={showCue}>{showCue ? 'HIDE FORM CUE' : 'SHOW FORM CUE'}</button>
          </div>
        </div>
        <aside className="arena-console" aria-label="Workout controls">
          <div className="arena-console-head"><span>SESSION / LIVE</span><span>{current.target}</span></div>
          <h3>{current.name}</h3>
          <p className="arena-muscle-line">{current.focus}</p>
          <div className="arena-stats">
            <div><span>{trackingMode === 'manual' ? 'YOUR REPS / SET' : 'DEMO CYCLES / SET'}</span><strong>{String(reps).padStart(2, '0')}<small>/{current.targetReps}</small></strong></div>
            <div><span>SETS</span><strong>{setsCompleted}<small>/{setCount}</small></strong></div>
            <div><span>ELAPSED</span><strong>{clock}</strong></div>
          </div>
          <div className="arena-rep-progress" role="progressbar" aria-label="Repetitions completed in current set" aria-valuemin={0} aria-valuemax={current.targetReps} aria-valuenow={reps}><span style={{ width: (reps / current.targetReps * 100) + '%' }} /></div>
          <div className="arena-tempo-control"><label htmlFor="arena-tempo">3D DEMONSTRATION TEMPO</label><input id="arena-tempo" type="range" min={24} max={72} step={4} value={tempo} onChange={(event) => setTempo(Number(event.target.value))} /><div><span>SLOW / CONTROLLED</span><strong>{tempo} DEMO CYCLES / MIN</strong></div></div>
          <div className="arena-load-control">
            <label htmlFor="arena-dumbbell-load">DUMBBELL LOAD / HAND</label>
            <select id="arena-dumbbell-load" value={loadKg} disabled={!(['curl', 'press', 'hinge'] as MoveId[]).includes(moveId)} onChange={(event) => setLoadKg(Number(event.target.value))}>
              {[2, 4, 6, 8, 10, 12, 14].map((value) => <option key={value} value={value}>{value} KG</option>)}
            </select>
            <span>{(['curl', 'press', 'hinge'] as MoveId[]).includes(moveId) ? 'Changes the procedural dumbbell plate size and is recorded with the session.' : 'This movement is demonstrated as bodyweight; load control is disabled.'}</span>
          </div>
          <label className="arena-set-count-control" htmlFor="arena-set-count"><span>SETS PER MOVEMENT</span><select id="arena-set-count" value={setCount} onChange={(event) => { setSetCount(Number(event.target.value)); resetSession(); }}><option value={2}>2 SETS</option><option value={3}>3 SETS</option><option value={4}>4 SETS</option><option value={5}>5 SETS</option></select></label>
          <div className="arena-tracking-mode">
            <div className="arena-tracking-heading"><span>REP TRACKING MODE</span><span>{trackingMode === 'manual' ? 'YOU CONTROL THE COUNT' : '3D DEMO AUTO-COUNT'}</span></div>
            <div className="arena-tracking-options" role="group" aria-label="Repetition tracking mode">
              <button type="button" className={trackingMode === 'manual' ? 'is-active' : ''} aria-pressed={trackingMode === 'manual'} onClick={() => changeTrackingMode('manual')}>TRAIN / LOG MY REPS</button>
              <button type="button" className={trackingMode === 'follow-along' ? 'is-active' : ''} aria-pressed={trackingMode === 'follow-along'} disabled={reducedMotion} onClick={() => changeTrackingMode('follow-along')}>FOLLOW ALONG / AUTO</button>
            </div>
            <p>{trackingMode === 'manual' ? 'Train in the real world and tap LOG REP after each rep you complete. This app does not track your body.' : 'Each complete equipment animation cycle counts as a demo cycle, not a physical repetition. Switch to manual mode to record your own reps.'}</p>
          </div>
          <div className="arena-session-buttons">
            <button className="arena-primary-control" type="button" disabled={(!running && setsCompleted >= setCount) || resting} onClick={() => {
              if (running) setRunning(false);
              else if (reps >= current.targetReps) startNextSet();
              else { skipRest(); setRunning(true); }
            }}>{setsCompleted >= setCount ? 'SET TARGET COMPLETE' : running ? 'PAUSE SESSION' : reps >= current.targetReps ? 'START NEXT SET ' + (setsCompleted + 1) : elapsed > 0 ? 'RESUME SESSION' : 'START SESSION'} <span aria-hidden="true">{running ? 'Ⅱ' : setsCompleted >= setCount ? '✓' : reps >= current.targetReps ? '↗' : '▶'}</span></button>
            <button className="arena-secondary-control" type="button" onClick={resetSession}>RESET <span aria-hidden="true">↺</span></button>
          </div>
          <button className="arena-log-rep" type="button" disabled={trackingMode !== 'manual' || !running || reps >= current.targetReps} onClick={logCompletedRep}>
            {trackingMode === 'manual' ? reps >= current.targetReps ? 'SET TARGET REACHED' : 'LOG ONE COMPLETED REP' : 'AUTO-COUNTING OBJECT CYCLES'}
            <span aria-hidden="true">{trackingMode === 'manual' ? '+1' : '↻'}</span>
          </button>
          <div className="arena-rest-panel">
            <div className="arena-rest-readout"><span>REST TIMER</span><strong>{String(Math.floor(restRemaining / 60)).padStart(2, '0') + ':' + String(restRemaining % 60).padStart(2, '0')}</strong></div>
            <label htmlFor="arena-rest-duration">REST LENGTH<select id="arena-rest-duration" value={restDuration} onChange={(event) => setRestDuration(Number(event.target.value))}><option value={30}>30 SEC</option><option value={45}>45 SEC</option><option value={60}>60 SEC</option><option value={90}>90 SEC</option></select></label>
            <button type="button" onClick={startRest} disabled={resting || setsCompleted >= setCount}>START REST</button>
            {resting && <button type="button" onClick={skipRest}>SKIP REST</button>}
          </div>
          <p className="arena-session-state" role="status">{resting ? 'Rest timer is running. Your active-work timer and demonstration are paused.' : reducedMotion && running ? 'Reduced motion is enabled. The scene stays still, but you can continue the timer and log each rep manually.' : setsCompleted >= setCount ? (sessionSaved ? 'SET TARGET COMPLETE. SESSION SAVED IN THIS BROWSER.' : 'SET TARGET COMPLETE. FINISHING YOUR LOCAL SESSION RECORD…') : reps >= current.targetReps ? 'SET COMPLETE. Recover as needed, then start the next set or run a timed rest.' : running && trackingMode === 'manual' ? 'Training timer is running. Tap LOG ONE COMPLETED REP after you perform each rep yourself.' : running ? 'Follow-along is running. Each complete equipment animation cycle counts as a demo cycle, not a body-tracked rep.' : totalReps > 0 ? totalReps + ' TOTAL ' + (trackingMode === 'manual' ? 'REPS LOGGED' : 'DEMO CYCLES') + '. Resume this set when ready.' : 'Paused. Choose your tracking mode, then start the session.'}</p>
          <div className={showCue ? 'arena-form-card is-visible' : 'arena-form-card'} aria-live="polite">
            <div><span>MOVEMENT GUIDE</span><span>{current.prescription.replace(/^3 ×/, String(setCount) + ' ×')}</span></div>
            <h4>{current.tempo}</h4>
            <p>{current.cue}</p>
          </div>
          <div className="arena-movement-picker"><div className="arena-picker-head"><span>CHOOSE MOVEMENT</span><span>06 PATTERNS</span></div>{MOVES.map((move, index) => <button key={move.id} type="button" className={move.id === moveId ? 'is-active' : ''} aria-pressed={move.id === moveId} onClick={() => selectMove(move.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{move.name}</strong><small>{move.focus}</small><i aria-hidden="true">{move.id === moveId ? '●' : '↗'}</i></button>)}</div>
        </aside>
      </div>
      <div className="arena-history">
        <div className="arena-history-head"><div><p className="arena-kicker"><span>LOG</span> LOCAL TRAINING HISTORY</p><h3>Work completed.</h3></div><span>{history.length} / 5 SAVED SESSIONS</span></div>
        {history.length ? <div className="arena-history-list">{history.map((record) => <article key={record.id}><div><strong>{record.moveName}</strong><small>{new Date(record.completedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {record.trackingMode === 'manual' ? 'Manual rep log' : '3D demo cycles'} · {record.setsCompleted}/{record.setsTarget ?? 3} sets · {record.totalReps} counts{record.loadKg === undefined ? '' : record.loadKg ? ' · ' + record.loadKg + ' kg / hand' : ' · bodyweight'}</small></div><span>{String(Math.floor(record.durationSeconds / 60)).padStart(2, '0') + ':' + String(record.durationSeconds % 60).padStart(2, '0')}</span></article>)}</div> : <p className="arena-history-empty">Complete the selected number of sets to save your first session. Records stay in this browser; demo cycles and manually logged reps are labeled separately.</p>}
      </div>
    </section>
  );
}
