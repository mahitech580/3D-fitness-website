import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

function SectionEyebrow({ number, label }: { number: string; label: string }) {
  return <p className="section-eyebrow"><span>{number}</span><span>{label}</span></p>;
}
type JournalEntry = { id: string; title: string; detail: string; category: string; summary: string; body: string };
const journalEntries: JournalEntry[] = [
  { id: 'objects', title: 'The quiet language of objects', detail: 'MATERIAL / MEMORY', category: 'MATERIAL', summary: 'Why well-used things can hold a life inside their surfaces.', body: 'An object rarely begins and ends at the moment it is made. A cup carries the pressure of the hand that shaped it, the heat of the kiln, the marks of daily use, and the small ceremonies that gather around it. To look closely is to notice those layers without asking them to become something else.' },
  { id: 'table', title: 'A table set for slowing down', detail: 'RITUAL / EVERYDAY', category: 'RITUAL', summary: 'How a repeated gesture can make a little space in the day.', body: 'A ritual does not need a grand occasion. It can be the pause before pouring tea, the arrangement of a plate, or setting aside a phone while people speak. Repetition gives these gestures a shape; attention gives them meaning. The table becomes less a surface and more an invitation to arrive.' },
  { id: 'rain', title: 'Blue, borrowed from the rain', detail: 'COLOUR / PLACE', category: 'PLACE', summary: 'Following cobalt from mineral pigment into changing light.', body: 'Blue changes with its surroundings. On white porcelain it can feel precise and almost architectural; against a wet street it becomes soft and uncertain. The same pigment meets different light, material, and memory. The colour becomes a conversation between a thing and the place where it is seen.' },
];


