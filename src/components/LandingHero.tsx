export function LandingHero() {
  return (
    <>
      <section className="home-hero" id="home" aria-labelledby="home-hero-title">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-hero-shell">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <p className="home-hero-kicker"><span className="home-kicker-dot" /> PERSONAL TRAINING, REIMAGINED</p>
              <h1 id="home-hero-title">TRAIN WITH<br /><em>INTENT.</em></h1>
              <p className="home-hero-lede">
                A focused space for better movement. Explore 3D exercise demos, build a routine that fits your week,
                and track the work you put in — one set at a time.
              </p>
              <div className="home-hero-actions">
                <a className="home-action-primary" href="#arena">
                  <span>ENTER 3D STUDIO</span><span aria-hidden="true">↗</span>
                </a>
                <a className="home-action-secondary" href="#training">
                  <span className="home-play-icon" aria-hidden="true">▶</span><span>BUILD YOUR PLAN</span>
                </a>
              </div>
              <div className="home-hero-proof">
                <span>NO ACCOUNT REQUIRED</span><i aria-hidden="true">·</i><span>SESSION HISTORY STAYS LOCAL</span>
              </div>
            </div>

            <div className="home-hero-visual">
              <div className="home-photo-frame">
                <img
                  className="home-hero-photo"
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85"
                  alt="Dark, equipment-filled strength gym interior"
                  fetchPriority="high"
                />
                <div className="home-photo-shade" aria-hidden="true" />
                <div className="home-photo-topline"><span>KINETIK / PERFORMANCE</span><span>FIG. 001</span></div>
                <div className="home-photo-caption">
                  <span>SHOW UP FOR YOURSELF</span>
                  <strong>THE WORK<br />IS YOURS.</strong>
                  <small>FOCUS / FORM / PROGRESS</small>
                </div>
              </div>

              <div className="home-live-pill"><span className="home-live-dot" /><span>INTERACTIVE TRAINING LAB</span><b>READY</b></div>

              <div className="home-session-card">
                <div className="home-session-topline"><span>SAMPLE SESSION</span><span>03 MOVEMENTS</span></div>
                <h2>Strength foundations</h2>
                <div className="home-session-movement">
                  <span>01</span><div><strong>Bodyweight squat</strong><small>LEGS / GLUTES</small></div><i aria-hidden="true">↗</i>
                </div>
                <div className="home-session-movement">
                  <span>02</span><div><strong>Dumbbell curl</strong><small>BICEPS / FOREARMS</small></div><i aria-hidden="true">↗</i>
                </div>
                <div className="home-session-movement">
                  <span>03</span><div><strong>Overhead press</strong><small>SHOULDERS / TRICEPS</small></div><i aria-hidden="true">↗</i>
                </div>
                <a href="#arena" className="home-session-link">OPEN THE 3D WORKOUT <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>

          <div className="home-stat-rail" aria-label="Training workspace features">
            <div className="home-stat-item"><strong>06</strong><span>ANIMATED MOVEMENT DEMOS</span></div>
            <div className="home-stat-item"><strong>01</strong><span>WEEKLY PLAN BUILDER</span></div>
            <div className="home-stat-item"><strong>LOCAL</strong><span>PRIVATE SESSION HISTORY</span></div>
            <div className="home-stat-note"><span className="home-live-dot" /> YOUR NEXT REP STARTS HERE</div>
          </div>
          <p className="home-photo-credit">
            Background photography from <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash</a>
          </p>
        </div>
      </section>

      <section className="home-capabilities" aria-labelledby="home-capabilities-title">
        <div className="home-capabilities-shell">
          <div className="home-capabilities-heading">
            <div>
              <p className="home-section-kicker">A BETTER TRAINING LOOP <span> / 01—03</span></p>
              <h2 id="home-capabilities-title">Built around<br /><em>the work.</em></h2>
            </div>
            <p>Everything has a purpose: understand the movement, make a plan you can follow, then come back and see what you completed.</p>
          </div>

          <div className="home-capability-grid">
            <a className="home-capability-card" href="#arena">
              <div className="home-capability-top"><span>01 / TRAIN</span><span className="home-capability-arrow" aria-hidden="true">↗</span></div>
              <div className="home-capability-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none"><path d="M6 18v12M12 13v22M18 20v8M30 20v8M36 13v22M42 18v12M12 24h24M18 24h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <h3>See movement in 3D.</h3>
              <p>Explore six animated exercise patterns, change the camera view, and keep form cues close at hand.</p>
              <span className="home-capability-link">OPEN THE STUDIO <b>↗</b></span>
            </a>

            <a className="home-capability-card" href="#training">
              <div className="home-capability-top"><span>02 / PLAN</span><span className="home-capability-arrow" aria-hidden="true">↗</span></div>
              <div className="home-capability-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="11" width="32" height="29" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M16 7v8M32 7v8M8 20h32M16 27h5M27 27h5M16 33h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <h3>Make a plan that fits.</h3>
              <p>Shape a repeatable week around your goals, available equipment, time, and training preferences.</p>
              <span className="home-capability-link">BUILD YOUR WEEK <b>↗</b></span>
            </a>

            <a className="home-capability-card" href="#library">
              <div className="home-capability-top"><span>03 / LEARN</span><span className="home-capability-arrow" aria-hidden="true">↗</span></div>
              <div className="home-capability-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none"><path d="M8 39V8M8 39h33M14 31l8-9 7 5 10-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="39" cy="14" r="3" stroke="currentColor" strokeWidth="2" /></svg>
              </div>
              <h3>Track what you do.</h3>
              <p>Log real reps manually, use the separate demo mode, and review completed sessions on this device.</p>
              <span className="home-capability-link">EXPLORE MOVEMENTS <b>↗</b></span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
