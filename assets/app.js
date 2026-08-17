"use strict";

/* =========================================================================
   3. SAFETY CUES
   ========================================================================= */
const KNEE_CUES = [
  "Knee tracks naturally over the toes",
  "Keep the whole foot stable and planted",
  "Use a comfortable, pain-free range of motion",
  "Control the lowering phase — no dropping",
  "Never push through sharp pain"
];
const POSTURE_CUES = {
  hinge:["Brace before the first rep","Ribs down, neutral lower back","Move through the hips, not the spine","Keep the bar or dumbbells close to the body"],
  bridge:["Ribs down — avoid excessive lumbar extension","Squeeze the glutes at the top","Chin lightly tucked, eyes forward","Drive through the heels"],
  overhead:["Ribs down, glutes tight","Brace before you press","Avoid leaning back to finish the rep","Keep the bar path vertical"],
  squat:["Brace before you descend","Neutral spine throughout","Whole foot planted, mid-foot pressure","Stand up through the hips and legs together"]
};

/* =========================================================================
   4. CONSTANTS AND STATE
   ========================================================================= */
const APP = "lift-log-v2";
const PROFILE_KEY = APP + ":active-profile";
const INDEX_KEY = APP + ":profiles";
const SETTINGS_KEY = APP + ":settings";
const MAIN_LENGTH = 45 * 60;      // 45:00 — main workout only
const TRANSITION_SECONDS = 5;
const SESSION_VERSION = 4;
const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri"];
const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

let activeUser = "";
let profile = null;
let week = "A";
let day = 0;
let calendarDate = new Date();
let weekendPreview = false;
let ticker = null;
let lastTs = 0;
let lastSave = 0;
let currentTab = "workout";

const $ = id => document.getElementById(id);

/* =========================================================================
   5. SETTINGS
   ========================================================================= */
const DEFAULT_SETTINGS = {sound:true, volume:0.7, voice:true, vibration:true, confirmSkip:true};
let settings = Object.assign({}, DEFAULT_SETTINGS);

function loadSettings(){
  try{
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if(raw && typeof raw === "object") settings = Object.assign({}, DEFAULT_SETTINGS, raw);
  }catch(e){ settings = Object.assign({}, DEFAULT_SETTINGS); }
  settings.volume = Math.min(1, Math.max(0, Number(settings.volume)));
  if(!isFinite(settings.volume)) settings.volume = DEFAULT_SETTINGS.volume;
}
function persistSettings(){
  try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }catch(e){}
}
function syncSettingsUI(){
  $("setSound").checked = !!settings.sound;
  $("setVoice").checked = !!settings.voice;
  $("setVibration").checked = !!settings.vibration;
  $("setConfirm").checked = !!settings.confirmSkip;
  $("setVolume").value = Math.round(settings.volume * 100);
  $("volLabel").textContent = Math.round(settings.volume * 100) + "%";
}
function updateSetting(key, value){
  settings[key] = value;
  persistSettings();
  if(key === "sound" && value) Sound.play("blip");
}
function updateVolume(value){
  settings.volume = Math.min(1, Math.max(0, Number(value) / 100));
  $("volLabel").textContent = Math.round(settings.volume * 100) + "%";
  persistSettings();
}
function openSettings(){ syncSettingsUI(); $("settingsModal").classList.remove("hidden"); }
function closeSettings(){ $("settingsModal").classList.add("hidden"); }
function testSound(){ Sound.unlock(); Sound.play("restEnd"); vibrate([40]); }

/* =========================================================================
   6. SOUND (Web Audio API — no audio files, no dependencies)
   ========================================================================= */
const Sound = (function(){
  let ctx = null;
  // pattern: [frequency, startOffset, duration, waveform, gainMultiplier]
  const PATTERNS = {
    blip:          [[880,0,.09,"sine",.7]],
    warmupStart:   [[523.25,0,.18,"triangle",1],[659.25,.16,.26,"triangle",1]],
    movementChange:[[698.46,0,.13,"sine",.8]],
    warmupEnd:     [[523.25,0,.14,"triangle",1],[659.25,.13,.14,"triangle",1],[784,.26,.34,"triangle",1]],
    mainStart:     [[392,0,.16,"triangle",1],[523.25,.15,.16,"triangle",1],[784,.3,.45,"triangle",1.1]],
    restStart:     [[440,0,.16,"sine",.9],[329.63,.15,.28,"sine",.9]],
    restWarn:      [[880,0,.08,"square",.45],[880,.17,.08,"square",.45],[880,.34,.11,"square",.5]],
    restEnd:       [[784,0,.14,"triangle",1],[1046.5,.13,.3,"triangle",1]],
    exerciseStart: [[659.25,0,.13,"triangle",.9],[880,.12,.24,"triangle",.9]],
    setDone:       [[987.77,0,.11,"sine",.8]],
    fiveMinLeft:   [[349.23,0,.24,"triangle",1],[261.63,.26,.42,"triangle",1]],
    mainEnd:       [[784,0,.16,"triangle",1],[659.25,.16,.16,"triangle",1],[523.25,.32,.46,"triangle",1]],
    finisherStart: [[493.88,0,.16,"triangle",.9],[659.25,.15,.3,"triangle",.9]],
    finisherEnd:   [[659.25,0,.16,"sine",.9],[523.25,.15,.32,"sine",.9]],
    cooldownStart: [[440,0,.3,"sine",.85],[329.63,.26,.46,"sine",.85]],
    cooldownEnd:   [[523.25,0,.22,"sine",.9],[440,.2,.34,"sine",.9]],
    complete:      [[523.25,0,.15,"triangle",1],[659.25,.14,.15,"triangle",1],[784,.28,.15,"triangle",1],[1046.5,.42,.6,"triangle",1.15]]
  };
  const VIBRATIONS = {
    warmupStart:[60], movementChange:[25], warmupEnd:[60,60,60],
    mainStart:[80,60,120], restStart:[40], restWarn:[30,60,30], restEnd:[60,50,60],
    exerciseStart:[50,40,50], setDone:[25], fiveMinLeft:[100,80,100],
    mainEnd:[120,80,120], finisherStart:[50], finisherEnd:[50,50], cooldownStart:[50], cooldownEnd:[50,50,50], complete:[80,60,80,60,180]
  };

  function ensure(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    if(!ctx){
      try{ ctx = new AC(); }catch(e){ return null; }
    }
    if(ctx.state === "suspended"){ try{ ctx.resume(); }catch(e){} }
    return ctx;
  }
  function note(c, freq, at, dur, type, mul){
    const osc = c.createOscillator(), gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, at);
    const peak = Math.max(0.0001, 0.2 * settings.volume * (mul || 1));
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(at); osc.stop(at + dur + 0.06);
  }
  return {
    unlock(){ ensure(); },
    play(name){
      vibrate(VIBRATIONS[name]);
      if(!settings.sound || settings.volume <= 0) return;
      const pattern = PATTERNS[name];
      if(!pattern) return;
      const c = ensure();
      if(!c) return;
      try{
        const t0 = c.currentTime + 0.02;
        for(let i = 0; i < pattern.length; i++){
          const p = pattern[i];
          note(c, p[0], t0 + p[1], p[2], p[3], p[4]);
        }
      }catch(e){}
    }
  };
})();

