import { Elysia } from "elysia";
import {todoRoute} from "./routes/todoRoutes";
import { metricMiddleware, healthCheck, trackUserData, performanceMetrics } from "./telemetry/todotelemetry";
import { opentelemetry } from "@elysiajs/opentelemetry";
const app = new Elysia()
  .use(opentelemetry())
  .use(metricMiddleware)
  .use(todoRoute)
  .get("/health", healthCheck)
  .get("/useranalytics", trackUserData)
  .get("/performance", performanceMetrics)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
