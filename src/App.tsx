import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';

const photos = {
  hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=88',
  strength: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85',
  conditioning: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85',
  mobility: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=85',
  training: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=85',
};

type Goal = 'strength' | 'conditioning' | 'mobility';
type PlanResult = { title: string; meta: string; moves: string[] };

const navLinks = [
  { label: 'Approach', href: '#approach' },
  { label: 'Programs', href: '#programs' },
  { label: 'Weekly plan', href: '#weekly' },
  { label: 'Progress', href: '#tracker' },
];

const programs: Array<{ number: string; title: string; subtitle: string; goal: Goal; description: string; image: string; alt: string; duration: string; tag: string }> = [
  { number: '01', title: 'Build strength', subtitle: 'GET STRONGER', goal: 'strength', description: 'Fundamental lifts, deliberate progression, and solid technique. Build a base you can keep coming back to.', image: photos.strength, alt: 'Strength training in a modern gym', duration: '40–60 MIN', tag: 'STRENGTH' },
  { number: '02', title: 'Train your engine', subtitle: 'MOVE WITH PURPOSE', goal: 'conditioning', description: 'Intervals, steady movement, and manageable effort to build stamina without making every session a race.', image: photos.conditioning, alt: 'Athlete doing a conditioning workout', duration: '25–45 MIN', tag: 'CONDITIONING' },
  { number: '03', title: 'Move and recover', subtitle: 'RESET WELL', goal: 'mobility', description: 'Mobility, control, and lighter sessions that support your routine between harder training days.', image: photos.mobility, alt: 'Person practicing a controlled stretching routine', duration: '15–30 MIN', tag: 'RECOVERY' },
];

const principles = [
  { number: '01', icon: '↗', title: 'Train with a plan.', copy: 'Pick a focus and make each session count. Simple plans are easier to repeat than perfect plans you never start.', tag: 'INTENTION OVER RANDOMNESS' },
  { number: '02', icon: '＋', title: 'Earn your progress.', copy: 'Build technique first, then add reps, load, or time at a pace you can recover from.', tag: 'QUALITY OVER EGO' },
  { number: '03', icon: '↻', title: 'Respect recovery.', copy: 'Sleep, food, lighter days, and rest are part of training—not time wasted away from it.', tag: 'CONSISTENCY OVER CHAOS' },
];

const weeklyPlan = [
  { day: 'MON', label: 'Lower-body strength', detail: 'Squat pattern · hinge · core', type: 'STRENGTH' },
  { day: 'TUE', label: 'Conditioning', detail: 'Intervals · steady pace · breathe', type: 'ENGINE' },
  { day: 'WED', label: 'Mobility reset', detail: 'Hips · upper back · ankles', type: 'RECOVERY' },
  { day: 'THU', label: 'Upper-body strength', detail: 'Push · pull · carry', type: 'STRENGTH' },
  { day: 'FRI', label: 'Mixed movement', detail: 'Simple circuit · repeatable effort', type: 'HYBRID' },
  { day: 'SAT', label: 'Move for fun', detail: 'Walk · ride · play · explore', type: 'OPTIONAL' },
  { day: 'SUN', label: 'Full rest', detail: 'Sleep · food · reset for Monday', type: 'REST' },
];

const faqs = [
  { question: 'Is this suitable for a beginner?', answer: 'Yes. Start with movements you can perform with control, choose a manageable amount of work, and progress gradually. The example routines are starting points, not individualized coaching.' },
  { question: 'Do I need a fully equipped gym?', answer: 'No. Adapt the examples to bodyweight, a pair of dumbbells, or the equipment available to you. Choose variations that match your experience and surroundings.' },
  { question: 'Does this website book gym sessions or memberships?', answer: 'No. KINETIK is a fitness website concept. It does not connect to a real gym, booking service, payment system, or membership database.' },
  { question: 'Where is my weekly progress saved?', answer: 'Your check-ins and generated starter plan are stored in your browser only. They are not uploaded to a server and will not sync between devices.' },
  { question: 'Is the starter plan personal medical advice?', answer: 'No. It is a simple educational template. Adapt movements to your ability, consult a qualified professional when appropriate, and stop if an exercise causes pain.' },
];

