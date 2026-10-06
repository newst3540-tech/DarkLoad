# DarkLoad full-stack structure

```text
darkload-fullstack/
├── src/                  # React frontend
├── public/
├── .github/workflows/    # GitHub Pages deployment
├── server/               # Express API
│   ├── src/server.js
│   ├── .env.example
│   └── package.json
├── src/api.js            # frontend API client
└── package.json
```

## Local development

Terminal 1:
```bash
npm install
npm run dev
```

Terminal 2:
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:8787

Set `VITE_API_BASE_URL` in a frontend `.env` when your API is hosted elsewhere.

## Production architecture

GitHub Pages → React frontend → HTTPS API → Queue/Worker → Authorized media provider → Object storage → short-lived signed URL

GitHub Pages cannot run the backend.
