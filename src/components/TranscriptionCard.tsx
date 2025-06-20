import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from 'lucide-react';

interface TranscriptionCardProps {
  text: string | null;
  isLoading: boolean;
}

export function TranscriptionCard({ text, isLoading }: TranscriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <ScrollText className="mr-2 h-6 w-6 text-primary" />
          Transcription
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[100px]">
        {isLoading ? (
          <p className="text-muted-foreground">Transcribing voice input...</p>
        ) : text ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <p className="text-muted-foreground">Record your voice to see the transcription here.</p>
        )}
      </CardContent>
    </Card>
  );
}
