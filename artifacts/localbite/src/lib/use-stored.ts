import { useEffect, useState } from 'react';

export type StoredSetter<T> = (value: T | ((old: T) => T)) => void;

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useStored<T>(key: string, fallback: T): [T, StoredSetter<T>] {
  const [value, setValue] = useState<T>(() => readStored(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  useEffect(() => {
    function syncFromAnotherTab(event: StorageEvent) {
      if (event.key !== key || event.storageArea !== localStorage) return;
      setValue(event.newValue ? (JSON.parse(event.newValue) as T) : fallback);
    }

    window.addEventListener('storage', syncFromAnotherTab);
    return () => window.removeEventListener('storage', syncFromAnotherTab);
  }, [key, fallback]);

  return [value, setValue];
}
