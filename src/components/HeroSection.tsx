import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BotanicalOrnaments } from './BotanicalOrnaments';
import { DragonScene } from './DragonScene';

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section ref={heroRef} className="hero" id="home" aria-labelledby="hero-title">
      <BotanicalOrnaments />
      <div className="hero-meta hero-meta-left"><span>OBJECTS / RITUALS</span><span>AN ONGOING STUDY</span></div>
      <div className="hero-meta hero-meta-right"><span>VOL. 01</span><span>IN BLUE & WHITE</span></div>
      <div className="hero-title-wrap">
        <motion.p
          className="hero-kicker"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >A PRACTICE OF PRESENCE</motion.p>
        <motion.h1
          id="hero-title"
          className="hero-title"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >Ritually</motion.h1>
      </div>
      <DragonScene eventSource={heroRef} />
      <div className="hero-caption hero-caption-left">
        <span className="caption-index">01 — 03</span>
        <p>Finding the extraordinary<br />inside the everyday.</p>
      </div>
      <a className="hero-discover" href="#listen"><span>SCROLL TO DISCOVER</span><span className="discover-line" aria-hidden="true" /></a>
      <div className="hero-caption hero-caption-right">
        <span className="caption-index">A STUDY IN FORM</span>
        <p>Porcelain · pigment · time</p>
      </div>
    </section>
  );
}
