"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { Appuntamento, Cliente } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { today, uid, MESI } from '@/lib/utils';

const STATO_COLOR: Record<string, string> = {
  attesa: 'yellow',
  confermato: 'blue',
  completato: 'green',
  cancellato: 'red',
};

export default function JennyPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('auth_role');
    if (role !== 'jenny') {
      router.push('/');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const [appuntamenti, setAppuntamenti] = useLocalStorage<Appuntamento[]>('bh_appuntamenti', []);
  const [clienti] = useLocalStorage<Cliente[]>('bh_clienti', []);
  
  // Stati del calendario
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<string>(today());

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Appuntamento>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toast = (msg: string) => setToastMsg(msg);

  if (!authorized) return null;

  // Navigazione tra i mesi
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  let startDayIndex = firstDayOfMonth.getDay() - 1;
  if (startDayIndex === -1) startDayIndex = 6; // Lunedì = 0

  const totalDays = lastDayOfMonth.getDate();

  // Filtra gli appuntamenti del giorno selezionato (mostriamo quelli di Jenny o generali)
  const appuntamentiGiorno = appuntamenti.filter(a => a.data === selectedDay);

  const save = () => {
    if (!form.titolo || !form.ora) {
      alert('Inserisci trattamento e orario');
      return;
    }
    const nuovo: Appuntamento = {
      id: uid(),
      titolo: form.titolo,
      clienteId: form.clienteId,
      data: form.data || selectedDay,
      ora: form.ora,
      durataMinuti: parseInt(String(form.durataMinuti)) || 60,
      stato: 'confermato',
      operatore: 'Jenny',
      note: form.note,
    };
    setAppuntamenti([...appuntamenti, nuovo]);
    setShowModal(false);
    setForm({});
    toast('Appuntamento aggiunto con successo');
  };

  const updateStato = (id: string, stato: Appuntamento['stato']) => {
    setAppuntamenti(appuntamenti.map(a => (a.id === id ? { ...a, stato } : a)));
    toast('Stato aggiornato');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_role');
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* TOPBAR DI JENNY */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: 'var(--card-bg)', padding: 20, borderRadius: 12, border: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Agenda di Jenny ✨</h1>
            <p style={{ fontSize: 13, color: 'var(--text3)' }}>Calendario e gestione appuntamenti assegnati</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              className="btn primary"
              onClick={() => {
                setForm({ data: selectedDay, ora: '10:00', durataMinuti: 60, operatore: 'Jenny' });
                setShowModal(true);
              }}
            >
              <i className="ti ti-plus" /> Nuovo Appuntamento
            </button>
            <button className="btn sm danger ghost" onClick={handleLogout} style={{ background: '#fff1f2', color: '#e11d48' }}>
              <i className="ti ti-lock" /> Termina & Logout
            </button>
          </div>
        </div>

        {/* LAYOUT A DUE COLONNE (CALENDARIO A SINISTRA + LISTA GIORNO A DESTRA) */}
        <div className="two-col" style={{ alignItems: 'flex-start' }}>
          
          {/* GRIGLIA DEL CALENDARIO MENSILE */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
                {MESI[currentMonth]} {currentYear}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn sm ghost" onClick={prevMonth}>
                  <i className="ti ti-chevron-left" />
                </button>
                <button className="btn sm ghost" onClick={() => {
                  const now = new Date();
                  setCurrentYear(now.getFullYear());
                  setCurrentMonth(now.getMonth());
                  setSelectedDay(today());
                }}>
                  Oggi
                </button>
                <button className="btn sm ghost" onClick={nextMonth}>
                  <i className="ti ti-chevron-right" />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', marginBottom: 8 }}>
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
                <div key={d} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)' }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array.from({ length: startDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                const formattedDay = String(dayNum).padStart(2, '0');
                const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                
                const isSelected = selectedDay === dateStr;
                const isToday = today() === dateStr;
                const hasAppts = appuntamenti.some(a => a.data === dateStr);

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDay(dateStr)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 8,
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--accent-light)' : isToday ? 'var(--bg-subtle)' : 'transparent',
                      color: isSelected ? 'var(--accent)' : 'var(--text)',
                      fontWeight: isToday || isSelected ? 700 : 400,
                      fontSize: 13,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    {dayNum}
                    {hasAppts && (
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: isSelected ? 'var(--accent)' : 'var(--green)',
                          marginTop: 3,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LISTA APPUNTAMENTI DEL GIORNO SELEZIONATO */}
          <div className="card" style={{ padding: 16 }}>
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><i className="ti ti-calendar-event" /> Appuntamenti del {selectedDay.split('-').reverse().join('/')}</span>
              <button
                className="btn sm primary ghost"
                onClick={() => {
                  setForm({ data: selectedDay, ora: '10:00', durataMinuti: 60, operatore: 'Jenny' });
                  setShowModal(true);
                }}
              >
                <i className="ti ti-plus" /> Aggiungi
              </button>
            </div>

            {appuntamentiGiorno.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {appuntamentiGiorno.map(a => {
                  const cl = clienti.find(c => c.id === a.clienteId);
                  return (
                    <div
                      key={a.id}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>
                            {a.ora} · {a.titolo}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                            <i className="ti ti-user" /> {cl?.nome || 'Cliente esterno'} {cl?.tel ? `(${cl.tel})` : ''}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                            Durata: {a.durataMinuti} min · Operatore: <strong>{a.operatore}</strong>
                          </div>
                        </div>
                        <span className={`badge ${STATO_COLOR[a.stato] || 'gray'}`}>{a.stato}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                        <select
                          value={a.stato}
                          onChange={e => updateStato(a.id, e.target.value as Appuntamento['stato'])}
                          style={{ fontSize: 11, padding: '3px 6px' }}
                        >
                          <option value="attesa">In attesa</option>
                          <option value="confermato">Confermato</option>
                          <option value="completato">Completato</option>
                          <option value="cancellato">Cancellato</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty" style={{ padding: '40px 0' }}>
                <i className="ti ti-calendar-off" />
                <p>Nessun appuntamento per questo giorno</p>
              </div>
            )}
          </div>

        </div>

        {/* MODALE NUOVO APPUNTAMENTO */}
        {showModal && (
          <Modal
            title={`Nuovo Appuntamento (${selectedDay.split('-').reverse().join('/')})`}
            onClose={() => setShowModal(false)}
            footer={
              <>
                <button className="btn" onClick={() => setShowModal(false)}>Annulla</button>
                <button className="btn primary" onClick={save}>
                  <i className="ti ti-check" />Salva
                </button>
              </>
            }
          >
            <div className="form-grid">
              <div className="form-group full">
                <label>Trattamento / Servizio *</label>
                <input
                  type="text"
                  placeholder="Es. Pulizia Viso profonda"
                  value={form.titolo || ''}
                  onChange={e => setForm({ ...form, titolo: e.target.value })}
                />
              </div>
              <div className="form-group full">
                <label>Cliente</label>
                <select value={form.clienteId || ''} onChange={e => setForm({ ...form, clienteId: e.target.value })}>
                  <option value="">— seleziona cliente —</option>
                  {clienti.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Data</label>
                <input type="date" value={form.data || selectedDay} onChange={e => setForm({ ...form, data: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Orario</label>
                <input type="time" value={form.ora || ''} onChange={e => setForm({ ...form, ora: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Durata (minuti)</label>
                <input
                  type="number"
                  value={form.durataMinuti || 60}
                  onChange={e => setForm({ ...form, durataMinuti: parseInt(e.target.value) || 60 })}
                />
              </div>
              <div className="form-group">
                <label>Operatore</label>
                <input
                  type="text"
                  value="Jenny"
                  disabled
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text3)' }}
                />
              </div>
              <div className="form-group full">
                <label>Note aggiuntive</label>
                <textarea
                  placeholder="Note sul trattamento..."
                  value={form.note || ''}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>
          </Modal>
        )}

      </div>
      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  );
}