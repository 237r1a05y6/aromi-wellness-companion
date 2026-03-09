import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { TrendingUp, Plus } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Progress() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    weight: '',
    calories_consumed: '',
    water_ml: '',
    workouts_completed: '0',
    sleep_hours: '',
  });

  const fetchRecords = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('progress_records')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .limit(30);
    if (data) setRecords(data);
  };

  useEffect(() => { fetchRecords(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('progress_records').insert({
      user_id: user.id,
      weight: form.weight ? parseFloat(form.weight) : null,
      calories_consumed: form.calories_consumed ? parseInt(form.calories_consumed) : null,
      water_ml: form.water_ml ? parseInt(form.water_ml) : null,
      workouts_completed: parseInt(form.workouts_completed),
      sleep_hours: form.sleep_hours ? parseFloat(form.sleep_hours) : null,
    });
    if (error) {
      toast.error('Failed to log progress');
    } else {
      toast.success('Progress logged!');
      setShowForm(false);
      setForm({ weight: '', calories_consumed: '', water_ml: '', workouts_completed: '0', sleep_hours: '' });
      fetchRecords();
    }
  };

  const labels = records.map((r) => new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const chartOpts: any = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'hsl(160, 15%, 88%)' } },
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk']">Progress Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your fitness journey over time</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Log Today
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Calories</Label>
                <Input type="number" value={form.calories_consumed} onChange={(e) => setForm({ ...form, calories_consumed: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Water (ml)</Label>
                <Input type="number" value={form.water_ml} onChange={(e) => setForm({ ...form, water_ml: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Workouts</Label>
                <Input type="number" value={form.workouts_completed} onChange={(e) => setForm({ ...form, workouts_completed: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sleep (hrs)</Label>
                <Input type="number" step="0.5" value={form.sleep_hours} onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })} />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {records.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Weight Trend</CardTitle></CardHeader>
            <CardContent>
              <Line
                data={{
                  labels,
                  datasets: [{
                    data: records.map((r) => r.weight),
                    borderColor: 'hsl(160, 84%, 39%)',
                    backgroundColor: 'hsla(160, 84%, 39%, 0.1)',
                    fill: true,
                    tension: 0.3,
                  }],
                }}
                options={chartOpts}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Calories Consumed</CardTitle></CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels,
                  datasets: [{
                    data: records.map((r) => r.calories_consumed),
                    backgroundColor: 'hsla(40, 90%, 55%, 0.7)',
                    borderRadius: 4,
                  }],
                }}
                options={chartOpts}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Water Intake (ml)</CardTitle></CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels,
                  datasets: [{
                    data: records.map((r) => r.water_ml),
                    backgroundColor: 'hsla(200, 70%, 50%, 0.7)',
                    borderRadius: 4,
                  }],
                }}
                options={chartOpts}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Sleep Hours</CardTitle></CardHeader>
            <CardContent>
              <Line
                data={{
                  labels,
                  datasets: [{
                    data: records.map((r) => r.sleep_hours),
                    borderColor: 'hsl(280, 60%, 55%)',
                    backgroundColor: 'hsla(280, 60%, 55%, 0.1)',
                    fill: true,
                    tension: 0.3,
                  }],
                }}
                options={chartOpts}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No progress data yet. Start logging to see your charts!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
