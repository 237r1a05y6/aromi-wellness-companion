import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Dumbbell, UtensilsCrossed, Camera, TrendingUp, Heart, MessageCircle, Mic } from 'lucide-react';

const features = [
  { icon: Heart, title: 'Health Assessment', desc: 'Get your wellness score with AI-powered health analysis' },
  { icon: Dumbbell, title: 'AI Workouts', desc: 'Personalized 7-day workout plans tailored to your goals' },
  { icon: UtensilsCrossed, title: 'Meal Planning', desc: 'Custom meal plans with macros and recipes' },
  { icon: Camera, title: 'Food Scanner', desc: 'Snap a photo to get instant nutrition breakdown' },
  { icon: MessageCircle, title: 'AI Coach', desc: 'Chat with AroMi for real-time health guidance' },
  { icon: TrendingUp, title: 'Progress Tracking', desc: 'Visualize your fitness journey with beautiful charts' },
  { icon: Mic, title: 'Voice Assistant', desc: 'Talk to AroMi hands-free while working out' },
  { icon: Bot, title: 'Smart Plans', desc: 'Generate 1, 7, or 30-day comprehensive wellness plans' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-['Space_Grotesk']">AroMi AI</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Bot className="h-4 w-4" /> AI-Powered Wellness
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] leading-tight mb-6 text-foreground">
            Your Personal
            <span className="text-primary"> AI Health</span>
            <br />Coach
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Personalized workouts, smart meal plans, food scanning, and real-time coaching — all powered by AI that adapts to your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 h-12">Start Free Today</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 h-12">I Have an Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-center mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            A complete wellness ecosystem powered by cutting-edge AI
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="glass-card rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold font-['Space_Grotesk'] mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold font-['Space_Grotesk']">AroMi AI Agent</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AroMi AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
