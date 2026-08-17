"use strict";

/* =========================================================================
   1. PROGRAM DATA  (unchanged from the original program)
   Exercise tuple: [name, sets×reps, RIR, rest, tempo, muscles, why, cues, category]
   ========================================================================= */
const W = {
A:[
{name:"Day 1 — Upper Push + Pull",ex:[
["Barbell Bench Press","3 × 6–8","2","2–2.5 min","2-1-1","Chest, triceps, anterior delts","Primary upper-body strength movement.","Shoulder blades down/back; feet planted; bar toward lower-mid chest; don't bounce.","compound"],
["Barbell Bent-Over Row","3 × 6–10","2","2 min","2-1-1","Lats, rhomboids, traps, rear delts, biceps","High-value horizontal pull.","Brace hard; neutral spine; hips fixed; pull toward lower ribs.","compound"],
["Incline DB Press","2 × 8–12","1–2","60 sec","2-1-1","Upper chest, anterior delts, triceps","Adds chest volume.","Stable shoulder blades; elbows about 30–45° from torso.","accessory"],
["Chest-Supported DB Row","2 × 10–12","1–2","60 sec","2-1-1","Upper back, lats, rear delts","Back volume with lower-back recovery.","Chest supported; pull elbows toward hips.","accessory"],
["DB Lateral Raise","2 × 12–15","2","45 sec","2-1-2","Lateral delts","Shoulder-width development.","Light DBs; no swinging; raise in scapular plane.","accessory"]]},
{name:"Day 2 — Lower Quad/Knee + Core",ex:[
["Barbell Box Squat","3 × 6–8","2–3","2 min","3-1-1","Quads, glutes, adductors","Controlled squat depth and consistent mechanics.","Brace; knees track over toes; touch bench lightly; never crash onto it.","knee"],
["Reverse DB Lunge","2 × 8–10/leg","2–3","90 sec","3-1-1","Quads, glutes, hamstrings","Unilateral strength and knee/hip stability.","Step backward; stable front foot; knee follows toes; pain-free range.","knee"],
["Barbell Hip Thrust","3 × 8–12","1–2","90 sec","2-1-2","Glutes","Glute strength with pelvic control.","Ribs down; squeeze glutes; avoid lumbar hyperextension.","posterior"],
["Standing DB Calf Raise","2 × 10–15","1–2","45 sec","2-1-2","Calves","Calf and ankle strength.","Full comfortable stretch; pause at top; don't bounce.","accessory"],
["Dead Bug","2 × 6–8/side","controlled","30 sec","slow","Deep core","Trains ribcage-pelvis control.","Exhale; gently flatten lower back; move slowly.","core"]]},
{name:"Day 3 — Upper Pull + Arms",ex:[
["One-Arm DB Row","3 × 8–12/side","2","75–90 sec","2-1-1","Lats, rhomboids, traps, biceps","Excellent lat-focused pull.","Square hips; pull toward hip; don't rotate torso.","compound"],
["Incline DB Bench Press","3 × 8–10","2","90 sec","2-1-1","Upper chest, shoulders, triceps","Second chest exposure.","Don't let shoulders roll forward at bottom.","compound"],
["Barbell Romanian Deadlift — Light/Moderate","2 × 8–10","3","90 sec","3-1-1","Hamstrings, glutes, erectors","Posterior-chain exposure without a second heavy leg day.","Soft knees; hips back; bar close; neutral spine.","posterior"],
["Incline DB Curl","2 × 10–12","1–2","45 sec","2-1-2","Biceps","Long-length biceps stimulus.","Upper arm relatively fixed; no swing.","accessory"],
["DB Rear-Delt Raise","2 × 12–15","1–2","45 sec","2-1-2","Rear delts, upper back","Shoulder balance.","Light DBs; move arms rather than shrugging.","accessory"],
["DB Hammer Curl","2 × 8–12","1–2","45 sec","2-1-2","Brachialis, biceps, forearms","Arm thickness and grip.","Neutral wrist; elbows close.","accessory"]]},
{name:"Day 4 — Posterior Chain + Knee",ex:[
["Barbell Romanian Deadlift","3 × 6–8","2","2 min","3-1-1","Hamstrings, glutes","Primary posterior-chain strength movement.","Brace; hips back; bar close; stop when hamstrings limit depth.","posterior"],
["Front-Foot-Elevated Reverse Split Squat","2 × 8–10/leg","2–3","90 sec","3-1-1","Glutes, quads","Unilateral leg strength.","Stable front foot; knee follows toes; pain-free range.","knee"],
["Barbell Glute Bridge","2 × 10–15","1–2","60 sec","2-2-2","Glutes","Glute volume without another heavy hinge.","Ribs down; squeeze glutes; no lumbar hyperextension.","posterior"],
["Single-Leg Calf Raise Holding DB","2 × 10–15/side","1–2","30 sec","2-1-2","Calves","Unilateral calf and ankle control.","Stable foot; controlled full range.","accessory"],
["Side Plank","2 × 20–40 sec/side","controlled","30 sec","controlled","Obliques, lateral core, glute medius","Pelvic and trunk stability.","Straight line; squeeze glute; don't let hip sag.","core"]]},
{name:"Day 5 — Full Body Athletic Strength",ex:[
["Standing Barbell Overhead Press","3 × 6–8","2","2 min","2-1-1","Delts, triceps, upper chest","Fundamental overhead strength.","Glutes tight; ribs down; brace; bar travels vertically; no backbend.","compound"],
["Pendlay Row","3 × 6–8","2","2 min","controlled","Back, rear delts, biceps","Powerful horizontal pulling.","Neutral spine; torso fixed; bar starts from floor each rep.","compound"],
["Goblet Squat to Bench","2 × 10–12","3","75 sec","3-1-1","Quads, glutes","Low-load squat pattern and knee exposure.","Brace; knees track naturally; comfortable depth.","knee"],
["DB Lateral Raise","2 × 12–15","1–2","45 sec","2-1-2","Lateral delts","Shoulder-width development.","No swinging.","accessory"],
["Close-Grip Push-Up on Bench","2 × 8–15","2","45 sec","2-1-1","Triceps, chest","Scalable pressing volume.","Straight body; elbows about 30–45°; brace.","accessory"],
["Suitcase Hold","2 × 30–45 sec/side","controlled","30 sec","controlled","Obliques, grip, trunk","Athletic anti-lateral-flexion strength.","Stand tall; don't lean toward the weight.","core"]]}
],
B:[],
C:[]
};

