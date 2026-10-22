import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ScrollProgress } from './components/ScrollProgress';
import { WorkoutArena, type MoveId } from './components/WorkoutArena';
import { WorkoutBuilder } from './components/WorkoutBuilder';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { GymPlanner } from './components/GymPlanner';
import { TrialBooking } from './components/TrialBooking';
import { CommandPalette } from './components/CommandPalette';
import { ShareSiteButton } from './components/ShareSiteButton';
import { GymDiscovery } from './components/GymDiscovery';
import { LandingHero } from './components/LandingHero';
import './styles/kinetik-refresh.css';

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
  const [selectedGym, setSelectedGym] = useState('');
  const [studioLaunch, setStudioLaunch] = useState<{ moveId: MoveId; requestId: number } | null>(null);

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

  function startInStudio(moveId: MoveId) {
    setStudioLaunch((current) => ({ moveId, requestId: (current?.requestId ?? 0) + 1 }));
    window.location.hash = 'arena';
    window.requestAnimationFrame(() => {
      document.getElementById('arena')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="kinetik-site" data-theme={theme}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="ambient-grid" aria-hidden="true" />
        <ScrollProgress />
        <CommandPalette />
        <header className="site-header">
          <a className="brand-lockup" href="#home" aria-label="Kinetik home"><span className="brand-mark" aria-hidden="true">K</span><span>KINETIK<span className="brand-sub">INTERACTIVE 3D WORKOUT LAB</span></span></a>
          <nav id="site-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
            {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          </nav>
          <div className="header-actions">
            <button className="theme-button" type="button" onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={theme === 'light'}><span aria-hidden="true">{theme === 'dark' ? '◐' : '◑'}</span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</button>
            <a className="header-cta" href="#arena">ENTER STUDIO <span aria-hidden="true">↗</span></a>
            <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}><span>{menuOpen ? 'CLOSE' : 'MENU'}</span><span aria-hidden="true">{menuOpen ? '×' : '+'}</span></button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          <LandingHero />
          <WorkoutArena launchRequest={studioLaunch} />
          <WorkoutBuilder onStartIn3D={startInStudio} />
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
