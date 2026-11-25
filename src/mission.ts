import type { Action, Scenario } from './scenarios';

export type Answers = Partial<Record<string, Action>>;

export function gradeMission(scenarios: readonly Scenario[], answers: Answers) {
  const missed = scenarios.filter(({ id, best }) => answers[id] !== best).map(({ id }) => id);
  return { score: scenarios.length - missed.length, missed };
}

export function readProgress(raw: string | null, total: number): number | null {
  try {
    const best = raw === null ? undefined : JSON.parse(raw)?.best;
    return Number.isInteger(best) && best >= 0 && best <= total ? best : null;
  } catch {
    return null;
  }
}
