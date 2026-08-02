"use client";
import React from 'react';
import { Movimento, Cliente, Appuntamento, ProdottoMagazzino } from '@/types';
import { fmt, fmtDate, MESI } from '@/lib/utils';

interface DashboardProps {
  movimenti: Movimento[];
  clienti: Cliente[];
  appuntamenti: Appuntamento[];
  magazzino: ProdottoMagazzino[];
}

export default function Dashboard({ movimenti, clienti, appuntamenti, magazzino }: DashboardProps) {
  const entrate = movimenti.filter(m => m.tipo === 'entrata').reduce((a, m) => a + m.importo, 0);
  const uscite = movimenti.filter(m => m.tipo === 'uscita').reduce((a, m) => a + m.importo, 0);
  const utile = entrate - uscite;
  const thisYear = new Date().getFullYear();
  
  const entrateAnno = movimenti
    .filter(m => m.tipo === 'entrata' && m.data?.startsWith(String(thisYear)))
    .reduce((a, m) => a + m.importo, 0);

  const mesiMap: Record<string, number> = {};
  movimenti
    .filter(m => m.tipo === 'entrata' && m.data)
    .forEach(m => {
      const d = new Date(m.data + 'T00:00:00');
      const k = d.getFullYear() + '-' + String(d.getMonth()).padStart(2, '0');
      mesiMap[k] = (mesiMap[k] || 0) + m.importo;
    });
  const mesiKeys = Object.keys(mesiMap).sort().slice(-6);
  const maxVal = Math.max(...mesiKeys.map(k => mesiMap[k]), 1);

  const oggi = new Date().toISOString().split('T')[0];
  const appuntamentiOggi = appuntamenti.filter(a => a.data === oggi);
  const scorteCritiche = magazzino.filter(p => p.giacenza <= p.scortaMinima).length;

  return (
    <div>
      <div className="section-header">
        <h2>Dashboard Centro</h2>
        <span className="date-badge">
          {new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Incassi totali</div>
          <div className="metric-value c-green">€{fmt(entrate)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Uscite totali</div>
          <div className="metric-value c-red">€{fmt(uscite)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Utile netto</div>
          <div className="metric-value" style={{ color: utile >= 0 ? 'var(--green)' : 'var(--red)' }}>
            €{fmt(utile)}
          </div>
        </div>
        <div className="metric">
          <div className="metric-label">Fatturato {thisYear}</div>
          <div className="metric-value c-blue">€{fmt(entrateAnno)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Clienti totali</div>
          <div className="metric-value c-purple">{clienti.length}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Scorte sotto soglia</div>
          <div className="metric-value c-yellow">{scorteCritiche}</div>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">
            <i className="ti ti-chart-bar" />
            Andamento Incassi Mensili
          </div>
          {mesiKeys.length ? (
            <div className="bar-chart">
              {mesiKeys.map(k => {
                const [, m] = k.split('-');
                const pct = Math.round((mesiMap[k] / maxVal) * 100);
                return (
                  <div className="bar-row" key={k}>
                    <span className="bar-label">{MESI[parseInt(m)]}</span>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: pct + '%' }}>
                        €{fmt(mesiMap[k])}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty">
              <i className="ti ti-chart-bar" />
              <p>Registra incassi per visualizzare il grafico</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">
            <i className="ti ti-calendar-event" />
            Appuntamenti di Oggi
          </div>
          {appuntamentiOggi.length ? (
            appuntamentiOggi.map(a => {
              const cl = clienti.find(c => c.id === a.clienteId);
              return (
                <div className="activity-item" key={a.id}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.titolo}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                      {a.ora} · {cl?.nome || 'Cliente esterno'} ({a.operatore})
                    </div>
                  </div>
                  <span className="badge blue">{a.stato}</span>
                </div>
              );
            })
          ) : (
            <div className="empty">
              <i className="ti ti-calendar-off" />
              <p>Nessun appuntamento per oggi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}