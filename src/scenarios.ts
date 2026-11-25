export type Action = 'proceed' | 'verify' | 'report';

export interface Scenario {
  id: string;
  sender: string;
  initials: string;
  address: string;
  time: string;
  subject: string;
  preview: string;
  context: string;
  body: string[];
  signoff: string;
  artifact?: { kind: 'attachment' | 'link'; label: string; detail: string };
  best: Action;
  clue: string;
  feedback: Record<Action, string>;
}

export const scenarios: readonly Scenario[] = [
  {
    id: 'invoice', sender: 'Maya Chen', initials: 'MC', address: 'maya@northstar.example',
    time: '9:04 AM', subject: 'Updated invoice for November', preview: 'Please use the updated payment details…',
    context: 'Northstar is a regular supplier. Their November invoice was expected.',
    body: [
      'Hi Alex,',
      'Here’s the November invoice for the office supplies delivery. Please use the updated bank details listed in the attachment for this payment.',
      'Could you let me know once it’s scheduled?',
    ],
    signoff: 'Thanks,\nMaya',
    artifact: { kind: 'attachment', label: 'Northstar_Invoice_Nov.pdf', detail: 'Simulated PDF preview: the supplier name and invoice month match. The payment account differs from the one on file.' },
    best: 'verify', clue: 'The supplier is familiar, and the payment account has changed.',
    feedback: {
      proceed: 'Pause before scheduling payment. A familiar sender and an expected invoice do not confirm a change to bank details.',
      verify: 'Contact Northstar using the phone number already on file. Confirm the new account before updating payment details.',
      report: 'The change is unverified. Call the vendor using the number on file, and escalate if the vendor denies the change.',
    },
  },
  {
    id: 'meeting', sender: 'Jordan Lee', initials: 'JL', address: 'jordan@alder.example',
    time: '9:18 AM', subject: 'Thursday project sync', preview: 'I’ve booked Cedar for the planning sync…',
    context: 'Jordan is on your team. You agreed in person to meet Thursday morning.',
    body: ['Hi Alex,', 'I’ve booked Cedar for our Thursday planning sync at 10. Let’s cover the timeline and the next set of tasks.', 'See you there.'],
    signoff: 'Jordan',
    best: 'proceed', clue: 'The sender, timing, and purpose match the meeting you already discussed.',
    feedback: {
      proceed: 'You can accept the invite. It matches the plan you discussed and asks for no sensitive information.',
      verify: 'A second check adds little here. The sender and meeting details match the plan you agreed to.',
      report: 'The expected sender and routine meeting details support accepting this invite.',
    },
  },
  {
    id: 'it', sender: 'IT Help Desk', initials: 'IT', address: 'support@external.example',
    time: '9:32 AM', subject: 'Action required on your account', preview: 'Your mailbox access is due to expire…',
    context: 'Your IT team uses alder.example and never asks for your password.',
    body: ['Hello Alex,', 'This notice claims your mailbox access is due to expire and asks you to enter your work password using the button below.'],
    signoff: 'IT Help Desk',
    artifact: { kind: 'link', label: 'Confirm account', detail: 'Displayed destination: https://external.example/account' },
    best: 'report', clue: 'The message requests a password and comes from outside your company.',
    feedback: {
      proceed: 'Entering a password could expose your account. Use your organization’s phishing-reporting process.',
      verify: 'The password request already conflicts with IT policy. Report the message using your usual channel.',
      report: 'Report it through your organization’s phishing-reporting process. Leave the link unopened.',
    },
  },
  {
    id: 'document', sender: 'Sam Rivera', initials: 'SR', address: 'sam@alder.example',
    time: '10:06 AM', subject: 'Q4 planning notes are ready', preview: 'The draft we discussed is in our workspace…',
    context: 'Sam agreed to share this draft today in your approved team workspace, workspace.alder.example.',
    body: ['Hi Alex,', 'The Q4 planning draft we discussed is ready for your comments. I put it in the usual team workspace under Planning.'],
    signoff: 'Sam',
    artifact: { kind: 'link', label: 'Open planning notes', detail: 'Displayed destination: https://workspace.alder.example/planning' },
    best: 'proceed', clue: 'The document was expected, and the destination matches the approved workspace.',
    feedback: {
      proceed: 'You can review the draft in the workspace. The sender, document, and destination match what you expected.',
      verify: 'The details already match the plan you agreed to. You can open the draft from your usual workspace.',
      report: 'The expected document is in the approved workspace. Inspecting a destination helps distinguish a normal workflow from a suspicious request.',
    },
  },
  {
    id: 'signin', sender: 'Account Security', initials: 'AS', address: 'security@alder.example',
    time: '10:24 AM', subject: 'A sign-in approval is pending', preview: 'An approval request was sent to your phone…',
    context: 'You did not try to sign in. The real approval request is showing in your authenticator app.',
    body: ['Hi Alex,', 'Your authenticator received a sign-in approval request at 10:24 AM. The authenticator is asking whether you want to approve or deny the sign-in.'],
    signoff: 'Account Security',
    best: 'report', clue: 'You did not initiate the sign-in, even though the notification is genuine.',
    feedback: {
      proceed: 'Approving an unexpected request could let someone else sign in. Deny it in the authenticator and notify your security team.',
      verify: 'You already know you did not initiate it. Deny the request in the authenticator and notify your security team.',
      report: 'Deny the unexpected request in the authenticator and notify your security team through your normal channel.',
    },
  },
  {
    id: 'file', sender: 'Priya Shah', initials: 'PS', address: 'priya@alder.example',
    time: '10:47 AM', subject: 'Can you share the roster?', preview: 'Please send the staff roster to my other inbox…',
    context: 'Priya manages staffing and normally requests the roster through the company workspace.',
    body: ['Hi Alex,', 'Could you send the staff roster with everyone’s contact details to my personal inbox today? I can’t get to the workspace right now.'],
    signoff: 'Priya',
    best: 'verify', clue: 'The request involves staff data and bypasses the usual sharing channel.',
    feedback: {
      proceed: 'Pause before sharing staff data. Confirm the request with Priya through a known company channel and use approved sharing.',
      verify: 'Contact Priya through the company directory or team chat. If the request is legitimate, share the file only through the approved workspace.',
      report: 'Pause the transfer and check with Priya through a known company channel. Escalate if she denies the request or your policy calls for it.',
    },
  },
];
