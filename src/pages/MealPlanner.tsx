import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UtensilsCrossed, Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import ReactMarkdown from 'react-markdown';
import { ContentActions } from '@/components/ContentActions';

export default function MealPlanner() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [form, setForm] = useState({
    calorie_target: '2000',
    diet_preference: 'balanced',
    allergies: '',
    cuisine_preference: 'any',
    plan_days: '7',
  });

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });
  const getPlanText = () => typeof plan === 'string' ? plan : plan?.plan || JSON.stringify(plan);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { ...form, user_id: user.id },
      });
      if (error) throw error;
      setPlan(data);

      await supabase.from('meal_plans').insert({
        user_id: user.id,
        calorie_target: parseInt(form.calorie_target),
        diet_preference: form.diet_preference,
        allergies: form.allergies,
        cuisine_preference: form.cuisine_preference,
        plan: data,
      });

      toast.success('Meal plan generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">AI Meal Planner</h1>
        <p className="text-muted-foreground mt-1">Generate a personalized meal plan with timings & macros</p>
      </div>

      {!plan && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Daily Calorie Target</Label>
                  <Input type="number" value={form.calorie_target} onChange={(e) => update('calorie_target', e.target.value)} min="1000" max="5000" required />
                </div>
                <div className="space-y-2">
                  <Label>Diet Preference</Label>
                  <Select value={form.diet_preference} onValueChange={(v) => update('diet_preference', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Food Allergies (optional)</Label>
                  <Input value={form.allergies} onChange={(e) => update('allergies', e.target.value)} placeholder="e.g. nuts, dairy, gluten" />
                </div>
                <div className="space-y-2">
                  <Label>Cuisine Preference</Label>
                  <Select value={form.cuisine_preference} onValueChange={(v) => update('cuisine_preference', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Plan Duration: {form.plan_days} day{Number(form.plan_days) !== 1 ? 's' : ''}</Label>
                <Slider value={[Number(form.plan_days)]} onValueChange={(v) => update('plan_days', String(v[0]))} min={1} max={30} step={1} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><UtensilsCrossed className="h-4 w-4 mr-2" />Generate {form.plan_days}-Day Meal Plan</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {plan && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ContentActions content={getPlanText()} emailSubject="My AroMi 7-Day Meal Plan" printTargetId="meal-plan-content" />
          </div>
          <Card>
            <CardHeader><CardTitle>Your 7-Day Meal Plan</CardTitle></CardHeader>
            <CardContent id="meal-plan-content" className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{getPlanText()}</ReactMarkdown>
            </CardContent>
          </Card>
          <Button variant="outline" onClick={() => setPlan(null)} className="w-full no-print">Generate New Plan</Button>
        </div>
      )}
    </div>
  );
}