function vibrate(pattern){
  if(!settings.vibration || !pattern) return;
  try{ if(navigator.vibrate) navigator.vibrate(pattern); }catch(e){}
}
function say(text){
  if(!settings.voice || !text) return;
  try{
    if("speechSynthesis" in window){
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.05;
      u.volume = Math.min(1, settings.volume + 0.2);
      window.speechSynthesis.speak(u);
    }
  }catch(e){}
}

/* =========================================================================
   7. HELPERS
   ========================================================================= */
function dateKey(date){
  const d = date || new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function fmt(seconds){
  const n = Math.max(0, Math.ceil(Number(seconds) || 0));
  return String(Math.floor(n/60)).padStart(2,"0") + ":" + String(n%60).padStart(2,"0");
}
function fmtShort(seconds){
  const n = Math.max(0, Math.round(Number(seconds) || 0));
  return Math.floor(n/60) + ":" + String(n%60).padStart(2,"0");
}
function fmtApprox(seconds){
  const n = Math.max(0, Math.round(Number(seconds) || 0));
  const m = Math.floor(n/60), s = n%60;
  return s === 0 ? m + " min" : m + ":" + String(s).padStart(2,"0") + " min";
}
function repsCount(setsText){
  const m = String(setsText).match(/(\d+)\s*×/);
  return m ? Number(m[1]) : 2;
}
function parseRest(restText){
  const nums = (String(restText).match(/\d+(?:\.\d+)?/g) || [60]).map(Number);
  const max = Math.max.apply(null, nums);
  return Math.round(String(restText).indexOf("min") >= 0 ? max * 60 : max);
}
function sumSecs(items){ return items.reduce((total,item)=>total + item.secs, 0); }
function escapeHtml(text){
  return String(text == null ? "" : text)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function weekdayIndex(date){
  const n = (date || new Date()).getDay();
  return (n > 0 && n < 6) ? n - 1 : null;
}
function mondayOf(date){
  const result = new Date(date || new Date());
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  return result;
}
function safeDay(value){ const n = Number(value); return (n >= 0 && n <= 4) ? n : 0; }
function safeWeek(value){ return (value === "A" || value === "B" || value === "C") ? value : "A"; }

/* =========================================================================
   8. PROFILE + PERSISTENCE
   ========================================================================= */
function userKey(name){ return APP + ":profile:" + encodeURIComponent(name || activeUser); }
function getProfiles(){
  try{ return JSON.parse(localStorage.getItem(INDEX_KEY)) || []; }catch(e){ return []; }
}
function defaultProfile(name){ return {version:2, name:name, variation:"A", cycle:1, history:{}}; }
function loadProfile(name){
  try{
    const raw = JSON.parse(localStorage.getItem(userKey(name)));
    if(raw && typeof raw === "object"){
      if(!raw.history || typeof raw.history !== "object") raw.history = {};
      raw.variation = safeWeek(raw.variation);
      raw.cycle = Number(raw.cycle) || 1;
      return raw;
    }
  }catch(e){}
  return defaultProfile(name);
}
function save(){
  if(!profile) return;
  try{ localStorage.setItem(userKey(), JSON.stringify(profile)); }catch(e){}
  lastSave = Date.now();
}

function todayEntry(){
  if(!profile) return null;
  return profile.history[dateKey()] || null;
}
function session(){
  const entry = todayEntry();
  if(!entry || !entry.session || entry.session.v !== SESSION_VERSION) return null;
  return entry.session;
}
function exList(entry){
  const variation = safeWeek(entry.variation);
  const dayIndex = safeDay(entry.day);
  return W[variation][dayIndex].ex;
}
function warmupFor(entry){ return WARMUPS[safeDay(entry.day)]; }
function cooldownFor(entry){ return COOLDOWNS[safeDay(entry.day)]; }

function blankSession(){
  return {
    v:SESSION_VERSION, phase:"warmup", running:false,
    warmIndex:0, warmRemaining:0, warmElapsed:0,
    transitionRemaining:TRANSITION_SECONDS,
    mainRemaining:MAIN_LENGTH, mainElapsed:0, exercise:0,
    resting:false, restRemaining:0, restTotal:0, restWarned:false,
    pendingAdvance:false, restDone:false,
    warnedFiveMin:false, mainTimeUp:false,
    finIndex:0, finRemaining:0, finElapsed:0,
    coolIndex:0, coolRemaining:0, coolElapsed:0
  };
}

/* =========================================================================
   9. SCREEN WAKE LOCK — the phone must not sleep while a timer is running
   ========================================================================= */
let wakeLock = null;
function keepAwake(){
  if(wakeLock || !("wakeLock" in navigator)) return;
  try{
    navigator.wakeLock.request("screen").then(function(lock){
      wakeLock = lock;
      lock.addEventListener("release", function(){ wakeLock = null; });
    }).catch(function(){ wakeLock = null; });
  }catch(e){ wakeLock = null; }
}
function allowSleep(){
  if(!wakeLock) return;
  try{ wakeLock.release(); }catch(e){}
  wakeLock = null;
}
// The browser drops the lock whenever the page is hidden, so re-take it on return.
function syncWakeLock(){
  const s = session();
  if(s && s.running && !document.hidden) keepAwake();
  else allowSleep();
}

/* =========================================================================
   10. TICKER — independent warm-up / main / rest / finisher / cooldown timers
   ========================================================================= */
function startTicker(){
  syncWakeLock();
  if(ticker) return;
  lastTs = Date.now();
  ticker = setInterval(tick, 200);
}
function stopTicker(){
  if(ticker){ clearInterval(ticker); ticker = null; }
  allowSleep();
}
function tick(){
  const s = session();
  const now = Date.now();
  let dt = (now - lastTs) / 1000;
  lastTs = now;
  if(!s){ stopTicker(); return; }
  if(!s.running) return;
  if(!(dt > 0)) return;
  if(dt > 3600) dt = 3600;

  if(s.phase === "warmup"){
    s.warmRemaining -= dt;
    s.warmElapsed += dt;
    if(s.warmRemaining <= 0){ warmNext(false); return; }
  }else if(s.phase === "transition"){
    s.transitionRemaining -= dt;
    if(s.transitionRemaining <= 0){ beginMain(); return; }
  }else if(s.phase === "main"){
    const before = s.mainRemaining;
    s.mainRemaining -= dt;
    s.mainElapsed += dt;
    if(before > 300 && s.mainRemaining <= 300 && !s.warnedFiveMin){
      s.warnedFiveMin = true;
      Sound.play("fiveMinLeft");
      say("Five minutes left in the main workout.");
    }
    if(before > 0 && s.mainRemaining <= 0 && !s.mainTimeUp){
      s.mainTimeUp = true;
      Sound.play("mainEnd");
      say("Forty five minutes complete. Finish your set and wrap up.");
      renderMain();
    }
    if(s.resting){
      const restBefore = s.restRemaining;
      s.restRemaining -= dt;
      if(restBefore > 5 && s.restRemaining <= 5 && !s.restWarned){
        s.restWarned = true;
        Sound.play("restWarn");
      }
      if(s.restRemaining <= 0){ endRest(false); return; }
    }
  }else if(s.phase === "finisher"){
    s.finRemaining -= dt;
    s.finElapsed += dt;
    if(s.finRemaining <= 0){ finNext(false); return; }
  }else if(s.phase === "cooldown"){
    s.coolRemaining -= dt;
    s.coolElapsed += dt;
    if(s.coolRemaining <= 0){ coolNext(false); return; }
  }else{
    return;
  }

  renderClocks();
  if(now - lastSave > 2000) save();
}

function toggleRun(){
  const s = session();
  if(!s) return;
  Sound.unlock();
  s.running = !s.running;
  lastTs = Date.now();
  const entry = todayEntry();
  if(entry && entry.status !== "completed") entry.status = s.running ? "in-progress" : "partial";
  if(s.running) startTicker();
  syncWakeLock();
  save();
  render();
  if(!s.running) say("Paused.");
}

/* =========================================================================
   10. SESSION FLOW
   ========================================================================= */
function startWorkout(){
  Sound.unlock();
  if(!profile) return;
  const existing = todayEntry();
  if(existing && existing.status === "completed" &&
     !confirm("Today is already logged as completed. Start a new session and overwrite it?")) return;

  const entry = {
    date: dateKey(),
    variation: safeWeek(week),
    day: safeDay(day),
    sets: {},
    skipped: [],
    notes: (existing && existing.notes) || "",
    status: "in-progress",
    session: blankSession()
  };
  profile.history[dateKey()] = entry;

  const s = entry.session;
  const items = warmupFor(entry).items;
  s.phase = "warmup";
  s.warmIndex = 0;
  s.warmRemaining = items[0].secs;
  s.running = true;

  save();
  startTicker();
  render();
  Sound.play("warmupStart");
  say("Warm-up. " + items[0].name + ".");
}

function warmNext(manual){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "warmup") return;
  const items = warmupFor(entry).items;
  if(s.warmIndex < items.length - 1){
    s.warmIndex++;
    s.warmRemaining = items[s.warmIndex].secs;
    Sound.play("movementChange");
    say(items[s.warmIndex].name);
    save();
    render();
  }else{
    finishWarmup(!!manual);
  }
}
function warmPrev(){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "warmup") return;
  const items = warmupFor(entry).items;
  s.warmIndex = Math.max(0, s.warmIndex - 1);
  s.warmRemaining = items[s.warmIndex].secs;
  Sound.play("movementChange");
  save();
  render();
}
function restartWarmup(){
  const entry = todayEntry(), s = session();
  if(!entry || !s) return;
  const items = warmupFor(entry).items;
  s.phase = "warmup";
  s.warmIndex = 0;
  s.warmRemaining = items[0].secs;
  s.warmElapsed = 0;
  s.running = true;
  startTicker();
  save();
  render();
  Sound.play("warmupStart");
  say("Restarting the warm-up.");
}
function finishWarmup(skipped){
  const s = session();
  if(!s) return;
  s.phase = "transition";
  s.transitionRemaining = TRANSITION_SECONDS;
  s.running = true;
  startTicker();
  save();
  render();
  Sound.play("warmupEnd");
  say(skipped ? "Warm-up skipped. Main workout starting." : "Warm-up complete. Main workout starting.");
}
function beginMain(){
  const entry = todayEntry(), s = session();
  if(!entry || !s) return;
  s.phase = "main";
  s.mainRemaining = MAIN_LENGTH;   // always starts at exactly 45:00
  s.mainElapsed = 0;
  s.exercise = 0;
  s.resting = false;
  s.restRemaining = 0;
  s.restDone = false;
  s.pendingAdvance = false;
  s.warnedFiveMin = false;
  s.mainTimeUp = false;
  s.running = true;
  entry.status = "in-progress";
  lastTs = Date.now();
  startTicker();
  save();
  render();
  Sound.play("mainStart");
  say("Main workout. Forty five minutes. First exercise: " + exList(entry)[0][0] + ".");
}

