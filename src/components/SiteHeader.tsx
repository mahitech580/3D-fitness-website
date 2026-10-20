import { useEffect, useState } from 'react';

const links = [
  { href: '#listen', label: 'LISTEN' },
  { href: '#culture', label: 'CULTURE & MAKERS' },
  { href: '#learn', label: 'LEARN' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeMenu();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={closeMenu} aria-label="Kairo Studio home">
        <span>KAIRO STUDIO</span>
        <span className="wordmark-divider" aria-hidden="true">/</span>
        <span className="wordmark-est">EST. 2026</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
        <span className="menu-toggle-icon" aria-hidden="true">{menuOpen ? '×' : '+'}</span>
      </button>
      <nav id="primary-navigation" className={'primary-navigation' + (menuOpen ? ' is-open' : '')} aria-label="Primary navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
        ))}
        <a className="nav-reserve" href="#reserve" onClick={closeMenu}>RESERVE <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}
