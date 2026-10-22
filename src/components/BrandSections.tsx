import { motion } from 'framer-motion';
import '../styles/brand-sections.css';

const photos = {
  strength: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85',
  conditioning: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1100&q=85',
  mobility: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85',
  performance: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1100&q=85',
  floor: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1800&q=85',
  details: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1400&q=85',
  weights: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=85',
  studio: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85',
};

const programCards = [
  {
    number: '01',
    label: 'BUILD FOUNDATIONS',
    title: 'Strength',
    description: 'Simple, repeatable sessions built around steady progress.',
    action: 'BUILD A WEEK',
    href: '#training',
    image: photos.strength,
    className: 'brand-program-card--strength',
  },
  {
    number: '02',
    label: 'MOVE WITH PURPOSE',
    title: 'Conditioning',
    description: 'Keep your engine moving with focused cardio and interval work.',
    action: 'EXPLORE MOVEMENTS',
    href: '#library',
    image: photos.conditioning,
    className: 'brand-program-card--conditioning',
  },
  {
    number: '03',
    label: 'RESET & RECOVER',
    title: 'Mobility',
    description: 'Make room for range of motion, balance and controlled movement.',
    action: 'BROWSE THE LIBRARY',
    href: '#library',
    image: photos.mobility,
    className: 'brand-program-card--mobility',
  },
  {
    number: '04',
    label: 'MAKE IT YOURS',
    title: 'Hybrid',
    description: 'Combine strength and conditioning around the time and equipment you have.',
    action: 'PERSONALISE A PLAN',
    href: '#training',
    image: photos.performance,
    className: 'brand-program-card--hybrid',
  },
];

const galleryTiles = [
  { label: 'THE STRENGTH FLOOR', detail: 'SPACE / 001', image: photos.floor, className: 'brand-gallery-tile--wide' },
  { label: 'GEAR THAT GETS USED', detail: 'DETAIL / 002', image: photos.weights, className: '' },
  { label: 'FIND YOUR RHYTHM', detail: 'MOTION / 003', image: photos.conditioning, className: '' },
  { label: 'SHOW UP AGAIN', detail: 'PRACTICE / 004', image: photos.details, className: 'brand-gallery-tile--wide' },
];

export function BrandMarquee() {
  return (
    <div className="brand-marquee" aria-label="Strength, conditioning, mobility and repeatable progress">
      <div className="brand-marquee-track" aria-hidden="true">
        {Array.from({ length: 2 }, (_, copy) => (
          <span className="brand-marquee-copy" key={copy}>
            <b>STRENGTH</b><i>✳</i><b>CONDITIONING</b><i>✳</i><b>MOBILITY</b><i>✳</i><b>CONSISTENCY</b><i>✳</i><b>REPEAT</b><i>✳</i>
          </span>
        ))}
      </div>
      <span className="sr-only">Strength. Conditioning. Mobility. Consistency. Repeat.</span>
    </div>
  );
}

