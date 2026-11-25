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
  artifact?: { kind: 'attachment' | 'link' | 'qr' | 'permission'; label: string; detail: string };
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
    id: 'unknown-sender', sender: 'Training Desk', initials: 'TD', address: 'case-4827@intake-7.example',
    time: '10:31 AM', subject: 'Confirm your workshop registration', preview: 'A registration confirmation from an unfamiliar sender…',
    context: 'You signed up for a workshop through the company training portal. You don’t recognize the sender or know whether they handle registrations.',
    body: ['This message says your workshop registration is pending. It asks you to confirm attendance by replying.'],
    signoff: 'Training Desk',
    best: 'verify', clue: 'The workshop is real, but the sender’s address is unfamiliar.',
    feedback: {
      proceed: 'Check the registration in the company training portal before replying. The message could be related to the workshop, but you haven’t established who sent it.',
      verify: 'Open the training portal as usual or contact the organizer using the company directory. Confirm the registration there.',
      report: 'Start by checking the portal or asking the organizer. If they say the message isn’t theirs, report it through your usual channel.',
    },
  },
  {
    id: 'typo', sender: 'Elena Park', initials: 'EP', address: 'elena@alder.example',
    time: '10:36 AM', subject: 'Room change for today’s workshop', preview: 'A quick correction to the room booking…',
    context: 'Elena is running the workshop. You saw the room change in the shared calendar and expected her to confirm it.',
    body: ['Hi Alex,', 'Just writing to confrim we’re meeting in Birch at 2 PM. See you there!'],
    signoff: 'Elena',
    best: 'proceed', clue: 'The room and time match your calendar, the sender is expected, and the message requests no sensitive action.',
    feedback: {
      proceed: 'You can go to Birch as planned. A typo in the body is one clue to consider alongside the sender, context, and request.',
      verify: 'The shared calendar already confirms the change. The typo alone gives you little reason to make another check.',
      report: 'A spelling mistake can appear in a legitimate email. Here, the expected sender and matching calendar entry support proceeding.',
    },
  },
  {
    id: 'lookalike', sender: 'Stonebridge Parcel', initials: 'SP', address: 'updates@stonebrldge.example',
    time: '10:42 AM', subject: 'Delivery status update', preview: 'A delivery notice asks for an address update…',
    context: 'Your office uses Stonebridge Parcel. Your trusted vendor directory lists its domain as stonebridge.example.',
    body: ['The message says a package is on hold and asks you to open a link to update the delivery address.'],
    signoff: 'Stonebridge Parcel',
    artifact: { kind: 'link', label: 'Update delivery details', detail: 'Displayed destination: https://stonebrldge.example/delivery' },
    best: 'report', clue: 'The sender and link use stonebrldge.example, with a lowercase L where stonebridge.example has an I.',
    feedback: {
      proceed: 'Leave the link unopened. The address differs from the courier’s known domain even though the display name looks right.',
      verify: 'Check the delivery from your saved courier portal if needed. Report this message because both the sender and link use a lookalike domain.',
      report: 'Report the message and use the courier portal you already trust to check for a real delivery.',
    },
  },
  {
    id: 'qr-phishing', sender: 'Workplace Access', initials: 'WA', address: 'notices@access-review.example',
    time: '10:48 AM', subject: 'Badge access review', preview: 'A QR code is included in the message…',
    context: 'Your company manages badge changes through the internal facilities portal at facilities.alder.example.',
    body: ['The message says your badge needs to be reactivated. It asks you to scan a QR code and sign in with your work account.'],
    signoff: 'Workplace Access',
    artifact: { kind: 'qr', label: 'Badge review QR code', detail: 'Simulated QR preview: the destination is access-review.example, outside the company’s facilities portal.' },
    best: 'report', clue: 'The QR code would lead to an unfamiliar site that asks for work credentials.',
    feedback: {
      proceed: 'Leave the code unscanned. Open the facilities portal directly if you need to check your badge.',
      verify: 'Use the known facilities portal to check your badge, and report the message because it asks for credentials through an outside site.',
      report: 'Report the message without scanning the code. Check your badge from the facilities portal if needed.',
    },
  },
  {
    id: 'gift-cards', sender: 'Morgan Ellis', initials: 'ME', address: 'morgan@office-requests.example',
    time: '10:53 AM', subject: 'Gift cards for the team', preview: 'An apparent manager asks for an urgent purchase…',
    context: 'Morgan is your manager and uses alder.example. The company handles employee gifts through purchasing.',
    body: ['The sender claims to be Morgan and asks you to buy Apple Gift Cards for office employees today, then send the redemption codes by email.'],
    signoff: 'Morgan',
    best: 'report', clue: 'The sender uses an unfamiliar domain and asks for gift card codes outside the purchasing process.',
    feedback: {
      proceed: 'Pause the purchase and keep any codes private. Check with Morgan using the company directory and report the message.',
      verify: 'Checking with Morgan through a known channel is useful. Also report the email because it comes from an unfamiliar address and asks for redemption codes.',
      report: 'Report the message and let Morgan know through the usual company channel. Leave the cards unpurchased and keep any codes private.',
    },
  },
  {
    id: 'renewal-callback', sender: 'Harbor Tech Care', initials: 'HT', address: 'billing@service-notices.example',
    time: '10:57 AM', subject: 'Support plan renewal notice', preview: 'The notice says to call about a charge…',
    context: 'Your office has a Harbor Tech Care subscription. You usually manage it through the vendor portal, and you haven’t confirmed that a renewal is due.',
    body: ['The email claims your support plan will renew today. It says you must call the number in the message to dispute the charge.'],
    signoff: 'Harbor Tech Care Billing',
    best: 'verify', clue: 'The charge is unconfirmed, and the message directs you to a phone number you haven’t verified.',
    feedback: {
      proceed: 'Skip the number in the email. Open the vendor portal directly to check the billing record.',
      verify: 'Check the charge in the vendor portal or call the support number you already have on file. Report the message if the vendor confirms it is fake.',
      report: 'Reporting a suspicious email is reasonable. Check the billing record through the vendor portal to confirm whether a charge exists.',
    },
  },
  {
    id: 'document-permissions', sender: 'Sam Rivera', initials: 'SR', address: 'sam@alder.example',
    time: '11:04 AM', subject: 'Meeting notes shared with you', preview: 'A shared document asks for app access…',
    context: 'Sam is a teammate who often shares meeting notes. Your approved workspace normally lets you view shared files without granting another app access to your account.',
    body: ['The message appears to share a set of meeting notes and asks you to open them before the next team sync.'],
    signoff: 'Sam',
    artifact: { kind: 'permission', label: 'Document access request', detail: 'Simulated permission prompt: the unfamiliar Notes Preview app asks to read all contacts in your work account.' },
    best: 'report', clue: 'Viewing meeting notes does not require giving an unfamiliar app access to your contact list.',
    feedback: {
      proceed: 'Decline the permission request. Approving it would give the app access to your contacts. Report the message.',
      verify: 'Check with Sam through team chat if you need the notes. Decline the unrelated permission request and report the message.',
      report: 'Decline the request and report the message. If you already granted access, tell your security team so they can help revoke it.',
    },
  },
  {
    id: 'payroll-change', sender: 'Taylor Brooks', initials: 'TB', address: 'taylor@alder.example',
    time: '11:12 AM', subject: 'Direct deposit update', preview: 'An employee asks to change their pay account…',
    context: 'You are covering payroll review. Employees submit bank changes through the payroll portal, and there is no pending request for Taylor.',
    body: ['The email appears to come from Taylor and asks you to change the bank account for their next paycheck without using the payroll portal.'],
    signoff: 'Taylor',
    best: 'verify', clue: 'The request would redirect pay and bypasses the approved payroll process.',
    feedback: {
      proceed: 'Leave the payment details as they are. Confirm the request with Taylor through the company directory and use the payroll portal for any approved change.',
      verify: 'Contact Taylor using a number from the company directory. If Taylor confirms the request, direct them to the payroll portal. Report it if they deny sending it.',
      report: 'Pause the change and follow payroll policy. Contact Taylor separately to determine whether the request is legitimate or needs escalation.',
    },
  },
  {
    id: 'file', sender: 'Priya Shah', initials: 'PS', address: 'priya@alder.example',
    time: '11:19 AM', subject: 'Can you share the roster?', preview: 'Please send the staff roster to my other inbox…',
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
