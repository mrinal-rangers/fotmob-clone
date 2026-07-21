# FotMob Clone

Football data platform — backend + BFF + frontend monorepo.

## Structure

```
FOTMOB-CORE/   — Data API (Express + Prisma + PostgreSQL)
BFF/           — Auth gateway (Google Sign-In + proxy to CORE)
web-ui/        — Vite React admin frontend
```

## Quick Start

```bash
cd FOTMOB-CORE && npm install && npx prisma generate && npm run dev
cd BFF         && npm install && npm run dev
cd web-ui      && npm install && npm run dev
```

FOTMOB-CORE runs on `:4000`, BFF on `:4001`, web-ui on `:5173`.
