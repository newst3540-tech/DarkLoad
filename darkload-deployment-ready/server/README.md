# DarkLoad API

Express API scaffold for an authorized media-processing workflow.

## Run

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## Endpoints

- `GET /api/health`
- `POST /api/analyze`
- `POST /api/download`
- `GET /api/jobs/:jobId`

The source allow-list in `src/server.js` is deliberately limited to example domains. Replace it only with providers/sources you are authorized to process.

For production:
- Put provider credentials only in server environment variables.
- Add authentication and rate limiting.
- Use a queue/worker for long-running jobs.
- Store job state in Redis/Postgres or your provider.
- Return signed, short-lived file URLs rather than exposing storage credentials.
- Apply source-platform terms and copyright requirements.
