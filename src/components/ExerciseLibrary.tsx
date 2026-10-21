import { useMemo, useState } from 'react';
import { EXERCISES, type GearOption } from '../data/exercises';

const categories = ['All', 'Strength', 'Conditioning', 'Mobility'] as const;
type CategoryFilter = typeof categories[number];

export function ExerciseLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [gear, setGear] = useState<'All gear' | GearOption>('All gear');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return EXERCISES.filter((exercise) => {
      const searchText = (exercise.name + ' ' + exercise.focus + ' ' + exercise.cue + ' ' + exercise.gear.join(' ')).toLowerCase();
      const categoryMatch = category === 'All' || exercise.category === category;
      const gearMatch = gear === 'All gear' || exercise.gear.includes(gear) || (gear !== 'Full gym' && exercise.gear.includes('Bodyweight'));
      return categoryMatch && gearMatch && (!term || searchText.includes(term));
    });
  }, [query, category, gear]);

  return (
    <section className="section library-section" id="library" aria-labelledby="library-title">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span>02</span> MOVEMENT INDEX</p><h2 id="library-title">Learn the move.<br /><em>Own the basics.</em></h2></div>
          <p className="section-intro">A small, searchable starter library. Each movement includes a focus, suggested set range and one coaching cue.</p>
        </div>
        <div className="library-toolbar">
          <label className="search-control"><span aria-hidden="true">⌕</span><span className="sr-only">Search exercises</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movement, muscle, equipment…" /></label>
          <label className="gear-filter"><span className="sr-only">Filter by equipment</span><select value={gear} onChange={(event) => setGear(event.target.value as 'All gear' | GearOption)}><option>All gear</option><option>Bodyweight</option><option>Dumbbells</option><option>Resistance bands</option><option>Full gym</option></select></label>
        </div>
        <div className="filter-row" role="group" aria-label="Filter exercise category">
          {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} className={category === item ? 'filter-chip is-active' : 'filter-chip'} onClick={() => setCategory(item)}>{item.toUpperCase()}</button>)}
          <span className="filter-count">{filtered.length} MOVES</span>
        </div>
        <div className="exercise-grid">
          {filtered.map((exercise, index) => (
            <article className={expanded === exercise.id ? 'exercise-card is-expanded' : 'exercise-card'} key={exercise.id}>
              <div className="exercise-card-top"><span>MOVE / {String(index + 1).padStart(2, '0')}</span><span className="exercise-category">{exercise.category}</span></div>
              <div className="exercise-glyph" aria-hidden="true"><span>{exercise.category === 'Mobility' ? '↗' : exercise.category === 'Conditioning' ? 'ϟ' : '＋'}</span><i>{String(index + 1).padStart(2, '0')}</i></div>
              <h3>{exercise.name}</h3>
              <p className="exercise-focus">{exercise.focus}</p>
              <div className="exercise-meta"><span>{exercise.sets} SETS</span><span>{exercise.reps} REPS / TIME</span></div>
              <button className="exercise-details-toggle" type="button" aria-expanded={expanded === exercise.id} onClick={() => setExpanded((current) => current === exercise.id ? null : exercise.id)}>{expanded === exercise.id ? 'CLOSE CUE' : 'FORM CUE'} <span aria-hidden="true">{expanded === exercise.id ? '−' : '+'}</span></button>
              {expanded === exercise.id && <div className="exercise-cue"><p>{exercise.cue}</p><span>REST GUIDE · {exercise.rest}</span><span>GEAR · {exercise.gear.join(' / ')}</span></div>}
            </article>
          ))}
          {filtered.length === 0 && <div className="empty-library"><h3>No movements found.</h3><p>Try a broader search or reset the equipment and category filters.</p><button type="button" className="button button-quiet" onClick={() => { setQuery(''); setCategory('All'); setGear('All gear'); }}>RESET FILTERS</button></div>}
        </div>
        <p className="section-footnote">Training suggestions are general information. Choose appropriate loads, use stable equipment, and stop if a movement causes pain.</p>
      </div>
    </section>
  );
}
