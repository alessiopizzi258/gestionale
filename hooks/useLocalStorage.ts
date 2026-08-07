"use client";
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useLocalStorage<T>(key: string, def: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(def);

  // 1. Carica i dati da Firebase Firestore all'avvio
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const docRef = doc(db, 'beauty_hub_data', key);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && mounted) {
          const data = docSnap.data();
          if (data && data.value !== undefined) {
            setVal(data.value as T);
          }
        }
      } catch (err) {
        console.error(`Errore caricamento Firebase per ${key}:`, err);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [key]);

  // 2. Salva i dati su Firebase in tempo reale
  const setStored = useCallback(async (v: T) => {
    setVal(v);
    try {
      const docRef = doc(db, 'beauty_hub_data', key);
      
      // LA SOLUZIONE: Questa riga converte i dati e distrugge automaticamente
      // tutti i campi "undefined" (vuoti) prima di inviarli, 
      // evitando che Firebase blocchi il salvataggio!
      const cleanData = JSON.parse(JSON.stringify(v));
      
      await setDoc(docRef, { value: cleanData });
    } catch (err) {
      console.error(`Errore salvataggio Firebase per ${key}:`, err);
    }
  }, [key]);

  return [val, setStored];
}