function completeSet(){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "main") return;
  Sound.unlock();
  const list = exList(entry);
  const exercise = list[s.exercise];
  const target = repsCount(exercise[1]);
  const done = entry.sets[s.exercise] || [];
  if(done.length >= target) return;

  entry.sets[s.exercise] = done.concat([done.length]);
  const completed = entry.sets[s.exercise].length;
  const exerciseFinished = completed >= target;
  const isLastExercise = s.exercise >= list.length - 1;
  s.restDone = false;

  if(exerciseFinished && isLastExercise){
    Sound.play("setDone");
    save();
    finishMain(false);
    return;
  }

  s.resting = true;
  s.restTotal = parseRest(exercise[3]);
  s.restRemaining = s.restTotal;
  s.restWarned = false;
  s.pendingAdvance = exerciseFinished;
  if(!s.running){ s.running = true; lastTs = Date.now(); }
  startTicker();
  save();
  render();
  Sound.play("restStart");
  say(exerciseFinished
    ? exercise[0] + " complete. Rest, then " + list[s.exercise + 1][0] + "."
    : "Set " + completed + " done. Rest " + fmtShort(s.restTotal) + ".");
}

function undoSet(index){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "main") return;
  const done = entry.sets[s.exercise] || [];
  if(!done.length) return;
  entry.sets[s.exercise] = done.slice(0, Math.max(0, index));
  save();
  render();
}

function endRest(manual){
  const entry = todayEntry(), s = session();
  if(!entry || !s || !s.resting) return;
  s.resting = false;
  s.restRemaining = 0;
  if(s.pendingAdvance){
    s.pendingAdvance = false;
    nextExercise(false);
    return;
  }
  s.restDone = true;
  save();
  render();
  if(!manual){
    Sound.play("restEnd");
    say("Rest over. Next set.");
  }else{
    Sound.play("blip");
  }
}
function addRestTime(seconds){
  const s = session();
  if(!s || !s.resting) return;
  s.restRemaining += seconds;
  s.restTotal += seconds;
  s.restWarned = false;
  save();
  renderClocks();
}
function addMainTime(seconds){
  const s = session();
  if(!s || s.phase !== "main") return;
  s.mainRemaining += seconds;
  if(s.mainRemaining > 0){ s.mainTimeUp = false; }
  if(s.mainRemaining > 300){ s.warnedFiveMin = false; }
  save();
  render();
}

function nextExercise(skipped){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "main") return;
  const list = exList(entry);
  if(skipped){
    if(!entry.skipped) entry.skipped = [];
    if(entry.skipped.indexOf(s.exercise) < 0) entry.skipped.push(s.exercise);
  }
  if(s.exercise >= list.length - 1){
    save();
    finishMain(false);
    return;
  }
  s.exercise++;
  s.resting = false;
  s.restRemaining = 0;
  s.restDone = false;
  s.pendingAdvance = false;
  save();
  render();
  Sound.play("exerciseStart");
  say("Next: " + list[s.exercise][0] + ".");
}
function prevExercise(){
  const s = session();
  if(!s || s.phase !== "main" || s.exercise === 0) return;
  s.exercise--;
  s.resting = false;
  s.restRemaining = 0;
  s.restDone = false;
  s.pendingAdvance = false;
  save();
  render();
  Sound.play("exerciseStart");
}
function skipExercise(){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "main") return;
  const name = exList(entry)[s.exercise][0];
  if(settings.confirmSkip && !confirm("Skip " + name + "?")) return;
  nextExercise(true);
}

