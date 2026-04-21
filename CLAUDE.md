# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a weekly lab assignment repository for an Immersive/Digital Technologies course (IDTE26), taught in Ukrainian. The project builds progressively from basic VR scenes to AR experiences using A-Frame and AR.js.

There is no build system, package manager, or test runner. All files are plain HTML/JavaScript served statically. To view scenes, open HTML files directly in a browser or serve them via a local HTTP server (required for webcam/AR.js access):

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Then open `index.html` at `http://localhost:8080`.

## Tech Stack

- **A-Frame** (`aframe/aframe.min.js`) — local copy, used for all VR/3D scenes
- **AR.js** (`AR.js-master/aframe/build/aframe-ar.js`) — local copy, marker-based AR via webcam
- **MindAR** (`cdn.jsdelivr.net/npm/mind-ar@1.2.5`) — image-target AR (CDN only)
- **Assets** (`assets/`) — shared textures, models (`.glb`), MSDF fonts, AR marker patterns (`.patt`), MindAR target files (`.mind`)

## Weekly Structure

Each `weekN/` folder is a standalone assignment that builds on the previous:

| Folder | Content |
|--------|---------|
| `week1/` | Basic A-Frame scene (static shapes, sky texture) |
| `week2/` | Added animations, external image, `.glb` model, Ukrainian MSDF text |
| `week3/` | First AR scene — AR.js + Hiro marker, webcam required |
| `week4/` | Refined AR with multiple markers (`hiro`, `kanji`, custom `.patt` files), CSS fixes for AR.js layout |
| `week5/` | Three demos: MindAR + solar system AR (`arindex.html`), VR solar system simulation (`vrindex.html`), combined MindAR scene (`test_mindar2.html`) |

## Key Architecture Notes

### AR.js marker-based AR (weeks 3–4)
- `<a-scene embedded arjs="...">` with `<a-marker preset="hiro">` (or `"kanji"`, or `type="pattern" url="...patt"`)
- Content placed inside `<a-marker>` anchors to the physical marker
- Requires `vr-mode-ui="enabled: false"` and webcam permission
- Week 4 CSS pattern: `overflow: hidden` on `html`/`body`, no `!important` on `body { margin }` — AR.js sets inline `margin-top` to center the camera feed

### MindAR image-target AR (week 5)
- Uses `mindar-image` scene attribute with `imageTargetSrc` pointing to a `.mind` file
- Content placed inside `<a-entity mindar-image-target="targetIndex: 0">`
- `.mind` files in `assets/` were generated from reference images (e.g. `yummy.png`, `ahmad.png`)

### MSDF Ukrainian text (weeks 2–5)
- Custom font files: `assets/times-msdf.json` and `assets/custom-msdf.json`
- Usage: `<a-text font="../assets/times-msdf.json" negate="false" value="...">`

### Solar system simulation (`week5/planet.js`, `week5/planet_ar.js`)
- Two custom A-Frame components: `planet` (schema + init for orbital mechanics) and `main` (tick loop running N-body gravity simulation)
- Positions stored in meters, displayed scaled to millions of km (divide by `1e9`)
- Integration step: `day/3` seconds per frame tick
- `console.log` calls left in the tick loop — remove for performance if adding more planets
- `planet.js` (used by `vrindex.html`) and `planet_ar.js` (used by `arindex.html`) are identical files — one for the pure VR scene, one embedded in the MindAR AR scene

### AR.js local vs CDN
- Week 3 uses CDN AR.js (`raw.githack.com`); weeks 4–5 use the local `AR.js-master/` copy
- A-Frame is loaded from the local `aframe/` copy **except** `week5/arindex.html`, which loads A-Frame from CDN (`https://aframe.io/releases/1.6.0/aframe.min.js`)
