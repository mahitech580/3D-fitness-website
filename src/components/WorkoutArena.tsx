import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import type { Group } from 'three';
import '../styles/workout-arena.css';

export type MoveId = 'squat' | 'curl' | 'press' | 'jacks' | 'lunge' | 'hinge';
type CameraMode = 'front' | 'side' | 'three-quarter';
type TrackingMode = 'manual' | 'follow-along';
type WorkoutHistoryEntry = {
  id: string;
  completedAt: string;
  moveId: MoveId;
  moveName: string;
  trackingMode: TrackingMode;
  setsCompleted: number;
  totalReps: number;
  durationSeconds: number;
  tempo: number;
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
        && typeof item.durationSeconds === 'number' && typeof item.tempo === 'number';
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
  { id: 'jacks', name: 'Jumping jack', focus: 'FULL BODY / CARDIO', target: 'CONDITIONING', cue: 'Move smoothly and land softly. Use a step-out version whenever that feels better.', prescription: '3 × 30 SEC', tempo: 'SOFT LANDING', targetReps: 20 },
  { id: 'lunge', name: 'Reverse lunge', focus: 'LEGS / BALANCE', target: 'LOWER BODY', cue: 'Step back to a stable stance and keep the front foot grounded. Use a range you can control.', prescription: '3 × 8 / SIDE', tempo: 'STABLE FOOTING', targetReps: 8 },
  { id: 'hinge', name: 'Hip hinge / RDL', focus: 'HAMSTRINGS / GLUTES', target: 'POSTERIOR CHAIN', cue: 'Push the hips back with soft knees, keep the spine long, and bring the weight close to the legs.', prescription: '3 × 8–10', tempo: 'HIPS BACK', targetReps: 10 },
];

function Joint({ position, color = '#c7a18b', radius = 0.085 }: { position: [number, number, number]; color?: string; radius?: number }) {
  return <mesh position={position} castShadow><sphereGeometry args={[radius, 20, 16]} /><meshStandardMaterial color={color} roughness={0.43} metalness={0.02} /></mesh>;
}

function Dumbbell({ position = [0, 0, 0] as [number, number, number] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.25, 16]} /><meshStandardMaterial color="#b7c0ba" metalness={0.88} roughness={0.24} /></mesh>
      {[-0.13, 0.13].map((x) => <group key={x} position={[x, 0, 0]}><mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.105, 0.105, 0.075, 24]} /><meshPhysicalMaterial color="#202724" metalness={0.62} roughness={0.25} clearcoat={0.45} /></mesh><mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.04 : -0.04, 0, 0]}><torusGeometry args={[0.075, 0.008, 8, 24]} /><meshStandardMaterial color="#d7ff58" metalness={0.36} roughness={0.3} /></mesh></group>)}
    </group>
  );
}

