import { useState, type FormEvent } from 'react';

export function TrialBooking({ selectedGym = '' }: { selectedGym?: string }) {
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [requestText, setRequestText] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const message = [
      'KINETIK — FIRST SESSION INTEREST',
      '',
      'Name: ' + (values.get('name') ?? ''),
      'Email: ' + (values.get('email') ?? ''),
      'Gym of interest: ' + (values.get('gym') ?? 'General enquiry'),
      'Training setup: ' + (values.get('setup') ?? ''),
      'Main goal: ' + (values.get('goal') ?? ''),
      'Preferred time: ' + (values.get('time') ?? ''),
      'Note: ' + ((values.get('note') ?? '').toString().trim() || 'None provided'),
    ].join('\n');
    setRequestText(message);
    setPrepared(true);
    setCopyStatus('');
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopyStatus('REQUEST COPIED. IT HAS NOT BEEN SENT TO A GYM.');
    } catch {
      setCopyStatus('CLIPBOARD ACCESS IS BLOCKED. YOUR REQUEST IS STILL SHOWN BELOW.');
    }
  }

  return (
    <section className="section start-section" id="start" aria-labelledby="start-title">
      <div className="section-shell start-grid">
        <div className="start-copy"><p className="eyebrow"><span>04</span> YOUR NEXT SESSION</p><h2 id="start-title">Ready to<br /><em>start moving?</em></h2><p>Tell us what a good first session looks like. This prototype prepares a request locally so you can review or copy it.</p><div className="start-steps"><p><span>01</span> Choose your direction.</p><p><span>02</span> Set a realistic first step.</p><p><span>03</span> Keep showing up.</p></div></div>
        <form className="trial-form" onSubmit={handleSubmit}>
          <div className="trial-form-head"><span>FIRST SESSION / ENQUIRY</span><span>01 — 04</span></div>
          <label htmlFor="trial-name">YOUR NAME *</label><input id="trial-name" name="name" autoComplete="name" placeholder="Name" required onChange={() => setPrepared(false)} />
          <label htmlFor="trial-email">EMAIL ADDRESS *</label><input id="trial-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" required onChange={() => setPrepared(false)} />
          <input type="hidden" name="gym" value={selectedGym || 'General enquiry'} />
          <div className="selected-gym-interest" role="status"><span>LOCATION / CONCEPT OF INTEREST</span><strong>{selectedGym || 'No concept selected — general enquiry'}</strong><p>Listings are illustrative concepts only; no venue or appointment is confirmed.</p></div>
          <div className="form-split"><div><label htmlFor="trial-setup">WHERE DO YOU TRAIN?</label><select id="trial-setup" name="setup"><option>Not decided yet</option><option>At home</option><option>Commercial gym</option><option>Outdoor / park</option></select></div><div><label htmlFor="trial-goal">PRIMARY GOAL</label><select id="trial-goal" name="goal"><option>Build strength</option><option>Build muscle</option><option>Improve conditioning</option><option>Move more freely</option></select></div></div>
          <label htmlFor="trial-time">WHEN WOULD YOU LIKE TO START?</label><select id="trial-time" name="time"><option>This week</option><option>Next week</option><option>Still exploring</option></select>
          <label htmlFor="trial-note">ANYTHING WE SHOULD KNOW? (OPTIONAL)</label><textarea id="trial-note" name="note" rows={3} placeholder="Training preferences, available equipment, or questions." onChange={() => setPrepared(false)} />
          <button type="submit" className="button button-primary full-width">PREPARE MY REQUEST <span aria-hidden="true">↗</span></button>
          <p className="form-disclaimer">DEMO ONLY · Nothing is transmitted or saved. Sample concepts are not real venue listings. No gym, membership, payment, or trainer is booked.</p>
          {prepared && <div className="trial-success" role="status"><strong>YOUR REQUEST IS READY.</strong><p>The details below exist only in this page's current state.</p><pre>{requestText}</pre><button type="button" className="button button-quiet" onClick={copyRequest}>COPY REQUEST <span aria-hidden="true">↗</span></button>{copyStatus && <p className="inline-status">{copyStatus}</p>}</div>}
        </form>
      </div>
    </section>
  );
}
