"use client";
import React from 'react';
import { Section } from '@/types';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ti-home' },
  { id: 'finanze', label: 'Cassa & Finanze', icon: 'ti-wallet' },
  { id: 'clienti', label: 'Clienti & Schede', icon: 'ti-users' },
  { id: 'agenda', label: 'Agenda Appuntamenti', icon: 'ti-calendar' },
  { id: 'magazzino', label: 'Magazzino & Prodotti', icon: 'ti-box' },
];

interface SidebarProps {
  section: Section;
  setSection: (s: Section) => void;
}

export default function Sidebar({ section, setSection }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <i className="ti ti-sparkles" />
        </div>
        <span>Beauty Hub</span>
      </div>
      <nav className="sidebar-nav">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            className={`nav-item${section === s.id ? ' active' : ''}`}
            onClick={() => setSection(s.id)}
          >
            <i className={`ti ${s.icon}`} />
            <span>{s.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">Gestione Centro Estetico</div>
    </aside>
  );
}