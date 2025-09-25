import { Elysia } from "elysia";
import {todoRoute} from "./routes/todoRoutes";
import { metricMiddleware, healthCheck, trackUserData, performanceMetrics } from "./telemetry/todotelemetry";
import { opentelemetry } from "@elysiajs/opentelemetry";

// Create app instance without listening
const app = new Elysia()
  .use(opentelemetry())
  .use(metricMiddleware)
  .use(todoRoute)
  .get("/health", healthCheck)
  .get("/useranalytics", trackUserData)
  .get("/performance", performanceMetrics);

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  try {
    // Convert Vercel request to Web API Request
    const url = `https://${req.headers.host}${req.url}`;
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    const response = await app.handle(request);
    
    // Convert response
    const data = await response.text();
    res.status(response.status);
    
    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    res.send(data);
  } catch (error) {
    console.error('Handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Internal server error', details: errorMessage });
  }
}