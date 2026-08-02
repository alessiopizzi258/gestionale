export type Section = 'dashboard' | 'finanze' | 'clienti' | 'agenda' | 'magazzino';

export interface Movimento {
  id: string;
  tipo: 'entrata' | 'uscita';
  importo: number;
  desc: string;
  data: string;
  cat: string;
  clienteId?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  tel?: string;
  tipo: 'viso' | 'corpo' | 'epilazione' | 'altro';
  stato: 'attivo' | 'nuovo' | 'vip' | 'inattivo';
  compleanno?: string;
  noteVisoCorpo?: string; // Anamnesi / Allergie / Preferenze
}

export interface Appuntamento {
  id: string;
  titolo: string;
  clienteId?: string;
  data: string;
  ora: string;
  durataMinuti: number;
  stato: 'confermato' | 'completato' | 'cancellato' | 'attesa';
  operatore: string;
  note?: string;
}

export interface ProdottoMagazzino {
  id: string;
  nome: string;
  categoria: 'rivendita' | 'cabina' | 'monouso';
  giacenza: number;
  scortaMinima: number;
  prezzoVendita: number;
}