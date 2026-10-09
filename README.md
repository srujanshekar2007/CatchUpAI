# CatchUp AI

CatchUp AI is a local-first conversation catch-up demo. It turns pasted text or `.txt`, `.csv`, and `.json` exports into source-linked findings, a task list, an evidence-backed calendar, and searchable chat answers.

## Run it

No dependencies, API keys, or build step are required. From this directory, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Demo

Choose **Try Demo** on the landing page (or **Load Judge Demo** in the input hub). This imports a clearly labeled sample Atlas conversation and runs the same local analysis pipeline used for user imports. Inspect source messages with the source buttons, inspect TruthTrace evidence, and open Smart Calendar. Demo data is stored in browser local storage with other app state. Use **Delete all data** in the input hub to remove it.

## Architecture and privacy

- `app.js` contains the shared state and browser-local data lifecycle, chat export normalization, three distinct deterministic analysis passes, a validating merge, priority scoring, change linking, task/calendar views, source retrieval, and judge demo.
- `styles.css` contains the shared responsive design system and dark/light themes.
- `index.html` is the app shell.
- Profile, theme, imported originals, derived data, and chat are stored in this browser's local storage. Browser local storage is not encrypted. Data is not sent to a server or external AI provider. Clearing the browser's site data also removes the app state.
- No WhatsApp or Telegram account integration is implemented. Export and upload a text-based conversation instead.

## Current limits

This is a hackathon prototype, not a general-purpose language model. The Fact Checker, Risk Assessor, and Summary Writer are distinct rule-based local passes with source IDs, rather than external AI agents. Date parsing handles explicit dates and relative weekday/tomorrow language only when a message has a recognized timestamp; timestamp formats outside the common export pattern remain unknown. Extracted times and nuanced event supersession are not yet normalized into calendar times. The chatbot uses lexical retrieval over original messages and links its matches; it does not synthesize a semantic answer. Unsupported dates and ambiguous ownership remain uncertain for user review. Contact form submission is local validation only and does not send email.

## Checks

Run the dependency-free checks with:

```sh
node --check app.js
node --check engine.js
node --test
```
