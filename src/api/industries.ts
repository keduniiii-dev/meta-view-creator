import type { IncomingMessage, ServerResponse } from "http";

export function handleIndustries(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({
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
  }));
}
