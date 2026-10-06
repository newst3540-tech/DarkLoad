import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import crypto from "node:crypto";
import { z } from "zod";

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
}));
app.use(express.json({ limit: "32kb" }));

const AnalyzeSchema = z.object({
  url: z.string().url().max(2048)
});

const DownloadSchema = z.object({
  url: z.string().url().max(2048),
  format: z.enum(["720p", "1080p", "Audio"])
});

// This allow-list is intentionally conservative.
// Replace it with the sources/providers your service is authorized to process.
const allowedHosts = new Set([
  "example.com",
  "media.example.com"
]);

function assertAllowedSource(rawUrl) {
  const parsed = new URL(rawUrl);
  if (!allowedHosts.has(parsed.hostname)) {
    const error = new Error("Source is not enabled by this server.");
    error.status = 403;
    throw error;
  }
  return parsed;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "darkload-api" });
});

app.post("/api/analyze", (req, res) => {
  const parsed = AnalyzeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A valid URL is required." });
  }

  try {
    const source = assertAllowedSource(parsed.data.url);

    // Provider adapter goes here. Do not scrape or bypass platform protections.
    return res.json({
      id: crypto.randomUUID(),
      title: "Authorized media source",
      duration: null,
      source: source.hostname,
      thumbnail: null,
      formats: ["720p", "1080p", "Audio"]
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.message || "Unable to analyze source."
    });
  }
});

app.post("/api/download", async (req, res) => {
  const parsed = DownloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "URL and a supported format are required." });
  }

  try {
    assertAllowedSource(parsed.data.url);

    // Replace this section with your authorized provider's job API.
    // Return a job ID rather than streaming large files through this API process.
    const jobId = crypto.randomUUID();
    jobs.set(jobId, { createdAt: Date.now() });

    return res.status(202).json({
      jobId,
      status: "queued",
      progress: 0,
      message: "Processing job created. Connect your authorized provider here."
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.message || "Unable to create download job."
    });
  }
});

const jobs = new Map();

app.get("/api/jobs/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });

  const elapsed = Date.now() - job.createdAt;
  const progress = Math.min(100, Math.floor(elapsed / 40));
  const status = progress >= 100 ? "complete" : "processing";

  res.json({
    jobId: req.params.jobId,
    status,
    progress,
    ...(status === "complete" ? { downloadUrl: null } : {})
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`DarkLoad API running on http://localhost:${port}`);
});
