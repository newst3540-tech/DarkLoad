# DarkLoad

DarkLoad is a dark futuristic React/Vite media-processing frontend with a separate Express API scaffold.

## Stack

- React 18
- Vite
- Lucide React
- Express backend scaffold
- GitHub Pages frontend deployment

## Quick start

```bash
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
cp .env.example .env
npm start
```

See [DEPLOY.md](./DEPLOY.md) for GitHub Pages + backend deployment.

## Scope

The backend intentionally does not include YouTube scraping, extraction, DRM bypass, or platform circumvention. Use it for media sources you own or are authorized to process and implement provider integrations that comply with applicable terms and law.
