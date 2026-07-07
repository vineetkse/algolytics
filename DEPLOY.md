# Deploy Algolytics to Vercel

## Prerequisites

- [GitHub](https://github.com) account (to connect the repo)
- [Vercel](https://vercel.com) account
- [Turso](https://turso.tech) account (free — persistent database for serverless)

SQLite files do **not** persist on Vercel. Turso provides hosted SQLite-compatible storage.

---

## 1. Push code to GitHub

```bash
git add .
git commit -m "Prepare Algolytics for Vercel deployment"
git remote add origin https://github.com/YOUR_USER/algolytics.git
git push -u origin main
```

---

## 2. Create a Turso database

```bash
# Install CLI: https://docs.turso.tech/cli
turso auth login
turso db create algolytics
turso db show algolytics --url
turso db tokens create algolytics
```

Apply migrations (one-time):

```bash
chmod +x scripts/apply-turso-migrations.sh
TURSO_DB_NAME=algolytics ./scripts/apply-turso-migrations.sh
```

---

## 3. Generate secrets

```bash
openssl rand -base64 32
```

Save the output as `AUTH_SECRET`.

---

## 4. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add **Environment Variables** (Production + Preview):

| Name | Value |
|------|--------|
| `AUTH_SECRET` | output from `openssl rand -base64 32` |
| `TURSO_DATABASE_URL` | `libsql://...` from `turso db show` |
| `TURSO_AUTH_TOKEN` | token from `turso db tokens create` |

5. Click **Deploy**

---

## 5. Deploy from CLI (optional)

```bash
npm i -g vercel
vercel login
vercel link
vercel env add AUTH_SECRET
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel --prod
```

---

## Production notes

| Feature | On Vercel |
|---------|-----------|
| Auth & progress | Works (Turso) |
| JavaScript Run/Submit | Works |
| Python Run/Submit | **Not available** (no `python3` on serverless) |
| Code execution security | Use for training only; not a full sandbox |

---

## Troubleshooting

**Build fails on Prisma** — Ensure `postinstall` runs `prisma generate` (already in `package.json`).

**401 / session errors** — `AUTH_SECRET` must be set in Vercel env vars.

**Database errors** — Confirm Turso migrations were applied and `TURSO_*` vars are correct.

**Stale favicon** — Hard refresh the browser after deploy.