// Week B/C keep the same movement patterns with exercise substitutions.
const substitutions = {
B:[
[["Incline DB Press","3 × 8–10","2","90 sec","2-1-1","Upper chest, anterior delts, triceps","Different pressing angle for moderate-rep hypertrophy.","Stable shoulder blades; elbows 30–45°.","compound"],["One-Arm DB Row","3 × 8–12","2","90 sec","2-1-1","Lats, upper back, biceps","Unilateral pull and stability.","Square hips; pull toward hip.","compound"],["Flat DB Press","2 × 10–12","1–2","60 sec","2-1-1","Chest, triceps","Additional chest volume.","Controlled bottom; shoulders packed.","accessory"],["Chest-Supported DB Row","2 × 10–12","1–2","60 sec","2-1-1","Upper back, lats","Low-back-friendly back volume.","Chest supported; pull elbows back.","accessory"],["DB Lateral Raise","2 × 12–15","1–2","45 sec","2-1-2","Lateral delts","Shoulder width.","No swinging.","accessory"]],
[["Goblet Squat to Bench","3 × 8–12","3","90 sec","3-1-1","Quads, glutes","Moderate-load controlled knee pattern.","Stable foot; knees track over toes; comfortable depth.","knee"],["Reverse DB Lunge","2 × 10/leg","2–3","90 sec","3-1-1","Quads, glutes, hamstrings","Unilateral stability.","Step back; controlled descent.","knee"],["DB Hip Thrust","3 × 10–12","1–2","90 sec","2-1-2","Glutes","Glute volume with dumbbell loading.","Ribs down; squeeze glutes.","posterior"],["Standing DB Calf Raise","2 × 12–15","1–2","45 sec","2-1-2","Calves","Calf strength.","Full comfortable range.","accessory"],["Dead Bug","2 × 8/side","controlled","30 sec","slow","Deep core","Bracing and pelvic control.","Exhale; lower back controlled.","core"]],
[["Chest-Supported DB Row","3 × 8–12","2","90 sec","2-1-1","Lats, upper back, rear delts","Supported horizontal pull.","Chest supported; controlled stretch.","compound"],["Flat DB Press","3 × 8–12","2","90 sec","2-1-1","Chest, triceps","Horizontal press variation.","Shoulders stable; controlled bottom.","compound"],["Barbell RDL — Light","2 × 8–10","3","90 sec","3-1-1","Hamstrings, glutes","Low-fatigue hinge.","Hips back; bar close.","posterior"],["DB Curl","2 × 10–15","1–2","45 sec","2-1-2","Biceps","Simple progressive arm work.","No swinging.","accessory"],["Rear-Delt Raise","2 × 12–15","1–2","45 sec","2-1-2","Rear delts","Shoulder balance.","Don't shrug.","accessory"],["Hammer Curl","2 × 10–12","1–2","45 sec","2-1-2","Brachialis, biceps","Arm thickness.","Neutral wrist.","accessory"]],
[["DB Romanian Deadlift","3 × 8–10","2","2 min","3-1-1","Hamstrings, glutes","Different loading profile for hinge.","Brace; hips back; neutral spine.","posterior"],["B-Stance RDL","2 × 8–10/side","2","90 sec","3-1-1","Hamstrings, glutes","Unilateral posterior-chain loading.","Most weight on front leg; hips square.","posterior"],["DB Glute Bridge","2 × 12–15","1–2","60 sec","2-2-2","Glutes","Glute volume.","Ribs down; no lumbar extension.","posterior"],["Single-Leg Calf Raise","2 × 12–15/side","1–2","30 sec","2-1-2","Calves","Ankle control.","Stable foot.","accessory"],["Side Plank","2 × 30–40 sec/side","controlled","30 sec","controlled","Obliques, glute medius","Trunk and pelvic stability.","No hip sag.","core"]],
[["Paused Barbell Bench","3 × 6–8","2","2 min","2-2-1","Chest, triceps, anterior delts","Pause improves control and force from the bottom.","Pause lightly on chest; stay braced.","compound"],["Barbell Row","3 × 8–10","2","2 min","2-1-1","Back, biceps, rear delts","Strong horizontal pull.","Brace; pull toward lower ribs.","compound"],["Goblet Squat","2 × 10–12","3","75 sec","3-1-1","Quads, glutes","Controlled low-load knee work.","Comfortable depth; stable foot.","knee"],["DB Lateral Raise","2 × 12–15","1–2","45 sec","2-1-2","Lateral delts","Shoulder width.","No swinging.","accessory"],["DB Overhead Triceps Extension","2 × 10–15","1–2","45 sec","2-1-2","Triceps","Direct triceps work.","Ribs down; elbows controlled.","accessory"],["Suitcase Hold","2 × 30–45 sec/side","controlled","30 sec","controlled","Obliques, grip, trunk","Anti-lateral-flexion strength.","Stand tall.","core"]]
],
C:[
[["Paused Barbell Bench","3 × 6–8","2","2 min","2-2-1","Chest, triceps, anterior delts","Paused strength variation.","Stable shoulder blades; pause without relaxing.","compound"],["Chest-Supported DB Row","3 × 8–10","2","90 sec","2-1-1","Upper back, lats","Supported pull with controlled reps.","Chest supported; pull toward hips.","compound"],["Low-Incline DB Press","2 × 10–12","1–2","60 sec","3-1-1","Upper chest, triceps","Longer eccentric for stimulus.","Controlled bottom; shoulders stable.","accessory"],["One-Arm DB Row","2 × 10/side","1–2","60 sec","2-2-1","Lats, upper back","Peak contraction emphasis.","Pause at top; no torso rotation.","accessory"],["DB Lateral Raise","2 × 12–15","1–2","45 sec","2-1-2","Lateral delts","Shoulder width.","No swing.","accessory"]],
[["Paused Goblet Squat to Bench","3 × 8–10","3","90 sec","3-2-1","Quads, glutes","Tempo and pause increase control without maximal load.","Pause gently; knees track toes; pain-free range.","knee"],["Reverse Split Squat","2 × 8–10/leg","2–3","90 sec","3-1-1","Quads, glutes","Controlled unilateral work.","Stable foot; comfortable depth.","knee"],["Barbell Hip Thrust — 2-sec squeeze","3 × 8–12","1–2","90 sec","2-2-2","Glutes","Peak contraction emphasis.","Ribs down; posterior pelvic control.","posterior"],["Calf Raise — 2-sec top pause","2 × 12–15","1–2","45 sec","2-2-2","Calves","Controlled calf strength.","Don't bounce.","accessory"],["Dead Bug","2 × 8/side","controlled","30 sec","slow","Deep core","Bracing and pelvic control.","Exhale; lower back controlled.","core"]],
[["One-Arm DB Row — 2-sec squeeze","3 × 8–12/side","2","75–90 sec","2-2-1","Lats, upper back, biceps","Peak contraction emphasis.","Pause at top; no rotation.","compound"],["Incline DB Press — 3-sec eccentric","3 × 8–10","2","90 sec","3-1-1","Upper chest, shoulders, triceps","Controlled eccentric increases difficulty without excessive load.","Shoulders packed; smooth bottom.","compound"],["Light DB RDL","2 × 10","3","90 sec","3-1-1","Hamstrings, glutes","Technique-focused hinge.","Hips back; neutral spine.","posterior"],["Incline DB Curl — 3-sec eccentric","2 × 10–12","1–2","45 sec","3-1-2","Biceps","Controlled long-length work.","No swing.","accessory"],["Rear-Delt Raise","2 × 12–15","1–2","45 sec","2-1-2","Rear delts","Shoulder balance.","No shrug.","accessory"],["Hammer Curl","2 × 10–12","1–2","45 sec","2-1-2","Brachialis, biceps","Arm thickness.","Neutral wrist.","accessory"]],
[["Barbell RDL — 3-sec eccentric","3 × 6–8","2","2 min","3-1-1","Hamstrings, glutes","Controlled hinge strength.","Bar close; hips back; neutral spine.","posterior"],["Reverse Lunge — controlled eccentric","2 × 8–10/leg","2–3","90 sec","3-1-1","Quads, glutes","Controlled unilateral knee loading.","Stable foot; knee tracks toes.","knee"],["Barbell Glute Bridge — 2-sec squeeze","2 × 12–15","1–2","60 sec","2-2-2","Glutes","Glute contraction without heavy loading.","Ribs down; no lumbar extension.","posterior"],["Calf Raise","2 × 12–15","1–2","45 sec","2-1-2","Calves","Calf strength.","Full comfortable range.","accessory"],["Side Plank","2 × 30–45 sec/side","controlled","30 sec","controlled","Obliques, glute medius","Lateral trunk and pelvic stability.","No hip sag.","core"]],
[["Standing DB Overhead Press","3 × 8–10","2","90 sec","2-1-1","Delts, triceps","Moderate-rep overhead strength.","Ribs down; glutes tight; no backbend.","compound"],["Pendlay Row","3 × 6–8","2","2 min","controlled","Back, rear delts, biceps","Powerful horizontal pull.","Neutral spine; bar starts from floor.","compound"],["Goblet Squat — 3-sec eccentric","2 × 10","3","75 sec","3-1-1","Quads, glutes","Controlled knee exposure.","Pain-free depth; stable foot.","knee"],["DB Lateral Raise","2 × 12–15","1–2","45 sec","2-1-2","Lateral delts","Shoulder width.","No swing.","accessory"],["Close-Grip Bench Press","2 × 8–10","2","60 sec","2-1-1","Triceps, chest","Triceps-focused compound.","Shoulder blades stable; elbows controlled.","accessory"],["Suitcase Hold","2 × 30–45 sec/side","controlled","30 sec","controlled","Obliques, grip, trunk","Athletic trunk stability.","Stand tall; don't lean.","core"]]
]
};

