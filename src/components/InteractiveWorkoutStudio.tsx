import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EXERCISES, type Exercise, type TrainingGoal } from '../data/exercises';
import type { Mesh } from 'three';
import '../styles/interactive-workout-studio.css';

type Point = [number, number, number];
type Pose = Record<string, Point>;
type StudioCategory = 'Strength' | 'Conditioning' | 'Mobility';
type StudioRecord = {
  id: string;
  completedAt: string;
  exerciseName: string;
  goal: TrainingGoal;
  completedSets: number;
  targetReps: number;
  activeSeconds: number;
};

const JOINT_NAMES = ['pelvis', 'chest', 'neck', 'head', 'shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'wristL', 'wristR', 'hipL', 'hipR', 'kneeL', 'kneeR', 'ankleL', 'ankleR', 'footL', 'footR'];
const JOINT_RADII: Record<string, number> = {
  pelvis: .12, chest: .12, neck: .07, head: .13,
  shoulderL: .085, shoulderR: .085, elbowL: .065, elbowR: .065,
  wristL: .055, wristR: .055, hipL: .09, hipR: .09,
  kneeL: .075, kneeR: .075, ankleL: .055, ankleR: .055, footL: .07, footR: .07,
};
const LINKS = [
  { id: 'spine', from: 'pelvis', to: 'chest', radius: .13, color: '#b9df4a' },
  { id: 'neck-link', from: 'chest', to: 'neck', radius: .065, color: '#c68f72' },
  { id: 'upper-arm-left', from: 'shoulderL', to: 'elbowL', radius: .066, color: '#b9df4a' },
  { id: 'upper-arm-right', from: 'shoulderR', to: 'elbowR', radius: .066, color: '#b9df4a' },
  { id: 'forearm-left', from: 'elbowL', to: 'wristL', radius: .052, color: '#c68f72' },
  { id: 'forearm-right', from: 'elbowR', to: 'wristR', radius: .052, color: '#c68f72' },
  { id: 'thigh-left', from: 'hipL', to: 'kneeL', radius: .092, color: '#27312c' },
  { id: 'thigh-right', from: 'hipR', to: 'kneeR', radius: .092, color: '#27312c' },
  { id: 'shin-left', from: 'kneeL', to: 'ankleL', radius: .061, color: '#3e4842' },
  { id: 'shin-right', from: 'kneeR', to: 'ankleR', radius: .061, color: '#3e4842' },
  { id: 'shoe-left', from: 'ankleL', to: 'footL', radius: .07, color: '#e6e8df' },
  { id: 'shoe-right', from: 'ankleR', to: 'footR', radius: .07, color: '#e6e8df' },
] as const;

const STANDING_POSE: Pose = {
  pelvis: [0, 1.02, 0], chest: [0, 1.48, 0], neck: [0, 1.73, 0], head: [0, 1.92, .015],
  shoulderL: [-.22, 1.57, 0], shoulderR: [.22, 1.57, 0],
  elbowL: [-.36, 1.31, .01], elbowR: [.36, 1.31, .01],
  wristL: [-.42, 1.04, .035], wristR: [.42, 1.04, .035],
  hipL: [-.14, .98, 0], hipR: [.14, .98, 0],
  kneeL: [-.15, .54, .015], kneeR: [.15, .54, .015],
  ankleL: [-.15, .12, 0], ankleR: [.15, .12, 0],
  footL: [-.15, .075, .17], footR: [.15, .075, .17],
};

function poseFor(exerciseId: string, phase: number): Pose {
  const p = Object.fromEntries(Object.entries(STANDING_POSE).map(([name, point]) => [name, [...point] as Point])) as Pose;
  const wave = Math.sin(phase);
  const cycle = (1 - Math.cos(phase)) / 2;
  const move = (name: string, axis: 0 | 1 | 2, amount: number) => { p[name][axis] += amount; };

  if (['pushup', 'plank', 'mountain-climber', 'dead-bug'].includes(exerciseId)) {
    const horizontal: Pose = {
      pelvis: [0, .49, -.18], chest: [0, .56, .28], neck: [0, .57, .48], head: [0, .61, .67],
      shoulderL: [-.22, .55, .29], shoulderR: [.22, .55, .29],
      elbowL: [-.29, .24, .21], elbowR: [.29, .24, .21],
      wristL: [-.32, .085, .39], wristR: [.32, .085, .39],
      hipL: [-.14, .48, -.18], hipR: [.14, .48, -.18],
      kneeL: [-.14, .39, -.48], kneeR: [.14, .39, -.48],
      ankleL: [-.14, .15, -.78], ankleR: [.14, .15, -.78],
      footL: [-.14, .10, -.91], footR: [.14, .10, -.91],
    };
    Object.assign(p, horizontal);
    if (exerciseId === 'pushup') {
      for (const name of ['pelvis', 'chest', 'neck', 'head', 'shoulderL', 'shoulderR', 'hipL', 'hipR']) move(name, 1, -.14 * cycle);
      for (const name of ['elbowL', 'elbowR']) move(name, 1, -.075 * cycle);
    } else if (exerciseId === 'mountain-climber') {
      const leftDrive = (wave + 1) / 2;
      move('kneeL', 1, .18 * leftDrive);
      move('kneeL', 2, .47 * leftDrive);
      move('hipL', 2, .16 * leftDrive);
      move('kneeR', 1, .18 * (1 - leftDrive));
      move('kneeR', 2, .47 * (1 - leftDrive));
      move('hipR', 2, .16 * (1 - leftDrive));
    } else if (exerciseId === 'dead-bug') {
      move('wristL', 1, .25 * Math.max(0, wave));
      move('ankleR', 2, -.24 * Math.max(0, wave));
      move('wristR', 1, .25 * Math.max(0, -wave));
      move('ankleL', 2, -.24 * Math.max(0, -wave));
    } else {
      move('chest', 1, .012 * wave);
      move('pelvis', 1, .008 * wave);
    }
    return p;
  }

  if (exerciseId === 'squat') {
    for (const name of ['pelvis', 'chest', 'neck', 'head', 'hipL', 'hipR']) move(name, 1, -.26 * cycle);
    for (const name of ['chest', 'neck', 'head', 'shoulderL', 'shoulderR']) move(name, 2, .07 * cycle);
    for (const name of ['kneeL', 'kneeR']) { move(name, 1, -.16 * cycle); move(name, 2, .15 * cycle); }
    move('wristL', 1, -.12 * cycle); move('wristR', 1, -.12 * cycle);
    return p;
  }

  if (exerciseId === 'reverse-lunge' || exerciseId === 'step-up') {
    const leadLeft = wave >= 0;
    const lead = leadLeft ? 'L' : 'R';
    const trail = leadLeft ? 'R' : 'L';
    move('pelvis', 1, -.13 * cycle);
    move('chest', 1, -.10 * cycle);
    move('knee' + lead, 1, -.20 * cycle);
    move('knee' + lead, 2, .20 * cycle);
    move('ankle' + trail, 2, -.23 * cycle);
    move('knee' + trail, 2, -.12 * cycle);
    move('wristL', 1, -.10 * cycle); move('wristR', 1, -.10 * cycle);
    return p;
  }

  if (exerciseId === 'jumping-jack') {
    for (const side of ['L', 'R']) {
      const sign = side === 'L' ? -1 : 1;
      move('wrist' + side, 1, .92 * cycle);
      move('wrist' + side, 0, sign * .20 * cycle);
      move('elbow' + side, 1, .38 * cycle);
      move('knee' + side, 0, sign * .22 * cycle);
      move('ankle' + side, 0, sign * .30 * cycle);
      move('foot' + side, 0, sign * .30 * cycle);
    }
    move('pelvis', 1, .035 * Math.max(0, wave));
    move('chest', 1, .035 * Math.max(0, wave));
    return p;
  }

  if (exerciseId === 'march') {
    for (const side of ['L', 'R']) {
      const lift = Math.max(0, side === 'L' ? wave : -wave);
      move('knee' + side, 1, .32 * lift);
      move('hip' + side, 1, .10 * lift);
      move('ankle' + side, 1, .23 * lift);
      move('foot' + side, 1, .23 * lift);
      move('wrist' + side, 1, side === 'L' ? .10 * wave : -.10 * wave);
    }
    move('chest', 2, .025 * wave);
    return p;
  }

  if (exerciseId === 'db-row' || exerciseId === 'band-row' || exerciseId === 'band-pull' || exerciseId === 'db-carry') {
    move('chest', 2, .15);
    move('neck', 2, .16);
    move('head', 2, .16);
    move('shoulderL', 2, .14); move('shoulderR', 2, .14);
    move('elbowL', 2, -.12 * cycle); move('elbowR', 2, -.12 * cycle);
    move('wristL', 2, -.20 * cycle); move('wristR', 2, -.20 * cycle);
    move('pelvis', 1, -.02);
    return p;
  }

  if (exerciseId === 'worlds-greatest') {
    move('chest', 2, .18 * cycle); move('neck', 2, .20 * cycle); move('head', 2, .20 * cycle);
    move('wristL', 1, .20 * cycle); move('wristR', 1, .08 * cycle);
    return p;
  }

  if (exerciseId === 'calf-mobility') {
    move('ankleL', 1, .07 * cycle); move('ankleR', 1, .07 * cycle);
    move('footL', 1, .07 * cycle); move('footR', 1, .07 * cycle);
    move('chest', 1, .01 * wave);
    return p;
  }

  move('chest', 1, .02 * wave);
  move('head', 1, .02 * wave);
  return p;
}

function AnimatedAthlete({ exerciseId, playing, resetToken, onCycleComplete }: {
  exerciseId: string;
  playing: boolean;
  resetToken: number;
  onCycleComplete: () => void;
}) {
  const linkRefs = useRef<Record<string, Mesh | null>>({});
  const jointRefs = useRef<Record<string, Mesh | null>>({});
  const phaseRef = useRef(0);
  const lastCycleRef = useRef(0);
  const yAxis = useMemo(() => [0, 1, 0] as [number, number, number], []);
  const vectorFrom = useMemo(() => ({ set: (v: Point) => new Vector3(v[0], v[1], v[2]) }), []);
  const unusedResetGuard = useRef(resetToken);

  useEffect(() => {
    phaseRef.current = 0;
    lastCycleRef.current = 0;
    unusedResetGuard.current = resetToken;
  }, [exerciseId, resetToken]);

  useFrame((_, delta) => {
    if (playing) {
      phaseRef.current += Math.min(delta, .05) * 2.05;
      const cycle = Math.floor(phaseRef.current / (Math.PI * 2));
      if (cycle > lastCycleRef.current) {
        lastCycleRef.current = cycle;
        onCycleComplete();
      }
    }
    const phase = phaseRef.current % (Math.PI * 2);
    const pose = poseFor(exerciseId, phase);
    const up = new Vector3(...yAxis);

    for (const link of LINKS) {
      const mesh = linkRefs.current[link.id];
      const start = pose[link.from];
      const end = pose[link.to];
      if (!mesh || !start || !end) continue;
      const from = vectorFrom.set(start);
      const to = vectorFrom.set(end);
      const direction = to.clone().sub(from);
      const length = direction.length();
      mesh.position.copy(from.clone().add(to).multiplyScalar(.5));
      mesh.quaternion.setFromUnitVectors(up, direction.normalize());
      mesh.scale.set(1, Math.max(.02, length), 1);
    }
    for (const name of JOINT_NAMES) {
      const mesh = jointRefs.current[name];
      const point = pose[name];
      if (mesh && point) mesh.position.set(point[0], point[1], point[2]);
    }
  });

  return (
    <group>
      {LINKS.map((link) => <mesh key={link.id} ref={(mesh) => { linkRefs.current[link.id] = mesh; }} castShadow receiveShadow>
        <cylinderGeometry args={[link.radius, link.radius * .94, 1, 16]} />
        <meshStandardMaterial color={link.color} roughness={.66} metalness={.05} />
      </mesh>)}
      {JOINT_NAMES.map((name) => <mesh key={name} ref={(mesh) => { jointRefs.current[name] = mesh; }} castShadow receiveShadow>
        <sphereGeometry args={[JOINT_RADII[name], name === 'head' ? 24 : 12, name === 'head' ? 18 : 10]} />
        <meshStandardMaterial color={name === 'head' || name.startsWith('elbow') || name.startsWith('wrist') ? '#c68f72' : name.startsWith('ankle') || name.startsWith('foot') ? '#e6e8df' : name.startsWith('knee') || name.startsWith('hip') ? '#27312c' : '#b9df4a'} roughness={.76} />
      </mesh>)}
      <mesh position={[0, 1.18, -.005]} scale={[.24, .37, .13]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#b9df4a" roughness={.72} />
      </mesh>
      <mesh position={[0, 1.93, .13]} scale={[.085, .11, .035]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color="#c68f72" roughness={.72} />
      </mesh>
      <mesh position={[-.047, 1.95, .16]}><sphereGeometry args={[.014, 10, 10]} /><meshBasicMaterial color="#141916" /></mesh>
      <mesh position={[.047, 1.95, .16]}><sphereGeometry args={[.014, 10, 10]} /><meshBasicMaterial color="#141916" /></mesh>
    </group>
  );
}

function TrainingFloor() {
  return (
    <>
      <ambientLight intensity={1.15} />
      <hemisphereLight args={['#dce7da', '#222b25', 1.1]} />
      <directionalLight position={[-3, 7, 5]} intensity={2.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[2, 3, -1]} intensity={1.2} color="#d7ff58" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.19, 0]} receiveShadow>
        <planeGeometry args={[18, 15]} />
        <meshStandardMaterial color="#171d19" roughness={.92} />
      </mesh>
      <gridHelper args={[14, 28, '#344238', '#29342d']} position={[0, -.17, 0]} />
      <mesh position={[0, -.075, .1]} receiveShadow castShadow>
        <boxGeometry args={[4.1, .18, 3.2]} />
        <meshStandardMaterial color="#252d28" roughness={.74} metalness={.18} />
      </mesh>
      <mesh position={[0, .02, 1.72]}>
        <boxGeometry args={[4.1, .026, .045]} />
        <meshStandardMaterial color="#d7ff58" emissive="#50651b" emissiveIntensity={.45} />
      </mesh>
      {[-1.75, 1.75].map((x) => <group key={x} position={[x, 0, -.95]}>
        <mesh position={[0, .94, 0]} castShadow>
          <boxGeometry args={[.095, 1.9, .095]} />
          <meshStandardMaterial color="#6d7971" metalness={.82} roughness={.27} />
        </mesh>
        <mesh position={[0, 1.84, .075]}>
          <boxGeometry args={[.22, .05, .15]} />
          <meshStandardMaterial color="#d7ff58" metalness={.55} roughness={.3} />
        </mesh>
        <mesh position={[0, 1.62, 0]}>
          <boxGeometry args={[.14, .06, .16]} />
          <meshStandardMaterial color="#c8d0c9" metalness={.8} roughness={.25} />
        </mesh>
      </group>)}
      <mesh position={[0, 1.55, -.95]} castShadow>
        <boxGeometry args={[3.55, .055, .06]} />
        <meshStandardMaterial color="#9da9a0" metalness={.88} roughness={.22} />
      </mesh>
      {[-1.55, -1.25, 1.25, 1.55].map((x, index) => <mesh key={x} position={[x, 1.55, -.95]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[index % 2 ? .27 : .34, index % 2 ? .27 : .34, .12, 32]} />
        <meshPhysicalMaterial color={index % 2 ? '#303834' : '#202622'} metalness={.72} roughness={.28} clearcoat={.42} />
      </mesh>)}
      <mesh position={[0, 1.13, -2.55]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 2.35, .12]} />
        <meshStandardMaterial color="#202722" roughness={.92} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-2.25 + i * .56, .3 + (i % 3) * .45, -2.47]}>
        <boxGeometry args={[.025, .025, .02]} />
        <meshStandardMaterial color="#647468" emissive="#2b372d" emissiveIntensity={.2} />
      </mesh>)}
    </>
  );
}

