export type JourneyState = {
  saved: string[];
  tried: string[];
  notes: Record<string, string>;
  reactions?: Record<string, string>;
};

export type Preferences = {
  spice: number;
  budget: number;
  diet: string[];
  tastes: string[];
};

export const blankJourney: JourneyState = {
  saved: [],
  tried: [],
  notes: {},
  reactions: {},
};

export const defaultPrefs: Preferences = {
  spice: 2,
  budget: 350,
  diet: [],
  tastes: [],
};

export function uniquePassportCount(journey: JourneyState): number {
  return new Set([...(journey.saved ?? []), ...(journey.tried ?? [])]).size;
}