function finishMain(manual){
  const entry = todayEntry(), s = session();
  if(!entry || !s) return;
  if(manual && settings.confirmSkip && s.phase === "main" && !confirm("Finish the main workout now and move to the cooldown?")) return;
  s.phase = "mainComplete";
  s.running = false;
  s.resting = false;
  s.restRemaining = 0;
  s.restDone = false;
  s.pendingAdvance = false;
  entry.status = "completed";
  advanceVariationIfEarned(entry);
  save();
  render();
  if(!s.mainTimeUp) Sound.play("mainEnd");
  say("Main workout complete. Great work. Cooldown next.");
}

function startFinisher(){
  const entry = todayEntry(), s = session();
  if(!entry || !s) return;
  const items = FINISHER.items;
  s.phase = "finisher";
  s.finIndex = 0;
  s.finRemaining = items[0].secs;
  s.running = true;
  lastTs = Date.now();
  startTicker();
  save();
  render();
  Sound.play("finisherStart");
  say("Finisher. " + items[0].name + ".");
}
function finNext(manual){
  const s = session();
  if(!s || s.phase !== "finisher") return;
  const items = FINISHER.items;
  if(s.finIndex < items.length - 1){
    s.finIndex++;
    s.finRemaining = items[s.finIndex].secs;
    Sound.play("movementChange");
    say(items[s.finIndex].name);
    save();
    render();
  }else{
    Sound.play("finisherEnd");
    startCooldown();
  }
}
function finPrev(){
  const s = session();
  if(!s || s.phase !== "finisher") return;
  const items = FINISHER.items;
  s.finIndex = Math.max(0, s.finIndex - 1);
  s.finRemaining = items[s.finIndex].secs;
  Sound.play("movementChange");
  save();
  render();
}

function startCooldown(){
  const entry = todayEntry(), s = session();
  if(!entry || !s) return;
  const items = cooldownFor(entry).items;
  s.phase = "cooldown";
  s.coolIndex = 0;
  s.coolRemaining = items[0].secs;
  s.running = true;
  lastTs = Date.now();
  startTicker();
  save();
  render();
  Sound.play("cooldownStart");
  say("Cooldown. " + items[0].name + ".");
}
function coolNext(manual){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "cooldown") return;
  const items = cooldownFor(entry).items;
  if(s.coolIndex < items.length - 1){
    s.coolIndex++;
    s.coolRemaining = items[s.coolIndex].secs;
    Sound.play("movementChange");
    say(items[s.coolIndex].name);
    save();
    render();
  }else{
    Sound.play("cooldownEnd");
    finishSession(false);
  }
}
function coolPrev(){
  const entry = todayEntry(), s = session();
  if(!entry || !s || s.phase !== "cooldown") return;
  const items = cooldownFor(entry).items;
  s.coolIndex = Math.max(0, s.coolIndex - 1);
  s.coolRemaining = items[s.coolIndex].secs;
  Sound.play("movementChange");
  save();
  render();
}

function finishSession(skipped){
  const entry = todayEntry(), s = session();
  if(!entry || !s) return;
  s.phase = "complete";
  s.running = false;
  entry.status = "completed";
  stopTicker();
  save();
  render();
  renderTracking();
  Sound.play("complete");
  say(skipped ? "Workout complete. Nice work." : "Workout complete. Excellent session.");
}

function startNewSession(){
  if(!confirm("Start another session? Today's completed session will be replaced.")) return;
  const entry = todayEntry();
  if(entry) delete entry.session;
  stopTicker();
  save();
  week = profile.variation;
  day = weekdayIndex() === null ? 0 : weekdayIndex();
  render();
}
function cancelWorkout(){
  const entry = todayEntry();
  if(!entry || !confirm("Cancel this session? Completed sets stay saved for today.")) return;
  stopTicker();
  const completed = completedSetCount(entry);
  entry.status = completed > 0 ? "partial" : "missed";
  delete entry.session;
  save();
  render();
  renderTracking();
}
function resetToday(){
  if(!confirm("Reset all of today's saved workout progress?")) return;
  stopTicker();
  if(profile) delete profile.history[dateKey()];
  save();
  week = profile ? profile.variation : "A";
  const d = weekdayIndex();
  day = d === null ? 0 : d;
  closeSettings();
  render();
  renderTracking();
}
function saveNotes(){
  const entry = todayEntry();
  if(!entry) return;
  entry.notes = $("notesInput").value;
  save();
}

function completedSetCount(entry){
  if(!entry || !entry.sets) return 0;
  return Object.keys(entry.sets).reduce((total,key)=>total + entry.sets[key].length, 0);
}
function totalSetCount(entry){
  return exList(entry).reduce((total,exercise)=>total + repsCount(exercise[1]), 0);
}
function completedExerciseCount(entry){
  const list = exList(entry);
  let count = 0;
  for(let i = 0; i < list.length; i++){
    const done = (entry.sets && entry.sets[i]) ? entry.sets[i].length : 0;
    if(done >= repsCount(list[i][1])) count++;
  }
  return count;
}
function advanceVariationIfEarned(entry){
  if(entry.variationAdvanced) return;
  const monday = mondayOf();
  const keys = [];
  for(let i = 0; i < 5; i++){
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    keys.push(dateKey(d));
  }
  const allDone = keys.every(function(key){
    const record = profile.history[key];
    return record && record.status === "completed" && record.variation === entry.variation;
  });
  if(!allDone) return;
  entry.variationAdvanced = true;
  const previous = entry.variation;
  profile.variation = previous === "A" ? "B" : previous === "B" ? "C" : "A";
  profile.cycle = (Number(profile.cycle) || 1) + 1;
  entry.cycleMessage = previous === "A"
    ? "Week A conquered — Week B unlocked."
    : previous === "B"
      ? "Week B survived. Week C is waiting."
      : "Three-week cycle complete. Back to Week A — stronger this time.";
}

/* =========================================================================
   11. TEMPO INTERPRETATION
   ========================================================================= */
function tempoInfo(exercise){
  const raw = String(exercise[4] || "").trim();
  const name = String(exercise[0] || "").toLowerCase();
  const match = raw.match(/^(\d+)\s*-\s*(\d+)\s*-\s*(\d+)$/);
  if(!match){
    return {
      value: raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Controlled",
      steps: ["Move slowly and deliberately", "No bouncing or momentum", "Keep breathing through the set"]
    };
  }
  const lower = Number(match[1]), pause = Number(match[2]), lift = Number(match[3]);
  const isPull = /row|curl|pull|chin|face/.test(name);
  const isSqueeze = /thrust|bridge|raise|curl|fly|squeeze|calf/.test(name) || lift >= 2;
  const isHold = /plank|hold|dead bug/.test(name);

  const lowerLabel = isHold ? "Set up: " + lower + " sec"
    : (isPull ? "↓ Return / lower: " : "↓ Lower: ") + lower + " sec";
  const pauseLabel = pause > 0
    ? (isPull ? "→ Pause at the top: " : "→ Pause: ") + pause + " sec"
    : "→ No pause — flow straight through";
  const liftLabel = isPull
    ? "↑ Pull + squeeze: " + lift + " sec"
    : isSqueeze
      ? "↑ Lift + squeeze: " + lift + " sec"
      : "↑ Lift: " + lift + " sec";

  return {value: raw, steps:[lowerLabel, pauseLabel, liftLabel]};
}

