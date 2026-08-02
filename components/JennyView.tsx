"use client";
import React, { useState } from 'react';
import Modal from './Modal';
import { Appuntamento, Cliente } from '@/types';
import { today, uid } from '@/lib/utils';

interface JennyViewProps {
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

export default function JennyView({ appuntamenti, setAppuntamenti, clienti, toast }: JennyViewProps) {
  const [filtroData, setFiltroData] = useState(today());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Appuntamento>>({});

  const appuntamentiJenny = appuntamenti.filter(a => a.data === filtroData);

  const save = () => {
    if (!form.titolo || !form.ora) {
      alert('Inserisci trattamento e orario');
      return;
    }
    const nuovo: Appuntamento = {
      id: uid(),
      titolo: form.titolo,
      clienteId: form.clienteId,
      data: form.data || filtroData,
      ora: form.ora,
      durataMinuti: parseInt(String(form.durataMinuti)) || 60,
      stato: 'confermato',
      operatore: 'Jenny',
      note: form.note,
    };
    setAppuntamenti([...appuntamenti, nuovo]);
    setShowModal(false);
    setForm({});
    toast('Appuntamento aggiunto');
  };

  const updateStato = (id: string, stato: Appuntamento['stato']) => {
    setAppuntamenti(appuntamenti.map(a => (a.id === id ? { ...a, stato } : a)));
    toast('Stato aggiornato');
  };

  return (
    <div>
      <div className="section-header">
        <h2>Agenda di Jenny ✨</h2>
        <div className="btn-group">
          <input
            type="date"
            value={filtroData}
            onChange={e => setFiltroData(e.target.value)}
            style={{ fontSize: 13, padding: '6px 10px' }}
          />
          <button
            className="btn primary"
            onClick={() => {
              setForm({ data: filtroData, ora: '10:00', durataMinuti: 60, operatore: 'Jenny' });
              setShowModal(true);
            }}
          >
            <i className="ti ti-plus" /> Nuovo Appuntamento
          </button>
        </div>
      </div>

      {appuntamentiJenny.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {appuntamentiJenny.map(a => {
            const cl = clienti.find(c => c.id === a.clienteId);
            return (
              <div key={a.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    {a.ora} — {a.titolo} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text3)' }}>({a.durataMinuti} min)</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                    Cliente: <strong>{cl?.nome || 'Cliente esterno'}</strong> {cl?.tel ? `• Tel: ${cl.tel}` : ''}
                  </div>
                  {a.note && <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic', marginTop: 4 }}>Note: {a.note}</div>}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className={`badge ${STATO_COLOR[a.stato] || 'gray'}`}>{a.stato}</span>
                  <select
                    value={a.stato}
                    onChange={e => updateStato(a.id, e.target.value as Appuntamento['stato'])}
                    style={{ fontSize: 12, padding: '4px 8px' }}
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
        <div className="empty" style={{ padding: '60px 0' }}>
          <i className="ti ti-calendar-off" />
          <p>Nessun appuntamento in programma per questa data</p>
        </div>
      )}

      {showModal && (
        <Modal
          title="Nuovo Appuntamento (Jenny)"
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
              <label>Trattamento *</label>
              <input
                type="text"
                placeholder="Es. Pulizia Viso"
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
            <div className="form-group full">
              <label>Note</label>
              <textarea placeholder="Eventuali note..." value={form.note || ''} onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}