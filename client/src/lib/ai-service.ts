import { HabitStorage } from './habit-storage';
import { apiRequest } from './queryClient';
import type { Habit, DailyNote, HabitCompletion } from '@shared/schema';

export interface ProgressAnalysis {
  overallProgress: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
  motivationalMessage: string;
}

export interface ReflectionSummary {
  period: string;
  keyThemes: string[];
  emotionalTrends: string;
  insights: string[];
  recommendations: string[];
}

export class AIService {
  static async analyzeProgress(period: number = 7): Promise<ProgressAnalysis> {
    try {
      const response = await fetch('/api/ai/analyze-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period })
      });

      if (!response.ok) throw new Error('Failed to analyze progress');
      return await response.json() as ProgressAnalysis;
    } catch (error) {
      console.error('Error analyzing progress:', error);
      throw new Error('Failed to analyze progress. Please try again.');
    }
  }

  static async summarizeReflections(startDate: Date, endDate: Date): Promise<ReflectionSummary> {
    try {
      const response = await fetch('/api/ai/summarize-reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to summarize reflections');
      return await response.json() as ReflectionSummary;
    } catch (error) {
      console.error('Error summarizing reflections:', error);
      throw new Error('Failed to summarize reflections. Please try again.');
    }
  }

  static async askQuestion(question: string, context?: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context })
      });

      if (!response.ok) throw new Error('Failed to process question');
      const result = await response.json();
      return result.answer || 'Sorry, I could not process your question.';
    } catch (error) {
      console.error('Error asking question:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  }
}