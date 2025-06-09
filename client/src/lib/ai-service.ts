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
      // Gather habit data
      const habits = HabitStorage.getHabits();
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (period - 1));
      
      const completionData = HabitStorage.getCompletionRateForDateRange(startDate, endDate);
      const reflections = HabitStorage.getDailyNotes().filter(note => {
        const noteDate = new Date(note.date);
        return noteDate >= startDate && noteDate <= endDate;
      });

      const requestData = {
        habits,
        completionData,
        reflections,
        period
      };

      const response = await apiRequest({
        url: '/api/ai/analyze-progress',
        method: 'POST',
        body: requestData
      });

      return response as ProgressAnalysis;
    } catch (error) {
      console.error('Error analyzing progress:', error);
      throw new Error('Failed to analyze progress. Please try again.');
    }
  }

  static async summarizeReflections(startDate: Date, endDate: Date): Promise<ReflectionSummary> {
    try {
      const reflections = HabitStorage.getDailyNotes().filter(note => {
        const noteDate = new Date(note.date);
        return noteDate >= startDate && noteDate <= endDate;
      });

      if (reflections.length === 0) {
        throw new Error('No reflections found for the selected period.');
      }

      const requestData = {
        reflections,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      const response = await apiRequest({
        url: '/api/ai/summarize-reflections',
        method: 'POST',
        body: requestData
      });

      return response as ReflectionSummary;
    } catch (error) {
      console.error('Error summarizing reflections:', error);
      throw new Error('Failed to summarize reflections. Please try again.');
    }
  }

  static async askQuestion(question: string, context?: string): Promise<string> {
    try {
      // Gather current context
      const habits = HabitStorage.getHabits();
      const recentReflections = HabitStorage.getDailyNotes().slice(-7); // Last 7 reflections
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6); // Last 7 days
      const recentData = HabitStorage.getCompletionRateForDateRange(startDate, endDate);

      const requestData = {
        question,
        context,
        habits,
        recentReflections,
        recentData
      };

      const response = await apiRequest({
        url: '/api/ai/ask-question',
        method: 'POST',
        body: requestData
      });

      return response.answer || 'Sorry, I could not process your question.';
    } catch (error) {
      console.error('Error processing question:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  }
}