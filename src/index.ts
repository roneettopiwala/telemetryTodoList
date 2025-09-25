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
  
export default async function handler(req: any, res: any) {
    try {
      const response = await app.handle(new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' ? req.body : undefined
      }));
      
      const data = await response.text();
      res.status(response.status).send(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