function safetyFor(exercise){
  const name = String(exercise[0] || "").toLowerCase();
  const category = exercise[8];
  const blocks = [];
  const isKnee = category === "knee" || /squat|lunge|split/.test(name);
  if(isKnee) blocks.push({kind:"knee", title:"Knee focus", cues:KNEE_CUES});
  if(/thrust|bridge/.test(name)){
    blocks.push({kind:"posture", title:"Posture & bracing", cues:POSTURE_CUES.bridge});
  }else if(/romanian|rdl|deadlift|hinge|pendlay/.test(name)){
    blocks.push({kind:"posture", title:"Posture & bracing", cues:POSTURE_CUES.hinge});
  }else if(/overhead press/.test(name)){
    blocks.push({kind:"posture", title:"Posture & bracing", cues:POSTURE_CUES.overhead});
  }else if(isKnee && /squat/.test(name)){
    blocks.push({kind:"posture", title:"Posture & bracing", cues:POSTURE_CUES.squat});
  }
  return blocks;
}
/* Exercise info popup: animated movement demo + the full detail for that lift. */
function openExerciseInfo(index){
  let exercise = null;
  const s = session(), entry = todayEntry();
  if(typeof index === "number"){
    const list = (entry && s && s.phase === "main") ? exList(entry) : W[safeWeek(week)][safeDay(day)].ex;
    exercise = list[index];
  }else if(entry && s && s.phase === "main"){
    exercise = exList(entry)[s.exercise];
  }
  if(!exercise) return;

  const demo = DEMOS[demoKeyFor(exercise)] || DEMOS.generic;
  const tempo = tempoInfo(exercise);
  let html = '<div class="demo-wrap">' + demoSvg(demo) +
    '<div class="demo-cap">' + escapeHtml(demo.title) + " — simplified movement animation</div></div>";

  html += '<div class="mini-card"><span class="label">How to do it</span><ol class="steps">' +
    demo.steps.map(function(step){ return "<li>" + escapeHtml(step) + "</li>"; }).join("") +
    "</ol></div>";

  html += '<div class="mini-card"><span class="label">Prescription</span><div class="mini-grid">' +
    "<div><b>Sets × Reps</b><span>" + escapeHtml(exercise[1]) + "</span></div>" +
    "<div><b>RIR</b><span>" + escapeHtml(exercise[2]) + "</span></div>" +
    "<div><b>Rest</b><span>" + escapeHtml(exercise[3]) + "</span></div>" +
    "<div><b>Tempo</b><span>" + escapeHtml(exercise[4]) + "</span></div></div>" +
    '<div class="tempo-steps" style="margin-top:10px">' +
    tempo.steps.map(function(step){ return "<span>" + escapeHtml(step) + "</span>"; }).join("") +
    "</div></div>";

  html += safetyFor(exercise).map(function(block){
    return '<div class="safety ' + (block.kind === "posture" ? "posture" : "") + '">' +
      '<span class="label">' + escapeHtml(block.title) + "</span><ul>" +
      block.cues.map(function(cue){ return "<li>" + escapeHtml(cue) + "</li>"; }).join("") +
      "</ul></div>";
  }).join("");

  html += '<div class="mini-card" style="margin-top:9px"><span class="label">Form cues</span><p>' +
    escapeHtml(exercise[7]) + "</p></div>";
  html += '<div class="mini-card"><span class="label">Primary muscles</span><p>' +
    escapeHtml(exercise[5]) + '</p><span class="label" style="margin-top:11px">Why this exercise</span><p>' +
    escapeHtml(exercise[6]) + "</p></div>";

  $("infoName").textContent = exercise[0];
  $("infoBody").innerHTML = html;
  $("infoModal").classList.remove("hidden");
}
function closeExerciseInfo(){ $("infoModal").classList.add("hidden"); }

function tagFor(exercise){
  const category = exercise[8];
  const labels = {knee:"Knee", posterior:"Hinge", compound:"Compound", accessory:"Accessory", core:"Core"};
  return '<span class="tag ' + escapeHtml(category) + '">' + escapeHtml(labels[category] || category) + "</span>";
}

/* =========================================================================
   12. RENDERING
   ========================================================================= */
function showScreen(id){
  const screens = document.querySelectorAll("#workoutTab > .screen");
  for(let i = 0; i < screens.length; i++){
    screens[i].classList.toggle("hidden", screens[i].id !== id);
  }
}
function isRestDay(){ return weekdayIndex() === null && !weekendPreview; }

// Circular timer dials: r=44 -> circumference 276.46 (matches the CSS stroke-dasharray).
const RING_LENGTH = 2 * Math.PI * 44;
function setRing(id, fraction){
  const el = $(id);
  if(!el) return;
  const f = Math.min(1, Math.max(0, isFinite(fraction) ? fraction : 0));
  el.style.strokeDashoffset = (RING_LENGTH * (1 - f)).toFixed(2);
}

function render(){
  if(!profile) return;
  const s = session();
  const phase = s ? s.phase : "overview";
  document.body.dataset.phase = (phase === "main" && s.resting) ? "rest" : phase;
  // compact one-screen layout only while a session is actually in progress
  document.body.dataset.compact =
    (s && ["warmup","main","finisher","cooldown"].indexOf(phase) >= 0 && currentTab === "workout") ? "1" : "0";

  if(!s && isRestDay()){
    renderRestDay();
    showScreen("restDayScreen");
    renderChrome();
    return;
  }

  if(phase === "overview"){
    renderOverview();
    showScreen("screenOverview");
  }else if(phase === "warmup"){
    renderWarmup();
    showScreen("screenWarmup");
  }else if(phase === "transition"){
    renderTransition();
    showScreen("screenTransition");
  }else if(phase === "main"){
    renderMain();
    showScreen("screenMain");
  }else if(phase === "mainComplete"){
    renderMainComplete();
    showScreen("screenMainComplete");
  }else if(phase === "finisher"){
    renderFinisher();
    showScreen("screenFinisher");
  }else if(phase === "cooldown"){
    renderCooldown();
    showScreen("screenCooldown");
  }else{
    renderComplete();
    showScreen("screenComplete");
  }
  renderClocks();
  renderChrome();
}

