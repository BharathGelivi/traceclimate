# TraceClimate

## Inspiration
Environmental decisions depend on data that can be inspected and shared. A spreadsheet can contain an unusual reading, and a later copy can silently change. Small research groups and community monitoring teams need an accessible way to review both the signal and the evidence.

## What it does
Track: **Climate Data & Environmental Monitoring**. TraceClimate imports daily Celsius readings from a strict CSV or the public NASA POWER API. An explainable rolling median/MAD model identifies readings needing human review. A timeline and review queue show the reading, historical baseline and reason. Users seal readings, source metadata and analysis into a portable SHA-256 evidence chain, export it, and verify it against a separately retained root. A tamper demonstration modifies only a temporary copy.

## How we built it
The project has independent data validation, anomaly analysis, NASA integration, evidence sealing/verification and interface modules. It uses JavaScript modules, HTML, CSS, SVG and browser Web Crypto, without dependencies, paid APIs or server-side dataset storage. Node's test runner verifies the core. Source and a module plan are public: https://github.com/BharathGelivi/traceclimate.

Built solo by Bharath Gelivi with substantial Codex AI assistance in research, design, implementation, documentation and testing. This is a working prototype; no prior user research or field deployment is claimed.

## Challenges
Integrity must not be confused with accuracy. The verifier recomputes the analysis and checks record order, hashes and a trusted root saved separately. A malicious actor able to replace both the bundle and the trusted root can rewrite history. This is a local hash chain, without deployed blockchain, consensus or on-chain anchoring. Statistical outliers can be natural extremes; the app never automatically corrects measurements.

## Accomplishments
Ten automated tests pass, including mutation, reordering, truncation and complete rehash attacks. Browser walkthroughs demonstrated the synthetic 45-reading dataset, its single inserted outlier, sealing, successful verification, tamper detection and live NASA import. An actual downloaded evidence file verified all 45 records against its independent root. Invalid CSV handling preserves the previous dataset.

## What we learned
A small transparent model and an honest threat model make a prototype easier to assess. Source provenance, reproducibility and human review matter as much as the chart. NASA's gridded daily temperature is useful environmental context, but it is neither individual sensor attestation nor evidence of long-term climate change.

## What's next
Pilot with a campus environmental monitoring group; measure review effort and false-positive rates before claiming benefits. Add signed sensor metadata, domain-specific baselines and an optional public-ledger root anchor. Keep raw readings private while enabling independent verification. Current files are limited to 2,000 readings; larger deployment requires explicit retention, access and scale design.

## Judge walkthrough
Load anomaly demo; inspect the 29 September 53.4 C flag; seal; export and save root separately; verify; test tampering; verify original again. Import real NASA data using default Bengaluru coordinates and historic dates. Uploaded datasets remain in browser memory. Live NASA requests send only selected coordinates and dates to NASA.
