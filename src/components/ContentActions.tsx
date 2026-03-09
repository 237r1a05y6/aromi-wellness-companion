import { Button } from '@/components/ui/button';
import { Download, Mail, Copy, Volume2, VolumeX } from 'lucide-react';
import { shareViaEmail, copyToClipboard, downloadAsPDF } from '@/lib/shareUtils';
import { useState, useRef } from 'react';

interface ContentActionsProps {
  content: string;
  emailSubject: string;
  printTargetId: string;
}

export function ContentActions({ content, emailSubject, printTargetId }: ContentActionsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const plain = content.replace(/#{1,6}\s+/g, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/[|`]/g, '');
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => downloadAsPDF(printTargetId)}>
        <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => shareViaEmail(emailSubject, content)}>
        <Mail className="h-3.5 w-3.5 mr-1.5" /> Email
      </Button>
      <Button variant="outline" size="sm" onClick={() => copyToClipboard(content)}>
        <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
      </Button>
      <Button variant="outline" size="sm" onClick={toggleSpeak} className={isSpeaking ? 'text-primary border-primary' : ''}>
        {isSpeaking ? <VolumeX className="h-3.5 w-3.5 mr-1.5" /> : <Volume2 className="h-3.5 w-3.5 mr-1.5" />}
        {isSpeaking ? 'Stop' : 'Read'}
      </Button>
    </div>
  );
}