function renderChrome(){
  const s = session();
  const phase = s ? s.phase : "overview";
  const inSession = !!s && phase !== "complete";
  const onWorkoutTab = currentTab === "workout";
  const restDay = !s && isRestDay();
  const showSticky = inSession && onWorkoutTab && !restDay;

  $("appTabs").classList.toggle("hidden", showSticky);
  $("stickyBar").classList.toggle("hidden", !showSticky);
  $("topSub").textContent = inSession
    ? {warmup:"Warm-up in progress", transition:"Main workout starting", main:(s.resting ? "Resting" : "Main workout"), mainComplete:"Main workout complete", finisher:"Finisher in progress", cooldown:"Cooldown in progress"}[phase] || ""
    : "Strength + hypertrophy · 45-minute main workout";

  if(!showSticky) return;
  const btn = $("stickyAction");
  let label = "Continue", action = null, disabled = false;
  if(phase === "warmup"){
    label = s.running ? "Next movement" : "Start warm-up";
    action = s.running ? function(){ warmNext(true); } : toggleRun;
  }else if(phase === "transition"){
    label = "Start main workout now";
    action = beginMain;
  }else if(phase === "main"){
    const entry = todayEntry();
    const list = exList(entry);
    const exercise = list[s.exercise];
    const done = (entry.sets[s.exercise] || []).length;
    const target = repsCount(exercise[1]);
    if(s.resting){
      label = "Skip rest";
      action = function(){ endRest(true); };
    }else if(done >= target){
      label = s.exercise >= list.length - 1 ? "Finish main workout" : "Next exercise";
      action = s.exercise >= list.length - 1 ? function(){ finishMain(true); } : function(){ nextExercise(false); };
    }else{
      label = "Complete set " + (done + 1) + " of " + target;
      action = completeSet;
      disabled = !s.running;
      if(!s.running){ label = "Resume workout"; action = toggleRun; disabled = false; }
    }
  }else if(phase === "mainComplete"){
    label = "Start finisher";
    action = startFinisher;
  }else if(phase === "finisher"){
    label = s.running ? "Next movement" : "Start finisher";
    action = s.running ? function(){ finNext(true); } : toggleRun;
  }else if(phase === "cooldown"){
    label = s.running ? "Next movement" : "Start cooldown";
    action = s.running ? function(){ coolNext(true); } : toggleRun;
  }
  btn.textContent = label;
  btn.disabled = disabled;
  btn.onclick = action;
}

function renderRestDay(){
  const jokes = [
    "Whoa there, champion. Today is a rest day.",
    "No squats today. Your muscles have filed for paid leave.",
    "Congratulations. Today's workout is called: Absolutely Nothing.",
    "Go chill. Eat protein. Recover. Get stronger while doing suspiciously little.",
    "Rest day unlocked. Your only mission: recover like a professional athlete.",
    "The barbell misses you already. But not enough to disturb your weekend.",
    "Today we train the most underrated muscle: patience. See you Monday!"
  ];
  const tips = [
    "Go for a relaxed walk",
    "Do a little easy mobility if you feel stiff",
    "Eat well",
    "Sleep like it is part of your training",
    "Do something that does not involve counting reps"
  ];
  const now = new Date();
  $("restDayMessage").textContent = jokes[now.getDate() % jokes.length];
  $("restDaySuggestion").textContent = "Optional recovery idea: " + tips[(now.getDate() + now.getMonth()) % tips.length];
}
function previewWorkout(){
  weekendPreview = true;
  week = profile.variation;
  day = 0;
  render();
}
function returnToRestDay(){
  weekendPreview = false;
  render();
}

function renderWeekDaySelectors(){
  const weeksBox = $("weeks");
  weeksBox.innerHTML = "";
  ["A","B","C"].forEach(function(v){
    const b = document.createElement("button");
    b.textContent = "Week " + v;
    b.className = (v === week) ? "active" : "";
    b.onclick = function(){ week = v; render(); };
    weeksBox.appendChild(b);
  });
  const daysBox = $("days");
  daysBox.innerHTML = "";
  W[week].forEach(function(_, i){
    const b = document.createElement("button");
    b.textContent = "Day " + (i + 1);
    b.title = W[week][i].name;
    b.className = (i === day) ? "active" : "";
    b.onclick = function(){ day = i; render(); };
    daysBox.appendChild(b);
  });
}

function renderOverview(){
  week = safeWeek(week);
  day = safeDay(day);
  renderWeekDaySelectors();
  $("returnRestBtn").classList.toggle("hidden", !weekendPreview);

  const plan = W[week][day];
  const warm = WARMUPS[day];
  const cool = COOLDOWNS[day];
  const warmSecs = sumSecs(warm.items);
  const coolSecs = sumSecs(cool.items);
  const finSecs = sumSecs(FINISHER.items);
  const totalSets = plan.ex.reduce(function(total, ex){ return total + repsCount(ex[1]); }, 0);

  $("ovName").textContent = plan.name;
  $("ovSub").textContent = "Week " + week + " · " + DAY_NAMES[day] + " · " + plan.ex.length + " exercises · " + totalSets + " working sets";
  $("ovWarm").textContent = fmt(warmSecs);
  $("ovMain").textContent = fmt(MAIN_LENGTH);
  $("ovFin").textContent = fmt(finSecs);
  $("ovCool").textContent = fmt(coolSecs);
  $("ovTotal").textContent = fmtApprox(warmSecs + MAIN_LENGTH + finSecs + coolSecs);
  $("ovWarmFocus").textContent = warm.title + " — " + warm.focus;

  $("ovList").innerHTML = plan.ex.map(function(ex, i){
    return '<li class="prev-item">' +
      '<span class="prev-num">' + (i + 1) + "</span>" +
      '<div class="prev-body"><div class="prev-name">' + escapeHtml(ex[0]) + "</div>" +
      '<div class="prev-meta">' + escapeHtml(ex[1]) + " · RIR " + escapeHtml(ex[2]) + " · rest " + escapeHtml(ex[3]) + "</div></div>" +
      tagFor(ex) +
      '<button class="info-btn" onclick="openExerciseInfo(' + i + ')" aria-label="How to do ' +
      escapeHtml(ex[0]) + '" title="How to do it">i</button></li>';
  }).join("");
}

function renderWarmup(){
  const entry = todayEntry(), s = session();
  const warm = warmupFor(entry);
  const items = warm.items;
  const item = items[s.warmIndex];
  $("warmStep").textContent = "Warm-up: " + (s.warmIndex + 1) + " of " + items.length;
  $("warmTitle").textContent = warm.title;
  $("warmName").textContent = item.name;
  $("warmDose").textContent = item.dose;
  $("warmCue").textContent = item.cue;
  $("warmPauseBtn").textContent = s.running ? "Pause" : "Start";
  $("warmDots").innerHTML = items.map(function(_, i){
    return '<i class="' + (i < s.warmIndex ? "done" : i === s.warmIndex ? "now" : "") + '"></i>';
  }).join("");
}

function renderTransition(){
  const s = session();
  $("transWarmTime").textContent = "Warm-up time: " + fmtShort(s.warmElapsed) + " — not deducted from your 45 minutes.";
}

