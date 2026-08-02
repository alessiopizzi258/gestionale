"use client";
import React from 'react';
import { Section } from '@/types';

const TITOLI: Record<Section, string> = {
  dashboard: 'Dashboard',
  finanze: 'Cassa & Finanze',
  clienti: 'Clienti & Schede Viso/Corpo',
  agenda: 'Agenda Appuntamenti',
  magazzino: 'Magazzino & Prodotti',
};

interface TopbarProps {
  section: Section;
  onLogout?: () => void;
}

export default function Topbar({ section, onLogout }: TopbarProps) {
  return (
    <header className="topbar">
      <span className="topbar-title">{TITOLI[section]}</span>
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="date-badge">
          {new Date().toLocaleDateString('it-IT', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        {onLogout && (
          <button className="btn sm ghost" onClick={onLogout} style={{ background: '#fff1f2', color: '#e11d48', borderColor: '#fca5a5' }}>
            <i className="ti ti-lock" /> Blocca Schermo
          </button>
        )}
      </div>
    </header>
  );
}