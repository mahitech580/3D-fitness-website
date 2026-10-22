import { useEffect, useMemo, useState } from 'react';
import { EXERCISES, gearMatches, type Exercise, type GearOption, type TrainingGoal } from '../data/exercises';
import { WorkoutSession, type PlannedWorkoutDay, type CompletedWorkoutRecord } from './WorkoutSession';
import type { MoveId } from './WorkoutArena';
import { ProgressDashboard } from './ProgressDashboard';
import '../styles/workout-session.css';
import '../styles/workout-templates.css';

type WorkoutDay = PlannedWorkoutDay;
const ARENA_MOVE_FOR_EXERCISE: Partial<Record<string, MoveId>> = {
  squat: 'squat',
  'reverse-lunge': 'lunge',
  'jumping-jack': 'jacks',
  'hip-hinge': 'hinge',
  deadlift: 'hinge',
};
const ARENA_MOVE_LABELS: Record<MoveId, string> = {
  squat: 'Bodyweight squat',
  curl: 'Dumbbell curl',
  press: 'Overhead press',
  jacks: 'Jumping jack',
  lunge: 'Reverse lunge',
  hinge: 'Hip hinge / RDL',
};
type WorkoutSettings = {
  goal: TrainingGoal;
  level: string;
  gear: GearOption;
  days: number;
  minutes: number;
  intensity: 'Low' | 'Moderate' | 'High';
  location: 'Home' | 'Gym' | 'Outdoors';
  avoidedIds: string[];
  availableDays: string[];
};
type SavedWorkoutTemplate = WorkoutSettings & { id: string; name: string; savedAt: string };

function currentWeekKey(): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return String(date.getFullYear()) + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function buildPlan(goal: TrainingGoal, level: string, gear: GearOption, days: number, minutes: number, intensity: string, location: string, avoidedIds: string[], availableDays: string[]): WorkoutDay[] {
  const isAvailable = (exercise: Exercise) => !avoidedIds.includes(exercise.id) && gearMatches(exercise, gear) && (location !== 'Outdoors' || exercise.gear.includes('Bodyweight'));
  const eligible = EXERCISES.filter((exercise) => exercise.goals.includes(goal) && isAvailable(exercise));
  const fallback = EXERCISES.filter(isAvailable);
  const source = eligible.length >= 4 ? eligible : fallback;
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const selectedWeekdays = availableDays.length ? weekdays.filter((weekday) => availableDays.includes(weekday)) : weekdays;
  const sessionCount = Math.min(days, selectedWeekdays.length);
  const size = minutes <= 25 ? 4 : minutes <= 40 ? 5 : 6;
  const result: WorkoutDay[] = [];

  for (let day = 0; day < sessionCount; day += 1) {
    const chosen: Exercise[] = [];
    let cursor = day * 2;
    while (chosen.length < Math.min(size, source.length)) {
      const candidate = source[cursor % source.length];
      if (!chosen.some((item) => item.id === candidate.id)) chosen.push(candidate);
      cursor += 1;
    }
    const adjusted = chosen.map((exercise) => ({
      ...exercise,
      sets: intensity === 'Low' || level === 'New to training' ? '2' : intensity === 'High' || level === 'Experienced' ? '4' : exercise.sets,
    }));
    result.push({
      label: selectedWeekdays[day] ?? weekdays[day],
      theme: goal === 'Conditioning' ? (day % 2 === 0 ? 'ENGINE / INTERVALS' : 'PACE / CAPACITY') : goal === 'Mobility' ? 'RANGE / CONTROL' : (day % 2 === 0 ? 'FOUNDATION / A' : 'FOUNDATION / B'),
      exercises: adjusted,
      minutes,
    });
  }
  return result;
}

