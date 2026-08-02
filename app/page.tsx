"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const NFC_ID_JENNY = "04:F3:22:63:35:02:89"; 
  const PIN_TITOLARE = "1978";
  const PIN_JENNY = "2026";

  const handleAccess = (value: string) => {
    const cleanVal = value.trim();

    if (cleanVal === PIN_TITOLARE) {
      sessionStorage.setItem('auth_role', 'titolare');
      router.push('/titolare');
    } else if (cleanVal === NFC_ID_JENNY || cleanVal === PIN_JENNY) {
      sessionStorage.setItem('auth_role', 'jenny');
      router.push('/jenny');
    } else {
      setError(true);
      setInputVal('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAccess(inputVal);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fffcfd 0%, #fff1f4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', padding: 40, textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(219, 39, 119, 0.08)', border: '1px solid #fce7ec', borderRadius: 20 }}>
        
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff1f4', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px auto', boxShadow: '0 0 0 8px #fdf2f8' }}>
          ✨
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#3b2e35', marginBottom: 6 }}>Beauty Hub</h1>
        <p style={{ fontSize: 13, color: '#9b8491', marginBottom: 32, lineHeight: 1.5 }}>
          Gestionale Estetico & Agenda Professionale.<br />Scansiona il Tag NFC o digita il PIN.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="••••••••"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              autoFocus
              style={{ textAlign: 'center', fontSize: 18, letterSpacing: '4px', padding: '14px', borderRadius: 12, border: '1px solid #fce7ec', background: '#ffffff', color: '#3b2e35', width: '100%' }}
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#e11d48', fontWeight: 600, background: '#fff1f2', padding: '8px', borderRadius: 8 }}>
              ⚠️ Codice non riconosciuto o Tag non valido.
            </div>
          )}

          <button type="submit" className="btn primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 14, borderRadius: 12, fontWeight: 600 }}>
            Accedi al Sistema
          </button>
        </form>

        <div style={{ marginTop: 28, fontSize: 11, color: '#9b8491', borderTop: '1px solid #fce7ec', paddingTop: 16 }}>
          Area protetta a doppio livello (Titolare / Operatore)
        </div>
      </div>
    </div>
  );
}