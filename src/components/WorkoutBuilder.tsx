import { useMemo, useState } from 'react';
import { EXERCISES, gearMatches, type Exercise, type GearOption, type TrainingGoal } from '../data/exercises';

type WorkoutDay = { label: string; theme: string; exercises: Exercise[]; minutes: number };

function currentWeekKey(): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return String(date.getFullYear()) + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function buildPlan(goal: TrainingGoal, level: string, gear: GearOption, days: number, minutes: number): WorkoutDay[] {
  const eligible = EXERCISES.filter((exercise) => exercise.goals.includes(goal) && gearMatches(exercise, gear));
  const fallback = EXERCISES.filter((exercise) => gearMatches(exercise, gear));
  const source = eligible.length >= 4 ? eligible : fallback;
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const sessionCount = Math.min(days, 5);
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
      sets: level === 'New to training' ? '2' : level === 'Experienced' ? '4' : exercise.sets,
    }));
    result.push({
      label: weekdays[Math.round(day * 6 / Math.max(1, sessionCount - 1))],
      theme: goal === 'Conditioning' ? (day % 2 === 0 ? 'ENGINE / INTERVALS' : 'PACE / CAPACITY') : goal === 'Mobility' ? 'RANGE / CONTROL' : (day % 2 === 0 ? 'FOUNDATION / A' : 'FOUNDATION / B'),
      exercises: adjusted,
      minutes,
    });
  }
  return result;
}

