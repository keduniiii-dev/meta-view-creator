import type { IncomingMessage } from "http";

export async function parseJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  if ((req as IncomingMessage & { body?: unknown }).body) {
    return (req as IncomingMessage & { body?: Record<string, unknown> }).body as Record<string, unknown>;
  }

  if (req.readableEnded || (req as IncomingMessage & { complete?: boolean }).complete) {
    return {};
  }

  return new Promise((resolve) => {
    let body = "";

    req.setEncoding?.("utf8");
    req.on("data", (chunk: string | Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body) as Record<string, unknown>);
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}
