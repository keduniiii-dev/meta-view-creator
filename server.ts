import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p: string) => path.resolve(__dirname, p);

const isProduction = process.env.NODE_ENV === "production";
const indexProd = isProduction
  ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
  : "";

async function createServer() {
  const app = express();

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

      // For now, just return the regular HTML without server-side rendering
      // In a full implementation, you would render App here
      const html = indexHtml.replace(`<!--app-html-->`, "");

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      if (!isProduction) {
        vite!.ssrFixStacktrace(e);
      }
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

createServer().then(({ app }) => {
  app.listen(3000, () => {
    console.log("SSR server running at http://localhost:3000");
  });
});
