import type { Plugin } from "vite";
import { handleDemoSubmit } from "./src/api/demo";
import { handleIndustries } from "./src/api/industries";
import { parseJsonBody } from "./src/lib/request-body";

export function websiteApiPlugin(): Plugin {
  return {
    name: "website-api",
    configureServer(server) {
      server.middlewares.use("/api/demo", async (req, res) => {
        const body = req.method === "POST" ? await parseJsonBody(req) : undefined;
        handleDemoSubmit(req, res, body);
      });

      server.middlewares.use("/api/industries", async (req, res) => {
        handleIndustries(req, res);
      });
    },
  };
}
