
export interface SetRecord {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: SetRecord[];
}

export interface Workout {
  id: string;
  date: string; // ISO format
  type: string; // e.g., "Musculação", "Corrida", "Crossfit"
  exercises: Exercise[];
  notes?: string;
  duration?: number; // in minutes
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
}

export interface AppState {
  workouts: Workout[];
  weightHistory: WeightRecord[];
  userProfile: {
    name: string;
    goal: string;
    height: number;
  };
}