function renderMain(){
  const entry = todayEntry(), s = session();
  const list = exList(entry);
  s.exercise = Math.min(Math.max(0, s.exercise), list.length - 1);
  const exercise = list[s.exercise];
  const target = repsCount(exercise[1]);
  const done = entry.sets[s.exercise] || [];

  $("mainStep").textContent = "Exercise " + (s.exercise + 1) + " of " + list.length;
  $("exName").textContent = exercise[0];
  $("exTag").className = "tag " + exercise[8];
  $("exTag").textContent = ({knee:"Knee", posterior:"Hinge", compound:"Compound", accessory:"Accessory", core:"Core"})[exercise[8]] || exercise[8];
  $("exSets").textContent = exercise[1];
  $("exRir").textContent = exercise[2];
  $("exRest").textContent = exercise[3];
  $("exSetsB").textContent = exercise[1];
  $("exRirB").textContent = exercise[2];
  $("exRestB").textContent = exercise[3];
  $("exTempo").textContent = exercise[4];
  $("exMuscles").textContent = exercise[5];
  $("exWhy").textContent = exercise[6];
  $("exCues").textContent = exercise[7];
  $("mainPauseBtn").textContent = s.running ? "Pause" : "Resume";
  $("mainNote").textContent = s.mainTimeUp
    ? "45 minutes are up — finish your last sets or wrap up when ready."
    : "The 45:00 timer runs only during the main workout — warm-up, finisher and cooldown are excluded.";

  const tempo = tempoInfo(exercise);
  $("tempoValue").textContent = tempo.value;
  $("tempoSteps").innerHTML = tempo.steps.map(function(step){
    return "<span>" + escapeHtml(step) + "</span>";
  }).join("");

  $("safetyBlocks").innerHTML = safetyFor(exercise).map(function(block){
    return '<div class="safety ' + (block.kind === "posture" ? "posture" : "") + '">' +
      '<span class="label">' + escapeHtml(block.title) + "</span><ul>" +
      block.cues.map(function(cue){ return "<li>" + escapeHtml(cue) + "</li>"; }).join("") +
      "</ul></div>";
  }).join("");

  const setBox = $("setButtons");
  setBox.innerHTML = "";
  for(let i = 0; i < target; i++){
    const b = document.createElement("button");
    const isDone = i < done.length;
    b.className = "set" + (isDone ? " done" : (i === done.length ? " next" : ""));
    b.textContent = "Set " + (i + 1);
    b.onclick = isDone ? function(){ undoSet(i); } : completeSet;
    b.title = isDone ? "Tap to undo" : "Tap to mark complete";
    b.setAttribute("aria-pressed", isDone ? "true" : "false");
    b.setAttribute("aria-label", "Set " + (i + 1) + (isDone ? " complete, tap to undo" : ", not yet completed"));
    setBox.appendChild(b);
  }

  $("restStrip").classList.toggle("hidden", !s.resting);
  $("readyBanner").classList.toggle("hidden", !(s.restDone && !s.resting));
  if(s.resting){
    $("restUpNext").innerHTML = s.pendingAdvance && s.exercise < list.length - 1
      ? "Up next: <b>" + escapeHtml(list[s.exercise + 1][0]) + "</b>"
      : "Up next: <b>Set " + Math.min(done.length + 1, target) + " of " + target + "</b>";
  }
}

function renderMainComplete(){
  const entry = todayEntry(), s = session();
  const list = exList(entry);
  const skipped = entry.skipped || [];
  $("mcSub").textContent = W[safeWeek(entry.variation)][safeDay(entry.day)].name + " · Week " + safeWeek(entry.variation);
  $("mcExercises").textContent = completedExerciseCount(entry) + "/" + list.length;
  $("mcSets").textContent = completedSetCount(entry) + "/" + totalSetCount(entry);
  $("mcTime").textContent = fmtShort(s.mainElapsed);
  $("mcSkipped").textContent = skipped.length;
  $("mcSkippedList").innerHTML = skipped.length
    ? '<div class="section-title">Skipped exercises</div><div class="breakdown">' +
      skipped.map(function(i){
        return '<div class="brow"><span>' + escapeHtml(list[i] ? list[i][0] : "Exercise " + (i+1)) + "</span><b>skipped</b></div>";
      }).join("") + "</div>"
    : "";
  $("notesInput").value = entry.notes || "";
  const cool = cooldownFor(entry);
  $("mcCooldownNote").textContent = FINISHER.title + " — " + fmtApprox(sumSecs(FINISHER.items)) +
    " of light control work, then a " + fmtApprox(sumSecs(cool.items)) + " " + cool.title.toLowerCase() +
    ". Neither counts toward the 45 minutes.";
}

function renderFinisher(){
  const s = session();
  const items = FINISHER.items;
  const item = items[s.finIndex];
  $("finStep").textContent = "Finisher: " + (s.finIndex + 1) + " of " + items.length;
  $("finTitle").textContent = FINISHER.title;
  $("finName").textContent = item.name;
  $("finDose").textContent = item.dose;
  $("finCue").textContent = item.cue;
  $("finPauseBtn").textContent = s.running ? "Pause" : "Start";
  $("finDots").innerHTML = items.map(function(_, i){
    return '<i class="' + (i < s.finIndex ? "done" : i === s.finIndex ? "now" : "") + '"></i>';
  }).join("");
}

function renderCooldown(){
  const entry = todayEntry(), s = session();
  const cool = cooldownFor(entry);
  const items = cool.items;
  const item = items[s.coolIndex];
  $("coolStep").textContent = "Cooldown: " + (s.coolIndex + 1) + " of " + items.length;
  $("coolTitle").textContent = cool.title;
  $("coolName").textContent = item.name;
  $("coolDose").textContent = item.dose;
  $("coolCue").textContent = item.cue;
  $("coolPauseBtn").textContent = s.running ? "Pause" : "Start";
  $("coolDots").innerHTML = items.map(function(_, i){
    return '<i class="' + (i < s.coolIndex ? "done" : i === s.coolIndex ? "now" : "") + '"></i>';
  }).join("");
}

function renderComplete(){
  const entry = todayEntry(), s = session();
  const list = exList(entry);
  const total = s.warmElapsed + s.mainElapsed + (s.finElapsed || 0) + s.coolElapsed;
  $("fcSub").textContent = W[safeWeek(entry.variation)][safeDay(entry.day)].name + " · Week " + safeWeek(entry.variation);
  $("fcSets").textContent = completedSetCount(entry) + "/" + totalSetCount(entry);
  $("fcExercises").textContent = completedExerciseCount(entry) + "/" + list.length;
  $("fcTotal").textContent = fmtShort(total);
  $("fcWarm").textContent = fmtShort(s.warmElapsed);
  $("fcMain").textContent = fmtShort(s.mainElapsed);
  $("fcFin").textContent = fmtShort(s.finElapsed || 0);
  $("fcCool").textContent = fmtShort(s.coolElapsed);
  const hasNotes = !!(entry.notes && entry.notes.trim());
  $("fcNotesWrap").classList.toggle("hidden", !hasNotes);
  if(hasNotes) $("fcNotes").textContent = entry.notes;
  $("fcMessage").innerHTML = entry.cycleMessage
    ? '<div class="safety posture" style="margin-top:16px"><span class="label">Progression</span><ul><li>' +
      escapeHtml(entry.cycleMessage) + "</li></ul></div>"
    : "";
}

