import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitness_level: 'beginner',
    diet_preference: 'balanced',
    health_goal: '',
    stress_level: '',
    sleep_hours: '',
    water_intake: '',
    bp_status: 'normal',
    diabetes_status: 'none',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        fitness_level: profile.fitness_level || 'beginner',
        diet_preference: profile.diet_preference || 'balanced',
        health_goal: profile.health_goal || '',
        stress_level: profile.stress_level?.toString() || '',
        sleep_hours: profile.sleep_hours?.toString() || '',
        water_intake: profile.water_intake?.toString() || '',
        bp_status: profile.bp_status || 'normal',
        diabetes_status: profile.diabetes_status || 'none',
      });
    }
  }, [profile]);

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
      name: form.name,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      height: form.height ? parseFloat(form.height) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      fitness_level: form.fitness_level,
      diet_preference: form.diet_preference,
      health_goal: form.health_goal || null,
      stress_level: form.stress_level ? parseInt(form.stress_level) : null,
      sleep_hours: form.sleep_hours ? parseFloat(form.sleep_hours) : null,
      water_intake: form.water_intake ? parseFloat(form.water_intake) : null,
      bp_status: form.bp_status,
      diabetes_status: form.diabetes_status,
    }).eq('user_id', user.id);
    setLoading(false);
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
      fetchProfile();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ''} disabled className="opacity-60" />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => update('gender', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input type="number" value={form.height} onChange={(e) => update('height', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
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
                <Label>Diet Preference</Label>
                <Select value={form.diet_preference} onValueChange={(v) => update('diet_preference', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Health Goal</Label>
                <Input value={form.health_goal} onChange={(e) => update('health_goal', e.target.value)} placeholder="e.g. Lose weight, gain muscle" />
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
              <div className="space-y-2">
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
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
