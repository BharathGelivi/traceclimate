# TraceClimate demo narration

The video is an edited walkthrough of genuine browser screenshots from the working app, with synthesized narration. It is not a live screen recording. Synthetic example data is labeled; the NASA example uses an actual successful request.

## 1. Problem and target users
TraceClimate is an environmental evidence workbench for the Climate Data and Environmental Monitoring track. Research groups and community monitoring teams often share environmental spreadsheets. An unusual value can be missed, and a later copy can silently change. This prototype brings source review, explainable anomaly detection and portable integrity verification into one browser workflow. These are genuine captures of the working application, edited into a narrated walkthrough. The project was built solo by Bharath Gelivi with substantial Codex AI assistance.

## 2. Review an unusual reading
Start with Load anomaly demo. The dataset is clearly labeled synthetic: forty-five daily temperature readings and one deliberately inserted outlier. The timeline highlights the spike. The summary shows one reading needing review. On September twenty-ninth, the reading is fifty-three point four degrees Celsius, compared with a prior median of twenty-six point nine. This is a demonstration of finding something to investigate, not a claim that climate fraud or a sensor fault has been proven.

## 3. Explain the signal
The review queue provides a reason alongside each flag. The model uses up to fourteen preceding readings, a rolling median, and median absolute deviation. Seven observations are required before analysis starts, which explains the eighty-four percent coverage in this example. A minimum scale prevents division by zero for constant data. The four point five threshold is a prototype choice. Natural extremes may be flagged and slow drift may be missed. Human review remains essential, and the application never automatically corrects values.

## 4. Seal and verify
Select Seal this dataset to preserve the readings, source metadata, model configuration and analysis. Each record links to the previous SHA two fifty-six fingerprint. Export evidence downloads a portable JSON file. Save the final root separately in a trusted location. Verify chain recomputes the analysis and checks record order, every link and the independent root. Here all forty-five records match. We also verified the actual downloaded file outside the browser. No uploaded dataset was sent to an application server.

## 5. Detect a change
Test tampering on a copy changes a single reading in temporary memory. Verification detects the altered eleventh record. The original evidence is preserved and can still verify successfully. Reordering, truncation, altered analysis and a completely rehashed replacement are covered by automated tests. The independent root is crucial: if an attacker can replace both the bundle and the trusted root, they can rewrite history. This is a local evidence chain, without deployed blockchain, public consensus, or a trusted timestamp.

## 6. Use real environmental data
For a real source, expand NASA POWER. The default coordinates are Bengaluru, and the date range is September first through October fifteenth, twenty twenty-five. Import NASA data makes a direct request to the public API, without a key. This successful request returned forty-five readings with a mean of twenty-three point two degrees Celsius and no flags. Changing the dataset clears the previous evidence so it cannot be mistaken for the new source. NASA data is gridded daily air temperature, not individual sensor attestation.

## 7. Practical use and next steps
TraceClimate runs as a static website without paid services or a database. Users can import their own strict date and value CSV; files remain in browser memory. Ten automated tests pass, and browser walkthroughs exercised the real NASA request, evidence export, verification and tamper detection. The source, module plan and limitations are public on GitHub. Next, a campus monitoring pilot should measure false positives and review effort. Signed sensor metadata and optional public-ledger root anchoring could extend the system. Today the prototype proves integrity relative to a trusted root, not measurement truth.