const goalLabels: Record<Goal, string> = { strength: 'Strength foundation', conditioning: 'Conditioning base', mobility: 'Mobility reset' };
const planTemplates: Record<Goal, string[]> = {
  strength: ['Goblet squat — 8 reps', 'Dumbbell floor press — 10 reps', 'Romanian deadlift — 10 reps', 'Suitcase carry — 30 sec per side'],
  conditioning: ['Easy warm-up — 5 min', 'Bike or brisk-walk intervals — 6 rounds', 'Farmer carry — 30 sec', 'Easy cool-down — 4 min'],
  mobility: ['90/90 hip switches — 8 per side', 'Thoracic rotations — 8 per side', 'Supported squat hold — 20 sec', 'Slow breathing reset — 3 min'],
};

function weeklyStorageKey() {
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return 'kinetik-week-' + monday.getFullYear() + '-' + String(monday.getMonth() + 1).padStart(2, '0') + '-' + String(monday.getDate()).padStart(2, '0');
}

function loadCheckins(): string[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(weeklyStorageKey());
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((day): day is string => typeof day === 'string') : [];
  } catch {
    return [];
  }
}

function loadPlan(): PlanResult | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem('kinetik-starter-plan');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlanResult;
    return typeof parsed.title === 'string' && typeof parsed.meta === 'string' && Array.isArray(parsed.moves) ? parsed : null;
  } catch {
    return null;
  }
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.58, delay, ease: 'easeOut' }}>{children}</motion.div>;
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={'eyebrow' + (light ? ' eyebrow--light' : '')}><span aria-hidden="true" />{children}</p>;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={'brand' + (footer ? ' brand--footer' : '')} href="#home" aria-label="KINETIK, back to top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span className="brand-name">KINETIK<span>.</span><small>TRAINING / CULTURE</small></span></a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  return (
    <header className="site-header">
      <Brand />
      <nav className={'main-nav' + (menuOpen ? ' main-nav--open' : '')} aria-label="Main navigation">
        {navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
        <a className="nav-mobile-cta" href="#start" onClick={() => setMenuOpen(false)}>Build your plan <Arrow /></a>
      </nav>
      <a className="header-cta" href="#start">Start training <Arrow /></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <img className="hero-photo" src={photos.hero} alt="Modern gym with rows of workout equipment" fetchPriority="high" decoding="async" />
      <div className="hero-shade" aria-hidden="true" /><div className="hero-glow hero-glow--one" aria-hidden="true" /><div className="hero-glow hero-glow--two" aria-hidden="true" />
      <div className="page-shell hero-inner">
        <div className="hero-copy">
          <div className="hero-status"><span /> YOUR ROUTINE STARTS HERE</div>
          <Eyebrow light>FITNESS BUILT AROUND YOU / 001</Eyebrow>
          <h1 id="hero-title">FIND YOUR<br /><em>STRONG.</em></h1>
          <p className="hero-lede">Less noise. More purpose. Build strength, improve your engine, and make movement a part of everyday life.</p>
          <div className="hero-actions"><a className="button button--lime" href="#programs">Explore programs <Arrow /></a><a className="button button--ghost" href="#approach">Our approach <span className="button-play" aria-hidden="true">↓</span></a></div>
          <div className="hero-footnote"><span className="hero-footnote-line" /><span>SHOW UP. DO THE WORK. REPEAT.</span></div>
        </div>
        <aside className="hero-side-note" aria-label="Training principles"><span className="hero-side-number">01 — 03</span><span>STRENGTH<br />CONDITIONING<br />RECOVERY</span><span className="hero-side-scroll">SCROLL TO EXPLORE ↓</span></aside>
      </div>
      <div className="hero-bottom page-shell"><span>TRAIN WITH INTENT</span><span className="hero-bottom-rule" /><span>PROGRESS OVER PERFECTION</span></div>
    </section>
  );
}

