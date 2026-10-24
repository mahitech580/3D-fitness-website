import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';

const photos = {
  hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85',
  strength: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1100&q=82',
  conditioning: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1100&q=82',
  mobility: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=82',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1300&q=82',
  training: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1500&q=82',
  athlete: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=82',
  ropes: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1000&q=82',
};

type Goal = 'strength' | 'conditioning' | 'mobility';
type PlanResult = { title: string; meta: string; moves: string[] };
type WeekFilter = 'ALL' | 'STRENGTH' | 'ENGINE' | 'RESTORE';

const navLinks = [
  { label: 'The method', href: '#approach' },
  { label: 'Training paths', href: '#programs' },
  { label: 'Weekly rhythm', href: '#weekly' },
  { label: 'Your progress', href: '#tracker' },
];

const programs: Array<{ number: string; title: string; eyebrow: string; goal: Goal; copy: string; image: string; alt: string; time: string; tag: string }> = [
  { number: '01', title: 'Strength', eyebrow: 'BUILD YOUR BASE', goal: 'strength', copy: 'Build confidence with the fundamentals: controlled reps, progressive effort, and technique that stays with you.', image: photos.strength, alt: 'Strength training equipment and athlete in a modern gym', time: '40—60 MIN', tag: 'LIFT' },
  { number: '02', title: 'Conditioning', eyebrow: 'FIND YOUR ENGINE', goal: 'conditioning', copy: 'Mix intervals and steady movement to develop stamina without turning every session into a sprint.', image: photos.conditioning, alt: 'Athlete working through a conditioning session', time: '25—45 MIN', tag: 'MOVE' },
  { number: '03', title: 'Mobility & recovery', eyebrow: 'MAKE ROOM TO RESET', goal: 'mobility', copy: 'Give your joints and movement patterns attention between demanding days. Recovery is part of the work.', image: photos.mobility, alt: 'Person performing a mobility and stretching routine', time: '15—30 MIN', tag: 'RESTORE' },
];

const paths: Record<Goal, { label: string; title: string; statement: string; image: string; imageAlt: string; steps: Array<{ title: string; copy: string }>; note: string }> = {
  strength: {
    label: 'Strength',
    title: 'Get comfortable with getting stronger.',
    statement: 'A steady strength routine starts with movement quality. Build familiarity, add effort gradually, and keep enough in reserve to come back.',
    image: photos.athlete,
    imageAlt: 'Athlete focused on strength training',
    steps: [{ title: 'Learn the pattern', copy: 'Choose controlled squat, hinge, push, and pull variations.' }, { title: 'Repeat with intent', copy: 'Use a load you can manage with consistent technique.' }, { title: 'Progress slowly', copy: 'Add a rep or a little resistance when the session feels ready.' }],
    note: 'FOUNDATION → CONTROL → PROGRESS',
  },
  conditioning: {
    label: 'Conditioning',
    title: 'Build an engine you can rely on.',
    statement: 'Conditioning is not all-out effort every time. Alternate accessible intervals and steady work so your stamina can grow alongside your routine.',
    image: photos.ropes,
    imageAlt: 'Athlete in a functional conditioning workout',
    steps: [{ title: 'Start easy', copy: 'Warm up with a pace that allows smooth movement.' }, { title: 'Find a rhythm', copy: 'Use short work intervals with enough time to recover.' }, { title: 'Finish in control', copy: 'Cool down and leave room to train again.' }],
    note: 'WARM UP → BUILD → RECOVER',
  },
  mobility: {
    label: 'Mobility',
    title: 'Make recovery part of the plan.',
    statement: 'Movement quality improves with attention, not force. Use comfortable ranges, controlled positions, and rest that suits your body.',
    image: photos.mobility,
    imageAlt: 'Person in a controlled stretch in a bright studio',
    steps: [{ title: 'Move gently', copy: 'Choose ranges that feel controlled and comfortable.' }, { title: 'Breathe and hold', copy: 'Use slow repetitions, pauses, and relaxed breathing.' }, { title: 'Return refreshed', copy: 'Keep recovery work supportive rather than exhausting.' }],
    note: 'BREATHE → MOVE → RESET',
  },
};

