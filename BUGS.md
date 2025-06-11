# Top 10 Bugs to Fix in Gamified Learning Platform

This document highlights the most critical issues for immediate attention, with file locations and brief descriptions.

## 1. Missing Bitmap Font Preloading

- **Location:** packages/core/preloader.js
- **Issue:** No `this.load.bitmapFont` calls for `pixelfont`, `knighthawks` (and any other bitmap fonts). Scenes using `bitmapText` will crash or display blank text.

## 2. How-to-Play Panel Click Propagation

- **Location:** index.html (`#click-to-start` overlay)
- **Issue:** Clicking anywhere inside the How-to-Play panel (other than the help button) will bubble up to the overlay’s click listener and start the game prematurely.

## 3. Unclamped Health & Math Power Bars

- **Location:** packages/scenes/EnhancedMathCombatScene (or equivalent combat scenes)
- **Issue:** `healthPercent` and `mathPercent` are not clamped to [0,1], causing negative or oversized bar dimensions when values go out of range.

## 4. AudioContext Unlock Listeners Not Removed

- **Location:** packages/core/main.js (`addAudioUnlockListeners`)
- **Issue:** Multiple global and canvas-level event listeners are registered but never removed, leading to potential memory leaks and redundant calls.

## 5. Overly Aggressive InputManager Override

- **Location:** packages/core/main.js (hitAreaCallback override)
- **Issue:** The custom override for `pointWithinHitArea` may suppress valid input events and disable interactive objects unnecessarily, causing unresponsive UI.

## 6. Preloader Animations Leak on Scene Switch

- **Location:** packages/core/preloader.js
- **Issue:** Graphics objects (particles, scan lines, rings) and their tweens are not destroyed when transitioning away, leading to memory bloat over time.

## 7. Duplicate Game Module Loading

- **Location:** index.html & Vite build inject `<script>` tag
- **Issue:** The game’s main module is auto-injected by Vite and also dynamically imported in `startGame()`, resulting in double initialization or unexpected behavior.

## 8. Hard-Coded Magic Numbers

- **Location:** Spawn logic, timing, UI layout across multiple scenes
- **Issue:** Numerous fixed values (e.g., enemy spawn intervals, UI padding, health thresholds) reduce flexibility and complicate balancing.

## 9. Missing Error Boundaries in Scene Creation

- **Location:** packages/scenes/\*.js (`create()` methods)
- **Issue:** Lack of `try/catch` around asset creation and scene setup means that any loading or rendering error crashes the entire game.

## 10. Inefficient Pattern Rendering

- **Location:** packages/scenes/EducationalMenuScene.js (geometric patterns)
- **Issue:** Hexagon and grid patterns are drawn every frame or on each scene load without caching, causing performance slowdowns on large viewports.

---

Addressing these issues will improve stability, performance, and user experience across the platform.