function normalizeProgram(){
  if(!W.B.length) W.B = substitutions.B.map((exs,i)=>({name:W.A[i].name,ex:exs}));
  if(!W.C.length) W.C = substitutions.C.map((exs,i)=>({name:W.A[i].name,ex:exs}));
}
normalizeProgram();

/* =========================================================================
   2. DAY-SPECIFIC WARM-UPS (5–7 min) AND COOLDOWNS (3–5 min)
   These never consume main workout time.
   ========================================================================= */
const WARMUPS = [
  { title:"Upper push + pull prep",
    focus:"Prepares the shoulders, scapula, chest, upper back and elbows before pressing and rowing.",
    items:[
      {name:"Arm & shoulder circles",secs:45,dose:"10 small, then 10 large, each direction",cue:"Loose and easy. Keep the neck relaxed and stay well inside a comfortable range."},
      {name:"Scapular pulls & scap push-ups",secs:45,dose:"10 + 10 reps",cue:"Move the shoulder blades only — arms stay straight. Squeeze back, then push away."},
      {name:"Thoracic rotations",secs:45,dose:"6 per side",cue:"Ribs down. Rotate through the upper back, not the lower back. Exhale at the end of each rep."},
      {name:"Light dumbbell rows",secs:45,dose:"12 reps, very light",cue:"Pull the elbow toward the hip and pause for a second. No torso swing."},
      {name:"Empty bar / very light press",secs:60,dose:"10–12 reps",cue:"Groove the bar path. Shoulder blades set down and back, feet planted."},
      {name:"Warm-up set 1 — first compound",secs:60,dose:"8 reps @ ~50% of your working weight",cue:"Smooth and easy. This is practice, not effort."},
      {name:"Warm-up set 2 — first compound",secs:60,dose:"4 reps @ ~70% of your working weight",cue:"Confident bar speed with full control. Stop well short of failure."}
    ]},
  { title:"Lower quad + knee prep",
    focus:"Knee tracking, stable foot position, glute activation and controlled range of motion — no aggressive stretching.",
    items:[
      {name:"Ankle rocks (optional)",secs:45,dose:"8 per side",cue:"Drive the knee over the middle of the foot with the heel down. Skip this if it pinches."},
      {name:"Bodyweight squat",secs:60,dose:"10 reps to comfortable depth",cue:"Only go as deep as feels good today. Whole foot on the floor, knees track over the toes."},
      {name:"Hip hinge practice",secs:45,dose:"10 reps",cue:"Hips back, ribs down, neutral spine, soft knees. Feel the hamstrings, not the lower back."},
      {name:"Glute bridge",secs:60,dose:"12 reps with a 2-second squeeze",cue:"Ribs down, drive through the heels and squeeze the glutes at the top."},
      {name:"Controlled reverse lunge",secs:60,dose:"6 per side, bodyweight",cue:"Step back, control the descent, keep the front foot flat and stable. Pain-free range only."},
      {name:"Warm-up set 1 — first squat movement",secs:60,dose:"8 reps, empty bar or very light",cue:"Practice the groove: brace, sit back, knees track over the toes."},
      {name:"Warm-up set 2 — first squat movement",secs:60,dose:"5 reps @ ~60% of your working weight",cue:"Controlled down, confident up. Stop immediately if anything feels sharp."}
    ]},
  { title:"Upper pull prep",
    focus:"Scapular control, thoracic mobility and elbow prep before rowing, pressing and the light hinge.",
    items:[
      {name:"Shoulder & scapular circles",secs:45,dose:"10 each direction",cue:"Relaxed. Let the shoulder blades move freely around the ribcage."},
      {name:"Scapular retractions / band pull-aparts",secs:45,dose:"12 reps",cue:"Squeeze the shoulder blades together without shrugging toward the ears."},
      {name:"Thoracic mobility",secs:45,dose:"6 per side",cue:"Open through the upper back and breathe out at the end range. Keep the ribs down."},
      {name:"Light dumbbell rows",secs:60,dose:"12 reps very light, 1-second pause",cue:"Pull the elbow toward the hip. Square hips, no torso rotation."},
      {name:"Light pressing prep",secs:45,dose:"10 reps light",cue:"Shoulders packed. Smooth, controlled bottom position."},
      {name:"Hip hinge practice",secs:45,dose:"8 reps",cue:"Prep for the RDL later: hips back, bar close, neutral spine, soft knees."},
      {name:"Warm-up set 1 — first compound",secs:60,dose:"8 reps @ ~50% of your working weight",cue:"Easy and clean. Build the pattern before the load."},
      {name:"Warm-up set 2 — first compound",secs:55,dose:"4 reps @ ~70% of your working weight",cue:"Full control, well short of failure."}
    ]},
  { title:"Posterior chain prep",
    focus:"Bracing, neutral spine, hip movement and knee comfort before hinging.",
    items:[
      {name:"Glute bridge",secs:60,dose:"12 reps with a 2-second squeeze",cue:"Ribs down, gentle posterior tilt, squeeze the glutes at the top."},
      {name:"Bodyweight hip hinge",secs:45,dose:"10 reps",cue:"Hands on the hips. Push the hips back and keep the spine neutral throughout."},
      {name:"Controlled RDL pattern",secs:60,dose:"8 reps with a dowel or empty bar",cue:"Bar stays close to the legs. Brace first, then let the hamstrings load."},
      {name:"Gentle hamstring movement",secs:45,dose:"8 per side, easy range",cue:"Light and controlled — never stretch into pain or a strong pull."},
      {name:"Reverse lunge / split squat pattern",secs:60,dose:"6 per side, bodyweight",cue:"Stable front foot, comfortable knee range, controlled descent."},
      {name:"Warm-up set 1 — first hinge",secs:60,dose:"8 reps, empty bar or very light",cue:"Brace before every rep. The hips move, the spine does not."},
      {name:"Warm-up set 2 — first hinge",secs:60,dose:"5 reps @ ~60% of your working weight",cue:"Controlled eccentric. Stop where the hamstrings limit the range."}
    ]},
  { title:"Full body prep",
    focus:"A little of everything: squat pattern, hinge pattern, shoulders, press and pull.",
    items:[
      {name:"Bodyweight squat",secs:60,dose:"10 reps to comfortable depth",cue:"Knees track over the toes, whole foot planted, controlled tempo."},
      {name:"Hip hinge",secs:45,dose:"10 reps",cue:"Hips back, ribs down, neutral spine."},
      {name:"Shoulder mobility",secs:45,dose:"10 circles + 10 pull-aparts",cue:"Relaxed range, no shrugging, easy breathing."},
      {name:"Light press",secs:45,dose:"10 reps, empty bar or light dumbbells",cue:"Glutes tight, ribs down, bar travels vertically. No leaning back."},
      {name:"Light row",secs:45,dose:"12 reps light",cue:"Pull to the lower ribs and control the return."},
      {name:"Warm-up set 1 — first compound",secs:60,dose:"8 reps @ ~50% of your working weight",cue:"Groove the pattern before adding load."},
      {name:"Warm-up set 2 — first compound",secs:60,dose:"4 reps @ ~70% of your working weight",cue:"Sharp but easy. Stop well short of failure."}
    ]}
];

