"use strict";

/* =========================================================================
   1. PROGRAM DATA
   Loaded at runtime from assets/program.json (fetch, no backend) so the
   workouts/warm-ups/cooldowns/finisher can be edited without touching code.
   Exercise tuple: [name, sets×reps, RIR, rest, tempo, muscles, why, cues, category]
   ========================================================================= */
let W = {A:[], B:[], C:[]};
let substitutions = {B:[], C:[]};
let WARMUPS = [];
let COOLDOWNS = [];
let FINISHER = {title:"", items:[]};
let OVERRIDES = {};
let programDataReady = false;

/* Each substitution day is normally a bare exercise-tuple array, reusing
   Week A's day name. A day can instead be {name, ex} to give a variation
   its own name when the exercises no longer match the shared theme. */
function normalizeProgram(){
  if(!W.B.length) W.B = substitutions.B.map((exs,i)=>
    ({name:(exs && exs.name) || W.A[i].name, ex:(exs && exs.ex) || exs}));
  if(!W.C.length) W.C = substitutions.C.map((exs,i)=>
    ({name:(exs && exs.name) || W.A[i].name, ex:(exs && exs.ex) || exs}));
}

function loadProgramData(){
  return fetch("assets/program.json")
    .then(function(res){
      if(!res.ok) throw new Error("program.json HTTP " + res.status);
      return res.json();
    })
    .then(function(data){
      W = {A:data.week.A, B:[], C:[]};
      substitutions = data.substitutions;
      WARMUPS = data.warmups;
      COOLDOWNS = data.cooldowns;
      FINISHER = data.finisher;
      OVERRIDES = data.overrides || {};
      normalizeProgram();
      programDataReady = true;
    });
}


/* =========================================================================
   2b. MOVEMENT EXPLANATIONS
   Plain-language, step-by-step explanation for each movement pattern, shown
   in a simple popup — no animation or image, so it always just works.
   ========================================================================= */
