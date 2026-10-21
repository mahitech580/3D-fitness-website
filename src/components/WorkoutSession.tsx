import { useEffect, useMemo, useState } from 'react';
import { EXERCISES, gearMatches, type Exercise, type GearOption, type TrainingGoal } from '../data/exercises';
import '../styles/workout-session.css';

export type PlannedWorkoutDay = { label: string; theme: string; exercises: Exercise[]; minutes: number };
export type CompletedWorkoutRecord = {
  id: string;
  completedAt: string;
  dayLabel: string;
  theme: string;
  goal: TrainingGoal;
  exerciseCount: number;
  minutes: number;
  durationSeconds: number;
};

type WorkoutSessionProps = {
  day: PlannedWorkoutDay;
  goal: TrainingGoal;
  gear: GearOption;
  onClose: () => void;
  onComplete: (record: CompletedWorkoutRecord) => void;
};

function clock(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return String(Math.floor(safe / 60)).padStart(2, '0') + ':' + String(safe % 60).padStart(2, '0');
}

function restDuration(rest: string) {
  const match = rest.match(/\d+/);
  return match ? Math.max(5, Number(match[0])) : 45;
}

export function WorkoutSession({ day, goal, gear, onClose, onComplete }: WorkoutSessionProps) {
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>(() => day.exercises.map((exercise) => ({ ...exercise })));
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [resting, setResting] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const current = sessionExercises[exerciseIndex];
  const alternatives = useMemo(() => EXERCISES.filter((exercise) => exercise.id !== current.id && exercise.category === current.category && gearMatches(exercise, gear)), [current.id, current.category, gear]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  useEffect(() => {
    if (!started || paused) return;
    const interval = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(interval);
  }, [started, paused]);

  useEffect(() => {
    if (!resting || paused) return;
    const interval = window.setInterval(() => setRestRemaining((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [resting, paused]);

  useEffect(() => {
    if (resting && restRemaining === 0) setResting(false);
  }, [resting, restRemaining]);

  function moveExercise(direction: -1 | 1) {
    setExerciseIndex((index) => Math.min(sessionExercises.length - 1, Math.max(0, index + direction)));
    setResting(false);
    setRestRemaining(0);
  }

  function startRest() {
    setRestRemaining(restDuration(current.rest));
    setResting(true);
  }

  function substitute(id: string) {
    const replacement = EXERCISES.find((exercise) => exercise.id === id);
    if (!replacement) return;
    setSessionExercises((existing) => existing.map((exercise, index) => index === exerciseIndex ? replacement : exercise));
  }

  function finish() {
    const completedAt = new Date().toISOString();
    onComplete({
      id: completedAt + ':' + day.label + ':' + goal,
      completedAt,
      dayLabel: day.label,
      theme: day.theme,
      goal,
      exerciseCount: sessionExercises.length,
      minutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      durationSeconds: elapsedSeconds,
    });
  }

  return (
    <div className="workout-session-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="workout-session-modal" role="dialog" aria-modal="true" aria-labelledby="session-title">
        <header className="workout-session-header">
          <div><p className="eyebrow"><span>SESSION / LIVE</span> {day.label} · {goal.toUpperCase()}</p><h2 id="session-title">{day.theme.replaceAll('/', '·')}</h2></div>
          <button type="button" className="workout-session-close" onClick={onClose} aria-label="Cancel workout session">CANCEL <span aria-hidden="true">×</span></button>
        </header>
        <div className="workout-session-metrics">
          <div><span>ELAPSED</span><strong>{clock(elapsedSeconds)}</strong></div>
          <div><span>MOVEMENT</span><strong>{exerciseIndex + 1} / {sessionExercises.length}</strong></div>
          <div><span>REST</span><strong>{resting ? clock(restRemaining) : '— —'}</strong></div>
        </div>
        <div className="workout-session-progress" role="progressbar" aria-label="Exercise progress" aria-valuemin={0} aria-valuemax={sessionExercises.length} aria-valuenow={exerciseIndex + 1}><span style={{ width: ((exerciseIndex + 1) / sessionExercises.length * 100) + '%' }} /></div>
        <div className="workout-session-content">
          <div className="workout-session-index"><span>{String(exerciseIndex + 1).padStart(2, '0')}</span><span>OF {String(sessionExercises.length).padStart(2, '0')}</span></div>
          <h3>{current.name}</h3>
          <p className="workout-session-focus">{current.focus} <span>·</span> {current.gear.join(' / ')}</p>
          <div className="workout-session-prescription"><div><span>SETS</span><strong>{current.sets}</strong></div><div><span>REPS / TIME</span><strong>{current.reps}</strong></div><div><span>REST GUIDE</span><strong>{current.rest}</strong></div></div>
          <div className="workout-session-coaching"><span>TECHNIQUE CUE</span><p>{current.cue}</p></div>
          <label className="session-substitution">SWAP MOVEMENT (SAME GENERAL CATEGORY)
            <select value="" onChange={(event) => substitute(event.target.value)}>
              <option value="">Choose a substitute…</option>
              {alternatives.map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}
            </select>
          </label>
        </div>
        <div className="workout-session-controls">
          <div className="session-nav-controls">
            <button type="button" disabled={exerciseIndex === 0} onClick={() => moveExercise(-1)}>← PREVIOUS</button>
            <button type="button" disabled={exerciseIndex === sessionExercises.length - 1} onClick={() => moveExercise(1)}>NEXT →</button>
          </div>
          <div className="session-timer-controls">
            {!started ? <button type="button" className="session-start-button" onClick={() => { setStarted(true); setPaused(false); }}>START WORKOUT <span aria-hidden="true">▶</span></button> : <button type="button" className="session-start-button" onClick={() => setPaused((value) => !value)}>{paused ? 'RESUME WORKOUT' : 'PAUSE WORKOUT'} <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>}
            <button type="button" onClick={startRest}>START REST</button>
            {resting && <button type="button" onClick={() => { setResting(false); setRestRemaining(0); }}>SKIP REST</button>}
          </div>
          <button type="button" className="session-finish-button" onClick={finish}>FINISH & SAVE SESSION <span aria-hidden="true">✓</span></button>
        </div>
        <p className="workout-session-disclaimer">A simple session tracker, not a live trainer. Adjust the exercise, range and rest to your needs; stop if you feel pain or unwell. Finishing records this session in browser-local history only.</p>
      </section>
    </div>
  );
}
