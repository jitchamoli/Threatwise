export type SharingDecision =
  | { action: 'share' | 'private' }
  | { action: 'hide'; detailId: string };

export interface SharingDetail {
  id: string;
  label: string;
  value: string;
}

export interface SharingRound {
  id: string;
  title: string;
  audience: string;
  situation: string;
  preview: 'puppy' | 'boarding-pass' | 'chat' | 'location' | 'park';
  details: readonly SharingDetail[];
  best: SharingDecision;
  lesson: string;
}

export const sharingRounds: readonly SharingRound[] = [
  {
    id: 'puppy',
    title: 'A photo of your puppy',
    audience: 'Anyone online',
    situation: 'You want to celebrate bringing your puppy home with a public post.',
    preview: 'puppy',
    details: [
      { id: 'address', label: 'Parcel label', value: '24 Juniper Lane' },
      { id: 'caption', label: 'Photo caption', value: 'Meet Maple!' },
    ],
    best: { action: 'hide', detailId: 'address' },
    lesson: 'Hide the parcel label so people can see Maple without seeing your home address.',
  },
  {
    id: 'boarding-pass',
    title: 'A pre-flight selfie',
    audience: 'Anyone online',
    situation: 'You’re excited for your trip and the boarding pass is in the photo.',
    preview: 'boarding-pass',
    details: [
      { id: 'passenger', label: 'Passenger name', value: 'Alex Morgan' },
      { id: 'trip', label: 'Flight details', value: 'Birch City → Alder Bay' },
      { id: 'booking', label: 'Booking reference', value: 'DEMO28' },
    ],
    best: { action: 'private' },
    lesson: 'Keep this selfie private and share a photo without the boarding pass, which shows your name, trip, and booking reference.',
  },
  {
    id: 'chat',
    title: 'A group chat screenshot',
    audience: 'A public community group',
    situation: 'Jamie said you can share their picnic update with the group. Check the rest of the screenshot before posting.',
    preview: 'chat',
    details: [
      { id: 'message', label: 'Picnic update', value: 'I’ll bring the picnic blanket!' },
      { id: 'phone', label: 'Phone number', value: '202-555-0148' },
    ],
    best: { action: 'hide', detailId: 'phone' },
    lesson: 'Share the picnic update after hiding Jamie’s phone number, which they only shared in your chat.',
  },
  {
    id: 'location',
    title: 'A friend is picking you up',
    audience: 'Only your friend Jamie',
    situation: 'Jamie is picking you up at the park. You can send your live location in a private chat for 15 minutes.',
    preview: 'location',
    details: [
      { id: 'location', label: 'Live location', value: 'Birch Park · North gate' },
    ],
    best: { action: 'share' },
    lesson: 'Jamie can find you with a short, private location share or a text naming your meeting spot.',
  },
  {
    id: 'park',
    title: 'A sunny walk in the park',
    audience: 'Your friends',
    situation: 'You want to share a park photo with friends. The picture shows a path and trees.',
    preview: 'park',
    details: [
      { id: 'caption', label: 'Photo caption', value: 'A little sunshine on my walk.' },
    ],
    best: { action: 'share' },
    lesson: 'It’s fine to share a park photo with friends when it reveals no private details.',
  },
];

export function getSharingOutcome(round: SharingRound, decision: SharingDecision) {
  const shared = decision.action !== 'private';
  const hiddenDetailId = decision.action === 'hide' ? decision.detailId : undefined;
  const isBest = decision.action === round.best.action
    && (round.best.action !== 'hide' || hiddenDetailId === round.best.detailId);

  return {
    isBest,
    shared,
    visibleDetails: shared ? round.details.filter(({ id }) => id !== hiddenDetailId) : [],
  };
}