function Marquee() {
  const items = ['TRAIN WITH PURPOSE', 'BUILD YOUR ENGINE', 'RESPECT THE RESET', 'REPEAT THE PROCESS'];
  return <div className="marquee" aria-label={items.join(' · ')}><div className="marquee-track" aria-hidden="true">{[0, 1].map((set) => <div className="marquee-group" key={set}>{items.map((item) => <span key={item + set}>{item}<i>✳</i></span>)}</div>)}</div></div>;
}

function Approach() {
  return (
    <section className="approach section-pad" id="approach">
      <div className="page-shell">
        <div className="approach-intro">
          <Reveal className="approach-title"><Eyebrow>THE KINETIK METHOD</Eyebrow><h2>STRONGER IS<br />A <em>PRACTICE.</em></h2></Reveal>
          <Reveal className="approach-summary" delay={0.1}><p>Results come from the basics done well: purposeful sessions, steady progress, and enough recovery to return tomorrow.</p><a className="underlined-link" href="#weekly">See a balanced week <Arrow /></a></Reveal>
        </div>
        <div className="principle-grid">{principles.map((item, index) => <Reveal className="principle-card" key={item.number} delay={index * 0.08}><div className="principle-top"><span>{item.number} / 03</span><span className="principle-icon" aria-hidden="true">{item.icon}</span></div><h3>{item.title}</h3><p>{item.copy}</p><span className="principle-tag">{item.tag}</span></Reveal>)}</div>
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section className="programs section-pad" id="programs">
      <div className="page-shell">
        <Reveal className="section-heading section-heading--split"><div><Eyebrow>FIND YOUR FOCUS / 02</Eyebrow><h2>TRAIN FOR<br /><em>WHAT'S NEXT.</em></h2></div><p>Start with one lane. Make the habit stick. Add complexity only when it serves your goal.</p></Reveal>
        <div className="program-grid">{programs.map((program, index) => <Reveal className="program-wrap" key={program.number} delay={index * 0.08}><article className="program-card"><div className="program-image"><img src={program.image} alt={program.alt} loading="lazy" decoding="async" /><span className="program-number">{program.number} / 03</span><span className="program-label">{program.tag}</span><a className="program-arrow" href="#start" onClick={() => window.dispatchEvent(new CustomEvent('kinetik-focus', { detail: program.goal }))} aria-label={'Build a ' + program.title + ' plan'}><Arrow /></a></div><div className="program-copy"><p className="program-kicker">{program.subtitle}<span>{program.duration}</span></p><h3>{program.title}</h3><p className="program-description">{program.description}</p><a className="program-link" href="#start" onClick={() => window.dispatchEvent(new CustomEvent('kinetik-focus', { detail: program.goal }))}>MAKE THIS MY FOCUS <Arrow /></a></div></article></Reveal>)}</div>
        <div className="program-note"><span>✳</span> Start where you are. Build from there.</div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="feature-section"><div className="feature-photo"><img src={photos.training} alt="Well-equipped gym floor with strength and cardio equipment" loading="lazy" decoding="async" /></div><div className="feature-overlay" aria-hidden="true" />
      <div className="page-shell feature-inner">
        <Reveal className="feature-copy"><Eyebrow light>BUILT FOR THE LONG GAME / 03</Eyebrow><h2>CONSISTENCY<br />IS THE <em>FLEX.</em></h2><p>You don't need a perfect week. You need a routine you can return to. Keep the plan realistic, track the work, and take the next step.</p><a className="button button--lime" href="#tracker">Track your week <Arrow /></a></Reveal>
        <div className="feature-points"><Reveal className="feature-point"><span>01</span><div><strong>Clear direction</strong><p>Know what you are working toward.</p></div></Reveal><Reveal className="feature-point" delay={0.08}><span>02</span><div><strong>Repeatable effort</strong><p>Small, solid sessions beat all-or-nothing thinking.</p></div></Reveal><Reveal className="feature-point" delay={0.16}><span>03</span><div><strong>Room to recover</strong><p>Make space for rest and real life.</p></div></Reveal></div>
      </div>
    </section>
  );
}

