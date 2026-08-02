"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Toast from '@/components/Toast';
import Dashboard from '@/components/Dashboard';
import Finanze from '@/components/Finanze';
import Clienti from '@/components/Clienti';
import Agenda from '@/components/Agenda';
import Magazzino from '@/components/Magazzino';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Movimento, Cliente, Appuntamento, ProdottoMagazzino, Section } from '@/types';

export default function TitolarePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('auth_role');
    if (role !== 'titolare') {
      router.push('/');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const [movimenti, setMovimenti] = useLocalStorage<Movimento[]>('bh_movimenti', []);
  const [clienti, setClienti] = useLocalStorage<Cliente[]>('bh_clienti', []);
  const [appuntamenti, setAppuntamenti] = useLocalStorage<Appuntamento[]>('bh_appuntamenti', []);
  const [magazzino, setMagazzino] = useLocalStorage<ProdottoMagazzino[]>('bh_magazzino', []);

  const [section, setSection] = useState<Section>('dashboard');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toast = (msg: string) => setToastMsg(msg);

  if (!authorized) return null;

  const handleLogout = () => {
    sessionStorage.removeItem('auth_role');
    router.push('/');
  };

  return (
    <div className="layout">
      <Sidebar section={section} setSection={setSection} />
      <main className="main">
        <Topbar section={section} onLogout={handleLogout} />
        <div className="page">
          {section === 'dashboard' && <Dashboard movimenti={movimenti} clienti={clienti} appuntamenti={appuntamenti} magazzino={magazzino} />}
          {section === 'finanze' && <Finanze movimenti={movimenti} setMovimenti={setMovimenti} clienti={clienti} toast={toast} />}
          {section === 'clienti' && <Clienti clienti={clienti} setClienti={setClienti} movimenti={movimenti} toast={toast} />}
          {section === 'agenda' && <Agenda appuntamenti={appuntamenti} setAppuntamenti={setAppuntamenti} clienti={clienti} toast={toast} />}
          {section === 'magazzino' && <Magazzino magazzino={magazzino} setMagazzino={setMagazzino} toast={toast} />}
        </div>
      </main>
      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  );
}