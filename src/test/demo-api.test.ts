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
      industry: "Construction",
    }));
    req.end();

    await promise;

    expect(res.statusCode).toBe(201);
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
      industry: "Construction",
    }));
    req.end();

    await promise;

    expect(res.statusCode).toBe(201);
    expect(res.body).toContain('"success":true');
  });

it("requires only the booking name and work email", async () => {
    const req = new PassThrough() as any;
    req.method = "POST";
    const res = new MockResponse() as any;

    await handleDemoSubmit(req, res, {
      fullName: "Test User",
      workEmail: "test@example.com",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toContain('"success":true');
  });

  it("defaults confirmation emailing on, so the backend emails the client address", async () => {
    const res = new MockResponse() as any;
    await handleDemoSubmit({ method: "POST" } as any, res, {
      fullName: "Test User",
      workEmail: "client@example.com",
      confirmationEmail: true,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toContain('"confirmationEmail":true');
    expect(res.body).toContain('"workEmail":"client@example.com"');
  });

  it("returns a VALIDATION_ERROR with fields for missing inputs", async () => {
    const res = new MockResponse();
    await handleDemoSubmit({ method: "POST" } as unknown as import("http").IncomingMessage, res as unknown as import("http").ServerResponse, {
      fullName: "Test User",
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body as string);
    expect(body.error).toBe("VALIDATION_ERROR");
    expect(body.fields).toEqual([{ path: "workEmail", message: "Enter your work email." }]);
    expect(body.message).toBe("Please review the highlighted fields.");
  });
});
