# Project Analysis (May 6, 2026)

## Summary
LearnCraft is a Vite + React frontend with a small Express backend. The frontend hosts routes for grades 6-12, a basic contact form route on the backend, and Firebase analytics initialization on the client. Internationalization appears present via TranslationContext and locale files. Deployment looks Vercel-based per README.

## What is missing
1. **Environment configuration**
   - Firebase config is hard-coded in [src/firebase.js](src/firebase.js). This should be moved to environment variables and documented.
   - No .env.example or setup guide in [README.md](README.md).

2. **Backend data handling**
   - The backend only logs contact form data and returns success. There is no persistence, email integration, rate limiting, or spam protection in [backend/server.js](backend/server.js).
   - No validation library or schema, only a basic email/message check.

3. **CORS and environment separation**
   - CORS is fully open without origin restrictions in [backend/server.js](backend/server.js).
   - No environment-based config (dev vs prod) for API URLs or server port.

4. **Testing and QA**
   - No unit, integration, or end-to-end test setup in [package.json](package.json) or [backend/package.json](backend/package.json).
   - No lint or format scripts defined in [package.json](package.json), despite ESLint config existing in [eslint.config.js](eslint.config.js).

5. **Documentation**
   - [README.md](README.md) is minimal and does not include setup, build, env, or deploy steps.
   - No architecture or API docs.

## What needs updating
1. **Vite base path**
   - The base path is set to `/zestverse1` in [vite.config.mjs](vite.config.mjs). This likely does not match the LearnCraft deployment name and can break asset routing if incorrect.

2. **Dependency hygiene**
   - `nodemon` is listed in runtime dependencies in [backend/package.json](backend/package.json); it should be a dev dependency.
   - `carousel` and `slick` may be redundant with `react-slick` and `slick-carousel` in [package.json](package.json). Validate and remove unused packages.

3. **Scripts and workflows**
   - Add lint and format scripts to [package.json](package.json) to match the ESLint config.
   - Consider adding a backend build/start script for production instead of only nodemon.

## What needs changing
1. **Secrets handling**
   - Move Firebase keys from [src/firebase.js](src/firebase.js) to `VITE_` prefixed env variables. Add .env.example and update docs.

2. **Backend design**
   - Add input validation (schema-based) and optionally rate limiting to `/contact` in [backend/server.js](backend/server.js).
   - Implement persistence (database or email service) if contact data is meant to be used.

3. **Frontend-backend integration**
   - Document the API base URL (env), and add a consistent client helper for API calls.

4. **Deployment configuration**
   - Confirm the correct `base` path in [vite.config.mjs](vite.config.mjs).
   - Ensure Vercel or other deployment includes SPA routing and backend deployment plan.

## Risks and tech debt
- **Hard-coded Firebase config** exposes environment details and complicates configuration changes.
- **Open CORS** can allow unwanted origins to hit the API.
- **No tests** increases regression risk as more classes and games are added.
- **Minimal README** makes onboarding and deployment error-prone.

## Recommended next actions (priority order)
1. Add `.env.example` and move Firebase config to env variables, update [README.md](README.md).
2. Fix `base` path in [vite.config.mjs](vite.config.mjs) to match deployment.
3. Add lint/format scripts and run ESLint in CI.
4. Improve `/contact` endpoint with validation and persistence/email delivery.
5. Restrict CORS to known origins for production.
