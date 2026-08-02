"use client";
import React, { useState } from 'react';
import Modal from './Modal';
import { Movimento, Cliente } from '@/types';
import { fmt, fmtDate, today, uid } from '@/lib/utils';

type TipoMovimento = 'entrata' | 'uscita';

interface FinanzeProps {
  movimenti: Movimento[];
  setMovimenti: (m: Movimento[]) => void;
  clienti: Cliente[];
  toast: (msg: string) => void;
}

const CAT_ENTRATA = ['Trattamento Viso', 'Trattamento Corpo', 'Epilazione', 'Vendita Prodotti', 'Pacchetto', 'Altro'];
const CAT_USCITA = ['Fornitori Cosmetici', 'Affitto Cabina/Locale', 'Utenze', 'Marketing', 'Manutenzione Apparecchiature', 'Tasse', 'Altro'];

interface FinanzeForm {
  tipo?: TipoMovimento;
  data?: string;
  desc?: string;
  cat?: string;
  clienteId?: string;
  importo?: string;
}

export default function Finanze({ movimenti, setMovimenti, clienti, toast }: FinanzeProps) {
  const [filtro, setFiltro] = useState<'tutti' | TipoMovimento>('tutti');
  const [showModal, setShowModal] = useState<TipoMovimento | null>(null);
  const [form, setForm] = useState<FinanzeForm>({});

  const openModal = (tipo: TipoMovimento) => {
    setForm({ tipo, data: today(), cat: tipo === 'entrata' ? 'Trattamento Viso' : 'Fornitori Cosmetici' });
    setShowModal(tipo);
  };

  const save = () => {
    if (!form.importo || !form.desc) {
      alert('Inserisci importo e descrizione');
      return;
    }
    const nuovo: Movimento = {
      id: uid(),
      tipo: (form.tipo as TipoMovimento) || 'entrata',
      importo: parseFloat(form.importo),
      desc: form.desc,
      data: form.data || today(),
      cat: form.cat || '',
      clienteId: form.clienteId,
    };
    setMovimenti([...movimenti, nuovo]);
    setShowModal(null);
    toast('Movimento registrato in cassa');
  };

  const del = (id: string) => {
    if (confirm('Eliminare questo movimento di cassa?')) {
      setMovimenti(movimenti.filter(m => m.id !== id));
      toast('Eliminato');
    }
  };

  const lista = filtro === 'tutti' ? movimenti : movimenti.filter(m => m.tipo === filtro);
  const entrate = movimenti.filter(m => m.tipo === 'entrata').reduce((a, m) => a + m.importo, 0);
  const uscite = movimenti.filter(m => m.tipo === 'uscita').reduce((a, m) => a + m.importo, 0);

  return (
    <div>
      <div className="section-header">
        <h2>Cassa & Finanze</h2>
        <div className="btn-group">
          <button className="btn primary" onClick={() => openModal('entrata')}>
            <i className="ti ti-plus" />Nuova Entrata
          </button>
          <button className="btn" onClick={() => openModal('uscita')}>
            <i className="ti ti-minus" />Nuova Uscita
          </button>
        </div>
      </div>

      <div className="metrics" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
        <div className="metric">
          <div className="metric-label">Incassi</div>
          <div className="metric-value c-green">€{fmt(entrate)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Uscite</div>
          <div className="metric-value c-red">€{fmt(uscite)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Margine Netto</div>
          <div className="metric-value" style={{ color: entrate - uscite >= 0 ? 'var(--green)' : 'var(--red)' }}>
            €{fmt(entrate - uscite)}
          </div>
        </div>
        <div className="metric">
          <div className="metric-label">Movimenti</div>
          <div className="metric-value c-blue">{movimenti.length}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>
            <i className="ti ti-list" />Registro Cassa
          </div>
          <div className="chips">
            {(['tutti', 'entrata', 'uscita'] as const).map(f => (
              <button key={f} className={`chip${filtro === f ? ' active' : ''}`} onClick={() => setFiltro(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrizione</th>
                <th>Categoria</th>
                <th>Cliente</th>
                <th>Importo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.length ? (
                [...lista].reverse().map(m => {
                  const cl = clienti.find(c => c.id === m.clienteId);
                  return (
                    <tr key={m.id}>
                      <td style={{ color: 'var(--text2)', whiteSpace: 'nowrap' }}>{fmtDate(m.data)}</td>
                      <td>{m.desc}</td>
                      <td>
                        <span className={`badge ${m.tipo === 'entrata' ? 'green' : 'red'}`}>{m.cat}</span>
                      </td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>{cl?.nome || '—'}</td>
                      <td
                        style={{
                          fontWeight: 600,
                          color: m.tipo === 'entrata' ? 'var(--green)' : 'var(--red)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {m.tipo === 'entrata' ? '+' : '-'}€{fmt(m.importo)}
                      </td>
                      <td>
                        <button className="btn sm danger ghost" onClick={() => del(m.id)}>
                          <i className="ti ti-trash" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="empty">
                      <i className="ti ti-receipt" />
                      <p>Nessun movimento registrato</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal
          title={showModal === 'entrata' ? 'Registra Entrata Cassa' : 'Registra Uscita Spesa'}
          onClose={() => setShowModal(null)}
          footer={
            <>
              <button className="btn" onClick={() => setShowModal(null)}>Annulla</button>
              <button className="btn primary" onClick={save}>
                <i className="ti ti-check" />Salva
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label>Importo (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.importo || ''}
                onChange={e => setForm({ ...form, importo: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="date" value={form.data || ''} onChange={e => setForm({ ...form, data: e.target.value })} />
            </div>
            <div className="form-group full">
              <label>Descrizione</label>
              <input
                type="text"
                placeholder="Es. Seduta pulizia viso + crema rivendita"
                value={form.desc || ''}
                onChange={e => setForm({ ...form, desc: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select value={form.cat || ''} onChange={e => setForm({ ...form, cat: e.target.value })}>
                {(showModal === 'entrata' ? CAT_ENTRATA : CAT_USCITA).map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            {showModal === 'entrata' && (
              <div className="form-group">
                <label>Cliente</label>
                <select value={form.clienteId || ''} onChange={e => setForm({ ...form, clienteId: e.target.value })}>
                  <option value="">— nessuno —</option>
                  {clienti.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}