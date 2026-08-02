export const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

export const fmt = (n: number): string =>
  new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const fmtDate = (d?: string): string =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('it-IT') : '—';

export const today = (): string => new Date().toISOString().split('T')[0];

export const uid = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const initials = (name: string): string =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

export const daysDiff = (dateStr?: string): number | null => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr + 'T00:00:00').getTime() - new Date().getTime()) / 86400000);
};