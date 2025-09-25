import { Elysia } from "elysia";
import {todoRoute} from "./routes/todoRoutes";
import { metricMiddleware, healthCheck, trackUserData, performanceMetrics } from "./telemetry/todotelemetry";
import { opentelemetry } from "@elysiajs/opentelemetry";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = new Elysia()
  .use(opentelemetry())
  .use(metricMiddleware)
  .use(todoRoute)
  .get("/health", healthCheck)
  .get("/useranalytics", trackUserData)
  .get("/performance", performanceMetrics);

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = `https://${req.headers.host}${req.url}`;
    const request = new Request(url, {
      method: req.method || 'GET',
      headers: req.headers as Record<string, string>,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    
    const response = await app.handle(request);
    const data = await response.text();
    
    // Set response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
