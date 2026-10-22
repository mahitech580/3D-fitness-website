import { useMemo, useState } from 'react';
import '../styles/gym-discovery.css';

type ConceptGym = {
  id: string;
  name: string;
  city: 'Hyderabad' | 'Bengaluru' | 'Chennai';
  area: string;
  focus: 'Strength' | 'Conditioning' | 'Mobility';
  summary: string;
  facilities: string[];
  programme: string;
};

const CONCEPT_GYMS: ConceptGym[] = [
  { id: 'hyd-foundry', name: 'THE FOUNDRY', city: 'Hyderabad', area: 'North-city concept', focus: 'Strength', summary: 'A compact strength-floor concept built around progressive basics and free-weight practice.', facilities: ['Squat-rack zone', 'Dumbbell and barbell floor', 'Bench stations', 'Technique-practice area'], programme: 'Strength foundations' },
  { id: 'hyd-tempo', name: 'TEMPO HOUSE', city: 'Hyderabad', area: 'Central-city concept', focus: 'Conditioning', summary: 'A conditioning-first concept for short intervals, steady cardio and simple session structure.', facilities: ['Cardio stations', 'Open conditioning lane', 'Floor mats', 'Warm-up space'], programme: 'Conditioning and capacity' },
  { id: 'blr-form', name: 'FORM WORKS', city: 'Bengaluru', area: 'East-city concept', focus: 'Strength', summary: 'A training-floor concept focused on repeatable strength sessions and a clear equipment layout.', facilities: ['Rack and bench stations', 'Dumbbell storage', 'Open lifting area', 'Mobility corner'], programme: 'Strength and muscle-building' },
  { id: 'blr-pulse', name: 'PULSE YARD', city: 'Bengaluru', area: 'South-city concept', focus: 'Conditioning', summary: 'An open-format conditioning concept with room for rowing, cycling and bodyweight circuits.', facilities: ['Cycle stations', 'Rowing area', 'Bodyweight floor', 'Circuit lane'], programme: 'Intervals and general fitness' },
  { id: 'maa-range', name: 'RANGE STUDIO', city: 'Chennai', area: 'Central-city concept', focus: 'Mobility', summary: 'A quieter movement-space concept for accessible mobility practice, warm-ups and controlled strength.', facilities: ['Training mats', 'Light resistance tools', 'Open floor', 'Recovery corner'], programme: 'Mobility and movement practice' },
  { id: 'maa-base', name: 'BASE CAMP', city: 'Chennai', area: 'West-city concept', focus: 'Strength', summary: 'A general training-space concept with strength, conditioning and beginner-friendly session options.', facilities: ['Free-weight zone', 'Basic cardio', 'Bench stations', 'Open training floor'], programme: 'General fitness foundations' },
];

type CityFilter = 'All cities' | ConceptGym['city'];
type FocusFilter = 'All focuses' | ConceptGym['focus'];

export function GymDiscovery({ onEnquire }: { onEnquire: (gymName: string) => void }) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<CityFilter>('All cities');
  const [focus, setFocus] = useState<FocusFilter>('All focuses');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return CONCEPT_GYMS.filter((gym) => {
      const matchesQuery = !search || [gym.name, gym.city, gym.area, gym.focus, gym.summary, ...gym.facilities].join(' ').toLowerCase().includes(search);
      return matchesQuery && (city === 'All cities' || gym.city === city) && (focus === 'All focuses' || gym.focus === focus);
    });
  }, [query, city, focus]);

  return (
    <section className="section gym-discovery-section" id="gyms" aria-labelledby="gyms-title">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span>04</span> FIND YOUR TRAINING SETUP</p><h2 id="gyms-title">Different spaces.<br /><em>One next step.</em></h2></div>
          <p className="section-intro">Explore sample KINETIK venue concepts by city and training focus, then carry your interest into the first-session enquiry.</p>
        </div>
        <div className="gym-discovery-tools">
          <label className="gym-search-field"><span>SEARCH CONCEPTS</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="City, focus, equipment…" aria-label="Search sample gym concepts" /></label>
          <label className="gym-filter-field"><span>CITY</span><select value={city} onChange={(event) => setCity(event.target.value as CityFilter)}><option>All cities</option><option>Hyderabad</option><option>Bengaluru</option><option>Chennai</option></select></label>
          <label className="gym-filter-field"><span>TRAINING FOCUS</span><select value={focus} onChange={(event) => setFocus(event.target.value as FocusFilter)}><option>All focuses</option><option>Strength</option><option>Conditioning</option><option>Mobility</option></select></label>
          <span className="gym-result-count">{filtered.length} / {CONCEPT_GYMS.length} CONCEPTS</span>
        </div>
        <div className="gym-concept-grid">
          {filtered.map((gym, index) => (
            <article className="gym-concept-card" key={gym.id}>
              <div className="gym-concept-topline"><span>SPACE STUDY / {String(index + 1).padStart(2, '0')}</span><span>{gym.city.toUpperCase()}</span></div>
              <div className={'gym-concept-visual gym-focus-' + gym.focus.toLowerCase()} aria-hidden="true"><span>{gym.focus === 'Strength' ? '↗' : gym.focus === 'Conditioning' ? 'ϟ' : '◎'}</span><i>K / {gym.city.slice(0, 3).toUpperCase()}</i><div className="gym-visual-bars"><b /><b /><b /><b /><b /></div></div>
              <div className="gym-concept-content">
                <p className="gym-concept-area">{gym.area} · SAMPLE CONCEPT</p>
                <h3>{gym.name}</h3>
                <p>{gym.summary}</p>
                <div className="gym-concept-meta"><span>FOCUS</span><strong>{gym.focus}</strong><span>PROGRAMME</span><strong>{gym.programme}</strong></div>
                <button className="gym-details-button" type="button" aria-expanded={expanded === gym.id} onClick={() => setExpanded((value) => value === gym.id ? null : gym.id)}>{expanded === gym.id ? 'HIDE CONCEPT DETAILS' : 'VIEW CONCEPT DETAILS'} <span aria-hidden="true">{expanded === gym.id ? '−' : '+'}</span></button>
                {expanded === gym.id && <div className="gym-facilities-panel"><strong>PLANNED FACILITIES (ILLUSTRATIVE)</strong><ul>{gym.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul><p>No street address, live opening hours, membership price or availability is connected to this concept.</p></div>}
                <a className="gym-enquire-link" href="#start" onClick={() => onEnquire(gym.name + ' — ' + gym.city + ' (sample concept)')}>ENQUIRE ABOUT THIS CONCEPT <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <div className="gym-empty-state"><h3>No concepts match those filters.</h3><p>Try a different search term or reset your city and focus.</p><button className="button button-quiet" type="button" onClick={() => { setQuery(''); setCity('All cities'); setFocus('All focuses'); }}>RESET SEARCH</button></div>}
        </div>
        <p className="gym-data-note">DEMO DIRECTORY · These six venue concepts are sample product data, not verified businesses. No live location search, map, opening hours, membership details, or reservation availability is claimed.</p>
      </div>
    </section>
  );
}
