"use client";
import React, { useState } from 'react';
import Modal from './Modal';
import { Cliente, Movimento } from '@/types';
import { fmt, initials, uid } from '@/lib/utils';

interface ClientiProps {
  clienti: Cliente[];
  setClienti: (c: Cliente[]) => void;
  movimenti: Movimento[];
  toast: (msg: string) => void;
}

const TIPO_ICON: Record<string, string> = {
  viso: 'ti-sparkles',
  corpo: 'ti-activity',
  epilazione: 'ti-wand',
  altro: 'ti-user',
};

const STATO_BADGE: Record<string, string> = {
  attivo: 'green',
  nuovo: 'blue',
  vip: 'purple',
  inattivo: 'gray',
};

export default function Clienti({ clienti, setClienti, movimenti, toast }: ClientiProps) {
  const [filtro, setFiltro] = useState('tutti');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Cliente>>({});
  const [search, setSearch] = useState('');

  const save = () => {
    if (!form.nome) {
      alert('Inserisci il nome della cliente');
      return;
    }
    const nuovo: Cliente = {
      id: uid(),
      nome: form.nome,
      email: form.email,
      tel: form.tel,
      tipo: form.tipo || 'viso',
      stato: form.stato || 'nuovo',
      compleanno: form.compleanno,
      noteVisoCorpo: form.noteVisoCorpo,
    };
    setClienti([...clienti, nuovo]);
    setShowModal(false);
    setForm({});
    toast('Scheda cliente salvata');
  };

  const del = (id: string) => {
    if (confirm('Eliminare la scheda di questa cliente?')) {
      setClienti(clienti.filter(c => c.id !== id));
      toast('Eliminato');
    }
  };

  const lista = clienti
    .filter(c => filtro === 'tutti' || c.tipo === filtro)
    .filter(
      c =>
        !search ||
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.tel?.includes(search)
    );

  const spesaTotaleCliente = (id: string) =>
    movimenti.filter(m => m.tipo === 'entrata' && m.clienteId === id).reduce((a, m) => a + m.importo, 0);

  return (
    <div>
      <div className="section-header">
        <h2>Clienti & Schede Viso/Corpo</h2>
        <button
          className="btn primary"
          onClick={() => {
            setForm({});
            setShowModal(true);
          }}
        >
          <i className="ti ti-user-plus" />Nuova Cliente
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Cerca per nome, tel, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 240 }}
        />
        <div className="chips">
          {['tutti', 'viso', 'corpo', 'epilazione', 'altro'].map(f => (
            <button key={f} className={`chip${filtro === f ? ' active' : ''}`} onClick={() => setFiltro(f)}>
              {f !== 'tutti' && <i className={`ti ${TIPO_ICON[f]}`} />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="client-grid">
        {lista.length ? (
          lista.map(c => (
            <div className="client-card" key={c.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div className="avatar">{initials(c.nome)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.nome}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    <i className={`ti ${TIPO_ICON[c.tipo] || 'ti-user'}`} /> Trattamento principale: {c.tipo}
                  </div>
                </div>
              </div>
              {c.email && (
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 3 }}>
                  <i className="ti ti-mail" style={{ marginRight: 5 }} />
                  {c.email}
                </div>
              )}
              {c.tel && (
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 3 }}>
                  <i className="ti ti-phone" style={{ marginRight: 5 }} />
                  {c.tel}
                </div>
              )}
              {c.noteVisoCorpo && (
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text3)',
                    marginTop: 6,
                    fontStyle: 'italic',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  Note: {c.noteVisoCorpo}
                </div>
              )}
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${STATO_BADGE[c.stato] || 'gray'}`}>{c.stato}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {spesaTotaleCliente(c.id) > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
                      €{fmt(spesaTotaleCliente(c.id))}
                    </span>
                  )}
                  <button className="btn sm danger ghost" onClick={() => del(c.id)}>
                    <i className="ti ti-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty" style={{ gridColumn: '1/-1' }}>
            <i className="ti ti-users" />
            <p>Nessuna cliente trovata</p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title="Nuova Scheda Cliente"
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
            <div className="form-group">
              <label>Nome e Cognome *</label>
              <input
                type="text"
                placeholder="Laura Rossi"
                value={form.nome || ''}
                onChange={e => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="laura@esempio.it"
                value={form.email || ''}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Telefono</label>
              <input
                type="text"
                placeholder="+39 ..."
                value={form.tel || ''}
                onChange={e => setForm({ ...form, tel: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Servizio Principale</label>
              <select
                value={form.tipo || 'viso'}
                onChange={e => setForm({ ...form, tipo: e.target.value as Cliente['tipo'] })}
              >
                <option value="viso">Viso</option>
                <option value="corpo">Corpo</option>
                <option value="epilazione">Epilazione</option>
                <option value="altro">Altro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stato</label>
              <select
                value={form.stato || 'nuovo'}
                onChange={e => setForm({ ...form, stato: e.target.value as Cliente['stato'] })}
              >
                <option value="nuovo">Nuovo</option>
                <option value="attivo">Attivo</option>
                <option value="vip">VIP</option>
                <option value="inattivo">Inattivo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data di Nascita</label>
              <input
                type="date"
                value={form.compleanno || ''}
                onChange={e => setForm({ ...form, compleanno: e.target.value })}
              />
            </div>
            <div className="form-group full">
              <label>Anamnesi / Note Viso-Corpo (Allergie, sensibilità, prodotti preferiti)</label>
              <textarea
                placeholder="Pelle sensibile a..., preferisce oli leggeri, utilizza crema X..."
                value={form.noteVisoCorpo || ''}
                onChange={e => setForm({ ...form, noteVisoCorpo: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}