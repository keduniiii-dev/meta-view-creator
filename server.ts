import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";
import {
  getPipelineData,
  listBids,
  getBid,
  createBid,
  updateBid,
  deleteBid,
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./src/lib/pipeline";
import { parseJsonBody } from "./src/lib/request-body";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p: string) => path.resolve(__dirname, p);

const isProduction = process.env.NODE_ENV === "production";
const indexProd = isProduction
  ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
  : "";

async function createServer() {
  const app = express();
  app.use(express.json());

  let vite = null;

  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      (await import("compression")).default()
    );
    app.use(
      express.static(resolve("dist/client"), {
        index: false,
      })
    );
  }

  // ── Website API ──────────────────────────────────────

  app.post("/api/demo", async (req, res) => {
    const body = await parseJsonBody(req as any);
    const { fullName, workEmail, company, jobTitle, phone, category } = body as Record<string, unknown>;
    if (!fullName || !workEmail || !company || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    res.json({ success: true, data: { id: `demo-${Date.now()}`, ...body, created_at: new Date().toISOString() } });
  });

  app.get("/api/industries", (_req, res) => {
    res.json({
      success: true,
      data: {
        industries: [
          "Construction",
          "Architecture",
          "Urban Development",
          "Infrastructure",
          "Other",
        ],
      },
    });
  });

  // ── CRM API ──────────────────────────────────────────

  app.get("/api/pipeline", (_req, res) => {
    res.json({ success: true, data: getPipelineData() });
  });

  app.get("/api/bids", (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    res.json({ success: true, data: listBids(page, limit) });
  });

  app.get("/api/bids/:id", (req, res) => {
    const bid = getBid(req.params.id);
    if (!bid) return res.status(404).json({ success: false, message: "Bid not found" });
    res.json({ success: true, data: { bid } });
  });

  app.post("/api/bids", (req, res) => {
    const bid = createBid(req.body);
    res.status(201).json({ success: true, data: { bid } });
  });

  app.patch("/api/bids/:id", (req, res) => {
    const bid = updateBid(req.params.id, req.body);
    if (!bid) return res.status(404).json({ success: false, message: "Bid not found" });
    res.json({ success: true, data: { bid } });
  });

  app.delete("/api/bids/:id", (req, res) => {
    const deleted = deleteBid(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Bid not found" });
    res.json({ success: true, data: null });
  });

  app.get("/api/projects", (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    res.json({ success: true, data: listProjects(page, limit) });
  });

  app.get("/api/projects/:id", (req, res) => {
    const project = getProject(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: { project } });
  });

  app.post("/api/projects", (req, res) => {
    const project = createProject(req.body);
    res.status(201).json({ success: true, data: { project } });
  });

  app.patch("/api/projects/:id", (req, res) => {
    const project = updateProject(req.params.id, req.body);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: { project } });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const deleted = deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: null });
  });

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      let indexHtml = indexProd;
      let render: any;

      if (!isProduction) {
        indexHtml = fs.readFileSync(resolve("index.html"), "utf-8");
        indexHtml = await vite!.transformIndexHtml(url, indexHtml);
        render = (await vite!.ssrLoadModule("/src/entry-server.ts")).render;
      } else {
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const html = indexHtml.replace(`<!--app-html-->`, "");
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      if (!isProduction) {
        vite!.ssrFixStacktrace(e);
        console.error(e.stack);
        res.status(500).end(e.stack);
      } else {
        console.error(e.stack);
        res.status(500).end("Internal Server Error");
      }
    }
  });

  return { app, vite };
}

createServer().then(({ app }) => {
  app.listen(3000, () => {
    console.log("SSR server running at http://localhost:3000");
  });
});
