import type { IncomingMessage, ServerResponse } from "http";
import { parseJsonBody } from "../lib/request-body";

export async function handleDemoSubmit(req: IncomingMessage, res: ServerResponse, body?: unknown) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    const parsedBody = body && typeof body === "object" && !Array.isArray(body) && Object.keys(body as Record<string, unknown>).length > 0
      ? body as Record<string, unknown>
      : undefined;
    const payload = parsedBody ?? (await parseJsonBody(req));
    const { fullName, workEmail, company, jobTitle, phone, category } = payload as Record<string, unknown>;
    if (!fullName || !workEmail || !company || !category) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, message: "Missing required fields" }));
      return;
    }
    res.end(JSON.stringify({
      success: true,
      data: { id: `demo-${Date.now()}`, ...payload, created_at: new Date().toISOString() },
    }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}
