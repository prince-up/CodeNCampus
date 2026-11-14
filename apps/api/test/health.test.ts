import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

describe("Health & Liveness Routes", () => {
  test("GET /healthz returns 200 with service information", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/healthz",
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.status, "ok");
    assert.equal(body.service, "codencampus-api");
    await app.close();
  });

  test("GET /readyz returns 200 with database readiness status", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/readyz",
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.status, "ready");
    assert.equal(body.database, "connected");
    await app.close();
  });
});