const weekPlan: Array<{ day: string; title: string; detail: string; type: Exclude<WeekFilter, 'ALL'>; typeLabel: string }> = [
  { day: 'MON', title: 'Lower-body strength', detail: 'Squat pattern · hinge · trunk', type: 'STRENGTH', typeLabel: 'LIFT' },
  { day: 'TUE', title: 'Conditioning intervals', detail: 'Warm-up · comfortable intervals · cool-down', type: 'ENGINE', typeLabel: 'ENGINE' },
  { day: 'WED', title: 'Mobility reset', detail: 'Hips · upper back · ankles', type: 'RESTORE', typeLabel: 'RESTORE' },
  { day: 'THU', title: 'Upper-body strength', detail: 'Push · pull · carry', type: 'STRENGTH', typeLabel: 'LIFT' },
  { day: 'FRI', title: 'Steady movement', detail: 'Walk · cycle · controlled circuit', type: 'ENGINE', typeLabel: 'ENGINE' },
  { day: 'SAT', title: 'Move your way', detail: 'A sport, a walk, or movement you enjoy', type: 'RESTORE', typeLabel: 'OPTIONAL' },
  { day: 'SUN', title: 'Full rest', detail: 'Sleep · meals · reset for the next week', type: 'RESTORE', typeLabel: 'REST' },
];

const faqs = [
  { question: 'Is KINETIK a real gym or membership service?', answer: 'No. KINETIK is a fitness website concept. It does not represent a real physical gym and has no membership checkout, class booking, payment, or live timetable.' },
  { question: 'Can a beginner use these training paths?', answer: 'The content is written to be approachable, but it is general information rather than personalized coaching. Begin with movements you can perform comfortably and progress gradually.' },
  { question: 'Are the sample weekly sessions a fixed program?', answer: 'No. The schedule is an example to help you visualize a balanced week. Change the order, frequency, and movements to suit your ability, recovery, and circumstances.' },
  { question: 'Where is my progress saved?', answer: 'Your check-ins and generated starter plan use local browser storage when it is available. They are not uploaded to a server and do not sync across devices.' },
  { question: 'Is the workout builder an AI coach?', answer: 'No. The plan builder uses simple, transparent templates in your browser. It is not an AI service and does not replace qualified coaching or medical advice.' },
];

const goalTitles: Record<Goal, string> = { strength: 'Strength foundation', conditioning: 'Conditioning base', mobility: 'Mobility reset' };
const planTemplates: Record<Goal, string[]> = {
  strength: ['Goblet squat — 3 × 8 reps', 'Dumbbell floor press — 3 × 10 reps', 'Romanian deadlift — 3 × 10 reps', 'Suitcase carry — 3 × 30 sec per side'],
  conditioning: ['Easy warm-up — 5 min', 'Bike or brisk-walk intervals — 6 rounds', 'Farmer carry — 4 × 30 sec', 'Easy cool-down — 4 min'],
  mobility: ['90/90 hip switches — 2 × 8 per side', 'Thoracic rotations — 2 × 8 per side', 'Supported squat hold — 3 × 20 sec', 'Slow breathing reset — 3 min'],
};

function weekKey() {
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return 'kinetik-week-' + monday.getFullYear() + '-' + String(monday.getMonth() + 1).padStart(2, '0') + '-' + String(monday.getDate()).padStart(2, '0');
}

function loadCheckins(): string[] {
  try {
    if (typeof window === 'undefined') return [];
    const value: unknown = JSON.parse(window.localStorage.getItem(weekKey()) || '[]');
    return Array.isArray(value) ? value.filter((day): day is string => typeof day === 'string') : [];
  } catch { return []; }
}

function loadPlan(): PlanResult | null {
  try {
    if (typeof window === 'undefined') return null;
    const value = JSON.parse(window.localStorage.getItem('kinetik-starter-plan') || 'null') as PlanResult | null;
    return value && typeof value.title === 'string' && typeof value.meta === 'string' && Array.isArray(value.moves) ? value : null;
  } catch { return null; }
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.62, delay, ease: 'easeOut' }}>{children}</motion.div>;
}

