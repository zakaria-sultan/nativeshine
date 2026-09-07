import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleAdminUsers } from "./api/adminUsersCore.js";

function adminUsersDevApi() {
  return {
    name: "admin-users-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/admin-users")) return next();

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader(
            "Access-Control-Allow-Headers",
            "authorization, content-type",
          );
          res.end();
          return;
        }

        try {
          const env = loadEnv(server.config.mode, process.cwd(), "");
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const raw = Buffer.concat(chunks).toString("utf8");
          let body = {};
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              body = {};
            }
          }

          const result = await handleAdminUsers({
            method: req.method || "POST",
            body,
            authHeader: req.headers.authorization || "",
            env: { ...process.env, ...env },
          });

          res.statusCode = result.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.body));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : "Server error",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), adminUsersDevApi()],
    // Expose nothing sensitive; service role stays server-side only
    define: {
      __APP_ENV__: JSON.stringify(env.NODE_ENV || mode),
    },
  };
});
