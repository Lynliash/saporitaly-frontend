# 🍝 Saporitaly — Frontend

Interfaccia editoriale della cucina regionale italiana: esplori le ricette per regione, leggi il dettaglio, usi lo **svuotafrigo** e — da admin — gestisci l'archivio.

**Live demo:** <https://saporitaly.vercel.app> · _(placeholder — da sostituire con l'URL Vercel)_
**Backend:** [saporitaly-backend](../saporitaly-backend)

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · TanStack Query · Zustand · React Hook Form + Zod · Axios · pnpm

## Cosa offre

- **Esplora** ricette per regione, ricerca per ingrediente, dettaglio con ingredienti, sostituzioni e passaggi.
- **Svuotafrigo**: scrivi cosa hai e trovi le ricette che puoi fare, sostituti inclusi.
- **Account**: registrazione/login, recensioni, profilo.
- **Admin**: CRUD ricette, ingredienti, alias, regioni e regole di sostituzione; upload immagini.

## Requisiti

- **Node 20+** e **pnpm**
- Il [backend](../saporitaly-backend) avviato (default `http://localhost:8000`)

## Avvio in locale

```bash
pnpm install
cp .env.sample .env.local   # poi riempi i valori
pnpm dev                    # http://localhost:3000
```

### Variabili d'ambiente (`.env.local`)

| Variabile | A cosa serve |
|-----------|--------------|
| `NEXT_PUBLIC_API_URL` | URL del backend (locale: `http://localhost:8000`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name Cloudinary (upload immagini) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset Cloudinary (Signing Mode: Unsigned) |

L'upload immagini (Cloudinary) è opzionale: senza le due variabili puoi sempre incollare un URL. Setup dettagliato in [`src/lib/upload.ts`](src/lib/upload.ts).

## Deploy (Vercel)

1. Importa il repo su Vercel (preset **Next.js**, rilevato in automatico).
2. In _Settings → Environment Variables_ imposta le tre variabili qui sopra (`NEXT_PUBLIC_API_URL` = URL pubblico del backend).
3. Deploy.

### Account di test (dal seed del backend)

| Ruolo | Email | Password |
|-------|-------|----------|
| Admin | `admin@saporitaly.it` | `admin123` |
| Base  | `demo@saporitaly.it`  | `password123` |

## Struttura

```
src
├── app          # pagine (App Router): home, esplora, ricetta, regioni, svuota-frigo, auth, profilo, admin/*
├── components   # UI riutilizzabile (RecipeCard, Navbar, SearchableSelect, ui/* shadcn…)
├── hooks        # data fetching con TanStack Query (useRecipes, usePantry, useIngredients…)
├── lib          # api (axios), types, labels, upload, utils
└── store        # auth (Zustand, persistito)
```
