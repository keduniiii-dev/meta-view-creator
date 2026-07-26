import type { Plugin } from "vite";
import { handlePipeline, handleBids, handleBidById, handleProjects, handleProjectById } from "./src/crm/api/pipeline";
import { handleLeads, handleLeadById, handleLeadAssign } from "./src/crm/api/leads";
import { handleCampaigns, handleCampaignById } from "./src/crm/api/campaigns";
import { handleAnalytics } from "./src/crm/api/analytics";
import { parseJsonBody } from "./src/lib/request-body";

export function crmApiPlugin(): Plugin {
  return {
    name: "crm-api",
    configureServer(server) {
      server.middlewares.use("/api/pipeline", async (req, res) => {
        handlePipeline(req, res);
      });

      server.middlewares.use("/api/bids", async (req, res) => {
        handleBids(req, res);
      });

      server.middlewares.use("/api/bids/", async (req, res) => {
        const id = req.url?.replace("/", "");
        handleBidById(req, res, id || "");
      });

      server.middlewares.use("/api/projects", async (req, res) => {
        handleProjects(req, res);
      });

      server.middlewares.use("/api/projects/", async (req, res) => {
        const id = req.url?.replace("/", "");
        handleProjectById(req, res, id || "");
      });

      server.middlewares.use("/api/leads", async (req, res) => {
        handleLeads(req, res);
      });

      server.middlewares.use("/api/leads/", async (req, res) => {
        const urlPath = req.url?.replace("/", "") || "";
        if (urlPath === "assign" && req.method === "PATCH") {
          const body = await parseJsonBody(req);
          handleLeadAssign(req, res, body);
          return;
        }
        const id = urlPath.split("/")[0];
        handleLeadById(req, res, id);
      });

      server.middlewares.use("/api/campaigns", async (req, res) => {
        handleCampaigns(req, res);
      });

      server.middlewares.use("/api/campaigns/", async (req, res) => {
        const id = req.url?.replace("/", "");
        handleCampaignById(req, res, id || "");
      });

      server.middlewares.use("/api/analytics", async (req, res) => {
        handleAnalytics(req, res);
      });
    },
  };
}
