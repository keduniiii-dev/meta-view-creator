import type { IncomingMessage, ServerResponse } from "http";
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
} from "../../lib/pipeline";

export function handlePipeline(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: true, data: getPipelineData() }));
}

export function handleBids(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET" && !req.url?.includes("/")) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    res.end(JSON.stringify({ success: true, data: listBids(page, limit) }));
  } else if (req.method === "POST") {
    const bid = createBid(req.body);
    res.statusCode = 201;
    res.end(JSON.stringify({ success: true, data: { bid } }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}

export function handleBidById(req: IncomingMessage, res: ServerResponse, id: string) {
  res.setHeader("Content-Type", "application/json");
  if (!id) {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
    return;
  }
  if (req.method === "GET") {
    const bid = getBid(id);
    if (!bid) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Bid not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { bid } }));
  } else if (req.method === "PATCH") {
    const bid = updateBid(id, req.body);
    if (!bid) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Bid not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { bid } }));
  } else if (req.method === "DELETE") {
    const deleted = deleteBid(id);
    if (!deleted) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Bid not found" })); return; }
    res.end(JSON.stringify({ success: true, data: null }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}

export function handleProjects(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET" && !req.url?.includes("/")) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    res.end(JSON.stringify({ success: true, data: listProjects(page, limit) }));
  } else if (req.method === "POST") {
    const project = createProject(req.body);
    res.statusCode = 201;
    res.end(JSON.stringify({ success: true, data: { project } }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}

export function handleProjectById(req: IncomingMessage, res: ServerResponse, id: string) {
  res.setHeader("Content-Type", "application/json");
  if (!id) {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
    return;
  }
  if (req.method === "GET") {
    const project = getProject(id);
    if (!project) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Project not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { project } }));
  } else if (req.method === "PATCH") {
    const project = updateProject(id, req.body);
    if (!project) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Project not found" })); return; }
    res.end(JSON.stringify({ success: true, data: { project } }));
  } else if (req.method === "DELETE") {
    const deleted = deleteProject(id);
    if (!deleted) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Project not found" })); return; }
    res.end(JSON.stringify({ success: true, data: null }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}
