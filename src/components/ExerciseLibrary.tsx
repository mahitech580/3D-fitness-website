import { useMemo, useState } from 'react';
import { EXERCISES, EXERCISE_DETAILS, type GearOption } from '../data/exercises';

const categories = ['All', 'Strength', 'Conditioning', 'Mobility'] as const;
const difficulties = ['All levels', 'Beginner', 'Intermediate', 'Advanced'] as const;
const movementTypes = ['All patterns', 'Compound', 'Isolation', 'Cardio', 'Mobility'] as const;
const sortOptions = ['Recommended', 'Name A–Z', 'Shortest first'] as const;
type CategoryFilter = typeof categories[number];
type DifficultyFilter = typeof difficulties[number];
type MovementFilter = typeof movementTypes[number];
type SortOption = typeof sortOptions[number];
const muscleOptions = Array.from(new Set(EXERCISES.flatMap((exercise) => EXERCISE_DETAILS[exercise.id]?.primaryMuscles ?? [exercise.focus]))).sort();

export function ExerciseLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [gear, setGear] = useState<'All gear' | GearOption>('All gear');
  const [muscle, setMuscle] = useState('All muscles');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All levels');
  const [movement, setMovement] = useState<MovementFilter>('All patterns');
  const [sort, setSort] = useState<SortOption>('Recommended');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = EXERCISES.filter((exercise) => {
      const details = EXERCISE_DETAILS[exercise.id];
      const searchText = [exercise.name, exercise.focus, exercise.cue, exercise.gear.join(' '), details?.primaryMuscles.join(' '), details?.secondaryMuscles.join(' '), details?.instructions.join(' '), details?.commonMistakes.join(' '), details?.alternatives.join(' ')].filter(Boolean).join(' ').toLowerCase();
      const categoryMatch = category === 'All' || exercise.category === category;
      const gearMatch = gear === 'All gear' || exercise.gear.includes(gear) || (gear !== 'Full gym' && exercise.gear.includes('Bodyweight'));
      const muscleMatch = muscle === 'All muscles' || (details?.primaryMuscles ?? []).includes(muscle);
      const difficultyMatch = difficulty === 'All levels' || details?.difficulty === difficulty;
      const movementMatch = movement === 'All patterns' || details?.movementType === movement;
      return categoryMatch && gearMatch && muscleMatch && difficultyMatch && movementMatch && (!term || searchText.includes(term));
    });
    if (sort === 'Name A–Z') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'Shortest first') result.sort((a, b) => a.duration - b.duration || a.name.localeCompare(b.name));
    return result;
  }, [query, category, gear, muscle, difficulty, movement, sort]);

  return (
    <section className="section library-section" id="library" aria-labelledby="library-title">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span>03</span> MOVEMENT INDEX</p><h2 id="library-title">Learn the move.<br /><em>Own the basics.</em></h2></div>
          <p className="section-intro">A small, searchable starter library. Each movement includes a focus, suggested set range and one coaching cue.</p>
        </div>
        <div className="library-toolbar">
          <label className="search-control"><span aria-hidden="true">⌕</span><span className="sr-only">Search exercises</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movement, muscle, equipment…" /></label>
          <label className="gear-filter"><span className="sr-only">Filter by equipment</span><select value={gear} onChange={(event) => setGear(event.target.value as 'All gear' | GearOption)}><option>All gear</option><option>Bodyweight</option><option>Dumbbells</option><option>Resistance bands</option><option>Full gym</option></select></label>
          <label className="gear-filter"><span className="sr-only">Filter by primary muscle group</span><select value={muscle} onChange={(event) => setMuscle(event.target.value)}><option>All muscles</option>{muscleOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="gear-filter"><span className="sr-only">Filter by difficulty</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)}>{difficulties.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="gear-filter"><span className="sr-only">Filter by movement pattern</span><select value={movement} onChange={(event) => setMovement(event.target.value as MovementFilter)}>{movementTypes.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
        <div className="filter-row" role="group" aria-label="Filter exercise category">
          {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} className={category === item ? 'filter-chip is-active' : 'filter-chip'} onClick={() => setCategory(item)}>{item.toUpperCase()}</button>)}
          <label className="library-sort"><span className="sr-only">Sort movements</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>{sortOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <span className="filter-count">{filtered.length} MOVES</span>
        </div>
        <div className="exercise-grid">
          {filtered.map((exercise, index) => {
            const details = EXERCISE_DETAILS[exercise.id];
            return <article className={expanded === exercise.id ? 'exercise-card is-expanded' : 'exercise-card'} key={exercise.id}>
              <div className="exercise-card-top"><span>MOVE / {String(index + 1).padStart(2, '0')}</span><span className="exercise-category">{exercise.category}</span></div>
              <div className="exercise-glyph" aria-hidden="true"><span>{exercise.category === 'Mobility' ? '↗' : exercise.category === 'Conditioning' ? 'ϟ' : '＋'}</span><i>{String(index + 1).padStart(2, '0')}</i></div>
              <h3>{exercise.name}</h3>
              <p className="exercise-focus">{exercise.focus}</p>
              <div className="exercise-meta"><span>{exercise.sets} SETS</span><span>{exercise.reps} REPS / TIME</span><span>{details?.difficulty ?? 'General'} / {details?.movementType ?? exercise.category}</span><span>PRIMARY · {(details?.primaryMuscles ?? [exercise.focus]).join(' / ')}</span></div>
              <button className="exercise-details-toggle" type="button" aria-expanded={expanded === exercise.id} onClick={() => setExpanded((current) => current === exercise.id ? null : exercise.id)}>{expanded === exercise.id ? 'CLOSE CUE' : 'FORM CUE'} <span aria-hidden="true">{expanded === exercise.id ? '−' : '+'}</span></button>
              {expanded === exercise.id && <div className="exercise-cue"><p>{exercise.cue}</p><span>REST GUIDE · {exercise.rest}</span><span>GEAR · {exercise.gear.join(' / ')}</span><span>SECONDARY · {(details?.secondaryMuscles ?? []).join(' / ') || 'Not specified'}</span><div className="exercise-detail-group"><strong>TECHNIQUE</strong><ol>{(details?.instructions ?? [exercise.cue]).map((instruction) => <li key={instruction}>{instruction}</li>)}</ol></div><div className="exercise-detail-group"><strong>COMMON MISTAKES</strong><ul>{(details?.commonMistakes ?? ['Move with control and stay within a comfortable range.']).map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></div><div className="exercise-detail-group"><strong>RELATED MOVEMENTS</strong><p>{(details?.alternatives ?? []).map((id) => EXERCISES.find((item) => item.id === id)?.name ?? id).join(' · ') || 'No alternatives listed yet.'}</p></div></div>}
            </article>;
          })}
          {filtered.length === 0 && <div className="empty-library"><h3>No movements found.</h3><p>Try a broader search or reset the equipment and category filters.</p><button type="button" className="button button-quiet" onClick={() => { setQuery(''); setCategory('All'); setGear('All gear'); setMuscle('All muscles'); setDifficulty('All levels'); setMovement('All patterns'); setSort('Recommended'); }}>RESET FILTERS</button></div>}
        </div>
        <p className="section-footnote">Training suggestions are general information. Choose appropriate loads, use stable equipment, and stop if a movement causes pain.</p>
      </div>
    </section>
  );
}