export function WorkoutBuilder({ onStartIn3D }: { onStartIn3D?: (moveId: MoveId) => void }) {
  const [goal, setGoal] = useState<TrainingGoal>('Strength');
  const [level, setLevel] = useState('Regular');
  const [gear, setGear] = useState<GearOption>('Dumbbells');
  const [days, setDays] = useState(3);
  const [minutes, setMinutes] = useState(40);
  const [intensity, setIntensity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [location, setLocation] = useState<'Home' | 'Gym' | 'Outdoors'>('Home');
  const [avoidedIds, setAvoidedIds] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>(['MON', 'WED', 'FRI']);
  const [plan, setPlan] = useState<WorkoutDay[]>(() => buildPlan('Strength', 'Regular', 'Dumbbells', 3, 40, 'Moderate', 'Home', [], ['MON', 'WED', 'FRI']));
  const [copyStatus, setCopyStatus] = useState('');
  const [activeDay, setActiveDay] = useState<WorkoutDay | null>(null);
  const [history, setHistory] = useState<CompletedWorkoutRecord[]>(() => {
    try {
      const stored: unknown = JSON.parse(window.localStorage.getItem('kinetik-workout-history') ?? '[]');
      return Array.isArray(stored) ? stored.filter((entry: unknown): entry is CompletedWorkoutRecord => entry !== null && typeof entry === 'object' && 'id' in entry && 'completedAt' in entry && 'dayLabel' in entry && 'goal' in entry).slice(0, 12) : [];
    } catch { return []; }
  });
  const [showPlan, setShowPlan] = useState(false);
  const [templateName, setTemplateName] = useState('My training week');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<SavedWorkoutTemplate[]>(() => {
    try {
      const stored: unknown = JSON.parse(window.localStorage.getItem('kinetik-workout-templates') ?? '[]');
      if (!Array.isArray(stored)) return [];
      return stored.filter((entry: unknown): entry is SavedWorkoutTemplate => entry !== null && typeof entry === 'object'
        && 'id' in entry && typeof entry.id === 'string' && 'name' in entry && typeof entry.name === 'string'
        && 'goal' in entry && 'level' in entry && 'gear' in entry && 'days' in entry && 'minutes' in entry
        && 'intensity' in entry && 'location' in entry && 'availableDays' in entry && 'avoidedIds' in entry).slice(0, 8);
    } catch { return []; }
  });
  const [weekKey] = useState(currentWeekKey);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const stored: unknown = JSON.parse(window.localStorage.getItem('kinetik-session-progress') ?? '[]');
      return Array.isArray(stored) ? stored.filter((value): value is string => typeof value === 'string') : [];
    } catch {
      return [];
    }
  });

  const totalMoves = useMemo(() => plan.reduce((count, day) => count + day.exercises.length, 0), [plan]);
  const sessionKeys = useMemo(() => plan.map((day) => [weekKey, goal, gear, day.label].join(':')), [plan, weekKey, goal, gear]);
  const completedCount = sessionKeys.filter((key) => completedIds.includes(key)).length;

  useEffect(() => {
    try { window.localStorage.setItem('kinetik-session-progress', JSON.stringify(completedIds)); }
    catch { /* Progress remains available in memory when storage is disabled. */ }
  }, [completedIds]);

  useEffect(() => {
    try { window.localStorage.setItem('kinetik-workout-history', JSON.stringify(history)); }
    catch { /* History remains available in memory if local storage is blocked. */ }
  }, [history]);

  useEffect(() => {
    try { window.localStorage.setItem('kinetik-workout-templates', JSON.stringify(savedTemplates)); }
    catch { /* Saved templates remain usable in memory when storage is disabled. */ }
  }, [savedTemplates]);

  function saveTemplate() {
    const name = templateName.trim();
    if (!name) { setCopyStatus('ENTER A NAME BEFORE SAVING THIS WORKOUT TEMPLATE.'); return; }
    const savedAt = new Date().toISOString();
    const template: SavedWorkoutTemplate = {
      id: savedAt + ':' + name.toLowerCase(),
      name,
      savedAt,
      goal, level, gear, days, minutes, intensity, location,
      avoidedIds: [...avoidedIds],
      availableDays: [...availableDays],
    };
    setSavedTemplates((current) => [template, ...current.filter((item) => item.name.toLowerCase() !== name.toLowerCase())].slice(0, 8));
    setSelectedTemplateId(template.id);
    setCopyStatus('TEMPLATE SAVED IN THIS BROWSER. LOADING IT REBUILDS THE WEEK FROM THE CURRENT EXERCISE CATALOGUE.');
  }

  function loadTemplate() {
    const template = savedTemplates.find((item) => item.id === selectedTemplateId);
    if (!template) { setCopyStatus('CHOOSE A SAVED TEMPLATE FIRST.'); return; }
    setGoal(template.goal); setLevel(template.level); setGear(template.gear); setDays(template.days);
    setMinutes(template.minutes); setIntensity(template.intensity); setLocation(template.location);
    setAvoidedIds([...template.avoidedIds]); setAvailableDays([...template.availableDays]);
    setPlan(buildPlan(template.goal, template.level, template.gear, template.days, template.minutes, template.intensity, template.location, template.avoidedIds, template.availableDays));
    setShowPlan(true);
    setCopyStatus('TEMPLATE LOADED. THE WEEK HAS BEEN REBUILT FROM ITS SAVED PREFERENCES.');
  }

  function deleteTemplate() {
    if (!selectedTemplateId) return;
    setSavedTemplates((current) => current.filter((item) => item.id !== selectedTemplateId));
    setSelectedTemplateId('');
    setCopyStatus('SAVED TEMPLATE REMOVED FROM THIS BROWSER.');
  }

  function completeSession(record: CompletedWorkoutRecord) {
    setHistory((current) => [record, ...current.filter((item) => item.id !== record.id)].slice(0, 12));
    const key = [weekKey, goal, gear, record.dayLabel].join(':');
    setCompletedIds((current) => current.includes(key) ? current : [...current, key]);
    setActiveDay(null);
    setCopyStatus('SESSION FINISHED AND SAVED TO THIS BROWSER.');
  }

  function toggleCompletion(key: string) {
    setCompletedIds((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function resetWeekProgress() {
    const prefix = weekKey + ':';
    setCompletedIds((current) => current.filter((key) => !key.startsWith(prefix)));
    setCopyStatus('WEEKLY CHECKMARKS CLEARED FOR THIS BROWSER.');
  }

  async function copyPlan() {
    const text = ['KINETIK / WEEK PLAN', 'Goal: ' + goal, 'Level: ' + level, 'Equipment: ' + gear, 'Location: ' + location, 'Intensity: ' + intensity, 'Available days: ' + (availableDays.join(', ') || 'Flexible'), 'Avoided movements: ' + (avoidedIds.map((id) => EXERCISES.find((exercise) => exercise.id === id)?.name ?? id).join(', ') || 'None selected'), ''].concat(
      ...plan.map((day) => [day.label + ' — ' + day.theme + ' — ' + day.minutes + ' MIN', ...day.exercises.map((item) => item.name + ' · ' + item.sets + ' sets · ' + item.reps), '']),
    ).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('PLAN COPIED. SAVE IT WHERE YOU KEEP YOUR TRAINING NOTES.');
    } catch {
      setCopyStatus('CLIPBOARD ACCESS IS UNAVAILABLE HERE. YOUR PLAN IS STILL VISIBLE BELOW.');
    }
  }

  function generate() {
    setPlan(buildPlan(goal, level, gear, days, minutes, intensity, location, avoidedIds, availableDays));
    setShowPlan(true);
    setCopyStatus('PLAN BUILT FOR ' + location.toUpperCase() + ' · ' + intensity.toUpperCase() + ' INTENSITY.');
  }

  return (
    <section className="section training-section" id="training" aria-labelledby="training-title">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span>02</span> THE TRAINING DESK</p><h2 id="training-title">A plan that fits<br /><em>your real life.</em></h2></div>
          <p className="section-intro">Choose your goal, the gear you actually have, and the time you can give. Build a practical starting week in seconds.</p>
        </div>
        <div className="builder-panel">
          <div className="builder-controls">
            <div className="field-group"><label htmlFor="goal-select">WHAT ARE WE WORKING TOWARD?</label><select id="goal-select" value={goal} onChange={(event) => setGoal(event.target.value as TrainingGoal)}><option value="Strength">Build strength</option><option value="Muscle">Build muscle</option><option value="Conditioning">Improve conditioning</option><option value="Mobility">Move more freely</option></select></div>
            <div className="field-group"><label htmlFor="level-select">YOUR STARTING POINT</label><select id="level-select" value={level} onChange={(event) => setLevel(event.target.value)}><option>New to training</option><option>Regular</option><option>Experienced</option></select></div>
            <div className="field-group"><label htmlFor="gear-select">AVAILABLE EQUIPMENT</label><select id="gear-select" value={gear} onChange={(event) => setGear(event.target.value as GearOption)}><option>Bodyweight</option><option>Dumbbells</option><option>Resistance bands</option><option>Full gym</option></select></div>
            <div className="field-group"><label htmlFor="location-select">TRAINING LOCATION</label><select id="location-select" value={location} onChange={(event) => setLocation(event.target.value as 'Home' | 'Gym' | 'Outdoors')}><option>Home</option><option>Gym</option><option>Outdoors</option></select></div>
            <div className="field-group"><label htmlFor="intensity-select">PREFERRED INTENSITY</label><select id="intensity-select" value={intensity} onChange={(event) => setIntensity(event.target.value as 'Low' | 'Moderate' | 'High')}><option>Low</option><option>Moderate</option><option>High</option></select></div>
            <div className="field-group"><label htmlFor="days-select">SESSIONS EACH WEEK</label><select id="days-select" value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={2}>2 sessions</option><option value={3}>3 sessions</option><option value={4}>4 sessions</option><option value={5}>5 sessions</option></select></div>
            <div className="field-group"><label htmlFor="minutes-select">TIME PER SESSION</label><select id="minutes-select" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))}><option value={25}>25 minutes</option><option value={40}>40 minutes</option><option value={55}>55 minutes</option></select></div>
            <div className="field-group"><span className="field-label">AVAILABLE TRAINING DAYS</span><div className="weekday-choice">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((weekday) => <label key={weekday}><input type="checkbox" checked={availableDays.includes(weekday)} onChange={(event) => setAvailableDays((current) => event.target.checked ? [...current, weekday] : current.filter((day) => day !== weekday))} /><span>{weekday}</span></label>)}</div><small className="field-help">The plan uses selected days, up to your session count. Select extra days to create the full week.</small></div>
            <div className="field-group"><label htmlFor="avoid-select">MOVEMENTS TO AVOID</label><select id="avoid-select" multiple size={4} value={avoidedIds} onChange={(event) => setAvoidedIds(Array.from(event.currentTarget.selectedOptions, (option) => option.value))}>{EXERCISES.map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}</select><small className="field-help">Use Ctrl (Windows) or Command (Mac) to choose more than one. Generate again to apply.</small></div>
            <button className="button button-primary builder-generate" type="button" onClick={generate}>BUILD MY WEEK <span aria-hidden="true">↗</span></button>
          </div>
          <div className="builder-result" aria-live="polite">
            <div className="result-topline"><span>YOUR STARTER WEEK</span><span>{plan.length} SESSIONS / {totalMoves} MOVEMENT SLOTS · {intensity.toUpperCase()}</span></div>
            <div className="progress-summary">
              <div className="progress-summary-label"><strong>{completedCount} / {plan.length}</strong><span>SESSIONS COMPLETED THIS WEEK</span></div>
              <div className="progress-track" role="progressbar" aria-label="Weekly sessions completed" aria-valuemin={0} aria-valuemax={plan.length} aria-valuenow={completedCount}><span style={{ width: (completedCount / Math.max(1, plan.length) * 100) + '%' }} /></div>
              <button className="reset-progress" type="button" onClick={resetWeekProgress}>RESET WEEK</button>
            </div>
            <div className="workout-days">
              {plan.map((day, dayIndex) => {
                const arenaMove = day.exercises.map((exercise) => ARENA_MOVE_FOR_EXERCISE[exercise.id]).find((move): move is MoveId => Boolean(move));
                return (
                <article className={completedIds.includes(sessionKeys[dayIndex]) ? 'workout-day is-complete' : 'workout-day'} key={day.label}>
                  <div className="workout-day-head"><span>{day.label}</span><small>{day.theme}</small></div>
                  <h3>{goal === 'Conditioning' ? 'Conditioning set' : goal === 'Mobility' ? 'Mobility flow' : 'Strength session'}</h3>
                  <p className="day-duration">{day.minutes} MINUTES <span>·</span> {level.toUpperCase()}</p>
                  <ol>{day.exercises.map((exercise) => <li key={exercise.id}><span>{exercise.name}</span><small>{exercise.sets} × {exercise.reps}</small></li>)}</ol>
                  <button className={completedIds.includes(sessionKeys[plan.indexOf(day)]) ? 'session-done-button is-done' : 'session-done-button'} type="button" aria-pressed={completedIds.includes(sessionKeys[plan.indexOf(day)])} onClick={() => toggleCompletion(sessionKeys[plan.indexOf(day)])}>
                    {completedIds.includes(sessionKeys[plan.indexOf(day)]) ? 'SESSION COMPLETED' : 'MARK SESSION DONE'} <span aria-hidden="true">{completedIds.includes(sessionKeys[plan.indexOf(day)]) ? '✓' : '＋'}</span>
                  </button>
                  <button className="session-start-day" type="button" onClick={() => setActiveDay(day)}>START THIS SESSION <span aria-hidden="true">▶</span></button>
                  {onStartIn3D && arenaMove && <button className="session-start-3d" type="button" aria-label={'Open ' + ARENA_MOVE_LABELS[arenaMove] + ' in the 3D studio'} onClick={() => onStartIn3D(arenaMove)}><span className="session-start-3d-label">OPEN IN 3D STUDIO<small>{ARENA_MOVE_LABELS[arenaMove]}</small></span><span className="session-start-3d-arrow" aria-hidden="true">↗</span></button>}
                </article>
                );
              })}
            </div>
            <div className="workout-template-tools" aria-labelledby="workout-template-title">
              <div className="workout-template-heading"><div><p className="template-kicker">REUSABLE PROGRAMMING</p><h3 id="workout-template-title">Save this week as a template.</h3></div><span>{savedTemplates.length} / 8 SAVED</span></div>
              <div className="workout-template-controls">
                <label><span>TEMPLATE NAME</span><input value={templateName} maxLength={48} onChange={(event) => setTemplateName(event.target.value)} aria-label="Workout template name" placeholder="My training week" /></label>
                <button className="button button-quiet" type="button" onClick={saveTemplate}>SAVE TEMPLATE <span aria-hidden="true">＋</span></button>
                <label><span>SAVED TEMPLATES</span><select aria-label="Select saved workout template" value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)}><option value="">Choose a template</option>{savedTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select></label>
                <button className="button button-quiet" type="button" disabled={!selectedTemplateId} onClick={loadTemplate}>LOAD</button>
                <button className="template-delete-button" type="button" disabled={!selectedTemplateId} onClick={deleteTemplate}>DELETE</button>
              </div>
              <p className="workout-template-note">Templates save preferences in this browser and regenerate sessions from the current movement catalogue; they are not synced between devices.</p>
            </div>
            <div className="workout-history">
              <div className="workout-history-header"><h3>Recent training history</h3><span>{history.length} SAVED LOCALLY / MAX 12</span></div>
              {history.length === 0 ? <p className="workout-history-empty">Completed sessions will appear here after you start and finish a workout. Records stay in this browser.</p> : <div className="workout-history-list">{history.slice(0, 5).map((record) => <article className="workout-history-entry" key={record.id}><div><strong>{record.dayLabel} / {record.goal} session</strong><small>{new Date(record.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {record.exerciseCount} movements · {record.minutes} min recorded</small></div><span>{String(record.exerciseCount).padStart(2, '0')}</span></article>)}</div>}
            </div>
            <ProgressDashboard history={history} />
            <div className="result-actions"><p>Rule-based demo plan. Adjust loads, technique and recovery to your needs; this is not medical advice or a remote AI coach.</p><button className="button button-quiet" type="button" onClick={copyPlan}>COPY WEEK <span aria-hidden="true">↗</span></button></div>
            {copyStatus && <p className="inline-status" role="status">{copyStatus}</p>}
            {showPlan && <p className="inline-status" role="status">WEEK UPDATED FOR {goal.toUpperCase()} · {plan.length} SESSIONS · {location.toUpperCase()} · {gear.toUpperCase()}.</p>}
          </div>
        </div>
      </div>
      {activeDay && <WorkoutSession key={activeDay.label + ':' + goal + ':' + gear} day={activeDay} goal={goal} gear={gear} onClose={() => setActiveDay(null)} onComplete={completeSession} />}
    </section>
  );
}
