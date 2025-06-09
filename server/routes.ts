import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeProgress, summarizeReflections, askQuestion } from "./ai-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Assistant routes
  app.post('/api/ai/analyze-progress', analyzeProgress);
  app.post('/api/ai/summarize-reflections', summarizeReflections);
  app.post('/api/ai/ask-question', askQuestion);

  const httpServer = createServer(app);

  return httpServer;
}
