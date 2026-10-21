import { MotionConfig } from 'framer-motion';
import { SiteHeader } from './components/SiteHeader';
import { WatercolorBackground } from './components/WatercolorBackground';
import { HeroSection } from './components/HeroSection';
import { StudioSections } from './components/StudioSections';
import { ScrollProgress } from './components/ScrollProgress';
import { CommandPalette } from './components/CommandPalette';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <WatercolorBackground />
        <ScrollProgress />
        <SiteHeader />
        <CommandPalette />
        <main id="main-content" tabIndex={-1}>
          <HeroSection />
          <StudioSections />
        </main>
        <footer className="site-footer">
          <a className="footer-mark" href="#home" aria-label="Kairo Studio, back to top">K<span>·</span>S</a>
          <p>Made with patience, pigment, and a little wonder.</p>
          <span className="footer-copyright">© {new Date().getFullYear()} KAIRO STUDIO</span>
          <a className="footer-top" href="#home">BACK TO THE BEGINNING ↑</a>
        </footer>
      </div>
    </MotionConfig>
  );
}