function renderClocks(){
  const entry = todayEntry(), s = session();
  if(!s) return;

  // shared helper for the guided-movement phases (warm-up / finisher / cooldown)
  function paintMovementDials(items, index, remaining, prefix){
    let left = Math.max(0, remaining);
    for(let i = index + 1; i < items.length; i++) left += items[i].secs;
    let total = 0;
    for(let i = 0; i < items.length; i++) total += items[i].secs;
    const current = items[index].secs;
    $(prefix + "Clock").textContent = fmt(remaining);
    $(prefix + "TotalLeft").textContent = fmtShort(left);
    setRing(prefix + "Ring", current ? remaining / current : 0);
    setRing(prefix + "TotalRing", total ? left / total : 0);
  }

  if(s.phase === "warmup"){
    paintMovementDials(warmupFor(entry).items, s.warmIndex, s.warmRemaining, "warm");
  }else if(s.phase === "transition"){
    $("transCount").textContent = String(Math.max(1, Math.ceil(s.transitionRemaining)));
  }else if(s.phase === "main"){
    const list = exList(entry);
    const exercise = list[s.exercise];
    const target = repsCount(exercise[1]);
    const done = (entry.sets[s.exercise] || []).length;

    $("mainClock").textContent = fmt(s.mainRemaining);
    setRing("mainRing", s.mainRemaining / MAIN_LENGTH);

    const overtime = $("mainOvertime");
    if(s.mainRemaining < 0){
      overtime.classList.remove("hidden");
      overtime.textContent = "Overtime +" + fmtShort(-s.mainRemaining);
    }else{
      overtime.classList.add("hidden");
    }

    // right-hand dial: the rest countdown while resting, otherwise set progress
    const ctx = $("ctxDial");
    if(s.resting){
      ctx.className = "dial is-rest";
      $("ctxValue").textContent = fmt(s.restRemaining);
      $("ctxLabel").textContent = "Rest";
      setRing("ctxRing", s.restTotal ? s.restRemaining / s.restTotal : 0);
    }else{
      ctx.className = "dial is-sets";
      $("ctxValue").textContent = done + "/" + target;
      $("ctxLabel").textContent = "Sets done";
      setRing("ctxRing", target ? done / target : 0);
    }
  }else if(s.phase === "finisher"){
    paintMovementDials(FINISHER.items, s.finIndex, s.finRemaining, "fin");
  }else if(s.phase === "cooldown"){
    paintMovementDials(cooldownFor(entry).items, s.coolIndex, s.coolRemaining, "cool");
  }
}

/* =========================================================================
   13. TABS + TRACKING
   ========================================================================= */
function setTab(tab){
  currentTab = tab;
  $("workoutTab").classList.toggle("hidden", tab !== "workout");
  $("trackingTab").classList.toggle("hidden", tab !== "tracking");
  const buttons = document.querySelectorAll(".app-tabs button");
  for(let i = 0; i < buttons.length; i++){
    buttons[i].classList.toggle("active", buttons[i].dataset.tab === tab);
  }
  if(tab === "tracking") renderTracking();
  renderChrome();
}
function recordForDate(d){ return (profile && profile.history[dateKey(d)]) || null; }
function changeMonth(amount){
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + amount, 1);
  renderTracking();
}
function renderTracking(){
  if(!profile) return;
  const year = calendarDate.getFullYear(), month = calendarDate.getMonth(), today = dateKey();
  $("monthLabel").textContent = new Intl.DateTimeFormat(undefined, {month:"long", year:"numeric"}).format(calendarDate);
  const calendar = $("calendar");
  calendar.innerHTML = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    .map(function(x){ return '<div class="dow">' + x + "</div>"; }).join("");
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  for(let i = 0; i < offset; i++) calendar.insertAdjacentHTML("beforeend", "<div></div>");
  for(let n = 1; n <= count; n++){
    const d = new Date(year, month, n);
    const key = dateKey(d);
    const entry = recordForDate(d);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const status = weekend ? "recovery"
      : key > today ? "future"
      : (entry && entry.status === "completed") ? "done"
      : (entry && (entry.status === "partial" || entry.status === "in-progress")) ? "partial"
      : "missed";
    calendar.insertAdjacentHTML("beforeend",
      '<div class="calendar-day ' + status + (key === today ? " today" : "") + '" title="' + key + ": " + status + '">' + n + "</div>");
  }
  let done = 0, partial = 0, missed = 0;
  const monday = mondayOf();
  for(let i = 0; i < 5; i++){
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = dateKey(d), entry = recordForDate(d);
    if(key > today) continue;
    if(entry && entry.status === "completed") done++;
    else if(entry && (entry.status === "partial" || entry.status === "in-progress")) partial++;
    else missed++;
  }
  const todayIndex = weekdayIndex();
  $("cycleInfo").textContent = "Current week: " + profile.variation + " · Cycle " + profile.cycle +
    " · Today: " + (todayIndex === null ? "Rest day" : DAY_NAMES[todayIndex]);
  $("doneCount").textContent = done;
  $("partialCount").textContent = partial;
  $("plannedCount").textContent = missed;
}

/* =========================================================================
   14. PROFILE GATE
   ========================================================================= */
function chooseProfile(name){
  const input = $("usernameInput");
  const value = String(name || input.value).trim().replace(/\s+/g, " ");
  if(!value){ input.focus(); return; }
  const profiles = getProfiles();
  if(profiles.indexOf(value) < 0){
    profiles.push(value);
    try{ localStorage.setItem(INDEX_KEY, JSON.stringify(profiles)); }catch(e){}
  }
  activeUser = value;
  profile = loadProfile(value);
  try{ localStorage.setItem(PROFILE_KEY, value); }catch(e){}
  $("profileName").textContent = value;
  $("profileGate").classList.add("hidden");
  weekendPreview = false;

  // Restore any in-flight session for today (paused, so the user resumes deliberately).
  const entry = todayEntry();
  const s = session();
  if(entry && s){
    week = safeWeek(entry.variation);
    day = safeDay(entry.day);
    s.running = false;
    if(s.phase !== "complete" && entry.status === "in-progress") entry.status = "partial";
    if(s.phase !== "complete") weekendPreview = true; // keep the session visible on weekends
    save();
  }else{
    week = profile.variation;
    const d = weekdayIndex();
    day = d === null ? 0 : d;
  }
  setTab("workout");
  render();
  renderTracking();
}
function renderProfileList(){
  const list = $("profileList");
  list.innerHTML = "";
  getProfiles().forEach(function(name){
    const b = document.createElement("button");
    b.className = "ghost";
    b.textContent = name;
    b.onclick = function(){ chooseProfile(name); };
    list.appendChild(b);
  });
}
function changeProfile(){
  stopTicker();
  renderProfileList();
  $("usernameInput").value = "";
  $("profileGate").classList.remove("hidden");
  $("usernameInput").focus();
}

/* =========================================================================
   15. BOOT
   ========================================================================= */
$("usernameInput").addEventListener("keydown", function(e){
  if(e.key === "Enter") chooseProfile();
});
$("settingsModal").addEventListener("click", function(e){
  if(e.target === this) closeSettings();
});
$("infoModal").addEventListener("click", function(e){
  if(e.target === this) closeExerciseInfo();
});
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){ closeSettings(); closeExerciseInfo(); }
});
document.addEventListener("visibilitychange", function(){
  if(!document.hidden){ lastTs = Date.now(); render(); }
  syncWakeLock();
});
window.addEventListener("beforeunload", function(){ save(); });
["pointerdown","keydown"].forEach(function(evt){
  window.addEventListener(evt, function once(){
    Sound.unlock();
    window.removeEventListener(evt, once);
  }, {passive:true});
});

loadSettings();
syncSettingsUI();

(function boot(){
  const saved = localStorage.getItem(PROFILE_KEY);
  if(saved && getProfiles().indexOf(saved) >= 0){
    chooseProfile(saved);
  }else{
    renderProfileList();
    $("profileGate").classList.remove("hidden");
  }
})();
