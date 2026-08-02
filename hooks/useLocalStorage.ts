"use client";
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, def: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return def;
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : def;
    } catch {
      return def;
    }
  });

  const setStored = useCallback((v: T) => {
    setVal(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      // storage non disponibile (es. modalità privata): ignora silenziosamente
    }
  }, [key]);

  return [val, setStored];
}
