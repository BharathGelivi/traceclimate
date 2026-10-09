# TraceClimate implementation plan

Selected event: https://ieee-climatechain-hack.devpost.com/
Track: Climate Data & Environmental Monitoring.
Solo entrant: BharathGelivi; India; college student; over 18 (user supplied).

Selection on 9 October 2026: approximately 635 registrations, $3,000 advertised cash ($1,500/$1,000/$500). Rules still say prizes TBD and prohibit submissions before 25 October 8 AM Pacific, later than the displayed 25 October 5 PM MSK deadline. Final entry must wait for clarification. No prize or eligibility verification has been claimed.

## Modules and acceptance criteria
1. Import: strict CSV parser, dates, finite Celsius values, unique dates, limits; NASA POWER daily temperature import without a key. No silent simulated live data.
2. Analysis: robust rolling median/MAD model trained on preceding readings; score and explain outliers. Mark warm-up and zero-variance windows honestly; no automatic corrections or claims that an anomaly proves fraud.
3. Integrity: canonical SHA-256 hash chain with full source and analysis metadata, downloadable evidence and a separately retained root. Verify mutation, reordering, truncation, and independently recomputed chains against the trusted root. This is a local evidence chain, not a deployed blockchain or institutional attestation.
4. Interface: responsive analysis workspace, annotated SVG chart, review table, dataset source, evidence export/import and tamper demonstration. Private by default: uploaded CSV stays in browser memory.
5. Verification: unit and integration tests plus browser flow: demo → inspect anomaly → seal → verify → tamper → detect. Test malformed input, empty results, download and re-import, responsive layout and keyboard controls.
6. Submission: public source with MIT license, live unrestricted demo, measured results, honest AI disclosure, 3–5 minute demo and account submission. No fabricated endorsements or results.

## Comparison
Qloo: $25,000 cash / ~828; cannot complete live integration without manually approved key.
RenderJuice: $1,500 cash / 9; strongest raw ratio, but official Discord entry opens 15 October and requires account membership.
IEEE ClimateChain: $3,000 advertised cash / ~635; immediate build with no key; submission-window conflict remains.
Build With AI Basics: $2,500 cash / ~2,796; immediate build, but weaker raw ratio and mandatory learning-skill workflow.
Hyperbloom and Galuxium: advertised monetary totals represent credits/licenses; rejected for the user's cash requirement.

Cash pool divided by registrations is a screening metric, not expected winnings. Registrations include teams and non-submitters; counts change; sponsor prize pages do not guarantee payouts.
