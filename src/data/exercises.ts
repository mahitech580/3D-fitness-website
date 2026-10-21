export type ExerciseCategory = 'Strength' | 'Conditioning' | 'Mobility';
export type TrainingGoal = 'Strength' | 'Muscle' | 'Conditioning' | 'Mobility';
export type GearOption = 'Bodyweight' | 'Dumbbells' | 'Resistance bands' | 'Full gym';

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  focus: string;
  gear: GearOption[];
  goals: TrainingGoal[];
  sets: string;
  reps: string;
  rest: string;
  cue: string;
  duration: number;
};

export const EXERCISES: Exercise[] = [
  { id: 'squat', name: 'Bodyweight squat', category: 'Strength', focus: 'Lower body', gear: ['Bodyweight'], goals: ['Strength', 'Muscle', 'Conditioning'], sets: '3', reps: '10–15', rest: '60 sec', cue: 'Keep your whole foot grounded and move with control.', duration: 4 },
  { id: 'pushup', name: 'Push-up', category: 'Strength', focus: 'Chest · shoulders', gear: ['Bodyweight'], goals: ['Strength', 'Muscle'], sets: '3', reps: '6–12', rest: '60 sec', cue: 'Keep your trunk braced and elbows at a comfortable angle.', duration: 4 },
  { id: 'reverse-lunge', name: 'Reverse lunge', category: 'Strength', focus: 'Legs · balance', gear: ['Bodyweight', 'Dumbbells'], goals: ['Strength', 'Muscle', 'Conditioning'], sets: '3', reps: '8 / side', rest: '60 sec', cue: 'Step back far enough to keep the front heel planted.', duration: 5 },
  { id: 'glute-bridge', name: 'Glute bridge', category: 'Strength', focus: 'Glutes · hips', gear: ['Bodyweight', 'Dumbbells'], goals: ['Strength', 'Muscle'], sets: '3', reps: '12–15', rest: '45 sec', cue: 'Finish by squeezing the glutes, not by over-arching your back.', duration: 4 },
  { id: 'db-row', name: 'Dumbbell row', category: 'Strength', focus: 'Back · arms', gear: ['Dumbbells', 'Full gym'], goals: ['Strength', 'Muscle'], sets: '3', reps: '8–12 / side', rest: '75 sec', cue: 'Pull your elbow toward your hip; keep the neck relaxed.', duration: 5 },
  { id: 'db-press', name: 'Dumbbell floor press', category: 'Strength', focus: 'Chest · triceps', gear: ['Dumbbells', 'Full gym'], goals: ['Strength', 'Muscle'], sets: '3', reps: '8–12', rest: '75 sec', cue: 'Lower with control until the upper arms lightly meet the floor.', duration: 5 },
  { id: 'deadlift', name: 'Romanian deadlift', category: 'Strength', focus: 'Posterior chain', gear: ['Dumbbells', 'Full gym'], goals: ['Strength', 'Muscle'], sets: '3', reps: '8–10', rest: '90 sec', cue: 'Hinge from the hips while keeping the weight close to the legs.', duration: 5 },
  { id: 'band-pull', name: 'Band pull-apart', category: 'Strength', focus: 'Upper back · posture', gear: ['Resistance bands'], goals: ['Strength', 'Mobility'], sets: '2–3', reps: '12–15', rest: '45 sec', cue: 'Keep the ribs quiet and separate the hands without shrugging.', duration: 3 },
  { id: 'plank', name: 'Forearm plank', category: 'Strength', focus: 'Core stability', gear: ['Bodyweight'], goals: ['Strength', 'Conditioning'], sets: '3', reps: '20–40 sec', rest: '45 sec', cue: 'Breathe normally and keep the hips in line with the shoulders.', duration: 3 },
  { id: 'mountain-climber', name: 'Mountain climber', category: 'Conditioning', focus: 'Full body · cardio', gear: ['Bodyweight'], goals: ['Conditioning'], sets: '3', reps: '30 sec', rest: '45 sec', cue: 'Use a pace that lets you keep your shoulders stable.', duration: 4 },
  { id: 'march', name: 'Fast march in place', category: 'Conditioning', focus: 'Cardio · coordination', gear: ['Bodyweight'], goals: ['Conditioning'], sets: '4', reps: '40 sec', rest: '30 sec', cue: 'Stand tall and let the arms move naturally.', duration: 4 },
  { id: 'db-carry', name: 'Farmer carry', category: 'Conditioning', focus: 'Grip · trunk', gear: ['Dumbbells', 'Full gym'], goals: ['Strength', 'Muscle', 'Conditioning'], sets: '3', reps: '30–45 sec', rest: '60 sec', cue: 'Walk tall with steady steps and weights at your sides.', duration: 4 },
  { id: 'step-up', name: 'Step-up', category: 'Conditioning', focus: 'Legs · work capacity', gear: ['Bodyweight', 'Dumbbells'], goals: ['Strength', 'Conditioning'], sets: '3', reps: '8 / side', rest: '60 sec', cue: 'Use a stable step and control the way down.', duration: 5 },
  { id: 'hip-hinge', name: 'Hip-hinge drill', category: 'Mobility', focus: 'Hips · patterning', gear: ['Bodyweight'], goals: ['Mobility', 'Strength'], sets: '2', reps: '8–10', rest: '30 sec', cue: 'Push the hips back while keeping the spine long.', duration: 3 },
  { id: 'worlds-greatest', name: 'World’s greatest stretch', category: 'Mobility', focus: 'Hips · thoracic spine', gear: ['Bodyweight'], goals: ['Mobility'], sets: '2', reps: '4 / side', rest: '30 sec', cue: 'Move gently through the range you can control today.', duration: 4 },
  { id: 'calf-mobility', name: 'Knee-to-wall ankle rocks', category: 'Mobility', focus: 'Ankles', gear: ['Bodyweight'], goals: ['Mobility'], sets: '2', reps: '8 / side', rest: '30 sec', cue: 'Keep the heel heavy and use a comfortable range.', duration: 3 },
  { id: 'band-row', name: 'Resistance-band row', category: 'Strength', focus: 'Back · shoulders', gear: ['Resistance bands'], goals: ['Strength', 'Muscle'], sets: '3', reps: '10–15', rest: '60 sec', cue: 'Draw elbows back while keeping the shoulders down.', duration: 4 },
  { id: 'dead-bug', name: 'Dead bug', category: 'Strength', focus: 'Core control', gear: ['Bodyweight'], goals: ['Strength', 'Mobility'], sets: '3', reps: '8 / side', rest: '45 sec', cue: 'Only extend as far as you can without your low back lifting.', duration: 4 },
  { id: 'jumping-jack', name: 'Low-impact jumping jack', category: 'Conditioning', focus: 'Cardio · warm-up', gear: ['Bodyweight'], goals: ['Conditioning'], sets: '3', reps: '30–45 sec', rest: '30 sec', cue: 'Step side to side instead of jumping when needed.', duration: 3 },
  { id: 'shoulder-circle', name: 'Controlled shoulder circles', category: 'Mobility', focus: 'Shoulders', gear: ['Bodyweight'], goals: ['Mobility'], sets: '2', reps: '6 each way', rest: '20 sec', cue: 'Make smooth circles without forcing the end range.', duration: 2 },
];


