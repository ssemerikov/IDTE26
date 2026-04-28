# GEMINI.md - IDTE26 Immersive Technologies Project

## Project Overview
This repository contains weekly lab assignments for the **IDTE26 (Immersive/Digital Technologies)** course. The project follows a progressive learning path from basic WebVR scenes to advanced Augmented Reality (AR) experiences and raw Three.js development.

### Key Technologies
- **A-Frame**: Primary framework for VR/AR scenes (weeks 1–5). Local copy in `aframe/`.
- **AR.js**: Used for marker-based AR (Hiro, Kanji, and custom patterns). Local copy in `AR.js-master/`.
- **MindAR**: Used for image-target tracking (week 5). Loaded via CDN.
- **Three.js**: Introduced in week 6 for lower-level 3D graphics. Loaded via Import Maps.
- **MSDF Fonts**: Custom Ukrainian font support (`assets/times-msdf.json`).

## Weekly Structure
Each folder representing a "week" contains standalone assignments:
- `week1/`: Introductory A-Frame scenes (basic shapes, sky).
- `week2/`: Animations, 3D models (`.glb`), and Ukrainian text rendering.
- `week3/`: Basic marker-based AR with AR.js.
- `week4/`: Advanced AR with multiple custom markers and CSS layout fixes.
- `week5/`: Solar system simulations in both VR (`vrindex.html`) and AR (`arindex.html`) using MindAR.
- `week6/`: Transition to direct Three.js development.

## Running the Project
The project consists of static HTML and JavaScript files. Since many features require webcam access (AR) or cross-origin requests (3D models), you **must** serve the files using a local HTTP server.

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .
```

Access the portal at `http://localhost:8080/index.html`.

## Development Conventions
- **No Build System**: Avoid introducing complex build steps or package managers unless requested. Stick to plain HTML/JS.
- **Asset Management**: Place all textures, 3D models (`.glb`), marker files (`.patt`), and MindAR files (`.mind`) in the `assets/` directory.
- **Ukrainian Text Support**: Always use the custom MSDF font with `negate="false"` for A-Frame text to ensure correct rendering of Ukrainian characters.
- **AR.js Layout**: For marker-based AR, ensure `html` and `body` have `overflow: hidden` and avoid using `!important` on body margins, as AR.js dynamically calculates these for camera feed alignment.
- **Three.js (Week 6+)**: Use Import Maps for Three.js and its addons to maintain a modern ES module workflow without a bundler.

## Key Files
- `index.html`: Main entry point/portal for the entire course.
- `CLAUDE.md`: Detailed technical notes and troubleshooting for the lab assignments.
- `assets/`: Shared resources across all weeks.
- `week5/planet.js`: Custom A-Frame component for solar system orbital mechanics.