function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={'eyebrow' + (light ? ' eyebrow--light' : '')}><span aria-hidden="true" />{children}</p>;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={'brand' + (footer ? ' brand--footer' : '')} href="#home" aria-label="KINETIK — back to top"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span><span className="brand-word">KINETIK<span>.</span><small>TRAINING / CULTURE</small></span></a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <div className="topline"><div className="page-shell topline-inner"><span><i /> TRAIN WITH INTENT. RECOVER WITH PURPOSE.</span><span>STRENGTH / CONDITIONING / MOBILITY</span></div></div>
      <header className="site-header">
        <Brand />
        <nav className={'main-nav' + (menuOpen ? ' main-nav--open' : '')} id="main-navigation" aria-label="Main navigation">
          {navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
          <a className="nav-mobile-cta" href="#start" onClick={() => setMenuOpen(false)}>Build a starter plan <Arrow /></a>
        </nav>
        <a className="header-cta" href="#start">Find your focus <Arrow /></a>
        <button className="menu-toggle" type="button" aria-controls="main-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
      </header>
    </>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-wash" aria-hidden="true" />
      <div className="page-shell hero-layout">
        <div className="hero-copy">
          <div className="hero-stamp"><span className="pulse-dot" /> A BETTER TRAINING HABIT STARTS HERE</div>
          <Eyebrow light>THE KINETIK METHOD / 001</Eyebrow>
          <h1 id="hero-title">BUILT BY<br />THE <em>WORK.</em></h1>
          <p className="hero-lede">Make movement a practice. Build strength, find your pace, and recover well enough to show up again.</p>
          <div className="hero-actions"><a className="button button--lime" href="#programs">Explore training <Arrow /></a><a className="hero-text-link" href="#approach">Our approach <Arrow diagonal={false} /></a></div>
          <div className="hero-values"><span>01 / SHOW UP</span><span>02 / STAY CURIOUS</span><span>03 / REPEAT</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-main"><img src={photos.hero} alt="Modern gym floor with rows of strength and conditioning equipment" fetchPriority="high" decoding="async" /><span className="photo-corner-label">THE WORK / 001</span></div>
          <div className="hero-photo-small"><img src={photos.athlete} alt="Athlete focused on strength training" loading="eager" decoding="async" /><span>STRENGTH<br />IN PROGRESS.</span></div>
          <div className="hero-sticker"><span>KEEP</span><strong>SHOWING<br />UP.</strong><i>✳</i></div>
          <div className="hero-vertical-label">TRAINING / CULTURE / EVERY DAY</div>
        </div>
      </div>
      <div className="hero-bottom page-shell"><span>LESS NOISE. MORE PURPOSE.</span><span className="hero-rule" /><span>FIND YOUR STRONG ↘</span></div>
    </section>
  );
}

function Marquee() {
  const items = ['MOVE WITH INTENT', 'BUILD YOUR BASE', 'RESPECT RECOVERY', 'PROGRESS OVER PERFECTION'];
  return <div className="marquee" aria-label={items.join(' · ')}><div className="marquee-track" aria-hidden="true">{[0, 1].map((set) => <div className="marquee-group" key={set}>{items.map((item) => <span key={item + set}>{item}<i>✳</i></span>)}</div>)}</div></div>;
}

