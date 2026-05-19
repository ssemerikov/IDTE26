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
npm install                # install Playwright (first time only)
npm run test:e2e           # run all Playwright tests
npx playwright test tests/basic.spec.js    # single test file
npx playwright test tests/lab01.spec.js    # lab01 variant tests
```

The config (`playwright.config.js`) starts `npx serve . -p 8080` automatically. Tests run only in Chromium.

## Tech Stack

- **A-Frame** (`aframe/aframe.min.js`) — local copy, all VR/3D scenes
- **AR.js** (`AR.js-master/aframe/build/aframe-ar.js`) — local copy, marker-based AR via webcam
- **MindAR** (`cdn.jsdelivr.net/npm/mind-ar@1.2.5`) — image-target AR (CDN only)
- **Three.js** — ES modules via import maps (CDN, week6), no bundler
- **LocAR.js** (`locar/`) — vendor copies of LocAR.js, locar-aframe.js, and locar-tiler for location-based (GPS) AR, used by week12
- **Assets** (`assets/`) — shared textures, models (`.glb`), MSDF fonts, AR marker patterns (`.patt`), MindAR target files (`.mind`)

## Structure

### Weeks (`week1/`–`week12/`)

Each `weekN/` folder is a standalone assignment building on the previous:

| Folder | Content |
|--------|---------|
| `week1/` | Basic A-Frame scene (static shapes, sky texture) |
| `week2/` | Animations, external image, `.glb` model, Ukrainian MSDF text |
| `week3/` | First AR scene — AR.js + Hiro marker, webcam required |
| `week4/` | Refined AR with multiple markers (`hiro`, `kanji`, custom `.patt` files), CSS fixes for AR.js layout |
| `week5/` | MindAR + solar system AR (`arindex.html`), VR solar system simulation (`vrindex.html`), combined MindAR scene (`test_mindar2.html`) |
| `week6/` | Three.js via import maps (`index.html`), AR geometric solver using custom A-Frame components (`triangle.html` + `mycode.js`) |
| `week12/` | Location-based AR with LocAR.js — places colored boxes at GPS coordinates around Chichester, UK |
| `week13/` | **In progress** — Human.js emotion/age/gender detection integrated with MindAR face tracking (see `week13/plan.md` for implementation steps) |

### Lab01 (`lab01/`)

Lab assignment with two variants, each containing VR, AR.js, and MindAR scenes:

- **var5** — Lithium atom model (nucleus + 3 electron orbits)
- **var8** — Collider (torus ring with two orbiting protons)

Each variant folder contains `vr.html`, `arjs.html`, `mindar.html`, an `index.html` portal, plus variant-specific `.patt` and `.mind` target files. The top-level `lab01/index.html` links to both variants. Reference materials: `lab01/l01.pdf` (assignment PDF) and `lab01/task.md` (task description in Ukrainian).

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

### LocAR.js location-based AR (week12)

- LocAR.js is the GPS/location-based AR library extracted from AR.js into a standalone project
- Three libraries, all loaded from CDN in the HTML: `locar` (core, Three.js-based), `locar-aframe` (A-Frame bindings), `locar-tiler` (tiled geodata download)
- `<a-scene locar-webcam>` enables the webcam background
- `<a-camera locar-camera='simulateLatitude: ...; simulateLongitude: ...'>` — GPS-aware camera; uses `simulateLatitude`/`simulateLongitude` for desktop testing where real GPS is unavailable
- `<a-box locar-entity-place='latitude: ...; longitude: ...'>` — places entities at real-world GPS coordinates
- Vendor copies of all three libraries live in `locar/` for reference (not loaded from there — the HTML uses unpkg CDN)
- A-Frame 1.7.1 from CDN (newer than the local `aframe/` copy) plus `aframe-look-at-component` for billboarding

### Three.js import maps (week6)
- `week6/index.html` uses `<script type="importmap">` with CDN URLs for Three.js 0.184.0
- `week6/main.js` uses `import * as THREE from 'three'` — no bundler needed

### Vendor library locations
- Week 3 uses CDN AR.js (`raw.githack.com`); weeks 4–6 and lab01 use local `AR.js-master/`
- A-Frame is loaded from local `aframe/` copy **except** MindAR pages (week5 `arindex.html`, lab01 `mindar.html`) which load A-Frame from CDN (1.6.0), and week12 (LocAR.js) which loads A-Frame 1.7.1 from CDN
- LocAR.js libraries (`locar`, `locar-aframe`, `locar-tiler`) are loaded from unpkg CDN in week12; their source code is in `locar/` for reference

### Human.js (`human-main/`)

Vendored copy of [Human.js](https://github.com/vladmandic/human) (v1.4+) — a face/body detection library built on TensorFlow.js. Provides emotion, age, and gender estimation from camera frames. Used by week13. Key paths:

- `human-main/dist/human.js` — IIFE bundle for browsers (includes TFJS)
- `human-main/dist/human.esm.js` — ESM bundle for browsers
- `human-main/demo/typescript/` — reference examples for emotion/age/gender detection
- `human-main/models/` — TFJS model files

The CDN load URL is `https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.js`.