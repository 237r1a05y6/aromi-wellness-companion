import { useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Camera, Loader2, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ContentActions } from '@/components/ContentActions';

export default function FoodScanner() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getFullContent = () => {
    if (!result) return '';
    return `# Food Analysis: ${result.food_name || 'Detected Food'}\n\n## Nutrition\n| Nutrient | Amount |\n|---|---|\n| Calories | ${result.calories || '—'} kcal |\n| Protein | ${result.protein || '—'}g |\n| Carbs | ${result.carbs || '—'}g |\n| Fat | ${result.fat || '—'}g |\n\n## Health Advice\n${result.advice || ''}`;
  };

  const handleAnalyze = async () => {
    if (!user || !preview) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { image: preview, user_id: user.id },
      });
      if (error) throw error;
      setResult(data);

      await supabase.from('food_scans').insert({
        user_id: user.id,
        food_name: data.food_name,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        ai_advice: data.advice,
      });

      toast.success('Food analyzed!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to analyze food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">Food Scanner</h1>
        <p className="text-muted-foreground mt-1">Upload a photo to get AI nutrition analysis</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Click to upload a food photo</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <img src={preview} alt="Food preview" className="w-full max-h-64 object-cover rounded-lg" />
              <div className="flex gap-2">
                <Button onClick={handleAnalyze} className="flex-1" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Camera className="h-4 w-4 mr-2" />Analyze Food</>}
                </Button>
                <Button variant="outline" onClick={() => { setPreview(null); setResult(null); }}>Reset</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ContentActions content={getFullContent()} emailSubject={`AroMi Food Analysis: ${result.food_name || 'Food'}`} printTargetId="food-scan-content" />
          </div>
          <div id="food-scan-content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🍽️ {result.food_name || 'Detected Food'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Calories', value: `${result.calories || '—'} kcal`, color: 'text-orange-500' },
                    { label: 'Protein', value: `${result.protein || '—'}g`, color: 'text-blue-500' },
                    { label: 'Carbs', value: `${result.carbs || '—'}g`, color: 'text-yellow-500' },
                    { label: 'Fat', value: `${result.fat || '—'}g`, color: 'text-red-500' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {result.advice && (
              <Card className="mt-4">
                <CardHeader><CardTitle>AI Health Advice</CardTitle></CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{result.advice}</ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
