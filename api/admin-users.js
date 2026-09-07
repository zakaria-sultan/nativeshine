import { handleAdminUsers } from "./adminUsersCore.js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);
    res.statusCode = 204;
    return res.end();
  }

  try {
    const result = await handleAdminUsers({
      method: req.method,
      body: req.body,
      authHeader: req.headers.authorization || "",
      env: process.env,
    });
    return json(res, result.status, result.body);
  } catch (err) {
    return json(res, 500, {
      error: err instanceof Error ? err.message : "Server error",
    });
  }
}
