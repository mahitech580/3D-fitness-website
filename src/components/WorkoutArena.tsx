import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { MathUtils, type Group } from 'three';
import '../styles/workout-arena.css';

type MoveId = 'squat' | 'curl' | 'press' | 'jacks' | 'lunge' | 'hinge';
type CameraMode = 'front' | 'side' | 'three-quarter';

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

function Athlete({ move, running, tempo, onRep }: { move: MoveId; running: boolean; tempo: number; onRep: () => void }) {
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
          <Joint position={[0, -0.51, 0]} radius={0.09} color="#c7a18b" />
          <group ref={side < 0 ? leftKnee : rightKnee} position={[0, -0.51, 0]}>
            <mesh position={[0, -0.245, 0]} castShadow><capsuleGeometry args={[0.078, 0.37, 5, 12]} /><meshStandardMaterial color="#27322c" roughness={0.62} /></mesh>
            <Joint position={[0, -0.49, 0]} radius={0.065} />
            <mesh position={[0, -0.515, 0.09]} castShadow><boxGeometry args={[0.17, 0.105, 0.29]} /><meshStandardMaterial color="#121715" roughness={0.47} /></mesh>
            <mesh position={[0, -0.462, 0.16]}><boxGeometry args={[0.105, 0.012, 0.04]} /><meshStandardMaterial color="#d7ff58" emissive="#35430d" emissiveIntensity={0.12} /></mesh>
          </group>
        </group>
      ))}

      {/* Torso has a pivot so hinges and braced movement read clearly */}
      <group ref={torso} position={[0, 1.12, 0]}>
        <mesh position={[0, 0.28, 0]} rotation={[0, 0, 0]} castShadow><capsuleGeometry args={[0.255, 0.44, 8, 20]} /><meshPhysicalMaterial color="#333f38" roughness={0.5} metalness={0.06} clearcoat={0.18} /></mesh>
        <mesh position={[0, 0.48, 0.018]} castShadow><boxGeometry args={[0.28, 0.11, 0.14]} /><meshStandardMaterial color="#d7ff58" roughness={0.55} /></mesh>
        <mesh position={[0, 0.09, 0.02]}><torusGeometry args={[0.23, 0.014, 8, 32]} /><meshStandardMaterial color="#65776b" metalness={0.55} roughness={0.34} /></mesh>
        <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.075, 0.095, 0.16, 20]} /><meshStandardMaterial color="#c7a18b" roughness={0.68} /></mesh>
        <group position={[0, 0.83, 0.012]}>
          <mesh castShadow><sphereGeometry args={[0.165, 28, 22]} /><meshStandardMaterial color="#c7a18b" roughness={0.58} /></mesh>
          <mesh position={[0, 0.105, -0.018]}><sphereGeometry args={[0.155, 24, 16]} /><meshStandardMaterial color="#171b19" roughness={0.8} /></mesh>
          <mesh position={[0, -0.015, 0.145]}><boxGeometry args={[0.13, 0.07, 0.055]} /><meshStandardMaterial color="#9c7261" roughness={0.58} /></mesh>
          {[-1, 1].map((side) => <mesh key={side} position={[side * 0.062, 0.012, 0.144]}><sphereGeometry args={[0.013, 10, 8]} /><meshStandardMaterial color="#111513" /></mesh>)}
        </group>

        {([-1, 1] as const).map((side) => (
          <group key={side} ref={side < 0 ? leftShoulder : rightShoulder} position={[side * 0.285, 0.52, 0]}>
            <Joint position={[0, 0, 0]} radius={0.105} color="#c7a18b" />
            <mesh position={[side * 0.015, -0.2, 0]} castShadow><capsuleGeometry args={[0.082, 0.27, 5, 12]} /><meshStandardMaterial color="#c7a18b" roughness={0.5} /></mesh>
            <group ref={side < 0 ? leftElbow : rightElbow} position={[side * 0.015, -0.37, 0]}>
              <Joint position={[0, 0, 0]} radius={0.072} />
              <mesh position={[0, -0.19, 0]} castShadow><capsuleGeometry args={[0.065, 0.28, 5, 12]} /><meshStandardMaterial color="#c7a18b" roughness={0.5} /></mesh>
              <Joint position={[0, -0.37, 0]} radius={0.065} />
              <mesh position={[0, -0.43, 0.015]} castShadow><sphereGeometry args={[0.082, 16, 12]} /><meshStandardMaterial color="#c7a18b" roughness={0.56} /></mesh>
              <Dumbbell position={[0, -0.49, 0.015]} />
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

  const countRep = useCallback(() => {
    setTotalReps((value) => value + 1);
    setReps((value) => {
      const next = value + 1;
      if (next >= targetRepsRef.current) {
        setRunning(false);
        setSetsCompleted((completed) => Math.min(3, completed + 1));
        return targetRepsRef.current;
      }
      return next;
    });
  }, []);

  function selectMove(id: MoveId) {
    setMoveId(id);
    setReps(0);
    setTotalReps(0);
    setSetsCompleted(0);
    setRunning(false);
    setElapsed(0);
  }

  function resetSession() {
    setRunning(false);
    setReps(0);
    setTotalReps(0);
    setSetsCompleted(0);
    setElapsed(0);
  }

  function startNextSet() {
    if (setsCompleted >= 3) return;
    setReps(0);
    setRunning(true);
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
            <div><span>REPS / SET</span><strong>{String(reps).padStart(2, '0')}<small>/{current.targetReps}</small></strong></div>
            <div><span>SETS</span><strong>{setsCompleted}<small>/3</small></strong></div>
            <div><span>ELAPSED</span><strong>{clock}</strong></div>
          </div>
          <div className="arena-rep-progress" role="progressbar" aria-label="Repetitions completed in current set" aria-valuemin={0} aria-valuemax={current.targetReps} aria-valuenow={reps}><span style={{ width: (reps / current.targetReps * 100) + '%' }} /></div>
          <div className="arena-tempo-control"><label htmlFor="arena-tempo">MOVEMENT TEMPO</label><input id="arena-tempo" type="range" min={24} max={72} step={4} value={tempo} onChange={(event) => setTempo(Number(event.target.value))} /><div><span>SLOW / CONTROLLED</span><strong>{tempo} REPS / MIN TARGET</strong></div></div>
          <div className="arena-session-buttons">
            <button className="arena-primary-control" type="button" disabled={!running && setsCompleted >= 3} onClick={() => {
              if (running) setRunning(false);
              else if (reps >= current.targetReps) startNextSet();
              else setRunning(true);
            }}>{setsCompleted >= 3 ? 'TARGET COMPLETE' : running ? 'PAUSE SESSION' : reps >= current.targetReps ? 'START NEXT SET ' + (setsCompleted + 1) : elapsed > 0 ? 'RESUME SESSION' : 'START SESSION'} <span aria-hidden="true">{running ? 'Ⅱ' : setsCompleted >= 3 ? '✓' : reps >= current.targetReps ? '↗' : '▶'}</span></button>
            <button className="arena-secondary-control" type="button" onClick={resetSession}>RESET <span aria-hidden="true">↺</span></button>
          </div>
          <p className="arena-session-state" role="status">{reducedMotion && running ? 'Reduced-motion preference detected. The timer runs without animated repetition cycles. Change your system motion preference to use the moving model.' : setsCompleted >= 3 ? 'THREE SET TARGET COMPLETE. Reset to run the movement again.' : reps >= current.targetReps ? 'SET COMPLETE. Recover as needed, then start the next set.' : running ? 'The procedural movement cycle is running. Each full cycle records one rep and pauses at the set target.' : totalReps > 0 ? totalReps + ' TOTAL REPS RECORDED. Resume the current set when ready.' : 'Paused. Start the session when you are ready.'}</p>
          <div className={showCue ? 'arena-form-card is-visible' : 'arena-form-card'} aria-live="polite">
            <div><span>FORM GUIDE</span><span>{current.prescription}</span></div>
            <h4>{current.tempo}</h4>
            <p>{current.cue}</p>
          </div>
          <div className="arena-movement-picker"><div className="arena-picker-head"><span>CHOOSE MOVEMENT</span><span>06 PATTERNS</span></div>{MOVES.map((move, index) => <button key={move.id} type="button" className={move.id === moveId ? 'is-active' : ''} aria-pressed={move.id === moveId} onClick={() => selectMove(move.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{move.name}</strong><small>{move.focus}</small><i aria-hidden="true">{move.id === moveId ? '●' : '↗'}</i></button>)}</div>
        </aside>
      </div>
    </section>
  );
}
