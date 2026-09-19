import type { IncomingMessage, ServerResponse } from "http";
import { parseJsonBody } from "../lib/request-body";

export async function handleDemoSubmit(req: IncomingMessage, res: ServerResponse, body?: unknown) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    const parsedBody = body && typeof body === "object" && !Array.isArray(body) && Object.keys(body as Record<string, unknown>).length > 0
      ? body as Record<string, unknown>
      : undefined;
    const payload = parsedBody ?? (await parseJsonBody(req));
const { fullName, workEmail, company, jobTitle, phone, industry, confirmationEmail } = payload as Record<string, unknown>;
    const fields: { path: string; message: string }[] = [];
    if (!fullName) fields.push({ path: "fullName", message: "Enter your full name." });
    if (!workEmail) fields.push({ path: "workEmail", message: "Enter your work email." });
    if (fields.length > 0) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, error: "VALIDATION_ERROR", message: "Please review the highlighted fields.", fields }));
      return;
    }
    res.statusCode = 201;
    res.end(JSON.stringify({
      success: true,
      data: { id: `demo-${Date.now()}`, fullName, workEmail, company, jobTitle, phone, industry, confirmationEmail: confirmationEmail !== false, created_at: new Date().toISOString() },
    }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
}
