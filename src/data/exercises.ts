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

export function gearMatches(exercise: Exercise, gear: GearOption): boolean {
  if (gear === 'Full gym') return true;
  if (exercise.gear.includes('Bodyweight')) return true;
  return exercise.gear.includes(gear);
}