function Approach() {
  return (
    <section className="approach section-pad" id="approach">
      <div className="page-shell">
        <div className="approach-head">
          <Reveal className="approach-title"><Eyebrow>01 / OUR TRAINING PHILOSOPHY</Eyebrow><h2>NO SHORTCUTS.<br /><em>JUST SHOW UP.</em></h2></Reveal>
          <Reveal className="approach-intro" delay={0.1}><p>Good training is not a mystery. Know what you're working on, give it honest effort, and leave room to recover.</p><a className="underlined-link" href="#weekly">See a sample week <Arrow /></a></Reveal>
        </div>
        <div className="principle-grid">{[
          { number: '01', icon: '↗', title: 'Make it intentional.', copy: 'Give each session one clear purpose. A simple, repeatable plan beats random effort.', tag: 'DIRECTION FIRST' },
          { number: '02', icon: '＋', title: 'Earn the progress.', copy: 'Quality reps and small increases create a foundation you can build on.', tag: 'FORM BEFORE EGO' },
          { number: '03', icon: '↻', title: 'Recover like you train.', copy: 'Food, sleep, lighter movement, and rest are all part of a complete routine.', tag: 'REST IS TRAINING' },
        ].map((item, index) => <Reveal className="principle-card" key={item.number} delay={index * 0.08}><div className="principle-top"><span>{item.number} / 03</span><span className="principle-icon" aria-hidden="true">{item.icon}</span></div><h3>{item.title}</h3><p>{item.copy}</p><span className="principle-tag">{item.tag}</span></Reveal>)}</div>
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section className="programs section-pad" id="programs">
      <div className="page-shell">
        <Reveal className="section-heading section-heading--split"><div><Eyebrow>02 / PICK YOUR PATH</Eyebrow><h2>EVERY GOAL<br />STARTS <em>SOMEWHERE.</em></h2></div><p>You do not need to do everything at once. Choose one focus, build a routine around it, and let consistency do its job.</p></Reveal>
        <div className="program-grid">{programs.map((program, index) => <Reveal className="program-wrap" key={program.number} delay={index * 0.08}><article className="program-card"><a className="program-image" href="#training-path" onClick={() => window.dispatchEvent(new CustomEvent('kinetik-path', { detail: program.goal }))} aria-label={'Explore ' + program.title}><img src={program.image} alt={program.alt} loading="lazy" decoding="async" /><span className="program-number">{program.number} / 03</span><span className="program-tag">{program.tag}</span><span className="program-image-arrow"><Arrow /></span></a><div className="program-copy"><div className="program-meta"><span>{program.eyebrow}</span><span>{program.time}</span></div><h3>{program.title}</h3><p>{program.copy}</p><a className="program-link" href="#training-path" onClick={() => window.dispatchEvent(new CustomEvent('kinetik-path', { detail: program.goal }))}>EXPLORE THIS PATH <Arrow /></a></div></article></Reveal>)}</div>
        <div className="program-foot"><span className="green-dash" /> START WHERE YOU ARE. BUILD FROM THERE.</div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="feature-section">
      <div className="feature-image"><img src={photos.training} alt="Well-equipped gym floor for strength training and movement" loading="lazy" decoding="async" /></div><div className="feature-shade" aria-hidden="true" />
      <div className="page-shell feature-layout">
        <Reveal className="feature-copy"><Eyebrow light>03 / BUILT FOR THE LONG GAME</Eyebrow><h2>CONSISTENCY<br />IS THE <em>REAL FLEX.</em></h2><p>One big workout will not build a habit. A routine you can return to, adjust, and keep doing is much more useful.</p><a className="button button--lime" href="#tracker">Track your week <Arrow /></a></Reveal>
        <div className="feature-list"><Reveal className="feature-row"><span>01</span><div><strong>One clear focus</strong><p>Give your session a direction before you begin.</p></div></Reveal><Reveal className="feature-row" delay={0.08}><span>02</span><div><strong>Repeatable effort</strong><p>Work hard enough to progress, not so hard you cannot return.</p></div></Reveal><Reveal className="feature-row" delay={0.16}><span>03</span><div><strong>Space to recover</strong><p>Adjust the load, respect rest, and keep the process sustainable.</p></div></Reveal></div>
      </div>
    </section>
  );
}

