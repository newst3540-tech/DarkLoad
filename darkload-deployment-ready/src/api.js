const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const analyzeMedia = (url) =>
  request("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ url })
  });

export const createDownload = (url, format) =>
  request("/api/download", {
    method: "POST",
    body: JSON.stringify({ url, format })
  });

export const getJob = (jobId) => request(`/api/jobs/${encodeURIComponent(jobId)}`);
