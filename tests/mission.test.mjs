import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scenarios } from '../src/scenarios.ts';
import { gradeMission, readProgress } from '../src/mission.ts';

test('the six cases have unique IDs and feedback for all actions', () => {
  assert.equal(scenarios.length, 6);
  assert.equal(new Set(scenarios.map(({ id }) => id)).size, 6);
  assert.deepEqual(
    scenarios.map(({ best }) => best),
    ['verify', 'proceed', 'report', 'proceed', 'report', 'verify'],
  );
  for (const { feedback } of scenarios) {
    assert.deepEqual(Object.keys(feedback).sort(), ['proceed', 'report', 'verify']);
    assert.ok(Object.values(feedback).every((message) => message.length > 0));
  }
});

test('grading preserves the set of missed cases from the original answers', () => {
  const answers = Object.fromEntries(scenarios.map(({ id, best }) => [id, best]));
  const invoice = scenarios[0];
  answers[invoice.id] = 'proceed';
  assert.deepEqual(gradeMission(scenarios, answers), { score: 5, missed: [invoice.id] });
  assert.deepEqual(gradeMission(scenarios, {}), {
    score: 0,
    missed: scenarios.map(({ id }) => id),
  });
});

test('stored progress rejects invalid data and accepts zero and perfect scores', () => {
  for (const invalid of [null, 'broken', '{}', '{"best":7}', '{"best":-1}', '{"best":2.5}', '{"best":"3"}']) {
    assert.equal(readProgress(invalid, scenarios.length), null);
  }
  assert.equal(readProgress('{"best":0}', scenarios.length), 0);
  assert.equal(readProgress('{"best":6}', scenarios.length), 6);
});
