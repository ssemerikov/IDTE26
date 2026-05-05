# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weekly lab assignments for an Immersive/Digital Technologies course (IDTE26), taught in Ukrainian. The project builds progressively from basic VR scenes to AR experiences using A-Frame, AR.js, MindAR, and Three.js.

There is no build system or bundler. All files are plain HTML/JavaScript served statically. A local HTTP server is required for webcam/AR access:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

Open `index.html` at `http://localhost:8080`.

## Running Tests

Playwright E2E tests verify that scene pages load with expected A-Frame/MindAR elements:

```bash
npm run test:e2e          # run all Playwright tests
npx playwright test tests/basic.spec.js   # single test file
```

The config (`playwright.config.js`) starts `npx serve . -p 8080` automatically. Tests run only in Chromium.

## Tech Stack

- **A-Frame** (`aframe/aframe.min.js`) — local copy, all VR/3D scenes
- **AR.js** (`AR.js-master/aframe/build/aframe-ar.js`) — local copy, marker-based AR via webcam
- **MindAR** (`cdn.jsdelivr.net/npm/mind-ar@1.2.5`) — image-target AR (CDN only)
- **Three.js** — ES modules via import maps (CDN, week6), no bundler
- **Assets** (`assets/`) — shared textures, models (`.glb`), MSDF fonts, AR marker patterns (`.patt`), MindAR target files (`.mind`)

## Structure

### Weeks (`week1/`–`week6/`)

Each `weekN/` folder is a standalone assignment building on the previous:

| Folder | Content |
|--------|---------|
| `week1/` | Basic A-Frame scene (static shapes, sky texture) |
| `week2/` | Animations, external image, `.glb` model, Ukrainian MSDF text |
| `week3/` | First AR scene — AR.js + Hiro marker, webcam required |
| `week4/` | Refined AR with multiple markers (`hiro`, `kanji`, custom `.patt` files), CSS fixes for AR.js layout |
| `week5/` | MindAR + solar system AR (`arindex.html`), VR solar system simulation (`vrindex.html`), combined MindAR scene (`test_mindar2.html`) |
| `week6/` | Three.js via import maps (`index.html`), AR geometric solver using custom A-Frame components (`triangle.html` + `mycode.js`) |

### Lab01 (`lab01/`)

Lab assignment with two variants, each containing VR, AR.js, and MindAR scenes:

- **var5** — Lithium atom model (nucleus + 3 electron orbits)
- **var8** — Collider (torus ring with two orbiting protons)

Each variant folder contains `vr.html`, `arjs.html`, `mindar.html`, plus variant-specific `.patt` and `.mind` target files.

## Key Architecture Notes

### AR.js marker-based AR (weeks 3–4, lab01, week6/triangle.html)
- `<a-scene embedded arjs="...">` with `<a-marker preset="hiro">` (or `"kanji"`, or `type="pattern" url="...patt"`)
- Content inside `<a-marker>` anchors to the physical marker
- Requires `vr-mode-ui="enabled: false"` and webcam permission
- CSS: `overflow: hidden` on `html`/`body`, no `!important` on `body { margin }` — AR.js sets inline `margin-top` to center the camera feed

### MindAR image-target AR (week 5, lab01)
- `mindar-image` scene attribute with `imageTargetSrc` pointing to a `.mind` file
- Content inside `<a-entity mindar-image-target="targetIndex: 0">`
- `.mind` files in `assets/` or per-variant folders, generated from reference images

### MSDF Ukrainian text (weeks 2–5)
- Custom font files: `assets/times-msdf.json` and `assets/custom-msdf.json`
- Usage: `<a-text font="../assets/times-msdf.json" negate="false" value="...">`

### Solar system simulation (`week5/planet.js`, `week5/planet_ar.js`)
- Two custom A-Frame components: `planet` (schema + init) and `main` (tick loop running N-body gravity)
- Positions in meters, displayed scaled to millions of km (÷ `1e9`), integration step: `day/3` seconds per tick
- `planet.js` and `planet_ar.js` are intentionally identical — update **both** or consolidate with instructor approval
- `console.log` calls left in tick loop — remove for performance if adding more planets

### Geometric solver (`week6/mycode.js`, used by `triangle.html`)
- `marker-node` component: registers/deregisters markers in global `activeNodes` dict on `markerFound`/`markerLost`
- `polygon-solver` component: tick loop draws connector lines between markers and computes triangle areas (vector cross product) and quadrilateral perimeter
- Uses object pools for lines (15) and text labels (10) to avoid per-frame DOM creation
- Pure Three.js `CylinderGeometry` meshes for lines (not A-Frame entities) — geometry is pre-rotated to align along Z axis in `init`

### Three.js import maps (week6)
- `week6/index.html` uses `<script type="importmap">` with CDN URLs for Three.js 0.184.0
- `week6/main.js` uses `import * as THREE from 'three'` — no bundler needed

### Vendor library locations
- Week 3 uses CDN AR.js (`raw.githack.com`); weeks 4–6 and lab01 use local `AR.js-master/`
- A-Frame is loaded from local `aframe/` copy **except** MindAR pages (week5 `arindex.html`, lab01 `mindar.html`), which load A-Frame from CDN (`https://aframe.io/releases/1.6.0/aframe.min.js`) because MindAR requires a compatible version