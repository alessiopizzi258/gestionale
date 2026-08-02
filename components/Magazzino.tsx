"use client";
import React, { useState } from 'react';
import Modal from './Modal';
import { ProdottoMagazzino } from '@/types';
import { fmt, uid } from '@/lib/utils';

interface MagazzinoProps {
  magazzino: ProdottoMagazzino[];
  setMagazzino: (p: ProdottoMagazzino[]) => void;
  toast: (msg: string) => void;
}

export default function Magazzino({ magazzino, setMagazzino, toast }: MagazzinoProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<ProdottoMagazzino>>({});
  const [filtro, setFiltro] = useState('tutti');

  const save = () => {
    if (!form.nome) {
      alert('Inserisci il nome del prodotto');
      return;
    }
    const nuovo: ProdottoMagazzino = {
      id: uid(),
      nome: form.nome,
      categoria: form.categoria || 'rivendita',
      giacenza: parseInt(String(form.giacenza)) || 0,
      scortaMinima: parseInt(String(form.scortaMinima)) || 3,
      prezzoVendita: parseFloat(String(form.prezzoVendita)) || 0,
    };
    setMagazzino([...magazzino, nuovo]);
    setShowModal(false);
    setForm({});
    toast('Prodotto aggiunto a magazzino');
  };

  const updateGiacenza = (id: string, delta: number) => {
    setMagazzino(
      magazzino.map(p => (p.id === id ? { ...p, giacenza: Math.max(0, p.giacenza + delta) } : p))
    );
  };

  const del = (id: string) => {
    if (confirm('Eliminare questo articolo dal magazzino?')) {
      setMagazzino(magazzino.filter(p => p.id !== id));
      toast('Eliminato');
    }
  };

  const lista = filtro === 'tutti' ? magazzino : magazzino.filter(p => p.categoria === filtro);

  return (
    <div>
      <div className="section-header">
        <h2>Magazzino & Prodotti</h2>
        <div className="btn-group">
          <div className="chips">
            {['tutti', 'rivendita', 'cabina', 'monouso'].map(f => (
              <button key={f} className={`chip${filtro === f ? ' active' : ''}`} onClick={() => setFiltro(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="btn primary"
            onClick={() => {
              setForm({ giacenza: 10, scortaMinima: 3, categoria: 'rivendita' });
              setShowModal(true);
            }}
          >
            <i className="ti ti-plus" /> Nuovo Prodotto
          </button>
        </div>
      </div>

      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Categoria</th>
              <th>Giacenza</th>
              <th>Scorta Min.</th>
              <th>Prezzo Vendita</th>
              <th>Azioni Rapide</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.length ? (
              lista.map(p => {
                const isCritico = p.giacenza <= p.scortaMinima;
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.nome}</td>
                    <td>
                      <span className="badge blue">{p.categoria}</span>
                    </td>
                    <td>
                      <span style={{ color: isCritico ? 'var(--red)' : 'inherit', fontWeight: isCritico ? 700 : 400 }}>
                        {p.giacenza} pz {isCritico && '⚠️'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text3)' }}>{p.scortaMinima} pz</td>
                    <td>€{fmt(p.prezzoVendita)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn sm ghost" onClick={() => updateGiacenza(p.id, -1)}>-1</button>
                        <button className="btn sm ghost" onClick={() => updateGiacenza(p.id, 1)}>+1</button>
                      </div>
                    </td>
                    <td>
                      <button className="btn sm danger ghost" onClick={() => del(p.id)}>
                        <i className="ti ti-trash" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className="empty">
                    <i className="ti ti-box" />
                    <p>Nessun prodotto trovato in magazzino</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title="Nuovo Prodotto / Articolo"
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
              <label>Nome Prodotto *</label>
              <input
                type="text"
                placeholder="Es. Crema Viso Idratante 50ml"
                value={form.nome || ''}
                onChange={e => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select
                value={form.categoria || 'rivendita'}
                onChange={e => setForm({ ...form, categoria: e.target.value as ProdottoMagazzino['categoria'] })}
              >
                <option value="rivendita">Rivendita (Retail)</option>
                <option value="cabina">Cabina (Uso interno)</option>
                <option value="monouso">Monouso / Consumabili</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prezzo di Vendita (€)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.prezzoVendita || ''}
                onChange={e => setForm({ ...form, prezzoVendita: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Giacenza Attuale</label>
              <input
                type="number"
                value={form.giacenza ?? ''}
                onChange={e => setForm({ ...form, giacenza: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Scorta Minima (Allarme)</label>
              <input
                type="number"
                value={form.scortaMinima ?? ''}
                onChange={e => setForm({ ...form, prezzoVendita: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}