function TrainingLoop() {
  const cards = [
    { number: 'A', title: 'Plan the session', text: 'Choose your focus, time, and movements before you begin.', className: 'loop-plan', mark: 'SET YOUR INTENTION', symbol: '↗' },
    { number: 'B', title: 'Do the work', text: 'Keep your form controlled and your effort repeatable.', className: 'loop-train', mark: 'ONE SESSION AT A TIME', symbol: '＋' },
    { number: 'C', title: 'Reset and return', text: 'Recover well, review what worked, and start again.', className: 'loop-recover', mark: 'PROGRESS THAT LASTS', symbol: '↻' },
  ];
  return <section className="loop-section section-pad"><div className="page-shell"><Reveal className="section-heading"><Eyebrow>THE ROUTINE THAT LASTS</Eyebrow><h2>PLAN. TRAIN.<br /><em>REPEAT.</em></h2><p>Make the important decisions before motivation gets a vote.</p></Reveal><div className="loop-grid">{cards.map((card, index) => <Reveal key={card.number} delay={index * 0.09}><article className={'loop-card ' + card.className}><div className="loop-card-head"><span>{card.number} / THE PROCESS</span><span className="loop-symbol" aria-hidden="true">{card.symbol}</span></div><div className="loop-illustration" aria-hidden="true"><span /><span /><span /><i /></div><h3>{card.title}</h3><p>{card.text}</p><span className="loop-tag">{card.mark}</span></article></Reveal>)}</div></div></section>;
}

function FuelSection() {
  return <section className="fuel-section"><div className="fuel-image"><img src={photos.nutrition} alt="A colorful balanced meal with vegetables, grains, and fresh ingredients" loading="lazy" decoding="async" /></div><div className="fuel-copy"><Reveal><Eyebrow light>BEYOND THE SESSION / 04</Eyebrow><h2>TRAIN HARD.<br />RECOVER <em>SMART.</em></h2><p>Training is one piece of the picture. Build a rhythm around food that fuels you, sleep that restores you, and rest days you can respect.</p><div className="fuel-tags"><span>MOVE</span><span>FUEL</span><span>REST</span></div><a className="text-link text-link--light" href="#faq">Read the essentials <Arrow /></a></Reveal></div></section>;
}

function WeeklyPlan() {
  return (
    <section className="weekly section-pad" id="weekly"><div className="page-shell">
      <Reveal className="section-heading section-heading--split"><div><Eyebrow light>AN EXAMPLE, NOT A RULE / 05</Eyebrow><h2>FIND YOUR<br /><em>WEEKLY RHYTHM.</em></h2></div><p>A balanced week leaves room for harder sessions, lighter days, and life. Adjust this example to your own ability, schedule, and equipment.</p></Reveal>
      <div className="week-list">{weeklyPlan.map((item, index) => <Reveal key={item.day} delay={index * 0.025}><div className={'week-row' + (item.day === 'SUN' ? ' week-row--rest' : '')}><span className="week-day">{item.day}</span><div className="week-detail"><h3>{item.label}</h3><p>{item.detail}</p></div><span className="week-type">{item.type}</span><span className="week-mark" aria-hidden="true">{item.day === 'SUN' ? '↻' : '↗'}</span></div></Reveal>)}</div>
      <div className="weekly-foot"><span><i /> FLEXIBLE BY DESIGN</span><span>REST IS PART OF THE PLAN.</span></div>
    </div></section>
  );
}

