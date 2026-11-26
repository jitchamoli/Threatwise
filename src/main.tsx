import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Icon } from './Icon';
import { InboxInvestigator } from './InboxInvestigator';
import { scenarios } from './scenarios';
import { SafeToShare } from './sharing/SafeToShare';
import { puppyPhoto } from './sharing/SharingPreview';
import { sharingRounds } from './sharing/rounds';
import './style.css';
import './sharing/sharing.css';

const pageTitles = {
  home: 'Threatwise',
  inbox: 'Inbox Investigator | Threatwise',
  sharing: 'Safe to Share? | Threatwise',
};

function currentPage(): keyof typeof pageTitles {
  if (location.hash === '#/inbox') return 'inbox';
  if (location.hash === '#/safe-to-share') return 'sharing';
  return 'home';
}

function Home() {
  return <main className="shell game-home">
    <header className="game-home-intro">
      <h1 tabIndex={-1}>Choose a game</h1>
      <p>Practice what to do with unexpected messages and everyday posts.</p>
    </header>
    <div className="game-grid">
      <a className="game-card" href="#/inbox" aria-labelledby="home-inbox-title">
        <div className="game-card-art inbox-card-art" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" />
          <span className="envelope"><Icon name="mail" size={74} /></span>
          <span className="art-seal"><Icon name="shield" size={29} /></span>
        </div>
        <div className="game-card-copy">
          <p>{scenarios.length} messages · Untimed</p>
          <h2 id="home-inbox-title">Inbox Investigator</h2>
          <p>Read workplace emails and decide which ones to trust, check, or report.</p>
          <span>Play game <Icon name="arrow" size={18} /></span>
        </div>
      </a>
      <a className="game-card" href="#/safe-to-share" aria-labelledby="home-sharing-title">
        <div className="game-card-art"><img src={puppyPhoto} alt="" width="900" height="600" /></div>
        <div className="game-card-copy">
          <p>{sharingRounds.length} rounds · Untimed</p>
          <h2 id="home-sharing-title">Safe to Share?</h2>
          <p>Decide what’s safe to share in everyday photos, messages, and posts.</p>
          <span>Play game <Icon name="arrow" size={18} /></span>
        </div>
      </a>
    </div>
  </main>;
}

function App() {
  const [page, setPage] = useState(currentPage);
  const previousPage = useRef(page);
  const pages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleNavigation() { setPage(currentPage()); }
    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
  }, []);

  useLayoutEffect(() => {
    document.title = pageTitles[page];
    if (previousPage.current !== page) {
      window.scrollTo(0, 0);
      pages.current?.querySelector<HTMLHeadingElement>(`[data-page="${page}"] h1`)?.focus({ preventScroll: true });
      previousPage.current = page;
    }
  }, [page]);

  return <>
    <header className="site-header">
      <nav className="shell header-inner" aria-label="Main navigation">
        <a className="brand" href="#/">
          <span className="brand-mark"><Icon name="shield" size={21} /></span>Threatwise
          <span className="header-divider" /><span className="brand-section">Learning lab</span>
        </a>
        {page !== 'home' && <a className="back-home" href="#/">All games</a>}
      </nav>
    </header>
    {/* Keep each game mounted so switching games preserves the current round. */}
    <div ref={pages}>
      <div data-page="home" hidden={page !== 'home'}><Home /></div>
      <div data-page="inbox" hidden={page !== 'inbox'}><InboxInvestigator /></div>
      <div data-page="sharing" hidden={page !== 'sharing'}><SafeToShare /></div>
    </div>
  </>;
}

createRoot(document.getElementById('root')!).render(<App />);