function PathExplorer() {
  const [goal, setGoal] = useState<Goal>('strength');
  const [active, setActive] = useState(paths.strength);
  useEffect(() => {
    function choosePath(event: Event) {
      const next = (event as CustomEvent<Goal>).detail;
      if (next === 'strength' || next === 'conditioning' || next === 'mobility') { setGoal(next); setActive(paths[next]); }
    }
    window.addEventListener('kinetik-path', choosePath);
    return () => window.removeEventListener('kinetik-path', choosePath);
  }, []);
  function selectGoal(next: Goal) { setGoal(next); setActive(paths[next]); }
  function buildPlan() { window.dispatchEvent(new CustomEvent('kinetik-focus', { detail: goal })); window.location.hash = 'start'; }
  return (
    <section className="path-section section-pad" id="training-path">
      <div className="page-shell">
        <Reveal className="section-heading section-heading--split"><div><Eyebrow>04 / FIND YOUR STARTING POINT</Eyebrow><h2>YOUR TRAINING.<br /><em>YOUR PACE.</em></h2></div><p>Choose the type of work that fits your current goal. Explore a few practical starting points, then use the builder to sketch a first session.</p></Reveal>
        <div className="path-tabs" role="tablist" aria-label="Choose training path">{(Object.keys(paths) as Goal[]).map((key) => <button type="button" role="tab" aria-selected={goal === key} className={goal === key ? 'path-tab path-tab--active' : 'path-tab'} key={key} onClick={() => selectGoal(key)}>{paths[key].label}<Arrow diagonal={false} /></button>)}</div>
        <div className="path-content" role="tabpanel">
          <div className="path-photo"><img src={active.image} alt={active.imageAlt} loading="lazy" decoding="async" /><span className="path-photo-caption">{active.note}</span><span className="path-photo-index">KINETIK / 0{(Object.keys(paths) as Goal[]).indexOf(goal) + 1}</span></div>
          <div className="path-detail"><Eyebrow>THE STARTING POINT</Eyebrow><h3>{active.title}</h3><p className="path-statement">{active.statement}</p><div className="path-steps">{active.steps.map((step, index) => <div className="path-step" key={step.title}><span>0{index + 1}</span><div><strong>{step.title}</strong><p>{step.copy}</p></div></div>)}</div><button type="button" className="button button--dark" onClick={buildPlan}>Build from this path <Arrow /></button></div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery-section">
      <div className="page-shell gallery-layout">
        <Reveal className="gallery-heading"><Eyebrow>05 / THE FEELING OF THE WORK</Eyebrow><h2>SHOW UP.<br /><em>LOCK IN.</em></h2><p>A visual moodboard of the training culture behind KINETIK: focused effort, thoughtful movement, and the spaces that make you want to return.</p><a className="underlined-link" href="#weekly">Put it into a routine <Arrow /></a></Reveal>
        <div className="gallery-grid"><Reveal className="gallery-item gallery-item--large"><img src={photos.athlete} alt="Athlete putting focused effort into a workout" loading="lazy" decoding="async" /><span>FOCUS / 001</span></Reveal><Reveal className="gallery-item gallery-item--small" delay={0.08}><img src={photos.mobility} alt="Controlled mobility session" loading="lazy" decoding="async" /><span>CONTROL / 002</span></Reveal><Reveal className="gallery-item gallery-item--wide" delay={0.14}><img src={photos.ropes} alt="Functional fitness session in progress" loading="lazy" decoding="async" /><span>EFFORT / 003</span></Reveal></div>
      </div>
    </section>
  );
}

function FuelSection() {
  return <section className="fuel-section"><div className="fuel-image"><img src={photos.nutrition} alt="Colorful balanced meal with vegetables, grains, and fresh ingredients" loading="lazy" decoding="async" /><span>THE WORK CONTINUES OFF THE FLOOR</span></div><div className="fuel-copy"><Reveal><Eyebrow light>06 / BEYOND THE SESSION</Eyebrow><h2>TRAIN HARD.<br />RECOVER <em>SMART.</em></h2><p>Training is one piece of the picture. Build a rhythm around meals that fuel you, sleep that restores you, and rest days you can respect.</p><div className="fuel-tags"><span>MOVE</span><span>FUEL</span><span>REST</span></div><a className="text-link text-link--light" href="#faq">Read the essentials <Arrow /></a></Reveal></div></section>;
}

function WeeklyPlan() {
  const [filter, setFilter] = useState<WeekFilter>('ALL');
  const options: WeekFilter[] = ['ALL', 'STRENGTH', 'ENGINE', 'RESTORE'];
  const filtered = weekPlan.filter((item) => filter === 'ALL' || item.type === filter);
  return (
    <section className="weekly section-pad" id="weekly"><div className="page-shell">
      <Reveal className="section-heading section-heading--split"><div><Eyebrow light>07 / EXAMPLE ROUTINE</Eyebrow><h2>FIND YOUR<br /><em>WEEKLY RHYTHM.</em></h2></div><p>A balanced week leaves room for harder sessions, lighter days, and life. This is a sample structure—not a fixed program or a prescription.</p></Reveal>
      <div className="week-toolbar"><span>VIEW THE PLAN BY FOCUS</span><div className="week-filters" role="group" aria-label="Filter weekly plan">{options.map((item) => <button type="button" key={item} className={filter === item ? 'week-filter week-filter--active' : 'week-filter'} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === 'ALL' ? 'All days' : item === 'ENGINE' ? 'Conditioning' : item === 'RESTORE' ? 'Recovery' : 'Strength'}</button>)}</div></div>
      <div className="week-list">{filtered.map((item, index) => <Reveal key={item.day} delay={index * 0.025}><div className={'week-row' + (item.day === 'SUN' ? ' week-row--rest' : '')}><span className="week-day">{item.day}</span><div className="week-detail"><h3>{item.title}</h3><p>{item.detail}</p></div><span className="week-type">{item.typeLabel}</span><span className="week-arrow" aria-hidden="true">{item.day === 'SUN' ? '↻' : '↗'}</span></div></Reveal>)}</div>
      <div className="weekly-foot"><span><i /> FLEXIBLE BY DESIGN</span><span>REST IS PART OF THE PLAN.</span></div>
    </div></section>
  );
}

