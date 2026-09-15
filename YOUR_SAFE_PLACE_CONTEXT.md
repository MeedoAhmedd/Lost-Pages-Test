# YOUR SAFE PLACE --- MASTER PROJECT CONTEXT

> **READ THIS FILE COMPLETELY BEFORE CHANGING THE GAME.**
>
> This file is the source of truth for the creative direction, visual
> identity, gameplay philosophy, existing concepts, and future roadmap
> of **Your Safe Place**.
>
> **IMPORTANT:** This is an EXISTING game. Do **not** restart it,
> rebuild it from scratch, or replace working systems simply because
> another architecture would be cleaner. Inspect the real project first,
> understand what already exists, preserve working functionality, and
> refine it.

------------------------------------------------------------------------

# 1. THE GAME IN ONE SENTENCE

**Your Safe Place** is a quiet, cozy, nostalgic 3D room game where the
player lives inside a personal space, walks around, interacts with
meaningful objects, writes in a deeply personal notebook, listens to
music, plays piano, customizes their room and character, and slowly
makes the space feel like their own.

This is **not** a combat game, survival game, RPG, competitive game, or
generic room decorator.

The feeling matters as much as the mechanics.

The player should eventually look at the room and think:

> **"This feels like my place."**

------------------------------------------------------------------------

# 2. DO NOT START OVER

The project already exists and has working systems.

Before editing anything:

1.  Inspect the complete folder structure.
2.  Identify the existing HTML, CSS, JavaScript and Three.js
    architecture.
3.  Identify the scene, renderer, camera and lighting.
4.  Identify player movement and collision.
5.  Identify interaction logic.
6.  Identify the notebook.
7.  Identify the three independent save slots.
8.  Identify audio/music systems.
9.  Identify room customization/edit systems.
10. Identify existing UI/screens.
11. Run the game before making major changes.
12. Preserve working behavior while improving the presentation.

Do not invent systems that already exist.

Do not rename/restructure unrelated code merely for preference.

Make changes incrementally and test after meaningful changes.

------------------------------------------------------------------------

# 3. THE MOST IMPORTANT CHANGE NOW --- VISUAL OVERHAUL

The current priority is **NOT adding more features**.

The priority is transforming the existing room into the final visual
identity.

The game should be refined toward a **stylized, cozy, cinematic 3D
bedroom at night** with a strong fixed composition.

The target visual language is:

-   stylized 3D
-   soft, slightly low-poly/custom geometry
-   NOT voxel/Minecraft
-   NOT photorealistic
-   NOT raw Three.js primitives
-   dark purple / midnight-blue environment
-   warm amber/orange interior lighting
-   muted colors
-   soft shadows
-   subtle glow/bloom
-   gentle atmospheric depth
-   rounded/simple furniture silhouettes
-   strong composition
-   lots of small personal details
-   quiet nighttime atmosphere
-   nostalgic
-   intimate
-   slightly lonely, but comforting rather than depressing

The visual contrast should feel approximately like:

**cool dark room + warm safe pockets of light**

Think of a miniature bedroom/diorama that someone could stare at for a
long time.

The room must feel designed for the fixed camera, not like furniture was
randomly scattered inside a box.

------------------------------------------------------------------------

# 4. CAMERA --- NON-NEGOTIABLE

This game is **NOT first person**.

It is **NOT a normal third-person follow-camera game**.

The camera is a fixed elevated diagonal/cinematic room camera.

The player controls the **character**, not the camera.

During normal room gameplay:

-   camera does not follow the character
-   camera does not rotate when the character turns
-   camera does not zoom toward the character
-   camera does not orbit automatically
-   character walks independently inside the composition

The camera should show the room as a beautiful complete scene.

The player should be able to understand the bed, desk, lights, walls,
floor, character and important objects at a glance.

Because the camera is fixed, optimize furniture shapes, lighting and
composition specifically for this viewpoint.

Do not waste performance/detail on invisible areas if it does not
improve the game.

------------------------------------------------------------------------

# 5. ROOM ART DIRECTION

The **room is the visual heart of the game**.

Do not make it feel like a generic game level.

It should feel lived in.

Important qualities:

