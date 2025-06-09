import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, TrendingUp, Brain, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import type { ProgressAnalysis, ReflectionSummary } from '@/lib/ai-service';

interface AIAssistantModalProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  analysisType: 'progress' | 'reflections' | 'question' | null;
  progressAnalysis: ProgressAnalysis | null;
  reflectionSummary: ReflectionSummary | null;
  questionAnswer: string;
  error: string;
  progressPeriod?: number;
}

export function AIAssistantModal({
  open,
  onClose,
  isLoading,
  analysisType,
  progressAnalysis,
  reflectionSummary,
  questionAnswer,
  error,
  progressPeriod
}: AIAssistantModalProps) {
  const getIcon = () => {
    switch (analysisType) {
      case 'progress':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'reflections':
        return <Brain className="w-5 h-5 text-purple-600" />;
      case 'question':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      default:
        return <Bot className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTitle = () => {
    switch (analysisType) {
      case 'progress':
        return `Progress Analysis (${progressPeriod} days)`;
      case 'reflections':
        return 'Reflection Summary';
      case 'question':
        return 'AI Response';
      default:
        return 'AI Analysis';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">
                  {analysisType === 'progress' && 'Analyzing your progress...'}
                  {analysisType === 'reflections' && 'Summarizing your reflections...'}
                  {analysisType === 'question' && 'Thinking about your question...'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Progress Analysis Results */}
          {progressAnalysis && analysisType === 'progress' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Overall Progress</h3>
                <p className="text-gray-700 leading-relaxed">{progressAnalysis.overallProgress}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Your Strengths</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {progressAnalysis.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-green-100 text-green-800">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {progressAnalysis.areasForImprovement.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-gray-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Actionable Suggestions</h3>
                <ul className="space-y-2">
                  {progressAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">→</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-lg mb-2 text-blue-800">Motivation</h3>
                <p className="text-blue-700 font-medium italic">{progressAnalysis.motivationalMessage}</p>
              </div>
            </div>
          )}

          {/* Reflection Summary Results */}
          {reflectionSummary && analysisType === 'reflections' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{reflectionSummary.period}</span>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Key Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {reflectionSummary.keyThemes.map((theme, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-purple-100 text-purple-800">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Emotional Trends</h3>
                <p className="text-gray-700 leading-relaxed">{reflectionSummary.emotionalTrends}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Key Insights</h3>
                <ul className="space-y-2">
                  {reflectionSummary.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">💡</span>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Recommendations</h3>
                <ul className="space-y-2">
                  {reflectionSummary.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Question Answer Results */}
          {questionAnswer && analysisType === 'question' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-600" />
                  AI Response
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {questionAnswer}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}