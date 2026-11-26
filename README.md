# Threatwise

Threatwise teaches everyday cybersecurity and privacy through short, untimed browser games. Choose a game from the home screen.

## Play Inbox Investigator

Work through fourteen fictional workplace emails. Cases cover unfamiliar senders, legitimate typos, lookalike domains, QR phishing, Apple Gift Card requests, fake renewal callbacks, suspicious app permissions, and payroll changes.

Inspect sender details and simulated links, attachments, QR destinations, or permission prompts, then choose whether to **Proceed**, **Verify separately**, or **Report**. After each decision, the game explains the best response and highlights the clue that mattered.

At the end, review your score and retry any missed cases. Your best score is saved in the browser you played in.

## Play Safe to Share?

Work through five everyday situations involving a puppy photo, a boarding pass, a group chat screenshot, live location, and a park photo. Check who will see the post, then choose **Share as is**, **Hide a detail**, or **Keep private**.

Tap a highlighted detail to conceal it. After deciding, see what your audience would have received and why another choice might work better. Retry any round as you play or from the results screen.

## Run locally

Use Node.js 24 and npm.

```sh
git clone git@github.com:jitchamoli/Threatwise.git
cd Threatwise
npm ci
npm run dev
```

Open the local URL printed by Vite. The app is built with React, TypeScript, and Vite and runs entirely in the browser.

## Build and test

Run `npm test` to check the scenario data, inbox scores, saved progress, and sharing outcomes. Run `npm run build` to generate the production site in `dist/`.

The game content lives in [`src/scenarios.ts`](src/scenarios.ts) and [`src/sharing/rounds.ts`](src/sharing/rounds.ts).

## License

[GNU General Public License v3.0](LICENSE).
