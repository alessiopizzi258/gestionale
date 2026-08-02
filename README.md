# Business Hub – Gestionale

App Next.js 14 (App Router) + TypeScript per la gestione di finanze, clienti, roadmap progetti e contenuti social di un freelance/agenzia. I dati vengono salvati in `localStorage` nel browser.

## Struttura del progetto

```
app/
  layout.tsx        layout radice: font, metadata, link globali
  page.tsx           pagina principale: gestisce lo stato e la navigazione tra sezioni
  globals.css         tutto lo stile dell'app (design system a variabili CSS)

components/
  Sidebar.tsx         barra laterale di navigazione
  Topbar.tsx           barra superiore con titolo sezione e data
  Modal.tsx             finestra modale generica riutilizzabile
  Toast.tsx              notifica toast generica riutilizzabile
  Dashboard.tsx        sezione "Dashboard" (metriche, grafico fatturato, progetti attivi)
  Finanze.tsx           sezione "Finanze" (entrate/uscite)
  Clienti.tsx            sezione "Clienti"
  Roadmap.tsx           sezione "Roadmap progetti"
  Social.tsx              sezione "Social & Content"

hooks/
  useLocalStorage.ts   hook generico per stato persistito in localStorage

lib/
  utils.ts                funzioni di formattazione condivise (date, valuta, id, ecc.)

types/
  index.ts                interfacce TypeScript condivise (Movimento, Cliente, RoadmapItem, Post, Section)
```

Ogni sezione è un componente indipendente con la propria logica (form, filtri, CRUD); `app/page.tsx` si limita a gestire lo stato condiviso (i quattro array salvati in `localStorage`) e a passarlo ai componenti.

## Avvio in locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Build di produzione

```bash
npm run build
npm run start
```

La build è stata verificata: compila senza errori TypeScript e genera correttamente la pagina statica.

## Note

- I font (Inter, Space Grotesk) e le icone (Tabler Icons) vengono caricati da CDN nel layout; serve una connessione internet nel browser dell'utente finale (non durante la build).
- Tutti i dati (movimenti, clienti, progetti, post) sono salvati solo nel browser dell'utente tramite `localStorage`, sotto le chiavi `bh_movimenti`, `bh_clienti`, `bh_roadmap`, `bh_post`.
