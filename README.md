# THE WAY (MVP)

A calm, archival forum for anomalies/patterns/coincidences.

## Stack
- Next.js 14 (App Router) + TypeScript
- Prisma + PostgreSQL
- NextAuth Credentials
- Tailwind CSS
- Vitest

## Project structure
- `src/app` — routes/pages (App Router)
- `src/components` — UI components
- `src/lib` — server/client utilities, actions, auth, safety logic
- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — seed data
- `docker-compose.yml` — PostgreSQL service

## 1) Clone
```bash
git clone <YOUR_REPO_URL> forum
cd forum
```

## 2) Start PostgreSQL (Docker)
```bash
docker compose up -d db
```

## 3) Configure env
```bash
cp .env.example .env
```

## 4) Install and setup DB
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

## 5) Run app
```bash
npm run dev
```
Open `http://localhost:3000`.

## Test accounts (after seed)
- admin@example.local / password123
- field1@example.local / password123
- field2@example.local / password123

## Tests
```bash
npm run test
```

## Notes
- Daily ephemeral thread lifecycle helpers:
  - `runDailyArchivistThread()`
  - `expireEphemeralThreads()`
- For production, execute those with a scheduled worker/cron.

## Windows PowerShell note
If `npm`/`npx` are blocked by execution policy, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Or use `npm.cmd` / `npx.cmd` directly.
