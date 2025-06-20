
"use client";

import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { VoiceInput } from '@/components/VoiceInput';
import { TranscriptionCard } from '@/components/TranscriptionCard';
import { TranslationCard } from '@/components/TranslationCard';
import { CivicScrollCard } from '@/components/CivicScrollCard';
import { ImpactSimulatorCard } from '@/components/ImpactSimulatorCard';
import { PetitionGeneratorCard } from '@/components/PetitionGeneratorCard';
import { ActionProposalCard } from '@/components/ActionProposalCard';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

import { transcribeVoiceToText, type TranscribeVoiceToTextInput, type TranscribeVoiceToTextOutput } from '@/ai/flows/transcribe-voice-to-text';
import { translateTextToStandardLanguage, type TranslateTextToStandardLanguageInput, type TranslateTextToStandardLanguageOutput } from '@/ai/flows/translate-text-to-standard-language';
import { generateCivicScroll, type GenerateCivicScrollInput, type GenerateCivicScrollOutput } from '@/ai/flows/generate-civic-scroll';
import { simulateImpactOfActions, type SimulateImpactOfActionsInput, type SimulateImpactOfActionsOutput } from '@/ai/flows/simulate-impact-of-actions';

export default function CivicScribePage() {
  const { toast } = useToast();

  const [voiceDataUri, setVoiceDataUri] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [civicScroll, setCivicScroll] = useState<string | null>(null);
  const [needsMoreDetailsForScroll, setNeedsMoreDetailsForScroll] = useState(false);
  const [impactSimulationResult, setImpactSimulationResult] = useState<Record<string, string> | null>(null);

  const [isLoading, setIsLoading] = useState({
    voiceProcessing: false,
    transcription: false,
    translation: false,
    scrollGeneration: false,
    impactSimulation: false,
  });

  const handleVoiceRecorded = async (dataUri: string) => {
    setVoiceDataUri(dataUri);
    setTranscribedText(null);
    setTranslatedText(null);
    setCivicScroll(null);
    setNeedsMoreDetailsForScroll(false);
    setIsLoading(prev => ({ ...prev, voiceProcessing: true, transcription: true }));

    try {
      const transcriptionInput: TranscribeVoiceToTextInput = { voiceDataUri: dataUri };
      const transcriptionOutput: TranscribeVoiceToTextOutput = await transcribeVoiceToText(transcriptionInput);
      setTranscribedText(transcriptionOutput.transcription);
      toast({ title: "Success", description: "Voice transcribed." });
      setIsLoading(prev => ({ ...prev, transcription: false, translation: true }));

      // Trigger translation
      const translationInput: TranslateTextToStandardLanguageInput = { text: transcriptionOutput.transcription, targetLanguage: "English" };
      const translationOutput: TranslateTextToStandardLanguageOutput = await translateTextToStandardLanguage(translationInput);
      setTranslatedText(translationOutput.translatedText);
      toast({ title: "Success", description: "Text translated." });
      setIsLoading(prev => ({ ...prev, translation: false, scrollGeneration: true }));

      // Trigger scroll generation
      const scrollInput: GenerateCivicScrollInput = { translatedText: translationOutput.translatedText };
      const scrollOutput: GenerateCivicScrollOutput = await generateCivicScroll(scrollInput);
      setCivicScroll(scrollOutput.civicScroll);
      setNeedsMoreDetailsForScroll(scrollOutput.needsMoreDetails);
      toast({ title: "Success", description: "Civic scroll generated." });
    } catch (error) {
      console.error("AI processing error:", error);
      toast({ variant: "destructive", title: "Error", description: "An error occurred during AI processing. Please try again." });
    } finally {
      setIsLoading(prev => ({ ...prev, voiceProcessing: false, transcription: false, translation: false, scrollGeneration: false }));
    }
  };

  const handleSimulateImpact = async (actionDescription: string, communityClusters: string[]) => {
    setIsLoading(prev => ({ ...prev, impactSimulation: true }));
    setImpactSimulationResult(null);
    try {
      const input: SimulateImpactOfActionsInput = { actionDescription, communityClusters };
      const output: SimulateImpactOfActionsOutput = await simulateImpactOfActions(input);
      setImpactSimulationResult(output.impactSimulation);
      toast({ title: "Success", description: "Impact simulation complete." });
    } catch (error) {
      console.error("Impact simulation error:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to simulate impact. Please try again." });
    } finally {
      setIsLoading(prev => ({ ...prev, impactSimulation: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8">
        <section id="voice-input-section" className="bg-card shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-headline font-semibold mb-4 text-center">Start by Recording Your Voice</h2>
          <p className="text-muted-foreground text-center mb-6">
            Civic Scribe helps you transform your spoken ideas into clear text, translate them, and draft civic documents. Your voice matters in shaping policy.
          </p>
          <VoiceInput onVoiceRecorded={handleVoiceRecorded} isProcessing={isLoading.voiceProcessing} />
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <TranscriptionCard text={transcribedText} isLoading={isLoading.transcription} />
          <TranslationCard text={translatedText} isLoading={isLoading.translation} />
        </div>
        
        { (transcribedText || translatedText || civicScroll || isLoading.scrollGeneration) && (
          <CivicScrollCard
            scrollText={civicScroll}
            needsMoreDetails={needsMoreDetailsForScroll}
            isLoading={isLoading.scrollGeneration}
          />
        )}

        <Separator className="my-8" />

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImpactSimulatorCard
              onSimulateImpact={handleSimulateImpact}
              simulationResult={impactSimulationResult}
              isLoading={isLoading.impactSimulation}
            />
          </div>
         <PetitionGeneratorCard defaultScrollText={civicScroll} />
        </div>
        
        <ActionProposalCard civicScroll={civicScroll} impactResult={impactSimulationResult} />

      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        Civic Scribe &copy; {new Date().getFullYear()} - Empowering Voices for Change.
      </footer>
    </div>
  );
}
