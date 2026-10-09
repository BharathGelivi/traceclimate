# Verification — 9 October 2026

## Automated checks

`npm test`: 10 passed, 0 failed, Node 24.18.0. Tests cover strict CSV validation, duplicates and impossible dates; model warm-up and one inserted outlier; constant series; evidence serialization and round-trip verification; mutation, reordering, truncation, model and analysis modification; complete chain rebuild against an independent trusted root; malformed records and missing root; canonical key ordering; NASA schema normalization and missing values; explicit NASA errors.

## Browser and real integration walkthrough

- Local HTTP server returned 200 and app loaded.
- Synthetic demo: 45 readings, 1 flagged reading on 2026-09-29, 53.4 C, prior median 26.9 C, 84% analyzed.
- Seal -> verify: all 45 records matched the separately retained root.
- Tamper copy: changed record 11 was detected; original verified again.
- Evidence JSON import with independently supplied root verified 45 records while leaving the analysis dataset unchanged.
- Actual browser export produced `Downloads/traceclimate-evidence.json` (23,512 bytes). The browser download-event listener timed out after export, but the downloaded file was verified using the core verifier: valid, count 45.
- Actual NASA request for Bengaluru, 2025-09-01 through 2025-10-15: 45 readings, mean 23.2 C, 0 flags. Import cleared evidence from the previous source. Repeated successful integration produced no browser console errors.
- Invalid CSV was selected; the existing 45-reading demo remained intact. The transient error message was not retained in the final capture; invalid-input behavior is also covered by automated tests.

## Verification limits

Responsive viewport overrides did not take effect in the browser provider: requested 390 px and 1440 px tests both reported an actual 743 px viewport. Do not claim those breakpoint tests passed. The existing approximately 728–743 px layout was visually inspected. WebMCP registration is optional and was not exercised in a supporting browser. No field validation of the statistical model, on-chain integration, sensor attestation or climate impact study is claimed.

## Demo artifact

`test-artifacts/traceclimate-demo.mp4`: 265.2 seconds (4m25s), 3,926,115 bytes. Entire video and audio decoded successfully with FFmpeg. An extracted frame was inspected for readability. Video uses edited genuine app captures and installed Windows synthesized narration; it is not a live recording. The script is `DEMO_SCRIPT.md`.

## Source and submission materials

Public source: https://github.com/BharathGelivi/traceclimate. Project story is prepared in `SUBMISSION.md` and video narration in `DEMO_SCRIPT.md`. This report verifies prototype behavior; it does not claim a submitted competition entry or prize outcome.
