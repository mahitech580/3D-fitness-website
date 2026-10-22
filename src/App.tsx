import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ScrollProgress } from './components/ScrollProgress';
import { FitnessScene } from './components/FitnessScene';
import { WorkoutArena } from './components/WorkoutArena';
import { WorkoutBuilder } from './components/WorkoutBuilder';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { GymPlanner } from './components/GymPlanner';
import { TrialBooking } from './components/TrialBooking';
import { CommandPalette } from './components/CommandPalette';
import { ShareSiteButton } from './components/ShareSiteButton';
import { GymDiscovery } from './components/GymDiscovery';

const navigation = [
  { href: '#arena', label: '3D WORKOUT' },
  { href: '#training', label: 'TRAINING PLAN' },
  { href: '#library', label: 'MOVEMENT INDEX' },
  { href: '#gyms', label: 'GYM CONCEPTS' },
  { href: '#space', label: 'GYM PLANNER' },
  { href: '#start', label: 'FIRST SESSION' },
];

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try { return window.localStorage.getItem('kinetik-theme') === 'light' ? 'light' : 'dark'; }
    catch { return 'dark'; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scenePaused, setScenePaused] = useState(false);
  const [selectedGym, setSelectedGym] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem('kinetik-theme', theme); } catch { /* Storage may be disabled. */ }
  }, [theme]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="kinetik-site" data-theme={theme}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="ambient-grid" aria-hidden="true" />
        <ScrollProgress />
        <CommandPalette />
        <header className="site-header">
          <a className="brand-lockup" href="#home" aria-label="Kinetik home"><span className="brand-mark" aria-hidden="true">K</span><span>KINETIK<span className="brand-sub">TRAINING, BUILT AROUND YOU</span></span></a>
          <nav id="site-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
            {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          </nav>
          <div className="header-actions">
            <button className="theme-button" type="button" onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={theme === 'light'}><span aria-hidden="true">{theme === 'dark' ? '◐' : '◑'}</span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</button>
            <a className="header-cta" href="#start">LET’S START <span aria-hidden="true">↗</span></a>
            <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}><span>{menuOpen ? 'CLOSE' : 'MENU'}</span><span aria-hidden="true">{menuOpen ? '×' : '+'}</span></button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          <section className="hero-section" id="home" aria-labelledby="hero-title">
            <div className="hero-backdrop-word" aria-hidden="true">MOVE</div>
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow"><span className="status-dot" /> MOVEMENT IS A PRACTICE <span>/ EST. 2026</span></p>
              <h1 id="hero-title">TRAIN WITH<br /><em>INTENT.</em></h1>
              <p className="hero-description">A smarter starting point for building strength, moving better, and making training fit the life you actually have.</p>
              <div className="hero-actions"><a className="button button-primary" href="#arena">ENTER 3D WORKOUT <span aria-hidden="true">↗</span></a><a className="button button-secondary" href="#training">BUILD MY WEEK <span aria-hidden="true">↓</span></a></div>
              <div className="hero-note"><span className="note-index">01 / 06</span><p>START WHERE YOU ARE.<br />BUILD FROM THERE.</p></div>
            </div>
            <div className="hero-art">
              <div className="art-orbit orbit-one" aria-hidden="true" /><div className="art-orbit orbit-two" aria-hidden="true" />
              <div className="art-kicker"><span>FORM / FUNCTION</span><span>01 — TRAINING EQUIPMENT</span></div>
              <FitnessScene paused={scenePaused} />
              <button className="scene-toggle" type="button" aria-pressed={scenePaused} onClick={() => setScenePaused((paused) => !paused)}>{scenePaused ? 'RESUME ROTATION' : 'PAUSE ROTATION'} <span aria-hidden="true">{scenePaused ? '▶' : 'Ⅱ'}</span></button>
              <p className="art-caption">BUILT FOR THE REPETITION THAT BUILDS YOU.</p>
            </div>
            <div className="hero-bottomline"><span>STRENGTH / CONDITIONING / MOBILITY</span><a href="#arena">ENTER THE MOTION LAB <span aria-hidden="true">↓</span></a><span>CONTROLLED EFFORT. REAL PROGRESS.</span></div>
          </section>
          <WorkoutArena />
          <div className="ticker" aria-label="Training approaches"><div className="ticker-track"><span>STRENGTH</span><i>✳</i><span>CONDITIONING</span><i>✳</i><span>MOBILITY</span><i>✳</i><span>CONSISTENCY</span><i>✳</i><span>STRENGTH</span><i>✳</i><span>CONDITIONING</span><i>✳</i><span>MOBILITY</span><i>✳</i><span>CONSISTENCY</span><i>✳</i></div></div>
          <WorkoutBuilder />
          <ExerciseLibrary />
          <GymDiscovery onEnquire={(gymName) => setSelectedGym(gymName)} />
          <GymPlanner />
          <TrialBooking selectedGym={selectedGym} />
        </main>
        <footer className="site-footer">
          <a className="footer-brand" href="#home"><span className="brand-mark" aria-hidden="true">K</span>KINETIK</a>
          <p>Train with intent. Keep showing up.</p>
          <div className="footer-links">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <ShareSiteButton />
          <span className="footer-legal">© {new Date().getFullYear()} KINETIK / INDEPENDENT FITNESS CONCEPT</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