-   believable bedroom proportions
-   visually interesting silhouette
-   warm bed area
-   desk/computer area
-   shelves/storage
-   lamps
-   windows
-   rugs
-   pillows/blankets
-   books
-   plants
-   cups
-   headphones
-   controllers
-   posters/photos/art
-   small clutter
-   personal objects
-   subtle asymmetry
-   objects placed with intention

Do not fill the room with random detail simply to make it "busy."

Every object should support personality, warmth, memory or comfort.

Furniture should have recognizable custom shapes. Simple geometry is
fine, but a chair should look designed as a chair, a bed should have
softness/volume, blankets should not just be flat rectangles, etc.

The final scene should look good enough that a screenshot of the room
alone communicates the identity of **Your Safe Place**.

------------------------------------------------------------------------

# 6. LIGHTING

Lighting is one of the biggest priorities of the overhaul.

Target:

-   dark cool ambient environment
-   warm lamps
-   warm desk/bed pools of light
-   subtle screen glow
-   soft believable shadows
-   restrained bloom
-   subtle ambient occlusion if practical
-   gentle vignette/color grading if practical
-   no blown-out lights
-   no completely black unreadable areas

Possible future moods:

-   Day
-   Sunset
-   Night
-   Rainy night

But do not build a complicated time system until the main nighttime
visual identity is polished.

Night should be the signature look.

------------------------------------------------------------------------

# 7. COLOR LANGUAGE

Primary environment: - deep purple - muted indigo - midnight blue -
charcoal - near-black purple

Warm accents: - amber - muted orange - candle/lamp yellow - warm cream -
soft wood brown

Avoid: - oversaturated neon - pure white everywhere - aggressive RGB
gamer lighting - bright generic mobile-game colors

UI should inherit this palette.

------------------------------------------------------------------------

# 8. CHARACTER

There is a visible 3D character inside the room.

The character is secondary to the room but important because it makes
the space feel inhabited.

Requirements:

-   readable stylized silhouette
-   fits the room's art style
-   proper collision
-   smooth movement
-   turns with movement
-   does not visually dominate the room
-   PC movement via existing controls/WASD
-   mobile joystick support where already planned/implemented

Future character customization:

Free/basic: - 3 boy appearances - 3 girl appearances

Possible expanded customization: - shirt - pants - clothing colors -
hair - hair color - skin tone - shoes - simple accessories

Do not turn this into a giant avatar creator.

Customization exists to make the character feel personal.

Inspect the real character mesh/material structure before implementing
skins.

------------------------------------------------------------------------

# 9. THREE SAVE SLOTS --- IMPORTANT TERMINOLOGY

The game has **3 independent SAVE SLOTS**.

They are not "lives" in a mortality/gameplay sense.

Each slot represents an independent room/save.

Never break or merge them.

Any persistent personalization should belong to the correct slot where
appropriate.

Examples:

-   room customization
-   notebook progress/answers
-   character customization
-   piano settings
-   saved melodies
-   other personal state

Never allow data from Slot 1 to overwrite Slot 2 or Slot 3.

------------------------------------------------------------------------

# 10. NOTEBOOK --- EMOTIONAL HEART

The notebook is one of the most important features.

When the player approaches the book and presses **Read**, gameplay
freezes and the notebook opens as its own full-screen experience.

The notebook should visually belong to the same world as the room.

Closed cover: - near-black / dark purple - elegant - worn/personal -
title handwritten: **Your Safe Place** - small subtitle: **a
notebook** - subtle line-art flourishes - "open the notebook" -
mysterious, nostalgic, private

Inside pages: - aged warm cream/ivory - slightly yellowed - subtle paper
grain - faint ruled lines - faded red margin - imperfect old-paper
marks - dark brown handwritten owner's text - blue handwritten player
answers - fonts such as Caveat/Kalam or an equivalent readable
handwritten style

The notebook contains about **36 pages**.

Emotional progression:

1--6: beginning / mystery / nostalgia\
7--13: childhood / memories\
14--19: people / loss\
20--25: self / growing up / loneliness\
26--30: things left unsaid / regret / deeper reflection\
31--36: notebook hands the story to the player

