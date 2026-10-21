import { useEffect, useMemo, useRef, useState } from 'react';

type JumpTarget = { id: string; title: string; eyebrow: string; description: string; keywords: string };

const targets: JumpTarget[] = [
  { id: 'home', title: 'The beginning', eyebrow: '00 / INTRODUCTION', description: 'Return to the porcelain dragon and opening story.', keywords: 'home hero ritually beginning dragon' },
  { id: 'listen', title: 'The listening room', eyebrow: '01 / LISTEN', description: 'Slow down and pay attention to the ordinary.', keywords: 'listen sound attention wonder' },
  { id: 'culture', title: 'Culture & makers', eyebrow: '02 / NOTEBOOK', description: 'Explore materials, rituals, places, and memory.', keywords: 'culture makers objects memory material ritual place' },
  { id: 'learn', title: 'A slower kind of learning', eyebrow: '03 / LEARN', description: 'Three ways to look closer: material, ritual, attention.', keywords: 'learn study material ritual attention' },
  { id: 'reserve', title: 'Reserve a moment', eyebrow: '04 / CONTACT', description: 'Prepare a note for a possible studio conversation.', keywords: 'reserve contact note collaboration message' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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
              <p id="command-title">THE KAIRO INDEX <span> / NAVIGATION</span></p>
              <button type="button" onClick={() => setOpen(false)} className="command-close">CLOSE <span aria-hidden="true">×</span></button>
            </div>
            <label className="command-search">
              <span className="visually-hidden">Search page sections</span>
              <span aria-hidden="true">⌕</span>
              <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a section, idea, or word…" autoComplete="off" />
              <kbd>ESC</kbd>
            </label>
            <div className="command-results" role="listbox" aria-label="Page destinations">
              {filteredTargets.map((target) => (
                <button className="command-result" type="button" role="option" aria-selected="false" key={target.id} onClick={() => jumpTo(target.id)}>
                  <span className="command-result-index">{target.eyebrow}</span>
                  <span className="command-result-copy"><strong>{target.title}</strong><small>{target.description}</small></span>
                  <span className="command-result-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
              {filteredTargets.length === 0 && <p className="command-empty" role="status">No section matches. Try “ritual”, “learn”, or “contact”.</p>}
            </div>
            <p className="command-hint">MOVE THROUGH THE STUDIO <span>·</span> CTRL / ⌘ + K TO TOGGLE</p>
          </section>
        </div>
      )}
    </>
  );
}
