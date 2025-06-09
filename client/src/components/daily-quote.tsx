import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { getDailyQuote, StoicQuote } from '@/lib/stoic-quotes';

interface DailyQuoteProps {
  date?: Date;
  className?: string;
}

export function DailyQuote({ date, className = '' }: DailyQuoteProps) {
  const targetDate = date || new Date();
  const quote: StoicQuote = getDailyQuote(targetDate);

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 text-purple-600">
            <Quote className="w-4 h-4" />
            <span className="text-sm font-medium">Daily Wisdom</span>
          </div>
          
          <blockquote className="relative">
            <div className="text-lg text-purple-600 absolute -top-2 -left-1">"</div>
            <p className="text-sm text-gray-700 italic leading-relaxed pl-4 pr-4">
              {quote.text}
            </p>
            <div className="text-lg text-purple-600 absolute -bottom-2 -right-1">"</div>
          </blockquote>
          
          <div className="text-right">
            <span className="text-xs font-medium text-gray-600">
              — {quote.author}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}