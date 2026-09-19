/* ============================================================
   PIANO — a real playable instrument inside the room.

   Two halves:
     1. FURNITURE — a procedural upright piano + bench, built the same
        way every other object in scene.js is (box() helper, shared
        materials), placed against the right wall (unused until now)
        and registered into the existing INTERACTS array so it behaves
        exactly like the notebook: walk close, press E, room freezes,
        full-screen instrument opens.
     2. THE INSTRUMENT — a full-screen overlay reusing the notebook's
        exact freeze/show pattern, playable by mouse/touch/keyboard,
        with its own small self-contained AudioContext (the same
        pattern the notebook already uses for its page-flip sound —
        AmbientSound's context is private to its own closure, so a
        dedicated context here is the established convention, not a
        competing system).

   SOUND: no real piano samples exist in this project yet, and none
   are downloaded here — see playNote() below for exactly what a real
   sample set would replace, and README.md / ASSET_LICENSES for what's
   needed. Until then, notes are synthesized: a few detuned/harmonic
   oscillators through a struck-string-shaped envelope, which reads as
   noticeably warmer than a single bare sine/triangle wave, but this is
   explicitly a placeholder, not the final sound.
   ============================================================ */

// ============================================================
//  FURNITURE — upright piano against the right wall
// ============================================================
var PIANOX = HALF_X - 0.30;   // ~5.2 — cabinet depth centred so its back sits at the wall
var PIANOZ = -1.4;            // back-right area: clear of desk/TV (back wall), couch, bed, window

(function buildPiano(){
  var body   = mat(0x241b16, 0.55);          // near-black satin wood — a real upright's finish
  var trim   = mat(0x3a2c20, 0.5);
  var keyW   = mat(0xf1ece2, 0.35);          // ivory key-bed strip
  var keyB   = mat(0x14120f, 0.4);           // black key accents (decorative, not literal 88 keys)
  var brass  = mat(0x9a7a3c, 0.35, 0.6);

  // main cabinet (this is the one collider — everything else is decorative, non-colliding)
  box(PIANOX, 0.55, PIANOZ, 0.55, 1.05, 1.35, body, true);
  // top lid, slightly overhanging
  box(PIANOX, 1.085, PIANOZ, 0.62, 0.06, 1.42, trim, false);
  // plinth/base, slightly recessed
  box(PIANOX + 0.02, 0.05, PIANOZ, 0.5, 0.09, 1.28, trim, false);

  // keybed shelf, protruding toward the room (-X)
  var KBX = PIANOX - 0.275 - 0.13;   // front face of cabinet, minus half the shelf depth
  box(KBX, 0.60, PIANOZ, 0.26, 0.07, 1.22, trim, false);
  // ivory key-well strip on top of the shelf
  box(KBX, 0.635, PIANOZ, 0.20, 0.02, 1.14, keyW, false);
  // a row of thin black-key accents along the strip (decorative, evenly spaced)
  var nBlack = 9;
  for(var i=0;i<nBlack;i++){
    var t = (i + 0.5) / nBlack - 0.5;
    box(KBX + 0.03, 0.65, PIANOZ + t*1.08, 0.10, 0.012, 0.05, keyB, false);
  }
  // fallboard lip (the bit that folds down over the keys when closed — reads as a piano at a glance)
  box(KBX - 0.09, 0.70, PIANOZ, 0.05, 0.14, 1.2, body, false);

  // music stand — a thin angled panel, tilted back against the body
  var standGeo = new THREE.BoxGeometry(0.03, 0.34, 1.0);
  var stand = new THREE.Mesh(standGeo, trim);
  stand.position.set(PIANOX - 0.22, 0.98, PIANOZ);
  stand.rotation.z = 0.42;
  stand.castShadow = true;
  furniture.add(stand);
  // a couple of "sheet music" leaves — pale thin cards leaning on the stand
  var sheetMat = mat(0xece4d2, 0.85);
  [-0.18, 0.14].forEach(function(sz){
    var sheet = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.22, 0.16), sheetMat);
    sheet.position.set(PIANOX - 0.235, 1.05, PIANOZ + sz);
    sheet.rotation.z = 0.42;
    furniture.add(sheet);
  });

  // brass pedals at the base
  [-0.16, 0, 0.16].forEach(function(pz){
    var ped = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.05), brass);
    ped.position.set(KBX - 0.02, 0.045, PIANOZ + pz);
    ped.castShadow = true;
    furniture.add(ped);
  });

  // bench (a real, separate seat — matches the room's "designed furniture" language)
  var BENCHX = KBX - 0.62;
  var benchMat = mat(0x2f2419, 0.6);
  var cushionMat = mat(0x5c3b32, 0.85);
  box(BENCHX, 0.40, PIANOZ, 0.36, 0.05, 0.85, benchMat, false);       // seat
  box(BENCHX, 0.425, PIANOZ, 0.34, 0.03, 0.80, cushionMat, false);    // thin cushion top
  [[-0.14,-0.36],[-0.14,0.36],[0.14,-0.36],[0.14,0.36]].forEach(function(p){
    box(BENCHX + p[0], 0.20, PIANOZ + p[1], 0.045, 0.40, 0.045, benchMat, false);
  });

  // a single warm, non-shadow-casting accent light — a small pool of warmth to match the
  // desk lamp / side-table lamp treatment elsewhere, without adding another shadow-caster
  // (only 2 shadow-casting lights exist in the scene; this stays a cheap accent, not a third).
  var pianoGlow = new THREE.PointLight(0xffcf9a, 0.55, 4.5, 2);
  pianoGlow.position.set(PIANOX - 0.4, 1.5, PIANOZ);
  furniture.add(pianoGlow);
})();

