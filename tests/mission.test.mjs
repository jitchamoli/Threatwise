import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scenarios } from '../src/scenarios.ts';
import { gradeMission, readProgress } from '../src/mission.ts';

test('all fourteen cases have unique IDs, fictional senders, and feedback for all actions', () => {
  assert.equal(scenarios.length, 14);
  assert.equal(new Set(scenarios.map(({ id }) => id)).size, scenarios.length);
  for (const { address, feedback } of scenarios) {
    assert.match(address, /\.example$/);
    assert.deepEqual(Object.keys(feedback).sort(), ['proceed', 'report', 'verify']);
    assert.ok(Object.values(feedback).every((message) => message.length > 0));
  }
});

test('each case has the intended response and the final case practices verification', () => {
  assert.deepEqual(scenarios.map(({ id, best }) => [id, best]), [
    ['invoice', 'verify'],
    ['meeting', 'proceed'],
    ['it', 'report'],
    ['document', 'proceed'],
    ['signin', 'report'],
    ['unknown-sender', 'verify'],
    ['typo', 'proceed'],
    ['lookalike', 'report'],
    ['qr-phishing', 'report'],
    ['gift-cards', 'report'],
    ['renewal-callback', 'verify'],
    ['document-permissions', 'report'],
    ['payroll-change', 'verify'],
    ['file', 'verify'],
  ]);
});

test('grading preserves the set of missed cases from the original answers', () => {
  const answers = Object.fromEntries(scenarios.map(({ id, best }) => [id, best]));
  answers.invoice = 'proceed';
  answers['document-permissions'] = 'proceed';
  assert.deepEqual(gradeMission(scenarios, answers), { score: 12, missed: ['invoice', 'document-permissions'] });
  assert.deepEqual(gradeMission(scenarios, {}), {
    score: 0,
    missed: scenarios.map(({ id }) => id),
  });
});

test('stored progress rejects invalid data and accepts zero and perfect scores', () => {
  for (const invalid of [null, 'broken', '{}', '{"best":15}', '{"best":-1}', '{"best":2.5}', '{"best":"3"}']) {
    assert.equal(readProgress(invalid, scenarios.length), null);
  }
  assert.equal(readProgress('{"best":0}', scenarios.length), 0);
  assert.equal(readProgress('{"best":14}', scenarios.length), 14);
  assert.equal(readProgress('{"best":6}', 6), 6);
  assert.equal(readProgress('{"best":7}', 6), null);
  assert.equal(readProgress('{"best":11}', 11), 11);
  assert.equal(readProgress('{"best":12}', 11), null);
});
