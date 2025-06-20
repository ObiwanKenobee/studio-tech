
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardList } from 'lucide-react';

interface PetitionGeneratorCardProps {
  defaultScrollText?: string | null;
}

export function PetitionGeneratorCard({ defaultScrollText }: PetitionGeneratorCardProps) {
  const [petitionTitle, setPetitionTitle] = useState('');
  const [petitionBody, setPetitionBody] = useState('');
  const [ethicalTags, setEthicalTags] = useState('');
  const [generatedPetition, setGeneratedPetition] = useState<string | null>(null);

  useEffect(() => {
    if (defaultScrollText) {
      setPetitionBody(defaultScrollText);
    }
  }, [defaultScrollText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just format it as a string. In a real app, this would be more structured.
    const draft = `
Petition Title: ${petitionTitle}

Body:
${petitionBody}

Ethical Tags: ${ethicalTags}
    `;
    setGeneratedPetition(draft.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <ClipboardList className="mr-2 h-6 w-6 text-primary" />
          Governance Petition
        </CardTitle>
        <CardDescription>
          Draft a governance petition based on the generated civic scroll.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="petitionTitle">Petition Title</Label>
            <Input
              id="petitionTitle"
              value={petitionTitle}
              onChange={(e) => setPetitionTitle(e.target.value)}
              placeholder="Enter petition title"
              required
            />
          </div>
          <div>
            <Label htmlFor="petitionBody">Petition Body</Label>
            <Textarea
              id="petitionBody"
              value={petitionBody}
              onChange={(e) => setPetitionBody(e.target.value)}
              placeholder="Enter petition body..."
              required
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="ethicalTags">Ethical Tags (comma-separated)</Label>
            <Input
              id="ethicalTags"
              value={ethicalTags}
              onChange={(e) => setEthicalTags(e.target.value)}
              placeholder="e.g., community-led, sustainability, transparency"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!petitionTitle || !petitionBody}>
            Generate Petition Draft
          </Button>
        </form>

        {generatedPetition ? (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold font-headline">Generated Petition Draft:</h3>
            <pre className="p-3 border rounded-md bg-muted/50 whitespace-pre-wrap text-sm">
              {generatedPetition}
            </pre>
          </div>
        ) : (
          <div className="mt-6">
             <p className="text-sm text-muted-foreground">Your petition draft will appear here once generated.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