function readHistory(): StudioRecord[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem('kinetik-3d-workout-history') ?? '[]');
    return Array.isArray(value) ? value.filter((item: unknown): item is StudioRecord =>
      Boolean(item) && typeof item === 'object' && 'id' in item && typeof item.id === 'string'
      && 'completedAt' in item && typeof item.completedAt === 'string'
      && 'exerciseName' in item && typeof item.exerciseName === 'string'
      && 'completedSets' in item && typeof item.completedSets === 'number'
      && 'activeSeconds' in item && typeof item.activeSeconds === 'number'
    ).slice(0, 5) : [];
  } catch { return []; }
}

function mmss(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return String(Math.floor(safe / 60)).padStart(2, '0') + ':' + String(safe % 60).padStart(2, '0');
}

export function InteractiveWorkoutStudio() {
  const [category, setCategory] = useState<StudioCategory>('Strength');
  const categoryExercises = useMemo(() => EXERCISES.filter((exercise) => exercise.category === category), [category]);
  const [exerciseId, setExerciseId] = useState('squat');
  const exercise: Exercise = EXERCISES.find((entry) => entry.id === exerciseId) ?? categoryExercises[0] ?? EXERCISES[0];
  const [playing, setPlaying] = useState(false);
  const [targetReps, setTargetReps] = useState(8);
  const [targetSets, setTargetSets] = useState(3);
  const [repCount, setRepCount] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [cameraToken, setCameraToken] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [status, setStatus] = useState('Choose a movement, then start the 3D demonstration.');
  const [history, setHistory] = useState<StudioRecord[]>(readHistory);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    try { window.localStorage.setItem('kinetik-3d-workout-history', JSON.stringify(history)); }
    catch { /* Keep recent records in memory when storage is not available. */ }
  }, [history]);

  function changeCategory(next: StudioCategory) {
    setCategory(next);
    const first = EXERCISES.find((entry) => entry.category === next);
    if (!first) return;
    setExerciseId(first.id);
    resetExercise(first.name);
  }

  function resetExercise(label = exercise.name) {
    setPlaying(false);
    setRepCount(0);
    setSetsDone(0);
    setElapsedSeconds(0);
    setSessionSaved(false);
    setCompleted(false);
    setResetToken((value) => value + 1);
    setStatus(label + ' selected. Start the animated 3D demonstration when ready.');
  }

  function selectExercise(id: string) {
    const entry = EXERCISES.find((item) => item.id === id);
    if (!entry) return;
    setExerciseId(id);
    setCategory(entry.category);
    resetExercise(entry.name);
  }

  function cycleCompleted() {
    if (!playing || completed) return;
    setRepCount((count) => {
      const next = count + 1;
      if (next >= targetReps) {
        setPlaying(false);
        setStatus('Target demo cycles reached. Complete the set or reset the movement.');
        return targetReps;
      }
      return next;
    });
  }

  function completeSet() {
    if (repCount < targetReps) {
      setStatus('Finish the target number of demonstration cycles before completing this set.');
      return;
    }
    const nextSets = setsDone + 1;
    setSetsDone(nextSets);
    setRepCount(0);
    setResetToken((value) => value + 1);
    setSessionSaved(false);
    if (nextSets >= targetSets) {
      setPlaying(false);
      setCompleted(true);
      setStatus('SESSION COMPLETE. Save this local session to keep a record.');
    } else {
      setPlaying(true);
      setStatus('Set ' + nextSets + ' of ' + targetSets + ' recorded. Begin the next demonstration set.');
    }
  }

  function saveSession() {
    if (!completed || sessionSaved) return;
    const record: StudioRecord = {
      id: new Date().toISOString() + ':' + exercise.id,
      completedAt: new Date().toISOString(),
      exerciseName: exercise.name,
      goal: category === 'Strength' ? 'Strength' : category === 'Conditioning' ? 'Conditioning' : 'Mobility',
      completedSets: setsDone,
      targetReps,
      activeSeconds: elapsedSeconds,
    };
    setHistory((current) => [record, ...current.filter((item) => item.id !== record.id)].slice(0, 5));
    setSessionSaved(true);
    setStatus('Session saved in this browser only. No workout has been sent to a service.');
  }

  const progressPercent = Math.min(100, repCount / targetReps * 100);
  const allSessionProgress = Math.min(100, (setsDone / targetSets) * 100);
  return (
    <section className="section interactive-studio-section" id="studio" aria-labelledby="studio-title">
      <div className="section-shell">
        <div className="section-heading-row studio-heading">
          <div><p className="eyebrow"><span>01</span> INTERACTIVE TRAINING FLOOR</p><h2 id="studio-title">Move through<br /><em>the movement.</em></h2></div>
          <p className="section-intro">Enter a live 3D training scene. Choose an exercise, orbit the camera, run the demonstration, complete sets and keep a local workout record.</p>
        </div>
        <div className="studio-layout">
          <div className="studio-viewport">
            <div className="studio-viewport-top"><span><i className={playing ? 'studio-live-dot is-playing' : 'studio-live-dot'} /> {playing ? 'DEMONSTRATION RUNNING' : completed ? 'SESSION COMPLETE' : '3D TRAINING STUDIO'}</span><button type="button" onClick={() => setCameraToken((value) => value + 1)}>RESET CAMERA ↻</button></div>
            <div className="studio-canvas-wrap">
              <Canvas key={cameraToken} shadows dpr={[1, 1.4]} frameloop={playing ? 'always' : 'demand'} camera={{ position: [4.7, 3.05, 5.9], fov: 38, near: .1, far: 90 }} gl={{ antialias: true, powerPreference: 'low-power' }}>
                <TrainingFloor />
                <AnimatedAthlete key={exercise.id + ':' + resetToken} exerciseId={exercise.id} playing={playing} resetToken={resetToken} onCycleComplete={cycleCompleted} />
                <OrbitControls makeDefault enableDamping dampingFactor={.09} minDistance={3.8} maxDistance={12} maxPolarAngle={Math.PI * .49} target={[0, .9, 0]} />
              </Canvas>
              <div className="studio-scene-tag"><span>LIVE SCENE / {String(EXERCISES.findIndex((entry) => entry.id === exercise.id) + 1).padStart(2, '0')}</span><span>DRAG TO ORBIT · SCROLL TO ZOOM</span></div>
              <div className="studio-scene-exercise"><span>CURRENT MOVEMENT</span><strong>{exercise.name}</strong><small>{exercise.focus} · {exercise.category.toUpperCase()}</small></div>
            </div>
            <div className="studio-viewport-foot"><span>PROCEDURAL 3D ATHLETE · NO EXTERNAL MODEL REQUIRED</span><span>DEMO CYCLES ARE NOT CAMERA-TRACKED HUMAN REPS</span></div>
          </div>
          <aside className="studio-controls" aria-label="3D workout controls">
            <div className="studio-panel-head"><span>WORKOUT CONTROLS</span><span>01 / CONTROL DESK</span></div>
            <div className="studio-category-tabs" role="group" aria-label="Exercise category">
              {(['Strength', 'Conditioning', 'Mobility'] as StudioCategory[]).map((item) => <button key={item} type="button" aria-pressed={category === item} className={category === item ? 'is-active' : ''} onClick={() => changeCategory(item)}>{item.toUpperCase()}</button>)}
            </div>
            <label className="studio-field"><span>SELECT MOVEMENT</span><select value={exerciseId} onChange={(event) => selectExercise(event.target.value)}>{categoryExercises.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <p className="studio-technique-note">{exercise.cue}</p>
            <div className="studio-prescription">
              <label><span>TARGET CYCLES</span><select value={targetReps} onChange={(event) => { setTargetReps(Number(event.target.value)); setRepCount(0); setPlaying(false); setResetToken((value) => value + 1); setStatus('Target updated. Run the demonstration again for the new cycle count.'); }}><option value={5}>5 cycles</option><option value={8}>8 cycles</option><option value={10}>10 cycles</option><option value={12}>12 cycles</option></select></label>
              <label><span>SETS</span><select value={targetSets} onChange={(event) => { setTargetSets(Number(event.target.value)); setSetsDone(0); setCompleted(false); setSessionSaved(false); setStatus('Set target updated.'); }}><option value={1}>1 set</option><option value={2}>2 sets</option><option value={3}>3 sets</option><option value={4}>4 sets</option></select></label>
            </div>
            <div className="studio-count-grid">
              <div><span>DEMO CYCLES</span><strong>{repCount}<small> / {targetReps}</small></strong><div className="studio-mini-track"><i style={{ width: progressPercent + '%' }} /></div></div>
              <div><span>SETS DONE</span><strong>{setsDone}<small> / {targetSets}</small></strong><div className="studio-mini-track"><i style={{ width: allSessionProgress + '%' }} /></div></div>
            </div>
            <div className="studio-clock-row"><div><span>ACTIVE TIME</span><strong>{mmss(elapsedSeconds)}</strong></div><div><span>SET STATUS</span><strong>{completed ? 'DONE' : repCount >= targetReps ? 'READY' : playing ? 'LIVE' : 'PAUSED'}</strong></div></div>
            <div className="studio-primary-controls">
              <button className="studio-main-action" type="button" onClick={() => { if (completed) { resetExercise(); return; } setPlaying((value) => !value); setStatus(playing ? 'Demonstration paused. Resume whenever ready.' : 'Demonstration running. One visual cycle is counted when the animation completes a loop.'); }}>{completed ? 'START ANOTHER' : playing ? 'PAUSE DEMO' : repCount ? 'RESUME DEMO' : 'START 3D DEMO'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button>
              <div><button type="button" onClick={() => resetExercise()}>RESET SET</button><button type="button" disabled={repCount < targetReps || completed} onClick={completeSet}>COMPLETE SET ✓</button></div>
            </div>
            {completed && <button className="studio-save-action" type="button" disabled={sessionSaved} onClick={saveSession}>{sessionSaved ? 'SAVED TO THIS BROWSER ✓' : 'SAVE SESSION RECORD ↗'}</button>}
            <p className="studio-live-status" role="status" aria-live="polite">{status}</p>
            <p className="studio-disclaimer">This scene is an interactive procedural demonstration, not a motion-capture coach or medical assessment. Check form in person and use an appropriate, comfortable range.</p>
          </aside>
        </div>
        <div className="studio-history">
          <div className="studio-history-heading"><div><p className="eyebrow"><span>LOG</span> LOCAL TRAINING RECORDS</p><h3>Recent 3D sessions</h3></div><span>{history.length} / 5 SAVED</span></div>
          {history.length ? <div className="studio-history-list">{history.map((record) => <article key={record.id}><div><strong>{record.exerciseName}</strong><small>{new Date(record.completedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {record.goal} · {record.completedSets} sets × {record.targetReps} demo cycles</small></div><span>{mmss(record.activeSeconds)}</span></article>)}</div> : <p className="studio-history-empty">Finish a demo set sequence and save it to build your own local history. No sample workouts or fake performance numbers are shown.</p>}
      </div>
    </div>
  </section>
  );
}