function ProgressTracker() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [checkins, setCheckins] = useState<string[]>(loadCheckins);
  useEffect(() => { try { window.localStorage.setItem(weeklyStorageKey(), JSON.stringify(checkins)); } catch { /* Local tracker still works during this visit. */ } }, [checkins]);
  function toggleDay(day: string) { setCheckins((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]); }
  const percent = Math.round((checkins.length / 7) * 100);
  return (
    <section className="tracker section-pad" id="tracker"><div className="page-shell tracker-layout">
      <Reveal className="tracker-copy"><Eyebrow>SMALL WINS ADD UP / 06</Eyebrow><h2>PROOF IS IN<br /><em>THE PRACTICE.</em></h2><p>Mark the days you showed up this week. Your check-ins stay in this browser, with no account and no cloud sync.</p><div className="tracker-counter"><strong>{checkins.length}<span> / 7</span></strong><small>SESSIONS MARKED THIS WEEK</small></div></Reveal>
      <Reveal className="tracker-panel" delay={0.1}><div className="tracker-panel-head"><span>YOUR WEEK, YOUR PACE</span><span>{percent}% CHECKED IN</span></div><div className="tracker-days" role="group" aria-label="Mark completed training days">{days.map((day, index) => { const checked = checkins.includes(day); return <button type="button" className={'tracker-day' + (checked ? ' tracker-day--done' : '')} key={day} aria-label={'Log ' + fullDays[index] + ' session'} aria-pressed={checked} onClick={() => toggleDay(day)}><span>{day}</span><strong>{checked ? '✓' : String(index + 1).padStart(2, '0')}</strong></button>; })}</div><div className="tracker-progress" role="progressbar" aria-label="Weekly check-in progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={checkins.length}><span style={{ width: percent + '%' }} /></div><div className="tracker-panel-foot"><span>{checkins.length === 0 ? 'START WITH ONE SESSION.' : checkins.length < 4 ? 'GOOD START. KEEP BUILDING.' : 'THAT IS CONSISTENCY IN ACTION.'}</span><button type="button" onClick={() => setCheckins([])}>RESET WEEK ↻</button></div></Reveal>
    </div></section>
  );
}

function PlanBuilder() {
  const [goal, setGoal] = useState<Goal>('strength');
  const [level, setLevel] = useState('beginner');
  const [duration, setDuration] = useState('45');
  const [plan, setPlan] = useState<PlanResult | null>(loadPlan);
  useEffect(() => {
    function handleFocus(event: Event) {
      const selected = (event as CustomEvent<Goal>).detail;
      if (selected === 'strength' || selected === 'conditioning' || selected === 'mobility') setGoal(selected);
    }
    window.addEventListener('kinetik-focus', handleFocus);
    return () => window.removeEventListener('kinetik-focus', handleFocus);
  }, []);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPlan: PlanResult = { title: goalLabels[goal], meta: level.charAt(0).toUpperCase() + level.slice(1) + ' level · ' + duration + ' minutes · educational sample', moves: planTemplates[goal].slice(0, duration === '30' ? 3 : 4) };
    setPlan(nextPlan);
    try { window.localStorage.setItem('kinetik-starter-plan', JSON.stringify(nextPlan)); } catch { /* Keep the result visible if browser storage is unavailable. */ }
  }
  function clearPlan() {
    setPlan(null);
    try { window.localStorage.removeItem('kinetik-starter-plan'); } catch { /* Ignore unavailable storage. */ }
  }
  return (
    <section className="builder section-pad" id="start"><div className="page-shell builder-layout">
      <Reveal className="builder-intro"><Eyebrow>YOUR NEXT REP STARTS HERE / 07</Eyebrow><h2>MAKE A PLAN.<br /><em>MAKE IT YOURS.</em></h2><p>Choose a focus, your starting point, and the time you have. KINETIK will put together a simple first draft you can adapt.</p><div className="builder-promise"><span aria-hidden="true">✳</span><p><strong>NO MAGIC FORMULA.</strong><br />Just a clear place to begin. Keep the plan realistic and take the next step at your pace.</p></div></Reveal>
      <Reveal className="builder-card" delay={0.1}><div className="builder-card-head"><span>STARTER PLAN BUILDER</span><span>3 INPUTS / 1 PLAN</span></div>
        <form onSubmit={handleSubmit}><fieldset className="goal-fieldset"><legend className="field-label">01 / What do you want to focus on?</legend><div className="goal-options">
          <label className={'goal-option' + (goal === 'strength' ? ' goal-option--selected' : '')}><input type="radio" name="goal" value="strength" checked={goal === 'strength'} onChange={() => setGoal('strength')} /><span className="goal-option-icon">↗</span><strong>Get stronger</strong><small>Strength</small></label>
          <label className={'goal-option' + (goal === 'conditioning' ? ' goal-option--selected' : '')}><input type="radio" name="goal" value="conditioning" checked={goal === 'conditioning'} onChange={() => setGoal('conditioning')} /><span className="goal-option-icon">⌁</span><strong>Build my engine</strong><small>Conditioning</small></label>
          <label className={'goal-option' + (goal === 'mobility' ? ' goal-option--selected' : '')}><input type="radio" name="goal" value="mobility" checked={goal === 'mobility'} onChange={() => setGoal('mobility')} /><span className="goal-option-icon">↻</span><strong>Move better</strong><small>Mobility</small></label>
        </div></fieldset>
        <div className="builder-fields"><label><span className="field-label">02 / Starting point</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="beginner">Beginner — build the basics</option><option value="intermediate">Intermediate — build consistency</option><option value="advanced">Advanced — keep it deliberate</option></select></label><label><span className="field-label">03 / Time available</span><select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label></div>
        <button className="button button--lime button--full" type="submit">Build my starter plan <Arrow /></button></form>
        {plan && <div className="generated-plan" aria-live="polite"><div className="generated-plan-head"><span>YOUR FIRST DRAFT</span><span className="plan-check">✓</span></div><h3>{plan.title}</h3><p className="plan-meta">{plan.meta}</p><ol>{plan.moves.map((move) => <li key={move}>{move}</li>)}</ol><p className="plan-disclaimer">An educational example, not individualized medical advice. Adapt movements to your ability and stop if an exercise causes pain.</p><button type="button" className="clear-plan" onClick={clearPlan}>Clear saved plan ×</button></div>}
        <p className="builder-local-note"><span /> Your preferences and plan stay in this browser.</p>
      </Reveal>
    </div></section>
  );
}

