import { buildApp } from "./app.js";
import { env } from "./env.js";

async function startServer() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(
      `🚀 CodeNCampus API Server active on http://${env.HOST}:${env.PORT}`,
    );
    app.log.info(`Environment: ${env.NODE_ENV}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful Shutdown
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(
        `Received ${signal}. Gracefully shutting down CodeNCampus API...`,
      );
      await app.close();
      process.exit(0);
    });
  }
}

startServer();
