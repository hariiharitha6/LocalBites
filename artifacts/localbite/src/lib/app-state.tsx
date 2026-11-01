import { createContext, useCallback, useContext, type ReactNode } from 'react';
import {
  blankJourney,
  defaultPrefs,
  type JourneyState,
  type Preferences,
} from './app-types';
import { useStored } from './use-stored';

const blankCompares: string[] = [];

type AppState = {
  journey: JourneyState;
  setJourney: (value: JourneyState | ((old: JourneyState) => JourneyState)) => void;
  compares: string[];
  setCompares: (value: string[] | ((old: string[]) => string[])) => void;
  prefs: Preferences;
  setPrefs: (value: Preferences | ((old: Preferences) => Preferences)) => void;
  toggleSaved: (id: string) => void;
  toggleTried: (id: string) => void;
  addCompare: (id: string) => void;
};

const AppCtx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [journey, setJourney] = useStored<JourneyState>('localbite-journey', blankJourney);
  const [compares, setCompares] = useStored<string[]>('localbite-compare', blankCompares);
  const [prefs, setPrefs] = useStored<Preferences>('localbite-preferences', defaultPrefs);

  const toggleSaved = useCallback((id: string) => {
    setJourney((prev) => {
      const saved = prev.saved ?? [];
      return {
        ...prev,
        saved: saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id],
      };
    });
  }, [setJourney]);

  const toggleTried = useCallback((id: string) => {
    setJourney((prev) => {
      const tried = prev.tried ?? [];
      return {
        ...prev,
        tried: tried.includes(id) ? tried.filter((item) => item !== id) : [...tried, id],
      };
    });
  }, [setJourney]);

  const addCompare = useCallback((id: string) => {
    setCompares((prev) => {
      if (prev.includes(id) || prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, [setCompares]);

  return (
    <AppCtx.Provider
      value={{
        journey,
        setJourney,
        compares,
        setCompares,
        prefs,
        setPrefs,
        toggleSaved,
        toggleTried,
        addCompare,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp(): AppState {
  const context = useContext(AppCtx);
  if (!context) throw new Error('useApp must be used inside AppStateProvider');
  return context;
}
