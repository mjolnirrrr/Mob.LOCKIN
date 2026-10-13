# Validation record — Lock In

Validated on 13 October 2026.

## Build

`npm run build` completed successfully. The production output is generated in
`www/browser` and is intentionally excluded from the source ZIP.

## Browser regression suite

The production-preview Playwright suite completed with **17 passing tests**
before packaging.

It covered:

- Login validation, demo credentials, session persistence, logout, and route guards.
- Sign-up plus local-only forgot/reset password flows.
- Profile validation, cancel/save behaviour, generated initials, Home greeting, and refresh persistence.
- Task creation, numeric time sorting, editing, completion, deletion confirmation, cancellation, Calendar default dates, and persistence.
- Material validation, file metadata, safe links, search, filters, edit/delete, and persistence.
- Focus timer pause/resume/save plus refresh persistence.
- Theme first-use system preference, manual preference persistence, and study reminders.
- All 11 routes in light and dark themes at 360, 768, 1280, and 1920 px; the suite checks for visible horizontal overflow and opens both modal forms.
- Empty task/material states, zero-denominator statistics, and Philippine-local dates across the UTC midnight boundary.

## Final check

The final `npm run build` completed successfully after all UI and asset changes. Playwright's matching Chromium dependency was then installed and the complete suite was rerun against the newly generated production bundle: **17 of 17 tests passed in 56 seconds**.

The original and web asset copies of `icon.png` have matching SHA-256 hashes and both report as undistorted 1024 × 1024 RGB PNG files. The project does not currently contain an Android platform directory, so native density-specific icon resources remain an explicit Capacitor generation step documented in the README.

Inter and Manrope are bundled as local WOFF2 assets rather than imported from npm stylesheets. A clean production build and all 17 tests passed after this portability change.

## Prototype limitations

- Data is browser-local only. Clearing browser site data removes it.
- Login and reset-password flows are deliberately demonstrations, not security or identity systems.
- Materials store metadata/reference URLs only, not file contents.
- There are no background reminders, notifications, cloud sync, real email, backend calls, or native-device testing in this handoff.
