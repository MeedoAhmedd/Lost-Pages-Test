# Agent Instructions — Lost Pages

Quick operational rules for any AI coding agent working in this repo. Read
[`YOUR_SAFE_PLACE_CONTEXT.md`](YOUR_SAFE_PLACE_CONTEXT.md) first for the full
creative spec — this file is the short, practical checklist.

## Before touching anything
1. Read `YOUR_SAFE_PLACE_CONTEXT.md` and this file completely.
2. Inspect the actual current code in `src/` — do not assume structure from
   memory or from this file's description of it.
3. Preserve working systems. Do not rewrite something because a different
   architecture seems cleaner — refine, don't replace.
4. Work in small, testable phases. Run the game after each meaningful
   change (`npx serve src` or `python -m http.server 8000 --directory src`).

## Non-negotiable technical rules
- **Fixed diorama camera.** Never a follow-camera, never first-person,
  never rotates with the player. See `src/js/scene.js` — `CAM_LOOK`,
  `azim`, `elev`, `CAM_DIST`.
- **Frame-rate independence.** All movement/animation must use delta time
  (`distance = speed * dt`), not fixed per-frame increments. `dt` is
  already clamped in `src/js/main.js` (`Math.min(clock.getDelta(), 0.05)`)
  to avoid teleporting after a tab switch — keep that clamp if you touch
  the render loop.
- **Three independent save slots.** Never merge them, never let Slot 1's
  data leak into Slot 2/3. See `src/js/ui.js` (`saveSlot`).
- **No invented coordinates.** Interaction points (`INTERACTS` array in
  `src/js/interactions.js`) must be derived from actual furniture geometry,
  not guessed numbers. See the `lieY:0.905` comment there for the standard
  this project holds itself to.
- **No external 3D models or downloaded textures.** All geometry stays
  procedural Three.js primitives; all art direction comes from color,
  material, lighting, and composition — not asset budget. This is a
  deliberate style choice (stylized diorama, not photorealistic), not a
  technical limitation to "fix" later.
- **No new dependencies / no build step** unless explicitly asked. Plain
  `<script src>` tags, Three.js from CDN, exactly as it works today.
- **Never silently introduce unlicensed assets.** Every third-party asset
  (audio, fonts, textures, models, icons) gets an entry in
  `ASSET_LICENSES/README.md` before it ships.

## Development priority order
Visual overhaul (camera composition → room architecture → materials →
lighting → atmosphere → detail pass → character fit → UI consistency)
comes **before** new feature work (piano, melody recording, Learn Mode,
character skins, etc.). See `YOUR_SAFE_PLACE_CONTEXT.md` section 24/32 for
the full phase breakdown. Don't jump ahead to a later phase just because
it's more interesting to build.

## Scope of this repo
This is `Lost Pages` — an independent sandbox repo, cloned from the real
game's `dev/` folder (in the separate `Your-Safe-Place` repo) and now
pushed to its own remote (`Lost-Pages-Test`). **Never assume access to or
make changes in the original `Your-Safe-Place` repo/`dev/` folder from
here** — they're intentionally kept separate so the real game stays stable
while this sandbox is refined.

## Directory structure
See the "Project structure" section in `README.md`. In short: **edit only
inside `src/`.** `builds/` is generated output, never hand-edited.
