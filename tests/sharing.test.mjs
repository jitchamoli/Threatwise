import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sharingRounds, getSharingOutcome } from '../src/sharing/rounds.ts';

test('the five rounds teach decisions for different sharing audiences', () => {
  assert.deepEqual(sharingRounds.map(({ id, best }) => [id, best]), [
    ['puppy', { action: 'hide', detailId: 'address' }],
    ['boarding-pass', { action: 'private' }],
    ['chat', { action: 'hide', detailId: 'phone' }],
    ['location', { action: 'share' }],
    ['park', { action: 'share' }],
  ]);

  for (const round of sharingRounds) {
    assert.ok(round.audience && round.lesson);
    if (round.best.action === 'hide') {
      assert.ok(round.details.some(({ id }) => id === round.best.detailId));
    }
  }
});

test('hiding the right detail removes its value from the audience preview', () => {
  const puppy = sharingRounds[0];
  const correct = getSharingOutcome(puppy, { action: 'hide', detailId: 'address' });
  assert.equal(correct.isBest, true);
  assert.equal(correct.shared, true);
  assert.ok(correct.visibleDetails.every(({ id }) => id !== 'address'));
  const other = getSharingOutcome(puppy, { action: 'hide', detailId: 'caption' });
  assert.equal(other.isBest, false);
  assert.ok(other.visibleDetails.some(({ id }) => id === 'address'));
});

test('private choices hide the entire post, and sharing preserves the selected audience', () => {
  const [, boardingPass, , location] = sharingRounds;
  const privateOutcome = getSharingOutcome(boardingPass, { action: 'private' });
  assert.deepEqual(privateOutcome, { isBest: true, shared: false, visibleDetails: [] });
  const sharedOutcome = getSharingOutcome(location, { action: 'share' });
  assert.equal(sharedOutcome.isBest, true);
  assert.equal(sharedOutcome.shared, true);
  assert.deepEqual(sharedOutcome.visibleDetails, location.details);
});
