import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle } from 'lucide-react';

interface CivicScrollCardProps {
  scrollText: string | null;
  needsMoreDetails: boolean;
  isLoading: boolean;
}

export function CivicScrollCard({ scrollText, needsMoreDetails, isLoading }: CivicScrollCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          Civic Scroll
        </CardTitle>
        {needsMoreDetails && !isLoading && (
          <CardDescription className="flex items-center text-accent-foreground pt-1">
            <AlertCircle className="mr-1 h-4 w-4 text-accent" />
            Additional details may be required to finalize the scroll.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="min-h-[150px]">
        {isLoading ? (
          <p className="text-muted-foreground">Generating civic scroll...</p>
        ) : scrollText ? (
          <p className="whitespace-pre-wrap">{scrollText}</p>
        ) : (
          <p className="text-muted-foreground">Generated civic scroll or petition will appear here.</p>
        )}
      </CardContent>
    </Card>
  );
}