export function StudioSections() {
  const [submitted, setSubmitted] = useState(false);
  const [journalQuery, setJournalQuery] = useState('');
  const [journalCategory, setJournalCategory] = useState('ALL');
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (!selectedJournal) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelectedJournal(null);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedJournal]);

  const normalizedQuery = journalQuery.trim().toLowerCase();
  const visibleJournalEntries = journalEntries.filter((entry) => {
    const matchesCategory = journalCategory === 'ALL' || entry.category === journalCategory;
    const haystack = (entry.title + ' ' + entry.detail + ' ' + entry.summary + ' ' + entry.body).toLowerCase();
    return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="editorial-content">
      <section className="editorial-section listen-section" id="listen" aria-labelledby="listen-title">
        <div className="section-inner listen-inner">
          <SectionEyebrow number="01" label="THE LISTENING ROOM" />
          <div className="listen-layout">
            <motion.h2 id="listen-title" className="section-heading" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8 }}>A little more<br /><em>room for wonder.</em></motion.h2>
            <div className="section-copy">
              <p className="copy-lead">Some things ask to be noticed slowly.</p>
              <p>A listening room for small discoveries: the hush before a cup is poured, rain crossing a tiled roof, the voices and gestures that turn an ordinary moment into a ritual.</p>
              <a className="text-link" href="#culture">WANDER INTO CULTURE <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="soundline" aria-hidden="true"><svg viewBox="0 0 1100 110" preserveAspectRatio="none"><path d="M0 56 C35 56 35 40 61 56 S89 85 112 56 S142 25 165 56 S194 73 218 56 S250 37 273 56 S301 92 327 56 S354 15 381 56 S409 80 432 56 S462 34 487 56 S516 69 541 56 S569 9 595 56 S624 93 648 56 S677 35 702 56 S732 81 756 56 S784 20 810 56 S840 74 865 56 S895 32 921 56 S949 88 973 56 S1002 35 1028 56 S1070 56 1100 56" /></svg></div>
          <p className="soundline-caption">LISTEN CLOSELY. THE WORLD IS ALWAYS SPEAKING.</p>
        </div>
      </section>

      <section className="editorial-section culture-section" id="culture" aria-labelledby="culture-title">
        <div className="section-inner">
          <SectionEyebrow number="02" label="CULTURE & MAKERS" />
          <div className="culture-headline-row">
            <h2 id="culture-title" className="section-heading">Made by hand.<br /><em>Held by memory.</em></h2>
            <p className="culture-intro">An ever-growing notebook of objects, gestures, makers, and places that remind us what care can look like.</p>
          </div>
          <div className="journal-tools">
            <label htmlFor="journal-search">FIND A NOTE</label>
            <input id="journal-search" type="search" value={journalQuery} onChange={(event) => setJournalQuery(event.target.value)} placeholder="Search words, rituals, materials…" autoComplete="off" />
            <div className="journal-filters" role="group" aria-label="Filter notebook by theme">
              {['ALL', 'MATERIAL', 'RITUAL', 'PLACE'].map((category) => (
                <button key={category} type="button" aria-pressed={journalCategory === category} className={journalCategory === category ? 'is-active' : undefined} onClick={() => setJournalCategory(category)}>{category}</button>
              ))}
            </div>
          </div>
          <div className="journal-list">
            {visibleJournalEntries.map((entry, index) => (
              <button className="journal-entry journal-entry-button" type="button" key={entry.id} onClick={() => setSelectedJournal(entry)} aria-label={'Read: ' + entry.title}>
                <span className="journal-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="journal-title-wrap"><span className="journal-title">{entry.title}</span><span className="journal-summary">{entry.summary}</span></span>
                <span className="journal-detail">{entry.detail}</span><span className="journal-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
            {visibleJournalEntries.length === 0 && <p className="journal-empty" role="status">No notebook pages match that search. Try a different word or choose ALL.</p>}
          </div>
          <p className="journal-note">{visibleJournalEntries.length} OF {journalEntries.length} NOTEBOOK PAGES SHOWN — SELECT A PAGE TO READ.</p>
          {selectedJournal && (
            <div className="journal-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedJournal(null); }}>
              <article className="journal-dialog" role="dialog" aria-modal="true" aria-labelledby="journal-dialog-title">
                <div className="journal-dialog-top"><span>{selectedJournal.detail}</span><button type="button" autoFocus onClick={() => setSelectedJournal(null)}>CLOSE <span aria-hidden="true">×</span></button></div>
                <p className="section-eyebrow"><span>NOTEBOOK</span><span>{selectedJournal.category}</span></p>
                <h3 id="journal-dialog-title">{selectedJournal.title}</h3>
                <p className="journal-dialog-summary">{selectedJournal.summary}</p>
                <p className="journal-dialog-body">{selectedJournal.body}</p>
                <button className="text-link journal-dialog-return" type="button" onClick={() => setSelectedJournal(null)}>RETURN TO THE NOTEBOOK <span aria-hidden="true">↗</span></button>
              </article>
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section learn-section" id="learn" aria-labelledby="learn-title">
        <div className="section-inner learn-inner">
          <SectionEyebrow number="03" label="A SLOWER KIND OF LEARNING" />
          <div className="learn-layout">
            <h2 id="learn-title" className="section-heading">Attention is<br /><em>a way of knowing.</em></h2>
            <div className="learn-copy">
              <p>We return to three simple questions: what is it made of, what does it ask of us, and what changes when we give it time?</p>
              <div className="learning-words"><span>Material</span><span>Ritual</span><span>Attention</span></div>
              <a className="text-link" href="#reserve">START A CONVERSATION <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="learn-seal" aria-hidden="true"><span>STUDY</span><span>WITH</span><span>CARE</span><i>✳</i></div>
        </div>
      </section>

      <section className="editorial-section reserve-section" id="reserve" aria-labelledby="reserve-title">
        <div className="section-inner reserve-inner">
          <SectionEyebrow number="04" label="RESERVE A MOMENT" />
          <div className="reserve-layout">
            <div className="reserve-copy">
              <h2 id="reserve-title" className="section-heading">Something worth<br /><em>making room for?</em></h2>
              <p>Leave a note about the idea you have in mind. This form is a local prototype; it will not send or store your message until a delivery service is connected.</p>
            </div>
            <form className="enquiry-form" onSubmit={handleSubmit}>
              <label htmlFor="enquiry-name">YOUR NAME</label>
              <input id="enquiry-name" name="name" autoComplete="name" placeholder="The name you go by" required onChange={() => setSubmitted(false)} />
              <label htmlFor="enquiry-email">EMAIL ADDRESS</label>
              <input id="enquiry-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required onChange={() => setSubmitted(false)} />
              <label htmlFor="enquiry-intention">WHAT ARE YOU THINKING ABOUT?</label>
              <select id="enquiry-intention" name="intention" defaultValue="a-collaboration" onChange={() => setSubmitted(false)}>
                <option value="a-collaboration">A collaboration</option>
                <option value="an-editorial">An editorial idea</option>
                <option value="a-gathering">A gathering or conversation</option>
                <option value="something-else">Something else entirely</option>
              </select>
              <label htmlFor="enquiry-note">A FEW WORDS (OPTIONAL)</label>
              <textarea id="enquiry-note" name="note" rows={3} placeholder="A small beginning is enough." onChange={() => setSubmitted(false)} />
              <button className="form-submit" type="submit">PREPARE NOTE <span aria-hidden="true">↗</span></button>
              {submitted && <p className="form-status" role="status">Your note is ready in this prototype, but has not been sent. Connect a delivery endpoint to receive enquiries.</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
