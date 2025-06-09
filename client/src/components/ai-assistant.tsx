import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Bot, Brain, MessageSquare, TrendingUp, Calendar as CalendarIcon2, Loader2 } from 'lucide-react';
import { AIService, type ProgressAnalysis, type ReflectionSummary } from '@/lib/ai-service';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  className?: string;
}

type AnalysisType = 'progress' | 'reflections' | 'question';

export function AIAssistant({ className = '' }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<AnalysisType>('progress');
  const [isLoading, setIsLoading] = useState(false);
  const [progressAnalysis, setProgressAnalysis] = useState<ProgressAnalysis | null>(null);
  const [reflectionSummary, setReflectionSummary] = useState<ReflectionSummary | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Progress analysis state
  const [progressPeriod, setProgressPeriod] = useState<number>(7);
  
  // Reflection summary state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // Question state
  const [question, setQuestion] = useState<string>('');

  const handleProgressAnalysis = async () => {
    setIsLoading(true);
    setError('');
    try {
      const analysis = await AIService.analyzeProgress(progressPeriod);
      setProgressAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflectionSummary = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const summary = await AIService.summarizeReflections(startDate, endDate);
      setReflectionSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize reflections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const answer = await AIService.askQuestion(question);
      setQuestionAnswer(answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process question');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setProgressAnalysis(null);
    setReflectionSummary(null);
    setQuestionAnswer('');
    setError('');
  };

  return (
    <Card className={`w-full flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold">AI Assistant</span>
        </CardTitle>
        
        {/* Tab Selection */}
        <div className="flex gap-1 mt-2">
          <Button
            variant={activeTab === 'progress' ? "default" : "outline"}
            size="sm"
            onClick={() => { setActiveTab('progress'); clearResults(); }}
            className="text-xs px-3 py-1 h-7"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Progress
          </Button>
          <Button
            variant={activeTab === 'reflections' ? "default" : "outline"}
            size="sm"
            onClick={() => { setActiveTab('reflections'); clearResults(); }}
            className="text-xs px-3 py-1 h-7"
          >
            <Brain className="w-3 h-3 mr-1" />
            Reflections
          </Button>
          <Button
            variant={activeTab === 'question' ? "default" : "outline"}
            size="sm"
            onClick={() => { setActiveTab('question'); clearResults(); }}
            className="text-xs px-3 py-1 h-7"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Ask AI
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
        {/* Progress Analysis Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Period:</span>
              <div className="flex gap-1">
                {[3, 7, 14, 30].map((days) => (
                  <Button
                    key={days}
                    variant={progressPeriod === days ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProgressPeriod(days)}
                    className="text-xs px-2 py-1 h-6"
                  >
                    {days}d
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleProgressAnalysis} 
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze My Progress'
              )}
            </Button>

            {progressAnalysis && (
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Overall Progress</h4>
                  <p className="text-gray-600">{progressAnalysis.overallProgress}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Strengths</h4>
                  <div className="flex flex-wrap gap-1">
                    {progressAnalysis.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Areas for Improvement</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {progressAnalysis.areasForImprovement.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Suggestions</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {progressAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-blue-800 font-medium">{progressAnalysis.motivationalMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reflection Summary Tab */}
        {activeTab === 'reflections' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium block mb-1">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs h-8",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {startDate ? format(startDate, "MM/dd") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs h-8",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {endDate ? format(endDate, "MM/dd") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Button 
              onClick={handleReflectionSummary} 
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Summarizing...
                </>
              ) : (
                'Summarize Reflections'
              )}
            </Button>

            {reflectionSummary && (
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Period: {reflectionSummary.period}</h4>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Key Themes</h4>
                  <div className="flex flex-wrap gap-1">
                    {reflectionSummary.keyThemes.map((theme, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Emotional Trends</h4>
                  <p className="text-gray-600">{reflectionSummary.emotionalTrends}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Key Insights</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {reflectionSummary.insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Recommendations</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {reflectionSummary.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ask Question Tab */}
        {activeTab === 'question' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Ask me anything about your habits:</label>
              <Textarea
                placeholder="e.g., How can I improve my consistency? What patterns do you see in my progress?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>
            
            <Button 
              onClick={handleAskQuestion} 
              disabled={isLoading || !question.trim()}
              className="w-full"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Ask AI'
              )}
            </Button>

            {questionAnswer && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <h4 className="font-medium mb-2">AI Response:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{questionAnswer}</p>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}