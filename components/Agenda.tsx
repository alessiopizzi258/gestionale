"use client";
import React, { useState } from 'react';
import Modal from './Modal';
import { Appuntamento, Cliente } from '@/types';
import { today, uid, MESI } from '@/lib/utils';

interface AgendaProps {
  appuntamenti: Appuntamento[];
  setAppuntamenti: (a: Appuntamento[]) => void;
  clienti: Cliente[];
  toast: (msg: string) => void;
}

const STATO_COLOR: Record<string, string> = {
  attesa: 'yellow',
  confermato: 'blue',
  completato: 'green',
  cancellato: 'red',
};

export default function Agenda({ appuntamenti, setAppuntamenti, clienti, toast }: AgendaProps) {
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<string>(today());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Appuntamento>>({});

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
  if (startDayIndex === -1) startDayIndex = 6;

  const totalDays = lastDayOfMonth.getDate();

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
      stato: form.stato || 'confermato',
      operatore: form.operatore || 'Staff',
      note: form.note,
    };
    setAppuntamenti([...appuntamenti, nuovo]);
    setShowModal(false);
    setForm({});
    toast('Appuntamento aggiunto in agenda');
  };

  const update = (id: string, changes: Partial<Appuntamento>) =>
    setAppuntamenti(appuntamenti.map(a => (a.id === id ? { ...a, ...changes } : a)));

  const del = (id: string) => {
    if (confirm('Cancellare questo appuntamento?')) {
      setAppuntamenti(appuntamenti.filter(a => a.id !== id));
      toast('Eliminato');
    }
  };

  const appuntamentiGiorno = appuntamenti.filter(a => a.data === selectedDay);

  return (
    <div>
      <div className="section-header">
        <h2>Agenda & Calendario</h2>
        <button
          className="btn primary"
          onClick={() => {
            setForm({ data: selectedDay, ora: '10:00', durataMinuti: 60, operatore: 'Staff' });
            setShowModal(true);
          }}
        >
          <i className="ti ti-plus" /> Nuovo Appuntamento
        </button>
      </div>

      <div className="two-col" style={{ alignItems: 'flex-start' }}>
        {/* GRIGLIA CALENDARIO */}
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

        {/* LISTA APPUNTAMENTI DEL GIORNO */}
        <div className="card" style={{ padding: 16 }}>
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><i className="ti ti-calendar-event" /> Appuntamenti del {selectedDay.split('-').reverse().join('/')}</span>
            <button
              className="btn sm primary ghost"
              onClick={() => {
                setForm({ data: selectedDay, ora: '10:00', durataMinuti: 60, operatore: 'Staff' });
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

                    {/* Azioni rapide dinamiche per promemoria WhatsApp ed Email */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      {cl?.tel && (
                        <a
                          href={`https://wa.me/${cl.tel.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(
                            `Ciao ${cl.nome}, ti confermo il tuo appuntamento per "${a.titolo}" il giorno ${a.data.split('-').reverse().join('/')} alle ore ${a.ora}. Ti aspettiamo in Beauty Hub!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn sm"
                          style={{ background: '#25d366', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                        >
                          <i className="ti ti-brand-whatsapp" /> WhatsApp
                        </a>
                      )}

                      {cl?.email && (
                        <a
                          href={`mailto:${cl.email}?subject=${encodeURIComponent('Conferma Appuntamento - Beauty Hub')}&body=${encodeURIComponent(
                            `Gentile ${cl.nome},\n\nLe confermo il suo appuntamento per il trattamento "${a.titolo}" previsto per il ${a.data.split('-').reverse().join('/')} alle ore ${a.ora}.\n\nCordiali saluti,\nBeauty Hub`
                          )}`}
                          className="btn sm"
                          style={{ background: 'var(--bg-subtle)', color: 'var(--text)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                        >
                          <i className="ti ti-mail" /> Email
                        </a>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <select
                        value={a.stato}
                        onChange={e => update(a.id, { stato: e.target.value as Appuntamento['stato'] })}
                        style={{ fontSize: 11, padding: '3px 6px' }}
                      >
                        <option value="attesa">In attesa</option>
                        <option value="confermato">Confermato</option>
                        <option value="completato">Completato</option>
                        <option value="cancellato">Cancellato</option>
                      </select>
                      <button className="btn sm danger ghost" onClick={() => del(a.id)}>
                        <i className="ti ti-trash" />
                      </button>
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
                placeholder="Es. Pulizia Viso profonda + Maschera"
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
                onChange={e => setForm({ ...form, durataMinuti: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Operatore / Cabina</label>
              <input
                type="text"
                placeholder="Es. Martina / Cabina 1"
                value={form.operatore || ''}
                onChange={e => setForm({ ...form, operatore: e.target.value })}
              />
            </div>
            <div className="form-group full">
              <label>Note aggiuntive</label>
              <textarea
                placeholder="Richieste particolari, intolleranze, ecc."
                value={form.note || ''}
                onChange={e => setForm({ ...form, note: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}