function ProgressTracker() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [checkins, setCheckins] = useState<string[]>(loadCheckins);
  useEffect(() => { try { window.localStorage.setItem(weekKey(), JSON.stringify(checkins)); } catch { /* Tracker remains interactive without storage. */ } }, [checkins]);
  function toggleDay(day: string) { setCheckins((old) => old.includes(day) ? old.filter((item) => item !== day) : [...old, day]); }
  const percent = Math.round((checkins.length / 7) * 100);
  return <section className="tracker section-pad" id="tracker"><div className="page-shell tracker-layout"><Reveal className="tracker-copy"><Eyebrow>08 / YOUR CONSISTENCY BOARD</Eyebrow><h2>SMALL WINS.<br /><em>STACKED UP.</em></h2><p>Mark the days you showed up. Your check-ins stay in this browser, with no account and no cloud sync.</p><div className="tracker-counter"><strong>{checkins.length}<span> / 7</span></strong><small>SESSIONS CHECKED IN</small></div></Reveal><Reveal className="tracker-panel" delay={0.1}><div className="tracker-panel-head"><span>YOUR WEEK, YOUR PACE</span><span>{percent}% COMPLETED</span></div><div className="tracker-days" role="group" aria-label="Mark completed training days">{days.map((day, index) => { const checked = checkins.includes(day); return <button type="button" className={'tracker-day' + (checked ? ' tracker-day--done' : '')} key={day} aria-label={'Log ' + fullDays[index] + ' session'} aria-pressed={checked} onClick={() => toggleDay(day)}><span>{day}</span><strong>{checked ? '✓' : String(index + 1).padStart(2, '0')}</strong></button>; })}</div><div className="tracker-progress" role="progressbar" aria-label="Weekly check-in progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={checkins.length}><span style={{ width: percent + '%' }} /></div><div className="tracker-panel-foot"><span>{checkins.length === 0 ? 'START WITH ONE SESSION.' : checkins.length < 4 ? 'GOOD START. KEEP BUILDING.' : 'CONSISTENCY IN ACTION.'}</span><button type="button" onClick={() => setCheckins([])}>RESET WEEK ↻</button></div></Reveal></div></section>;
}

