"use client";
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useLocalStorage<T>(key: string, def: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(def);

  // Carica i dati da Firebase Firestore all'avvio
  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, 'beauty_hub_data', key);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.value !== undefined) {
            setVal(data.value as T);
          }
        }
      } catch (err) {
        console.error('Errore caricamento Firebase:', err);
      }
    }
    fetchData();
  }, [key]);

  // Salva i dati su Firebase Firestore in tempo reale
  const setStored = useCallback(async (v: T) => {
    setVal(v);
    try {
      const docRef = doc(db, 'beauty_hub_data', key);
      await setDoc(docRef, { value: v });
    } catch (err) {
      console.error('Errore salvataggio Firebase:', err);
    }
  }, [key]);

  return [val, setStored];
}