# FotMob Clone

Football data platform — backend + BFF + frontend + mobile app.

## Structure

```
FOTMOB-CORE/   — Data API (Express + Prisma + PostgreSQL)
BFF/           — Auth gateway (Google Sign-In + proxy to CORE)
web-ui/        — Vite React admin frontend
mobile-app/    — React Native (Expo) mobile app (credit: @nickng852)
```

## Credits

The `mobile-app/` is cloned from [nickng852/fotmob-clone](https://github.com/nickng852/fotmob-clone). All credit for the React Native UI goes to the original author.

## Quick Start

```bash
cd FOTMOB-CORE && npm install && npx prisma generate && npm run dev
cd BFF         && npm install && npm run dev
cd web-ui      && npm install && npm run dev
cd mobile-app  && npm install && npx expo start
```

FOTMOB-CORE runs on `:4000`, BFF on `:4001`, web-ui on `:5173`.
