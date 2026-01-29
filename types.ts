
export interface EyeCareTip {
  title: string;
  tip: string;
  category: 'exercise' | 'hydration' | 'ergonomics' | 'general';
}

export enum AppState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  ON_BREAK = 'ON_BREAK',
  PAUSED = 'PAUSED'
}

export interface SessionStats {
  breaksCompleted: number;
  totalWorkTimeMinutes: number;
  streak: number;
}
