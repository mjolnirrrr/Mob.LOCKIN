# Lock In — local study planner prototype

A responsive Ionic 8 + Angular 18 application using standalone components, separate HTML templates and SCSS styles. No Tailwind, backend, cloud service, API requests or real authentication.

## Run on your laptop

Use Node.js 22.
Open a terminal in the folder containing `package.json`:

```bash
npm ci
npm start
```

Open the local address printed by Angular (normally `http://localhost:4200`).

For a production preview:

```bash
npm run build
npm run preview
```

Open `http://127.0.0.1:8100`. The preview server handles direct links to every route. It serves static assets only; it is not an application backend.

## Demo login

- Email: `markjohn@example.com`
- Password: `123456`
- Any syntactically valid email and password of at least six characters also work.
- Sign-up validates the name, email, password confirmation and prototype notice, then updates the local profile.
- Forgot/reset password is a local demonstration. No email is sent and no password is stored or enforced.
- Login state persists locally. Logout redirects to Login; guards protect all tabs and Materials.

## What changed

- All 12 existing page components, the application root and both existing modals now have separate `.ts`, `.html` and `.scss` files.
- Added reusable task-list and focus-timer components, also with separate files.
- Redesigned Home, Calendar, Study, Materials, Stats, Profile, onboarding and authentication screens.
- Uses bundled Inter Variable for clear body copy and Manrope Variable for confident, compact headings; no remote font request is required.
- The supplied 1024 px app icon is used unchanged for the favicon, Apple touch icon, Home wordmark and onboarding identity. Its charcoal-and-green palette informs the shared light/dark design tokens.
- Added subject-colour task rails, a calculated daily progress ring and motivation copy, clearer file-library rows, selected/today calendar states, and a more informative account summary.
- Responsive content reaches 1120px on desktop, uses grids where useful and retains bottom tabs on phones.
- Default profile: **Mark John Esteban**. Edit name, email, study goal and optional school/course; save or cancel; initials and Home update immediately.
- Shared light/dark tokens cover Ionic controls, overlays, native form controls and navigation. System theme is used on first use; the resolved preference is saved. Profile lets you change it.
- Add/edit/complete/delete tasks with same-day start/end validation and confirmation for deletion. Calendar creation defaults to the selected day.
- Task times sort numerically (11 AM before 2 PM); dates use local calendar parts, not UTC date slicing. Date-dependent displays refresh periodically.
- Materials support subject filtering, search, edit/delete, file metadata selection and validated HTTP/HTTPS reference links.
- Focus timer: 15/25/50 minutes, pause/resume, finish/save, automatic completion and active-timer refresh persistence.
- Stats calculate completion, completed quizzes, focus hours, streak and per-subject completion from local records. No invented scores or notification counts.
- Working help/privacy disclosures and local study-reminder preference. A storage-error banner explains when browser storage is unavailable/full.

## Structure

```text
src/app/
  app.component.ts / .html / .scss
  app.routes.ts
  models/models.ts
  services/
    mock-auth.service.ts
    mock-data.service.ts
    local-store.ts
    theme.service.ts
    focus.service.ts
  pages/
    auth/onboarding + login/signup/forgot-password/reset-password
    home/calendar/study/materials/stats/profile/tabs
  components/
    add-quiz-modal/add-material-modal/task-list/focus-timer
src/theme/variables.scss
src/global.scss
tests/planner.spec.ts
```

## Local data

The `lockin.*` localStorage keys store tasks, material reference records, profile, theme, login state, focus sessions, active timer and reminder preference. Angular signals update visible pages immediately. Starter demo tasks/materials are seeded only when no saved list exists; an empty saved list stays empty.

All demo email logins share this browser's planner. Data is not isolated by account and does not sync between browsers/devices. Browser site-data clearing removes it. The prototype has no security boundary; do not use real credentials or sensitive information.

Material uploads save **metadata only**, not file bytes. Links are stored without fetching them; explicitly opening a reference navigates to its external site. Focus time is based on the local device clock and a countdown can complete while the tab is closed; there are no background alarms or push notifications. Streaks count dates with saved focus sessions. No quiz-scoring engine is simulated.

## Tests

```bash
npm run build
npx playwright install chromium
npm test
```

The suite starts the production preview server automatically. It exercises all routes, authentication, profile persistence, task/material mutations, theme persistence, focus sessions, empty states and responsive light/dark layouts at 360, 768, 1280 and 1920 pixels. See `VALIDATION.md` for the delivered build's results. `npm run format` formats source files.

## Optional Android shell

The ZIP is the web source project, not an APK. Capacitor's output path is corrected to `www/browser`. With Android Studio and an appropriate SDK installed:

```bash
npm install @capacitor/android@6.1.0
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

The professional 1024 px source icon is included at `resources/icon.png`. To
generate Android and iOS icon sizes after adding a native platform, run:

```bash
npm install --save-dev @capacitor/assets
npx capacitor-assets generate
```

The same design is used for the browser favicon and Apple touch icon through
`src/assets/icon/`.

If an Android platform already exists, skip `cap add android`. Android Studio/device execution was not part of the browser validation. No native platforms or `node_modules` are bundled.