function PlanBuilder() {
  const [goal, setGoal] = useState<Goal>('strength');
  const [level, setLevel] = useState('beginner');
  const [duration, setDuration] = useState('45');
  const [plan, setPlan] = useState<PlanResult | null>(loadPlan);
  useEffect(() => {
    function onFocus(event: Event) {
      const next = (event as CustomEvent<Goal>).detail;
      if (next === 'strength' || next === 'conditioning' || next === 'mobility') setGoal(next);
    }
    window.addEventListener('kinetik-focus', onFocus);
    return () => window.removeEventListener('kinetik-focus', onFocus);
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: PlanResult = { title: goalTitles[goal], meta: level[0].toUpperCase() + level.slice(1) + ' level · ' + duration + ' minutes · browser-made sample', moves: planTemplates[goal].slice(0, duration === '30' ? 3 : 4) };
    setPlan(next);
    try { window.localStorage.setItem('kinetik-starter-plan', JSON.stringify(next)); } catch { /* Keep the generated result visible. */ }
  }
  function clear() {
    setPlan(null);
    try { window.localStorage.removeItem('kinetik-starter-plan'); } catch { /* Ignore unavailable storage. */ }
  }
  return <section className="builder section-pad" id="start"><div className="page-shell builder-layout"><Reveal className="builder-intro"><Eyebrow>09 / START WITH A FIRST DRAFT</Eyebrow><h2>MAKE A PLAN.<br /><em>MAKE IT YOURS.</em></h2><p>Choose a goal, your starting point, and the time you have. KINETIK will put together a simple session template you can review and adapt.</p><div className="builder-note"><span>✳</span><p><strong>NO MAGIC FORMULA.</strong><br />Just a practical place to begin. Keep the plan realistic and progress at your own pace.</p></div></Reveal><Reveal className="builder-card" delay={0.1}><div className="builder-card-head"><span>STARTER PLAN BUILDER</span><span>3 INPUTS / 1 PLAN</span></div><form onSubmit={submit}><fieldset className="goal-fieldset"><legend className="field-label">01 / What is your focus?</legend><div className="goal-options"><label className={'goal-option' + (goal === 'strength' ? ' goal-option--selected' : '')}><input type="radio" name="goal" value="strength" checked={goal === 'strength'} onChange={() => setGoal('strength')} /><span className="goal-icon">↗</span><strong>Get stronger</strong><small>Strength</small></label><label className={'goal-option' + (goal === 'conditioning' ? ' goal-option--selected' : '')}><input type="radio" name="goal" value="conditioning" checked={goal === 'conditioning'} onChange={() => setGoal('conditioning')} /><span className="goal-icon">⌁</span><strong>Build my engine</strong><small>Conditioning</small></label><label className={'goal-option' + (goal === 'mobility' ? ' goal-option--selected' : '')}><input type="radio" name="goal" value="mobility" checked={goal === 'mobility'} onChange={() => setGoal('mobility')} /><span className="goal-icon">↻</span><strong>Move with ease</strong><small>Mobility</small></label></div></fieldset><div className="builder-fields"><label><span className="field-label">02 / Starting point</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="beginner">Beginner — learn the basics</option><option value="intermediate">Intermediate — build consistency</option><option value="advanced">Advanced — stay deliberate</option></select></label><label><span className="field-label">03 / Time available</span><select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label></div><button className="button button--lime button--full" type="submit">Build my starter plan <Arrow /></button></form>{plan && <div className="generated-plan" aria-live="polite"><div className="generated-plan-head"><span>YOUR FIRST DRAFT</span><span className="plan-check">✓</span></div><h3>{plan.title}</h3><p className="plan-meta">{plan.meta}</p><ol>{plan.moves.map((move) => <li key={move}>{move}</li>)}</ol><p className="plan-disclaimer">Educational example only—not individualized medical advice. Adapt movements to your ability and stop if an exercise causes pain.</p><button type="button" className="clear-plan" onClick={clear}>Clear saved plan ×</button></div>}<p className="builder-local-note"><span /> Preferences and plan stay in this browser only.</p></Reveal></div></section>;
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="faq section-pad" id="faq"><div className="page-shell faq-layout"><Reveal className="faq-intro"><Eyebrow>10 / THE DETAILS</Eyebrow><h2>GOOD TO<br /><em>KNOW.</em></h2><p>Clear expectations make a better starting point. Here is what the KINETIK experience does—and what it does not claim to do.</p></Reveal><div className="faq-list">{faqs.map((item, index) => <Reveal key={item.question} delay={index * 0.04}><article className={'faq-item' + (open === index ? ' faq-item--open' : '')}><h3><button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span><i aria-hidden="true">{open === index ? '−' : '+'}</i></button></h3>{open === index && <div className="faq-answer"><p>{item.answer}</p></div>}</article></Reveal>)}</div></div></section>;
}

function Closing() {
  return <section className="closing"><img src={photos.hero} alt="" loading="lazy" decoding="async" /><div className="closing-overlay" aria-hidden="true" /><div className="page-shell closing-inner"><Reveal><Eyebrow light>LESS TALK / MORE PRACTICE</Eyebrow><h2>YOUR NEXT<br /><em>REP IS YOURS.</em></h2><p>Choose the next small step. Keep showing up.</p><a className="button button--lime" href="#start">Build your first plan <Arrow /></a></Reveal></div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="page-shell"><div className="footer-main"><Brand footer /><p>Built for the process.<br /><em>Not the shortcut.</em></p><a className="footer-top" href="#home">BACK TO TOP ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} KINETIK / FITNESS CONCEPT</span><span>TRAIN / RECOVER / REPEAT</span><a href="#faq">EXPERIENCE NOTES</a></div><p className="footer-disclaimer">KINETIK is a browser-based fitness concept, not a real gym or medical service. It does not provide bookings, memberships, payments, or cloud synchronization. Example routines are educational starting points only.</p></div></footer>;
}

export function App() {
  useEffect(() => { document.documentElement.dataset.site = 'kinetik'; }, []);
  return <MotionConfig reducedMotion="user"><div className="kinetik-app"><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content"><Hero /><Marquee /><Approach /><Programs /><FeatureSection /><PathExplorer /><Gallery /><FuelSection /><WeeklyPlan /><ProgressTracker /><PlanBuilder /><FAQ /><Closing /></main><Footer /></div></MotionConfig>;
}

export default App;
