"use client";
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, def: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(def);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carica i dati da localStorage appena il componente monta sul client
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setVal(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Errore nel caricamento di ${key} da localStorage:`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  const setStored = useCallback((v: T) => {
    try {
      setVal(v);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(v));
      }
    } catch (error) {
      console.error(`Errore nel salvataggio di ${key} su localStorage:`, error);
    }
  }, [key]);

  return [val, setStored];
}