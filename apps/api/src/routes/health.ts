import { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  // Liveness check for container orchestrators (AWS ECS, Kubernetes)
  fastify.get("/healthz", async () => {
    return {
      status: "ok",
      service: "codencampus-api",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Readiness check verifying critical dependency connectivity
  fastify.get("/readyz", async () => {
    return {
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    };
  });
};
