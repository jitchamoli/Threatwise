import { useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { SharingPreview } from './SharingPreview';
import { getSharingOutcome, sharingRounds, type SharingDecision, type SharingRound } from './rounds';

type RoundStep =
  | { name: 'choose' }
  | { name: 'hide'; detailId?: string }
  | { name: 'result'; decision: SharingDecision };

function SharingRoundView({ round, roundNumber, replaying, onContinue }: {
  round: SharingRound;
  roundNumber: number;
  replaying: boolean;
  onContinue: () => void;
}) {
  const [step, setStep] = useState<RoundStep>({ name: 'choose' });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const outcome = step.name === 'result' ? getSharingOutcome(round, step.decision) : null;
  const editing = step.name === 'hide';
  const selectedDetailId = editing ? step.detailId : undefined;
  const visibleDetails = outcome?.visibleDetails ?? round.details.filter(({ id }) => id !== selectedDetailId);
  const nextLabel = replaying ? 'Back to results' : roundNumber === sharingRounds.length ? 'Finish game' : 'Next round';

  useLayoutEffect(() => {
    headingRef.current?.focus();
  }, [step.name]);

  function decide(decision: SharingDecision) {
    setStep({ name: 'result', decision });
  }

  return <article className="sharing-round" aria-labelledby="sharing-round-title">
    <div className="sharing-round-top">
      <p>{replaying ? `Retrying round ${roundNumber}` : `Round ${roundNumber} of ${sharingRounds.length}`}</p>
      <progress value={roundNumber} max={sharingRounds.length} aria-label="Current round" />
    </div>
    <div className="sharing-round-grid">
      <div className="sharing-round-copy">
        <h2 id="sharing-round-title" ref={step.name === 'choose' ? headingRef : undefined} tabIndex={-1}>{round.title}</h2>
        <p className="sharing-situation">{round.situation}</p>
        <div className="sharing-audience">
          <Icon name="people" size={21} />
          <div><span>Who can see it?</span><strong>{round.audience}</strong></div>
        </div>
      </div>
      <div className="sharing-preview-column">
        {editing ? (
          <div className="sharing-edit">
            <h3 ref={headingRef} tabIndex={-1}>Choose a detail to hide</h3>
            <p>Select a highlighted detail in the preview.</p>
          </div>
        ) : (
          <h3 ref={outcome ? headingRef : undefined} tabIndex={outcome ? -1 : undefined}>
            {outcome ? 'What they would see' : 'Your preview'}
          </h3>
        )}
        {outcome && !outcome.shared ? (
          <div className="sharing-private"><Icon name="lock" size={30} /><p>Nothing would be shared.</p></div>
        ) : (
          <SharingPreview round={round} visibleDetails={visibleDetails}
            onToggleDetail={editing ? (id) => setStep({ name: 'hide', detailId: id === selectedDetailId ? undefined : id }) : undefined} />
        )}
      </div>
      <div className="sharing-action-panel">
        {step.name === 'choose' && <div className="sharing-actions">
          <button className="sharing-choice" onClick={() => decide({ action: 'share' })}><Icon name="eye" size={20} />Share as is</button>
          <button className="sharing-choice" onClick={() => setStep({ name: 'hide' })}><Icon name="clip" size={19} />Hide a detail</button>
          <button className="sharing-choice" onClick={() => decide({ action: 'private' })}><Icon name="lock" size={19} />Keep private</button>
        </div>}
        {editing && <div className="sharing-controls">
          <button className="primary" disabled={selectedDetailId === undefined} onClick={() => {
            if (selectedDetailId !== undefined) decide({ action: 'hide', detailId: selectedDetailId });
          }}>Share with detail hidden<Icon name="arrow" size={17} /></button>
          <button className="sharing-secondary" onClick={() => setStep({ name: 'choose' })}>Cancel</button>
        </div>}
        {outcome && <div className={`feedback sharing-feedback ${outcome.isBest || !outcome.shared ? 'correct' : 'review'}`}>
          <h3>
            {outcome.isBest ? 'Good choice' : outcome.shared ? 'A better choice' : 'Keeping it private is okay'}
          </h3>
          <p>{round.lesson}</p>
        </div>}
        {outcome && <div className="sharing-controls">
          <button className="primary" onClick={onContinue}>{nextLabel}<Icon name="arrow" size={17} /></button>
          <button className="sharing-secondary" onClick={() => setStep({ name: 'choose' })}>Retry round</button>
        </div>}
      </div>
    </div>
  </article>;
}

export function SafeToShare() {
  const [roundIndex, setRoundIndex] = useState<number | null>(0);
  const [replaying, setReplaying] = useState(false);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (roundIndex === null) resultsHeading.current?.focus();
  }, [roundIndex]);

  function continueGame() {
    setRoundIndex((current) => (replaying || current === null || current + 1 === sharingRounds.length) ? null : current + 1);
    setReplaying(false);
  }

  return <main className="shell sharing-game">
    <section className="sharing-hero" aria-labelledby="sharing-title">
      <div>
        <h1 id="sharing-title" tabIndex={-1}>Safe to Share?</h1>
        <p>Check who can see your post, then spot anything you’d rather keep private.</p>
      </div>
      <span><Icon name="clock" size={17} /> Untimed</span>
    </section>
    {roundIndex === null ? (
      <section className="sharing-round sharing-results" aria-labelledby="sharing-results-title">
        <h2 id="sharing-results-title" ref={resultsHeading} tabIndex={-1}>You finished all five rounds</h2>
        <p>Choose a round to try again.</p>
        <ol className="sharing-replay-list">
          {sharingRounds.map(({ id, title }, index) => (
            <li key={id}>
              <button className="sharing-choice" onClick={() => { setReplaying(true); setRoundIndex(index); }}>
                {title}<Icon name="replay" size={17} />
              </button>
            </li>
          ))}
        </ol>
        <button className="primary" onClick={() => setRoundIndex(0)}>Play all rounds again<Icon name="arrow" size={17} /></button>
      </section>
    ) : (
      <SharingRoundView key={roundIndex} round={sharingRounds[roundIndex]} roundNumber={roundIndex + 1}
        replaying={replaying} onContinue={continueGame} />
    )}
    <footer><Icon name="shield" size={15} /> All examples are fictional.</footer>
  </main>;
}