Questions should feel like things someone asks themselves alone late at
night, not a therapy worksheet.

Examples:

-   What is the first place you remember feeling completely safe?
-   What do you miss about being younger?
-   Who do you miss even though you know you cannot have them back?
-   Is there someone you wish you could talk to one more time?
-   When did you stop feeling like a kid?
-   What part of yourself do you rarely show anyone?
-   Are you actually happy, or have you just gotten good at saying
    you're okay?
-   What do you pretend doesn't hurt anymore?
-   What are you still blaming yourself for?
-   What conversation do you keep replaying in your head?
-   How many moments have you already lived for the last time without
    knowing it?
-   If your life stayed exactly the way it is right now, would you be
    okay with that?

The notebook gradually changes from someone else's fragments into the
player's story.

Page 31: **"I've told you enough about mine."**

Page 32: **"Now I want to hear yours."**

Later prompts include:

**"Start anywhere."**

**"Tell me about a moment you never want to forget."**

**"Tell me about the person you were, the person you became, and the
person you're still becoming."**

Final page:

**"Your story doesn't have to end here."**

Small footer:

**"keep writing."**

The notebook is the emotional heart.

The room is the physical heart.

------------------------------------------------------------------------

# 11. PIANO / MUSIC CORNER --- MAJOR FUTURE FEATURE

The piano should eventually be a real meaningful interaction, not an
object that plays one sound.

When the player interacts with the piano:

-   freeze room gameplay
-   open a dedicated full-screen piano screen
-   retain the same dark/warm nostalgic theme
-   allow return to the room exactly where the player was

Playable piano:

-   real visible white/black keys
-   mouse
-   touch
-   computer keyboard
-   octave controls
-   volume
-   visual pressed-key feedback
-   musical intensity/velocity control where practical
-   warm believable piano sound
-   use properly licensed/original samples for release

The piano should eventually support recording **note events**, not
microphone recording.

Suggested saved event format concept:

`note + start time + duration + velocity`

Players should eventually be able to:

-   record
-   stop
-   replay
-   pause
-   rename melodies
-   delete melodies
-   save multiple melodies
-   return later and hear what they created
-   keep melodies separated per save slot

Think of it as a **musical diary**.

------------------------------------------------------------------------

# 12. PIANO LEARN MODE

Future piano Learn Mode should help players learn simple melodies.

This is NOT supposed to become an aggressive rhythm game.

Possible behavior:

-   next key softly lights
-   note approaches/highlights
-   player presses correct key
-   game gently advances
-   optional slow mode
-   repeat/loop difficult sections
-   practice mode
-   simple difficulty categories

Do NOT use: - combo counters - stressful timers - "MISS!" - aggressive
scoring - flashy rhythm-game UI

The emotional language should be:

> **Take your time.**

Built-in melodies should be original, public-domain where appropriate,
or properly licensed for commercial game use.

------------------------------------------------------------------------

# 13. MUSIC CREATION

Future idea: allow players to create their own melodies.

Possible interfaces: - simple piano-roll - simple step sequencer -
simplified staff/timeline

Prioritize accessibility over professional DAW complexity.

This game is not Ableton/FL Studio.

The goal is expression.

A player should be able to create something small, name it, save it, and
associate a memory with it.

------------------------------------------------------------------------

# 14. PERSONAL MUSIC PLAYER

Future optional feature:

Allow players to listen to their own local audio inside their room.

Possible functionality:

-   choose local MP3/audio file
-   play
-   pause
-   previous/next
-   volume
-   playlist
-   potentially IndexedDB/local persistence depending on platform
    limitations

Do NOT assume Spotify/YouTube copyrighted streaming integration.

Do not download or redistribute copyrighted music.

The safest concept is user-selected local music files that they already
possess, subject to platform limitations.

------------------------------------------------------------------------

# 15. AUDIO ATMOSPHERE

The room should have subtle optional ambience:

-   rain against window
-   night ambience
-   soft wind
-   distant city
-   birds for daytime
-   room tone
-   computer hum
-   clock
-   page turns
-   writing sounds
-   footsteps
-   furniture interaction

Music direction:

-   soft piano
-   nostalgic piano
-   music box
-   sparse emotional ambient
-   lullaby-like original music
-   silence should also feel intentional

Do not constantly drown the room in music.

Sometimes quiet room ambience is stronger.

All release assets must have commercial-use rights documented.

------------------------------------------------------------------------

# 16. ASSET LICENSING

Never silently download random assets and ship them.

Track licenses for:

-   music
-   sound effects
-   fonts
-   textures
-   3D models
-   icons
-   other third-party assets

Recommended project folder:

`ASSET_LICENSES/`

Record:

-   asset name
-   creator
-   source
-   license
-   commercial-use permission
-   attribution requirement
-   download date
-   original source page/receipt where applicable

"Royalty free" alone is not sufficient proof of unrestricted commercial
game use.

------------------------------------------------------------------------

# 17. UI / SCREEN LANGUAGE

All screens should feel like the same game.

Existing/future screens include:

1.  main menu/save slots
2.  room
3.  notebook
4.  piano
5.  customization
6.  music player
7.  settings

UI qualities:

-   dark translucent surfaces
-   subtle warm highlights
-   handwritten accents where appropriate
-   clean readable body text
-   rounded panels
-   gentle transitions
-   minimal clutter
-   quiet animation
-   no generic Bootstrap look
-   no shooter HUD
-   no aggressive neon

The room should remain visually dominant whenever gameplay is active.

------------------------------------------------------------------------

# 18. MOBILE + DESKTOP

The game is intended to eventually work on:

-   web
-   mobile
-   Steam/desktop

Current development/testing comes first. Do not rush distribution.

Desktop: - WASD/keyboard - mouse - keyboard piano controls

Mobile: - landscape - virtual joystick - touch-friendly interactions -
touch piano - large enough controls - responsive overlays

Do not design a feature that fundamentally cannot translate to mobile
without discussing it first.

------------------------------------------------------------------------

# 19. FUTURE RELEASE DIRECTION --- NOT CURRENT PRIORITY

Possible progression:

web/itch.io testing → mobile → Steam

Do not rush release.

Do not decide final pricing while the game is still taking shape.

The current job is to make the game GOOD.

------------------------------------------------------------------------

# 20. MONETIZATION PHILOSOPHY --- FUTURE ONLY

No ads.

No energy timers.

No fake waiting systems.

No predatory currency.

No deliberately frustrating free experience.

If optional paid content is eventually added, players should pay because
they genuinely want more ways to personalize their safe place.

Potential future concepts:

**Free core** - room - movement - notebook - save slots - core
interactions - basic customization - core ambience/music

**Possible Music Corner expansion** - advanced piano features - melody
recording/library - Learn Mode - additional melodies - personal music
tools - extra ambience

**Possible room packs** - furniture - wallpaper - lighting -
decorations - themes

**Possible character customization expansion** - deeper
clothing/color/accessory options

None of this is final pricing or a commitment.

Do not build monetization before the actual feature quality exists.

------------------------------------------------------------------------

# 21. PERFORMANCE

This is an interactive 3D web project.

Keep it efficient.

-   avoid huge numbers of draw calls
-   reuse materials/geometries where sensible
-   use instancing where useful
-   do not create expensive objects every frame
-   keep collision simple where possible
-   limit post-processing to effects that materially improve the look
-   cap pixel ratio reasonably
-   test mobile performance
-   avoid turning decorative clutter into thousands of independent
    expensive meshes

Visual quality matters, but the game must remain playable.

------------------------------------------------------------------------

# 22. WHAT MUST NEVER BE LOST

While improving the project, preserve these pillars:

### Pillar 1 --- THE ROOM

The physical safe place.

### Pillar 2 --- THE FIXED CAMERA

The room is observed as a composed little world.

### Pillar 3 --- THE CHARACTER

Someone actually lives there.

### Pillar 4 --- THE NOTEBOOK

Memory, sadness, honesty and self-expression.

### Pillar 5 --- MUSIC

Atmosphere and eventually creative expression.

### Pillar 6 --- PERSONALIZATION

The room and character gradually feel like the player's own.

### Pillar 7 --- QUIET

The game does not need constant objectives to justify existing.