const COOLDOWNS = [
  { title:"Upper body cooldown",
    items:[
      {name:"Relaxed breathing",secs:60,dose:"6 slow breaths",cue:"Make the exhale longer than the inhale. Let the shoulders drop."},
      {name:"Gentle chest opening",secs:45,dose:"20–30 sec per side",cue:"Easy doorway or wall opening. Comfortable range — never force it."},
      {name:"Gentle lat mobility",secs:45,dose:"20–30 sec per side",cue:"Hold a rack, sit the hips back and breathe into the ribs."},
      {name:"Easy shoulder movement",secs:45,dose:"10 slow circles each way",cue:"Loose and completely pain-free. Just restoring easy movement."},
      {name:"Neck & upper trap release",secs:30,dose:"15 sec per side",cue:"Very light. Simply let the tension go."}
    ]},
  { title:"Lower body cooldown",
    items:[
      {name:"Easy walking in place",secs:60,dose:"Relaxed pace",cue:"Keep moving gently and let the heart rate settle."},
      {name:"Relaxed breathing",secs:60,dose:"6 slow breaths",cue:"Long exhale. Let the hips and lower back settle."},
      {name:"Gentle quad & hip flexor mobility",secs:45,dose:"20–30 sec per side",cue:"Stand tall with the glutes lightly engaged. No aggressive stretching."},
      {name:"Easy hamstring mobility",secs:45,dose:"20–30 sec per side",cue:"Keep a soft knee and stop well before any strong pull."},
      {name:"Gentle calf & ankle movement",secs:30,dose:"10 slow raises or ankle rocks",cue:"Comfortable range only."}
    ]},
  { title:"Upper body cooldown",
    items:[
      {name:"Relaxed breathing",secs:60,dose:"6 slow breaths",cue:"Longer exhale than inhale. Let the shoulders and jaw relax."},
      {name:"Gentle lat mobility",secs:45,dose:"20–30 sec per side",cue:"Hold a rack, sit the hips back and breathe into the ribs."},
      {name:"Gentle chest & biceps opening",secs:45,dose:"20–30 sec per side",cue:"Easy wall opening with a soft elbow. Never force it."},
      {name:"Easy shoulder movement",secs:45,dose:"10 slow circles each way",cue:"Loose, pain-free movement to finish."},
      {name:"Gentle hamstring reset",secs:30,dose:"20–30 sec",cue:"Soft knee, easy range — the hinge work is done for today."}
    ]},
  { title:"Posterior chain cooldown",
    items:[
      {name:"Easy walking in place",secs:60,dose:"Relaxed pace",cue:"Let the hips and lower back unload while the heart rate settles."},
      {name:"Relaxed breathing",secs:60,dose:"6 slow breaths",cue:"Long exhale, ribs down. Let the brace fully release."},
      {name:"Easy hamstring mobility",secs:45,dose:"20–30 sec per side",cue:"Soft knee. Stop well before any strong pull — no aggressive stretching."},
      {name:"Gentle hip flexor & glute mobility",secs:45,dose:"20–30 sec per side",cue:"Stand tall, glutes lightly on, comfortable range only."},
      {name:"Gentle calf & ankle movement",secs:30,dose:"10 slow raises or ankle rocks",cue:"Easy, comfortable range."}
    ]},
  { title:"Full body cooldown",
    items:[
      {name:"Easy walking in place",secs:45,dose:"Relaxed pace",cue:"Keep moving gently and let the breathing settle."},
      {name:"Relaxed breathing",secs:60,dose:"6 slow breaths",cue:"Long exhale. Shoulders down, ribs down, jaw relaxed."},
      {name:"Gentle chest & shoulder mobility",secs:45,dose:"20–30 sec per side",cue:"Comfortable opening, never forced."},
      {name:"Gentle hip & quad mobility",secs:45,dose:"20–30 sec per side",cue:"Stand tall with the glutes lightly engaged."},
      {name:"Easy hamstring mobility",secs:45,dose:"20–30 sec per side",cue:"Soft knee, easy range. Finish feeling comfortable, not stretched out."}
    ]}
];

