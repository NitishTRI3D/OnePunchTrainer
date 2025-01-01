export interface WorkoutEntry {
  date: string;
  weight?: string;
  distance: number;
  crunches: number;
  pushups: number;
  squats: number;
}

export interface WorkoutDatabase {
  workouts: WorkoutEntry[];
}

export interface PunchCalculation {
  completePunches: number;
  remaining: {
    distance: number;
    crunches: number;
    pushups: number;
    squats: number;
  };
}

export function calculatePunches(workouts: WorkoutEntry[]): PunchCalculation {
  // Sum all workouts
  const totals = workouts.reduce(
    (acc, workout) => ({
      distance: acc.distance + workout.distance,
      crunches: acc.crunches + workout.crunches,
      pushups: acc.pushups + workout.pushups,
      squats: acc.squats + workout.squats,
    }),
    { distance: 0, crunches: 0, pushups: 0, squats: 0 }
  );

  // Calculate complete punches (minimum of all ratios)
  const punchRatios = {
    distance: Math.floor(totals.distance / 10),
    crunches: Math.floor(totals.crunches / 100),
    pushups: Math.floor(totals.pushups / 100),
    squats: Math.floor(totals.squats / 100),
  };

  const completePunches = Math.min(
    punchRatios.distance,
    punchRatios.crunches,
    punchRatios.pushups,
    punchRatios.squats
  );

  // Calculate remaining for next punch
  const remaining = {
    distance: ((completePunches + 1) * 10) - totals.distance,
    crunches: ((completePunches + 1) * 100) - totals.crunches,
    pushups: ((completePunches + 1) * 100) - totals.pushups,
    squats: ((completePunches + 1) * 100) - totals.squats,
  };

  return {
    completePunches,
    remaining: {
      distance: Math.max(0, remaining.distance),
      crunches: Math.max(0, remaining.crunches),
      pushups: Math.max(0, remaining.pushups),
      squats: Math.max(0, remaining.squats),
    }
  };
}

export function addWorkoutEntry(workout: WorkoutEntry): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const existingData = localStorage.getItem('workouts');
      const workouts: WorkoutEntry[] = existingData ? JSON.parse(existingData) : [];
      
      // Check for duplicate date
      if (workouts.some(w => w.date === workout.date)) {
        throw new Error('Workout already exists for this date');
      }
      
      workouts.push(workout);
      localStorage.setItem('workouts', JSON.stringify(workouts));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function getWorkoutByDate(date: string): WorkoutEntry | null {
  const existingData = localStorage.getItem('workouts');
  if (!existingData) return null;
  
  const workouts: WorkoutEntry[] = JSON.parse(existingData);
  return workouts.find(w => w.date === date) || null;
}

export function updateWorkoutEntry(workout: WorkoutEntry): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const existingData = localStorage.getItem('workouts');
      if (!existingData) throw new Error('No workouts found');
      
      let workouts: WorkoutEntry[] = JSON.parse(existingData);
      workouts = workouts.map(w => w.date === workout.date ? workout : w);
      
      localStorage.setItem('workouts', JSON.stringify(workouts));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
} 