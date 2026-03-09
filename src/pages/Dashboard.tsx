import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Dumbbell, Droplets, Flame, TrendingUp, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { profile, user } = useAuthStore();
  const [latestAssessment, setLatestAssessment] = useState<any>(null);
  const [todayProgress, setTodayProgress] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('health_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => { if (data?.[0]) setLatestAssessment(data[0]); });

    supabase
      .from('progress_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .limit(1)
      .then(({ data }) => { if (data?.[0]) setTodayProgress(data[0]); });
  }, [user]);

  const wellnessScore = latestAssessment?.wellness_score ?? null;

  const stats = [
    {
      label: 'Wellness Score',
      value: wellnessScore !== null ? `${wellnessScore}/100` : '—',
      icon: Heart,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Calories Today',
      value: todayProgress?.calories_consumed ? `${todayProgress.calories_consumed} kcal` : '—',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Water Intake',
      value: todayProgress?.water_ml ? `${todayProgress.water_ml} ml` : '—',
      icon: Droplets,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Workouts Done',
      value: todayProgress?.workouts_completed ?? '—',
      icon: Dumbbell,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Sleep',
      value: todayProgress?.sleep_hours ? `${todayProgress.sleep_hours} hrs` : '—',
      icon: Moon,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Weight',
      value: todayProgress?.weight ? `${todayProgress.weight} kg` : (profile?.weight ? `${profile.weight} kg` : '—'),
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">
          Welcome{profile?.name ? `, ${profile.name}` : ''} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your wellness overview for today</p>
      </div>

      {/* Wellness Score Banner */}
      {wellnessScore !== null && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="py-6 flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full border-4 border-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{wellnessScore}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold font-['Space_Grotesk']">Wellness Score</h2>
              <p className="text-sm text-muted-foreground">
                {wellnessScore >= 80 ? 'Excellent! Keep it up!' : wellnessScore >= 60 ? 'Good progress, room for improvement.' : 'Let\'s work on improving your health!'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!wellnessScore && (
        <Card className="border-dashed border-2 border-primary/30">
          <CardContent className="py-8 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">Take Your Health Assessment</h2>
            <p className="text-sm text-muted-foreground mb-4">Get your personalized wellness score and AI health analysis</p>
            <Link to="/health-assessment">
              <Button>Start Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-lg font-bold font-['Space_Grotesk']">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold font-['Space_Grotesk'] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/workout-planner', label: 'Generate Workout', icon: Dumbbell },
            { to: '/meal-planner', label: 'Plan Meals', icon: Flame },
            { to: '/food-scanner', label: 'Scan Food', icon: Heart },
            { to: '/ai-coach', label: 'Ask AroMi', icon: TrendingUp },
          ].map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <action.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{action.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
