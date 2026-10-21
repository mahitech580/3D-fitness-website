import { useMemo } from 'react';
import type { CompletedWorkoutRecord } from './WorkoutSession';
import '../styles/progress-dashboard.css';

function weekStart(value: Date): Date {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

export function ProgressDashboard({ history }: { history: CompletedWorkoutRecord[] }) {
  const totals = useMemo(() => ({
    sessions: history.length,
    movements: history.reduce((sum, record) => sum + (Number.isFinite(record.exerciseCount) ? record.exerciseCount : 0), 0),
    plannedMinutes: history.reduce((sum, record) => sum + (Number.isFinite(record.minutes) ? record.minutes : 0), 0),
  }), [history]);

  const weeks = useMemo(() => {
    const currentMonday = weekStart(new Date());
    return Array.from({ length: 5 }, (_, index) => {
      const start = new Date(currentMonday);
      start.setDate(currentMonday.getDate() - ((4 - index) * 7));
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      const count = history.filter((record) => {
        const completedAt = new Date(record.completedAt);
        return !Number.isNaN(completedAt.getTime()) && completedAt >= start && completedAt < end;
      }).length;
      return { label: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), count };
    });
  }, [history]);

  const maxCount = Math.max(1, ...weeks.map((week) => week.count));

  return (
    <section className="progress-dashboard" aria-labelledby="progress-dashboard-title">
      <div className="progress-dashboard-head">
        <div><p className="progress-dashboard-kicker">YOUR RECORDED WORK</p><h3 id="progress-dashboard-title">Progress, not guesswork.</h3></div>
        <span className="progress-dashboard-source">BROWSER-LOCAL RECORDS · MAX 12 SESSIONS</span>
      </div>
      {history.length === 0 ? (
        <div className="progress-dashboard-empty"><strong>Your first session starts the timeline.</strong><p>Finish a workout to see completed sessions, movement totals and weekly activity here. No sample statistics are displayed.</p></div>
      ) : (
        <>
          <div className="progress-stat-grid">
            <article className="progress-stat"><span>SESSIONS SAVED</span><strong>{totals.sessions}</strong><small>Recent completed records</small></article>
            <article className="progress-stat"><span>MOVEMENTS COMPLETED</span><strong>{totals.movements}</strong><small>Across saved sessions</small></article>
            <article className="progress-stat"><span>PLANNED TRAINING TIME</span><strong>{totals.plannedMinutes}<i> min</i></strong><small>Duration assigned to saved plans</small></article>
          </div>
          <div className="progress-week-chart" role="img" aria-label={'Completed saved sessions by week: ' + weeks.map((week) => week.label + ', ' + week.count).join('; ')}>
            <div className="progress-week-chart-head"><strong>WEEKLY SESSION HISTORY</strong><span>COUNT OF SAVED COMPLETIONS</span></div>
            <div className="progress-week-bars">
              {weeks.map((week) => <div className="progress-week-column" key={week.label}><span className="progress-week-count">{week.count}</span><div className="progress-week-track"><span style={{ height: Math.max(5, week.count / maxCount * 100) + '%' }} /></div><span className="progress-week-label">{week.label}</span></div>)}
            </div>
          </div>
        </>
      )}
      <p className="progress-dashboard-note">Records are stored in this browser only. The list is capped at the 12 most recent sessions; planned minutes are not a measured workout timer or a health metric.</p>
    </section>
  );
}