export function Athlete({ move, running, tempo, onRep }: { move: MoveId; running: boolean; tempo: number; onRep: () => void }) {
  const root = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const leftShoulder = useRef<Group>(null);
  const rightShoulder = useRef<Group>(null);
  const leftElbow = useRef<Group>(null);
  const rightElbow = useRef<Group>(null);
  const leftHip = useRef<Group>(null);
  const rightHip = useRef<Group>(null);
  const leftKnee = useRef<Group>(null);
  const rightKnee = useRef<Group>(null);
  const cycle = useRef(0);
  const lastRep = useRef(onRep);
  lastRep.current = onRep;

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.05);
    if (running) {
      cycle.current += safeDelta * (tempo / 60);
      while (cycle.current >= 1) {
        cycle.current -= 1;
        lastRep.current();
      }
    }
    const phase = cycle.current;
    const effort = (1 - Math.cos(phase * Math.PI * 2)) / 2;
    const breath = Math.sin(state.clock.elapsedTime * 2.1) * 0.014;
    const lungeSide = Math.sin(phase * Math.PI * 2);
    const squat = move === 'squat' ? effort : 0;
    const curl = move === 'curl' ? effort : 0;
    const press = move === 'press' ? effort : 0;
    const jacks = move === 'jacks' ? effort : 0;
    const lunge = move === 'lunge' ? effort : 0;
    const hinge = move === 'hinge' ? effort : 0;

    if (root.current) root.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * (running ? 0.01 : 0.006) + (jacks ? Math.max(0, Math.sin(phase * Math.PI * 2)) * 0.11 : 0);
    if (torso.current) {
      torso.current.rotation.x = hinge * 0.66 + squat * 0.16 + Math.sin(state.clock.elapsedTime * 1.5) * 0.012;
      torso.current.position.y = breath - squat * 0.06 - lunge * 0.05 - hinge * 0.035;
      torso.current.rotation.z = lunge * lungeSide * 0.035;
    }

    const leftLeg = leftHip.current; const rightLeg = rightHip.current;
    if (leftLeg) { leftLeg.rotation.x = -squat * 0.35 - hinge * 0.12 - lunge * (0.2 + Math.max(0, lungeSide) * 0.34); leftLeg.rotation.z = -jacks * 0.34 - lunge * 0.08; }
    if (rightLeg) { rightLeg.rotation.x = -squat * 0.35 - hinge * 0.12 - lunge * (0.2 + Math.max(0, -lungeSide) * 0.34); rightLeg.rotation.z = jacks * 0.34 + lunge * 0.08; }
    if (leftKnee.current) leftKnee.current.rotation.x = squat * 1.08 + hinge * 0.22 + lunge * (0.68 + Math.max(0, lungeSide) * 0.26) - jacks * 0.12;
    if (rightKnee.current) rightKnee.current.rotation.x = squat * 1.08 + hinge * 0.22 + lunge * (0.68 + Math.max(0, -lungeSide) * 0.26) - jacks * 0.12;

    const leftArm = leftShoulder.current; const rightArm = rightShoulder.current;
    if (leftArm) {
      leftArm.rotation.z = -0.12 - jacks * 2.45 - press * 2.25 + hinge * 0.18;
      leftArm.rotation.x = hinge * -0.25;
    }
    if (rightArm) {
      rightArm.rotation.z = 0.12 + jacks * 2.45 + press * 2.25 - hinge * 0.18;
      rightArm.rotation.x = hinge * -0.25;
    }
    if (leftElbow.current) leftElbow.current.rotation.x = -curl * 1.9 - press * 0.08 + jacks * 0.08;
    if (rightElbow.current) rightElbow.current.rotation.x = -curl * 1.9 - press * 0.08 + jacks * 0.08;
  });

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* Feet, articulated legs and hips */}
      <mesh position={[0, 1.01, 0]} castShadow><capsuleGeometry args={[0.19, 0.21, 5, 16]} /><meshStandardMaterial color="#252d29" roughness={0.78} /></mesh>
      {([-1, 1] as const).map((side) => (
        <group key={side} ref={side < 0 ? leftHip : rightHip} position={[side * 0.14, 0.98, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow><capsuleGeometry args={[0.105, 0.39, 5, 12]} /><meshStandardMaterial color="#27322c" roughness={0.62} /></mesh>
          <mesh position={[0, -0.51, 0]} castShadow><sphereGeometry args={[0.09, 18, 14]} /><meshStandardMaterial color="#303b33" roughness={0.67} /></mesh>
          <group ref={side < 0 ? leftKnee : rightKnee} position={[0, -0.51, 0]}>
            <mesh position={[0, -0.245, 0]} castShadow><capsuleGeometry args={[0.078, 0.37, 5, 12]} /><meshStandardMaterial color="#27322c" roughness={0.62} /></mesh>
            <mesh position={[0, -0.49, 0]}><sphereGeometry args={[0.065, 16, 12]} /><meshStandardMaterial color="#343e36" roughness={0.65} /></mesh>
            <mesh position={[0, -0.515, 0.09]} castShadow><boxGeometry args={[0.17, 0.105, 0.29]} /><meshStandardMaterial color="#121715" roughness={0.47} /></mesh>
            <mesh position={[0, -0.462, 0.16]}><boxGeometry args={[0.105, 0.012, 0.04]} /><meshStandardMaterial color="#d7ff58" emissive="#35430d" emissiveIntensity={0.12} /></mesh>
          </group>
        </group>
      ))}

      {/* Torso has a pivot so hinges and braced movement read clearly */}
      <group ref={torso} position={[0, 1.12, 0]}>
        <mesh position={[0, 0.28, 0]} rotation={[0, 0, 0]} castShadow><capsuleGeometry args={[0.255, 0.44, 8, 20]} /><meshPhysicalMaterial color="#333f38" roughness={0.5} metalness={0.06} clearcoat={0.18} /></mesh>
        <mesh position={[0, 0.46, 0.018]} castShadow><boxGeometry args={[0.28, 0.11, 0.14]} /><meshStandardMaterial color="#d7ff58" roughness={0.55} /></mesh>
        <mesh position={[0, 0.31, 0.16]} scale={[0.76, 0.42, 0.22]}><sphereGeometry args={[0.21, 24, 18]} /><meshStandardMaterial color="#435147" roughness={0.58} /></mesh>
        {[-1, 1].map((side) => <mesh key={side} position={[side * 0.12, 0.02, 0.242]} rotation={[0, 0, side * -0.08]}><boxGeometry args={[0.014, 0.12, 0.008]} /><meshStandardMaterial color="#111714" roughness={0.8} /></mesh>)}
        <mesh position={[0, 0.08, 0.02]}><torusGeometry args={[0.23, 0.014, 8, 32]} /><meshStandardMaterial color="#65776b" metalness={0.55} roughness={0.34} /></mesh>
        <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.075, 0.095, 0.16, 20]} /><meshStandardMaterial color="#c7a18b" roughness={0.68} /></mesh>
        <group position={[0, 0.83, 0.012]}>
          <mesh castShadow><sphereGeometry args={[0.165, 28, 22]} /><meshStandardMaterial color="#c7a18b" roughness={0.58} /></mesh>
          <mesh position={[0, 0.105, -0.018]}><sphereGeometry args={[0.155, 24, 16]} /><meshStandardMaterial color="#171b19" roughness={0.8} /></mesh>
          {[-1, 1].map((side) => <mesh key={'ear-' + side} position={[side * 0.16, 0, 0]}><sphereGeometry args={[0.035, 14, 12]} /><meshStandardMaterial color="#b98e78" roughness={0.56} /></mesh>)}
          <mesh position={[0, -0.015, 0.151]}><boxGeometry args={[0.13, 0.07, 0.045]} /><meshStandardMaterial color="#9c7261" roughness={0.58} /></mesh>
          {[-1, 1].map((side) => <group key={'eye-' + side} position={[side * 0.062, 0.034, 0.151]}><mesh><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color="#f0e7d8" roughness={0.42} /></mesh><mesh position={[0, 0, 0.021]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#17201a" roughness={0.25} /></mesh><mesh position={[0, 0.03, -0.002]} rotation={[0, 0, side * -0.12]}><boxGeometry args={[0.055, 0.012, 0.012]} /><meshStandardMaterial color="#30241f" roughness={0.8} /></mesh></group>)}
        </group>

        {([-1, 1] as const).map((side) => (
          <group key={side} ref={side < 0 ? leftShoulder : rightShoulder} position={[side * 0.285, 0.52, 0]}>
            <Joint position={[0, 0, 0]} radius={0.105} color="#c7a18b" />
            <mesh position={[side * 0.045, -0.13, 0]} scale={[0.98, 1.02, 0.92]}><sphereGeometry args={[0.105, 18, 14]} /><meshStandardMaterial color="#c7a18b" roughness={0.52} /></mesh>
            <mesh position={[side * 0.015, -0.2, 0]} castShadow><capsuleGeometry args={[0.082, 0.27, 5, 12]} /><meshStandardMaterial color="#c7a18b" roughness={0.5} /></mesh>
            <group ref={side < 0 ? leftElbow : rightElbow} position={[side * 0.015, -0.37, 0]}>
              <Joint position={[0, 0, 0]} radius={0.072} />
              <mesh position={[0, -0.19, 0]} castShadow><capsuleGeometry args={[0.065, 0.28, 5, 12]} /><meshStandardMaterial color="#c7a18b" roughness={0.5} /></mesh>
              <Joint position={[0, -0.37, 0]} radius={0.065} />
              <mesh position={[0, -0.43, 0.015]} castShadow><sphereGeometry args={[0.082, 16, 12]} /><meshStandardMaterial color="#c7a18b" roughness={0.56} /></mesh>
              {(move === 'curl' || move === 'press' || move === 'hinge' || move === 'lunge') && <Dumbbell position={[0, -0.49, 0.015]} />}
            </group>
          </group>
        ))}
      </group>
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
      {move === 'curl' || move === 'press' ? <group position={[2.05, 0.07, -0.45]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.36, 0.18, 0.34]} /><meshStandardMaterial color="#252e29" roughness={0.7} /></mesh>{[-0.2, 0.2].map((x) => <mesh key={x} position={[x, 0.2, 0]}><cylinderGeometry args={[0.06, 0.06, 0.12, 16]} /><meshStandardMaterial color="#d7ff58" metalness={0.4} /></mesh>)}</group> : null}
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

export function WorkoutArena() {
  const reducedMotion = Boolean(useReducedMotion());
  const [moveId, setMoveId] = useState<MoveId>('squat');
  const [running, setRunning] = useState(false);
  const [tempo, setTempo] = useState(48);
  const [reps, setReps] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
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
    if (setsCompleted < 3 || sessionSaved) return;
    const record: WorkoutHistoryEntry = {
      id: new Date().toISOString() + ':' + moveId,
      completedAt: new Date().toISOString(),
      moveId,
      moveName: current.name,
      trackingMode,
      setsCompleted,
      totalReps,
      durationSeconds: elapsed,
      tempo,
    };
    setHistory((records) => [record, ...records.filter((item) => item.id !== record.id)].slice(0, 5));
    setSessionSaved(true);
  }, [setsCompleted, sessionSaved, moveId, current.name, trackingMode, totalReps, elapsed, tempo]);

  const currentRepRef = useRef(0);
  const registerRep = useCallback((source: TrackingMode) => {
    if (source !== trackingMode || (source === 'manual' && !running)) return;
    const next = currentRepRef.current + 1;
    currentRepRef.current = next;
    setTotalReps((value) => value + 1);
    if (next >= targetRepsRef.current) {
      setRunning(false);
      setSetsCompleted((completed) => Math.min(3, completed + 1));
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
    if (setsCompleted >= 3) return;
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
        <div><p className="arena-kicker"><span>01</span> KINETIK / MOTION LAB</p><h2 id="arena-title">Your form.<br /><em>In three dimensions.</em></h2></div>
        <p>Step into the training floor. Choose a movement, rotate around the athlete, start a live rep cycle and follow the form cues. This is a procedural 3D demonstration—not a camera recording or a clinical form assessment.</p>
      </div>
      <div className="arena-workspace">
        <div className="arena-stage">
          <div className="arena-stage-top"><span><i className={running ? 'arena-live-dot is-running' : 'arena-live-dot'} />{running ? 'MOTION RUNNING' : 'READY TO MOVE'}</span><span>INTERACTIVE 3D / ORBIT VIEW</span></div>
          <div className="arena-canvas">
            <Canvas shadows dpr={[1, 1.4]} camera={{ position: [3.2, 2.85, 5.7], fov: 38, near: 0.1, far: 60 }} gl={{ antialias: true, powerPreference: 'low-power' }} onCreated={() => setSceneReady(true)} fallback={<div className="arena-webgl-fallback">3D graphics are unavailable here. The movement instructions and session controls remain available below.</div>}>
              <TrainingRoom move={moveId} />
              <Athlete key={moveId} move={moveId} running={running && !reducedMotion} tempo={tempo} onRep={countRep} />
              <CameraDirector mode={cameraMode} />
            </Canvas>
          </div>
          <div className="arena-stage-bottom"><span>{sceneReady ? 'SCENE READY' : 'LOADING SCENE'}</span><span>DRAG TO ORBIT · SCROLL TO ZOOM</span><span>FORM / {String(MOVES.findIndex((move) => move.id === moveId) + 1).padStart(2, '0')}</span></div>
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
            <div><span>SETS</span><strong>{setsCompleted}<small>/3</small></strong></div>
            <div><span>ELAPSED</span><strong>{clock}</strong></div>
          </div>
          <div className="arena-rep-progress" role="progressbar" aria-label="Repetitions completed in current set" aria-valuemin={0} aria-valuemax={current.targetReps} aria-valuenow={reps}><span style={{ width: (reps / current.targetReps * 100) + '%' }} /></div>
          <div className="arena-tempo-control"><label htmlFor="arena-tempo">MOVEMENT TEMPO</label><input id="arena-tempo" type="range" min={24} max={72} step={4} value={tempo} onChange={(event) => setTempo(Number(event.target.value))} /><div><span>SLOW / CONTROLLED</span><strong>{tempo} REPS / MIN TARGET</strong></div></div>
          <div className="arena-tracking-mode">
            <div className="arena-tracking-heading"><span>REP TRACKING MODE</span><span>{trackingMode === 'manual' ? 'YOU CONTROL THE COUNT' : '3D DEMO AUTO-COUNT'}</span></div>
            <div className="arena-tracking-options" role="group" aria-label="Repetition tracking mode">
              <button type="button" className={trackingMode === 'manual' ? 'is-active' : ''} aria-pressed={trackingMode === 'manual'} onClick={() => changeTrackingMode('manual')}>TRAIN / LOG MY REPS</button>
              <button type="button" className={trackingMode === 'follow-along' ? 'is-active' : ''} aria-pressed={trackingMode === 'follow-along'} disabled={reducedMotion} onClick={() => changeTrackingMode('follow-along')}>FOLLOW ALONG / AUTO</button>
            </div>
            <p>{trackingMode === 'manual' ? 'Train in the real world and tap LOG REP after each rep you complete. This app does not track your body.' : 'Each complete avatar cycle counts as a demo cycle, not a physical repetition. Switch to manual mode to record your own reps.'}</p>
          </div>
          <div className="arena-session-buttons">
            <button className="arena-primary-control" type="button" disabled={!running && setsCompleted >= 3} onClick={() => {
              if (running) setRunning(false);
              else if (reps >= current.targetReps) startNextSet();
              else { skipRest(); setRunning(true); }
            }}>{setsCompleted >= 3 ? 'TARGET COMPLETE' : running ? 'PAUSE SESSION' : reps >= current.targetReps ? 'START NEXT SET ' + (setsCompleted + 1) : elapsed > 0 ? 'RESUME SESSION' : 'START SESSION'} <span aria-hidden="true">{running ? 'Ⅱ' : setsCompleted >= 3 ? '✓' : reps >= current.targetReps ? '↗' : '▶'}</span></button>
            <button className="arena-secondary-control" type="button" onClick={resetSession}>RESET <span aria-hidden="true">↺</span></button>
          </div>
          <button className="arena-log-rep" type="button" disabled={trackingMode !== 'manual' || !running || reps >= current.targetReps} onClick={logCompletedRep}>
            {trackingMode === 'manual' ? reps >= current.targetReps ? 'SET TARGET REACHED' : 'LOG ONE COMPLETED REP' : 'AUTO-COUNTING AVATAR CYCLES'}
            <span aria-hidden="true">{trackingMode === 'manual' ? '+1' : '↻'}</span>
          </button>
          <div className="arena-rest-panel">
            <div className="arena-rest-readout"><span>REST TIMER</span><strong>{String(Math.floor(restRemaining / 60)).padStart(2, '0') + ':' + String(restRemaining % 60).padStart(2, '0')}</strong></div>
            <label htmlFor="arena-rest-duration">REST LENGTH<select id="arena-rest-duration" value={restDuration} onChange={(event) => setRestDuration(Number(event.target.value))}><option value={30}>30 SEC</option><option value={45}>45 SEC</option><option value={60}>60 SEC</option><option value={90}>90 SEC</option></select></label>
            <button type="button" onClick={startRest} disabled={resting || setsCompleted >= 3}>START REST</button>
            {resting && <button type="button" onClick={skipRest}>SKIP REST</button>}
          </div>
          <p className="arena-session-state" role="status">{resting ? 'Rest timer is running. Your active-work timer and demonstration are paused.' : reducedMotion && running ? 'Reduced motion is enabled. The scene stays still, but you can continue the timer and log each rep manually.' : setsCompleted >= 3 ? (sessionSaved ? 'THREE SET TARGET COMPLETE. SESSION SAVED IN THIS BROWSER.' : 'THREE SET TARGET COMPLETE. FINISHING YOUR LOCAL SESSION RECORD…') : reps >= current.targetReps ? 'SET COMPLETE. Recover as needed, then start the next set or run a timed rest.' : running && trackingMode === 'manual' ? 'Training timer is running. Tap LOG ONE COMPLETED REP after you perform each rep yourself.' : running ? 'Follow-along is running. Each complete avatar cycle counts as a demo cycle, not a body-tracked rep.' : totalReps > 0 ? totalReps + ' TOTAL ' + (trackingMode === 'manual' ? 'REPS LOGGED' : 'DEMO CYCLES') + '. Resume this set when ready.' : 'Paused. Choose your tracking mode, then start the session.'}</p>
          <div className={showCue ? 'arena-form-card is-visible' : 'arena-form-card'} aria-live="polite">
            <div><span>FORM GUIDE</span><span>{current.prescription}</span></div>
            <h4>{current.tempo}</h4>
            <p>{current.cue}</p>
          </div>
          <div className="arena-movement-picker"><div className="arena-picker-head"><span>CHOOSE MOVEMENT</span><span>06 PATTERNS</span></div>{MOVES.map((move, index) => <button key={move.id} type="button" className={move.id === moveId ? 'is-active' : ''} aria-pressed={move.id === moveId} onClick={() => selectMove(move.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{move.name}</strong><small>{move.focus}</small><i aria-hidden="true">{move.id === moveId ? '●' : '↗'}</i></button>)}</div>
        </aside>
      </div>
      <div className="arena-history">
        <div className="arena-history-head"><div><p className="arena-kicker"><span>LOG</span> LOCAL TRAINING HISTORY</p><h3>Work completed.</h3></div><span>{history.length} / 5 SAVED SESSIONS</span></div>
        {history.length ? <div className="arena-history-list">{history.map((record) => <article key={record.id}><div><strong>{record.moveName}</strong><small>{new Date(record.completedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {record.trackingMode === 'manual' ? 'Manual rep log' : '3D demo cycles'} · {record.setsCompleted} sets · {record.totalReps} counts</small></div><span>{String(Math.floor(record.durationSeconds / 60)).padStart(2, '0') + ':' + String(record.durationSeconds % 60).padStart(2, '0')}</span></article>)}</div> : <p className="arena-history-empty">Complete all three sets to save your first session. Records stay in this browser; demo cycles and manually logged reps are labeled separately.</p>}
      </div>
    </section>
  );
}