export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type MovementType = 'Compound' | 'Isolation' | 'Cardio' | 'Mobility';
export type ExerciseDetails = {
  difficulty: ExerciseDifficulty;
  movementType: MovementType;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  commonMistakes: string[];
  alternatives: string[];
};

export const EXERCISE_DETAILS: Record<string, ExerciseDetails> = {
  squat: { difficulty: 'Beginner', movementType: 'Compound', primaryMuscles: ['Quadriceps', 'Glutes'], secondaryMuscles: ['Core', 'Hamstrings'], instructions: ['Stand with feet around shoulder width and brace gently.', 'Sit hips down and back while keeping the whole foot planted.', 'Stand through the mid-foot and keep the movement controlled.'], commonMistakes: ['Heels lifting from the floor.', 'Dropping quickly without control or forcing a painful depth.'], alternatives: ['reverse-lunge', 'step-up', 'glute-bridge'] },
  pushup: { difficulty: 'Beginner', movementType: 'Compound', primaryMuscles: ['Chest'], secondaryMuscles: ['Triceps', 'Shoulders', 'Core'], instructions: ['Place hands slightly wider than shoulders and align the body.', 'Lower with elbows at a comfortable angle while bracing the trunk.', 'Press the floor away without letting the hips sag.'], commonMistakes: ['Letting the lower back collapse.', 'Shrugging the shoulders or flaring the elbows excessively.'], alternatives: ['db-press', 'dead-bug'] },
  'reverse-lunge': { difficulty: 'Intermediate', movementType: 'Compound', primaryMuscles: ['Quadriceps', 'Glutes'], secondaryMuscles: ['Hamstrings', 'Calves', 'Core'], instructions: ['Stand tall and step one foot backward.', 'Lower under control while keeping the front foot grounded.', 'Push through the front foot to return; repeat on both sides.'], commonMistakes: ['Taking a step so short that balance is lost.', 'Allowing the front heel to rise.'], alternatives: ['squat', 'step-up', 'glute-bridge'] },
  'glute-bridge': { difficulty: 'Beginner', movementType: 'Compound', primaryMuscles: ['Glutes'], secondaryMuscles: ['Hamstrings', 'Core'], instructions: ['Lie on your back with knees bent and feet flat.', 'Brace gently and raise the hips until shoulders, hips and knees align.', 'Pause briefly, then lower without dropping the hips.'], commonMistakes: ['Over-arching the lower back at the top.', 'Pushing mostly through the toes.'], alternatives: ['squat', 'step-up', 'dead-bug'] },
  'db-row': { difficulty: 'Intermediate', movementType: 'Compound', primaryMuscles: ['Back'], secondaryMuscles: ['Biceps', 'Rear shoulders'], instructions: ['Hinge at the hips and support yourself on a stable surface.', 'Pull the dumbbell toward the hip with a quiet torso.', 'Lower with control and repeat each side.'], commonMistakes: ['Twisting the torso to lift the weight.', 'Shrugging or pulling toward the neck.'], alternatives: ['band-row', 'band-pull'] },
  'db-press': { difficulty: 'Beginner', movementType: 'Compound', primaryMuscles: ['Chest'], secondaryMuscles: ['Triceps', 'Front shoulders'], instructions: ['Lie on the floor with knees bent and dumbbells over the chest.', 'Lower until the upper arms gently touch the floor.', 'Press up while keeping wrists stacked above elbows.'], commonMistakes: ['Bouncing the arms off the floor.', 'Letting wrists fold backward.'], alternatives: ['pushup', 'band-row'] },
  deadlift: { difficulty: 'Intermediate', movementType: 'Compound', primaryMuscles: ['Hamstrings', 'Glutes'], secondaryMuscles: ['Back', 'Grip', 'Core'], instructions: ['Hold weights close to the thighs and soften the knees.', 'Push hips back while keeping the spine neutral and weights close.', 'Stand by driving the hips forward without leaning back.'], commonMistakes: ['Rounding the back to reach lower.', 'Letting the weights drift away from the legs.'], alternatives: ['hip-hinge', 'glute-bridge'] },
  'band-pull': { difficulty: 'Beginner', movementType: 'Isolation', primaryMuscles: ['Upper back'], secondaryMuscles: ['Rear shoulders'], instructions: ['Hold a band at chest height with arms extended.', 'Separate the hands while keeping shoulders relaxed.', 'Return slowly without letting the band snap back.'], commonMistakes: ['Arching the lower back.', 'Raising the shoulders toward the ears.'], alternatives: ['band-row', 'shoulder-circle'] },
  plank: { difficulty: 'Beginner', movementType: 'Isolation', primaryMuscles: ['Core'], secondaryMuscles: ['Shoulders', 'Glutes'], instructions: ['Set forearms under shoulders and extend the legs.', 'Brace as if preparing for a gentle nudge and breathe normally.', 'Stop the hold before your hips begin to sag.'], commonMistakes: ['Holding the breath.', 'Letting hips drop or rise excessively.'], alternatives: ['dead-bug', 'glute-bridge'] },
  'mountain-climber': { difficulty: 'Intermediate', movementType: 'Cardio', primaryMuscles: ['Core'], secondaryMuscles: ['Shoulders', 'Hip flexors', 'Cardio'], instructions: ['Start in a stable high-plank position.', 'Bring one knee forward, then alternate smoothly.', 'Choose a pace that keeps shoulders and hips controlled.'], commonMistakes: ['Bouncing hips from side to side.', 'Moving so quickly that the hands slide.'], alternatives: ['march', 'jumping-jack'] },
  march: { difficulty: 'Beginner', movementType: 'Cardio', primaryMuscles: ['Cardio'], secondaryMuscles: ['Hip flexors', 'Calves'], instructions: ['Stand tall with feet hip-width apart.', 'Lift one knee at a time and let opposite arms swing naturally.', 'Begin at a comfortable pace and increase gradually if appropriate.'], commonMistakes: ['Leaning backward to raise the knees.', 'Rushing before balance feels steady.'], alternatives: ['jumping-jack', 'mountain-climber'] },
  'db-carry': { difficulty: 'Intermediate', movementType: 'Compound', primaryMuscles: ['Grip', 'Core'], secondaryMuscles: ['Shoulders', 'Back', 'Legs'], instructions: ['Pick up matched dumbbells from a stable stance.', 'Stand tall with shoulders relaxed and walk with controlled steps.', 'Set the weights down safely before turning.'], commonMistakes: ['Leaning to one side.', 'Using weights that prevent a stable, controlled walk.'], alternatives: ['band-row', 'step-up'] },
  'step-up': { difficulty: 'Beginner', movementType: 'Compound', primaryMuscles: ['Quadriceps', 'Glutes'], secondaryMuscles: ['Calves', 'Core'], instructions: ['Use a stable step at a comfortable height.', 'Place the whole foot on the step and drive through it.', 'Step down slowly and switch leading legs.'], commonMistakes: ['Pushing off hard with the trailing foot.', 'Using a step too high to control the descent.'], alternatives: ['squat', 'reverse-lunge'] },
  'hip-hinge': { difficulty: 'Beginner', movementType: 'Mobility', primaryMuscles: ['Hips'], secondaryMuscles: ['Hamstrings', 'Core'], instructions: ['Stand with knees softly bent and hands on the hips.', 'Push hips backward while keeping the spine long.', 'Return to standing without leaning back.'], commonMistakes: ['Turning the movement into a deep squat.', 'Rounding the back to reach farther.'], alternatives: ['deadlift', 'glute-bridge'] },
  'worlds-greatest': { difficulty: 'Intermediate', movementType: 'Mobility', primaryMuscles: ['Hips'], secondaryMuscles: ['Thoracic spine', 'Ankles'], instructions: ['Step into a comfortable long lunge and place hands near the front foot.', 'Move slowly through a gentle rotation and reach if comfortable.', 'Return to the start and repeat on the other side.'], commonMistakes: ['Forcing range or rotation.', 'Letting the front heel lift.'], alternatives: ['hip-hinge', 'calf-mobility'] },
  'calf-mobility': { difficulty: 'Beginner', movementType: 'Mobility', primaryMuscles: ['Ankles'], secondaryMuscles: ['Calves'], instructions: ['Face a wall with one foot a short distance away.', 'Drive the knee gently toward the wall while keeping the heel grounded.', 'Move the foot closer or farther to find a comfortable range.'], commonMistakes: ['Allowing the heel to lift.', 'Forcing the knee into discomfort.'], alternatives: ['worlds-greatest', 'hip-hinge'] },
  'band-row': { difficulty: 'Beginner', movementType: 'Compound', primaryMuscles: ['Back'], secondaryMuscles: ['Biceps', 'Rear shoulders'], instructions: ['Anchor the band securely at about torso height.', 'Pull the elbows back while keeping the torso steady.', 'Return slowly and maintain band tension.'], commonMistakes: ['Using an unsecured anchor.', 'Leaning back to finish each repetition.'], alternatives: ['db-row', 'band-pull'] },
  'dead-bug': { difficulty: 'Beginner', movementType: 'Isolation', primaryMuscles: ['Core'], secondaryMuscles: ['Hip flexors'], instructions: ['Lie on your back with arms up and knees bent.', 'Exhale gently as the opposite arm and leg reach away.', 'Return and alternate while keeping the lower back controlled.'], commonMistakes: ['Extending so far that the lower back lifts.', 'Rushing and losing coordination.'], alternatives: ['plank', 'glute-bridge'] },
  'jumping-jack': { difficulty: 'Beginner', movementType: 'Cardio', primaryMuscles: ['Cardio'], secondaryMuscles: ['Calves', 'Shoulders'], instructions: ['Stand tall with arms at your sides.', 'Step or hop feet apart while raising the arms to a comfortable height.', 'Return to the start and keep the rhythm even.'], commonMistakes: ['Landing stiffly or noisily.', 'Using a jump when a step variation is more comfortable.'], alternatives: ['march', 'mountain-climber'] },
  'shoulder-circle': { difficulty: 'Beginner', movementType: 'Mobility', primaryMuscles: ['Shoulders'], secondaryMuscles: ['Upper back'], instructions: ['Stand or sit with a relaxed, upright posture.', 'Draw small, controlled circles with the shoulders.', 'Gradually make them larger only if comfortable.'], commonMistakes: ['Forcing a painful range.', 'Holding the breath or lifting the shoulders sharply.'], alternatives: ['band-pull', 'worlds-greatest'] },
};

export function gearMatches(exercise: Exercise, gear: GearOption): boolean {
  if (gear === 'Full gym') return true;
  if (exercise.gear.includes('Bodyweight')) return true;
  return exercise.gear.includes(gear);
}
