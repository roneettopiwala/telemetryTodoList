import { Elysia } from "elysia";
import {todoRoute} from "./routes/todoRoutes";
import { metricMiddleware, healthCheck } from "./telemetry/todotelemetry";
import { opentelemetry } from "@elysiajs/opentelemetry";
const app = new Elysia()
  .use(opentelemetry())
  .use(metricMiddleware)
  .use(todoRoute)
  .get("/health", healthCheck)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