function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);
  return <section className="faq section-pad" id="faq"><div className="page-shell faq-layout">
    <Reveal className="faq-intro"><Eyebrow>GOOD QUESTIONS / 08</Eyebrow><h2>BEFORE YOU<br /><em>BEGIN.</em></h2><p>Keep the process clear. Here's what this experience does—and what it does not claim to do.</p></Reveal>
    <div className="faq-list">{faqs.map((faq, index) => <Reveal key={faq.question} delay={index * 0.035}><article className={'faq-item' + (openItem === index ? ' faq-item--open' : '')}><h3><button type="button" aria-expanded={openItem === index} onClick={() => setOpenItem(openItem === index ? null : index)}><span>{faq.question}</span><i aria-hidden="true">{openItem === index ? '−' : '+'}</i></button></h3>{openItem === index && <div className="faq-answer"><p>{faq.answer}</p></div>}</article></Reveal>)}</div>
  </div></section>;
}

function Closing() {
  return <section className="closing"><img src={photos.hero} alt="" loading="lazy" decoding="async" /><div className="closing-shade" aria-hidden="true" /><div className="page-shell closing-content"><Reveal><Eyebrow light>LESS TALK / MORE PRACTICE</Eyebrow><h2>YOUR NEXT<br /><em>MOVE IS YOURS.</em></h2><a className="button button--lime" href="#start">Build your first plan <Arrow /></a></Reveal></div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="page-shell"><div className="footer-main"><Brand footer /><p>Built for the process.<br /><em>Not the shortcut.</em></p><a className="footer-top" href="#home">BACK TO TOP ↑</a></div><div className="footer-bottom"><span>© {String(new Date().getFullYear())} KINETIK / FITNESS CONCEPT</span><span>TRAIN / RECOVER / REPEAT</span><a href="#faq">EXPERIENCE NOTES</a></div><p className="footer-disclaimer">KINETIK is a browser-based fitness concept, not a real gym or medical service. It has no bookings, payments, accounts, or cloud sync. Example plans are educational starting points only.</p></div></footer>;
}

export function App() {
  useEffect(() => { document.documentElement.dataset.site = 'kinetik'; }, []);
  return <MotionConfig reducedMotion="user"><div className="kinetik-app"><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content"><Hero /><Marquee /><Approach /><Programs /><FeatureSection /><TrainingLoop /><FuelSection /><WeeklyPlan /><ProgressTracker /><PlanBuilder /><FAQ /><Closing /></main><Footer /></div></MotionConfig>;
}

export default App;