export function ProgramShowcase() {
  return (
    <section className="brand-programs-section" id="programs" aria-labelledby="programs-title">
      <div className="brand-section-shell">
        <div className="brand-section-heading">
          <div>
            <p className="brand-section-kicker">02 / PICK YOUR FOCUS</p>
            <h2 id="programs-title">PROGRAMS FOR<br /><em>YOUR PACE.</em></h2>
          </div>
          <p>Not a one-size-fits-all split. Pick the kind of work you want to do, then shape a practical starting week with the planner.</p>
        </div>

        <div className="brand-program-grid">
          {programCards.map((card, index) => (
            <motion.a
              key={card.number}
              className={`brand-program-card ${card.className}`}
              href={card.href}
              style={{ backgroundImage: `linear-gradient(180deg, rgba(8,10,11,.12) 0%, rgba(8,10,11,.16) 28%, rgba(8,10,11,.94) 100%), url("${card.image}")` }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.48, delay: index * 0.075 }}
            >
              <div className="brand-program-top"><span>{card.number} / {card.label}</span><i aria-hidden="true">↗</i></div>
              <div className="brand-program-copy">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="brand-program-link">{card.action} <b aria-hidden="true">↗</b></span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StudioCulture() {
  return (
    <section
      className="brand-studio-section"
      id="method"
      aria-labelledby="brand-studio-title"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(7,9,10,.97) 0%, rgba(7,9,10,.86) 43%, rgba(7,9,10,.5) 100%), url("${photos.studio}")` }}
    >
      <div className="brand-section-shell brand-studio-shell">
        <div className="brand-studio-copy">
          <p className="brand-section-kicker">03 / A BETTER TRAINING LOOP</p>
          <h2 id="brand-studio-title">LESS NOISE.<br /><em>MORE WORK.</em></h2>
          <p>Learn the movement. Build a plan you can repeat. Keep a record of the effort you actually put in. The tools stay clear, so the training can stay yours.</p>
          <a className="brand-outline-link" href="#arena">EXPLORE THE STUDIO <span aria-hidden="true">↗</span></a>
        </div>
        <div className="brand-steps" aria-label="How Kinetik works">
          <div className="brand-step"><span>01</span><div><strong>Understand</strong><p>Browse movement guidance and equipment notes before you start.</p></div><i aria-hidden="true">↗</i></div>
          <div className="brand-step"><span>02</span><div><strong>Plan</strong><p>Build a week around your time, training level and available gear.</p></div><i aria-hidden="true">↗</i></div>
          <div className="brand-step"><span>03</span><div><strong>Repeat</strong><p>Log your own reps and keep recent session history in this browser.</p></div><i aria-hidden="true">↗</i></div>
        </div>
        <div className="brand-studio-note"><span className="brand-studio-note-dot" /> IMAGE-LED DESIGN / INTERACTIVE TOOLS / LOCAL-FIRST HISTORY</div>
      </div>
    </section>
  );
}

export function FitnessGallery() {
  return (
    <section className="brand-gallery-section" id="gallery" aria-labelledby="brand-gallery-title">
      <div className="brand-section-shell">
        <div className="brand-section-heading">
          <div>
            <p className="brand-section-kicker">06 / THE ATMOSPHERE</p>
            <h2 id="brand-gallery-title">MADE FOR THE<br /><em>WORK.</em></h2>
          </div>
          <p>A visual look at the training spaces, equipment and focused routines that inspire the KINETIK experience. These are mood images, not claimed KINETIK facilities.</p>
        </div>
        <div className="brand-gallery-grid">
          {galleryTiles.map((tile, index) => (
            <motion.figure
              key={tile.label}
              className={`brand-gallery-tile ${tile.className}`}
              style={{ backgroundImage: `linear-gradient(180deg, rgba(6,8,9,.05) 0%, rgba(6,8,9,.04) 35%, rgba(6,8,9,.85) 100%), url("${tile.image}")` }}
              initial={{ opacity: 0, scale: 0.985 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
            >
              <figcaption><span>{tile.detail}</span><strong>{tile.label}</strong></figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="brand-gallery-credit">Photography delivered from Unsplash. See <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash's license</a> for usage terms.</p>
      </div>
    </section>
  );
}

export function ClosingCTA() {
  return (
    <section
      className="brand-closing-section"
      id="brand-cta"
      aria-labelledby="brand-closing-title"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(7,9,10,.93), rgba(7,9,10,.55)), url("${photos.floor}")` }}
    >
      <div className="brand-section-shell brand-closing-shell">
        <p className="brand-section-kicker">07 / START WHERE YOU ARE</p>
        <h2 id="brand-closing-title">PLAN IT.<br /><em>TRAIN IT.</em><br />REPEAT.</h2>
        <div className="brand-closing-bottom">
          <p>Set up your first week, open the equipment motion lab, and make the next session easier to return to.</p>
          <div className="brand-closing-actions">
            <a className="home-action-primary" href="#training"><span>BUILD YOUR PLAN</span><span aria-hidden="true">↗</span></a>
            <a className="brand-outline-link" href="#space">DESIGN A TRAINING SPACE <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
