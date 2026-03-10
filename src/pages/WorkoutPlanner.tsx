import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Dumbbell, Loader2, Clock, MapPin } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import ReactMarkdown from 'react-markdown';
import { ContentActions } from '@/components/ContentActions';

export default function WorkoutPlanner() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [form, setForm] = useState({
    fitness_goal: 'build_muscle',
    workout_location: 'gym',
    fitness_level: 'intermediate',
    daily_time: '45',
    plan_days: '7',
  });

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });
  const getPlanText = () => typeof plan === 'string' ? plan : plan?.plan || JSON.stringify(plan);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: { ...form, user_id: user.id },
      });
      if (error) throw error;
      setPlan(data);

      await supabase.from('workout_plans').insert({
        user_id: user.id,
        fitness_goal: form.fitness_goal,
        workout_location: form.workout_location,
        fitness_level: form.fitness_level,
        daily_time: parseInt(form.daily_time),
        plan: data,
      });

      toast.success('Workout plan generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">AI Workout Planner</h1>
        <p className="text-muted-foreground mt-1">Generate a personalized 7-day workout plan with structured timings</p>
      </div>

      {!plan && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fitness Goal</Label>
                  <Select value={form.fitness_goal} onValueChange={(v) => update('fitness_goal', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="build_muscle">Build Muscle</SelectItem>
                      <SelectItem value="lose_fat">Lose Fat</SelectItem>
                      <SelectItem value="endurance">Improve Endurance</SelectItem>
                      <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                      <SelectItem value="general_fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Workout Location</Label>
                  <Select value={form.workout_location} onValueChange={(v) => update('workout_location', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fitness Level</Label>
                  <Select value={form.fitness_level} onValueChange={(v) => update('fitness_level', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Daily Time (minutes)</Label>
                  <Input type="number" value={form.daily_time} onChange={(e) => update('daily_time', e.target.value)} min="15" max="120" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Plan Duration: {form.plan_days} day{Number(form.plan_days) !== 1 ? 's' : ''}</Label>
                <Slider value={[Number(form.plan_days)]} onValueChange={(v) => update('plan_days', String(v[0]))} min={1} max={30} step={1} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Dumbbell className="h-4 w-4 mr-2" />Generate 7-Day Plan</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {plan && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {form.workout_location}
              <Clock className="h-4 w-4 ml-2" /> {form.daily_time} min/day
            </div>
            <ContentActions content={getPlanText()} emailSubject="My AroMi 7-Day Workout Plan" printTargetId="workout-plan-content" />
          </div>
          <Card>
            <CardHeader><CardTitle>Your 7-Day Workout Plan</CardTitle></CardHeader>
            <CardContent id="workout-plan-content" className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{getPlanText()}</ReactMarkdown>
            </CardContent>
          </Card>
          <Button variant="outline" onClick={() => setPlan(null)} className="w-full no-print">Generate New Plan</Button>
        </div>
      )}
    </div>
  );
}
