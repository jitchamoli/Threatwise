# Threatwise

Threatwise teaches cybersecurity awareness through short, interactive browser games. Its first game, **Inbox Investigator**, is an untimed mission for anyone learning how to handle suspicious or unexpected email.

## Play Inbox Investigator

Work through fourteen fictional workplace emails. Cases cover unfamiliar senders, legitimate typos, lookalike domains, QR phishing, Apple Gift Card requests, fake renewal callbacks, suspicious app permissions, and payroll changes.

Inspect sender details and simulated links, attachments, QR destinations, or permission prompts, then choose whether to **Proceed**, **Verify separately**, or **Report**. After each decision, the game explains the best response and highlights the clue that mattered.

At the end, review your score and retry any missed cases. Your best score is saved in the browser you played in.

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

Run `npm test` to check the scenario data, scoring, and saved progress. Run `npm run build` to generate the production site in `dist/`.

The mission content lives in [`src/scenarios.ts`](src/scenarios.ts).

## License

[GNU General Public License v3.0](LICENSE).
