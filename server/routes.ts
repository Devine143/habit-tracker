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

  // Habit management routes
  app.get('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habits = await storage.getUserHabits(userId);
      res.json(habits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habit = await storage.createHabit(userId, req.body);
      res.json(habit);
    } catch (error) {
      console.error("Error creating habit:", error);
      res.status(500).json({ message: "Failed to create habit" });
    }
  });

  app.put('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      const updatedHabit = await storage.updateHabit(userId, habitId, req.body);
      if (updatedHabit) {
        res.json(updatedHabit);
      } else {
        res.status(404).json({ message: "Habit not found" });
      }
    } catch (error) {
      console.error("Error updating habit:", error);
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  app.delete('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      await storage.deleteHabit(userId, habitId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Daily notes routes
  app.get('/api/daily-notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notes = await storage.getUserDailyNotes(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching daily notes:", error);
      res.status(500).json({ message: "Failed to fetch daily notes" });
    }
  });

  app.post('/api/daily-notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const note = await storage.saveDailyNote(userId, req.body);
      res.json(note);
    } catch (error) {
      console.error("Error saving daily note:", error);
      res.status(500).json({ message: "Failed to save daily note" });
    }
  });

  // Habit completion routes
  app.get('/api/habit-completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const completions = await storage.getUserHabitCompletions(userId);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching habit completions:", error);
      res.status(500).json({ message: "Failed to fetch habit completions" });
    }
  });

  app.post('/api/habit-completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const completion = await storage.recordHabitCompletion(userId, req.body);
      res.json(completion);
    } catch (error) {
      console.error("Error recording habit completion:", error);
      res.status(500).json({ message: "Failed to record habit completion" });
    }
  });

  // Protected AI Assistant routes
  app.post('/api/ai/analyze-progress', isAuthenticated, analyzeProgress);
  app.post('/api/ai/summarize-reflections', isAuthenticated, summarizeReflections);
  app.post('/api/ai/ask-question', isAuthenticated, askQuestion);

  const httpServer = createServer(app);

  return httpServer;
}
