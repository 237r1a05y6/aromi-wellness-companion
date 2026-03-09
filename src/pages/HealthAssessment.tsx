import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Heart, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ContentActions } from '@/components/ContentActions';

export default function HealthAssessment() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    age: '',
    stress_level: '5',
    sleep_hours: '7',
    water_intake: '2',
    diet_type: 'balanced',
    activity_level: 'moderate',
    health_goal: 'maintain',
    bp_status: 'normal',
    diabetes_status: 'none',
  });

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  const getFullContent = () => {
    if (!result) return '';
    const suggestions = Array.isArray(result.suggestions) ? result.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') : '';
    return `# Health Assessment Results\n\n## Wellness Score: ${result.wellness_score}/100\n\n## Analysis\n${result.analysis}\n\n## Suggestions\n${suggestions}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-assessment', {
        body: { ...form, user_id: user.id },
      });
      if (error) throw error;
      setResult(data);

      await supabase.from('health_assessments').insert({
        user_id: user.id,
        age: parseInt(form.age),
        stress_level: parseInt(form.stress_level),
        sleep_hours: parseFloat(form.sleep_hours),
        water_intake: parseFloat(form.water_intake),
        diet_type: form.diet_type,
        activity_level: form.activity_level,
        health_goal: form.health_goal,
        bp_status: form.bp_status,
        diabetes_status: form.diabetes_status,
        wellness_score: data.wellness_score,
        analysis: data.analysis,
        suggestions: data.suggestions,
      });

      await supabase.from('profiles').update({
        age: parseInt(form.age),
        stress_level: parseInt(form.stress_level),
        sleep_hours: parseFloat(form.sleep_hours),
        water_intake: parseFloat(form.water_intake),
        bp_status: form.bp_status,
        diabetes_status: form.diabetes_status,
        health_goal: form.health_goal,
      }).eq('user_id', user.id);

      toast.success('Assessment complete!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate assessment');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-3xl font-bold font-['Space_Grotesk']">Your Health Assessment</h1>
          <ContentActions content={getFullContent()} emailSubject="My AroMi Health Assessment" printTargetId="health-assessment-content" />
        </div>
        <div id="health-assessment-content">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="py-8 text-center">
              <div className="h-24 w-24 rounded-full border-4 border-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">{result.wellness_score}</span>
              </div>
              <h2 className="text-xl font-semibold font-['Space_Grotesk']">Wellness Score</h2>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Analysis</CardTitle></CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{result.analysis}</ReactMarkdown>
            </CardContent>
          </Card>
          {result.suggestions && (
            <Card className="mt-4">
              <CardHeader><CardTitle>Priority Suggestions</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(Array.isArray(result.suggestions) ? result.suggestions : []).map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        <Button variant="outline" onClick={() => setResult(null)} className="w-full no-print">Take Another Assessment</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">Health Assessment</h1>
        <p className="text-muted-foreground mt-1">Answer these questions to get your AI-powered wellness score</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="25" required min="10" max="120" />
              </div>
              <div className="space-y-2">
                <Label>Stress Level (1-10)</Label>
                <Input type="number" value={form.stress_level} onChange={(e) => update('stress_level', e.target.value)} min="1" max="10" required />
              </div>
              <div className="space-y-2">
                <Label>Sleep Hours</Label>
                <Input type="number" step="0.5" value={form.sleep_hours} onChange={(e) => update('sleep_hours', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Water Intake (liters)</Label>
                <Input type="number" step="0.5" value={form.water_intake} onChange={(e) => update('water_intake', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Diet Type</Label>
                <Select value={form.diet_type} onValueChange={(v) => update('diet_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select value={form.activity_level} onValueChange={(v) => update('activity_level', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="active">Very Active</SelectItem>
                    <SelectItem value="athlete">Athlete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Health Goal</Label>
                <Select value={form.health_goal} onValueChange={(v) => update('health_goal', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    <SelectItem value="maintain">Maintain</SelectItem>
                    <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                    <SelectItem value="reduce_stress">Reduce Stress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>BP Status</Label>
                <Select value={form.bp_status} onValueChange={(v) => update('bp_status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Diabetes Status</Label>
                <Select value={form.diabetes_status} onValueChange={(v) => update('diabetes_status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="type1">Type 1</SelectItem>
                    <SelectItem value="type2">Type 2</SelectItem>
                    <SelectItem value="prediabetic">Pre-diabetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : 'Get Wellness Score'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