------------------------------------------------------------------------

# 23. EMOTIONAL TARGET

The game should feel:

-   safe
-   warm
-   nostalgic
-   quiet
-   personal
-   reflective
-   intimate
-   gently sad
-   comforting
-   lonely in a peaceful way
-   expressive
-   human

It should NOT feel:

-   horrifying
-   hopeless
-   clinically therapeutic
-   competitive
-   stressful
-   loud
-   childish
-   corporate
-   predatory
-   generic

The sadness should create reflection and connection, not misery.

------------------------------------------------------------------------

# 24. CURRENT DEVELOPMENT PRIORITY

**STOP expanding the feature list temporarily.**

Before piling on piano lessons, skins, monetization, MP3 systems, etc.,
refine the visual foundation.

Recommended immediate order:

## Phase A --- Inspect

Run and understand the current project. Document what already works.

## Phase B --- Camera composition

Refine the fixed camera so the room reads beautifully.

## Phase C --- Room geometry

Improve architecture, proportions and furniture silhouettes.

## Phase D --- Materials

Replace the raw/basic look with a consistent stylized material language.

## Phase E --- Lighting

Build the dark-purple + warm-amber signature nighttime look.

## Phase F --- Atmosphere

Shadows, restrained bloom, ambient occlusion/color grading/vignette
where appropriate.

## Phase G --- Detail pass

Books, pillows, plants, desk objects, cables, decorations, personal
clutter.

## Phase H --- Character integration

Make the character visually belong in the redesigned room.

## Phase I --- UI consistency

Make existing UI/notebook fit the same art direction.

Only after the room feels like **Your Safe Place** should major new
feature work resume.

------------------------------------------------------------------------

# 25. RULES FOR CODEX / ANY CODING AGENT

Before every major task:

1.  Read this file.
2.  Inspect the real relevant source files.
3.  Run the current game/build if possible.
4.  Explain internally what existing systems the change touches.
5.  Preserve unrelated functionality.
6.  Reuse existing architecture where sensible.
7.  Implement the smallest coherent phase.
8.  Test it.
9.  Fix regressions.
10. Summarize files changed and behavior changed.

Never blindly rewrite the whole project.

Never delete a working system because it seems easier to rebuild it.

Never change save data formats casually.

Never mix save slots.

Never add random dependencies without a reason.

Never silently introduce copyrighted/unlicensed assets.

Never turn the camera into a follow camera.

Never turn the visual style into voxel/Minecraft.

Never sacrifice the emotional identity for flashy features.

When unsure about a creative decision, prioritize:

**ROOM → ATMOSPHERE → PERSONAL CONNECTION → FUNCTIONALITY → EXTRA
FEATURES**

------------------------------------------------------------------------

# 26. VISUAL ACCEPTANCE TEST

The visual overhaul is successful when a screenshot of normal room
gameplay communicates most of the following without explanation:

-   a small personal world
-   nighttime
-   warm shelter inside darkness
-   stylized 3D
-   intentional fixed-camera composition
-   cozy bedroom
-   lived-in details
-   a person inhabiting it
-   softness
-   nostalgia
-   quiet

The player should want to stay in the room even when they are doing
nothing.

That is the target.

------------------------------------------------------------------------

# 27. FINAL CREATIVE RULE

**Your Safe Place is not about giving the player more things to do every
second.**

It is about giving them somewhere they want to be.

The room is where they live.

The notebook is where they remember.

The piano is where they express themselves.

The music is what they surround themselves with.

The character is who they choose to be.

The save slots preserve different rooms they create.

Every future feature should strengthen that idea.

If a feature makes the game busier but not more personal, question
whether it belongs.

------------------------------------------------------------------------

# 28. FIRST INSTRUCTION WHEN OPENING THIS PROJECT

If you are an AI coding agent opening this repository for the first
time:

**DO NOT START CODING IMMEDIATELY.**

First inspect the existing game and compare its current presentation
against the art direction in this file.

Then propose/execute the visual refinement incrementally, preserving the
existing game.

The immediate goal is **not to remake Your Safe Place**.

The immediate goal is to make the game that already exists finally
**LOOK and FEEL like Your Safe Place**.
