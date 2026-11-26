import { useLayoutEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { gradeMission, readProgress, type Answers } from './mission';
import { scenarios, type Action, type Scenario } from './scenarios';

const actions = {
  proceed: { label: 'Proceed', description: 'Act on the message', icon: 'check' },
  verify: { label: 'Verify separately', description: 'Check via a trusted channel', icon: 'search' },
  report: { label: 'Report', description: 'Escalate to security', icon: 'flag' },
} as const;

const artifactKinds = {
  attachment: { icon: 'clip', instruction: 'Inspect attachment' },
  link: { icon: 'link', instruction: 'Inspect link destination' },
  qr: { icon: 'qr', instruction: 'Inspect QR destination' },
  permission: { icon: 'lock', instruction: 'Inspect permission prompt' },
} as const;

// Keep earlier best scores tied to the number of cases players answered.
const earlierMissions = [
  { key: 'threatwise.inbox-investigator.v1', total: 6 },
  { key: 'threatwise.inbox-investigator.v2', total: 11 },
];
const progressKey = 'threatwise.inbox-investigator.v3';

function loadBest(key: string, total: number) {
  try {
    return readProgress(localStorage.getItem(key), total);
  } catch {
    return null;
  }
}

function Message({ scenario, answer, replay, onAnswer, onContinue, continueLabel, headingRef }: {
  scenario: Scenario;
  answer?: Action;
  replay: boolean;
  onAnswer: (action: Action) => void;
  onContinue: () => void;
  continueLabel: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const feedbackRef = useRef<HTMLHeadingElement>(null);
  const requestedFeedbackFocus = useRef(false);
  const { artifact } = scenario;

  useLayoutEffect(() => {
    if (answer && requestedFeedbackFocus.current) {
      feedbackRef.current?.focus();
      requestedFeedbackFocus.current = false;
    }
  }, [answer]);

  return <article className="message" aria-labelledby="message-heading">
    <header className="message-header">
      <div className="message-kicker">{replay ? 'Practice retry' : `Case ${String(scenarios.indexOf(scenario) + 1).padStart(2, '0')}`}</div>
      <h2 id="message-heading" ref={headingRef} tabIndex={-1}>{scenario.subject}</h2>
      <div className="sender-row">
        <div className={`avatar avatar-${scenario.id}`} aria-hidden="true">{scenario.initials}</div>
        <div className="sender">
          <strong>{scenario.sender}</strong>
          <details className="sender-details">
            <summary>Sender details <Icon name="chevron" size={13} /></summary>
            <div className="sender-address">From <span>{scenario.address}</span></div>
          </details>
        </div>
        <time>{scenario.time}</time>
      </div>
    </header>
    <div className="message-body">
      <div className="context"><Icon name="info" size={17} /><div><strong>What you know</strong><p>{scenario.context}</p></div></div>
      {scenario.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <p className="signoff">{scenario.signoff}</p>
      {artifact && <details className="artifact">
        <summary>
          <span className="artifact-icon"><Icon name={artifactKinds[artifact.kind].icon} size={18} /></span>
          <span><strong>{artifact.label}</strong><small>{artifactKinds[artifact.kind].instruction}</small></span>
          <Icon name="chevron" size={16} />
        </summary>
        <p>{artifact.detail}</p>
      </details>}
    </div>
    <div className="decision">
      {answer ? <>
        <div className={`feedback ${answer === scenario.best ? 'correct' : 'review'}`}>
          <h3 ref={feedbackRef} tabIndex={-1}>{answer === scenario.best ? 'Best response' : `Better response · ${actions[scenario.best].label}`}</h3>
          <p>{answer !== scenario.best && <><strong>Your choice</strong> · {actions[answer].label}. </>}{scenario.feedback[answer]}</p>
          <p><strong>Key clue</strong> · {scenario.clue}</p>
        </div>
        <button className="primary" onClick={onContinue}>{continueLabel}<Icon name="arrow" size={17} /></button>
      </> : <>
        <h3>What would you do?</h3>
        <div className="choices">
          {(Object.keys(actions) as Action[]).map((action) => {
            const item = actions[action];
            return <button key={action} className={`choice choice-${action}`} onClick={() => {
              requestedFeedbackFocus.current = true;
              onAnswer(action);
            }}>
              <span className="choice-icon"><Icon name={item.icon} size={18} /></span>
              <span><strong>{item.label}</strong><small>{scenario.id === 'signin' && action === 'proceed' ? 'Approve the sign-in' : item.description}</small></span>
            </button>;
          })}
        </div>
      </>}
    </div>
  </article>;
}

export function InboxInvestigator() {
  const [active, setActive] = useState(scenarios[0]);
  const [answers, setAnswers] = useState<Answers>({});
  const [best, setBest] = useState(() => loadBest(progressKey, scenarios.length));
  const [earlierScores] = useState(() => earlierMissions.flatMap(({ key, total }) => {
    const score = loadBest(key, total);
    return score === null ? [] : [{ score, total }];
  }));
  const [view, setView] = useState<'mission' | 'debrief' | 'retry'>(best === null ? 'mission' : 'debrief');
  const [retryAnswer, setRetryAnswer] = useState<Action>();
  const [result, setResult] = useState<ReturnType<typeof gradeMission>>();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusRequested = useRef(false);
  const count = Object.keys(answers).length;
  const next = scenarios.find(({ id }) => !answers[id]);

  useLayoutEffect(() => {
    if (focusRequested.current) {
      headingRef.current?.focus();
      focusRequested.current = false;
    }
  });

  function open(scenario: Scenario) {
    focusRequested.current = true;
    setActive(scenario);
  }

  function goToDebrief() {
    focusRequested.current = true;
    setView('debrief');
  }

  function submit(action: Action) {
    if (view === 'retry') {
      setRetryAnswer(action);
      return;
    }
    const updated = { ...answers, [active.id]: action };
    setAnswers(updated);
    if (count + 1 === scenarios.length) {
      const round = gradeMission(scenarios, updated);
      const highScore = Math.max(best ?? 0, round.score);
      setResult(round);
      setBest(highScore);
      try {
        localStorage.setItem(progressKey, JSON.stringify({ best: highScore }));
      } catch {
        // The current session still works when browser storage is unavailable.
      }
    }
  }

  function restart() {
    setAnswers({});
    setResult(undefined);
    setView('mission');
    open(scenarios[0]);
  }

  const completed = view === 'debrief' || view === 'retry' ? scenarios.length : count;

  return <main className="shell">
      <section className="hero" aria-labelledby="inbox-title">
        <div className="hero-copy">
          <div className="hero-label"><Icon name="mail" size={16} /> Security awareness</div>
          <h1 id="inbox-title" tabIndex={-1}>Inbox Investigator</h1>
          <p>Read the message, inspect the details, and decide how to respond.</p>
          <div className="hero-meta"><span><Icon name="clock" size={16} /> Untimed</span><span><Icon name="inbox" size={16} /> {scenarios.length} messages</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit orbit-three" />
          <span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" />
          <span className="envelope"><Icon name="mail" size={96} /></span>
          <span className="art-seal"><Icon name="shield" size={34} /></span>
        </div>
      </section>

      <section className="workspace" aria-label="Inbox mission">
        <aside className="inbox">
          <div className="inbox-top">
            <div className="inbox-title"><Icon name="inbox" size={21} /><h2>Inbox</h2><span>{scenarios.length}</span></div>
            <div className="progress-text"><span>Mission progress</span><strong>{completed} of {scenarios.length}</strong></div>
            <progress value={completed} max={scenarios.length} aria-label="Mission progress" />
            {earlierScores.map(({ score, total }) => (
              <p key={total} className="progress-note">{total}-case mission best · {score} / {total}</p>
            ))}
          </div>
          <ol className="case-list">
            {scenarios.map((scenario, index) => {
              const locked = index === scenarios.length - 1 && count < index;
              const selected = view === 'mission' && active.id === scenario.id;
              return <li key={scenario.id}>
                <button className={`case-button ${selected ? 'selected' : ''}`} aria-current={selected ? 'true' : undefined}
                  aria-label={locked ? `${scenario.subject}, unlocks after ${index} cases` : undefined}
                  disabled={locked || view !== 'mission'}
                  onClick={() => { if (selected) headingRef.current?.focus(); else open(scenario); }}>
                  <span className={`avatar avatar-${scenario.id}`} aria-hidden="true">{scenario.initials}</span>
                  <span className="case-copy"><span className="case-sender">{scenario.sender}</span>
                    <strong>{scenario.subject}</strong>
                    <small>{locked ? `Complete the first ${index} cases` : scenario.preview}</small></span>
                  <span className="case-state">{answers[scenario.id] ? <><Icon name="check" size={15} /><span className="sr-only">Completed</span></> : locked ? <Icon name="lock" size={14} /> : <span />}</span>
                </button>
              </li>;
            })}
          </ol>
        </aside>

        {view === 'debrief' ? <article className="message debrief" aria-labelledby="debrief-heading">
          <span className="debrief-mark"><Icon name="shield" size={34} /></span>
          <h2 id="debrief-heading" ref={headingRef} tabIndex={-1}>Mission complete</h2>
          <p className="score">{result?.score ?? best}<small> / {scenarios.length}</small></p>
          <p>{result ? 'Best responses in this round' : 'Best score saved in this browser'}</p>
          {result && <p className="best-score">Personal best · {best} / {scenarios.length}</p>}
          {result && result.missed.length > 0 && <section className="retry-list">
            <h3>Review missed cases</h3>
            {scenarios.filter(({ id }) => result.missed.includes(id)).map((scenario) =>
              <button key={scenario.id} onClick={() => {
                setView('retry');
                setRetryAnswer(undefined);
                open(scenario);
              }}><span>{scenario.subject}</span><Icon name="arrow" size={17} /></button>)}
          </section>}
          {result && result.missed.length === 0 && <p>You chose the best response for every message.</p>}
          <button className="primary" onClick={restart}><Icon name="replay" size={17} /> Play a new round</button>
        </article> : <div className="message-column">
          {view === 'retry' && !retryAnswer && <button className="back" onClick={goToDebrief}>← Back to debrief</button>}
          <Message key={`${view}-${active.id}`} scenario={active} answer={view === 'retry' ? retryAnswer : answers[active.id]}
            replay={view === 'retry'} onAnswer={submit} headingRef={headingRef}
            continueLabel={view === 'retry' ? 'Back to debrief' : next ? 'Next message' : 'View debrief'}
            onContinue={() => { if (view === 'mission' && next) open(next); else goToDebrief(); }} />
        </div>}
      </section>
      <footer><Icon name="shield" size={15} /> All messages and attachments are fictional.</footer>
  </main>;
}
