import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Target, TrendingUp, Brain, Zap, Users } from 'lucide-react';

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
          </div>
          <Button onClick={handleSignIn} className="bg-purple-600 hover:bg-purple-700">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Better Habits with
            <span className="text-purple-600"> AI Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your daily habits, reflect on your progress, and get personalized AI-powered 
            insights to help you build lasting positive changes in your life.
          </p>
          <Button 
            onClick={handleSignIn}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Easy Habit Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Add and track your daily habits with a simple, intuitive interface. 
                Mark habits complete and build streaks.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Progress Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Visualize your progress with detailed charts and statistics. 
                See completion rates and trends over time.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl">AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get personalized recommendations and insights from our AI assistant 
                to improve your habit-building journey.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our Habit Tracker?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Smart Recommendations</h3>
                  <p className="text-gray-600">
                    Our AI analyzes your patterns and suggests the best times and strategies 
                    for building new habits.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Daily Reflections</h3>
                  <p className="text-gray-600">
                    Write daily reflections and let our AI summarize your emotional 
                    patterns and insights.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">
                    Detailed charts and analytics help you understand your progress 
                    and identify areas for improvement.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personalized Experience</h3>
                  <p className="text-gray-600">
                    Every feature is designed to adapt to your unique habits and 
                    lifestyle preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are building better habits with AI assistance.
          </p>
          <Button 
            onClick={handleSignIn}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
          >
            Start Your Journey Today
          </Button>
        </div>
      </main>
    </div>
  );
}