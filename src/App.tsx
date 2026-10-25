import { Suspense, lazy, useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
const KineticObject = lazy(() => import('./components/KineticObject'));

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

type Equipment = 'barbell' | 'dumbbell' | 'kettlebell';
type Finish = 'kinetik' | 'carbon' | 'steel';
type LightingPreset = 'studio' | 'contrast' | 'neon';
type CameraPreset = 'hero' | 'front' | 'side';
type StoryBeat = 0 | 1 | 2;
const storyBeats: Array<{ id: StoryBeat; eyebrow: string; title: string; copy: string }> = [
  { id: 0, eyebrow: '01 / FORM', title: 'Built for the basics.', copy: 'Start with the silhouette. Scroll to move through the object, or take control and inspect it yourself.' },
  { id: 1, eyebrow: '02 / FINISH', title: 'Made to feel different.', copy: 'Change the material and light rig to see how the same piece responds to a new finish.' },
  { id: 2, eyebrow: '03 / DETAIL', title: 'Find your angle.', copy: 'Move closer, change the view, and rotate the equipment by hand for your own inspection.' },
];
const lightingOptions: Array<{ id: LightingPreset; label: string; note: string }> = [
  { id: 'studio', label: 'Studio', note: 'BALANCED' },
  { id: 'contrast', label: 'Contrast', note: 'HARD EDGE' },
  { id: 'neon', label: 'Neon', note: 'LIME / ICE' },
];
const cameraOptions: Array<{ id: CameraPreset; label: string }> = [
  { id: 'hero', label: 'Hero angle' },
  { id: 'front', label: 'Front' },
  { id: 'side', label: 'Side profile' },
];
const finishOptions: Array<{ id: Finish; label: string; note: string }> = [
  { id: 'kinetik', label: 'Kinetik lime', note: 'SIGNATURE' },
  { id: 'carbon', label: 'Carbon', note: 'MATTE' },
  { id: 'steel', label: 'Steel', note: 'BRUSHED' },
];
type EquipmentInfo = { label: string; code: string; descriptor: string; title: string; copy: string; focus: string; symbol: string };
const equipmentInfo: Record<Equipment, EquipmentInfo> = {
  barbell: { label: 'Barbell', code: '01', descriptor: 'PLATE-LOADED SYSTEM', title: 'Built for big lifts.', copy: 'A balanced bar, stacked plates, and a silhouette made for compound strength work. Drag the model to inspect it from different angles.', focus: 'COMPOUND LIFTS', symbol: '═' },
  dumbbell: { label: 'Dumbbell', code: '02', descriptor: 'SINGLE-HAND CONTROL', title: 'One side at a time.', copy: 'A compact free weight for unilateral work, controlled presses, rows, carries, and small adjustments to loading.', focus: 'CONTROL / RANGE', symbol: '╍' },
  kettlebell: { label: 'Kettlebell', code: '03', descriptor: 'GRIP / MOMENTUM', title: 'Move with purpose.', copy: 'A compact bell and loop handle for carries, hinges, squats, and dynamic movements where technique matters.', focus: 'GRIP / FLOW', symbol: '◉' },
};

const navLinks = [
  { label: 'The method', href: '#approach' },
  { label: '3D training lab', href: '#kinetic-lab' },
  { label: 'Training paths', href: '#programs' },
  { label: 'Session guide', href: '#session-guide' },
  { label: 'Movement index', href: '#movement-library' },
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
    if (!Array.isArray(value)) return [];
    const allowedDays = new Set(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
    return [...new Set(value.filter((day): day is string => typeof day === 'string' && allowedDays.has(day)))];
  } catch {
    return [];
  }
}

function loadPlan(): PlanResult | null {
  try {
    if (typeof window === 'undefined') return null;
    const parsed: unknown = JSON.parse(window.localStorage.getItem('kinetik-starter-plan') || 'null');
    if (typeof parsed !== 'object' || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    if (typeof candidate.title !== 'string' || !candidate.title.trim()) return null;
    if (typeof candidate.meta !== 'string' || !candidate.meta.trim() || !Array.isArray(candidate.moves)) return null;
    const moves = candidate.moves
      .filter((move): move is string => typeof move === 'string' && move.trim().length > 0)
      .slice(0, 8);
    if (!moves.length) return null;
    return { title: candidate.title, meta: candidate.meta, moves };
  } catch {
    return null;
  }
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

function EquipmentScenePreview({ equipment, status }: { equipment: Equipment; status: string }) {
  return <div className="kinetic-object-host" role="img" aria-label={equipmentInfo[equipment].label + ' 3D preview'}><div className="scene-fallback"><span className="scene-ring scene-ring--one" /><span className="scene-ring scene-ring--two" /><span className={'scene-dumbbell scene-dumbbell--' + equipment}><i /><b />{equipment !== 'kettlebell' && <i />}</span><span className="scene-fallback-label">{status}</span></div></div>;
}

function KineticSceneLoader({ equipment, autoRotate, resetToken, finish, lighting, cameraPreset, storyBeat }: { equipment: Equipment; autoRotate: boolean; resetToken: number; finish: Finish; lighting: LightingPreset; cameraPreset: CameraPreset; storyBeat: StoryBeat }) {
  const host = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    if (!('IntersectionObserver' in window)) { setNearViewport(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '320px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} className="kinetic-scene-loader">{nearViewport ? <Suspense fallback={<EquipmentScenePreview equipment={equipment} status="LOADING 3D ENGINE" />}><KineticObject equipment={equipment} autoRotate={autoRotate} resetToken={resetToken} finish={finish} lighting={lighting} cameraPreset={cameraPreset} storyBeat={storyBeat} /></Suspense> : <EquipmentScenePreview equipment={equipment} status="SCENE STANDBY / APPROACH TO ACTIVATE" />}</div>;
}

function readScenePreset(): { equipment?: Equipment; finish?: Finish; lighting?: LightingPreset; cameraPreset?: CameraPreset; storyBeat?: StoryBeat } {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const equipment = params.get('equipment');
  const finish = params.get('finish');
  const lighting = params.get('lighting');
  const view = params.get('view');
  const story = Number(params.get('story'));
  return {
    equipment: equipment === 'dumbbell' || equipment === 'kettlebell' || equipment === 'barbell' ? equipment : undefined,
    finish: finish === 'carbon' || finish === 'steel' || finish === 'kinetik' ? finish : undefined,
    lighting: lighting === 'contrast' || lighting === 'neon' || lighting === 'studio' ? lighting : undefined,
    cameraPreset: view === 'front' || view === 'side' || view === 'hero' ? view : undefined,
    storyBeat: story === 1 || story === 2 ? story as StoryBeat : story === 0 ? 0 as StoryBeat : undefined,
  };
}

function KineticLab() {
  const [sharedPreset] = useState(readScenePreset);
  const [equipment, setEquipment] = useState<Equipment>(sharedPreset.equipment ?? 'barbell');
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetToken, setResetToken] = useState(0);
  const [finish, setFinish] = useState<Finish>(sharedPreset.finish ?? 'kinetik');
  const [lighting, setLighting] = useState<LightingPreset>(sharedPreset.lighting ?? 'studio');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>(sharedPreset.cameraPreset ?? 'hero');
  const [storyBeat, setStoryBeat] = useState<StoryBeat>(sharedPreset.storyBeat ?? 0);
  const [shareStatus, setShareStatus] = useState('');
  const story = storyBeats[storyBeat];
  const active = equipmentInfo[equipment];
  const choices = Object.keys(equipmentInfo) as Equipment[];

  return (
    <section className="kinetic-lab" id="kinetic-lab" aria-labelledby="kinetic-lab-title">
      <div className="page-shell">
        <div className="kinetic-lab-heading">
          <Reveal className="kinetic-lab-copy">
            <Eyebrow light>THE KINETIK LAB / LIVE OBJECTS</Eyebrow>
            <h2 id="kinetic-lab-title">BUILT IN 3D.<br /><em>MADE TO MOVE.</em></h2>
            <p>Not a video. Not a rendered poster. Explore custom-built training equipment in a real-time 3D scene, switch forms, and rotate each model with your pointer or finger.</p>
          </Reveal>
          <Reveal className="kinetic-lab-intro" delay={0.08}>
            <span className="kinetic-lab-live"><i /> WEBGL / INTERACTIVE SCENE</span>
            <p>Pick a piece. Spin it. Look closer.</p>
            <a className="text-link text-link--light" href="#programs">Find your training path <Arrow /></a>
          </Reveal>
        </div>
        <Reveal className="kinetic-lab-experience" delay={0.12}>
          <div className="kinetic-lab-console">
            <div className="kinetic-lab-picker" role="group" aria-label="Choose a 3D equipment model">
              {choices.map((choice) => {
                const info = equipmentInfo[choice];
                return <button key={choice} type="button" className={'kinetic-equipment-choice' + (equipment === choice ? ' kinetic-equipment-choice--active' : '')} aria-pressed={equipment === choice} onClick={() => { setEquipment(choice); setResetToken((n) => n + 1); }}><span className="kinetic-equipment-symbol" aria-hidden="true">{info.symbol}</span><span className="kinetic-equipment-label"><strong>{info.label}</strong><small>{info.code} / {info.focus}</small></span><span className="kinetic-equipment-arrow" aria-hidden="true">↗</span></button>;
              })}
            </div>
            <div className="kinetic-lab-tools">
              <span className="kinetic-lab-tools-label">SCENE CONTROLS</span>
              <button type="button" className={'kinetic-control' + (autoRotate ? ' kinetic-control--on' : '')} aria-pressed={autoRotate} onClick={() => setAutoRotate((value) => !value)}><span className="kinetic-control-indicator" /> Auto rotate <strong>{autoRotate ? 'ON' : 'OFF'}</strong></button>
              <button type="button" className="kinetic-control" onClick={() => setResetToken((n) => n + 1)}><span aria-hidden="true">↻</span> Reset view</button>
              <div className="kinetic-view-picker" role="group" aria-label="Choose camera view"><span className="kinetic-lab-tools-label">CAMERA / VIEW</span><div className="kinetic-view-options">{cameraOptions.map((option) => <button key={option.id} type="button" className={'kinetic-view-choice' + (cameraPreset === option.id ? ' kinetic-view-choice--active' : '')} aria-pressed={cameraPreset === option.id} onClick={() => { setCameraPreset(option.id); setResetToken((n) => n + 1); }}>{option.label}</button>)}</div></div>
              <div className="kinetic-lighting-picker" role="group" aria-label="Choose 3D scene lighting"><span className="kinetic-lab-tools-label">LIGHT RIG</span><div className="kinetic-lighting-options">{lightingOptions.map((option) => <button key={option.id} type="button" className={'kinetic-lighting-choice kinetic-lighting-choice--' + option.id + (lighting === option.id ? ' kinetic-lighting-choice--active' : '')} aria-pressed={lighting === option.id} onClick={() => setLighting(option.id)}><span className="kinetic-lighting-dot" aria-hidden="true" /><span><strong>{option.label}</strong><small>{option.note}</small></span></button>)}</div></div>
              <div className="kinetic-finish-picker" role="group" aria-label="Choose equipment material finish"><span className="kinetic-lab-tools-label">MATERIAL FINISH</span><div className="kinetic-finish-options">{finishOptions.map((option) => <button key={option.id} type="button" className={'kinetic-finish-choice kinetic-finish-choice--' + option.id + (finish === option.id ? ' kinetic-finish-choice--active' : '')} aria-pressed={finish === option.id} onClick={() => setFinish(option.id)}><span className="kinetic-finish-swatch" aria-hidden="true" /><span><strong>{option.label}</strong><small>{option.note}</small></span></button>)}</div></div>
            </div>
          </div>
          <div className="kinetic-lab-stage">
            <div className="kinetic-lab-grid" aria-hidden="true" />
            <div className="kinetic-lab-stage-top"><span>OBJECT / {active.code}</span><span>{active.descriptor}</span></div>
            <KineticSceneLoader equipment={equipment} autoRotate={autoRotate} resetToken={resetToken} finish={finish} lighting={lighting} cameraPreset={cameraPreset} storyBeat={storyBeat} />
            <div className="kinetic-lab-object-info" aria-live="polite"><span>{active.code} / 03</span><strong>{active.title}</strong><p>{active.copy}</p><div className="kinetic-lab-object-tag">{active.focus}</div></div>
            <div className="kinetic-lab-stage-bottom"><span>DRAG TO ORBIT · SCROLL TO EXPLORE</span><span className="kinetic-lab-live"><i /> SCENE READY</span></div>
            <span className="kinetic-lab-cross kinetic-lab-cross--one" aria-hidden="true">＋</span>
            <span className="kinetic-lab-cross kinetic-lab-cross--two" aria-hidden="true">＋</span>
          </div>
          <div className="kinetic-story" aria-labelledby="kinetic-story-title">
            <div className="kinetic-story-track" role="group" aria-label="Explore the 3D product story">
              {storyBeats.map((beat) => <button key={beat.id} type="button" className={'kinetic-story-step' + (storyBeat === beat.id ? ' kinetic-story-step--active' : '')} aria-pressed={storyBeat === beat.id} onClick={() => setStoryBeat(beat.id)}><span>{String(beat.id + 1).padStart(2, '0')}</span><i aria-hidden="true" /></button>)}
            </div>
            <div className="kinetic-story-copy" aria-live="polite"><span>{story.eyebrow}</span><h3 id="kinetic-story-title">{story.title}</h3><p>{story.copy}</p><div className="kinetic-story-nav"><button type="button" disabled={storyBeat === 0} onClick={() => setStoryBeat((value) => (value - 1) as StoryBeat)}>← Previous</button><button type="button" disabled={storyBeat === 2} onClick={() => setStoryBeat((value) => (value + 1) as StoryBeat)}>Next detail →</button></div></div>
          </div>
          <div className="kinetic-lab-caption"><span>INTERACTIVE OBJECT STUDY</span><span>SCROLL / SELECT / INSPECT</span><span>DRAG TO ROTATE ↗</span></div>
          <div className="kinetic-share-row"><p>Keep this exact setup or send it to a training partner.</p><button type="button" className="kinetic-share-button" onClick={async () => {
            const url = new URL(window.location.href);
            url.searchParams.set('equipment', equipment);
            url.searchParams.set('finish', finish);
            url.searchParams.set('lighting', lighting);
            url.searchParams.set('view', cameraPreset);
            url.searchParams.set('story', String(storyBeat));
            try {
              await navigator.clipboard.writeText(url.toString());
              setShareStatus('Setup link copied');
            } catch {
              url.hash = 'kinetic-lab';
              window.prompt('Copy your KINETIK setup link:', url.toString());
              setShareStatus('Copy the link from the dialog');
            }
          }}><span aria-hidden="true">↗</span> Copy setup link</button><span className="kinetic-share-status" role="status" aria-live="polite">{shareStatus}</span></div>
        </Reveal>
      </div>
    </section>
  );
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
  const goals: Goal[] = ['strength', 'conditioning', 'mobility'];

  useEffect(() => {
    function choosePath(event: Event) {
      const next = (event as CustomEvent<Goal>).detail;
      if (next === 'strength' || next === 'conditioning' || next === 'mobility') {
        setGoal(next);
        setActive(paths[next]);
      }
    }
    window.addEventListener('kinetik-path', choosePath);
    return () => window.removeEventListener('kinetik-path', choosePath);
  }, []);

  function selectGoal(next: Goal) {
    setGoal(next);
    setActive(paths[next]);
  }

  function handleTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, current: Goal) {
    const currentIndex = goals.indexOf(current);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % goals.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex + goals.length - 1) % goals.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = goals.length - 1;
    else return;

    event.preventDefault();
    const nextGoal = goals[nextIndex];
    selectGoal(nextGoal);
    document.getElementById('path-tab-' + nextGoal)?.focus();
  }

  function buildPlan() {
    window.dispatchEvent(new CustomEvent('kinetik-focus', { detail: goal }));
    window.location.hash = 'start';
  }

  return (
    <section className="path-section section-pad" id="training-path">
      <div className="page-shell">
        <Reveal className="section-heading section-heading--split">
          <div><Eyebrow>04 / FIND YOUR STARTING POINT</Eyebrow><h2>YOUR TRAINING.<br /><em>YOUR PACE.</em></h2></div>
          <p>Choose the type of work that fits your current goal. Explore a few practical starting points, then use the builder to sketch a first session.</p>
        </Reveal>
        <div className="path-tabs" role="tablist" aria-label="Choose training path">
          {goals.map((key) => (
            <button
              id={'path-tab-' + key}
              type="button"
              role="tab"
              aria-selected={goal === key}
              aria-controls="path-panel"
              tabIndex={goal === key ? 0 : -1}
              className={goal === key ? 'path-tab path-tab--active' : 'path-tab'}
              key={key}
              onClick={() => selectGoal(key)}
              onKeyDown={(event) => handleTabKeyDown(event, key)}
            >{paths[key].label}<Arrow diagonal={false} /></button>
          ))}
        </div>
        <div className="path-content" id="path-panel" role="tabpanel" aria-labelledby={'path-tab-' + goal} tabIndex={0}>
          <div className="path-photo">
            <img src={active.image} alt={active.imageAlt} loading="lazy" decoding="async" />
            <span className="path-photo-caption">{active.note}</span>
            <span className="path-photo-index">KINETIK / 0{goals.indexOf(goal) + 1}</span>
          </div>
          <div className="path-detail">
            <Eyebrow>THE STARTING POINT</Eyebrow>
            <h3>{active.title}</h3>
            <p className="path-statement">{active.statement}</p>
            <div className="path-steps">
              {active.steps.map((step, index) => (
                <div className="path-step" key={step.title}>
                  <span>0{index + 1}</span>
                  <div><strong>{step.title}</strong><p>{step.copy}</p></div>
                </div>
              ))}
            </div>
            <button type="button" className="button button--dark" onClick={buildPlan}>Build from this path <Arrow /></button>
          </div>
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

function SessionGuide() {
  const steps = [
    { number: '01', label: 'ARRIVE', title: 'Set your intention', copy: 'Choose one focus for today. Put your phone away, check your space, and make the session feel manageable.', time: '2—3 MIN' },
    { number: '02', label: 'PREPARE', title: 'Warm up gradually', copy: 'Start with easy movement, then rehearse the patterns you plan to train. Increase effort progressively.', time: '5—10 MIN' },
    { number: '03', label: 'PRACTISE', title: 'Work with control', copy: 'Use a pace and load you can manage. Rest when needed and stop if you feel sharp pain, dizziness, or unusual symptoms.', time: 'MAIN SET' },
    { number: '04', label: 'RESET', title: 'Close the loop', copy: 'Ease down, note what went well, and leave room for food, sleep, and recovery before the next session.', time: '3—5 MIN' },
  ];
  return <section className="session-guide section-pad" id="session-guide" aria-labelledby="session-guide-title"><div className="page-shell"><Reveal className="section-heading section-heading--split"><div><Eyebrow>07 / THE SESSION BLUEPRINT</Eyebrow><h2 id="session-guide-title">MAKE EVERY<br /><em>MINUTE COUNT.</em></h2></div><p>A repeatable structure can make training feel less overwhelming. Use this as a flexible checklist—not a performance test or a fixed prescription.</p></Reveal><div className="session-steps">{steps.map((step, index) => <Reveal key={step.number} delay={index * 0.06}><article className="session-step"><div className="session-step-top"><span>{step.number} / {step.label}</span><span>{step.time}</span></div><div className="session-step-mark" aria-hidden="true">{['↗', '⌁', '◎', '↻'][index]}</div><h3>{step.title}</h3><p>{step.copy}</p></article></Reveal>)}</div><div className="session-guide-foot"><span><i /> FLEXIBLE / BEGINNER-FRIENDLY</span><a className="underlined-link" href="#start">Build a starter session <Arrow /></a></div></div></section>;
}


const movementLibrary = [
  { name: 'Goblet squat', category: 'STRENGTH', equipment: 'Dumbbell or kettlebell', focus: 'Squat pattern', cue: 'Keep the load close, brace gently, and use a comfortable depth.' },
  { name: 'Hip hinge drill', category: 'STRENGTH', equipment: 'Bodyweight', focus: 'Hinge pattern', cue: 'Push hips back while keeping the spine comfortable and controlled.' },
  { name: 'Incline push-up', category: 'STRENGTH', equipment: 'Bench or sturdy elevated surface', focus: 'Push pattern', cue: 'Keep the body in one line and choose an incline that allows smooth reps.' },
  { name: 'Supported dumbbell row', category: 'STRENGTH', equipment: 'Dumbbell and bench', focus: 'Pull pattern', cue: 'Support your torso and pull without twisting or jerking.' },
  { name: 'Farmer carry', category: 'STRENGTH', equipment: 'Dumbbells or kettlebells', focus: 'Grip and bracing', cue: 'Walk tall with manageable loads and a clear, obstacle-free path.' },
  { name: 'Brisk walk intervals', category: 'ENGINE', equipment: 'Walking space', focus: 'Low-impact conditioning', cue: 'Alternate comfortable brisk periods with easier recovery periods.' },
  { name: 'Step-ups', category: 'ENGINE', equipment: 'Low stable step', focus: 'Steady effort', cue: 'Use a low, stable step and move with control; hold a rail if needed.' },
  { name: 'March in place', category: 'ENGINE', equipment: 'Bodyweight', focus: 'Accessible conditioning', cue: 'Start at an easy pace and increase only while you can stay comfortable.' },
  { name: 'Dead bug', category: 'RESTORE', equipment: 'Mat', focus: 'Trunk control', cue: 'Move slowly and keep the range small enough to maintain control.' },
  { name: 'Cat-cow', category: 'RESTORE', equipment: 'Mat', focus: 'Gentle spinal movement', cue: 'Move smoothly through a comfortable range; avoid forcing end positions.' },
  { name: 'Ankle rocks', category: 'RESTORE', equipment: 'Wall optional', focus: 'Ankle mobility', cue: 'Keep the heel grounded and use a pain-free range.' },
  { name: 'Easy breathing reset', category: 'RESTORE', equipment: 'Quiet space', focus: 'Downshift', cue: 'Breathe naturally and slowly without holding your breath or straining.' },
] as const;

type MovementFilter = 'ALL' | 'STRENGTH' | 'ENGINE' | 'RESTORE';

function MovementExplorer() {
  const [filter, setFilter] = useState<MovementFilter>('ALL');
  const [query, setQuery] = useState('');
  const visibleMoves = movementLibrary.filter((move) =>
    (filter === 'ALL' || move.category === filter) &&
    (move.name + ' ' + move.equipment + ' ' + move.focus + ' ' + move.cue).toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="movement-explorer section-pad" id="movement-library">
      <div className="page-shell">
        <Reveal className="movement-heading">
          <Eyebrow>07 / THE MOVEMENT INDEX</Eyebrow>
          <h2>KNOW THE MOVE.<br /><em>OWN THE BASICS.</em></h2>
          <p>A small, searchable reference for common movement patterns. Start with control, use a manageable variation, and build consistency before adding complexity.</p>
        </Reveal>
        <div className="movement-tools">
          <label className="movement-search">
            <span className="field-label">SEARCH MOVEMENTS</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “hinge”, “mat”, or “dumbbell”" aria-label="Search movement library" />
          </label>
          <div className="movement-filters" aria-label="Filter movement category">
            {(['ALL', 'STRENGTH', 'ENGINE', 'RESTORE'] as const).map((item) => (
              <button key={item} type="button" className={filter === item ? 'movement-filter movement-filter--active' : 'movement-filter'} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === 'ALL' ? 'All moves' : item === 'ENGINE' ? 'Conditioning' : item === 'RESTORE' ? 'Mobility & reset' : 'Strength'}</button>
            ))}
          </div>
        </div>
        <p className="movement-count" aria-live="polite">{visibleMoves.length} {visibleMoves.length === 1 ? 'movement' : 'movements'} shown <span> / 12 STARTER REFERENCES</span></p>
        {visibleMoves.length ? (
          <div className="movement-grid">
            {visibleMoves.map((move, index) => (
              <article className="movement-card" key={move.name}>
                <div className="movement-card-top"><span>{String(index + 1).padStart(2, '0')}</span><span className={'movement-tag movement-tag--' + move.category.toLowerCase()}>{move.category}</span></div>
                <h3>{move.name}</h3>
                <p className="movement-focus">{move.focus}</p>
                <p>{move.cue}</p>
                <div className="movement-equipment"><span>EQUIPMENT</span><strong>{move.equipment}</strong></div>
              </article>
            ))}
          </div>
        ) : <div className="movement-empty"><strong>No matching movement.</strong><p>Try a broader term or reset the filters.</p><button type="button" className="clear-plan" onClick={() => { setQuery(''); setFilter('ALL'); }}>Reset movement search ↺</button></div>}
        <p className="movement-disclaimer">Educational reference only. This is not a personalized prescription. Choose safe, stable equipment, adapt movements to your ability, and stop if you feel pain or unusual symptoms.</p>
      </div>
    </section>
  );
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
  const [planStatus, setPlanStatus] = useState('');

  function invalidatePlan() {
    setPlan(null);
    try {
      window.localStorage.removeItem('kinetik-starter-plan');
    } catch {
      // Keep the form usable when browser storage is unavailable.
    }
  }

  useEffect(() => {
    function onFocus(event: Event) {
      const next = (event as CustomEvent<Goal>).detail;
      if (next === 'strength' || next === 'conditioning' || next === 'mobility') {
        setGoal(next);
        invalidatePlan();
      }
    }
    window.addEventListener('kinetik-focus', onFocus);
    return () => window.removeEventListener('kinetik-focus', onFocus);
  }, []);

  async function copyPlan() {
    if (!plan) return;
    const text = [plan.title, plan.meta, '', ...plan.moves.map((move, index) => (index + 1) + '. ' + move), '', 'KINETIK sample plan — adapt to your ability.'].join('\n');
    try {
      if (navigator.clipboard?.writeText) {
        // Some embedded browsers expose the Clipboard API but leave its promise pending.
        // Bound the wait so the manual-copy fallback and accessible status always appear.
        let timeoutId: number | undefined;
        try {
          await Promise.race([
            navigator.clipboard.writeText(text),
            new Promise<never>((_, reject) => {
              timeoutId = window.setTimeout(() => reject(new Error('Clipboard write timed out')), 1500);
            }),
          ]);
        } finally {
          if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        }
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setPlanStatus('Plan copied. Paste it into your notes.');
    } catch {
      try {
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        setPlanStatus(copied ? 'Plan copied. Paste it into your notes.' : 'Copy was blocked. Select the plan text and copy it manually.');
      } catch {
        setPlanStatus('Copy was blocked. Select the plan text and copy it manually.');
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlanStatus('');
    const next: PlanResult = {
      title: goalTitles[goal],
      meta: level[0].toUpperCase() + level.slice(1) + ' level · ' + duration + ' minutes · browser-made sample',
      moves: planTemplates[goal].slice(0, duration === '30' ? 3 : 4),
    };
    setPlan(next);
    try {
      window.localStorage.setItem('kinetik-starter-plan', JSON.stringify(next));
    } catch {
      // The generated plan remains visible for this session.
    }
  }

  return (
    <section className="builder section-pad" id="start">
      <div className="page-shell builder-layout">
        <Reveal className="builder-intro">
          <Eyebrow>09 / START WITH A FIRST DRAFT</Eyebrow>
          <h2>MAKE A PLAN.<br /><em>MAKE IT YOURS.</em></h2>
          <p>Choose a goal, your starting point, and the time you have. KINETIK will put together a simple session template you can review and adapt.</p>
          <div className="builder-note"><span>✳</span><p><strong>NO MAGIC FORMULA.</strong><br />Just a practical place to begin. Keep the plan realistic and progress at your own pace.</p></div>
        </Reveal>
        <Reveal className="builder-card" delay={0.1}>
          <div className="builder-card-head"><span>STARTER PLAN BUILDER</span><span>3 INPUTS / 1 PLAN</span></div>
          <form onSubmit={submit}>
            <fieldset className="goal-fieldset">
              <legend className="field-label">01 / What is your focus?</legend>
              <div className="goal-options">
                <label className={'goal-option' + (goal === 'strength' ? ' goal-option--selected' : '')}>
                  <input type="radio" name="goal" value="strength" checked={goal === 'strength'} onChange={() => { setGoal('strength'); invalidatePlan(); }} />
                  <span className="goal-icon">↗</span><strong>Get stronger</strong><small>Strength</small>
                </label>
                <label className={'goal-option' + (goal === 'conditioning' ? ' goal-option--selected' : '')}>
                  <input type="radio" name="goal" value="conditioning" checked={goal === 'conditioning'} onChange={() => { setGoal('conditioning'); invalidatePlan(); }} />
                  <span className="goal-icon">⌁</span><strong>Build my engine</strong><small>Conditioning</small>
                </label>
                <label className={'goal-option' + (goal === 'mobility' ? ' goal-option--selected' : '')}>
                  <input type="radio" name="goal" value="mobility" checked={goal === 'mobility'} onChange={() => { setGoal('mobility'); invalidatePlan(); }} />
                  <span className="goal-icon">↻</span><strong>Move with ease</strong><small>Mobility</small>
                </label>
              </div>
            </fieldset>
            <div className="builder-fields">
              <label>
                <span className="field-label">02 / Starting point</span>
                <select value={level} onChange={(event) => { setLevel(event.target.value); invalidatePlan(); }}>
                  <option value="beginner">Beginner — learn the basics</option>
                  <option value="intermediate">Intermediate — build consistency</option>
                  <option value="advanced">Advanced — stay deliberate</option>
                </select>
              </label>
              <label>
                <span className="field-label">03 / Time available</span>
                <select value={duration} onChange={(event) => { setDuration(event.target.value); invalidatePlan(); }}>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </label>
            </div>
            <button className="button button--lime button--full" type="submit">Build my starter plan <Arrow /></button>
          </form>
          {plan && (
            <div className="generated-plan" aria-live="polite">
              <div className="generated-plan-head"><span>YOUR FIRST DRAFT</span><span className="plan-check">✓</span></div>
              <h3>{plan.title}</h3>
              <p className="plan-meta">{plan.meta}</p>
              <ol>{plan.moves.map((move) => <li key={move}>{move}</li>)}</ol>
              <p className="plan-disclaimer">Educational example only—not individualized medical advice. Adapt movements to your ability and stop if an exercise causes pain.</p>
              <div className="plan-actions">
                <button type="button" className="copy-plan" onClick={() => void copyPlan()}>Copy plan ↗</button>
                <button type="button" className="clear-plan" onClick={() => { invalidatePlan(); setPlanStatus(''); }}>Clear saved plan ×</button>
              </div>
              <p className="plan-copy-status" role="status" aria-live="polite">{planStatus}</p>
            </div>
          )}
          <p className="builder-local-note"><span /> Preferences and plan stay in this browser only.</p>
        </Reveal>
      </div>
    </section>
  );
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
  return <MotionConfig reducedMotion="user"><div className="kinetik-app"><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content"><Hero /><Marquee /><KineticLab /><Approach /><Programs /><FeatureSection /><PathExplorer /><Gallery /><FuelSection /><SessionGuide /><MovementExplorer /><WeeklyPlan /><ProgressTracker /><PlanBuilder /><FAQ /><Closing /></main><Footer /></div></MotionConfig>;
}

export default App;
