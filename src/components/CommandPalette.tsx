import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

type JumpTarget = { id: string; title: string; eyebrow: string; description: string; keywords: string };

const targets: JumpTarget[] = [
  { id: 'home', title: 'The beginning', eyebrow: '00 / INTRODUCTION', description: 'Return to the Kinetik training experience.', keywords: 'home hero training kinetik beginning' },
  { id: 'listen', title: 'Training desk', eyebrow: '01 / LISTEN', description: 'Build a starting plan around your time and equipment.', keywords: 'training workout plan strength conditioning' },
  { id: 'culture', title: 'Movement index', eyebrow: '02 / NOTEBOOK', description: 'Search exercises by focus, equipment, and movement type.', keywords: 'library exercises movement strength conditioning mobility' },
  { id: 'learn', title: 'Gym planner', eyebrow: '03 / LEARN', description: 'Place equipment within a measured room sketch.', keywords: 'space room equipment floorplan planner' },
  { id: 'reserve', title: 'First session', eyebrow: '04 / CONTACT', description: 'Prepare a local-only first-session enquiry.', keywords: 'start trial session enquiry' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const filteredTargets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return targets.filter((target) => !normalized || (target.title + ' ' + target.eyebrow + ' ' + target.description + ' ' + target.keywords).toLowerCase().includes(normalized));
  }, [query]);

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && filteredTargets.length > 0) {
      event.preventDefault();
      resultRefs.current[0]?.focus();
    }
  }

  function jumpTo(id: string) {
    setOpen(false);
    window.location.hash = id;
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  }

  return (
    <>
      <button className="command-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Open page navigation, Control or Command K">
        <span>FIND YOUR WAY</span><kbd>⌘ K</kbd>
      </button>
      {open && (
        <div className="command-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title">
            <div className="command-topline">
              <p id="command-title">THE KINETIK INDEX <span> / NAVIGATION</span></p>
              <button type="button" onClick={() => setOpen(false)} className="command-close">CLOSE <span aria-hidden="true">×</span></button>
            </div>
            <label className="command-search">
              <span className="visually-hidden">Search page sections</span>
              <span aria-hidden="true">⌕</span>
              <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search a section, idea, or word…" autoComplete="off" />
              <kbd>ESC</kbd>
            </label>
            <div className="command-results" role="listbox" aria-label="Page destinations">
              {filteredTargets.map((target, index) => (
                <button className="command-result" type="button" role="option" aria-selected="false" key={target.id} ref={(node) => { resultRefs.current[index] = node; }} onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') { event.preventDefault(); resultRefs.current[(index + 1) % filteredTargets.length]?.focus(); }
                  if (event.key === 'ArrowUp') { event.preventDefault(); if (index === 0) inputRef.current?.focus(); else resultRefs.current[index - 1]?.focus(); }
                }} onClick={() => jumpTo(target.id)}>
                  <span className="command-result-index">{target.eyebrow}</span>
                  <span className="command-result-copy"><strong>{target.title}</strong><small>{target.description}</small></span>
                  <span className="command-result-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
              {filteredTargets.length === 0 && <p className="command-empty" role="status">No section matches. Try “ritual”, “learn”, or “contact”.</p>}
            </div>
            <p className="command-hint">↑ / ↓ TO NAVIGATE <span>·</span> CTRL / ⌘ + K TO TOGGLE</p>
          </section>
        </div>
      )}
    </>
  );
}
