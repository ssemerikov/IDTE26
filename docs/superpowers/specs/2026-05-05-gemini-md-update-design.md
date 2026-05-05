# Spec: GEMINI.md Update (IDTE26)

## Purpose
Update the `GEMINI.md` file to reflect the current project state, acting as a comprehensive guide for the agent and collaborators. This aligns with the behavior of the `/init` command by scanning the current environment and documenting "ground truth".

## Current State Analysis
- **Missing from old GEMINI.md**: 
    - `lab01/`: Synthesis labs with `var5` and `var8`.
    - `week6/`: Transition to Three.js with geometric calculator.
    - `tests/`: Playwright E2E tests.
    - `package.json`: NPM scripts for testing.
    - Ukrainian language context.

## Proposed Changes

### 1. Project Overview
- Highlight the educational context: IDTE26 Immersive Technologies.
- Mention the Ukrainian language focus.

### 2. Technical Stack Expansion
- Add **Playwright** for E2E testing.
- Clarify the use of local copies (`aframe/`, `AR.js-master/`) vs CDNs (`MindAR`).

### 3. Detailed Directory Map
- `week1-5`: A-Frame VR/AR progression.
- `week6`: Three.js transition.
- `lab01`: Synthesis of AR technologies.
- `tests`: Automated validation.
- `assets`: Centralized resource management.

### 4. Workflow & Commands
- Add testing command: `npm run test:e2e`.
- Maintain existing local server instructions.

### 5. Conventions
- Ukrainian MSDF font requirements.
- AR.js layout constraints.
- No-build-system philosophy.

## Success Criteria
- `GEMINI.md` accurately describes all major folders and technologies.
- Future agent sessions can use `GEMINI.md` to understand the project without deep scanning.
- Testing workflow is clearly documented.
