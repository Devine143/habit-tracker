import OpenAI from "openai";
import { Request, Response } from "express";
import type { Habit, DailyNote } from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

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

export async function analyzeProgress(req: Request, res: Response) {
  try {
    const { habits, completionData, reflections, period } = req.body;

    const prompt = `
Analyze the following habit tracking data and provide insights:

HABITS:
${habits.map((h: Habit) => `- ${h.name} (created: ${h.createdDate})`).join('\n')}

COMPLETION DATA (last ${period} days):
${completionData.map((d: any) => `${d.date}: ${d.completed}/${d.total} habits (${d.rate}%)`).join('\n')}

DAILY REFLECTIONS:
${reflections.map((r: DailyNote) => `${r.date}: ${r.note}`).join('\n')}

Please provide a JSON response with the following structure:
{
  "overallProgress": "Brief overall assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasForImprovement": ["area 1", "area 2", "area 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "motivationalMessage": "Encouraging message"
}

Focus on patterns, consistency, and actionable insights. Be encouraging but honest.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful habit tracking coach who provides insightful analysis and encouragement. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing progress:', error);
    res.status(500).json({ error: 'Failed to analyze progress' });
  }
}

export async function summarizeReflections(req: Request, res: Response) {
  try {
    const { reflections, startDate, endDate } = req.body;

    const periodStr = `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;

    const prompt = `
Analyze the following daily reflections from ${periodStr}:

REFLECTIONS:
${reflections.map((r: DailyNote) => `${r.date}: ${r.note}`).join('\n\n')}

Please provide a JSON response with the following structure:
{
  "period": "${periodStr}",
  "keyThemes": ["theme 1", "theme 2", "theme 3"],
  "emotionalTrends": "Description of emotional patterns and trends",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Focus on identifying patterns, emotional trends, recurring themes, and actionable insights.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful reflection analyst who identifies patterns and provides meaningful insights. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const summary = JSON.parse(response.choices[0].message.content || '{}');
    res.json(summary);
  } catch (error) {
    console.error('Error summarizing reflections:', error);
    res.status(500).json({ error: 'Failed to summarize reflections' });
  }
}

export async function askQuestion(req: Request, res: Response) {
  try {
    const { question, context, habits, recentReflections, recentData } = req.body;

    const contextPrompt = `
CURRENT HABITS:
${habits.map((h: Habit) => `- ${h.name}`).join('\n')}

RECENT PROGRESS (last 7 days):
${recentData.map((d: any) => `${d.date}: ${d.completed}/${d.total} habits (${d.rate}%)`).join('\n')}

RECENT REFLECTIONS:
${recentReflections.map((r: DailyNote) => `${r.date}: ${r.note}`).join('\n')}

${context ? `ADDITIONAL CONTEXT: ${context}` : ''}

USER QUESTION: ${question}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful habit tracking assistant with access to the user's habit data and reflections. Provide personalized, actionable advice based on their data. Be encouraging and specific."
        },
        {
          role: "user",
          content: contextPrompt
        }
      ],
      temperature: 0.7
    });

    const answer = response.choices[0].message.content || 'Sorry, I could not process your question.';
    res.json({ answer });
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
}