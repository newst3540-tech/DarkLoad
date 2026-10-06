# DarkLoad Deployment

DarkLoad is split into two parts:

- **Frontend:** React + Vite, deployed to GitHub Pages.
- **Backend:** Express API, deployed separately on a Node-capable host.

GitHub Pages cannot run the Express backend.

## 1. Push the frontend to GitHub

Create a new repository, then from the project folder:

```bash
git init
git add .
git commit -m "Initial DarkLoad release"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## 2. Enable GitHub Pages

In the repository:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

The included workflow will build `dist/` and publish it automatically whenever `main` changes.

## 3. Deploy the backend

Use any Node.js hosting provider that supports an Express web service.

Backend start command:

```bash
npm start
```

The backend lives in `server/`.

Required backend environment variables:

```env
PORT=8787
FRONTEND_ORIGIN=https://YOUR_GITHUB_USERNAME.github.io
```

If your repository is a project site, the frontend URL is usually:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY/
```

Set `FRONTEND_ORIGIN` to the exact browser origin expected by your CORS configuration.

## 4. Connect the frontend to the backend

After the backend is deployed, copy its HTTPS URL.

In GitHub:

**Settings → Secrets and variables → Actions → Variables → New repository variable**

Create:

```text
Name: VITE_API_BASE_URL
Value: https://YOUR-BACKEND-DOMAIN
```

Do not put private backend secrets in `VITE_*` variables. Vite exposes `VITE_*` values to browser code.

Push a new commit or manually run the GitHub Actions workflow. The frontend will be built with the backend URL.

## 5. Local development

Frontend:

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

For local frontend development, use:

```env
VITE_API_BASE_URL=http://localhost:8787
```

## Important production notes

The included backend is a safe scaffold. It does **not** implement YouTube scraping, extraction, DRM bypass, or platform circumvention.

For authorized media sources, implement a provider adapter that follows the source's terms and your rights to the media. A production system should also add authentication/rate limits, a queue/worker for long jobs, persistent job storage, signed/expiring download URLs, input validation/SSRF protection, logging, and cleanup of temporary files.
