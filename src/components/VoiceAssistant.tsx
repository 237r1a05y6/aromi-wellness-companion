import { useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, X, Bot, Volume2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export function VoiceAssistant() {
  const { user, profile } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice not supported in this browser');
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      sendToAI(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); toast.error('Voice recognition failed'); };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setResponse('');
    setTranscript('');
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const sendToAI = async (text: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          profile: profile ? {
            name: profile.name, age: profile.age, fitness_level: profile.fitness_level,
            health_goal: profile.health_goal, diet_preference: profile.diet_preference,
            weight: profile.weight, height: profile.height,
          } : null,
        }),
      });

      if (!resp.ok) throw new Error('Failed');

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';
      let buffer = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { full += content; setResponse(full); }
          } catch {}
        }
      }

      // Speak the response
      if (full) {
        const plain = full.replace(/#{1,6}\s+/g, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/[|`]/g, '');
        const utterance = new SpeechSynthesisUtterance(plain);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-20 lg:bottom-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform animate-pulse"
        aria-label="Voice Assistant"
      >
        <Mic className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-20 lg:bottom-6 z-50 w-80 max-h-[70vh]">
      <Card className="shadow-2xl border-primary/20 overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-semibold font-['Space_Grotesk']">AroMi Voice</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => { setOpen(false); window.speechSynthesis.cancel(); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
          {!transcript && !response && !listening && !loading && (
            <p className="text-sm text-muted-foreground text-center py-4">Tap the mic to ask AroMi anything about health & fitness</p>
          )}
          {transcript && (
            <div className="bg-primary/10 rounded-lg p-2.5 text-sm">
              <span className="text-xs text-muted-foreground block mb-1">You said:</span>
              {transcript}
            </div>
          )}
          {loading && !response && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          )}
          {response && (
            <div className="bg-secondary rounded-lg p-2.5 text-sm prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border flex justify-center">
          <button
            onClick={listening ? stopListening : startListening}
            disabled={loading}
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
              listening
                ? 'bg-destructive text-destructive-foreground animate-pulse scale-110'
                : 'bg-primary text-primary-foreground hover:scale-105'
            } disabled:opacity-50`}
          >
            {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
        </div>
      </Card>
    </div>
  );
}