export function WorkoutBuilder() {
  const [goal, setGoal] = useState<TrainingGoal>('Strength');
  const [level, setLevel] = useState('Regular');
  const [gear, setGear] = useState<GearOption>('Dumbbells');
  const [days, setDays] = useState(3);
  const [minutes, setMinutes] = useState(40);
  const [plan, setPlan] = useState<WorkoutDay[]>(() => buildPlan('Strength', 'Regular', 'Dumbbells', 3, 40));
  const [copyStatus, setCopyStatus] = useState('');
  const [showPlan, setShowPlan] = useState(false);
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

  useMemo(() => completedCount / Math.max(1, plan.length) * 100, [completedCount, plan.length]);

  useMemo(() => {
    try { window.localStorage.setItem('kinetik-session-progress', JSON.stringify(completedIds)); }
    catch { /* Progress remains available in memory when storage is disabled. */ }
    return completedIds.length;
  }, [completedIds]);

  function toggleCompletion(key: string) {
    setCompletedIds((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function resetWeekProgress() {
    const prefix = weekKey + ':';
    setCompletedIds((current) => current.filter((key) => !key.startsWith(prefix)));
    setCopyStatus('WEEKLY CHECKMARKS CLEARED FOR THIS BROWSER.');
  }

  async function copyPlan() {
    const text = ['KINETIK / WEEK PLAN', 'Goal: ' + goal, 'Level: ' + level, 'Equipment: ' + gear, ''].concat(
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
    setPlan(buildPlan(goal, level, gear, days, minutes));
    setShowPlan(true);
    setCopyStatus('');
  }

  return (
    <section className="section training-section" id="training" aria-labelledby="training-title">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span>01</span> THE TRAINING DESK</p><h2 id="training-title">A plan that fits<br /><em>your real life.</em></h2></div>
          <p className="section-intro">Choose your goal, the gear you actually have, and the time you can give. Build a practical starting week in seconds.</p>
        </div>
        <div className="builder-panel">
          <div className="builder-controls">
            <div className="field-group"><label htmlFor="goal-select">WHAT ARE WE WORKING TOWARD?</label><select id="goal-select" value={goal} onChange={(event) => setGoal(event.target.value as TrainingGoal)}><option value="Strength">Build strength</option><option value="Muscle">Build muscle</option><option value="Conditioning">Improve conditioning</option><option value="Mobility">Move more freely</option></select></div>
            <div className="field-group"><label htmlFor="level-select">YOUR STARTING POINT</label><select id="level-select" value={level} onChange={(event) => setLevel(event.target.value)}><option>New to training</option><option>Regular</option><option>Experienced</option></select></div>
            <div className="field-group"><label htmlFor="gear-select">AVAILABLE EQUIPMENT</label><select id="gear-select" value={gear} onChange={(event) => setGear(event.target.value as GearOption)}><option>Bodyweight</option><option>Dumbbells</option><option>Resistance bands</option><option>Full gym</option></select></div>
            <div className="field-group"><label htmlFor="days-select">SESSIONS EACH WEEK</label><select id="days-select" value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={2}>2 sessions</option><option value={3}>3 sessions</option><option value={4}>4 sessions</option><option value={5}>5 sessions</option></select></div>
            <div className="field-group"><label htmlFor="minutes-select">TIME PER SESSION</label><select id="minutes-select" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))}><option value={25}>25 minutes</option><option value={40}>40 minutes</option><option value={55}>55 minutes</option></select></div>
            <button className="button button-primary builder-generate" type="button" onClick={generate}>BUILD MY WEEK <span aria-hidden="true">↗</span></button>
          </div>
          <div className="builder-result" aria-live="polite">
            <div className="result-topline"><span>YOUR STARTER WEEK</span><span>{plan.length} SESSIONS / {totalMoves} MOVEMENT SLOTS</span></div>
            <div className="progress-summary">
              <div className="progress-summary-label"><strong>{completedCount} / {plan.length}</strong><span>SESSIONS COMPLETED THIS WEEK</span></div>
              <div className="progress-track" role="progressbar" aria-label="Weekly sessions completed" aria-valuemin={0} aria-valuemax={plan.length} aria-valuenow={completedCount}><span style={{ width: (completedCount / Math.max(1, plan.length) * 100) + '%' }} /></div>
              <button className="reset-progress" type="button" onClick={resetWeekProgress}>RESET WEEK</button>
            </div>
            <div className="workout-days">
              {plan.map((day) => (
                <article className={completedIds.includes(sessionKeys[plan.indexOf(day)]) ? 'workout-day is-complete' : 'workout-day'} key={day.label}>
                  <div className="workout-day-head"><span>{day.label}</span><small>{day.theme}</small></div>
                  <h3>{goal === 'Conditioning' ? 'Conditioning set' : goal === 'Mobility' ? 'Mobility flow' : 'Strength session'}</h3>
                  <p className="day-duration">{day.minutes} MINUTES <span>·</span> {level.toUpperCase()}</p>
                  <ol>{day.exercises.map((exercise) => <li key={exercise.id}><span>{exercise.name}</span><small>{exercise.sets} × {exercise.reps}</small></li>)}</ol>
                  <button className={completedIds.includes(sessionKeys[plan.indexOf(day)]) ? 'session-done-button is-done' : 'session-done-button'} type="button" aria-pressed={completedIds.includes(sessionKeys[plan.indexOf(day)])} onClick={() => toggleCompletion(sessionKeys[plan.indexOf(day)])}>
                    {completedIds.includes(sessionKeys[plan.indexOf(day)]) ? 'SESSION COMPLETED' : 'MARK SESSION DONE'} <span aria-hidden="true">{completedIds.includes(sessionKeys[plan.indexOf(day)]) ? '✓' : '＋'}</span>
                  </button>
                </article>
              ))}
            </div>
            <div className="result-actions"><p>Rule-based demo plan. Adjust loads, technique and recovery to your needs; this is not medical advice or a remote AI coach.</p><button className="button button-quiet" type="button" onClick={copyPlan}>COPY WEEK <span aria-hidden="true">↗</span></button></div>
            {copyStatus && <p className="inline-status" role="status">{copyStatus}</p>}
            {showPlan && <p className="inline-status" role="status">WEEK UPDATED FOR {goal.toUpperCase()} · {days} SESSIONS · {gear.toUpperCase()}.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
