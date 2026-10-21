import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { SiteHeader } from './components/SiteHeader';
import { WatercolorBackground } from './components/WatercolorBackground';
import { HeroSection } from './components/HeroSection';
import { StudioSections } from './components/StudioSections';
import { ScrollProgress } from './components/ScrollProgress';
import { CommandPalette } from './components/CommandPalette';
import { ShareSiteButton } from './components/ShareSiteButton';

export function App() {
  const [theme, setTheme] = useState<'light' | 'night'>(() => {
    try { return window.localStorage.getItem('kairo-theme') === 'night' ? 'night' : 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem('kairo-theme', theme); } catch { /* Storage can be disabled. */ }
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell" data-theme={theme}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <WatercolorBackground />
        <ScrollProgress />
        <SiteHeader theme={theme} onToggleTheme={() => setTheme((current) => current === 'light' ? 'night' : 'light')} />
        <CommandPalette />
        <main id="main-content" tabIndex={-1}>
          <HeroSection />
          <StudioSections />
        </main>
        <footer className="site-footer">
          <a className="footer-mark" href="#home" aria-label="Kairo Studio, back to top">K<span>·</span>S</a>
          <p>Made with patience, pigment, and a little wonder.</p>
          <span className="footer-copyright">© {new Date().getFullYear()} KAIRO STUDIO</span>
          <ShareSiteButton />
          <a className="footer-top" href="#home">BACK TO THE BEGINNING ↑</a>
        </footer>
      </div>
    </MotionConfig>
  );
}
