# Algolytics

Pattern-recognition training for coding interviews — drills, structured study plans, real problem judging, and mock interviews.

## Features

- **Recognition drills** — pattern spotting, signal hunting, duels, gauntlet, decomposition
- **62 coding problems** — mapped to 22 algorithmic patterns
- **25+ judge-supported problems** — Run/Submit in JavaScript or Python
- **24-week Zero to Google journey** — 168-day phased curriculum
- **Mock coding interviews** — 45-min simulation with rubric and history
- **Interview readiness dashboard** — verified solves, pattern mastery, mocks
- **Training code auth** — no email; progress syncs via your code

## Setup

```bash
npm install
cp .env.example .env
# Set AUTH_SECRET to a long random string (required)
# DATABASE_URL="file:dev.db" (relative paths resolve under prisma/)

npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | JWT signing secret (required in production) |
| `DATABASE_URL` | SQLite path, e.g. `file:dev.db` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:migrate` | Run migrations |

## Project structure

```
src/
  app/           # Next.js routes (train, problems, mock, journey, …)
  components/    # UI (CodeEditor, ProblemWorkspace, …)
  data/          # Patterns, problems, drills, journey content
  lib/           # Progress, study plan, code runner, auth
  hooks/         # useUserProgress, useUserStudyPlan
prisma/          # SQLite schema
```

## Deploy to Vercel

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step instructions.

Quick summary:

1. Push repo to GitHub
2. Create a [Turso](https://turso.tech) database and apply migrations (`scripts/apply-turso-migrations.sh`)
3. Import the repo on [Vercel](https://vercel.com/new)
4. Set env vars: `AUTH_SECRET`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
5. Deploy

Python code execution is disabled on Vercel; JavaScript judging works.

## Code execution

JavaScript runs in Node `vm`; Python via `python3` subprocess. Suitable for local/dev use. For public deployment, use an isolated runner (Docker) and rate limits.

## License

Private — all rights reserved.
