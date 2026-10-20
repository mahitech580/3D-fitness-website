import { MotionConfig } from 'framer-motion';
import { SiteHeader } from './components/SiteHeader';
import { WatercolorBackground } from './components/WatercolorBackground';
import { HeroSection } from './components/HeroSection';
import { StudioSections } from './components/StudioSections';
import { ScrollProgress } from './components/ScrollProgress';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <WatercolorBackground />
        <ScrollProgress />
        <SiteHeader />
        <main id="main-content">
          <HeroSection />
          <StudioSections />
        </main>
        <footer className="site-footer">
          <a className="footer-mark" href="#home" aria-label="Kairo Studio, back to top">K<span>·</span>S</a>
          <p>Made with patience, pigment, and a little wonder.</p>
          <a className="footer-top" href="#home">BACK TO THE BEGINNING ↑</a>
        </footer>
      </div>
    </MotionConfig>
  );
}