const DEMOS = {
  squat:{
    title:"Squat pattern",
    steps:["Brace, then push the hips back and let the knees bend.",
           "Keep the whole foot planted and the knees tracking over the toes.",
           "Descend to a comfortable depth, then stand up through hips and legs together."]
  },
  hinge:{
    title:"Hip hinge pattern",
    steps:["Brace, soften the knees and push the hips straight back.",
           "Keep the bar close to the legs and the spine neutral throughout.",
           "Stop where the hamstrings limit you, then drive the hips forward to stand."]
  },
  lunge:{
    title:"Lunge / split squat pattern",
    steps:["Step back and lower under control, torso tall.",
           "Keep the front foot flat and the knee tracking over the toes.",
           "Use a pain-free range, then drive back up through the front leg."]
  },
  bridge:{
    title:"Hip thrust / bridge pattern",
    steps:["Ribs down and a gentle posterior pelvic tilt before you lift.",
           "Drive through the heels and squeeze the glutes at the top.",
           "Stop at a straight line — no arching the lower back."]
  },
  benchPress:{
    title:"Horizontal press pattern",
    steps:["Set the shoulder blades down and back, feet planted.",
           "Lower under control toward the lower-mid chest.",
           "Press back up without letting the shoulders roll forward."]
  },
  pushup:{
    title:"Push-up pattern",
    steps:["Hands on the bench, body in one straight line from head to heels.",
           "Brace the trunk and lower with the elbows about 30–45° from the body.",
           "Press away without letting the hips sag or pike."]
  },
  overheadPress:{
    title:"Overhead press pattern",
    steps:["Glutes tight, ribs down, brace before you press.",
           "Drive the bar straight up — no leaning back to finish the rep.",
           "Lower under control back to the shoulders."]
  },
  row:{
    title:"Horizontal pull pattern",
    steps:["Hinge forward, brace hard and hold a neutral spine.",
           "Pull the elbow toward the hip — the torso stays still.",
           "Control the weight all the way back down."]
  },
  lateralRaise:{
    title:"Raise pattern",
    steps:["Light dumbbells, no swinging or body English.",
           "Raise smoothly to about shoulder height.",
           "Lower slowly — the eccentric is the point."]
  },
  curl:{
    title:"Curl pattern",
    steps:["Upper arm stays relatively fixed — no swinging.",
           "Curl up under control and keep the wrist neutral.",
           "Lower all the way back to a full stretch."]
  },
  closeGripPress:{
    title:"Close-grip triceps press pattern",
    steps:["Elbows stay narrow and pointed forward, not flared out.",
           "Lower the bar toward your forehead or nose, not the chest.",
           "Press back up and slightly back over the shoulders."]
  },
  kickback:{
    title:"Triceps kickback pattern",
    steps:["Hinge forward with a flat back, upper arm pinned to your side.",
           "Extend the elbow straight back until the arm is fully straight.",
           "Lower under control — the upper arm doesn't move, only the forearm."]
  },
  rollout:{
    title:"Ab rollout pattern",
    steps:["Brace hard before you move — this is an anti-extension core exercise.",
           "Roll out slowly, keeping ribs down so the lower back doesn't arch.",
           "Only roll as far as you can control back to the start."]
  },
  sideBend:{
    title:"Side bend pattern",
    steps:["Stand tall with the weight at your side, not out in front.",
           "Bend directly sideways at the waist, not forward or backward.",
           "Return to upright under control without twisting the torso."]
  },
  calfRaise:{
    title:"Calf raise pattern",
    steps:["Stable foot, comfortable full stretch at the bottom.",
           "Rise onto the toes and pause at the top.",
           "Lower slowly — never bounce out of the bottom."]
  },
  sidePlank:{
    title:"Side plank pattern",
    steps:["Elbow under the shoulder, body in one long straight line.",
           "Squeeze the glute and keep the ribs stacked over the pelvis.",
           "Hold — do not let the hip sag toward the floor."]
  },
  deadBug:{
    title:"Dead bug pattern",
    steps:["Ribs down, brace, and gently flatten the lower back.",
           "Extend the opposite arm and leg slowly while you exhale.",
           "Only go as far as you can without the lower back lifting."]
  },
  carry:{
    title:"Loaded carry / hold pattern",
    steps:["Stand tall — do not lean toward the weight.",
           "Brace the trunk and keep the shoulders level.",
           "Breathe steadily for the prescribed time."]
  },
  generic:{
    title:"Movement pattern",
    steps:["Brace before the first rep and set your position.",
           "Move under control through a comfortable range.",
           "Keep the tempo steady and stop short of failure."]
  }
};

function demoKeyFor(exercise){
  const n = String(exercise[0] || "").toLowerCase();
  if(/push-up|pushup/.test(n)) return "pushup";
  if(/thrust|bridge/.test(n)) return "bridge";
  if(/romanian|rdl|deadlift/.test(n)) return "hinge";
  if(/lunge|split squat/.test(n)) return "lunge";
  if(/squat/.test(n)) return "squat";
  if(/row/.test(n)) return "row";
  if(/curl/.test(n)) return "curl";
  if(/kickback/.test(n)) return "kickback";
  if(/rollout/.test(n)) return "rollout";
  if(/side bend/.test(n)) return "sideBend";
  if(/california press|skull crusher|jm press/.test(n)) return "closeGripPress";
  if(/overhead press/.test(n)) return "overheadPress";
  if(/bench|press/.test(n)) return "benchPress";
  if(/lateral raise|rear-delt|rear delt/.test(n)) return "lateralRaise";
  if(/calf/.test(n)) return "calfRaise";
  if(/plank/.test(n)) return "sidePlank";
  if(/dead bug/.test(n)) return "deadBug";
  if(/suitcase|hold/.test(n)) return "carry";
  return "generic";
}

/* Plain-language "how to do it" block, shared by the main exercise popup
   and the lightweight warm-up/finisher/cooldown popup. */
function demoStepsHtml(key){
  const demo = DEMOS[key] || DEMOS.generic;
  return '<div class="mini-card"><span class="label">' + escapeHtml(demo.title) + '</span><ol class="steps">' +
    demo.steps.map(function(step){ return "<li>" + escapeHtml(step) + "</li>"; }).join("") +
    "</ol></div>";
}
