import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages } from 'lucide-react';

interface TranslationCardProps {
  text: string | null;
  isLoading: boolean;
}

export function TranslationCard({ text, isLoading }: TranslationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <Languages className="mr-2 h-6 w-6 text-primary" />
          Translation (Standard Language)
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[100px]">
        {isLoading ? (
          <p className="text-muted-foreground">Translating text...</p>
        ) : text ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <p className="text-muted-foreground">Translated text will appear here.</p>
        )}
      </CardContent>
    </Card>
  );
}
