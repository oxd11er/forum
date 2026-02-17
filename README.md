# THE WAY (MVP)

A calm, archival forum for anomalies/patterns/coincidences.

## Stack
- Next.js 14 (App Router) + TypeScript
- Prisma + PostgreSQL
- NextAuth Credentials
- Tailwind CSS
- Yandex Object Storage (S3 compatible)
- Vitest

## Project structure
- `src/app` — routes/pages (App Router)
- `src/components` — UI components
- `src/lib` — server/client utilities, actions, auth, safety logic
- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — seed data
- `docker-compose.yml` — PostgreSQL + app service

## 1) Clone
```bash
git clone <YOUR_REPO_URL> forum
cd forum
```

## 2) Configure env
```bash
cp .env.example .env
```

## 3) Start services
```bash
docker compose up -d db
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Open `http://localhost:3000`.

## Archive Documents section
- Public page: `/archive`
- Discussion page: `/archive/discussion/{id}`
- Endpoints:
  - `POST /archive/discussion/create`
  - `POST /archive/file/upload`
  - `POST /archive/link/add`
  - `GET /archive/discussion/{id}`
  - `GET /archive/discussions`
  - `POST /admin/file/approve`
  - `POST /admin/link/approve`

### Yandex Object Storage vars
- `YANDEX_STORAGE_ENDPOINT`
- `YANDEX_STORAGE_BUCKET`
- `YANDEX_STORAGE_ACCESS_KEY`
- `YANDEX_STORAGE_SECRET_KEY`

Files are uploaded only to Yandex Object Storage (no local file storage in app/container).

## Test accounts (after seed)
- admin@example.local / password123
- field1@example.local / password123
- field2@example.local / password123

## Tests
```bash
npm run test
```

## Windows PowerShell note
If `npm`/`npx` are blocked by execution policy, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Or use `npm.cmd` / `npx.cmd` directly.
