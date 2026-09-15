# Lost Pages — Your Safe Place (revamp sandbox)

This is the experimental revamp of **Your Safe Place**. It started as an
exact clone of the real game (`dev/` in the main `Your-Safe-Place` repo) and
now lives as its own independent git repo
([`MeedoAhmedd/Lost-Pages-Test`](https://github.com/MeedoAhmedd/Lost-Pages-Test))
so the real game stays untouched while this is refined.

See [`YOUR_SAFE_PLACE_CONTEXT.md`](YOUR_SAFE_PLACE_CONTEXT.md) for the full
creative-direction spec this project follows — read that before making
design changes.

---

## Project structure

```
Lost Pages/
├── README.md              this file
├── .gitignore
├── ASSET_LICENSES/        license records for every third-party asset
├── docs/                  (empty placeholder — design notes, future docs)
├── tools/                 (empty placeholder — future build/dev scripts)
│
├── src/                   ← THE GAME. Everything you edit lives here.
│   ├── index.html
│   ├── css/
│   │   ├── base.css       room/HUD/layout styles
│   │   └── ui.css         menus, notebook, panels, buttons
│   ├── js/
│   │   ├── scene.js       renderer, camera, lighting, materials, furniture, Edit Mode
│   │   ├── interactions.js  character, movement, collision, E/F interactions, sleep poses
│   │   ├── audio.js       ambience engine + music player
│   │   ├── ui.js          save-slot system, main menu
│   │   └── main.js        render loop, resize handling, quality watchdog
│   └── assets/
│       └── audio/
│           └── music/     the 6 licensed ambience/music tracks
│
└── builds/                ← GENERATED OUTPUT ONLY. Never hand-edit these.
    ├── web/
    ├── windows/
    ├── android/
    └── ios/
```

**Where future assets belong**, once those systems exist:
- Piano samples → `src/assets/audio/piano/` (create when the piano is built)
- Sound effects → `src/assets/audio/sfx/`
- Textures → `src/assets/textures/`
- 3D models (if ever needed) → `src/assets/models/`
- Icons → `src/assets/icons/`

These folders don't exist yet — they're not created ahead of need, per "don't
create 100 files for no reason." Add each one when the system that needs it
is actually being built.

**Do not manually edit anything under `builds/`.** Those folders are where a
future packaging step will drop generated web/Windows/Android/iOS output.
Right now they're empty placeholders (`.gitkeep` files) — no build tooling
exists yet, by design, since the project is still in active
development/testing.

---

## How to run it locally

No build step, no npm install required for the game itself — it's plain
HTML/CSS/JS loading Three.js from a CDN. You just need something to serve
`src/` over HTTP (opening `index.html` directly via `file://` won't work
because of browser module/CORS restrictions on the script tags).

**Option A — Node's `serve` package** (same as the main `dev/` workflow):
```bash
npx serve src
```

**Option B — Python**, if you have it and prefer not to touch npm:
```bash
python -m http.server 8000 --directory src
```

Then open the printed local URL in a browser. Requires an internet
connection since Three.js and the Caveat/Kalam fonts load from CDNs.

---

## What was done in this session

### 1. Fixed a pre-existing bug: `saveSlot is not defined`
`src/js/audio.js` had `ambVolEl.addEventListener('change', saveSlot);` at
top-level script scope. Because `<script>` tags load in order
(`scene.js → interactions.js → audio.js → ui.js → main.js`) and `saveSlot`
is defined in `ui.js`, this threw a `ReferenceError` the instant `audio.js`
ran — which silently killed every line of `audio.js` after that point on
**every page load**. Fixed by wrapping the reference in a closure so it
resolves lazily when the event actually fires:
```js
ambVolEl.addEventListener('change', function(){ saveSlot(); });
```
**This same bug still exists in the real game's `dev/js/audio.js`** — it
was not touched there since this sandbox is kept separate. Worth fixing
there too when you're ready.

### 2. First lighting/materials pass (toward the dark-purple/warm-amber night look)
All changes in `src/js/scene.js`, aimed at the "cool dark environment, warm
safe pockets of light" target from the context doc:

| Light | Before | After | Why |
|---|---|---|---|
| `HemisphereLight` | intensity 0.75 | intensity 0.55, ground tone deepened | less flat ambient wash |
| `AmbientLight` | `0xffffff` @ 0.32 (neutral white) | `0x3a3550` @ 0.22 (cool purple tint) | removes the neutral-white flattening |
| `warm` (key light, shadow-caster) | `0xffe4c2` @ 1.45 | `0xffd9a8` @ 1.1 | was acting like flat daylight; now a dimmer, warmer key |
| `cool` fill | `0x9f8dff` @ 0.7 | @ 0.55 | minor reduction since ambient now carries more cool tone |
| `topFill` | `0xffffff` @ 0.32 (neutral) | `0x6a7bb0` @ 0.18 (cool indigo) | was redundant with ambient, flattening the room |
| `roomLight` (invisible overhead fill) | @ 1.0, radius 16 | @ 0.55, radius 10 | was too broad/neutral, undermining "pockets of warmth" |
| `winLight` (window moonlight) | slightly reduced | — | keeps outside read as cool without overpowering interior warmth |
| desk lamp `glow` | — | small intensity bump | strengthens its "warm pocket" contrast now that ambient is dimmer |

Materials: floor roughness raised (~0.7→0.8) and furniture wood roughness
raised (~0.7→0.78, 0.65→0.72) so wood reads as matte/warm rather than
slightly glossy/plasticky under point lights. The laptop screen — previously
a flat inert `0x0c0c10` rectangle, the only screen in the room with no glow
or animation — now has a subtle emissive tint so it reads as "on."

**Not changed:** camera position/angle, furniture layout/positions, wall
colors (`M.wall`/`M.wallB` were already correctly muted indigo/charcoal).
Composition and furniture-arrangement work (context doc Phases 2–3, 6–8)
still needs to happen with actual rendered verification — see "Known gaps"
below.

### 3. Project restructure (`src/` + `builds/` layout)
Moved the flat `index.html` / `css/` / `js/` / `assets/` layout into
`src/`, created the `builds/{web,windows,android,ios}` skeleton,
`tools/`, `docs/`, and `ASSET_LICENSES/`. Sorted the 6 audio files into
`src/assets/audio/music/` (they're all part of one shared "Music" list in
code — not split into music/ambience, since the code doesn't actually
separate them that way). Updated the two path references that pointed at
the old `assets/audio/` location (`src/js/audio.js`'s track list and
`src/js/ui.js`'s menu-background-music reference). Verified afterward with
a local server: page loads, all 5 JS files and both CSS files return `200
OK`, no console errors, main menu renders.

**Not yet done:** splitting `scene.js` (2,350+ lines — renderer/camera
setup, materials, furniture geometry, and the entire Edit Mode/customization
system all in one file) into smaller focused files. Recommended as a
separate follow-up pass rather than bundling it into this same restructure,
since it's a higher-risk mechanical refactor better verified on its own.

### 4. Verified, not changed
Read through `interactions.js` and `main.js` against the project's
frame-rate-independence and interaction-correctness requirements:
- Movement is already properly delta-time based: `dt =
  Math.min(clock.getDelta(), 0.05)` (clamped, so no teleport after a tab
  switch), and `step = SPEED*dt`. No fix needed.
- The bed/sleep (`F`) and notebook (`E`) interactions already use real,
  carefully computed points (`INTERACTS` array in `interactions.js`) tied
  to actual furniture dimensions — e.g. `lieY:0.905` has an inline comment
  deriving that value from the duvet's exact box geometry. Nothing invented,
  nothing to fix.

---

## Known gaps / what's next

- **No rendered visual verification yet.** All lighting/material reasoning
  above was done by reading the code (colors, intensities, material
  roughness values) — nobody has actually looked at a rendered screenshot
  of the current state. That's the next thing to do before going further
  into composition/detail-pass work.
- **`scene.js` is still one large file.** Splitting it (setup/camera →
  materials → furniture → Edit Mode) is planned but not done.
- **Camera composition, room architecture, detail pass, character visual
  integration** (context doc Phases 2, 3, 6, 7, 8) haven't started — they
  need rendered verification to do responsibly.
- **`ASSET_LICENSES/README.md`** has the 6 current audio tracks logged with
  their credited artist names, but actual license terms are still `TBD` —
  needs to be tracked down before any commercial release.
- **The `saveSlot` bug fix hasn't been applied to the real game (`dev/`)**
  — flagged above, needs an explicit decision to touch `dev/`.
