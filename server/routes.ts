import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeProgress, summarizeReflections, askQuestion } from "./ai-routes";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Protected AI Assistant routes
  app.post('/api/ai/analyze-progress', isAuthenticated, analyzeProgress);
  app.post('/api/ai/summarize-reflections', isAuthenticated, summarizeReflections);
  app.post('/api/ai/ask-question', isAuthenticated, askQuestion);

  const httpServer = createServer(app);

  return httpServer;
}
