import { describe, expect, it } from "vitest";
import { PassThrough } from "stream";
import { handleDemoSubmit } from "../api/demo";

class MockResponse {
  statusCode = 200;
  headers: Record<string, string> = {};
  body?: string;

  setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  end(payload?: string) {
    this.body = payload;
  }
}

describe("handleDemoSubmit", () => {
  it("accepts a JSON body streamed from the request", async () => {
    const req = new PassThrough() as any;
    req.method = "POST";

    const res = new MockResponse() as any;
    const promise = handleDemoSubmit(req, res, undefined);

    req.write(JSON.stringify({
      fullName: "Test User",
      workEmail: "test@example.com",
      company: "Acme",
      category: "Construction",
    }));
    req.end();

    await promise;

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('"success":true');
  });

  it("falls back to the request stream when an empty object is supplied", async () => {
    const req = new PassThrough() as any;
    req.method = "POST";

    const res = new MockResponse() as any;
    const promise = handleDemoSubmit(req, res, {});

    req.write(JSON.stringify({
      fullName: "Test User",
      workEmail: "test@example.com",
      company: "Acme",
      category: "Construction",
    }));
    req.end();

    await promise;

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('"success":true');
  });
});
