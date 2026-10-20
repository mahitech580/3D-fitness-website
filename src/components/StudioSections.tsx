import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

function SectionEyebrow({ number, label }: { number: string; label: string }) {
  return <p className="section-eyebrow"><span>{number}</span><span>{label}</span></p>;
}

export function StudioSections() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="editorial-content">
      <section className="editorial-section listen-section" id="listen" aria-labelledby="listen-title">
        <div className="section-inner listen-inner">
          <SectionEyebrow number="01" label="THE LISTENING ROOM" />
          <div className="listen-layout">
            <motion.h2 id="listen-title" className="section-heading" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8 }}>A little more<br /><em>room for wonder.</em></motion.h2>
            <div className="section-copy">
              <p className="copy-lead">Some things ask to be noticed slowly.</p>
              <p>A listening room for small discoveries: the hush before a cup is poured, rain crossing a tiled roof, the voices and gestures that turn an ordinary moment into a ritual.</p>
              <a className="text-link" href="#culture">WANDER INTO CULTURE <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="soundline" aria-hidden="true"><svg viewBox="0 0 1100 110" preserveAspectRatio="none"><path d="M0 56 C35 56 35 40 61 56 S89 85 112 56 S142 25 165 56 S194 73 218 56 S250 37 273 56 S301 92 327 56 S354 15 381 56 S409 80 432 56 S462 34 487 56 S516 69 541 56 S569 9 595 56 S624 93 648 56 S677 35 702 56 S732 81 756 56 S784 20 810 56 S840 74 865 56 S895 32 921 56 S949 88 973 56 S1002 35 1028 56 S1070 56 1100 56" /></svg></div>
          <p className="soundline-caption">LISTEN CLOSELY. THE WORLD IS ALWAYS SPEAKING.</p>
        </div>
      </section>

      <section className="editorial-section culture-section" id="culture" aria-labelledby="culture-title">
        <div className="section-inner">
          <SectionEyebrow number="02" label="CULTURE & MAKERS" />
          <div className="culture-headline-row">
            <h2 id="culture-title" className="section-heading">Made by hand.<br /><em>Held by memory.</em></h2>
            <p className="culture-intro">An ever-growing notebook of objects, gestures, makers, and places that remind us what care can look like.</p>
          </div>
          <div className="journal-list">
            <a className="journal-entry" href="#learn"><span className="journal-number">01</span><span className="journal-title">The quiet language of objects</span><span className="journal-detail">MATERIAL / MEMORY</span><span className="journal-arrow" aria-hidden="true">↗</span></a>
            <a className="journal-entry" href="#learn"><span className="journal-number">02</span><span className="journal-title">A table set for slowing down</span><span className="journal-detail">RITUAL / EVERYDAY</span><span className="journal-arrow" aria-hidden="true">↗</span></a>
            <a className="journal-entry" href="#learn"><span className="journal-number">03</span><span className="journal-title">Blue, borrowed from the rain</span><span className="journal-detail">COLOUR / PLACE</span><span className="journal-arrow" aria-hidden="true">↗</span></a>
          </div>
          <p className="journal-note">THREE OPEN PAGES — THE NOTEBOOK IS STILL BEING WRITTEN.</p>
        </div>
      </section>

      <section className="editorial-section learn-section" id="learn" aria-labelledby="learn-title">
        <div className="section-inner learn-inner">
          <SectionEyebrow number="03" label="A SLOWER KIND OF LEARNING" />
          <div className="learn-layout">
            <h2 id="learn-title" className="section-heading">Attention is<br /><em>a way of knowing.</em></h2>
            <div className="learn-copy">
              <p>We return to three simple questions: what is it made of, what does it ask of us, and what changes when we give it time?</p>
              <div className="learning-words"><span>Material</span><span>Ritual</span><span>Attention</span></div>
              <a className="text-link" href="#reserve">START A CONVERSATION <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="learn-seal" aria-hidden="true"><span>STUDY</span><span>WITH</span><span>CARE</span><i>✳</i></div>
        </div>
      </section>

      <section className="editorial-section reserve-section" id="reserve" aria-labelledby="reserve-title">
        <div className="section-inner reserve-inner">
          <SectionEyebrow number="04" label="RESERVE A MOMENT" />
          <div className="reserve-layout">
            <div className="reserve-copy">
              <h2 id="reserve-title" className="section-heading">Something worth<br /><em>making room for?</em></h2>
              <p>Leave a note about the idea you have in mind. This form is a local prototype; it will not send or store your message until a delivery service is connected.</p>
            </div>
            <form className="enquiry-form" onSubmit={handleSubmit}>
              <label htmlFor="enquiry-name">YOUR NAME</label>
              <input id="enquiry-name" name="name" autoComplete="name" placeholder="The name you go by" required onChange={() => setSubmitted(false)} />
              <label htmlFor="enquiry-email">EMAIL ADDRESS</label>
              <input id="enquiry-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required onChange={() => setSubmitted(false)} />
              <label htmlFor="enquiry-intention">WHAT ARE YOU THINKING ABOUT?</label>
              <select id="enquiry-intention" name="intention" defaultValue="a-collaboration" onChange={() => setSubmitted(false)}>
                <option value="a-collaboration">A collaboration</option>
                <option value="an-editorial">An editorial idea</option>
                <option value="a-gathering">A gathering or conversation</option>
                <option value="something-else">Something else entirely</option>
              </select>
              <label htmlFor="enquiry-note">A FEW WORDS (OPTIONAL)</label>
              <textarea id="enquiry-note" name="note" rows={3} placeholder="A small beginning is enough." onChange={() => setSubmitted(false)} />
              <button className="form-submit" type="submit">PREPARE NOTE <span aria-hidden="true">↗</span></button>
              {submitted && <p className="form-status" role="status">Your note is ready in this prototype, but has not been sent. Connect a delivery endpoint to receive enquiries.</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