// register the interaction — same shape as the notebook/bed entries in interactions.js,
// pushed in rather than editing that file directly so this feature stays self-contained.
INTERACTS.push({
  id:'piano', key:'E', label:'play piano', prio:0,
  at:new THREE.Vector3(PIANOX - 0.5, 1.0, PIANOZ), reach:2.3,
  stand:new THREE.Vector3(PIANOX - 1.15, 0, PIANOZ),
  run:function(){ Piano.open(); }
});

// ============================================================
//  THE INSTRUMENT — full-screen overlay + sound engine
// ============================================================
var Piano = (function(){

  // ---- one octave, keyboard-mapped (matches common web-piano convention:
  //      home row = white keys, row above = black keys) ----
  // semitone offsets from C of the current octave
  var LAYOUT = [
    { key:'a', semi:0,  black:false, label:'C' },
    { key:'w', semi:1,  black:true  },
    { key:'s', semi:2,  black:false, label:'D' },
    { key:'e', semi:3,  black:true  },
    { key:'d', semi:4,  black:false, label:'E' },
    { key:'f', semi:5,  black:false, label:'F' },
    { key:'t', semi:6,  black:true  },
    { key:'g', semi:7,  black:false, label:'G' },
    { key:'y', semi:8,  black:true  },
    { key:'h', semi:9,  black:false, label:'A' },
    { key:'u', semi:10, black:true  },
    { key:'j', semi:11, black:false, label:'B' },
    { key:'k', semi:12, black:false, label:'C' }
  ];

  var octave = 4;              // C4 = middle C; +/- buttons move this
  var volume = 0.7;
  var muted = false;
  var intensity = 'normal';    // 'soft' | 'normal' | 'strong' — see INTENSITY_GAIN
  var INTENSITY_GAIN = { soft:0.55, normal:0.85, strong:1.15 };

  var isOpen = false;
  var activeNotes = {};        // key/pointerId -> { osc[], gain, stop() }  currently sounding

  // ---- self-contained AudioContext, same lazy-on-gesture pattern as the notebook's ----
  var pac = null, pMaster = null;
  function ctx(){
    if(pac) return pac;
    try{ pac = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e){ pac = null; return null; }
    pMaster = pac.createGain();
    pMaster.gain.value = muted ? 0 : volume;
    pMaster.connect(pac.destination);
    return pac;
  }

  function midiFreq(semi){
    // octave 4's C = MIDI 60 (middle C); each LAYOUT entry is `semi` semitones above that octave's C
    var midi = 12 * (octave - 4) + 60 + semi;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /* ---------------------------------------------------------------
     playNote(id, semi) — THIS is the function a real sample set would
     replace. Today it synthesizes; a real version would instead do
     something like:
       var buf = pianoSamples[nearestSampledNote(semi)];
       var src = pac.createBufferSource(); src.buffer = buf;
       src.playbackRate.value = pitchRatio(semi, nearestSampledNote(semi));
       src.connect(gainNode); src.start();
     See README.md for exactly which sample files are needed and where
     they'd go (src/assets/audio/piano/).
     --------------------------------------------------------------- */
  function playNote(id, semi){
    var ac = ctx(); if(!ac) return;
    if(ac.state === 'suspended') ac.resume();
    stopNote(id, true);   // retrigger cleanly if already sounding

    var freq = midiFreq(semi);
    var g = ac.createGain();
    g.gain.value = 0;
    g.connect(pMaster);

    // a small stack of detuned/harmonic partials, struck-string envelope —
    // reads as noticeably less "toy keyboard" than one bare oscillator.
    var partials = [
      { ratio:1,    type:'triangle', level:0.55 },
      { ratio:2,    type:'sine',     level:0.18 },
      { ratio:3,    type:'sine',     level:0.07 },
      { ratio:1.003,type:'sine',     level:0.20 }  // gentle detune for a touch of body/chorus
    ];
    var oscs = partials.map(function(p){
      var o = ac.createOscillator();
      o.type = p.type;
      o.frequency.value = freq * p.ratio;
      var og = ac.createGain(); og.gain.value = p.level;
      o.connect(og); og.connect(g);
      o.start();
      return o;
    });

    var peak = INTENSITY_GAIN[intensity] * 0.5;
    var now = ac.currentTime;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.008);          // fast attack, like a hammer strike
    g.gain.exponentialRampToValueAtTime(Math.max(peak*0.25, 0.001), now + 0.5);  // decay
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);     // long tail

    activeNotes[id] = {
      oscs: oscs, gain: g,
      stop: function(fast){
        var t = ac.currentTime;
        g.gain.cancelScheduledValues(t);
        var cur = g.gain.value;
        g.gain.setValueAtTime(cur, t);
        g.gain.linearRampToValueAtTime(0.0001, t + (fast ? 0.02 : 0.12));
        oscs.forEach(function(o){ try{ o.stop(t + (fast ? 0.03 : 0.15)); }catch(e){} });
      }
    };
    highlightKey(semi, true);
    return freq;
  }
  function stopNote(id, fast){
    var n = activeNotes[id];
    if(!n) return;
    n.stop(fast);
    delete activeNotes[id];
  }

  // ---- visual key elements, built once when the overlay opens ----
  var keyboardEl = null;
  var keyEls = {};   // semi -> element
  function buildKeyboard(){
    keyboardEl.innerHTML = '';
    keyEls = {};
    var whiteCount = LAYOUT.filter(function(k){ return !k.black; }).length;
    var wi = 0;
    LAYOUT.forEach(function(k){
      if(k.black) return;
      var el = document.createElement('div');
      el.className = 'pn-key pn-white';
      el.style.left = (wi / whiteCount * 100) + '%';
      el.style.width = (100 / whiteCount) + '%';
      if(k.label) { var lb = document.createElement('span'); lb.className='pn-klabel'; lb.textContent = k.label; el.appendChild(lb); }
      var mapEl = document.createElement('span'); mapEl.className = 'pn-kmap'; mapEl.textContent = k.key.toUpperCase();
      el.appendChild(mapEl);
      keyboardEl.appendChild(el);
      keyEls[k.semi] = el;
      wireKeyPointer(el, k.semi);
      wi++;
    });
    wi = 0;
    var bi = 0;
    LAYOUT.forEach(function(k){
      if(!k.black) { wi++; return; }
      var el = document.createElement('div');
      el.className = 'pn-key pn-black';
      // centre each black key between the white key before/after it
      var center = (wi / whiteCount * 100);
      el.style.left = 'calc(' + center + '% - ' + (100/whiteCount*0.32) + '%)';
      el.style.width = (100/whiteCount*0.64) + '%';
      var mapEl = document.createElement('span'); mapEl.className = 'pn-kmap'; mapEl.textContent = k.key.toUpperCase();
      el.appendChild(mapEl);
      keyboardEl.appendChild(el);
      keyEls[k.semi] = el;
      wireKeyPointer(el, k.semi);
    });
  }
  function highlightKey(semi, on){
    var el = keyEls[semi];
    if(el) el.classList.toggle('pressed', !!on);
  }
  function wireKeyPointer(el, semi){
    el.addEventListener('pointerdown', function(e){
      e.preventDefault();
      playNote('ptr'+e.pointerId, semi);
      try{ el.setPointerCapture(e.pointerId); }catch(err){}
    });
    var release = function(e){ stopNote('ptr'+e.pointerId); highlightKey(semi, false); };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
  }

  // ---- computer-keyboard input (only live while the overlay is open) ----
  var heldKeys = {};
  function onKeyDown(e){
    if(!isOpen) return;
    var k = e.key.toLowerCase();
    if(k === 'escape'){ close(); return; }
    if(heldKeys[k]) return;   // ignore OS auto-repeat
    var entry = LAYOUT.filter(function(l){ return l.key === k; })[0];
    if(!entry) return;
    heldKeys[k] = true;
    playNote('kb'+k, entry.semi);
    e.preventDefault();
  }
  function onKeyUp(e){
    var k = e.key.toLowerCase();
    if(!heldKeys[k]) return;
    heldKeys[k] = false;
    var entry = LAYOUT.filter(function(l){ return l.key === k; })[0];
    if(entry){ stopNote('kb'+k); highlightKey(entry.semi, false); }
  }
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // ---- overlay chrome (octave / volume / intensity / mute / close) ----
  var pianoEl, octLblEl, volEl, muteBtn, intensityEls;
  function refreshChrome(){
    if(octLblEl) octLblEl.textContent = 'Octave ' + octave;
    if(volEl) volEl.value = Math.round(volume * 100);
    if(muteBtn) muteBtn.textContent = muted ? '🔇' : '🔊';
    if(intensityEls) intensityEls.forEach(function(b){ b.classList.toggle('active', b.dataset.i === intensity); });
    if(pMaster) pMaster.gain.value = muted ? 0 : volume;
  }
  function setOctave(o){
    octave = Math.max(1, Math.min(7, o));
    refreshChrome();
    if(activeSlot != null) saveSlot();
  }
  function setVolume(v){
    volume = Math.max(0, Math.min(1, v));
    if(pMaster) pMaster.gain.value = muted ? 0 : volume;
    refreshChrome();
    if(activeSlot != null) saveSlot();
  }

  function open(){
    if(isOpen) return;
    isOpen = true;
    ctx();                              // unlock/create audio on this user gesture
    document.body.classList.add('playingPiano');
    gameActive = false;                 // freeze the room — identical to the notebook
    if(!keyboardEl) grabDom();
    buildKeyboard();
    refreshChrome();
    pianoEl.classList.add('show');
  }
  function close(){
    if(!isOpen) return;
    isOpen = false;
    for(var id in activeNotes) stopNote(id, true);
    for(var k in heldKeys) heldKeys[k] = false;
    document.body.classList.remove('playingPiano');
    pianoEl.classList.remove('show');
    for(var kk in keys) keys[kk] = false;   // drop any movement keys held while playing
    if(activeSlot != null){ gameActive = true; saveSlot(); }
  }

  function grabDom(){
    pianoEl     = document.getElementById('piano');
    keyboardEl  = document.getElementById('pnKeyboard');
    octLblEl    = document.getElementById('pnOctLbl');
    volEl       = document.getElementById('pnVol');
    muteBtn     = document.getElementById('pnMute');
    intensityEls= Array.prototype.slice.call(document.querySelectorAll('#pnIntensity button'));

    document.getElementById('pnClose').addEventListener('click', close);
    document.getElementById('pnOctDown').addEventListener('click', function(){ setOctave(octave - 1); });
    document.getElementById('pnOctUp').addEventListener('click', function(){ setOctave(octave + 1); });
    volEl.addEventListener('input', function(){ setVolume(volEl.value / 100); });
    muteBtn.addEventListener('click', function(){ muted = !muted; refreshChrome(); if(activeSlot!=null) saveSlot(); });
    intensityEls.forEach(function(b){
      b.addEventListener('click', function(){ intensity = b.dataset.i; refreshChrome(); });
    });
  }

  // ---- per-slot persistence (same shape as AmbientSound.snapshot()/Music.snapshot()) ----
  function snapshot(){
    return { octave: octave, volume: volume, muted: muted };
  }
  function restore(s){
    if(!s) return;
    if(s.octave != null) octave = Math.max(1, Math.min(7, s.octave|0));
    if(s.volume != null) volume = Math.max(0, Math.min(1, s.volume));
    muted = !!s.muted;
    refreshChrome();
  }

  return { open:open, close:close, snapshot:snapshot, restore:restore };
})();
