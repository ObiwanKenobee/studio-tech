// src/ai/flows/transcribe-voice-to-text.ts
'use server';

/**
 * @fileOverview Transcribes voice input to text using Genkit and Gemini.
 *
 * - transcribeVoiceToText - A function that transcribes voice input.
 * - TranscribeVoiceToTextInput - The input type for transcribeVoiceToText.
 * - TranscribeVoiceToTextOutput - The output type for transcribeVoiceToText.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeVoiceToTextInputSchema = z.object({
  voiceDataUri: z
    .string()
    .describe(
      'Voice input as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the escaping
    ),
  dialect: z.string().optional().describe('The dialect of the voice input.'),
});
export type TranscribeVoiceToTextInput = z.infer<
  typeof TranscribeVoiceToTextInputSchema
>;

const TranscribeVoiceToTextOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the voice input.'),
});
export type TranscribeVoiceToTextOutput = z.infer<
  typeof TranscribeVoiceToTextOutputSchema
>;

export async function transcribeVoiceToText(
  input: TranscribeVoiceToTextInput
): Promise<TranscribeVoiceToTextOutput> {
  return transcribeVoiceToTextFlow(input);
}

const transcribeVoiceToTextPrompt = ai.definePrompt({
  name: 'transcribeVoiceToTextPrompt',
  input: {schema: TranscribeVoiceToTextInputSchema},
  output: {schema: TranscribeVoiceToTextOutputSchema},
  prompt: `Transcribe the following voice input to text. The dialect is {{{dialect}}}.\n\nVoice: {{media url=voiceDataUri}}`,
});

const transcribeVoiceToTextFlow = ai.defineFlow(
  {
    name: 'transcribeVoiceToTextFlow',
    inputSchema: TranscribeVoiceToTextInputSchema,
    outputSchema: TranscribeVoiceToTextOutputSchema,
  },
  async input => {
    const {output} = await transcribeVoiceToTextPrompt(input);
    return output!;
  }
);
