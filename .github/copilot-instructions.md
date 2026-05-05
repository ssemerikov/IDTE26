# .github/copilot-instructions.md — IDTE26 repository

Purpose
Provide Copilot-style assistants concise, repository-specific guidance so suggestions and code changes align with course conventions and static-site workflows.

Build / test / lint
- No build system, test runner, or linter is configured.
- To run demos or test AR/webcam behavior use a local server:
  - Python: `python3 -m http.server 8080`
  - Node: `npx serve .`
- There are no single-test runners; no test commands exist unless added.

High-level architecture
- Static HTML/JS site with standalone weekly demos in `week1/`..`week6/`.
- A-Frame (local `aframe/`) for VR/3D scenes (weeks 1–5).
- AR.js (local `AR.js-master/`) for marker-based AR (Hiro, Kanji, custom `.patt`).
- MindAR (CDN) for image-target AR used in week5; `.mind` target files live in `assets/`.
- Three.js appears in week6 and is used as ES modules/import maps (no bundler).
- Shared assets (textures, `.glb`, `.patt`, `.mind`, MSDF fonts) are in `assets/`.
- `week5/planet.js` and `planet_ar.js` implement custom A-Frame components for a solar-system simulation (N-body style; units in meters).

Key conventions (do not assume generic defaults)
- Keep edit scope small: prefers surgical edits to static files over adding complex tooling.
- Always test AR-related changes via a local HTTP server (webcam access and CORS matters).
- MSDF Ukrainian fonts: use `assets/times-msdf.json` (or `custom-msdf.json`) with `negate="false"` on `<a-text>` to render Ukrainian characters correctly.
- AR.js CSS: `html, body { overflow: hidden; }` and avoid `!important` on `body { margin }` — AR.js computes inline `margin-top` for camera centering.
- Vendor files: many demos use local copies of A-Frame and AR.js. If proposing upgrades, include a minimal test plan and fallback to the local vendor copy.
- Solar system components: positions are meters; some code scales for display (divide by 1e9). Remove verbose console logging in tick loops for performance.
- When editing `planet.js`/`planet_ar.js`, update both files (they are identical by intent) or consolidate only with instructor approval.

Files and docs to read first
- `CLAUDE.md` and `GEMINI.md` — canonical notes about architecture and conventions.
- `index.html` — portal to demos.
- `lab01/index.html` — lab 1 entry with per-variant indexes (var5, var8).
- `week5/planet.js` — example of custom components and simulation conventions.
- `.claude/` — local assistant settings.

Guidance for Copilot sessions
- Prefer local-server testing steps in PR descriptions for AR/webcam changes.
- Avoid introducing build tools or package managers unless requested; explicitly call out such proposals in PRs.
- For version bumps (A-Frame/AR.js/MindAR), include quick manual test checklist (open X pages, confirm webcam/marker behavior) and a rollback path.

AI assistant config
- Check `CLAUDE.md`, `GEMINI.md`, and the `.claude/` folder for additional repository-specific rules before making sweeping changes.