/* =========================================================================
   2b. MOVEMENT DEMONSTRATIONS
   Animated SVG stick figures, one per movement pattern, built from two or three
   poses interpolated with SMIL. No image files and no network requests, so the
   app stays a single self-contained static page.
   Coordinates are in a 100x100 viewBox; the floor sits at y=92.
   body   = neck -> hip -> knee -> ankle
   arm    = shoulder -> elbow -> hand
   load   = the barbell / dumbbell, drawn at the hand
   ========================================================================= */
const DEMOS = {
  squat:{
    title:"Squat pattern", dur:"3s",
    steps:["Brace, then push the hips back and let the knees bend.",
           "Keep the whole foot planted and the knees tracking over the toes.",
           "Descend to a comfortable depth, then stand up through hips and legs together."],
    head:{cx:["45","51","45"], cy:["17","24","17"]},
    body:["45,25 45,53 45,71 45,87 55,90","51,31 38,59 57,72 46,87 56,90","45,25 45,53 45,71 45,87 55,90"],
    arm:["45,29 38,40 43,48","51,35 45,48 49,54","45,29 38,40 43,48"],
    load:{cx:["43","49","43"], cy:["48","54","48"], r:4.5}
  },
  hinge:{
    title:"Hip hinge pattern", dur:"3s",
    steps:["Brace, soften the knees and push the hips straight back.",
           "Keep the bar close to the legs and the spine neutral throughout.",
           "Stop where the hamstrings limit you, then drive the hips forward to stand."],
    head:{cx:["45","67","45"], cy:["17","33","17"]},
    body:["45,25 45,53 45,71 45,87 55,90","61,37 39,53 43,71 45,87 55,90","45,25 45,53 45,71 45,87 55,90"],
    arm:["45,29 45,43 45,57","59,41 57,55 55,67","45,29 45,43 45,57"],
    load:{cx:["45","55","45"], cy:["57","67","57"], r:4.5}
  },
  lunge:{
    title:"Lunge / split squat pattern", dur:"3s",
    steps:["Step back and lower under control, torso tall.",
           "Keep the front foot flat and the knee tracking over the toes.",
           "Use a pain-free range, then drive back up through the front leg."],
    head:{cx:["45","47","45"], cy:["17","21","17"]},
    body:["45,25 45,53 45,71 45,87 55,90","47,29 45,57 57,73 55,87 64,90","45,25 45,53 45,71 45,87 55,90"],
    arm:["45,29 43,43 43,57","47,33 45,47 45,61","45,29 43,43 43,57"],
    load:{cx:["43","45","43"], cy:["57","61","57"], r:4.5}
  },
  bridge:{
    title:"Hip thrust / bridge pattern", dur:"2.6s",
    steps:["Ribs down and a gentle posterior pelvic tilt before you lift.",
           "Drive through the heels and squeeze the glutes at the top.",
           "Stop at a straight line — no arching the lower back."],
    head:{cx:["23","23","23"], cy:["73","73","73"]},
    body:["30,74 52,84 66,70 66,88 74,90","30,74 52,65 66,63 66,88 74,90","30,74 52,84 66,70 66,88 74,90"],
    arm:["30,76 40,84 48,87","30,76 40,79 48,79","30,76 40,84 48,87"],
    load:{cx:["52","52","52"], cy:["78","59","78"], r:4.5}
  },
  benchPress:{
    title:"Horizontal press pattern", dur:"3s",
    steps:["Set the shoulder blades down and back, feet planted.",
           "Lower under control toward the lower-mid chest.",
           "Press back up without letting the shoulders roll forward."],
    prop:[22,62,52,6],
    head:{cx:["29","29","29"], cy:["55","55","55"]},
    body:["36,57 58,59 70,70 74,86 81,89","36,57 58,59 70,70 74,86 81,89","36,57 58,59 70,70 74,86 81,89"],
    arm:["36,57 38,45 40,33","36,57 27,51 40,51","36,57 38,45 40,33"],
    load:{cx:["40","40","40"], cy:["33","51","33"], r:4.5}
  },
  pushup:{
    title:"Push-up pattern", dur:"3s",
    steps:["Hands on the bench, body in one straight line from head to heels.",
           "Brace the trunk and lower with the elbows about 30–45° from the body.",
           "Press away without letting the hips sag or pike."],
    prop:[10,56,24,6],
    head:{cx:["37","37","37"], cy:["43","49","43"]},
    body:["42,56 60,68 72,77 84,86 90,88","42,62 60,72 72,80 84,88 90,90","42,56 60,68 72,77 84,86 90,88"],
    arm:["42,56 32,58 22,58","42,62 33,66 22,58","42,56 32,58 22,58"],
    load:null
  },
  overheadPress:{
    title:"Overhead press pattern", dur:"3s",
    steps:["Glutes tight, ribs down, brace before you press.",
           "Drive the bar straight up — no leaning back to finish the rep.",
           "Lower under control back to the shoulders."],
    head:{cx:["45","45","45"], cy:["19","19","19"]},
    body:["45,27 45,54 45,71 45,87 55,90","45,27 45,54 45,71 45,87 55,90","45,27 45,54 45,71 45,87 55,90"],
    arm:["45,29 35,38 41,30","45,29 48,18 49,7","45,29 35,38 41,30"],
    load:{cx:["41","49","41"], cy:["30","7","30"], r:4.5}
  },
  row:{
    title:"Horizontal pull pattern", dur:"3s",
    steps:["Hinge forward, brace hard and hold a neutral spine.",
           "Pull the elbow toward the hip — the torso stays still.",
           "Control the weight all the way back down."],
    head:{cx:["69","69","69"], cy:["35","35","35"]},
    body:["63,39 41,53 43,71 45,87 55,90","63,39 41,53 43,71 45,87 55,90","63,39 41,53 43,71 45,87 55,90"],
    arm:["61,41 61,57 61,73","61,41 68,53 61,59","61,41 61,57 61,73"],
    load:{cx:["61","61","61"], cy:["73","59","73"], r:4.5}
  },
  lateralRaise:{
    title:"Raise pattern", dur:"3s",
    steps:["Light dumbbells, no swinging or body English.",
           "Raise smoothly to about shoulder height.",
           "Lower slowly — the eccentric is the point."],
    head:{cx:["45","45","45"], cy:["17","17","17"]},
    body:["45,25 45,53 45,71 45,87 55,90","45,25 45,53 45,71 45,87 55,90","45,25 45,53 45,71 45,87 55,90"],
    arm:["45,29 45,43 45,57","45,29 33,35 21,31","45,29 45,43 45,57"],
    load:{cx:["45","21","45"], cy:["57","31","57"], r:4.5}
  },
  curl:{
    title:"Curl pattern", dur:"3s",
    steps:["Upper arm stays relatively fixed — no swinging.",
           "Curl up under control and keep the wrist neutral.",
           "Lower all the way back to a full stretch."],
    head:{cx:["45","45","45"], cy:["17","17","17"]},
    body:["45,25 45,53 45,71 45,87 55,90","45,25 45,53 45,71 45,87 55,90","45,25 45,53 45,71 45,87 55,90"],
    arm:["45,29 45,43 45,57","45,29 45,43 36,31","45,29 45,43 45,57"],
    load:{cx:["45","36","45"], cy:["57","31","57"], r:4.5}
  },
  calfRaise:{
    title:"Calf raise pattern", dur:"2.6s",
    steps:["Stable foot, comfortable full stretch at the bottom.",
           "Rise onto the toes and pause at the top.",
           "Lower slowly — never bounce out of the bottom."],
    head:{cx:["45","45","45"], cy:["17","8","17"]},
    body:["45,25 45,53 45,71 45,87 57,91","45,16 45,44 45,62 45,76 57,91","45,25 45,53 45,71 45,87 57,91"],
    arm:["45,29 45,43 45,58","45,20 45,34 45,49","45,29 45,43 45,58"],
    load:{cx:["45","45","45"], cy:["63","54","63"], r:4.5}
  },
  sidePlank:{
    title:"Side plank pattern", dur:"3s",
    steps:["Elbow under the shoulder, body in one long straight line.",
           "Squeeze the glute and keep the ribs stacked over the pelvis.",
           "Hold — do not let the hip sag toward the floor."],
    head:{cx:["25","25","25"], cy:["51","46","51"]},
    body:["31,57 51,72 63,80 75,87 81,89","31,52 51,66 63,74 75,83 81,85","31,57 51,72 63,80 75,87 81,89"],
    arm:["31,57 29,79 39,86","31,52 29,79 39,86","31,57 29,79 39,86"],
    load:null
  },
  deadBug:{
    title:"Dead bug pattern", dur:"3.4s",
    steps:["Ribs down, brace, and gently flatten the lower back.",
           "Extend the opposite arm and leg slowly while you exhale.",
           "Only go as far as you can without the lower back lifting."],
    head:{cx:["26","26","26"], cy:["84","84","84"]},
    body:["34,84 58,84 62,62 48,60 42,59","34,84 58,84 66,68 84,74 90,75","34,84 58,84 62,62 48,60 42,59"],
    arm:["34,82 30,68 30,54","34,82 22,72 12,66","34,82 30,68 30,54"],
    load:null
  },
  carry:{
    title:"Loaded carry / hold pattern", dur:"2.4s",
    steps:["Stand tall — do not lean toward the weight.",
           "Brace the trunk and keep the shoulders level.",
           "Breathe steadily for the prescribed time."],
    head:{cx:["45","45","45"], cy:["17","15","17"]},
    body:["45,25 45,53 45,71 45,87 55,90","45,23 45,51 45,69 45,87 55,90","45,25 45,53 45,71 45,87 55,90"],
    arm:["45,29 45,43 45,59","45,27 45,41 45,57","45,29 45,43 45,59"],
    load:{cx:["45","45","45"], cy:["64","62","64"], r:4.5}
  },
  generic:{
    title:"Movement pattern", dur:"2.6s",
    steps:["Brace before the first rep and set your position.",
           "Move under control through a comfortable range.",
           "Keep the tempo steady and stop short of failure."],
    head:{cx:["45","45","45"], cy:["17","20","17"]},
    body:["45,25 45,53 45,71 45,87 55,90","45,28 45,56 45,72 45,87 55,90","45,25 45,53 45,71 45,87 55,90"],
    arm:["45,29 43,43 43,57","45,32 43,46 43,60","45,29 43,43 43,57"],
    load:{cx:["43","43","43"], cy:["57","60","57"], r:4.5}
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
  if(/overhead press/.test(n)) return "overheadPress";
  if(/bench|press/.test(n)) return "benchPress";
  if(/lateral raise|rear-delt|rear delt/.test(n)) return "lateralRaise";
  if(/curl/.test(n)) return "curl";
  if(/calf/.test(n)) return "calfRaise";
  if(/plank/.test(n)) return "sidePlank";
  if(/dead bug/.test(n)) return "deadBug";
  if(/suitcase|hold/.test(n)) return "carry";
  return "generic";
}

function demoSvg(demo){
  const anim = (attr, values) =>
    '<animate attributeName="' + attr + '" values="' + values.join(";") +
    '" dur="' + demo.dur + '" repeatCount="indefinite" calcMode="spline" ' +
    'keySplines=".4 0 .2 1;.4 0 .2 1" keyTimes="0;0.5;1"></animate>';
  let svg = '<svg viewBox="0 0 100 100" class="demo-svg" role="img" aria-label="' +
    escapeHtml(demo.title) + ' animation">';
  svg += '<line class="demo-ground" x1="8" y1="92" x2="92" y2="92"></line>';
  if(demo.prop){
    svg += '<rect class="demo-prop" x="' + demo.prop[0] + '" y="' + demo.prop[1] +
      '" width="' + demo.prop[2] + '" height="' + demo.prop[3] + '" rx="2"></rect>';
  }
  svg += '<circle class="demo-head" r="6" cx="' + demo.head.cx[0] + '" cy="' + demo.head.cy[0] + '">' +
    anim("cx", demo.head.cx) + anim("cy", demo.head.cy) + "</circle>";
  svg += '<polyline class="demo-line" points="' + demo.body[0] + '">' + anim("points", demo.body) + "</polyline>";
  svg += '<polyline class="demo-line" points="' + demo.arm[0] + '">' + anim("points", demo.arm) + "</polyline>";
  if(demo.load){
    svg += '<circle class="demo-load" r="' + (demo.load.r || 5) + '" cx="' + demo.load.cx[0] +
      '" cy="' + demo.load.cy[0] + '">' + anim("cx", demo.load.cx) + anim("cy", demo.load.cy) + "</circle>";
  }
  return svg + "</svg>";
}

/* Shared posture / pelvic-control finisher. Runs after the main workout and
   before the cooldown, and never counts toward the 45 minutes. Deliberately
   light: this is control work, not another working set. */
const FINISHER = {
  title:"Posture & pelvic control",
  items:[
    {name:"Dead bug with breathing",secs:60,dose:"6–8 per side, slow",cue:"Ribs down, brace, then move. Exhale as the leg lowers and keep the lower back quiet."},
    {name:"Glute bridge — posterior pelvic tilt",secs:60,dose:"10 reps with a 2-second squeeze",cue:"Tuck the pelvis gently first, then squeeze the glutes. No arching at the top."},
    {name:"Side plank",secs:60,dose:"20–30 sec per side",cue:"Long straight line. Keep the ribs stacked over the pelvis and don't let the hip sag."},
    {name:"Bird dog",secs:60,dose:"6–8 per side",cue:"Move slowly without rotating the torso. Reach long rather than lifting high."},
    {name:"Gentle hip flexor mobility",secs:45,dose:"20–30 sec per side",cue:"Easy range with the glutes lightly engaged. Never push into pain."}
  ]
};
